<template>
    <div class="container">
        <div class="top">
            <img
                src="../assets/public-class/icon-subscribe@2x.png"
                alt=""
            >
            <span>购买成功</span>
        </div>
        <div class="course-name">
            课程【{{ courseInfo.courseName }}】
        </div>
        <div class="container-bottom">
            <img
                v-if="isShowWXType && isPack"
                :src="weixinQrUrl"
                class="wx-img"
            >
            <div
                v-else
                class="app-tip"
            >
                <div
                    v-if="!isApp"
                    class="title"
                >
                    立即下载拉勾教育APP<br>开始学习
                </div>
                <img
                    src="../assets/public-class/edu-app.png"
                    class="icon"
                    alt=""
                >
                <button @click="btnClick">
                    {{ isApp ? '立即学习' : '下载 App' }}
                </button>
            </div>
        </div>
        <Toast
            :show="isShowToast"
            :msg="toastStr"
            @onHide="hideToast"
        />
    </div>
</template>
<script>
    import { getLocalStorage } from '@js/util/localStorage';
    import { getParam, parseObjToUrl } from '@js/util/getParam';
    import { getAppVersion, isBiggerThanSpecifiedVersion } from '@js/userAgent/getVersion';
    const nativeLgPurchasedVersion = '7.36.0';
    export default {
    components: {
    },
    data() {
        let courseInfo = this.courseInfo || {};
        let { decorateId } = courseInfo;
        let successShowType = getLocalStorage('successShowType');
        let weixinQrUrl = getLocalStorage('weixinQrUrl');
        console.log('successShowType', successShowType);
        console.log('weixinQrUrl', weixinQrUrl);
        return {
            courseInfo,
            isShowWXType: successShowType === 'WEI_XIN',
            weixinQrUrl: weixinQrUrl,
            isPack: !!decorateId
        };
    },
    methods: {
        btnClick() {
            console.log('btnClick', this.isApp);
            console.log(getAppVersion());
            console.log(isBiggerThanSpecifiedVersion(getAppVersion(), nativeLgPurchasedVersion));
            if (this.isLgApp) {
                if (isBiggerThanSpecifiedVersion(getAppVersion(), nativeLgPurchasedVersion)) {
                    window.location = `lagou://lagou.com/purchased`;
                } else {
                    this.showToast('你的版本过低，为了保证更好的使用体验，请更新版本后使用该功能');
                }

            } else if (this.isEduApp) {
                window.location = `lgedu://lgedu.com/purchased`;
            }
            else {
                window.open('https://shenceyun.lagou.com/r/9a');
            }
        }
    }
};
</script>
<style lang="less" scoped>
    .container {
        background: url("../assets/public-class/pay-bg.png") no-repeat;
        background-size: cover;
        height: 100%;
    }
    .top {
        padding: 80px 0 20px;
        text-align: center;
        img {
            width: 52px;
            height: 52px;
            margin-right: 18px;
            vertical-align: middle;
        }
        span {
            font-size:48px;
            display: inline-block;
            vertical-align: middle;
        }
    }
    .course-name {
        font-size:24px;
        color: #666666;
        text-align: center;
        margin: 0 auto;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .container-bottom {
        width: 600px;
        margin: 47px auto 0;
        background: white;
        box-shadow: 0px 8px 60px 0px rgba(0,0,0,0.06);
        border-radius: 12px;
        color: #666666;
        font-size: 24px;
        text-align: center;
        &>.wx-img {
            width: 100%;
            height: 708px;
        }
        .icon {
            width: 160px;
            height: 160px;
            margin: 80px auto 110px;
        }
    }
    .app-tip {
        padding-bottom: 80px;
    }
    .title {
        color: #333333;
        font-size: 32px;
        font-weight: 500;
        padding-top: 80px;
    }
    button {
        width: 400px;
        height: 88px;
        color: #333333;
        background:linear-gradient(270deg,rgba(250,168,62,1) 0%,rgba(251,197,70,1) 100%);
        border-radius: 22px;
        line-height: 88px;
        text-align: center;
        outline: none;
        display: block;
        margin: 0 auto;
        font-size:32px;
        font-weight: 500;
    }
    /deep/ .toast .toast-content {
        font-size: 24px;
        line-height: 32px;
        padding: 14px;
    }
</style>

