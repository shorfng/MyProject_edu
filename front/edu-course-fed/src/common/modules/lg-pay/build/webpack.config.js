// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const distDir = path.resolve(__dirname, '../dist'); // 编译输出根目录
const entry = path.join(__dirname, '../test/index.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rootDir = path.resolve(__dirname, '../test'); // 工程源码根路径
const apiMocker = require('mocker-api');

module.exports = (env, argv) => {
    const devMode = argv.mode !== 'production'
    return {
        entry: entry,
        output: {
            path: distDir
        },
        devServer: {
            hot: true,
            port: 9000,
            proxy: {
                // https://www.webpackjs.com/configuration/dev-server/#devserver-proxy
            },
            before(app) {
                apiMocker(app, path.resolve(__dirname,'../mock/index.js'))
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins:[
                                "@babel/plugin-transform-runtime",
                                "@babel/plugin-transform-regenerator"
                            ],
                        }
                    },
                    exclude: file => (
                        /node_modules/.test(file) || /lib/.test(file)
                    ),
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
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                filename: path.join(distDir, 'index.html'),
                template: path.join(rootDir, 'index.html'),
                inject: true
            })
        ]
    }
};