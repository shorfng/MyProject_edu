<template>
    <div v-if="show">
        <div
            v-touch:touchmove="stopTouchmovePropagation"
            class="qrcode-container-bg"
        />
        <div class="qrcode-container">
            <svg
                id="Layer_1"
                class="vux-x-icon vux-x-icon-ios-close-empty qrcode-close-icon"
                type="ios-close-empty"
                size="36"
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 512 512"
                @click="hideQrcode"
            ><path
                class="st0"
                d="M340.2 160l-84.4 84.3-84-83.9-11.8 11.8 84 83.8-84 83.9 11.8 11.7 84-83.8 84.4 84.2 11.8-11.7-84.4-84.3 84.4-84.2z"
            /></svg>
            <div class="pc-purchase-success">
                <img
                    src="../../../assets/public-class/purchase-success@2x.png"
                    alt="支付成功"
                >
                <h5>支付成功，请愉快的听课吧!</h5>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PCPurchaseModal',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        hideQrcode() {
            this.$emit('hideQrcode');
        },
        stopTouchmovePropagation(event) {
            event.preventDefault();  //阻止默认行为
            event.stopPropagation(); //阻止冒泡
        },
    }
};
</script>

<style scoped lang="less">
    .qrcode-container-bg {
        width: 100%;
        height: 100%;
        background: #000000;
        opacity: 0.1;
        z-index: 101;
        position: fixed;
        left: 0;
        top: 0;
    }
    .qrcode-container {
        width: 600PX;
        height: 320PX;
        background: #ffffff;
        z-index: 102;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .pc-purchase-success {
            width: 100%;
            height: 100%;
            padding: 64PX;
            box-sizing: border-box;
            text-align: center;
            img {
                width: 112PX;
                height: 112PX;
            }
            h5 {
                font-family: HiraginoSansGB-W6;
                font-size: 18PX;
                color: #333333;
                letter-spacing: 0;
            }
        }
        .qrcode-close-icon {
            position: absolute;
            top: 8PX;
            right: 8PX;
            fill: rgb(211, 211, 211);
            cursor: pointer;
        }
    }
</style>