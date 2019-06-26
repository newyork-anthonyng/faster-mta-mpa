const webpack = require("webpack");
const NodemonPlugin = require("nodemon-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = (env = {}) => {
  const OUTPUT_PATH = env.production ? "functions": "dist";

  return {
    mode: "development",

    entry: path.resolve(__dirname, "server.js"),

    output: {
      path: path.resolve(__dirname, OUTPUT_PATH),
      filename: "server.js",
      libraryTarget: "commonjs2"
    },

    module: {
      rules: [
        {
          test: /\.html$/,
          use: "html-loader"
        }
      ]
    },

    plugins: [
      new NodemonPlugin(),
      new CopyPlugin([
        {
          from: path.resolve(__dirname, "src/subway_map.pdf"),
          to: path.resolve(__dirname, `${OUTPUT_PATH}/static/`)
        }
      ]),
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(!!env.production)
      })
    ],

    target: "node",

    node: {
      __dirname: false
    },

    externals: [nodeExternals()]
  };
};
