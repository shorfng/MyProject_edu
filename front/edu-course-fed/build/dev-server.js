require('./check-versions')();

var config = require('./config');

process.env.NODE_ENV = 'development';

// 如果Node的环境变量中没有设置当前的环境(NODE_ENV), 则使用config中配置的环境作为当前环境
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

var opn = require('opn');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var Velocity = require('velocityjs');
var proxyMiddleware = require('http-proxy-middleware');
var webpackConfig = require('./webpack.dev.conf');
var lagouMockMiddleware = require('../src/common/modules/lagou-mock-middleware');
var lagouMockConfigPath = path.join(__dirname, './mockDir/lagouMockConfig.js');
var velocityCommon = require('./velocity-common');
var purgeCache = require('./remove-require-cache');

var exculdeUrlList = ['__webpack_hmr', 'favicon.ico', 'hot-update'];

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

var app = express();

var compiler = webpack(webpackConfig);

var webpackConfigOutputPublicPath = webpackConfig.output.publicPath;

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfigOutputPublicPath,
    logLevel: 'warn'
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => { },
    reload: true
});

// proxy service requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context];
    if (typeof options === 'string') {
        options = { target: options };
    }
    app.use(proxyMiddleware(options.filter || context, options));
});

app.use(lagouMockMiddleware(lagouMockConfigPath, exculdeUrlList));

app.get('*', (req, res, next) => {


    if (
        exculdeUrlList.some(function(item) {
            return req.url.indexOf(item) > -1;
        })
    ) {
        next();
        return;
    }

    var filename = devMiddleware.getFilenameFromUrl(req.url);
    var filesystem = devMiddleware.fileSystem;
    if (filename) {
        try {
            var stat = filesystem.statSync(filename);
            if (stat.isDirectory()) {
                var dirContent = filesystem.readdirSync(filename);
                res.setHeader('Content-Type', 'text/html');
                res.write(
                    '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>'
                );
                res.write('<ul>');

                dirContent.forEach((item) => {
                    var isFile = filesystem.statSync(filename + '/' + item).isFile();
                    var redirectUrl = req.url + item + (isFile ? '' : '/');
                    res.write('<li><a href="');
                    res.write(redirectUrl);
                    res.write('">');
                    res.write(item + (isFile ? '' : '(文件夹)'));
                    res.write('</a></li>');

                    if (/\.js$/.test(item)) {
                        var html = item.substr(0, item.length - 3);

                        res.write('<li><a href="');
                        res.write(redirectUrl);
                        res.write('">');
                        res.write(html);
                        res.write('</a>');
                        res.write('</li>');
                    }
                });
                res.write('</ul>');
                res.end('</body></html>');
                return;
            }
            else if (stat.isFile() && path.extname(filename) === '.html' && filename.indexOf('main.html') !== -1) {
                var mainHtmlContent = filesystem.readFileSync(filename, 'utf-8');
                res.setHeader('Content-Type', 'text/html');
                var velocityDataPath = filename.replace('dist/', 'src/').replace('main.html', 'velocity.js');
                var velocityData = {};
                try {
                    velocityData = require(velocityDataPath);
                    purgeCache(velocityDataPath);
                }
                catch (e) {
                    console.log(e);
                }
                var result = compileVelocityContent(String(mainHtmlContent), velocityData);
                res.write(result);
                res.end();
                return;
            }
        }
        catch (e) {
            console.log(e);
            console.log(req.url);
            next();
        }
    }


    next();

});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

function compileVelocityContent(content, data) {
    var ast = Velocity.parse(content);
    var result = new Velocity.Compile(ast, {
        escape: false
    }).render(Object.assign(velocityCommon, (data || {})));
    return result;
}

var uri = 'http://localhost:' + port;

var _resolve;
var readyPromise = new Promise(resolve => {
    _resolve = resolve;
});

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n');

    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri);
    }

    _resolve();

});

var server = app.listen(port);

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close();
    }
};
