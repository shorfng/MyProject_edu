<template>
    <div class="weChat-modal">
        <div class="content">
            <div class="purchase-tip">
                <img
                    class="purchase-icon"
                    src="~@assets/public-class/icon-purchase@2x.png"
                    alt=""
                >
                <span class="purchase-text">购买成功</span>
            </div>
            <div class="course-name">
                伴读课：{{ joinInfo.courseName }}
            </div>
            <div class="link-content">
                <div class="line-content-left">
                    <div
                        v-for="(item, index) in joinInfo.wechatJoinTip"
                        :key="index"
                        class="link-word"
                    >
                        {{ item }}
                    </div>
                </div>
                <div class="link-signal">
                    {{ joinInfo.wechatUserTip }}
                </div>
                <div class="link-img-content">
                    <img
                        class="qrCode"
                        :src="joinInfo.wechatUserImg"
                        alt=""
                    >
                </div>
            </div>
            <button
                class="link-btn"
                @click="confirmLink"
            >
                我已确认添加
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PCWeChatModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        joinInfo: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    methods: {
        confirmLink() {
            this.$emit('confirmLink');
        }
    }
};
</script>

<style scoped lang="less">
    .weChat-modal{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10;
    }
    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        border-radius: 3PX;
        width: 500PX;
        background: white;
        text-align: center;
        padding: 50PX 30PX;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .purchase-icon {
        width: 20PX;
        height: 20PX;
        margin-right: 6PX;
        vertical-align: text-bottom;
    }
    .purchase-text {
        font-family: PingFangSC-Medium;
        font-size: 20PX;
        color: #00B08C;
    }
    .course-name {
        font-size: 14PX;
        color: #888888;
        margin-top: 7PX;
    }
    .link-content {
        background: #F9FAFB;
        border: 1PX solid #F9FAFB;
        border-radius: 1PX;
        padding: 22PX 140PX 26PX 26PX;
        text-align: left;
        margin-top: 20PX;
        position: relative;
    }
    .link-word {
        font-family: PingFangSC-Semibold;
        font-size: 20PX;
        color: #333333;
    }
    .link-signal {
        font-family: PingFangSC-Regular;
        font-size: 14PX;
        color: #666666;
        margin-top: 10PX;
    }
    .link-img-content {
        width: 100PX;
        height: 100PX;
        position: absolute;
        right: 30PX;
        top: 20PX;
        background: #ffffff;
    }
    .qrCode {
        width: 88PX;
        height: 88PX;
        position: absolute;
        left: 6PX;
        top: 6PX;
    }
    .link-btn {
        height: 40PX;
        line-height: 40PX;
        font-family: HiraginoSansGB-W3;
        font-size: 16PX;
        color: #FFFFFF;
        background: #00B38A;
        border-radius: 3PX;
        margin-top: 30PX;
        padding: 0 20PX;
        outline: none;
        border: none;
        &:active {
            background: #cccccc;
        }
    }
</style>