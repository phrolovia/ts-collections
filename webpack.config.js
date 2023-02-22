const path = require("path");

module.exports = {
    entry: "./index.ts",
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
        library: {
            name: ["ts-collections"],
            type: "umd"
        },
        filename: "index.js",
        path: path.resolve(__dirname, "dist")
    }
};
