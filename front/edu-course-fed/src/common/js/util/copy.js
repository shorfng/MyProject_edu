export function Clipboard(showFormat) {
    var input;
        var copy;
    function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createInput(text) {
        input = showFormat ? document.createElement('textarea') : document.createElement('input');
        input.style.height = '1px';
        input.style.width = '1px';
        input.contentEditable = true;
        input.readOnly = true;
        input.value = text;
        document.body.appendChild(input);
    }

    function selectText() {
        var range;
            var selection;

        if (isOS()) {
            range = document.createRange();
            range.selectNodeContents(input);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            input.setSelectionRange(0, input.value.length);
        } else {
            input.select();
        }
    }

    function copyToClipboard() {
        document.execCommand('copy', false, null);
        document.body.removeChild(input);
    }

    copy = function(text) {
        createInput(text);
        selectText();
        copyToClipboard();
    };

    return {
        copy: copy
    };
}