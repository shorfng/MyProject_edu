<template>
    <div
        class="video-container"
        :style="containerStyle"
    >
        <VideoPlayer
            ref="video"
            class="video-container"
            :video-config="videoConfig"
            @setPlayer="setPlayer"
            @canplay="canPlayHandler"
            @play="playHandler"
            @timeupdate="timeupdateHandler"
            @pause="pauseHandle"
            @ended="endedHandler"
            @error="errorHandler"
        />
        <VideoPlayerEndModal
            :is-show-end-modal="isShowEndModal"
            :is-landscape="isLandscape"
            @controlPlay="controlPlay"
        />
        <VideoPlayerControlModal
            v-if="isAndroid"
            ref="controlModal"
            :playback-rates-h5="playbackRatesH5"
            :rate-index="rateIndex"
            :is-landscape="isLandscape"
            :is-pause="isPause"
            :lesson-name="lessonName"
            :iscan-hide-fast="iscanHideFast"
            @switchContainer="switchContainer"
            @setRate="setRate"
            @exitFullscreen="exitFullscreen"
        />
        <div
            v-if="isShowFlowTip"
            class="flow-tip"
        >
            <div>当前处于 2G/3G/4G 网络</div>
            <button
                class="flow-tip-btn"
                @click="playVideo"
            >
                继续播放
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VideoPlayer from '@/common/components/Player/Index';
import VideoPlayerEndModal from './VideoPlayerEndModal';
import VideoPlayerControlModal from './VideoPlayerControlModal';
import { reportPlayInfo } from '@js/util/reportPlayInfo';
import { browserName, OSName, fullVersion } from '@js/userAgent/browser-name-and-OS.js';
import { isWifi } from '@js/util/util';
// import { fetchSaveHistory, fetchCheckHeartbeat } from '../../api/index';
import { setTimeout } from 'timers';

export default {
    name: 'CourseVideo',
    components: {
        VideoPlayer,
        VideoPlayerEndModal,
        VideoPlayerControlModal
    },
    props: {
        containerStyle: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            player: null,
            uploadPlayInfo: false,
            isShowEndModal: false,
            playbackRates: [0.8, 1, 1.25, 1.5, 1.75, 2],
            playbackRatesH5: ['0.8x', '1x', '1.25x', '1.5x', '1.75x', '2x'],
            rateIndex: 1,
            isFirstShowFlowTip: true,
            isLandscape: false,
            lessonName: '',
            isPause: false,
            isWifi: isWifi(),
            reportHeartTimerId: null,
            videoConfig: {},
            isFirstCanplayReport: true,
            isAndroid: OSName === 'Android',
        };
    },
    computed: {
        ...mapGetters([
            'playerStatus',
            'iscanHideFast'
        ]),
        getBasicInfo() {
            let bigCourseChannelType = this.videoConfig.isBigCourse ? 1 : null;
            let info = {
                userId: window.userInfo && window.userInfo.id || '',
                currentEnvironment: this.currentEnvironment,
                browserName: browserName || '',
                OSName,
                browserVersion: fullVersion || '',
                channelType: bigCourseChannelType
            };
            if (!this.playerStatus) return info;
            let { courseId, id } = this.playerStatus;
            return Object.assign(info, {
                courseId,
                lessonId: id,
            });
        },
        isShowFlowTip: {
            get() {
                let isShow = !this.isPc && !this.isWifi && this.isFirstShowFlowTip;
                return isShow;
            },
            set(val) {
                return val;
            }
        }
    },
    mounted() {
        this.isAndroid && this.onOrientationChange();
    },
    beforeDestroy() {
        clearTimeout(this.uploadPlayInfo);
        this.uploadPlayInfo = false;
        this.clearHeartTimerId();
        this.updateCourseLessonsHistory(true);
        this.player && this.player.dispose();
    },
    methods: {
        initVideo(videoConfig, lessonName) {
            this.lessonName = lessonName;
            if (this.isShowEndModal) {
                this.isShowEndModal = false;
            }
            this.videoConfig = Object.assign({}, {
                autoplay: true,
                playbackRates: this.playbackRates,
                definition: '240',
                defaultDefinition: 'HD'
            }, videoConfig);
        },
        setRate(index) {
            this.rateIndex = Number(index);
        },
        exitFullscreen() {
            this.player.exitFullscreen();
        },
        setPlayer(player) {
            this.player = player;
            this.isShowFlowTip && this.player && this.player.pause();
        },
        canPlayHandler() {
            this.player.setCurrentTime(window.parseInt(this.playerStatus.historyNode));
            this.setTooltipStyle();
        },
        playHandler() {
            this.isPause = false;
            this.isFirstCanplayReport && reportPlayInfo(Object.assign(this.getBasicInfo, {
                playInfo: JSON.stringify({
                    isError: false,
                    error: ''
                })
            }), true);
            this.isFirstCanplayReport = false;
            this.$emit('switchPlayStatus', 'play');
        },
        pauseHandle() {
            this.isPause = true;
            this.$emit('switchPlayStatus', 'pause');
        },
        timeupdateHandler() {
            if (this.isShowEndModal) {
                this.isShowEndModal = false;
            }
            this.syncPlayRecord();
            this.syncReportHeart();
        },
        syncPlayRecord() {
            if (this.uploadPlayInfo) return;
            this.uploadPlayInfo = setTimeout(() => {
                this.updateCourseLessonsHistory(true);
                clearTimeout(this.uploadPlayInfo);
                this.uploadPlayInfo = false;
            }, 3000);
        },
        syncReportHeart() {
            if (this.reportHeartTimerId) return;
            this.reportHeartTimerId = setTimeout(() => {
                this.$emit('reportHeart');
                this.clearHeartTimerId();
            }, 10000);
        },
        clearHeartTimerId() {
            clearTimeout(this.reportHeartTimerId);
            this.reportHeartTimerId = false;
        },
        endedHandler() {
            this.$emit('switchPlayStatus', 'end');
            clearTimeout(this.uploadPlayInfo);
            this.uploadPlayInfo = false;
            this.clearHeartTimerId();
            this.updateCourseLessonsHistory(false);
            // this.isLandscape && this.$refs.controlModal.setLessonStudyStatus(lessonId, 'FINISH');
            if (this.isPc || (this.isLandscape)) {
                this.isShowEndModal = true;
            }
            // 因为接口慢的原因，故延时
            setTimeout(() => {
                this.$emit('playEnd');
                // aliyun 下还会展示播放按钮，故延时
                let domClass = this.videoConfig.isTCPlayer ? '.vjs-big-play-button' : '.prism-big-play-btn';
                let playBtn = document.querySelector(domClass);
                playBtn && (playBtn.style.display = 'none');
            }, 500);
        },
        errorHandler(e) {
            const data = e.data;
            const isSpecialError = data && data.code > 13 && data.code < 18;
            reportPlayInfo(Object.assign(this.getBasicInfo, {
                playInfo: JSON.stringify({
                    isError: true,
                    error: {
                        code: data && data.code,
                        msg: data && data.message,
                        htmlPlayerErrorType: isSpecialError ? data.source.type : '',
                        htmlPlayerErrorDetails: isSpecialError ? data.source.details : '',
                        htmlPlayerErrorFrag: isSpecialError ? data.source.frag.baseurl : ''
                    }
                })
            }), true);
            this.isShowFlowTip && (this.isFirstShowFlowTip = false);
        },
        updateCourseLessonsHistory(isPlaying) {
            let playNode = isPlaying ? parseInt(this.player && this.player.getCurrentTime(), 10) : 0;
            this.$emit('updateLessonHistory', playNode);
        },
        controlPlay(type) {
            if (type === 'replay') {
                this.player && this.player.replay();
            }
            else if (type === 'next') {
                // if (this.isLandscape) {
                //     this.$emit('switchLesson', type);
                //     this.$refs.controlModal.triggerNextLesson();
                // }
                // else {
                //     this.$emit('switchLesson');
                // }
                this.$emit('switchLesson', type);
            }
            this.isShowEndModal = false;
        },
        handlePlay(type) {
            this.$emit('switchLesson', type);
        },
        setTooltipStyle() {
            // DOM 还没渲染上去，故延时
            setTimeout(() => {
                // 隐藏当前播放进度上面的 tooltip
                let tooltip = document.querySelector('.vjs-slider-bar .vjs-time-tooltip');
                tooltip && (tooltip.style.display = 'none');
                if (this.isAndroid) {
                    this.$refs.controlModal.initStyleAndDOM();
                }
                // 有流量提醒的情况下 隐藏播放按钮
                if (this.isShowFlowTip) {
                    let domClass = this.videoConfig.isTCPlayer ? '.vjs-big-play-button' : '.prism-big-play-btn';
                    let playBtn = document.querySelector(domClass);
                    playBtn && (playBtn.style.display = 'none');
                }
            }, 1000);
        },
        playVideo() {
            this.isFirstShowFlowTip = false;
            this.player && this.player.play();
        },
        // 对 Android 下横竖屏事件监听
        onOrientationChange() {
            let eventName = 'onorientationchange' in window ? 'orientationchange' : 'resize';
            window.addEventListener(eventName, () => {
                if (window.orientation === 180 || window.orientation === 0) {
                    this.isLandscape = false;
                    this.isShowEndModal = false;
                }
                if (window.orientation === 90 || window.orientation === -90) {
                    this.isLandscape = true;
                }
            }, false);
        },
        switchContainer(lesson) {
            this.$emit('switchLesson', 'lesson', lesson);
        },
    }
};
</script>
<style lang="less">
    .video-container {
        .vjs-progress-control .vjs-play-progress {
            background: #FBC546;
        }
    }
    .prism-controlbar {
        background: linear-gradient(to top, rgba(0, 0, 0, 0.666) 0%, rgba(0, 0, 0, 0.492) 19%, rgba(0, 0, 0, 0.36) 34%, rgba(0, 0, 0, 0.254) 47%, rgba(0, 0, 0, 0.185) 56.5%, rgba(0, 0, 0, 0.129) 65%, rgba(0, 0, 0, 0.084) 73%, rgba(0, 0, 0, 0.05) 80.2%, rgba(0, 0, 0, 0.028) 86.1%, rgba(0, 0, 0, 0.014) 91%, rgba(0, 0, 0, 0.005) 95.2%, rgba(0, 0, 0, 0.001) 98.2%, rgba(0, 0, 0, 0) 100%);
    }
</style>
<style lang="less" scoped>
    * {
        &::-webkit-scrollbar {
            width: 0;
        }
    }
    .video-container {
        position: relative;
        height: 100%;
        background: #272C30;
        .tcp-skin {
            .vjs-volume-panel .vjs-volume-level {
                background-color: #00b38a;
            }
            .vjs-play-progress {
                background-color: #00b38a;
            }
            .vjs-big-play-button:hover .vjs-button-icon .draw-fill {
                fill: #00b38a;
            }
        }
        .vjs-progress-control.vjs-control {
            outline: none;
        }
        .video-js .vjs-load-progress {
            background-color: #00b38a;
            opacity: 0.5;
        }
        .video-js .vjs-slider {
            background: rgba(256, 256, 256, 0.3);
        }
        .video-block {
            width: 100%;
            height: 100%;
        }
    }
    .flow-tip {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        text-align: center;
        background:rgba(0, 0, 0, 0.75);
        font-size: 28px;
        color: #fff;
        padding-top: 137px;
    }
    .flow-tip-btn {
        width: 212px;
        height: 70px;
        line-height: 70px;
        border: 1px solid rgba(255,255,255,1);
        border-radius: 35px;
        color: #fff;
        outline: none;
        background: none;
        margin-top: 40px;
        font-size: 28px;
    }
</style>
