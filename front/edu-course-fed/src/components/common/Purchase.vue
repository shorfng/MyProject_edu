<template>
    <div>
        <Toast
            :show="isShowToast"
            :msg="toastStr"
            @onHide="hideToast"
        />
        <PC
            :show="PCpurchaseSuccess"
            @hideQrcode="hideSuccessModal"
        />
        <WeChat
            :show="isWXPurchaseSuccess"
            @hideWXPurchaseSuccess="hideSuccessModal"
        />
        <alert
            :show="isShowPurchaseAlert"
            :current-environment="currentEnvironment"
            @hideWXPurchaseSuccess="hideSuccessModal"
        />
        <H5Accompany
            :join-info="joinInfo"
            :show="isH5Accompany"
            @confirmLink="confirmLink"
        />
        <PCAccompany
            :join-info="joinInfo"
            :show="isPCAccompany"
            @confirmLink="confirmLink"
        />
        <GoodsTakeOff
            :show="isGoodsTakeOff"
        />
        <Confirm
            :show="isShowConfirm"
            :msg="confirmMsg"
            @close="closeConfrim"
        />
        <PcAllDirlog
            :visible="showPcDirlog"
            :type="PcDirlogType"
            @close="closeDirlog"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LgPay from '../../common/modules/lg-pay';
const lgPay = new LgPay();
import { querystring } from 'vux';
import { browserName, OSName } from '../../common/js/userAgent/browser-name-and-OS.js';
import { isApp } from '../../common/js/userAgent/getVersion';

import Alert from '../../common/components/PurchaseSuccess/Alert';
import WeChat from '../../common/components/PurchaseSuccess/WeChat';
import PC from '../../common/components/PurchaseSuccess/PC';
import H5Accompany from '../../common/components/PurchaseSuccess/H5Accompany';
import PCAccompany from '../../common/components/PurchaseSuccess/PCAccompany';
import GoodsTakeOff from '../../common/components/PurchaseSuccess/GoodsTakeOff';
import Confirm from '../../common/components/Confirm/Index';
import PcAllDirlog from '../sale/PcAllDirlog';

import { fetchAuthCheck, fetchConfirmAccompany } from '../../common/service/getAuthCheck';
import { fetchSuccessUrlV2 } from '../../service';
import { setLocalStorage, getLocalStorage } from '@js/util/localStorage';
import { getParam, parseObjToUrl } from '@js/util/getParam';
import { triggerLoginPop, switchNeedToTriggerBuy } from '@js/pcLoginAutoBuy';
export default {
    name: 'Purchase',
    components: {
        Alert,
        WeChat,
        PC,
        H5Accompany,
        PCAccompany,
        GoodsTakeOff,
        Confirm,
        PcAllDirlog
    },
    props: {
        isShowPurchaseAlert: {
            type: Boolean,
            default: false
        },
        // 来源
        source: {
            type: String,
            default: ''
        }
    },
    data() {
        let currentEnvironment = 'PC';
        if (['Android', 'iOS'].indexOf(OSName) !== -1) {
            currentEnvironment = 'H5';
            if (browserName === 'WX') {
                currentEnvironment = 'WX';
            } else if (isApp()) {
                currentEnvironment = 'app';
            }
        }
        return {
            PCpurchaseSuccess: false,
            currentEnvironment,
            joinInfo: {},
            isWXPurchaseSuccess: false,
            isH5Accompany: false,
            isPCAccompany: false,
            isGoodsTakeOff: false,
            isShowConfirm: false,
            confirmMsg: '课程信息有修改，请刷新页面查看最新信息',
            showPcDirlog: false,
            PcDirlogType: 'soldOut',
            isRepeatSubmit: false
        };
    },
    created() {
        let that = this;
        console.log('created window.lgBridge', window.lgBridge);
        window.lgBridge && window.lgBridge.response('nativePurchaseCallback', function (data, response, ext) {
            window.enterNewPage = false;
            console.log('nativePurchaseCallback', that.$router);
            that.$router.replace({
                path: `/saled`,
            });
            setTimeout(() => {
                that.setPurchaseSuccess();
            }, 2500);
        });
    },
    computed: {
        ...mapGetters([
            'isTriggerPurchase',
            'playerStatus',
            'isAccompanyCourse',
            'isShowAccompanyModal',
            'courseInfo',
            'purchasePortIsFetch',
            'hasPurchaseClass',
            'isNativeAudioPlay',
            'userInfo',
            'isLogin'
        ])
    },
    watch: {
        isTriggerPurchase: {
            handler(val, oldVal) {
                console.log('watch isTriggerPurchase++', val);
                if (val && !oldVal) {
                    !this.isNativeAudioPlay && this.playerStatus.isPlaying && this.setLessonPlayer({
                        id: this.playerStatus.id,
                        isPlaying: false
                    });
                    this.gotoPurchaseClass();
                }
            },
            immediate: true,
        },
        isShowAccompanyModal(val) {
            if (val) {
                this.getBuyCourseStatus();
                this.resetAccompanyModal();
            }
        },
        purchasePortIsFetch(val) {
            if (val && this.currentEnvironment === 'PC') {
                this.switchNeedAutoPay();
            }
        },
    },
    mounted() {
        let urlParamer = getParam();
        if (urlParamer.needBuy == 1 && this.currentEnvironment === 'WX') {
            this.redirectToLogin();
            return;
        }
        this.goToSuccess();
    },
    methods: {
        ...mapActions([
            'triggerPurchase',
            'resetPurchaseStatus',
            'setLessonPlayer',
            'setPurchaseSuccess',
            'resetAccompanyModal',
            'setH5LoginModalStatus'
        ]),
        closeConfrim() {
            document.location.reload();
        },
        gotoPurchaseClass() {
            console.log('gotoPurchaseClass_____', this.isLogin);
            if (this.isLogin) {
                this.setHistoryState();
                this.payCourse();
            } else {
                if (this.currentEnvironment === 'WX') {
                    this.wxLoginToBuy();
                    return;
                } else {
                    this.redirectToLogin();
                }
            }
            this.resetPurchaseStatus();
        },
        setHistoryState() {
            let isPC = this.currentEnvironment === 'PC';
            const urlParam = querystring.parse();
            if (!isPC && urlParam.payNow) {
                delete urlParam.payNow;
                const searchUrl = querystring.stringify(urlParam);
                window.history.replaceState(null, null, `${window.location.pathname}?${searchUrl}`);
            }
        },
        redirectToLogin() {
            if (this.currentEnvironment === 'PC') {
                this.setH5LoginModalStatus({
                    showH5LoginModal: true,
                    showH5LoginModalType: 'distribution'
                });
                return;
            }
            else {
                this.goToH5Pay();
            }
        },
        goToH5Pay() {
            let { id } = this.courseInfo;
            lgPay.submitV2({
                goodsId: id,
                expandInfo: window.location.href
            }, {
                payScenesKey: 'kai_wu'
            }).then((response) => {
                if (response.orderNo && (response.orderStatus === 'SUCCESS' || response.orderStatus === 'PAID')) {
                    fetchSuccessUrlV2({ goodsOrderNo: response.orderNo }).then((res) => {
                        if (res.state === 1) {
                            const url = this.setHashUrl(res.content);
                            const punctuation = url.finalString.indexOf('?') == -1 ? '?' : '&';
                            window.location.href = `${url.finalString + punctuation}hasPurchaseClass=true${url.hashString}`;
                            return;
                        }
                    });
                }
            });
            // window.location.href = `https://activity.lagou.com/app/pay/lg-buy-edu.html?${parseObjToUrl({
            //     payLagouCoinNum: Number(lgCoinPrice),
            //     sellGoodsPriceId,
            //     expandInfo
            // })}`;
        },
        // 设置url
        setHashUrl(url) {
            let hashString = '';
            let finalString = url;
            if (url.indexOf('#') > -1) {
                const hashArr = url.split('#');
                hashString = `#${hashArr[1]}`;
                finalString = hashArr[0];
            }
            return { finalString, hashString };
        },
        switchNeedAutoPay() {
            let payData = switchNeedToTriggerBuy();
            console.log('switchNeedAutoPay', payData);
            if (payData && !this.hasPurchaseClass) {
                this.payCourse();
            }
        },
        payCourse() {
            console.log('payCourse++++++++');
            let { id } = this.courseInfo;

            let expandInfo = `${window.location.href}`;
            if (this.isRepeatSubmit) return;
            if (this.isApp) {
                this.isRepeatSubmit = true;
                setTimeout(() => {
                    this.isRepeatSubmit = false;
                }, 2000);
            }
            lgPay.submitV2({
                goodsId: id,
                expandInfo
            }, {
                payScenesKey: 'kai_wu'
            }).then((response) => {
                if (response.source === lgPay.PAY_TYPE.pc) {
                    window.location.reload();
                }
            }).catch(err => {
                console.log('lgPay', err);
                let repeatOrder = 70002;
                let priceChange = 60205;
                // 商品下架
                let goodsTakeOff = [60701, 60702];
                // 更换包装会触发系统错误
                let systemError = -1;
                let { status, data } = err;
                if (status === repeatOrder) {
                    // 如果是包装页的 特殊处理
                    if (this.source === 'salePage') {
                        this.$emit('repeatPurchase');
                        return;
                    }
                    this.showToast('该课程已付款，快开始学习吧');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
                else if (status === priceChange) {
                    this.showToast('课程价格发生变化');
                    this.discounts = `${data.discounts}`;
                    this.price = `${data.price}`;
                    this.courseInfo.lgCoinPrice = data.discounts;
                    this.payCourse();
                }
                else if (goodsTakeOff.indexOf(status) >= 0) {
                    if (this.isPc) {
                        this.showPcDirlog = true;
                        this.PcDirlogType = 'soldOut';
                    } else {
                        this.isGoodsTakeOff = true;
                    }
                }
                else if (status === systemError) {
                    if (this.isPc) {
                        this.showPcDirlog = true;
                        this.PcDirlogType = 'confirm';
                    } else {
                        this.isShowConfirm = true;
                    }
                }
            });
        },
        getBuyCourseStatus() {
            if (!this.isLogin) {
                return;
            }
            fetchAuthCheck().then(res => {
                let { state, content } = res.data;
                console.log('购买成功回调 res: ', res);
                console.log('this.source: ', this.source);
                let isPurchase = true;
                // 课程已购买，未确认
                if (state === 2001) {
                    console.log('购买成功 2001', this.isAccompanyCourse, this.currentEnvironment);
                    this.setPurchaseSuccess();
                    if (this.isAccompanyCourse) {
                        this.joinInfo = content.joinInfo;
                        if (this.currentEnvironment === 'PC') {
                            this.isPCAccompany = true;
                        }
                        else if (this.currentEnvironment === 'WX') {
                            let name = 'saled';
                            this.$router.push({
                                name
                            });
                        }
                        else {
                             this.isH5Accompany = true;
                        }
                    }
                }
                else if (state === 1) {
                    console.log('购买成功 1', this.currentEnvironment);
                    this.setPurchaseSuccess();
                    if (this.currentEnvironment === 'PC') {
                        this.PCpurchaseSuccess = true;
                    }
                    else if (this.currentEnvironment === 'WX') {
                        // 非包装页去购买成功页
                        if (this.source !== 'salePage') {
                            this.$router.push({
                                path: `/saled`,
                            });
                        }
                    }
                    else if (!this.isApp) {
                        this.isShowPurchaseAlert = true;
                    }
                }
                else {
                    isPurchase = false;
                }
                let { page_id, props } = window.trackPurchase;
                isPurchase && page_id && props && this.twoPlatTrack(page_id, props);
            });
        },
        stopTouchmovePropagation(event) {
            event.preventDefault();  //阻止默认行为
            event.stopPropagation(); //阻止冒泡
        },
        hideSuccessModal() {
            this.PCpurchaseSuccess = false;
            this.isWXPurchaseSuccess = false;
            this.isShowPurchaseAlert = false;
            window.location.reload();
        },
        hideWXPurchaseSuccess() {
            this.emit('hideWXPurchaseSuccess');
        },
        confirmLink() {
            this.isH5Accompany = false;
            this.isPCAccompany = false;
            fetchConfirmAccompany();
        },
        wxLoginToBuy() {

            // this.setH5LoginModalStatus({ showH5LoginModal: true, showH5LoginModalType: 'pay' });
            console.log('wxLoginToBuy+++++');
            let urlParamer = getParam();

            if (urlParamer.needBuy == 1) {
                this.redirectToLogin();
                return;
            }

            if (urlParamer.wxinfo) {
                delete urlParamer.wxinfo;
            }
            if (urlParamer.wxinfo) delete urlParamer.needBuy;
            urlParamer.courseId = this.courseInfo.id;
            let paramerString = parseObjToUrl(urlParamer);
            let { origin, pathname } = window.location;
            let expandInfo = `${origin}${pathname}?wxinfo=2&needBuy=1&${paramerString}`;
            console.log(`${expandInfo}`);
            window.location.replace(expandInfo);
            return;
        },
        closeDirlog() {
            this.showPcDirlog = false;
        },
        goToSuccess() {
            let { hasPurchaseClass = '' } =  getParam();
            console.log('goToSuccess this.$route.name: ', this.$route.name);
            console.log('getLocalStorage("successShowType"): ', getLocalStorage('successShowType'));
            if (hasPurchaseClass === 'true') {
                this.$router.push({
                    path: `/saled`,
                });
            }
        }


    }
};
</script>

<style lang="less">
</style>
