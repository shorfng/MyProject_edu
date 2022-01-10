export default function loadScript(url, option, callback) {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    for (const i in option) {
        script.setAttribute(i, option[i]);
    }
    script.type = 'text/javascript';
    if (script.readyState) {
        // IE
        script.onreadystatechange = function() {
            if (this.readyState == 'complete' || script.readyState == 'loaded') {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        // 其他浏览器
        script.onload = function() {
            callback();
        };
    }
    script.src = url;
    head.appendChild(script);
}
