<template>
    <div
        v-if="show"
        class="modal"
    >
        <div class="modal-container">
            <img
                src="../../assets/public-class/share-close@2x.png"
                alt=""
                class="close"
                @click="close"
            >
            <div class="bg-content">
                <img
                    class="bg"
                    :src="getShareInfo.shareImageUrl"
                    alt=""
                >
                <img
                    class="lock"
                    src="../../assets/public-class/icon-lock.png"
                    alt=""
                >
            </div>
            <div class="share-title" />
            <div class="share-options">
                <div
                    class="item share-friend"
                    @click="share('friend')"
                >
                    <img
                        src="../../assets/public-class/share-wechat.png"
                        alt=""
                    >
                    <div>微信好友</div>
                </div>
                <div
                    class="item share-timeline"
                    @click="share('line')"
                >
                    <img
                        src="../../assets/public-class/share-timeline.png"
                        alt=""
                    >
                    <div>微信朋友圈</div>
                </div>
            </div>
        </div>
        <div :class="{mask: true, show: isShowTip}">
            <div class="mask-arrow">
                <img src="../../assets/public-class/mask_arrow@2x.png">
            </div>
            <div class="mask-content">
                <img src="../../assets/public-class/mask_content@2x.png">
            </div>
            <div class="mask-button">
                <img
                    src="../../assets/public-class/mask_btn@2x.png"
                    @click="showShareMask"
                >
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { getParam } from '@js/util/getParam';


export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isShowTip: false
        };
    },
    computed: {
        ...mapGetters(['courseInfo', 'getShareInfo', 'currentCourseLessons'])
    },
    methods: {
        ...mapActions(['submitShareRecord']),
        close() {
            this.$emit('close');
        },
        share(type) {
        },
        showShareMask() {
            this.isShowTip = !this.isShowTip;
        }
    }
};
</script>
<style lang="less" scoped>
    @import '~@less/modal.less';
    .modal {
        display: block;
        z-index: 6;
    }
    .modal-container {
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        padding-bottom: 40px;
    }
    .close {
        position: absolute;
        width: 25px;
        height: 25px;
        right: 0;
        top: -66px;
    }
    .bg-content {
        width: 600px;
        height: 338px;
        position: relative;
    }
    .bg {
        width: 100%;
        height: 100%;
        -webkit-border-radius: 5px 5px 0 0;
        -moz-border-radius: 5px 5px 0 0;
        border-radius: 5px 5px 0 0;
    }
    .lock {
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
    }
    .share-title {
        width: 377px;
        height: 42px;
        margin: 30px auto 0;
        background: url("../../assets/public-class/share-title.png") no-repeat;
        background-size: 100%;
    }
    .share-options {
        margin: 30px 136px 0;
        overflow: hidden;
        font-size: 22px;
        color: #666666;
        text-align: center;
        img {
            width: 80px;
            height: 80px;
            margin-bottom: 10px;
        }
    }
    .share-friend {
        float: left;
    }
    .share-timeline {
        float: right;
    }


    .mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        background: rgba(0, 0, 0, .7);
        display: none;
        text-align: center;
        width: 100%;
        height: 100%;
        &.show {
            display: block;
        }
        &-arrow {
            position: absolute;
            top: 38px;
            right: 66px;

            img {
                width: 132px;
            }
        }

        &-content {
            position: absolute;
            top: 158px;
            left: 0;
            right: 0;
            text-align: center;

            img {
                width: 584px;
            }
        }

        &-button {
            position: absolute;
            top: 486px;
            left: 0;
            right: 0;
            text-align: center;

            img {
                width: 173px;
            }
        }
    }
</style>
