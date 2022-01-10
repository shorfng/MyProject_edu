import * as Cookies from 'js-cookie';
import {
    browserName,
    OSName,
    fullVersion
} from '../userAgent/browser-name-and-OS';
// lagou
window.dataHost = 'a.lagou.com';
(function(i, s, o, g, r, a, m) {
    i['LgAnalytics'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments);
    };
    i[r].l = Number(new Date());
    a = s.createElement(o);
    m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//a.lagou.com/js/a.js', 'gatherer');

window.gatherer('create', 'UA-41268416-1', {
    'alwaysSendReferrer': true
});
window.gatherer('send', 'pageview');

const SASERVER = 'https://sa.lagou.com/collect.gif';
// 这里是一个minajax
const ajax = {};
ajax.x = function() {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    const versions = [
        'Microsoft.XmlHttp',
        'MSXML2.XmlHttp.6.0',
        'MSXML2.XmlHttp.5.0',
        'MSXML2.XmlHttp.4.0',
        'MSXML2.XmlHttp.3.0',
        'MSXML2.XmlHttp.2.0'
    ];
    let xhr;
    for (let i = 0; i < versions.length; i++) {
        try {
            xhr = new window.ActiveXObject(versions[i]);
            break;
        } catch (e) {
            console.error(e);
        }
    }
    return xhr;
};

ajax.send = function(url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    const x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function() {
        if (x.readyState == 4) {
            callback && callback(x.responseText);
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data);
};

ajax.get = function(url, data, callback, async) {
    const query = [];
    for (const key in data) {
        query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }
    ajax.send(url + (query.length ? `?${query.join('&')}` : ''), callback, 'GET', null, async);
};

ajax.post = function(url, data, callback, async) {
    const query = [];
    for (const key in data) {
        query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }
    ajax.send(url, callback, 'POST', query.join('&'), async);
};

window._lgSaData = {
    time: (new Date()).getTime(),
    lt: 'pcclick', // 固定值
    os: OSName,
    browser: browserName,
    browser_version: fullVersion,
    screen_height: window.screen.height,
    screen_width: window.screen.width
};
window.lgSa = {
    setUserId(userId) {
        window._lgSaData.user_id = userId;
    },
    track(event, actions) {
        if (!(actions instanceof Object)) {
            console.warn('event should be Object');
            return;
        }

        let tempData = {
            click_props: {}
        };
        for (const key in window._lgSaData) {
            tempData[key] = window._lgSaData[key];
        }
        for (let actionKey in actions) {
            try {
                actionKey = String(actionKey);
                if (actionKey === 'address_id' || actionKey === 'content_id') {
                    tempData[actionKey] = actions[actionKey];
                } else {
                    tempData.click_props[actionKey] = String(actions[actionKey]);
                }
            } catch (e) {
                console.log(e);
            }
        }

        tempData.page_id = event || '';
        tempData.LGID = Cookies.get('user_trace_token') || '';
        tempData.time = (new Date()).getTime();

        let trackResult = {};
        trackResult.plat = 'PC';
        trackResult.data = window.JSON.stringify(tempData);

        ajax.get(SASERVER, trackResult);
    },
    twoPlatTrack(event, actions) {
        window.lgSa.track(event, actions);
        if (window.sa) {
            if (actions.address_id) {
                actions.aId = actions.address_id;
                delete actions.address_id;
            }
            if (actions.content_id) {
                actions.content = actions.content_id;
                delete actions.content_id;
            }
            if (/^\d/.test(event)) {
                event = '_' + event;
            }
            window.sa.track(event, actions);
        }
    }
};
if (window.userInfo && window.userInfo.userId) {
    window.lgSa.setUserId(window.userInfo.userId);
}
if (window.userInfo && window.userInfo.id) {
    window.lgSa.setUserId(window.userInfo.id);
}
