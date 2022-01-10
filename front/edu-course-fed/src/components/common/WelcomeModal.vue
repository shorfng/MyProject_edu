<template>
    <div
        v-if="showModal"
        class="welcome-modal-wrap"
    >
        <div
            class="modal-mask"
            :style="maskStyle"
        />
        <div
            ref="modalContainer"
            class="modal-container"
            :style="modalStyle"
        >
            <img
                src="~@assets/public-class/modal-animate.gif"
                alt=""
                class="modal-icon"
            >
            <div class="modal-title">
                {{ nickName }}，欢迎回来
            </div>
            <div class="modal-tips">
                将来的你，一定会感谢现在拼命努力的自己
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            showModal: true,
            modalStyle: {},
            maskStyle: {},
            nickName: ''
        };
    },
    mounted() {
        this.nickName = window.userInfo.nickName;
        setTimeout(() => {
            this.modalStyle = { transform: 'translate(-50%, 800px)', opacity: 0 };
            this.maskStyle = { opacity: 0 };
            setTimeout(() => {
                this.showModal = false;
            }, 500);
        }, 3000);
    },
};
</script>

<style lang="less" scoped>
    // @keyframes modalMove{
    //     transform:translateY(200px);
    //     opacity: 0;
    // }
    .modal-mask{
        position: fixed;
        z-index: 1000;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0,0,0,.6);
        transition: all 2s ease;
    }
    .modal-container{
        position: fixed;
        z-index: 5000;
        width: 80%;
        max-width: 8rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        text-align: center;
        border-radius: 3px;
        box-sizing: border-box;
        padding: 60px 50px;
        overflow: hidden;
        border-radius: 10px;
        transition: all 2s ease;
        opacity: 1;
        // animation:modalMove 5s infinite;
        .modal-icon{
            width: 362px;
            height: 160px;
        }
        .modal-title{
           color: #333333;
           font-size: 34px;
           padding: 60px 0 20px 0;
        }
        .modal-tips{
            color: #666666;
            font-size: 28px;
        }
    }
</style>