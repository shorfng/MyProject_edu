import { browserName, OSName } from '../../common/js/userAgent/browser-name-and-OS.js';
import { isApp, getAppVersion } from '../../common/js/userAgent/getVersion';

const state = {
    currentEnv: getCurrentEnv(),
    appVersion: getAppVersion()
};

const getters = {
    currentEnv: state => {
        return state.currentEnv;
    },
    appVersion: state => state.appVersion
};

export default {
    getters,
    state
};

function getCurrentEnv() {
    let env = 'PC';
    if (['Android', 'iOS'].indexOf(OSName) !== -1) {
        env = 'H5';
        if (browserName === 'WX') {
            env = 'WX';
        } else if (isApp()) {
            env = 'app';
        }
    }
    return env;
}
