<template>
    <div>
        <div
            id="selfControlModal"
            class="vjs-control-modal"
            @click.stop="clickControlModal"
        >
            <div
                class="vjs-control-modal-rate vjs-control-modal-container"
            >
                <button
                    v-for="(item, index) in playbackRatesH5"
                    :key="index"
                    data-type="rate"
                    :data-index="index"
                    :class="{'vjs-control-modal-rate-item': true,'vjs-control-modal-rate-item-hover': index === rateIndex}"
                >
                    {{ item }}
                </button>
            </div>
            <div
                class="vjs-control-modal-content vjs-control-modal-container"
            >
                <ClassMenu
                    v-if="isLandscape"
                    ref="content"
                    @chooseCourseLessonsByUser="chooseCourseLessonsByUser"
                />
            </div>
        </div>
        <div
            v-show="isLandscape && isPause"
            id="videoLessonName"
            class="video-lesson-name"
        >
            <span
                class="kw-icon-back"
                @click="exitFullscreen"
            />
            <span class="lesson-name-title">{{ lessonName }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VideoPlayerControlModal',
    components: {
        ClassMenu: () => import('@/components/contents/ClassMenu.vue'),
    },
    props: {
        playbackRatesH5: {
            type: Array,
            default() {
                return [];
            }
        },
        iscanHideFast: {
            type: Boolean,
            default: false
        },
        rateIndex: {
            type: Number,
            default: null
        },
        isLandscape: {
            type: Boolean,
            default: false
        },
        isPause: {
            type: Boolean,
            default: false
        },
        lessonName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isNeedAppendDOM: true
        };
    },
    watch: {
        isLandscape(val, oldVal) {
            if (this.isNeedAppendDOM) {
                this.appendDOM(val);
                this.isNeedAppendDOM = false;
            }

            let vjsControlBarDOM = document.querySelector('.vjs-control-bar');
            if (val && !oldVal) {
                // 控制栏中添加全屏播放的样式（显示）
                console.log('vjsControlBarDOM.classList: ', vjsControlBarDOM.classList);
                vjsControlBarDOM.classList.add('fullscreen-control-bar');
                // 顶部添加当前播放课时名 DOM
                console.log('顶部添加当前播放课时名 DOM++++++');
                if (!document.querySelector('.video-js #videoLessonName')) {
                    document.querySelector('.video-js').appendChild(document.querySelector('#videoLessonName'));
                }
            }
            else {
                // 竖屏下隐藏 控制音量和目录 按钮 并且恢复样式
                console.log('竖屏下隐藏 控制音量和目录 按钮 并且恢复样式');
                document.querySelector('.vjs-control-bar').className = 'vjs-control-bar android-control-bar';
            }
        }
    },
    methods: {
        // 初始化 DOM 和 style
        initStyleAndDOM() {
            this.setControlBarStyle();
        },
        appendRateAndContentDOM() {
            console.log('appendRateAndContentDOM+++++');
            let controlDOM = document.querySelector('#customControlBar');
            if (controlDOM) return;
            let dom = `<div
                            id="customControlBar"
                            class="self-custom-control"
                        >
                            <button
                                id="controlRate"
                                class="vjs-rate-self vjs-self-btn ${this.iscanHideFast && 'vjs-self-btn-hide'}"
                            >
                                1x
                            </button>
                            <button
                                id="controlContent"
                                class="vjs-content-self vjs-self-btn"
                            >
                                目录
                            </button>
                        </div>`;
            document.querySelector('.vjs-duration').insertAdjacentHTML('afterend', dom);
            document.querySelector('#controlRate').addEventListener('click', () => {
                document.querySelector('.vjs-control-modal').classList.add('vjs-control-modal-show-rate');
            });
            document.querySelector('#controlContent').addEventListener('click', () => {
                document.querySelector('.vjs-control-modal').classList.add('vjs-control-modal-show-content');
            });
        },
        // 时间 divider 和 设置为 Android 下的特定样式
        setControlBarStyle() {
            document.querySelector('.vjs-time-divider').style.display = 'none';
            document.querySelector('.vjs-control-bar').classList.add('android-control-bar');
        },
        appendDOM(isLandscape) {
            // 横屏播放时添加音速和目录按钮
            this.isLandscape && this.appendRateAndContentDOM();

            // 播放结束弹窗
            let endModal = document.querySelector('.video-js #endModal');
            let video = document.querySelector('.video-js');
            if (isLandscape && !endModal) {
                endModal = document.querySelector('#endModal');
                video.appendChild(endModal);
            }

            // 自定义控制音速和目录右侧弹窗
            let selfControlModal = document.querySelector('.video-js #selfControlModal');
            if (isLandscape && !selfControlModal) {
                selfControlModal = document.querySelector('#selfControlModal');
                video.appendChild(selfControlModal);
            }
        },
        clickControlModal(e) {
            let type = e.target.getAttribute('data-type');
            if (type === 'rate') {
                let index = e.target.getAttribute('data-index');
                let rate = this.playbackRatesH5[index];
                this.$emit('setRate', index);
                document.querySelector('#controlRate').innerText = rate;
                // TC player 设置倍速
                window.videoContainer = document.querySelector('.video-container video');
                document.querySelector('.video-container video').playbackRate = parseFloat(rate);
            }
            document.querySelector('.vjs-control-modal').className = 'vjs-control-modal';
        },
        exitFullscreen() {
            this.$emit('exitFullscreen');
        },
        setLessonStudyStatus(lessonId, status) {
            this.$refs.content.setLessonStudyStatus(lessonId, status);
        },
        triggerNextLesson() {
            this.$refs.content.triggerNextLesson();
        },
        chooseCourseLessonsByUser(lesson) {
            document.querySelector('.vjs-control-modal').className = 'vjs-control-modal';
            this.$emit('switchContainer', lesson);
        }
    }
};
</script>
<style lang="less">
    .vjs-control-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1;
        display: none;
        & &-container {
            position: absolute;
            top: 10PX;
            right: 10PX;
            bottom: 10PX;
            background: white;
            border-radius: 15PX;
            display: none;
        }
        & &-rate {
            padding: 20PX 15PX;
        }
        & &-content {
            padding: 15PX 25PX;
        }
        & &-rate-item {
            height: 16.6%;
            padding: 12PX 45PX;
            font-weight: 400;
            font-size: 14PX;
            color: #333333;
            border: none;
            background: white;
            display: block;
            width: 100%;
        }
        & &-rate-item-hover {
            color: #E5A817;
            background: #F8F9FA;
        }
    }
    .vjs-control-modal-show-content {
        display: block;
        .vjs-control-modal-content {
            display: block;
            overflow-y: scroll;
            /deep/ .class-menu-container {
                width: 360PX;
                padding: 0 0;
                box-sizing: border-box;
                .section-name {
                    font-size: 16PX;
                    max-width: 280PX;
                    color: #333333;
                    padding: 15PX 0;
                }
                .theme {
                    max-width: 300PX;
                }
                .lesson-name {
                    font-size: 14PX;
                    line-height: 20PX;
                    margin-bottom: 11PX;
                    &:last-of-type {
                        margin-bottom: 0;
                    }
                }
                .video-duration {
                    font-size: 10PX;
                }
                .not-learn {
                    padding: 0 4PX;
                    font-size: 10PX;
                    line-height: 12PX;
                    transform: translateY(1PX);
                }
                .is-wait {
                    &::after {
                        font-size: 10PX;
                        line-height: 15PX;
                        padding: 0;
                        top: 2PX;
                    }
                }
            }
            /deep/ .toast-content {
                font-size: 15PX;
                line-height: 15PX;
                padding: 7;
            }
        }
    }
    .vjs-control-modal-show-rate {
        display: block;
        .vjs-control-modal-rate {
            display: block;
        }
    }
    .video-container .android-control-bar {
        .vjs-volume-panel-vertical {
            display: none;
        }
        .vjs-progress-control {
            top: 0.78em;
            left: 9em;
            right: 7em;
            width: auto
        }
        .vjs-duration {
            position: absolute;
            right: 3em;
        }
        .vjs-playback-rate {
            display: none;
        }
        .vjs-fullscreen-control {
            position: absolute;
            right: 0;
        }
    }
    .self-custom-control {
        display: none;
    }
    .video-container .fullscreen-control-bar {
        .vjs-progress-control {
            right: 13em;
        }
        .vjs-duration {
            right: 9em;
        }
        .self-custom-control {
            color: #fff;
            position: absolute;
            right: 3.5em;
            height: 100%;
            display: block;
        }
        .vjs-self-btn {
            height: 100%;
            line-height: 3em;
            text-align: center;
            width: 3em;
        }
        .vjs-self-btn-hide{
            display: none;
        }
    }
    .video-lesson-name {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 44PX;
        color: white;
        font-size: 16PX;
        padding: 0 20PX;
        line-height: 44PX;
        z-index: 2;
        .kw-icon-back, .lesson-name-title {
            vertical-align: middle;
        }
    }
</style>
