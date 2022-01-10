const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('./config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const dllConfig = require('../dll/dll-config');

const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true,
            usePostCSS: true
        })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash:7].js'),
        chunkFilename: utils.assetsPath('js/lazy-load/[name].[chunkhash:7].js'),
        publicPath: utils.publicPath(),
        crossOriginLoading: 'anonymous'
    },
    mode: 'production',
    optimization: {
        minimize: true
    },
    plugins: [
        new webpack.ProvidePlugin({
            moment: 'moment',
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[name].[contenthash:8].css',
            ignoreOrder: true
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../src/static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, '../dll'),
                to: path.resolve(__dirname, '../dist/static/js/dll')
            },
            {
                from: path.resolve(__dirname, '../video'),
                to: path.resolve(__dirname, '../dist/static/js/video')
            }
        ]),

        new webpack.DllReferencePlugin({
          manifest: path.join(__dirname, '../dll', 'vendor-manifest.json')
        }),
    ]
});


if (process.env.NODE_ENV === 'analyze') {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

Object.keys(config.entry).forEach((item) => {
    webpackConfig.plugins.push(
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: config.build.addTemplatesPath(item),
            template: path.join(__dirname, '../layout/template.js'),
            templateParameters: {
                html: './src/' + item,
                baseDir: path.join(__dirname, '..'),
                staticUrl: utils.publicPath(),
                dll: dllConfig.vendor.js
            },
            inject: 'body',
            hash: false,
            minify: false,
            // minify: {
            //   removeComments: true,
            //   // collapseWhitespace: true,
            //   // removeAttributeQuotes: true
            //   // more options:
            //   // https://github.com/kangax/html-minifier#options-quick-reference
            // },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunks: [item],
            // add script attributes here!
            attributes: {
                crossorigin: 'anonymous'
            }
        })
    );
});

// //配置srcOrigin来添加crossorigin="anonymous"
webpackConfig.plugins.push(new ScriptExtHtmlWebpackPlugin({
    custom: {
        test: /\.js$/,
        attribute: 'crossorigin',
        value: 'anonymous',
    },
}));

module.exports = webpackConfig;
