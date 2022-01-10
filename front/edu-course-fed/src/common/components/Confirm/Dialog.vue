<template>
    <div
        v-if="show"
        class="modal"
    >
        <div class="modal-container">
            <div class="conent-wrap">
                <div class="title active">
                    {{ title }}
                </div>
                <div class="content">
                    {{ content }}
                </div>
            </div>
            <div class="btn-content">
                <div
                    v-if="showCancelButton"
                    class="handle-button-wrap cancle-btn"
                    @click="cancleFn"
                >
                    {{ cancelBtnText }}
                </div>
                <div
                    v-if="showConfirmButton"
                    class="handle-button-wrap confirm-btn"
                    @click="confirmFn"
                >
                    {{ confirmBtnText }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Dialog',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        showCancelButton: {
            type: Boolean,
            default: true
        },
        showConfirmButton: {
            type: Boolean,
            default: true
        },
        cancelBtnText: {
            type: String,
            default: '取消'
        },
        confirmBtnText: {
            type: String,
            default: '确定'
        }
    },
    data() {
        return {};
    },
    methods: {
        close(e) {
            e.stopPropagation();
            this.$emit('close');
        },
        cancleFn() {
            this.$emit('onCancle');
        },
        confirmFn() {
            this.$emit('onConfirm');
        }
    }
};
</script>

<style scoped lang="less">
@import '../../css/modal.less';
.modal {
    user-select: none;
    z-index: 1;
}
    .modal-container{
        border-radius: 10px;
        padding:60px 0 0 0;
        width: 600px;
        text-align: center;
    }
    .conent-wrap{
        padding:0 50px 0 50px;
    }
    .title{
        font-size:32px;
        color: #333333;
    }
    .content{
        font-size: 28px;
        color: #666;
        margin: 20px 0 50px 0;
    }
    .handle-button-wrap{
        flex: 1;
        height:100px;
        border-radius:0px 0px 10px 10px;
        font-size:32px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(229,168,23,1);
        line-height:100px;
        text-align: center;
        position: relative;
        border-top: 1px solid #E6E6E6;
    }
    .handle-button-wrap.cancle-btn {
        color: #333;
    }
    .confirm-btn:after {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        width: 1px;
        bottom: 0;
        border-left: 1px solid #E6E6E6;;
        color: #E6E6E6;;
        // transform-origin: 0 0;
        // transform: scaleX(.5);
    }
    .btn-content{
        display: flex;
    }
</style>