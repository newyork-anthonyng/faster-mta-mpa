const path = require("path");

module.exports = (env = {}) => {
    const OUTPUT_PATH = env.production ? "functions": "dist";

    return {
        mode: "production",

        entry: {
            main: path.resolve(__dirname, "./src/app.js"),
            ["service-worker"]: path.resolve(__dirname, "./src/service-worker.js")
        },

        output: {
            path: path.resolve(__dirname, OUTPUT_PATH),
            filename: "[name].js"
        }
    };
};
