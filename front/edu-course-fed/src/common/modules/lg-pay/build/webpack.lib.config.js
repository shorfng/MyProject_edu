// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const distDir = path.resolve(__dirname, '../lib'); // 编译输出根目录
const entry = path.join(__dirname, '../src/index.ts');

module.exports = (env, argv) => {
    const devMode = argv.mode !== 'production'
    return {
        entry: entry,
        output: {
            path: distDir,
            library: 'lg-pay',
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            "@babel/plugin-proposal-class-properties"
                        ]
                    },
                    exclude: file => (
                        /node_modules/.test(file)
                    )
                },
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: file => (
                        /node_modules/.test(file) || /lib/.test(file)
                    ),
                },
                {
                    test: /\.less$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        "less-loader"
                    ]
                }
            ]
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        }
    }
};