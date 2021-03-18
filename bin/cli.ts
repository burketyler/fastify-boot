#!/usr/bin/env node

import spawn from "cross-spawn";
import yargs, { Arguments } from "yargs";
import chalk from "chalk";

yargs
  .scriptName("fastify-boot-cli")
  .usage("$0 <cmd> [args]")
  .command(
    "build [env]",
    "Compile your code with Webpack into an executable bundle.",
    (args) => {
      args.positional("env", {
        type: "string",
        default: "development",
        describe:
          "The Webpack build mode, to create a production ready bundle use 'production'",
      });
    },
    (args: Arguments<{ env: string }>): void => {
      process.env["FSF_BUILD_ENV"] = args.env;
      runScript([require.resolve(`../src/scripts/build.js`)]);
    }
  )
  .command(
    "start [env]",
    "Start your Fastify server.",
    (args) => {
      args.positional("env", {
        type: "string",
        default: "",
        describe: "The env config variant you want to use. Defaults to .env",
      });
    },
    (args: Arguments<{ env: string }>): void => {
      process.env["FSF_START_ENV"] = args.env;
      runScript([
        "-r",
        require.resolve(`../../dotenv.js`),
        require.resolve(`../src/scripts/start.js`),
      ]);
    }
  )
  .command(
    "test",
    "Run Jest in interactive mode.",
    () => {},
    (args: Arguments<any>): void => {
      const passedArgs: any[] = [];
      Object.entries(args).forEach(([arg, value]) => {
        passedArgs.push(`--${arg}='${value}'`);
      });
      runScript([require.resolve(`../src/scripts/runJest.js`), ...passedArgs]);
    }
  )
  .help().argv;

function runScript(args: string[]): void {
  const outcome = spawn.sync(process.execPath, args, {
    stdio: "inherit",
  });
  if (
    outcome.signal &&
    (outcome.signal === "SIGKILL" || outcome.signal === "SIGTERM")
  ) {
    console.log(
      chalk.redBright(
        "Script failed because the process exited too early. Something may be killing the process."
      )
    );
    process.exit(1);
  }
  process.exit(outcome.status);
}
