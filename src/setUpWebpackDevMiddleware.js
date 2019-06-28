const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const path = require("path");

function webpackDevMiddleware(expressApp) {
    // @FUTURE: Use configuration from `webpack.config.client.js`
    const compiler = webpack({
        mode: "development",
        entry: {
            main: path.resolve(__dirname, "../src/app.js"),
            ["service-worker"]: path.resolve(__dirname, "../src/service-worker.js")
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].js"
        }
    });

    expressApp.use(
        middleware(compiler)
    );
}

module.exports = webpackDevMiddleware;