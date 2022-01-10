const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

process.env.NODE_ENV = 'production';

module.exports = {
  entry: {
    vendor: ['vue', 'vuex', 'jquery', 'axios', 'vue-router'],         //将用到的第三方插件添加到vendor中
  },
  output: {
    path: path.resolve(__dirname, '../dll'),
    filename: '[name].[chunkhash].dll.js',
    library: '[name]_lib',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve('./dll', '[name]-manifest.json'),
      name: '[name]_lib',
    }),
    new ProgressBarPlugin(),
    new AssetsPlugin({
      filename: 'dll-config.json',
      path: path.resolve('./dll'),
    }),
  ],
};
