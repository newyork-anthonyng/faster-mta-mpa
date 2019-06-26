const path = require("path");

module.exports = {
    mode: "production",

    entry: {
        main: path.resolve(__dirname, "./src/app.js"),
        ["service-worker"]: path.resolve(__dirname, "./src/service-worker.js")
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    }
};
