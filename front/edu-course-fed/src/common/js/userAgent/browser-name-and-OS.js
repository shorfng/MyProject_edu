import { isApp } from './getVersion';

const nAgt = navigator.userAgent;
let browserName = navigator.appName;
let OSName = 'Unknown OS';
let fullVersion = String(parseFloat(navigator.appVersion));
let majorVersion = parseInt(navigator.appVersion, 10);
let nameOffset;
    let verOffset;
    let ix;

// In 微信, the true version is after "MicroMessenger"
if ((verOffset = nAgt.indexOf('MicroMessenger')) !== -1) {
    browserName = 'WX';
    fullVersion = nAgt.substring(verOffset + 15);
}
// In Chrome, the true version is after "Chrome"
else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
    browserName = 'Chrome';
    fullVersion = nAgt.substring(verOffset + 7);
}
// In Firefox, the true version is after "Firefox"
else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
    browserName = 'Firefox';
    fullVersion = nAgt.substring(verOffset + 8);
}

// In Safari, the true version is after "Safari" or after "Version"
else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
    browserName = 'Safari';
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf('Version')) !== -1) fullVersion = nAgt.substring(verOffset + 8);
}
// In MSIE, the true version is after "MSIE" in userAgent
else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
    browserName = 'Microsoft Internet Explorer';
    fullVersion = nAgt.substring(verOffset + 5);
}

// In Opera, the true version is after "Opera" or after "Version"
else if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
    browserName = 'Opera';
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf('Version')) !== -1) fullVersion = nAgt.substring(verOffset + 8);
}

// In most other browsers, "name/version" is at the end of userAgent
else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
    (verOffset = nAgt.lastIndexOf('/'))) {
    browserName = nAgt.substring(nameOffset, verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
        browserName = navigator.appName;
    }
}
// trim the fullVersion string at semicolon/space if present
if ((ix = fullVersion.indexOf(';')) !== -1) fullVersion = fullVersion.substring(0, ix);
if ((ix = fullVersion.indexOf(' ')) !== -1) fullVersion = fullVersion.substring(0, ix);

majorVersion = parseInt(String(fullVersion), 10);
if (isNaN(majorVersion)) {
    fullVersion = String(parseFloat(navigator.appVersion));
    majorVersion = parseInt(navigator.appVersion, 10);
}

// This script sets OSName variable as follows:
// "Windows"    for all versions of Windows
// "MacOS"      for all versions of Macintosh OS
// "Linux"      for all versions of Linux
// "UNIX"       for all other UNIX flavors
// "Unknown OS" indicates failure to detect the OS
if (navigator.userAgent.indexOf('Win') !== -1) OSName = 'Windows';
if (navigator.userAgent.indexOf('Mac') !== -1) OSName = 'MacOS';
if (navigator.appVersion.indexOf('X11') !== -1) OSName = 'UNIX';
if (navigator.userAgent.indexOf('Linux') !== -1) OSName = 'Linux';
if (navigator.userAgent.indexOf('Android') !== -1) OSName = 'Android';
if (navigator.userAgent.indexOf('like Mac') !== -1) OSName = 'iOS';

function getEnvironment() {
    let currentEnvironment = 'PC';
    if (['Android', 'iOS'].indexOf(OSName) !== -1) {
        currentEnvironment = 'H5';
        if (browserName === 'WX') {
            currentEnvironment = 'WX';
        } else if (isApp()) {
            currentEnvironment = 'app';
        }
    }
    return currentEnvironment;
}

module.exports = {
    browserName,
    OSName,
    fullVersion,
    majorVersion,
    getEnvironment
};
