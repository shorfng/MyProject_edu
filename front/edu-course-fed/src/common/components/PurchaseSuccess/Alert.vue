<template>
    <alert
        v-model="show"
        v-touch:touchmove="stopTouchmovePropagation"
        class="purchase-alert-container"
        title="购买成功"
        button-text="我知道了"
    >
        <div class="purchase-alert-content">
            <!--可在<span v-if="currentEnvironment!=='app'">app</span><span class="important">“言职”</span>模块中查看已购买课程-->
            <img
                class="purchase-success-img"
                src="../../../assets/public-class/purchase-success@3x.png"
                alt="购买成功"
            >
        </div>
    </alert>
</template>

<script>
import { Alert } from 'vux';
export default {
    name: 'AlertPurchaseModal',
    components: {
        Alert
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        hideWXPurchaseSuccess() {
            this.$emit('hideWXPurchaseSuccess');
        },
        stopTouchmovePropagation(event) {
            event.preventDefault();  //阻止默认行为
            event.stopPropagation(); //阻止冒泡
        },
    }
};
</script>

<style scoped lang="less">
    .purchase-alert-container {
        position: relative;
        .weui-dialog {
            width: 540px;
            background: #ffffff;
            border: 1px solid #e8e9eb;
            border-radius: 10px;
            overflow: visible;
        }
        .weui-dialog__hd {
            margin-top: 10px;
            padding: 0px;
        }
        .weui-dialog__title {
            font-size: 34px;
            color: #333333;
        }
        .purchase-alert-content {
            font-size: 30px;
            color: #666666;
            .important {
                font-size: 30px;
                color: #151515;
                font-weight: bolder;
            }
        }
        .weui-dialog__bd {
            padding: 0px;
            margin-top: 20px;
        }
        .weui-dialog__ft {
            margin-left: 40px;
            margin-right: 40px;
        }
        .weui-dialog__ft:after {
            border-top: 1px solid #d9d9d9;
        }
        .weui-dialog__btn_primary {
            font-size: 32px;
        }
        .purchase-success-img {
            position: absolute;
            width: 70px;
            height: 70px;
            top: -35px;
            left: 240px;
        }
    }
</style>
