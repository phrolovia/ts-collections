const path = require("path");

module.exports = {
    entry: "./index.ts",
    devtool: "inline-source-map",
    mode: "production",
    module: {
        rules: [
            {
                test: /ts?$/,
                use: {
                    loader: "ts-loader"
                },
                exclude: /node_modules|tests/,

            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        library: "ts-collections",
        libraryTarget: "umd",
        filename: "index.js",
        path: path.resolve(__dirname, "dist")
    }
};
