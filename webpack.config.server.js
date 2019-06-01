const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "server.js"),

  output: {
    path: path.resolve(__dirname, "functions"),
    filename: "server.js"
  },

  target: "node"
};
