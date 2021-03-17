#!/usr/bin/env node

import spawn from "cross-spawn";

process.on("unhandledRejection", (err) => {
  throw err;
});

const scriptName = process.argv[2];

switch (scriptName) {
  case "build":
    runScript(scriptName);
    break;
  case "start":
    runScript(scriptName);
    break;
  default:
    console.log(`Script ${scriptName} doesn't match any available scripts.`);
}

function runScript(name: string): void {
  const outcome = spawn.sync(
    process.execPath,

    [require.resolve(`../src/scripts/${name}.js`)],
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
