module.exports = {
    math: {
        div: function (num1, num2) {
            return num1 / num2;
        },
        ceil: function (num) {
            return Math.ceil(num);
        },
        floor: function (num) {
            return Math.floor(num);
        },
        toDouble: function (num) {
            var numStr = num.toString();
            if (numStr.indexOf('.') == -1) {
                numStr += '.0';
            }
            return numStr;
        }
    },

    dynamicAddress: {
        getStaticDomain: function () {
            return 'www.lgstatic.com';
        }
    },

    display: {
        truncate: function (str, length, suffix) {
            if (!str) {
                return '';
            }
            return str.length <= length ? str : str.substr(0, length - suffix.length) + suffix;
        }
    },

    stringUtils: {
        replace: function (s, reg, rep) {
            return s.replace(reg, rep);
        }
    },

    StringUtils: {
        isEmpty: function (str) {
            return !str;
        }
    },
    stringTool: {
        getPlainText: function (html) {
            return html.replace(/<\/?[^>]*>/g, '');
        },
        truncate: function (str, length, suffix) {
            return str.length <= length ? str : str.substr(0, length) + suffix;
        },
        isBlank: function (param) {
            return !param;
        },
        isNotBlank: function (param) {
            return !!param;
        },
        substring: function (str, i, j) {
            return (String(str)).substring(i, j);
        },
        contains: function (baseStr, detectedStr) {
            return baseStr.indexOf(detectedStr) >= 0;
        }
    },

    userInfoTool: {
        permissions: {
            COMPANY_SETTING: true
        },
        isPlusUser: function () {
            return false;
        },
        isPlus: function () {
            return true;
        },
        candidateListShowSpecial: function () {
            return true;
        },
        isHaveConsumableGoods: function () {
            return false;
        },
        isBindLagou: true,
        getCompanyName: function () {
            return '拉勾测试润石有限公司';
        },
        getCompanyId: function () {
            return 29013;
        },
        getUserLevel: function () {
            return 0;
        },
        getUserId: function () {
            return 560162;
        },
        getPortrait: function () {
            return 'static/dashboard/modules/common/img/avatar.png';
        },
        getName: function () {
            return '赵官家';
        },
        getCompanyApprove: function () {
            return 0;
        },
        getCompanyManager: function () {
            return 0;
        },
        isMyCompany: function () {
            return true;
        },
        getOnlinePositionNum: function () {
            return 7; // 在线职位数
        },
        getPublishPositionNumInGoodsCycle: function () {
            return 40; // 已发布职位数
        },
        getContract: function () {
            return { /* 合约信息 */
                startTime: '2017-01-01',
                endTime: '2017-03-07',
                startTimeStr: '2017-01-01',
                endTimeStr: '2017-03-07'
            };
        },
        isPlusCompany: function () {
            return true;
        },

        onlinePositionNum: function (isSchoolJob) {
            return isSchoolJob ? 10 : 5;
        },
        createPositionNum: function (isSchoolJob) {
            return isSchoolJob ? 10 : 5;
        },
        getPositionCreateLimit: function (isSchoolJob) {
            return isSchoolJob ? 2 : 2;
        },
        getPositionOnlineLimit: function (isSchoolJob) {
            return isSchoolJob ? 2 : 2;
        },
        getUserCreateTime: function () {
            return 1497023000000; // 2017-6-10 1497024000000
        },
        getHRAuthStatus: function () {
            return 0;
        },
        getCompanyAuthStatus: function () {
            return 0;
        },
        refreshCoolDownTime: function () {
            return 24;
        },
        getPlusPrivilegePositionInfo: function () {
            return {
                plusPrivilegePosition: true,
                onlinePositionNum: 23,
                onlinePositionLimit: 15,
                contractManager: true
            };
        },
        lockPositionOperation: function () {
            return false;
        }
    },

    staffTool: {
        getStaffId: function () {
            return 65665;
        },
        getLevel: function () {
            return 1;
        },

        getLagouId: function () {
            return 2323561;
        },
        isYunUser: function () {
            return true;
        },
        isBindLagou: function () {
            return false;
        },
        getCompanyName: function () {
            return '拉勾测试润石有限公司';
        },
        getCompanyShortName: function () {
            return '拉勾测试润石有限公司';
        },
        getPermissions: function () {
            return {
                'STAFF': true,
                'OFFER': true,
                'ATTENDANCE': true,
                'REMUNERATION': true,
                'APPROVAL': true
            };
        },
        getName: function () {
            return '赵官家';
        },
        isShowStaff: function () {
            return true;
        },
        isYunUpgradeVersion: function () {
            return true;
        },
        getTaskNavBarStatistics: function () {
            return { 'noData': false, 'readNum': 0, 'unReadNum': 1, 'unReadTaskId': 1, 'noTask': false, 'rewardLeftNum': 0, 'rewardTotalNum': 0 };
        }

    },

    URLEncoder: {
        encode: function (url, charset) {
            return encodeURIComponent(url);
        }
    },

    dateTool: {
        /**
         * [format 前端模拟velocity模板日期格式化，但不完全一样。注：第二个参数测试时只能传时间戳]
         * @param  {[string]} prettify [日期格式，例：mm/dd或yyyy/mm/dd。注：目前只实现了这两种格式]
         * @param  {[number|string]} timeStr  [时间戳，例：144531851374]
         * @return {[string]}          [格式化的字符串，例：10/21或2014/10/20]
         */
        format: function (prettify, timeStr) {
            var regExp = /(Y{2,}\/)?M{2}\/D{2}/ig,
                time = new Date(),
                res = prettify || '',
                y,
                m,
                d;
            if (prettify) {
                if (isNaN(parseInt(timeStr))) {
                    return timeStr;
                } else {
                    time = new Date(timeStr);
                    m = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
                    d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
                    if ((/y{2,}\//ig).test(res)) {
                        y = time.getFullYear();
                        return y + '/' + m + '/' + d;
                    } else {
                        return m + '/' + d;
                    }

                }
            }
        },
        formatTime: function (dateStr) {
            function format(num) {
                var numStr = num.toString();
                return numStr.length == 1 ? '0' + numStr : numStr;
            }

            var date = new Date(dateStr);
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var now = new Date();
            if (year == now.getFullYear() &&
                month == now.getMonth() &&
                day == now.getDate()) {
                return format(hours) + ':' + format(minutes);
            }
            return year + '-' + format(month + 1) + '-' + format(day);
        },
        formatTimeStr: function (dateStr) {
            function format(num) {
                var numStr = num.toString();
                return numStr.length == 1 ? '0' + numStr : numStr;
            }

            var date = new Date(dateStr);
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var now = new Date();
            if (year == now.getFullYear() &&
                month == now.getMonth() &&
                day == now.getDate()) {
                return format(hours) + ':' + format(minutes);
            }
            return year + '-' + format(month + 1) + '-' + format(day);
        },
        getDay: function () {
            return new Date().getDate();
        },
        getMonth: function () {
            return new Date().getMonth();
        },
        getSystemTime: function () {
            return new Date().getTime();
        }
    },

    formatUtil: {
        formatDate: function (data) {
            return data;
        }
    },

    jsonUtil: {
        toJson: function (vObj) {
            return JSON.stringify(vObj);
        }
    },

    esc: {
        html: function (str) {
            if (!str || typeof str !== 'string') {
                return '';
            }

            var entityMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;'
            };

            return str.replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        },
        javascript: function (str) {
            if (!str || typeof str !== 'string') {
                return '';
            }

            var escapeMap = {
                "'": "\\'",
                '"': '\\"',
                '\\': '\\\\',
                '\/': '\\\/'
            };
            return str.replace(/[&<>"'\/]/g, function (s) {
                return escapeMap[s];
            });
        }
    },

    number: {
        number: function (str) {
            return (String(str)).replace(/[^0-9.e+-]+/ig, '');
        }
    },

    isCommunityAuthority: true,

    /* 页脚二维码 */
    commonAppCode: {
        'imgSrc': 'http://www.lagou.com/image2/M00/24/1D/CgqLKVaLdtWAKVC3AAEEpK9-Koc598.JPG',
        'width': 256,
        'height': 256
    },

    commonWeChatCode: {
        'imgSrc': 'http://www.lagou.com/image2/M00/18/45/CgpzWlZNl0qAZitPAABXEpAOJx0071.JPG',
        'width': 242,
        'height': 242
    },

    'antiSpiderRuleResult': {
        'isRequestLimit': false,
        'limitResponseCode': 403,
        'authInfo': '',
        'limitResponseMsg': '',
        'isPaidUser': false,
        'isAuthCompany': false,
        'isAuthUser': false,
        'isMyCompany': false,
        'hasPubOnlinePosition': false,
        'hasPubOnlinePositionInCurrentCompany': false,
        'isCooperatorCurrently': false,
        'isCompleteCooperator': false,
        'maxShowPage': 9
    },
    isGrayPhoneCallUser: true,
    remainTimes: 1,
    haveCallTimes: 2,
    positionCount: 7
};
