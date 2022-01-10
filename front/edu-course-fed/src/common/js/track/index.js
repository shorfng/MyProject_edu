
const SA_SERVER = 'https://sa.lagou.com/collect.gif';
var OUTER_KEY = {
    address_id: 1,
    content_id: 1,
    show_id: 1,
};

export class LgSa {
    constructor(options) {
        this.fullVersion = '';
        this._lgSaRegister = {};
        this._lgUserSimpleInfo = {};
        this.OSName = 'Unknown OS';
        this.browserName = '';
        // this.saArr = [];
        this.init(options);
    }

    init(options) {
        this.initUserInfoAndPlatInfo();
        this.initScript(options);
        this.saRegister();
    }

    lgSaRegister(data) {
        Object.assign(this._lgSaRegister, data || {});
    }

    saRegister() {
        window.sa.clearAllRegister();
        window.sa.register({
            $os: this.OSName,
            $browser: this.browserName,
            $browser_version: this.fullVersion
        });

        //登录后需要注册进入神策
        if (this._lgUserSimpleInfo.user_id) {
            let _company = window.CONST_VARS('company');
            let _user = window.CONST_VARS('user');
            this._lgUserSimpleInfo.user_id && window.sa.login(this._lgUserSimpleInfo.user_id);
            window.sa.register({
                easy_company_id: this._lgUserSimpleInfo.easy_company_id,
                lagou_company_id: this._lgUserSimpleInfo.lagou_company_id || ''
            });
            window.sa.setProfile({
                LagouId: this._lgUserSimpleInfo.LGID || '',
                CompanyId: this._lgUserSimpleInfo.easy_company_id,
                CompanyShortName: _company.shortName,
                CompanyName: _company.name,
                phone: _user.phone,
                last_login_time: new Date().getTime()
            });
        }
    }

    initScript(options) {
        // if (document.querySelector('#initSaTrack')) {
        //     return;
        // }
        let initScript = document.createElement('script');
        initScript.id = 'initSaTrack';
        let platform = (options && options.platform) || 'edudata';
        console.log(platform, 9999);
        initScript.text = ` ;(function(para) {
                var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script',x = null,y = null;
                w['sensorsDataAnalytic201505'] = n;
                w[n] = w[n] || function(a) {return function() {(w[n]._q = w[n]._q || []).push([a, arguments]);}};
                var ifs = ['track','quick','register','registerPage','registerOnce','clearAllRegister','trackSignup', 'trackAbtest', 'setProfile','setOnceProfile','appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify','login','logout','trackLink','clearAllRegister','getAppStatus'];
                for (var i = 0; i < ifs.length; i++) {
                    w[n][ifs[i]] = w[n].call(null, ifs[i]);
                }
                if (!w[n]._t) {
                    x = d.createElement(s), y = d.getElementsByTagName(s)[0];
                    x.async = 1;
                    x.src = p;
                    x.charset = 'UTF-8';
                    y.parentNode.insertBefore(x, y);
                    w[n].para = para;
                }
            })({
                sdk_url: 'https://www.lgstatic.com/yun-main/static/common/static/sensorsSDK/1.8.10/js/sensorsdata.min.js',
                name: 'sa',
                cross_subdomain: true,
                server_url: 'https://shenceyun.lagou.com/sa?project=${platform}',
            });
    `;
        document.head.appendChild(initScript);
        // initScript.onload = function () {
        //     this.saArr.push(window.sa)
        //     console.log(this.saArr)
        // }
    }
    initUserInfoAndPlatInfo() {
        let _navigator = navigator;
        let userAgent = _navigator.userAgent;
        let appVersion = _navigator.appVersion;
        this.browserName = _navigator.appName;
        this.fullVersion = String(parseFloat(appVersion));
        let verOffset;
        let ix;
        let nameOffset;


        // 浏览器名称
        if ((verOffset = userAgent.indexOf('Opera')) !== -1) {
            this.browserName = 'Opera';
            this.fullVersion = userAgent.substring(verOffset + 6);
            if ((verOffset = userAgent.indexOf('Version')) !== -1) this.fullVersion = userAgent.substring(verOffset + 8);
        } else if ((verOffset = userAgent.indexOf('MSIE')) !== -1) {
            this.browserName = 'Microsoft Internet Explorer';
            this.fullVersion = userAgent.substring(verOffset + 5);
        } else if ((verOffset = userAgent.indexOf('Chrome')) !== -1) {
            this.browserName = 'Chrome';
            this.fullVersion = userAgent.substring(verOffset + 7);
        } else if ((verOffset = userAgent.indexOf('Safari')) !== -1) {
            this.browserName = 'Safari';
            this.fullVersion = userAgent.substring(verOffset + 7);
            if ((verOffset = userAgent.indexOf('Version')) !== -1) this.fullVersion = userAgent.substring(verOffset + 8);
        } else if ((verOffset = userAgent.indexOf('Firefox')) !== -1) {
            this.browserName = 'Firefox';
            this.fullVersion = userAgent.substring(verOffset + 8);
        } else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) < (verOffset = userAgent.lastIndexOf('/'))) {
            this.browserName = userAgent.substring(nameOffset, verOffset);
            this.fullVersion = userAgent.substring(verOffset + 1);
            if (this.browserName.toLowerCase() === this.browserName.toUpperCase()) {
                this.browserName = _navigator.appName;
            }
        }

// 系统名称
        if (userAgent.indexOf('Win') !== -1) {
            this.OSName = 'Windows';
        } else if (userAgent.indexOf('Mac') !== -1) {
            this.OSName = 'MacOS';
        } else if (appVersion.indexOf('X11') !== -1) {
            this.OSName = 'UNIX';
        } else if (userAgent.indexOf('Linux') !== -1) {
            this.OSName = 'Linux';
        } else if (userAgent.indexOf('Android') !== -1) {
            this.OSName = 'Android';
        } else if (userAgent.indexOf('like Mac') !== -1) {
            this.OSName = 'iOS';
        }

        //版本号
        if ((ix = this.fullVersion.indexOf(';')) !== -1) this.fullVersion = this.fullVersion.substring(0, ix);
        if ((ix = this.fullVersion.indexOf(' ')) !== -1) this.fullVersion = this.fullVersion.substring(0, ix);

        let majorVersion = parseInt(String(this.fullVersion), 10);
        if (isNaN(majorVersion)) {
            this.fullVersion = String(parseFloat(appVersion));
            majorVersion = parseInt(appVersion, 10);
        }

        // 用户基本信息
        if (window.CONST_VARS) {
            let _company = window.CONST_VARS('company');
            let _user = window.CONST_VARS('user');
            this._lgUserSimpleInfo.LGID = _user.id;
            this._lgUserSimpleInfo.user_id = _user.id;
            this._lgUserSimpleInfo.easy_company_id = _company.id;
            this._lgUserSimpleInfo.lagou_company_id = _company.lgId;
        }
        if (window.userInfo && window.userInfo.user_id) {
            this._lgUserSimpleInfo.user_id = window.userInfo.user_id;
        }

    }

    defaultBrowserParam() {
        return {
            lt: 'pcclick',
            os: this.OSName,
            browser: this.browserName,
            browser_version: this.fullVersion,
            screen_height: window.screen.height,
            screen_width: window.screen.width,
        };
    }

    defaultUserInfo() {
        return Object.assign(this._lgUserSimpleInfo, {
            time: (new Date()).getTime()
        });
    }

    saTrack(event, actions) {
        if (window.sa) {
            if (actions.address_id) {
                actions.aId = actions.address_id;
                delete actions.address_id;
            }
            if (actions.content_id) {
                actions.content = actions.content_id;
                delete actions.content_id;
            }

            //神策不支持数字开头 做一个补充 统一加下 "_"
            if (/^\d/.test(event)) {
                // event = event;
            }
            window.sa.track(event, actions);
        }
    }

    //平台上报
    track(event, actions) {
        if (actions instanceof Object) {

            //处理所有手动传递过来的参数
            let allLogData = {
                page_id: event || '',
                click_props: {}
            };

            for (let actionKey in actions) {
                if (actions.hasOwnProperty(actionKey)) {
                    if (OUTER_KEY[actionKey]) {
                        allLogData[actionKey] = actions[actionKey];
                    }
                    else {
                        allLogData.click_props[actionKey] = String(actions[actionKey]);
                    }
                }
            }

            allLogData = Object.assign(allLogData, this.defaultBrowserParam(), this.defaultUserInfo(), this._lgSaRegister);

            let uploadLogImg = new Image();
            uploadLogImg.src = `${SA_SERVER}?plat=PC&data=${encodeURIComponent(JSON.stringify(allLogData))}`;
        } else {
            console.warn('error type: not standard object!');
        }
    }

    //神策上报和平台上报两种
    twoPlatTrack(event, actions = {}) {
        this.track(event, actions);
        this.saTrack(event, actions);
    }
}
export let lgsa_new = new LgSa({ platform: 'edudata' });
window.lgsa_new = lgsa_new;

