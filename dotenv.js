const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
const chalk = require("chalk");
const os = require("os");

const buildEnv = process.env["FSF_START_ENV"];
const envFilePath = path.join(
  fs.realpathSync(process.cwd()),
  getFileName(buildEnv)
);

if (!fs.existsSync(envFilePath)) {
  console.error(chalk.redBright(`Env file not found ${envFilePath}.`));
  process.exit(1);
}

const getEnv = dotenv.config({
  path: envFilePath,
});

if (getEnv.error) {
  console.error(
    chalk.redBright(
      `Something went wrong getting your environment file:${os.EOL}${getEnv.error}.`
    )
  );
  process.exit(1);
}

console.info(chalk.yellow(`Environment file ${envFilePath}`));

function getFileName(buildEnv) {
  return buildEnv ? `.env.${buildEnv}` : ".env";
}
