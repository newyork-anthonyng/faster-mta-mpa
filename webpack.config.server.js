const NodemonPlugin = require("nodemon-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = {
  mode: "production",

  entry: path.resolve(__dirname, "server.js"),

  output: {
    path: path.resolve(__dirname, "functions"),
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
    new NodemonPlugin()
  ],

  target: "node",

  node: {
    __dirname: false
  },

  externals: [nodeExternals()]
};
