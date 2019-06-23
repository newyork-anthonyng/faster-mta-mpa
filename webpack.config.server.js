const NodemonPlugin = require("nodemon-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = {
  mode: "production",

  entry: path.resolve(__dirname, "server.js"),

  output: {
    // path: path.resolve(__dirname, "functions"),
    path: path.resolve(__dirname, "dist"),
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
        to: path.resolve(__dirname, "dist/static/")
      }
    ])
  ],

  target: "node",

  node: {
    __dirname: false
  },

  externals: [nodeExternals()]
};
