const path = require('path');
const utils = require('./utils');
const config = require('./config');
const isWsl = require('is-wsl');
const vueLoaderConfig = require('./vue-loader.conf');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production';
const staticTable = config[isProd ? 'build' : 'dev'];

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = entry => ({
    context: path.resolve(__dirname, '../'),
    entry,
    output: {
        path: staticTable.assetsRoot,
        filename: '[name].js',
        publicPath: staticTable.assetsPublicPath,
        chunkFilename: 'lazy-load/[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            '@assets': resolve('src/assets'),
            '@less': resolve('src/common/css'),
            '@js': resolve('src/common/js'),
            '@icon-font': resolve('src/common/icon-font'),
            '@components': resolve('src/common/components'),
            '@service': resolve('src/common/service'),
            '@nodeModules': resolve('src/common/modules')
        }
    },
    cache: true,
    module: {
        rules: [
            // ...(config.dev.useEslint ? [{
            //     test: /\.(js|vue)$/,
            //     loader: 'eslint-loader',
            //     enforce: 'pre',
            //     include: [resolve('src')],
            //     exclude: [resolve('src/common/modules')],
            //     options: {
            //         formatter: require('eslint-friendly-formatter'),
            //         emitWarning: !config.dev.showEslintErrorsInOverlay,
            //         cache: true,
            //         fix: true,
            //         // failOnError: true,
            //         quiet: true
            //     }
            // }] : []),
            ...(isProd ? [{
                test: /\.(js|vue)$/,
                loader: 'webpack-strip-block',
                enforce: 'pre',
                include: [resolve('src')],
            }] : []),
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    configFile: resolve('babel.config.js')
                },
                include: [
                    resolve('src'),
                    resolve('test'),
                    resolve('/node_modules/lagou-base-vue-header')
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]'),
                    publicPath: url => {
                        return `${utils.publicPath()}${url}`;
                    },
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    optimization: {
        minimizer: [
            // new ParallelUglifyPlugin(parallelUglifyPluginConfig)
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        // we want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minfication steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending futher investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,
                        drop_console: true,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true,
                    },
                },
                parallel: !isWsl,
                // Enable file caching
                cache: true,
                sourceMap: true,
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser,
                },
            }),
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                // vendor: {
                //     test: /[\\/]node_modules[\\/]/,
                //     name: 'vendor',
                //     chunks: 'all',
                //     priority: 3,
                //     minChunks: 2,
                //     reuseExistingChunk: true,
                // },
                common: {
                    test: /[\\/]src[\\/]common[\\/]/,
                    name: 'common',
                    chunks: 'all',
                    priority: 1,
                    minChunks: 2,
                    enforce: true,
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
        runtimeChunk: true,
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
            basePath: '/',
            publicPath: staticTable.assetsPublicPath,
            generate: (seed, files) => {
                const manifestFiles = files.reduce(
                    function (manifest, file) {
                        manifest[file.name] = file.path;
                        return manifest;
                    }, seed);

                return {
                    files: manifestFiles,
                };
            },
        }),
        new ProgressBarPlugin(),
    ],
});
