const config = require('./config');
const vuxLoader = require('vux-loader');
const selectEntryBuild = require('./select-entry-build');
const webpackConfig = require('./webpack.config');

const isProd = process.env.NODE_ENV === 'production';

let entry = {};
if (isProd) {
    entry = config.entry;
}
else {
    const userSelectEntry = selectEntryBuild(config.entry, false);
    Object.keys(userSelectEntry).forEach(item => {
        entry[item] = [config.entry[item], 'webpack-hot-middleware/client'];
    });
}

module.exports = vuxLoader.merge(webpackConfig(entry), {
    plugins: [
        'vux-ui',
        'progress-bar',
        {
            name: 'duplicate-style',
            options: {
                cssProcessorOptions: {
                    safe: true,
                    zindex: false,
                    autoprefixer: {
                        add: true,
                        browsers: [
                            'iOS >= 7',
                            'Android >= 4.1'
                        ]
                    }
                }
            }
        },
        {
            name: 'less-theme',
            path: 'src/common/css/theme.less'
        }
    ]
});
