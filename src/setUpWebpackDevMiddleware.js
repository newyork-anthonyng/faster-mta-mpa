const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const path = require("path");

function webpackDevMiddleware(expressApp) {
    // @FUTURE: Use configuration from `webpack.config.client.js`
    const compiler = webpack({
        mode: "development",
        entry: {
            main: path.resolve(__dirname, "../src/app.js"),
            home: path.resolve(__dirname, "../src/home.js"),
            realTime: path.resolve(__dirname, "../src/realTime.js"),
            ["service-worker"]: path.resolve(__dirname, "../src/service-worker.js")
        },
        output: {
            path: path.resolve(__dirname),
            filename: "[name].js",
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
                                "@babel/preset-env"
                            ]
                        }
                    }
                }
            ]
        }
    });

    expressApp.use(
        middleware(compiler, {
            writeToDisk: true
        })
    );
}

module.exports = webpackDevMiddleware;