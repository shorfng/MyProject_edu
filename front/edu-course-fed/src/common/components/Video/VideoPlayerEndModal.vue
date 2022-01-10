<template>
    <div
        v-show="isShowEndModal"
        id="endModal"
        :class="{
            'end-modal-h5': isLandscape,
            'end-modal': true
        }"
    >
        <div class="end-modal-content">
            <div
                v-if="!isLandscape"
                class="end-modal-title"
            >
                视频播放完成
            </div>
            <div class="end-modal-operate">
                <div
                    class="operate-btn replay"
                    @click="controlPlay('replay')"
                >
                    <div class="operate-icon">
                        <span class="kw-icon-replay play-icon" />
                    </div>
                    <div class="operate-letter">
                        重播
                    </div>
                </div>
                <div
                    v-show="nextLessonId"
                    class="operate-btn next"
                    @click="controlPlay('next')"
                >
                    <div class="operate-icon">
                        <span class="kw-icon-play-next play-icon" />
                    </div>
                    <div class="operate-letter">
                        学习下一节
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VideoPlayerEndModal',
    props: {
        isShowEndModal: {
            type: Boolean,
            default: false
        },
        isLandscape: {
            type: Boolean,
            default: false
        },
        nextLessonId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {};
    },
    computed: {
        isAppendDOM() {
            let endModal = document.querySelector('.video-js #endModal');
            if (this.isLandscape && !endModal) {
                let endModal = document.querySelector('#endModal');
                document.querySelector('.video-js').appendChild(endModal);
            }
            return this.isLandscape;
        }
    },
    methods: {
        controlPlay(type) {
            this.$emit('controlPlay', type);
        }
    }
};
</script>
<style lang="less" scoped>
    .end-modal {
        background:rgba(0 ,0, 0, 0.7);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        color: white;
    }
    .end-modal-content {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
    }
    .end-modal-title {
        font-size:18PX;
        font-weight:400;
        color:rgba(255,255,255,1);
    }
    .end-modal-operate {
        margin-top: 48PX;
        font-size: 0;
    }
    .end-modal-h5 {
        bottom: 0;
    }
    .operate-btn {
        display: inline-block;
        &:hover {
            cursor: pointer;
        }
        &:active {
            opacity: 0.7;
        }
    }
    .next {
        margin-left: 124PX;
    }
    .operate-icon {
        display: inline-block;
        width: 60PX;
        height: 60PX;
        line-height: 60PX;
        background:rgba(255,255,255,0.2);
        border-radius: 50%;
    }
    .play-icon {
        font-size: 35PX;
        margin-top: 13PX;
        display: inline-block;
    }
    .operate-letter {
        font-size:14PX;
        margin-top: 10PX;
    }
</style>
