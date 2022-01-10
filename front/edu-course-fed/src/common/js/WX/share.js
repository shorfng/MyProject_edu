const jsonp = function(url, data) {
    return new Promise((resolve, reject) => {
        // 初始化url
        const dataString = url.indexOf('?') === -1 ? '?' : '&';
        const callbackName = `cb${Date.now()}`;
        url += `${dataString}jsoncallback=${callbackName}`;
        if (data) {
            // 有请求参数，依次添加到url
            for (const k in data) {
                url += `&${k}=${data[k]}`;
            }
        }
        const jsNode = document.createElement('script');
        jsNode.src = url;
        // 触发callback，触发后删除js标签和绑定在window上的callback
        window[callbackName] = (result) => {
            delete window[callbackName];
            document.body.removeChild(jsNode);
            if (result) {
                resolve(result);
            } else {
                reject('没有返回数据');
            }
        };
        // js加载异常的情况
        jsNode.addEventListener('error', () => {
            delete window[callbackName];
            document.body.removeChild(jsNode);
            reject('JavaScript资源加载失败');
        }, false);
        // 添加js节点到document上时，开始请求
        document.body.appendChild(jsNode);
    });
};

let isWxReady = false;
const surl = window.location.href;

export function initWxShare(datas) {
    const url = 'https://www.lagou.com/weixin/wx_share.json';

    function encode(url) {
        return encodeURIComponent(url).replace(/'/g, '%27').replace(/"/g, '%22');
    }

    const callback = function(json) {
        console.log('initWxShare callback: ', json);
        let data = json.message;
        data = window.eval(`(${data})`);
        window.wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
        });

        window.wx.ready(() => {
            isWxReady = true;
            const shareData = {
                title: datas.title,
                desc: datas.desc,
                link: datas.shareUrl === undefined ? surl : datas.shareUrl, // 分享链接
                imgUrl: datas.imgUrl,
                success: datas.shareSucess || datas.success,
                fail: function (res) {
                    console.log('shareData fail', res);
                    datas.fail && datas.fail(res);
                }
            };
            const shareFriends = {
                title: datas.title,
                link: datas.shareUrl === undefined ? surl : datas.shareUrl, // 分享链接
                imgUrl: datas.imgUrl,
                success: datas.shareFriendsSuccess || datas.success,
                fail: function (res) {
                    console.log('shareData fail', res);
                    datas.fail && datas.fail(res);
                }
            };
            window.wx.onMenuShareAppMessage(shareData);// 分享给好友
            window.wx.onMenuShareTimeline(shareFriends);// 朋友圈
            // console.log('weixin support set success.');
        });
        window.wx.error((res) => {
            // alert(res.errMsg);
        });
    };

    jsonp(url, {
        url: encode(window.location.href.split('#')[0])
    })
        .then((data) => {
            callback && callback(data);
        })
        .catch((err) => {
            console.log('jsonp 加载失败', err);
        });
}

export function changeWxShare(datas) {
    if (!window.wx) {
        return;
    }
    if (!isWxReady) {
        // console.log('wx is not ready');
        return;
    }
    const shareData = {
        title: datas.title,
        desc: datas.desc,
        link: datas.shareUrl == undefined ? surl : datas.shareUrl, // 分享链接
        imgUrl: datas.imgUrl,
        success: datas.shareSucess || datas.success,
    };
    const shareFrieds = {
        title: datas.title,
        link: datas.shareUrl == undefined ? surl : datas.shareUrl, // 分享链接
        imgUrl: datas.imgUrl,
        success: datas.shareSucess || datas.success,
    };
    window.wx.onMenuShareAppMessage(shareData);// 分享给好友
    window.wx.onMenuShareQQ(shareData);
    window.wx.onMenuShareWeibo(shareData);
    window.wx.onMenuShareTimeline(shareFrieds);// 朋友圈
}
