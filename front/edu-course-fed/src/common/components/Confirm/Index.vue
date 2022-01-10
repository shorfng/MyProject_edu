<template>
    <div
        v-if="show"
        class="modal"
    >
        <div class="modal-container">
            <div class="conent-wrap">
                <div class="message active">
                    {{ msg }}
                </div>
            </div>
            <div
                class="handle-button-wrap"
                @click="close"
            >
                {{ btnText }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Confirm',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        msg: {
            type: String,
            default: ''
        },
        btnText: {
            type: String,
            default: '知道了'
        }
    },
    data() {
        return {};
    },
    methods: {
        close(e) {
            e.stopPropagation();
            this.$emit('close');
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
    .message{
        font-size:28px;
        color: #666666;
        margin-bottom: 60px;
        &.active{
            color:#333333;
            font-size: 30px;
        }
    }
    .handle-button-wrap{
        height:100px;
        border-radius:0px 0px 10px 10px;
        font-size:32px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(229,168,23,1);
        line-height:100px;
        text-align: center;
        border-top: 1px solid #E6E6E6;
    }
</style>