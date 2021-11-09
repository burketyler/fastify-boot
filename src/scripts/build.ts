import fs from "fs";
import path from "path";
import webpack, { MultiStats, Stats, StatsCompilation } from "webpack";
import chalk from "chalk";
import os from "os";
const config = require("../../../webpack.config");

const appDir = fs.realpathSync(process.cwd());
const bootDir = fs.realpathSync(path.join(__dirname, "..", "..", ".."));
const buildEnv = process.env["FSF_BUILD_ENV"];
const webpackMode = buildEnv === "production" ? "production" : "development";

build({ ...config, mode: webpackMode });

function build(config: any): void {
  validateImportantFiles();
  const compiler = webpack(config);
  compiler.hooks.beforeRun.tap("fastify-boot", injectBootstrap);
  compiler.hooks.afterDone.tap("fastify-boot", removeBootstrap);
  console.log(chalk.cyan(`Running Webpack in ${webpackMode} mode...`));
  compiler.run(handleWebpackCb);
}

function injectBootstrap(): void {
  const bootFile = path.join(bootDir, "bootstrap.js");
  const appFile = path.join(appDir, ".build", "bootstrap.js");
  console.log(chalk.gray("Bootstrapping index.ts"));
  makeDirIfNotExist(path.join(appDir, ".build"));
  fs.copyFileSync(bootFile, appFile);
}

function makeDirIfNotExist(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function removeBootstrap(): void {
  try {
    const file = path.join(appDir, ".build", "bootstrap.js");
    if (fs.existsSync(file)) {
      if (fs.rmSync) {
        return fs.rmSync(file);
      }

      fs.unlinkSync(file);
    }
  } catch (error) {
    console.log(
      chalk.yellow(
        "Couldn't delete bootstrap.js, you can delete it manually from your .build folder."
      )
    );
  }
}

function handleWebpackCb(err?: Error, result?: MultiStats | Stats): void {
  if (err) {
    throw err;
  } else {
    if (!result) {
      handleNoResult();
    }
    const stats = result.toJson();
    if (result.hasErrors()) {
      handleWebpackErrors(stats);
    } else if (result.hasWarnings()) {
      handleWebpackWarnings(stats);
    } else {
      handleSuccess(stats);
    }
  }
}

function handleNoResult(): void {
  console.log(
    chalk.red(
      "Something went wrong and we couldn't get any information from Webpack."
    )
  );
  process.exit(1);
}

function handleWebpackErrors(stats: StatsCompilation): void {
  console.log(
    chalk.red(
      `The Typescript compiler threw the following errors while compiling your code:${os.EOL}`
    )
  );
  stats.errors.forEach((compileError) => {
    console.error(compileError.message);
  });
  process.exit(1);
}

function handleWebpackWarnings(stats: StatsCompilation): void {
  console.log(
    chalk.yellow(
      `The following warnings were emitted during the build:${os.EOL}`
    )
  );
  stats.warnings.forEach((warning) => {
    console.warn(warning.message);
  });
}

function handleSuccess(stats: StatsCompilation): void {
  const modules = stats.modules.filter(
    (module) =>
      module.moduleType !== "javascript/dynamic" &&
      module.moduleType !== "runtime"
  );
  modules.slice(5).forEach((module) => {
    console.log(
      "Module: " + chalk.yellow(`${module.name} - ${module.size / 100}kb.`)
    );
  });
  if (modules.length > 5) {
    console.log(chalk.yellow(`... ${modules.length - 5} more`));
  }
  console.log(
    chalk.cyan(
      `Total bundle size: ${
        stats.chunks
          .map((chunk) => chunk.size)
          .reduce((prev, next) => prev + next, 0) / 100
      }kb.`
    )
  );
  console.log(chalk.green("Webpack build completed successfully."));
}

function validateImportantFiles(): void {
  throwIfDoesntExist(
    path.join(appDir, "tsconfig.json"),
    `A valid tsconfig is required in your project's root directory: ${appDir}`
  );
  throwIfDoesntExist(
    path.join(appDir, "src", "index.ts"),
    chalk.redBright(
      `Missing required file ${path.join(appDir, "src", "index.ts")}`
    )
  );
}

function throwIfDoesntExist(path: string, message: string): void {
  if (!fs.existsSync(path)) {
    throw new Error(message);
  }
}
