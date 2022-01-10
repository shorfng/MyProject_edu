import {
    browserName,
    OSName,
    fullVersion
} from '../userAgent/browser-name-and-OS';

(function(para) {
    let p = para.sdk_url;
        let n = para.name;
        let w = window;
        let d = document;
        let s = 'script';
        let x = null;
        let y = null;
    w.sensorsDataAnalytic201505 = n;
    w[n] = w[n] || function(a) { return function() { (w[n]._q = w[n]._q || []).push([a, arguments]) } };
    const ifs = [
        'track',
        'quick',
        'register',
        'registerPage',
        'registerOnce',
        'clearAllRegister',
        'trackSignup',
        'trackAbtest',
        'setProfile',
        'setOnceProfile',
        'appendProfile',
        'incrementProfile',
        'deleteProfile',
        'unsetProfile',
        'identify',
        'login',
        'logout',
        'trackLink',
        'clearAllRegister',
        'getAppStatus'
    ];
    for (let i = 0; i < ifs.length; i++) {
        w[n][ifs[i]] = w[n].call(null, ifs[i]);
    }
    if (!w[n]._t) {
        x = d.createElement(s);
        y = d.getElementsByTagName(s)[0];
        x.async = 1;
        x.src = p;
        x.charset = 'UTF-8';
        y.parentNode.insertBefore(x, y);
        w[n].para = para;
    }
})({
    sdk_url: 'https://www.lgstatic.com/yun-main/static/common/static/sensorsSDK/1.8.10/js/sensorsdata.min.js',
    name: 'sa',
    cross_subdomain: true,
    server_url: 'https://shenceyun.lagou.com/sa?project=production'
});

window.sa.register({
    $os: OSName,
    $browser: browserName,
    $browser_version: fullVersion
});

if (window.userInfo && window.userInfo.userId) {
    window.sa.login(window.userInfo.userId);
}
