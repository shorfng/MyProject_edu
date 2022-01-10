<template>
    <div class="open-app-banner">
        <img
            class="app-container-img"
            src="../../assets/public-class/logo.png"
            alt="lagou logo"
        >
        <div class="open-app-content">
            <div class="app-title-name">
                拉勾
            </div>
            <div class="app-title-descript">
                上拉勾，去互联网巨头工作
            </div>
        </div>
        <div
            class="open-app-block"
            @click="openLagouApp"
        >
            App内打开
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {};
    },
    mounted() {},
    methods: {
        openLagouApp() {
            window.open('https://a.app.qq.com/o/simple.jsp?pkgname=com.alpha.lagouapk&g_f=991653');
        }
    }
};
</script>

<style lang="less" scoped>
.open-app-banner {
    height: 120px;
    position: relative;
    .app-container-img {
        position: absolute;
        left: 40px;
        top: 20px;
        width: 80px;
        height: 80px;
    }
    .open-app-content {
        padding-left: 144px;
        padding-right: 100px;
    }
    .app-title-name {
        padding-top: 20px;
        font-size: 32px;
        color: #333333;
    }
    .app-title-descript {
        font-size: 24px;
        color: #333333;
    }
    .open-app-block {
        width: 154px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        position: absolute;
        right: 30px;
        top: 30px;
        background-image: linear-gradient(0deg, #16cd86 0%, #0abf89 100%);
        border-radius: 2rem;
        font-size: 22px;
        color: #ffffff;
        text-align: center;
        padding: 10px 0;
    }
}
</style>
