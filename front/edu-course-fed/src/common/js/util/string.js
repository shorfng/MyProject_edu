// 获取字符长度（中英文）
export function getStrLength(str) {
    var strlen = 0;
    if (!str) {
        return '';
    }
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            strlen += 2;
        } else {
            strlen++;
        }

    }
    return strlen;
}

// 判断值是否是 url 地址
export function checkUrl(url) {
    return /^(http|ftp|https):\/\//ig.test(url);
}

export function unescapeHTML(str) {
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}
