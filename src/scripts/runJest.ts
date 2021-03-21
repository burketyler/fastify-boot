import fs from "fs";
import chalk from "chalk";
import { run } from "jest";
import path from "path";

const appDir = fs.realpathSync(process.cwd());
const jestConfig = getJestConfigPath();

console.log(chalk.cyan("Running Jest in interactive mode."));
run([
  `--config='${jestConfig}'`,
  "--watchAll",
  `--roots='${appDir}'`,
  `--coverageDirectory='${path.join(appDir, "coverage")}`,
  ...filterArgs(),
]);

function getJestConfigPath(): string {
  return fs.realpathSync(
    path.join(__dirname, "..", "..", "..", "jest.config.js")
  );
}

function filterArgs(): string[] {
  let args = process.argv;
  args = args.slice(3, args.length);
  args.pop();
  return args;
}
