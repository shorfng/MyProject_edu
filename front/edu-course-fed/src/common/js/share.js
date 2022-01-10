import { browserName, OSName } from './userAgent/browser-name-and-OS';
import { isApp } from './userAgent/getVersion';
let ENV = getEnvironment();
let initShareData = {};
let appShareData = {};
/*
data.title
data.desc
data.url
data.imgUrl
channel: wechat_friends/wechat_timeline/qq_friends
type:  img/link/wechat_mini
 */
function trigger(channel, type, shareInfo) {
    if (shareInfo) {
        initShareData = shareInfo;
    }
    return new Promise((resolve, reject) => {
        if (ENV === 'app' && window.lgBridge) {
            appShareData = JSON.parse(JSON.stringify(initShareData));
            appShareData.thumb = appShareData.imgUrl;
            appShareData.url = appShareData.shareUrl;
            delete appShareData.success;
            console.log('appShareData: ', appShareData);
            window.lgBridge.request('share', {
                data: {
                    type,
                    channel,
                    options: appShareData
                },
            }, (res) => {
                console.log('res: ', res);
                typeof initShareData.success === 'function' && initShareData.success();
                if (res.data && res.data.state) {
                    reject({
                        env: 'app',
                        state: res.data.state
                    });
                }
                else {
                    res.env = 'app';
                    resolve(res);
                }
            });
        }
        else {
            reject({ env: ENV });
        }
    });
}

function init(data) {
    initShareData = data;
    return new Promise((resolve, reject) => {
        let env = getEnvironment();
        console.log('env', env);
        if (env === 'WX') {
            require.ensure(['../../common/js/WX/jweixin-1.4.0.js', '../../common/js/WX/share.js'], () => {
                const wx = require('../../common/js/WX/jweixin-1.4.0.js');
                window.wx = wx;
                const WXShare = require('../../common/js/WX/share.js');
                WXShare.initWxShare(data);
            }, 'WX-share');
        }
        else if (env === 'app') {
            require.ensure(['../../common/js/APP/share.js'], () => {
                const APPShare = require('../../common/js/APP/share.js');
                delete data.success;
                APPShare.enableAppShare(data);
            }, 'app-share');
        }
        resolve();
    });
}
function changeShare(data) {
    initShareData = Object.assign(initShareData, data);
    return new Promise((resolve, reject) => {
        let env = getEnvironment();
        if (env === 'WX') {
            require.ensure(['../../common/js/WX/jweixin-1.4.0.js', '../../common/js/WX/share.js'], () => {
                const wx = require('../../common/js/WX/jweixin-1.4.0.js');
                window.wx = wx;
                const WXShare = require('../../common/js/WX/share.js');
                WXShare.changeWxShare(initShareData);
            }, 'WX-share');
        }
        else if (env === 'app') {
            require.ensure(['../../common/js/APP/share.js'], () => {
                const APPShare = require('../../common/js/APP/share.js');
                delete data.success;
                APPShare.changeAppShare(data);
            }, 'app-share');
        }
        resolve();
    });
}

function getEnvironment() {
    let currentEnvironment = 'PC';
    if (['Android', 'iOS'].indexOf(OSName) !== -1) {
        currentEnvironment = 'H5';
        if (browserName === 'WX') {
            currentEnvironment = 'WX';
        } else if (isApp()) {
            currentEnvironment = 'app';
        }
    }
    return currentEnvironment;
}

export default {
    trigger,
    init,
    changeShare,
    getEnv: getEnvironment
};

