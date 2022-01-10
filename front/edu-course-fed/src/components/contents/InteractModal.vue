<template>
    <div class="interact-modal">
        <div
            v-show="isShowModal"
            class="modal"
        >
            <div class="modal-container">
                <div class="modal-title">
                    {{ modalData.interactTitle }}
                </div>
                <div class="modal-desc">
                    {{ modalData.jumpText }}
                </div>
                <img
                    v-if="modalData.jumpPicture"
                    class="modal-img"
                    :src="modalData.jumpPicture"
                    alt=""
                >
                <button
                    class="confirm"
                    @click="closeModal"
                >
                    确定
                </button>
                <img
                    class="modal-close-btn"
                    src="../../assets/course/publi_ic_close60@2x-min.png"
                    alt=""
                    @click="closeModal"
                >
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            isShowModal: {
                type: Boolean,
                default: false
            },
            modalData: {
                type: Object,
                default() {
                    return {};
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
<style lang="less" scoped>
@import '~@less/modal.less';
.interact-modal {
    .modal {
        z-index: 2;
        .modal-container {
            text-align: center;
            padding: 60px 75px;
            border-radius: 12px;
        }
        .modal-title {
            font-size:32px;
            color: #333333;
        }
        .modal-desc {
            font-size:28px;
            color: #666666;
            margin-top: 20px;
            max-height: 300px;
            overflow-y: scroll;
        }
        .modal-img {
            width: 254px;
            height: 254px;
            margin-top: 50px;
        }
        .confirm {
            width:450px;
            height:88px;
            background:rgba(251,197,70,1);
            border-radius: 22px;
            font-size:36px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(51,51,51,1);
            text-align: center;
            line-height: 88px;
            margin-top: 42px;
        }
        .modal-close-btn {
            width: 56px;
            height: 56px;
            position: absolute;
            border-radius: 50%;
            bottom: -130px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}

</style>

