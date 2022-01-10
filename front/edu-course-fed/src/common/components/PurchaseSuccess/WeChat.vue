<template>
    <div
        v-if="show"
        v-touch:touchmove="stopTouchmovePropagation"
        class="WX-purchase-success"
        @click="hideWXPurchaseSuccess"
    >
        <div class="WX-purchase-bg" />
        <img
            class="success-icon"
            src="../../../assets/public-class/purchase-success@3x.png"
            alt="WX-purchase-success"
        >
        <img
            class="success-short-text"
            src="../../../assets/public-class/WX-purchase-succes1@3x.png"
            alt="WX-purchase-success"
        >
        <img
            class="success-long-text"
            src="../../../assets/public-class/WX-purchase-succes2@3x.png"
            alt="WX-purchase-success"
        >
        <img
            class="success-arrow"
            src="../../../assets/public-class/WX-purchase-arrow@3x.png"
            alt="WX-purchase-success"
        >
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
    .WX-purchase-success {
        width: 100%;
        height: 100%;
        .WX-purchase-bg {
            width: 100%;
            height: 100%;
            opacity: 0.7;
            z-index: 2;
            background: #000000;
            position: absolute;
            left: 0px;
            top: 0px;
        }
        .success-icon {
            width: 40px;
            height: 40px;
            position: absolute;
            left: 244px;
            top: 121px;
            z-index: 3;
        }
        .success-short-text {
            width: 165px;
            height: 56px;
            position: absolute;
            left: 313px;
            top: 113px;
            z-index: 3;
        }
        .success-long-text {
            width: 616px;
            height: 56px;
            position: absolute;
            left: 67px;
            top: 187px;
            z-index: 3;
        }
        .success-arrow {
            width: 55px;
            height: 80px;
            position: absolute;
            left: 582px;
            top: 61px;
            z-index: 3;
        }
    }
</style>