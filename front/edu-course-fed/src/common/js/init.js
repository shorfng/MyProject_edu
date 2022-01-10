/**
 * 公共import的一些包和全局的配置
 */
import Vue from 'vue';
import axios from 'axios';
import axiosUtils from '@/service/index';
import VueAxios from 'vue-axios';
import vueTouch from 'vue-plugin-touch';
import * as Cookies from 'js-cookie';
import GLOBAL_DOMAIN from './util/GLOBAL_DOMAIN';

import '../css/reset.less';
import './flexible';
import '../js/APP/action';
// import '../js/track/sensors';
import { getParam, parseObjToUrl } from '../js/util/getParam';
import {  isApp } from './userAgent/getVersion';
import {  getEnvironment, browserName } from './userAgent/browser-name-and-OS';
// import '../js/track/lg-sa-track';
Vue.use(vueTouch);
Vue.use(VueAxios, axiosUtils);

Vue.config.productionTip = false;
const userAgent = navigator.userAgent;
const isPc = !/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(userAgent);
const reg = new RegExp(/lagou\/\S*/gi);
const eduReg = new RegExp(/lgedu\/\S*/gi);
const isAPP = isApp();
const isLgApp = reg.test(userAgent);
const isEduApp = eduReg.test(userAgent);
const lagouEduTheme = !isPc && !isLgApp;
// const isEduApp = true;

Vue.mixin({
    data() {
        const ret = {};
        if (this.GLOBAL_DOMAIN) {
            return ret;
        }
        ret.isPc = isPc;
        ret.isApp = isAPP;
        ret.isLgApp = isLgApp;
        ret.isEduApp = isEduApp;
        ret.GLOBAL_DOMAIN = GLOBAL_DOMAIN;
        ret.lagouEduTheme = lagouEduTheme;
        ret.currentEnvironment = getEnvironment();
        ret.isShowToast = false;
        ret.toastStr = '';
        return ret;
    },
    created() {
        this.saLogin();
    },
    methods: {
        twoPlatTrack(events, props = {}) {
        },
        // eduPlatTrack(events, props = {}) {
        //     lgSa.eduPlatTrack(events, Object.assign({
        //         sid: `${getParam('sid') || ''}`
        //     }, props), true);
        // },
        eduPlatTrack(events, props = {}) {

        },
        saLogin() {
            let { id } = window.userInfo;
            if (id) {
                window.sa && window.sa.login(id);
            } else {
                let first_id = window.sa && window.sa.store && window.sa.store.getFirstId();
                window.sa && first_id && window.sa.logout(true);
            }
        },
        hideToast() {
            this.isShowToast = false;
        },
        showToast(str) {
            this.toastStr = str;
            this.isShowToast = true;
        },

        wxInfoTrigger() {
            if (browserName != 'WX' || window.userInfo.id) {
                return;
            }
            let urlParamer = getParam();

            if (urlParamer.wxinfo) {
                delete urlParamer.wxinfo;
                return;
            }
            let paramerString = parseObjToUrl(urlParamer);
            let { origin, pathname } = window.location;
            let expandInfo = `${origin}${pathname}?wxinfo=2&${paramerString}`;
            window.location.replace(expandInfo);
        }
    }
});

Vue.directive('c', {
    bind: function (el, binding, vnode) {
        el.className = isPc ? `${binding.value}-pc` : binding.value;
    }
});
Vue.directive('clickoutside', {
    bind(el, binding, vnode) {
        function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    },
});
// 防重复点击
Vue.directive('preventReClick', {
    bind(el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true;
                setTimeout(() => {
                    el.disabled = false;
                }, binding.value || 2000);
            }
        });
    }
});
let { userInfo = {} } = window;

