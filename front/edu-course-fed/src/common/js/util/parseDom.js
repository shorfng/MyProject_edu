export default function parseDom(html) {
    let ele = document.createElement('div');
    ele.innerHTML = html;
    return ele.childNodes[0];
}

/**
 * 获取制定元素左上角距离window左侧的距离
 * @param elem
 * @returns {*}
 */
export function getpageX(elem) {
    // 检查我们是否已经到了根元素
    return elem.offsetParent ?
        // 如果我们还能往上，则将当前偏移与向上递归的值相加
        elem.offsetLeft + getpageX(elem.offsetParent) :
        // 否则，取当前偏移
        elem.offsetLeft;
}
/**
 * 获取制定元素左上角距离window顶部的距离
 * @param elem
 * @returns {*}
 */
// 计算元素的Y(垂直，顶)位置
export function getpageY(elem) {
    // 检查我们是否已经到了根元素
    return elem.offsetParent ?
        // 如果我们还能往上，则将当前偏移与向上递归的值相加
        elem.offsetTop + getpageY(elem.offsetParent) :
        // 否则，取当前偏移
        elem.offsetTop;
}
