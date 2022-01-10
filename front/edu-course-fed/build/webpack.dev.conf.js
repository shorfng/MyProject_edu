
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('./config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dllConfig = require('../dll/dll-config');

const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,
    optimization: {
        minimize: true
    },
    mode: 'development',
    plugins: [
        new webpack.ProvidePlugin({
            moment: 'moment',
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new FriendlyErrorsWebpackPlugin(),
        new ExtraWatchWebpackPlugin({
            files: ['src/**/main.html'],
        }),
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, '../src/static'),
            to: config.build.assetsSubDirectory,
            ignore: ['.*']
          },
          {
            from: path.resolve(__dirname, '../dll'),
            to: path.resolve(__dirname, '../dist/js/dll')
          },
          {
            from: path.resolve(__dirname, '../video'),
            to: path.resolve(__dirname, '../dist/js/video')
          }
        ]),
        new webpack.DllReferencePlugin({
            manifest: path.join(__dirname, '../dll', 'vendor-manifest.json')
        }),
    ]
});

Object.keys(config.entry).forEach((item) => {
    devWebpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            filename: config.dev.addTemplatesPath(item),
            template: path.join(__dirname, '../layout/template.js'),
            templateParameters: {
                html: './src/' + item,
                baseDir: path.join(__dirname, '..'),
                staticUrl: utils.publicPath(),
                dll: dllConfig.vendor.js
            },
            inject: 'body',
            hash: false,
            chunks: [item],
            minify: false,
        }),
    );
});

module.exports = devWebpackConfig;
