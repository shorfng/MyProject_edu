<template>
    <div
        v-if="show"
        class="modal"
    >
        <div class="modal-container">
            <img
                class="img"
                src="../../../assets/public-class/take-off@2x.png"
                alt=""
            >
            <div class="text">
                很抱歉，该内容已下架～
            </div>
            <button @click="goCourseList">
                查看更多好课
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GoodsTakeOff',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        goCourseList() {
            if (this.isLgApp) {
                window.location.href = 'lagou://lagou.com/course';
            }
            else if (this.isEduApp) {
                window.location.href = 'lgedu://lgedu.com/course';
            }
            else {
                window.location.replace('https://kaiwu.lagou.com/');
            }

        }
    }
};
</script>

<style scoped lang="less">
@import '../../css/modal.less';
.modal-container {
    padding: 0 75px 60px;
    border-radius: 12px;
    text-align: center;
    .img {
        width: 360px;
        height: 262px;
        position: absolute;
        left: 50%;
        top: -75px;
        transform: translateX(-50%);
    }
    .text {
        font-weight:500;
        font-size:32px;
        padding: 197px 0 60px;
    }
    button {
        width:450px;
        height:88px;
        background:rgba(251,197,70,1);
        border-radius:44px;
        font-size:32px;
        font-weight:400;
        outline: none;
    }
}
</style>