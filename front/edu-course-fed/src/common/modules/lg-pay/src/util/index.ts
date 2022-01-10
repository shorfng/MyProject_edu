export function getQueryString(name: string) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}

export function isIphone() {
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
}

export function isEduApp() {
    var uaResult = /LGEdu/i.test(navigator.userAgent);
    return  uaResult;
}

export function isLagouApp() {
    var urlResult = /lagoufrom=android|lagoufrom=ios/i.test(window.location.href);
    var uaResult = /lagou/i.test(navigator.userAgent);
    return urlResult || uaResult;
}

export function isApp() {
    return isEduApp() || isLagouApp()
}

export function getAppVersion() {
    var userAgent = navigator.userAgent;
    var regx = new RegExp(/lagou\/\S*/gi);
    var match = userAgent.match(regx);
    if (match) {
        return match[0].replace(/lagou\//i, '');
    } else {
        return '';
    }
}

export function getEduAppVersion() {
    var userAgent = navigator.userAgent;
    var regx = new RegExp(/LGEdu\/\S*/gi);
    var match = userAgent.match(regx);
    if (match) {
        return match[0].replace(/LGEdu\//i, '');
    } else {
        return '';
    }
}

export function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}


export function isKw() {
    return true;
}

export function isPayPage(){
    return window.location.pathname === '/app/pay/lg-buy.html';
}

export function isSupportNative(supportVersion: string) {
    var appVersion = getAppVersion();
    if (!appVersion) {
        return false;
    }
    return compareVersion(appVersion, supportVersion);
}

export function compareVersion(version1: string, version2: string) {
    var v1List = version1.split('.');
    var v2List = version2.split('.');
    for (var i = 0; i < 3; i++) {
        if (parseInt(v1List[i]) < parseInt(v2List[i])) {
            return false
        } else if (parseInt(v1List[i]) > parseInt(v2List[i])) {
            return true
        }
    }
    return true;
}

