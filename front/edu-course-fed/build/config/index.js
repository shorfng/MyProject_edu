// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');
const fs = require('fs');
const specialPagePath = {
};
const getEntryModuleByDir = (filePath = './src') => {
    let entries = {};
    // 同步读取目录结构
    fs.readdirSync(filePath).forEach((filename) => {
        const combineDir = path.join(filePath, filename);
        const stat = fs.statSync(combineDir);
        if (stat && stat.isDirectory()) {
            entries = Object.assign(entries, getEntryModuleByDir(combineDir));
        } else {
            if (
                filename === 'main.js'
                && combineDir.indexOf('modules') === -1
                && combineDir.indexOf('common') === -1
                && combineDir.indexOf('assets') === -1
            ) {
                const entryName = `${combineDir.substring(4, combineDir.length - 3)}`;
                entries[entryName] = `./${combineDir}`;
            }
        }
    });
    return Object.assign(entries, specialPagePath);
};

let finalPath = { index: './src/index.js' };
module.exports = {
    dev: {
        addTemplatesPath: (html) => path.resolve(__dirname, '../../dist/' + html + '.html'),
        assetsRoot: path.resolve(__dirname, '../../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/user': {
                target: 'http://localhost:9001/front',
                changeOrigin: true,
                secure: false
            },
            '/course': {
                target: 'http://localhost:9001/front',
                changeOrigin: true,
                secure: false
            },
            '/ad': {
                target: 'http://localhost:9001/front',
                changeOrigin: true,
                secure: false
            },
            '/comment': {
                target: 'http://localhost:9001/front',
                changeOrigin: true,
                secure: false
            },
            '/message': {
                target: 'http://localhost:9001/front',
                changeOrigin: true,
                secure: false
            },
            '/weixin': {
                target: 'http://localhost:9001/front',
                changeOrigin: true,
                secure: false
            }
        },

        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        port: 8088, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        // Use Eslint Loader?
        // If true, your code will be linted during bundling and
        // linting errors and warnings will be shown in the console.
        useEslint: true,
        // If true, eslint errors and warnings will also be shown in the error overlay
        // in the browser.
        showEslintErrorsInOverlay: true,

        /**
     * Source Maps
     */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
    },

    build: {
    // Template for index.html
        addTemplatesPath: (html) => path.resolve(__dirname, '../../dist/template/' + html + '.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../../dist/static'),
        assetsSubDirectory: '',
        assetsPublicPath: '/edu-course-fed/',

        /**
     * Source Maps
     */

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    entry: finalPath,
};
console.log(finalPath)
