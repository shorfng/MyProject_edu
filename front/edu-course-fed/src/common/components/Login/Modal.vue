<template>
    <div>
        <Alert
            :value="show"
            class="h5-login-modal-wrap"
            title=""
            button-text=""
        >
            <div class="push-modal-wrap">
                <div class="title-text">
                    登录拉勾教育
                </div>
                <div class="phone-wrap">
                    <div
                        class="country-code-wrap"
                        @click="showCountryCode"
                    >
                        <div class="flow-text">
                            {{ countryCode }}
                        </div>
                        <div class="flow-icon" />
                    </div>
                    <input
                        v-model="phoneValue"
                        type="text"
                        placeholder="请输入常用手机号"
                        class="phone-input"
                        @blur="blur"
                    >
                    <div
                        v-show="showClearInput"
                        class="clear-input"
                        @click="clearInput"
                    />
                </div>
                <div class="verify-wrap">
                    <input
                        v-model="codeValue"
                        type="text"
                        placeholder="请输入收到的验证码"
                        class="verify-input"
                        maxlength="6"
                        @blur="blur"
                    >
                    <div
                        class="get-verify-code"
                        @click="startSense"
                    >
                        {{ identifyingCodeSecond>0?(identifyingCodeSecond + 's 后重试'):'获取验证码' }}
                    </div>
                </div>
                <div
                    v-show="errorTips.show"
                    class="error-tips"
                >
                    {{ errorTips.text }}
                </div>
                <div
                    :class="{'submit-button':true,'active':inputIsFull}"
                    @click="submit"
                >
                    登录
                </div>
            </div>
            <div
                v-if="showCloseBtn"
                class="close-button"
                @click="closeLoginModal"
            />
        </Alert>
        <CountryCodeList
            :show-list="showCountryCodeList"
            @selectItem="selectCountryCode"
        />
    </div>
</template>

<script>
import { Alert } from 'vux';
import { fetchPhoneCode, submitPassWord } from '@service/login';
import { setLocalStorage, getLocalStorage } from '@js/util/localStorage';
import { getParam } from '@js/util/getParam';
import { browserName } from '@js/userAgent/browser-name-and-OS.js';
import { docCookies } from '@js/util/cookie.js';
import CountryCodeList from './CountryCodeList';

export default {
    name: 'LoginModal',
    components: {
        Alert,
        CountryCodeList
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        showCloseBtn: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            phoneValue: '',
            codeValue: '',
            showClearInput: false,
            errorTips: {
                show: false,
                text: ''
            },
            countryCode: '0086',
            challenge: '',
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
            identifyingCodeSecond: 0,
            isFetching: false
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
    methods: {
        clearInput() {
            this.phoneValue = '';
        },
        startSense() {
            if (!this.validatePhone() || this.identifyingCodeSecond > 0) return;
            if (this.isFetching) {
                return;
            }
            this.isFetching = true;
        },
        getCode() {
            fetchPhoneCode({
                countryCode: this.countryCode,
                phone: this.phoneValue,
                type: 0,
                challenge: this.challenge
            }).then(res => {
                if (res.state === 1) {
                    this.isFetching = false;
                    this.setTimeOfCode();
                    return;
                }
                this.isFetching = false;
                this.setRequestError(res);
            }).catch(() => {
                this.setErrorTip('获取验证码失败，稍后重试');
                this.isFetching = false;
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
                if (/^\d{5,11}$/.test(this.phoneValue)) {
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
                if (/^[0-9]{6,6}$/.test(this.codeValue)) {
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
            if (!this.validatePhone() || !this.validateCode()) return;
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
            submitPassWord(submitData).then(res => {
                if (res.state === 1) {
                    window.open('/frontLogin.do', '_self');
                    return;
                }
                this.setRequestError(res);
            }).catch(res => {
                this.setErrorTip('登录失败,请稍后重试');
                console.log('fetchPhoneCode error', res);
            });

        },
        closeLoginModal() {
            this.$emit('close');
        },
        blur() {
            // let scrollTop = Math.abs(this.showH5LoginModalSelfTop);
            let scrollTop = 0;
            document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
        }
    }
};
</script>

<style scoped lang="less">
    .h5-login-modal-wrap{
        /deep/ .weui-dialog__hd{
            display: none;
        }
        /deep/ .weui-dialog__ft{
            display: none;
        }
        /deep/ .weui-dialog__bd{
            padding:0;
        }
        /deep/ .weui-dialog{
            background: rgba(255,255,255,0)
        }
        .push-modal-wrap{
            border-radius: 10px;
            background: #FFFFFF;
            padding:60px;
        }
        .close-button{
            width: 71px;
            height: 71px;
            margin: 70px auto 0;
            background: url('../../../assets/distribution-sell/close.png') no-repeat;
            background-size: 100% 100%;
        }
        .title-text{
            color: #333333;
            font-weight:500;
            text-align: center;
            font-size:34px;
            margin-bottom: 40px;
        }
        .phone-wrap{
            position: relative;
            margin-bottom: 30px;
        }
        .country-code-wrap{
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 2;
            width:120px;
            padding: 40px 0 20px 0;
            font-size:28px;
            line-height:40px;
            text-align: left;
            color: #333333;
        }
        .phone-input{
            width: 100%;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            padding: 19px 36px 20px 120px;
            font-size:28px;
            color: #333;
            border: 0;
            outline: none;
            border-bottom: 1px solid rgba(230,230,230,0.5);
            &::placeholder {
                color: #CCCCCC;
                font-size: 28px;
            }
        }
        .verify-wrap{
            position: relative;
        }
        .get-verify-code{
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: 2;
            width: 220px;
            padding: 40px 0 20px 0;
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
            padding: 19px 220px 20px 0;
            font-size:28px;
            color: #333;
            border: 0;
            border-bottom: 1px solid rgba(230,230,230,0.5);
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
            background: url('../../../assets/h5-login-modal/clear.png') no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: 0;
            bottom: 24px
        }
        .flow-icon{
            width: 16px;
            height: 16px;
            background: url('../../../assets/h5-login-modal/triangle.png') no-repeat;
            background-size: 100% 100%;
            margin-left: 8px;
            margin-top: 10px;
            float: left;
        }
        .flow-text{
            float: left;
        }
    }

</style>
