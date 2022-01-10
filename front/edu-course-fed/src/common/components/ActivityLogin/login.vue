<template>
    <div class="login-module">
        <div class="phone-wrap">
            <div
                class="country-code-wrap"
                @click="showCountryCode"
            >
                <div class="country-code-text">
                    +{{ countryCode }}
                </div>
                <img
                    class="country-code-icon"
                    src="~@/assets/public-class/icon.png"
                >
            </div>
            <input
                v-model="phoneValue"
                type="text"
                placeholder="请输入常用手机号"
                class="phone-input"
                @focus="changefocus"
                @blur.prevent="blur"
            >
            <div
                v-show="showClearInput"
                class="clear-input"
                @click="clearInput"
            />
        </div>
        <div
            class="verify-wrap"
        >
            <input
                v-model="codeValue"
                type="text"
                placeholder="请输入收到的验证码"
                class="verify-input"
                maxlength="6"
                @focus="changefocus"
                @blur.prevent="blur"
            >
            <div
                class="get-verify-code"
                @click="startSense"
            >
                {{ identifyingCodeSecond>0?(identifyingCodeSecond + 's 后重试'):'获取验证码' }}
            </div>
        </div>
        <div
            v-if="!hideButton"
            :class="{'submit-button':true,'active': inputIsFull}"
            @click="submit"
        >
            登录
        </div>
        <div
            v-show="errorTips.show"
            class="error-tips"
        >
            {{ errorTips.text }}
        </div>
        <CountryCodeList
            :show-list="showCountryCodeList"
            @selectItem="selectCountryCode"
        />
        <iframe
            v-if="isLoginSuccess"
            class="load-iframe"
            src="/frontLogin.do"
            @load="loginSuccessCallback"
        />
    </div>
</template>
<script>
import { fetchPhoneCode, submitPassWord } from '@service/login';
import { getParam } from '@js/util/getParam';
import { validateCodeNumber, validatePhoneNumber } from '@js/util/util';
import CountryCodeList from '@/common/components/Login/CountryCodeList';
import { OSName } from '@/common/js/userAgent/browser-name-and-OS';
export default {
    components: {
        CountryCodeList,
    },
    props: {
        fetchVerifycode: {
            type: Function,
            default: fetchPhoneCode
        },
        verifyCodeParams: {
            type: Object,
            default: () => {
                return {
                };
            }
        },
        hideButton: {
            type: Boolean,
            default: false
        },
        needRefreshPage: {
            type: Boolean,
            default: false
        },
        loginSuccessCallback: {
            type: Function,
            default: function () {}
        },
        blur: {
            type: Function,
            default: function () {
                if (OSName === 'iOS') {
                    setTimeout(() => {
                    const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
                    }, 0);
                }
            }
        },
        changefocus: {
            type: Function,
            default: function (el) {
               if (OSName === 'Android') {
                   // 安卓键盘弹出是个缓动的过程，不同机型弹出过程时间也不一样
                   window.onresize = () => {
                        el.target.scrollIntoViewIfNeeded(true);
                        el.target.scrollIntoView(true);
                   };
                }
            }
        }
    },
    data() {
        return {
            phoneValue: '',
            codeValue: '',
            showClearInput: false,
            countryCode: '0086',
            isLoginSuccess: false,
            challenge: '',
            errorTips: {
                show: false,
                text: ''
            },
            phoneCodeStateList: {
                1: { message: '验证码已发送，请查收短信' },
                201: { message: '请输入手机号码' },
                203: { message: '输入号码与归属地不匹配' },
                204: { message: '系统错误' },
                205: { message: '输入号码与归属地不匹配' },
                206: { message: '系统错误' },
                207: { message: '验证码达到发送上限（5次），无法继续发送' },
                208: { message: '验证码发送太过频繁，请稍后再试' },
                209: { message: '该手机已被注册，请重新输入或直接登录' },
                210: { message: '请输入有效的手机/邮箱' },
                211: { message: '请输入6-16位密码，字母区分大小写' },
                220: { message: '请输入已验证手机/邮箱' },
                222: { message: '该手机号未注册' },
                241: { message: '请输入密码' },
                402: { message: '获取验证码超时，请稍后再试' },
                400: { message: '验证码错误' },
                10010: { message: '图形验证码不正确' },
                10011: { message: '操作过于频繁，请联系管理员' },
                10012: { message: '操作过于频繁，请联系管理员' }
            },
            showCountryCodeList: false,
            identifyingCodeSecond: 0
        };
    },
    computed: {
        inputIsFull: data => data.phoneValue.length > 0 && data.codeValue.length > 0,
    },
    watch: {
        phoneValue(data) {
            this.showClearInput = data.length > 0;
            if (this.errorTips.show) {
                this.setErrorTip();
            }
        },
        codeValue() {
            if (this.errorTips.show) {
                this.setErrorTip();
            }
        }
    },
    mounted() {
    },
    methods: {
        clearInput() {
            this.phoneValue = '';
        },
        startSense() {
            if (!this.validatePhone() || this.identifyingCodeSecond > 0) return;
        },
        getCode() {
            const paramData = {
                countryCode: this.countryCode,
                phone: this.phoneValue,
                type: 0,
                challenge: this.challenge
            };
            this.fetchVerifycode(Object.assign(
                paramData,
                this.verifyCodeParams
            )).then(res => {
                console.log(JSON.stringify(res));
                if (res.state === 1) {
                    this.setTimeOfCode();
                    return;
                }
                this.setRequestError(res);
            }).catch(() => {
                this.setErrorTip('获取验证码失败，稍后重试');
            });
        },
        selectCountryCode(item) {
            this.countryCode = item;
            this.showCountryCodeList = false;
        },
        showCountryCode() {
            this.showCountryCodeList = true;
        },
        validatePhone() {
            let message = '';
            if (this.phoneValue) {
                if (validatePhoneNumber(this.phoneValue)) {
                    return true;
                } else {
                    message = '手机格式不正确，请重新输入';
                }
            } else {
                message = '请输入手机号码';
            }
            this.setErrorTip(message);
            return false;
        },
        validateCode() {
            let message = '';
            if (this.codeValue) {
                if (validateCodeNumber(this.codeValue)) {
                    return true;
                } else {
                    message = '请输入正确的手机验证码';
                }
            } else {
                message = '请输入手机验证码';
            }
            this.setErrorTip(message);
            return false;
        },
        setErrorTip(text = '') {
            let show = !!text;
            this.errorTips = { show, text };
        },
        setTimeOfCode() {
            this.identifyingCodeSecond = 60;
            let identifyingCodeTimer = setInterval(() => {
                this.identifyingCodeSecond--;
                if (this.identifyingCodeSecond === 0) {
                    clearInterval(identifyingCodeTimer);
                }
            }, 1000);
        },
        setRequestError(res) {
            let messageTips = this.phoneCodeStateList[res.state] || res;
            this.setErrorTip(messageTips.message);
        },
        submit() {
            return new Promise((resolve, reject) => {
                if (!this.validatePhone() || !this.validateCode()) {
                    resolve({
                        state: 2,
                        msg: '校验不通过'
                    });
                } else {
                    let urlParam =  getParam();
                    let submitData = {
                        countryCode: this.countryCode,
                        wxinfo: '',
                        phone: this.phoneValue,
                        phoneVerificationCode: this.codeValue,
                    };
                    if (urlParam.wxinfo) {
                        submitData.wxinfo = urlParam.wxinfo;
                    }
                    return submitPassWord(submitData).then(res => {
                        if (res.state === 1) {
                            if (this.needRefreshPage) {
                                window.open('/frontLogin.do', '_self');
                                return;
                            } else {
                                this.isLoginSuccess = true;
                                return {
                                    state: 1,
                                    msg: '登陆成功'
                                };
                            }

                        }
                        this.setRequestError(res);
                        resolve({
                            state: 3,
                            msg: '提交请求失败',
                            content: res
                        });
                    }).catch(res => {
                        this.setErrorTip('登录失败,请稍后重试');
                        console.log('fetchPhoneCode error', res);
                        resolve({
                                state: 4,
                                msg: '登陆失败'
                        });
                    });

                }
            });
        },
        closeLoginModal() {
            this.$emit('close');
        },
  }
};
</script>
<style lang="less">
    .load-iframe {
        width: 0;
        height: 0;
        border: none;
    }
    .login-module{
        .phone-wrap{
            position: relative;
            // background: #F8F9FA;
            box-sizing: border-box;
            margin-top: 40px;
            margin-bottom: 28px;
            // line-height: 100px;
            border-radius: 6px;
        }
        .country-code-wrap{
            position: absolute;
            left: 40px;
            bottom: 0;
            z-index: 2;
            width:140px;
            line-height:40px;
            padding: 30px 40px 30px 0;
            font-size:28px;
            text-align: left;
            color: #333333;
        }
        .phone-input{
            width: 100%;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            padding:30px 80px 30px 180px;
            font-size:28px;
            color: #333;
            border: 0;
            outline: none;
            background: #F8F9FA;
            height: 100px;
            border-radius: 6px;
            caret-color: #FBC546;
            position: relative;
            &::placeholder {
                color: #CCCCCC;
                font-size: 28px;
            }
        }
        .verify-wrap{
            position: relative;
             border-radius: 6px;
        }
        .get-verify-code{
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: 2;
            width: 220px;
            padding: 30px 40px 30px 0;
            font-size:28px;
            line-height:40px;
            color: #666666;
            text-align: right;
        }
        .verify-input{
            width: 100%;
            outline: none;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            padding: 0 40px;
            font-size:28px;
            color: #333;
            border: 0;
            padding: 30px 40px;
            position: relative;
            background: #F8F9FA;
            caret-color: #FBC546;
            border-radius: 6px;
            height: 100px;
            &::placeholder {
                color: #CCCCCC;
                font-size: 28px;
            }
        }
        .submit-button{
            width:100%;
            height:88px;
            background:rgba(251,197,70,.5);
            border-radius:44px;
            margin: 0 auto;
            margin-top: 30px;
            font-size:34px;
            color:#FFFFFF;
            text-align: center;
            line-height: 88px;
            &.active{
                background: #FBC546;
                color: #333333
            }
        }
        .error-tips{
            padding-top: 20px;
            text-align: left;
            color: #FF0000;
            font-size: 22px;
        }
        .clear-input{
            width: 32px;
            height: 32px;
            background: url('~@/assets/h5-login-modal/clear.png') no-repeat;
            background-size: auto 100%;
            position: absolute;
            right: 40px;
            bottom: 30px
        }
        .flow-icon{
            width: 16px;
            height: 16px;
            background: url('~@/assets/h5-login-modal/triangle.png') no-repeat;
            background-size: 100% 100%;
            margin-left: 8px;
            margin-top: 10px;
            float: left;
        }
        .flow-text{
            float: left;
        }
        .country-code-text{
            position: relative;
        }
        .country-code-icon{
            width: 16px;
            height: 10px;
            vertical-align: middle;
            position: absolute;
            top: 45px;
            right: 60px;
            z-index: 1;
        }

    }
</style>

