export function getParam(param) {
    let key = param;
    let search = window.location.search.substring(1);
    if (Object.prototype.toString.call(param) === '[object Object]') {
        param.url && (search = param.url.split('?')[1] || '');
        key = param.key ? param.key : null;
    }
    let obj = {};
    search.split('&').map((item) => {
        let one = item.split('=');

        obj[one[0]] = one[1];
        return item;
    });

    if (key) {
        return obj[key];
    }
    else {
        return obj;
    }

}

export function getHashString(name, url = location.hash) {
    var arr = (url || '')
        .substr(url.indexOf('?') + 1)
        .replace(/^\#/, '')
        .split('&');
    var params = {};
    for (var i = 0; i < arr.length; i++) {
        var data = arr[i].split('=');
        if (data.length == 2 && data[0] == name) {
            return data[1];
        }
    }
    return null;
}

export function parseURL(url = window.location.href) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function() {
            var ret = {};
            var seg = a.search.replace(/^\?/, '').split('&'); //将该字符串首位的?替换成空然后根据&来分隔返回一个数组
            var len = seg.length;
            var i = 0;
            var s;
            for (;i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['', ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'), //将该字符串首位不是/的用这个组([^\/])替换，$1代表出现在正则表达式中的第一个()、$2代表出现在正则表达式中的第二个()...
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || ['', ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}

export function parseObjToUrl(param, key) {
    var paramStr = '';
    var mappingOperator = '=';
    var separator = '&';
    if (param instanceof String || typeof (param) == 'string' || param instanceof Number || typeof (param) == 'number' || param instanceof Boolean || typeof (param) == 'boolean') {
      paramStr += separator + key + mappingOperator + encodeURIComponent(param);
    } else {
      for (var i in param) {
        var value = param[i];
        var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
        paramStr += separator + parseObjToUrl(value, k);
      }
    }
    return paramStr.substr(1);
  }