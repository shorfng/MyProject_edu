export const formatTime = function(time) {
    let minute = parseInt(time / 60);
    let second = parseInt(time % 60);
    let str_minute = minute < 10 ? ('0' + minute) : minute;
    let str_second = second < 10 ? ('0' + second) : second;
    return str_minute + ':' + str_second;
};

export const formatTimeStamp = function (timestamp, hyphen = '') {
    const date = new Date(timestamp);
    const y = date.getFullYear() + '年';
    const m = date.getMonth() + 1 + '月';
    const d = date.getDate() + '日';
    return [y, m, d].join(hyphen);
};

/**
 * 计算剩余时间
 * @param timestamp 时间 Date 类型或者 long 类型的剩余时间
 * @param isNeedCompareNow 是否需要和现在时刻比较，计算出剩余时间
 * @returns {string}
 */
export const formatRemainTime = function (timestamp, isNeedCompareNow = true) {
    let remainTime = isNeedCompareNow ? timestamp - new Date().getTime() : timestamp;
    if (remainTime <= 0) return '';
    let h = Math.floor(remainTime / (3600 * 1000));
    // 计算相差分钟数
    let leave2 = remainTime % (3600 * 1000);        //计算小时数后剩余的毫秒数
    let m = Math.floor(leave2 / (60 * 1000));
    //计算相差秒数
    let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
    let s = Math.round(leave3 / 1000);
    h = h > 9 ? h : '0' + h;
    m = m > 9 ? m : '0' + m;
    s = s > 9 ? s : '0' + s;
    return h + ':' + m + ':' + s;
};
// 秒转换为时间格式
export const formatSecond = function(second, hyphen = '') {
    let day = Math.floor(second / 86400);
    let hour = Math.floor(second % 86400 / 3600);
    let minute = Math.floor(second % 86400 % 3600 / 60);
    let sec = Math.floor(second % 86400 % 3600 % 60);
    let obj = [day, hour, minute, sec];
    if (!hyphen) {
        day = day > 0 ? `${day}天` : '';
        hour = hour >= 10 ? `${hour}小时` : hour > 0 ? `0${hour}小时` : '';
        minute = minute >= 10 ? `${minute}分` : minute > 0 ? `0${minute}分` : '';
        sec = sec >= 10 ? `${sec}秒` : `0${sec}秒`;
        return `${day}${hour}${minute}${sec}`;
    }
    return obj.join(hyphen);

};
// 时间戳转年月日
export const timeFormat = function (timestamp, hyphen = '') {
    const date = new Date(timestamp);
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return [y, m, d].join(hyphen);
};