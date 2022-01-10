export function getAppVersion() {
    const userAgent = navigator.userAgent;
    const regx = new RegExp(/lagou\/\S*/gi);
    const match = userAgent.match(regx);
    if (match) {
        return match[0].replace(/lagou\//i, '');
    } else {
        return null;
    }
}

export function getEduAppVersion() {
    let userAgent = navigator.userAgent;
    let regx = new RegExp(/LGEdu\/\S*/gi);
    let match = userAgent.match(regx);
    if (match) {
        return match[0].replace(/LGEdu\//i, '');
    } else {
        return '';
    }
}

// 根据ua判断是否是 拉勾 App
export function isLgApp() {
    const userAgent = navigator.userAgent;
    const reg = new RegExp(/lagou\/\S*/gi);
    return reg.test(userAgent);
}

// 根据ua判断是否是 教育 App
export function isEduApp() {
    const userAgent = navigator.userAgent;
    const reg = new RegExp(/LGEdu\/\S*/gi);
    return reg.test(userAgent);
}

export function isApp() {
    return isLgApp() || isEduApp();
}

export function isBiggerThanSpecifiedVersion(version, specifiedVersion = '7.16.0') {
    const serializeArr = (arr) => {
        return arr
            .split('.')
            .splice(0, 3)
            .map((item) => {
                return Number(item);
            });
    };
    let biggerFlag = false;
    let currentVersionArr = [];
    const specifiedVersionArr = serializeArr(specifiedVersion);
    try {
        currentVersionArr = serializeArr(version);
    } catch (e) { }
    // 不要直接比较 version 和 specifiedVersion  测试环境 ios 4位数
    if (currentVersionArr.join(',') === specifiedVersionArr.join(',')) {
        biggerFlag = true;
    } else {
        for (let i = 0; i < currentVersionArr.length; i++) {
            if (currentVersionArr[i] < specifiedVersionArr[i]) {
                biggerFlag = false;
                break;
            } else if (currentVersionArr[i] > specifiedVersionArr[i]) {
                biggerFlag = true;
                break;
            }
        }
    }
    return biggerFlag;
}
