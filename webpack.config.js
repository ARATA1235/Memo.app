const { Extension } = require("typescript");

module.exports = {
    // ビルドした際の出力先
    output: {
        path: `${__dirname}/dist`,
        filename: "bundle.js"
    },
    // モード指定
    mode: "development",
    // import時のパス指定で拡張子を省略する
    resolve: {
        extensions: ['.ts','.js']
    },
    // 開発用サーバーで起動するバス
    devServer: {
        static: {
            directory: `${__dirname}/dist`,
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
            },
        ],
    },
}