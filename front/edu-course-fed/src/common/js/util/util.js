function cache(fn) {
    const cacheObj = Object.create(null);
    return function cacheFn(str) {
        let hit = cacheObj[str];
        // eslint-disable-next-line no-return-assign
        return hit || (cacheObj[str] = fn(str));
    };
}

export function isIE(ver) {
    let b = document.createElement('b');
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
    return b.getElementsByTagName('i').length === 1;
}

export function isWifi() {
    try {
        let wifi = true;
        let ua = window.navigator.userAgent;
        let con = window.navigator.connection;
        // 如果是微信
        if (/MicroMessenger/.test(ua)) {
            if (ua.indexOf('WIFI') >= 0) {
                return true;
            } else {
                wifi = false;
            }
            // 如果支持navigator.connection
        } else if (con) {
            let network = con.type;
            if (network !== 'wifi' && network !== '2' && network !== 'unknown') {
                wifi = false;
            }
        }
        return wifi;
    } catch (e) {
        return false;
    }
}

export function copyContext(value) {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            input.value = value;
            input.style.opacity = '0';
            document.body.appendChild(input);
            let editable = input.contentEditable;
            let readOnly = input.readOnly;
            input.contentEditable = true;
            input.readOnly = false;
            input.setAttribute('readonly', 'readonly');
            const range = document.createRange();
            range.selectNodeContents(input);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            input.setSelectionRange(0, 999999);
            input.contentEditable = editable;
            input.readOnly = readOnly;
            let ret = document.execCommand('copy');
            input.blur();
            if (ret) {
                resolve();
            } else {
                reject();
            }
        }
        else {
            input.readOnly = 'readonly';        // 防止ios聚焦触发键盘事件
            input.style.position = 'fixed';
            input.style.opacity = '0';
            input.style.top = '0';
            input.style.left = '-1000px';
            input.style.zIndex = '-1000';
            document.body.appendChild(input);
            input.value = value;
            selectText(input, 0, value.length);
            input.blur();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                resolve();
            }
            else {
                reject();
            }
        }
        document.body.removeChild(input);
    });
}

// input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
// 选择文本。createTextRange(setSelectionRange)是input方法
function selectText(textbox, startIndex, stopIndex) {
    if (textbox.createTextRange) { //ie
        const range = textbox.createTextRange();
        range.collapse(true);
        range.moveStart('character', startIndex);//起始光标
        range.moveEnd('character', stopIndex - startIndex);//结束光标
        range.select();//不兼容苹果
    } else { //firefox/chrome
        textbox.setSelectionRange(startIndex, stopIndex);
        textbox.focus();
    }
}
export function getHiddenProp() {
    let prefixes = ['webkit', 'moz', 'ms', 'o'];

    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';

    // otherwise loop over all the known prefixes until we find one
    let exitHidden = prefixes.find(item => {
        return ((item + 'Hidden') in document);
    });
    return exitHidden || null;
}

// 获取document.visibilityState属性
export function getVisibilityState() {
    let prefixes = ['webkit', 'moz', 'ms', 'o'];
    // if 'visibilityState' is natively supported just return it
    if ('visibilityState' in document) return 'visibilityState';
    let exitVisibilityState = prefixes.find(item => {
        return ((item + 'VisibilityState') in document);
    });
    return exitVisibilityState || null;
}

export function checkPhone(value) {
    return /^1[3456789]\d{9}$/.test(value);
}
export function judgePC() {
    return !/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
}

export function getRandom(number) {
    return Math.random().toString().slice(-number);
}

export function validatePhoneNumber(number) {
    return /^\d{5,11}$/.test(number);
}
export function validateCodeNumber(number) {
    return /^[0-9]{6,6}$/.test(number);
}

export class LongTap {
    constructor(element, duration) {
        this.element = element;
        this.duration = duration || 600;  //长按触发的时长,默认600毫秒
        this.timer = null;
        this.startEvent = 'touchstart';
        this.moveEvent = 'touchmove';
        this.endEvent = 'touchend';
        this.eventJudge();
    }

    longTap(callback) {
        console.log(this.startEvent, this.moveEvent, this.endEvent);
        this.element.addEventListener(this.startEvent, () => this.touchStart(callback), false);
        this.element.addEventListener(this.moveEvent, () => this.touchMove(), false);
        this.element.addEventListener(this.endEvent, () => this.touchEnd(), false);
    }

    touchStart(callback) {
        let cb = (...args) => typeof callback === 'function' && callback(...args);
        this.timer = setTimeout(() => cb(), this.duration);
    }

    touchMove() {
        this.timer && clearTimeout(this.timer);
    }

    touchEnd() {
        this.timer && clearTimeout(this.timer);
    }

    //判断是移动端还是PC端
    eventJudge() {
        let click = ['mousedown', 'mouseout', 'mouseup'];
        let touch = ['touchstart', 'touchmove', 'touchend'];
        let touchSupport = 'ontouchstart' in window;
        [this.startEvent, this.moveEvent, this.endEvent] = touchSupport ? touch : click;
    }
}
export function checkEmpty(value) {
    return value.trim() !== '';
}

export function backTopMethod() {
    let timer = null;
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
        let oTop = document.body.scrollTop || document.documentElement.scrollTop;
        let speed = oTop / 4;
        if (oTop > 0) {
            document.body.scrollTop = document.documentElement.scrollTop = oTop - speed;
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
        }
    });
}