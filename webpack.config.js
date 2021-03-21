const fs = require("fs");
const path = require("path");
const NodeExternals = require("webpack-node-externals");

const appDir = fs.realpathSync(process.cwd());
const bootDir = fs.realpathSync(__dirname);
const appModules = path.join(appDir, "node_modules");
const bootModules = path.join(bootDir, "node_modules");

module.exports = {
  target: "node",
  devtool: "nosources-source-map",
  entry: path.join(appDir, ".build", "bootstrap.js"),
  externals: [
    NodeExternals({
      modulesDir: bootModules,
      additionalModuleDirs: [appModules],
      allowlist: ["ts-injection", "reflect-metadata"],
    }),
  ],
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [".js", ".json", ".ts"],
    modules: [bootModules, appModules],
  },
  resolveLoader: {
    modules: [bootModules, appModules],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  output: {
    path: path.join(appDir, ".build"),
    libraryTarget: "commonjs2",
    filename: "index.js",
    sourceMapFilename: "index.map",
  },
};
