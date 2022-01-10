<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-11 15:10:36
 * @LastEditTime: 2019-08-13 01:10:42
 * @LastEditors: Please set LastEditors
 -->
<template>
    <div
        v-if="rewardStatus"
        class="modal"
    >
        <div class="load-img" />
        <div v-c="'content'">
            <div
                v-if="rewardStatus === 'unopened'"
                class="unopened"
            >
                <div class="unopen-title-content">
                    <div class="unopen-title">
                        {{ popCopywriter.topTitle }}
                    </div>
                    <div class="unopen-title">
                        {{ popCopywriter.title }}
                    </div>
                    <p class="unopen-subtitle">
                        {{ popCopywriter.subTitle }}
                    </p>
                </div>
                <div class="unopen-img" />
                <button
                    class="modal-btn"
                    @click="getReward"
                >
                    {{ popCopywriter.buttonText }}
                </button>
            </div>
            <div
                v-else-if="rewardStatus === 'reward'"
                class="reward"
            >
                <a
                    class="close-reward"
                    @click="closeModal"
                />
                <p class="reward-first">
                    {{ popCopywriter.topTitle }}{{ popCopywriter.title }}
                </p>
                <p class="reward-second">
                    {{ popCopywriter.subTitle }}
                </p>
                <div class="reward-coupon">
                    <div class="reward-coupon-content">
                        <div class="left-coupon">
                            <div class="coupon-name">
                                {{ couponCopywriter.name }}
                            </div>
                            <div class="coupon-tip">
                                {{ couponCopywriter.expirationTips }}
                            </div>
                        </div>
                        <div class="middle-line" />
                        <div class="right-coupon">
                            <div class="coupon-amount">
                                <span class="amount-character" />{{ couponCopywriter.amount }}<span class="amount-point">元</span>
                            </div>
                            <div class="coupon-threshold">
                                {{ couponCopywriter.threshold }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="reward-animate" />
                <button
                    class="reward-btn modal-btn"
                    @click="getRewardResult"
                >
                    {{ popCopywriter.buttonText }}
                </button>
            </div>
            <div
                v-else-if="rewardStatus === 'fail'"
                class="fail-modal"
            >
                <p class="fail-title">
                    {{ popCopywriter.title }}
                </p>
                <p class="fail-subTitle">
                    {{ popCopywriter.subTitle }}
                </p>
                <div class="fail-img" />
                <button
                    class="modal-btn fail-btn"
                    @click="closeModal"
                >
                    {{ popCopywriter.buttonText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchCouponStatus, fetchGiftReward } from '../service';

export default {
    name: 'GiftModal',
    data() {
        let Host = process.env.NODE_ENV === 'development' ? '.' : 'https://gate.lagou.com/v1/neirong';
        return {
            title: '',
            subtitle: '',
            buttonText: '',
            rewardStatus: false,
            couponCopywriter: {},
            giftRewardURL: '',
            giftResultURL: '',
            Host
        };
    },
    mounted() {
        let that = this;
        window.addEventListener('pageshow', function (event) {
            if (event.persisted || window.performance && window.performance.navigation.type == 2) {
                that.rewardStatus && window.location.reload();
                return;
            }
            else if (window.userInfo && window.userInfo.id) {
                that.getCouponStatus();
            }
        }, false);
    },
    methods: {
        getCouponStatus() {
            fetchCouponStatus().then(res => {
                let { state, content } = res.data;
                if (state === 1) {
                    if (content && content.popCopywriter && content.popCopywriter.href) {
                        this.giftRewardURL = content.popCopywriter.href;
                    }
                    Object.assign(this, { rewardStatus: 'unopened' }, content);
                    this.track('1n2t');
                }
            });
        },
        getReward() {
            this.track('1n2u');
            if (this.giftRewardURL) {
                this.closeModal();
                window.open(this.giftRewardURL);
                return;
            }
            let that = this;
            fetchGiftReward(this.couponId).then(res => {
                let { state, content } = res.data;
                if (content && content.popCopywriter && content.popCopywriter.href) {
                    this.giftResultURL = content.popCopywriter.href;
                }
                if (state === 1) {
                    Object.assign(this, { rewardStatus: 'reward' }, content);
                    this.track('1n2v');
                }
                else if (content && content.popCopywriter) {
                    Object.assign(this, { rewardStatus: 'fail' }, content);
                }
                else {
                    that.closeModal();
                }
            }).catch(() => {
                that.closeModal();
            });
        },
        getRewardResult() {
            this.track('1n2w');
            this.closeModal();
            if (this.giftResultURL) {
                window.open(this.giftResultURL);
            }
        },
        closeModal() {
            this.rewardStatus = false;
        },
        track(address_id) {
            let page_id = '1n2s';
        }
    }
};

</script>

<style lang="less" scoped>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.75);
        text-align: center;
        z-index: 10;
        .load-img {
            position: absolute;
            right: 0;
            top: 0;
            width: 0;
            height: 0;
            animation: rewardAnimate 1s 1s 1;
        }
    }
    .content, .content-pc {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }
    .close-reward {
        width: 50px;
        height: 50px;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('~@assets/course-list/reward-close@2x.png');
        position: absolute;
        right: -40px;
        top: -60px;
        z-index: 1;
    }
    .modal-btn {
        padding: 0 117px;
        height: 90px;
        line-height: 90px;
        border-radius: 28px;
        background: rgb(255, 205, 33);
        color: white;
        font-size: 34px;
        font-family:SourceHanSansCN-Regular;
        border: none;
        position: relative;
        bottom: 142px;
        outline: none;
    }
    .unopen-title-content {
        position: relative;
        z-index: 1;
        animation: 0.15s unopenTitle;
    }
    @keyframes unopenTitle {
        0% { top: -50px; }
        100% { top: 0; }
    }
    .unopen-img {
        width: 500px;
        height: 500px;
        margin: 0 auto;
        background-repeat: no-repeat;
        background-position: center;
        animation: expandGift 0.5s, bgChangeUrl 0.3s infinite;
        background-image: url('~@assets/course-list/ic_box_no_open_05.png');
        background-size: 100%;
        position: relative;
        top: -100px;
        left: -14px;
    }
    @keyframes expandGift {
        0% { background-size: 0;  }
        90% { background-size: 110%; }
        93% { background-size: 100%; }
        100% { background-size: 100%; }
    }
    @keyframes bgChangeUrl {
        0% { background-image: url('~@assets/course-list/ic_box_no_open_00.png'); }
        20% { background-image: url('~@assets/course-list/ic_box_no_open_01.png'); }
        40% { background-image: url('~@assets/course-list/ic_box_no_open_02.png'); }
        60% { background-image: url('~@assets/course-list/ic_box_no_open_03.png'); }
        80% { background-image: url('~@assets/course-list/ic_box_no_open_04.png'); }
        100% { background-image: url('~@assets/course-list/ic_box_no_open_05.png'); }
    }
    .unopen-title {
        font-family: SourceHanSansCN-Medium;
        font-weight: 500;
        color:rgba(254, 196, 35, 1);
        line-height: 70px;
        font-size: 38px;
        word-break: keep-all;
    }
    .unopen-subtitle {
        font-size: 34px;
        font-family: SourceHanSansCN-Normal;
        font-weight: 400;
        margin-top: 5px;
        color:rgba(255,254,255,1);
    }
    .reward-first {
        font-family: PingFangSC-Medium;
        font-size: 40px;
        color: #FFE05A;
        font-weight: bold;
        position: relative;
    }
    .reward-second {
        font-family: PingFangSC-Regular;
        font-size: 30px;
        color: #FFFFFF;
    }
    .reward-coupon {
        display: inline-block;
        position: relative;
        margin-top: 30px;
        width: 510px;
        height: 180px;
    }
    .reward-coupon-content {
        background-repeat: no-repeat;
        background-size: 100%;
        width: 100%;
        height: 100%;
        display: inline-block;
        position: relative;
        animation: rewardCoupon 0.5s;
        background-image: url('~@assets/course-list/coupon@2x.png');
    }
    @keyframes rewardCoupon {
        0% {
            transform: scale(0);
            bottom: -120px;
        }
        98% {
            transform: scale(1.1);
            bottom: 0;
        }
        100% {
            transform: scale(1);
            bottom: 0;
        }
    }
    .left-coupon {
        margin-top: 40px;
        float: left;
        margin-left: 44px;
        text-align: left;
    }
    .coupon-name {
        font-size: 34px;
        font-family: SourceHanSansCN-Bold;
        font-weight: bold;
        color: rgba(135, 83, 0, 1);
    }
    .coupon-tip {
        font-size: 8PX;
        font-family: SourceHanSansCN-Normal;
        font-weight: 400;
        color: rgba(162, 96, 0, 1);
    }
    .right-coupon {
        font-size: 0;
        line-height: 1;
        position: absolute;
        right: 34px;
        top: 30px;
        color: white;
    }
    .middle-line {
        width: 1px;
        height: 76px;
        background: rgba(170, 83, 45, 0.4);
        position: absolute;
        left: 320px;
        top: 46px;
    }
    .coupon-amount {
        font-size: 74px;
        font-family: SourceHanSansCN-Heavy;
        font-weight: 800;
        color: rgba(255,254,255,1);
        text-shadow: 0px 0px 23px rgba(255,174,0,0.5);
    }
    .amount-character {
        font-size: 46px;
        font-family: SourceHanSansCN-Bold;
        font-weight: bold;
        color: rgba(255, 254, 255, 1);
        text-shadow: 0px 0px 23px rgba(255, 174, 0, 0.5);
    }
    .amount-point {
        font-size: 24px;
        font-family: SourceHanSansCN-Medium;
        font-weight: 500;
        color: rgba(255, 254, 255, 1);
        text-shadow: 0px 0px 23px rgba(255, 174, 0, 0.5);
    }
    .coupon-threshold {
        font-size: 16px;
        font-family: SourceHanSansCN-Normal;
        font-weight: 400;
    }
    .reward-animate {
        width: 500px;
        height: 500px;
        position: relative;
        top: -160px;
        animation: rewardAnimate 1.2s;
        background-size: 100%;
        background-image: url('~@assets/course-list/box-open-17.png');
    }
    .reward-btn {
        position: relative;
        bottom: 180px;
    }
    .fail-modal {
        color: #fff;
        .fail-title {
            font-family: PingFangSC-Medium;
            font-size: 44px;
        }
        .fail-subTitle {
            margin-top: 13px;
            font-family: PingFangSC-Regular;
            font-size: 30px;
        }
        .fail-img {
            margin-top: 98px;
            width: 496px;
            height: 283px;
            background-size: 100%;
            position: relative;
            left: -4px;
            background-repeat: no-repeat;
            background-image: url('~@assets/course-list/yanzhi_activity_modal_gift@2x.png');
        }
    }
    .fail-btn {
        bottom: -18px;
    }

    .content-pc {
        .modal-btn {
            height: 45px;
            padding: 0 58px;
            line-height: 45px;
            font-family: PingFangSC-Regular;
            font-size: 17px;
            bottom: 26px;
        }
        .unopen-title {
            font-family: PingFangSC-Medium;
            font-size: 22px;
            color: #FFE05A;
            line-height: 35px;
        }
        .unopen-subtitle {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #FFFFFF;
        }
        .unopen-img {
            width: 250px;
            height: 250px;
            top: -45px;
            left: -8px;
        }
        .reward-first {
            font-size: 22px;
        }
        .reward-second {
            font-size: 14px;
            margin-top: 0;
        }
        .reward-coupon {
            width: 255px;
            height: 90px;
            margin-top: 14px;
        }
        .reward-animate {
            width: 250px;
            height: 250px;
            top: -95px;
            left: 10px;
        }
        .reward-btn {
            height: 45px;
            padding: 0 67px;
            font-size: 17px;
            border-radius: 22.5px;
            bottom: 104px;
        }
        .left-coupon {
            margin: 18px 0 0 25px;
        }
        .middle-line {
            height: 41px;
            left: 160px;
            top: 23px;
            width: 1px;
        }
        .coupon-name {
            font-size: 18px;
        }
        .coupon-tip {
            margin-top: 2px;
            font-size: 8px;
        }
        .right-coupon {
            top: 15px;
            right: 19px;
        }
        .coupon-amount {
            font-size: 36px;
        }
        .amount-character {
            font-size: 22px;
        }
        .amount-point {
            font-size: 14px;
        }
        .coupon-threshold {
            font-size: 10px;
        }
        p+p {
            margin-top: 10px;
        }
        .close-reward {
            width: 30px;
            height: 30px;
            top: -10px;
            cursor: pointer;
        }
        .fail-title {
            font-size: 22px;
        }
        .fail-subTitle {
            font-size: 15px;
            margin-top: 6px;
        }
        .fail-img {
            width: 223px;
            height: 128px;
            left: 0;
            margin: 28px auto 0;
        }
        .fail-btn {
            bottom: -25px;
        }
    }


    @keyframes rewardAnimate {
        0% { background-image: url('~@assets/course-list/box-open-01.png'); }
        6% { background-image: url('~@assets/course-list/box-open-02.png'); }
        12% { background-image: url('~@assets/course-list/box-open-03.png'); }
        18% { background-image: url('~@assets/course-list/box-open-04.png'); }
        24% { background-image: url('~@assets/course-list/box-open-05.png'); }
        30% { background-image: url('~@assets/course-list/box-open-06.png'); }
        36% { background-image: url('~@assets/course-list/box-open-07.png'); }
        42% { background-image: url('~@assets/course-list/box-open-08.png'); }
        48% { background-image: url('~@assets/course-list/box-open-09.png'); }
        54% { background-image: url('~@assets/course-list/box-open-10.png'); }
        60% { background-image: url('~@assets/course-list/box-open-11.png'); }
        66% { background-image: url('~@assets/course-list/box-open-12.png'); }
        72% { background-image: url('~@assets/course-list/box-open-13.png'); }
        78% { background-image: url('~@assets/course-list/box-open-14.png'); }
        84% { background-image: url('~@assets/course-list/box-open-15.png'); }
        90% { background-image: url('~@assets/course-list/box-open-16.png'); }
        100% { background-image: url('~@assets/course-list/box-open-17.png'); }
    }

</style>
