let toString = Object.prototype.toString;

function isArray(val) {
    return toString.call(val) === '[object Array]';
}

function isFunction(val) {
    return toString.call(val) === '[object Function]';
}

let addStyleJs = (function(dom) {
    let cache = {}; /*缓存加载过的css或者js*/
    let loadSourceLength = 1; /*需要加载资源的个数 */
    let completedLoadNum = 0;
    /**
     * 监听资源加载完成事件
     * @head {String}  head 标签
     * @dom {String}  具体的 script 或 link 标签元素
     * @callback {Function} 加载成功的回掉函数
     * */
    function listenerSourceStateChange(head, dom, callback) {
        head.appendChild(dom); /*添加到HTML中*/
        dom.onload = dom.onreadystatechange = function() { /*判断是否加载成功*/
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                dom.onload = dom.onreadystatechange = null;
                callback();
            }
        };
    }
    /**
     * HTML 动态添加 CSS
     * @path {String}  link 地址必须带有后缀名.css
     * @callback {Function} 加载成功的回掉函数
     * */
    function addCss(path, callback) {
        /*检查是否加载过*/
        if (checkCache(path)) {
            callback();
            return;
        }
        let head = dom.getElementsByTagName('head')[0];
        let link = dom.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        listenerSourceStateChange(head, link, callback);
        cache[path] = 1; /*存储加载过的css路径,值设为1*/
    }
    /**
     * HTML动态加载js
     * @path {String} src 地址必须带有后缀名.js
     * @callback {Function} 加载成功的回掉函数
     * */
    function addJs(path, callback) {
        /*检查是否加载过*/
        if (checkCache(path)) {
            callback();
            return;
        }
        let head = dom.getElementsByTagName('head')[0];
        let script = dom.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        listenerSourceStateChange(head, script, callback);
        cache[path] = 1; /*存储加载过的js路径,值设为1*/
    }
    /**
     * 检查是否加载
     * @path {String} 路径
     * */
    function checkCache(path) {
        return !!cache[path];
    }
    /**
     * HTML动态加载css或者js
     * @path {String} src 或 link 地址必须带有后缀名.js或者.css
     * @callback {Function} 加载成功的回掉函数
     * */
    return function(path, callback) {
        if (!path) { /*检查路径是否为空*/
            throw new Error('请输入path路径!');
        }
        let source = [path];
        if (isArray(path)) {
            loadSourceLength = path.length;
            source = path;
        }
        function checkComplete() {
            completedLoadNum++;
            if (completedLoadNum === source.length) {
                console.log('completed');
                isFunction(callback) && callback();
                completedLoadNum = 0;
            }
        }
        source.forEach(item => {
            if (item.substr(-3) === '.js') { /*检查路径后缀名是否为.js*/
                addJs(item, checkComplete);
            } else if (item.substr(-4) === '.css') { /*检查路径后缀名是否为.css*/
                addCss(item, checkComplete);
            } else {
                throw new Error('请输入正确的path路径!');
            }
        });
    };
})(document);

export default addStyleJs;
