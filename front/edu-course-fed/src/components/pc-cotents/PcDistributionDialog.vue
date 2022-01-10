<template>
    <el-dialog
        width="500px"
        center
        top="25vh"
        :visible="visible"
        @close="closeModal"
    >
        <div class="content">
            <div class="title">
                邀请好友购买成功，即赚 <span>￥{{ money }}</span>
            </div>
            <div class="sub-title">
                扫码生成专属海报
            </div>
            <img
                :src="shareQrCode"
                alt="qrcode"
                class="qr-code"
            >
            <div class="qr-code-tip">
                微信扫一扫
            </div>
        </div>
    </el-dialog>
</template>

<script>
import QRCode from 'qrcode';
export default {
    name: 'PcDistributionDialog',
    props: {
        money: {
            type: String,
            default: ''
        },
        shareUrl: {
            type: String,
            default: ''
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            shareQrCode: ''
        };
    },
    watch: {
        shareUrl(val) {
            if (val) {
                QRCode.toDataURL(val).then(url => {
                    this.shareQrCode = url;
                });
            }
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped lang="less">
    .content{
        text-align: center;
        padding-bottom: 40px;

        .title{
            font-size: 36px;
            line-height: 50px;
            color: #333;
            margin-bottom: 16px;

            span{
                color: #ff7351;
            }
        }

        .sub-title{
            font-size: 28px;
            line-height: 40px;
            margin-bottom: 40px;
            color: #666;
        }

        .qr-code {
            width: 300px;
            height: 300px;
            display: block;
            margin: 0 auto 20px;
        }

        .qr-code-tip {
            font-size: 24px;
            line-height: 34px;
            color: #666;
        }
    }
</style>
