const path = require("path");

module.exports = (env = {}) => {
    const OUTPUT_PATH = env.production ? "functions": "dist";

    return {
        mode: "production",

        entry: {
            main: path.resolve(__dirname, "./src/app.js"),
            home: path.resolve(__dirname, "./src/home.js"),
            ["service-worker"]: path.resolve(__dirname, "./src/service-worker.js")
        },

        output: {
            path: path.resolve(__dirname, OUTPUT_PATH),
            filename: "[name].js"
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        "targets": {
                                            "chrome": 76,
                                            "safari": 12
                                        }
                                    }
                                ]
                            ]
                        }
                    }
                }
            ]
        }
    };
};
