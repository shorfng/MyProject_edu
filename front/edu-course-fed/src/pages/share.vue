<template>
    <div class="content">
        <div class="header">
            <div class="title">
                邀请好友购买，即赚<span>￥{{ brokerage }}</span>
            </div>
            <div class="tip">
                生成推广海报并分享给好友
            </div>
        </div>
        <div class="content-top">
            <div
                class="step-1 "
                :class="isWx ? 'step-1-wx' : ''"
            >
                <img
                    class="qr-code"
                    :src="qrCodeUrl"
                    alt="qrcode"
                    @touchstart="longTouch"
                    @touchend="longTouchEnd"
                >
            </div>
            <div class="step-2" />
        </div>
        <div class="content-bottom">
            <div class="step-3" />
            <div class="step-4" />
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcode';
import {
    browserName,
} from '../common/js/userAgent/browser-name-and-OS';
import share from '../common/js/share';

let timer = null;

export default {
    data() {
        return {
            brief: '',
            brokerage: '',
            courseName: '',
            shareImage: '',
            url: '',
            qrCodeUrl: ''
        };
    },
    computed: {
        isWx() { //判断是否是微信
            return browserName === 'WX';
        }
    },
    created() {
        const query = this.$route.query;
        this.brief = query.brief;
        this.brokerage = query.brokerage;
        this.courseName = query.courseName;
        this.shareImage = query.shareImage;
        this.url = query.url;
        QRCode.toDataURL(this.url).then(url => {
            this.qrCodeUrl = url;
        });
    },
    mounted() {
        const shareMsg = {
            title: this.courseName || '',
            desc: this.brokerage || '',
            shareUrl: this.url || '',
            imgUrl: this.shareImage || ''
        };
        share.init(shareMsg);
    },
    methods: {
        longTouch() {
            clearTimeout(timer);
            if (window.lgBridge) {
                timer = setTimeout(() => {
                    window.lgBridge.request('savePicture', {
                        data: {
                            pic: this.qrCodeUrl,
                            name: `qrCoe-${new Date().getTime()}.png`
                        }
                    });
                }, 400);
            }
        },
        longTouchEnd() {
            clearTimeout(timer);
        }
    }
};
</script>

<style lang="less" scoped>
    .header {
        text-align: center;
        padding-top: 76px;
        height: 238px;
        color: #FFF;
        background: #5B5D6E;
        box-sizing: border-box;

        .title {
            font-size: 44px;
            line-height: 62px;
            font-weight: bold;
            margin-bottom: 20px;

            span {
                color: #FFED97;
            }
        }

        .tip {
            font-size: 28px;
            line-height: 40px;
        }
    }

    .content-top{
        background: #5B5D6E;
    }

    .content-bottom {
        background: #f8f9fa;
    }

    .step-1 {
        width: 750px;
        height: 865px;
        background: url('~@assets/course-share/1@3x.png');
        background-size: cover;
        position: relative;
        margin: 0 auto;

        .qr-code {
            position: absolute;
            left: 175px;
            top: 315px;
            width: 400px;
            height: 400px;
        }
    }

    .step-1-wx {
        background: url('~@assets/course-share/1@3xwx.png');
        background-size: cover;
        height: 865px;

        .qr-code {
            top: 290px;
        }
    }

    .step-2 {
        width: 750px;
        height: 1408px;
        background: url('~@assets/course-share/2@3x.png');
        background-size: cover;
        margin: 0 auto;
    }

    .step-3 {
        width: 750px;
        height: 1300px;
        background: url('~@assets/course-share/3@3x.png');
        background-size: cover;
        margin: 0 auto;
    }

    .step-4 {
        width: 750px;
        height: 1061px;
        background: url('~@assets/course-share/4@3x.png');
        background-size: cover;
        margin: 0 auto;
    }
</style>
