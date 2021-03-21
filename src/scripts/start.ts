import fs from "fs";
import chalk from "chalk";
import path from "path";
import { spawnSync } from "child_process";

const appDir = fs.realpathSync(process.cwd());

start();

function start() {
  console.log(chalk.cyan("Starting Fastify server..."));
  const outcome = spawnSync(
    process.execPath,
    [path.join(appDir, ".build", "index.js")],
    {
      stdio: "inherit",
    }
  );
  if (
    outcome.signal &&
    (outcome.signal === "SIGKILL" || outcome.signal === "SIGTERM")
  ) {
    console.log(
      "Script failed because the process exited too early. Something may be killing the process."
    );
    process.exit(1);
  }
  process.exit(outcome.status);
}
