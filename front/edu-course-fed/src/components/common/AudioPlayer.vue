<template>
    <!--音频播放器-->
    <video
        id="video"
        class="video vjs-default-skin"
        controls="controls"
        x-webkit-airplay="true"
        x5-video-player-fullscreen="true"
        preload="auto"
        playsinline="true"
        webkit-playsinline
        x5-video-player-type="h5"
        @timeupdate="timeUpdate"
        @pause="pause"
        @canplay="canplay"
        @play="play"
        @error="error"
        @ended="ended"
        @waiting="waiting"
    >
        <source
            type="application/x-mpegURL"
            :src="playerStatus && playerStatus.audioMediaDTO && playerStatus.audioMediaDTO.fileUrl || ''"
        >
    </video>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Hls from '../../../node_modules/hls.js/dist/hls';

import { fetchSaveHistory, fetchLessonPlayHistory } from '../../service';
import { browserName, OSName, fullVersion } from '../../common/js/userAgent/browser-name-and-OS.js';
import { reportPlayInfo } from '../../common/js/util/reportPlayInfo';

export default {
    data() {
        return {
            player: null,
            uploadPlayInfo: false,
            initTime: 0,
            isReportHeart: true
        };
    },
    computed: {
        ...mapGetters([
            'playerStatus',
            'playerRate',
            'isFirstPlay',
            'playerSecondCurrentTime',
            'slideSetTime',
            'currentCourseLessons',
            'isPlayerReady',
            'currentEnv',
            'appVersion',
            'isNativeAudioPlay',
            'isPlayingBeforeBack',
            'userInfo',
            'isLogin'
        ]),
        getBasicInfo() {
            return {
                userId: window.userInfo && window.userInfo.id || '',
                currentEnvironment: this.currentEnv,
                browserName: browserName || '',
                OSName: OSName,
                browserVersion: fullVersion || '',
                appVersion: this.appVersion || '',
                courseId: this.currentCourseLessons.courseId,
                lessonId: this.currentCourseLessons.id
            };
        }
    },
    watch: {
        playerStatus: function(val, pre) {
            if (this.isNativeAudioPlay) return;
            let { id, audioMediaDTO = {} } = this.playerStatus;
            if (!this.player && val.isPlaying) {
                this.initAudio(true);
            } else if (this.player && id !== pre.id) {
                this.initAudio(true);
            }
            else if (this.player) {
                if (val.isPlaying) {
                    this.player.currentTime = this.playerSecondCurrentTime;
                    if (audioMediaDTO && this.player.currentTime >= audioMediaDTO.durationNum) {
                        this.initAudio(true);
                    } else {
                        this.player.play();
                    }
                }
                else {
                    this.player.pause();
                }
            }
        },
        playerRate(val) {
            this.player.playbackRate = val;
        },
        slideSetTime(data) {
            this.player.currentTime = parseFloat(data);
        }
    },
    created() {
        if (!this.isNativeAudioPlay) return;
        let that = this;
        window.lgBridge && window.lgBridge.response('LgAudioPlayStatus', function (data, response, ext) {
            console.log('lgBridge LgAudioPlayStatus', data);
            if (!data || !data.lessonId) return;
            let isPlaying = (data.playStatus === 1);
            that.setLessonPlayer({
                id: data.lessonId,
                isPlaying,
                isNativeNotify: true
            });
            response({
                success: true
            });
        });
    },
    mounted() {
        document.addEventListener('visibilitychange', this.autoPlayOrPause);
    },
    destroyed() {
        document.removeEventListener('visibilitychange', this.autoPlayOrPause);
        this.setIsReportHeart(false);
        this.isReportHeart = true;
    },
    methods: {
        ...mapActions([
            'setPlayerAllTime',
            'setFormatPlayerCurrentTime',
            'setPlayerIsReady',
            'setLessonPlayer',
            'setIsPlayerFirstLoaded',
            'reportLessonHeart',
            'setIsReportHeart',
            'setLessonLearned',
            'savePlayerBackStatus'
        ]),
        autoPlayOrPause() {
            if (this.isNativeAudioPlay || this.isPc) return;
            let { id, isPlaying } = this.playerStatus;
            if (!id) return;
            let state = document.visibilityState;
            let isPlayState;
            if (state === 'hidden') {
                this.savePlayerBackStatus(isPlaying);
                isPlayState = false;
            }
            else if (state === 'visible' && this.isPlayingBeforeBack) {
                isPlayState = true;
            }
            if (typeof isPlayState === 'boolean') {
                this.setLessonPlayer({
                    id,
                    isPlaying: isPlayState
                });
            }
        },
        timeUpdate(e) {
            this.setFormatPlayerCurrentTime(e.target.currentTime);
            if (this.isLogin && !this.uploadPlayInfo) {
                this.uploadPlayInfo = setTimeout(() => {
                    this.updateCourseLessonsHistory(e.target.currentTime, true);
                    clearTimeout(this.uploadPlayInfo);
                    this.uploadPlayInfo = false;
                }, 10000);
            }

            if (this.isLogin && this.isReportHeart) {
                this.isReportHeart = false;
                this.setIsReportHeart(true);
                setTimeout(() => {
                    this.isReportHeart = true;
                }, 61000);
            }
        },
        pause(e) {
            this.setIsReportHeart(false);
            this.isReportHeart = true;
            this.setLessonPlayer({
                id: this.playerStatus.id,
                isPlaying: false
            });
        },
        canplay() {
            if (!this.playerStatus.isSliderChange && this.initTime) {
                this.player.currentTime = this.initTime;
                this.initTime = 0;
            }
            this.setPlayerIsReady(true);
            this.setIsPlayerFirstLoaded(true);
        },
        waiting() {
            this.setPlayerIsReady(false);
        },
        play() {
            reportPlayInfo(Object.assign(this.getBasicInfo, {
                playInfo: JSON.stringify({
                    isError: false,
                    error: ''
                })
            }));
        },
        error(event) {
            let video = document.getElementById('video');
            video && reportPlayInfo(Object.assign(this.getBasicInfo, {
                playInfo: JSON.stringify({
                    isError: true,
                    error: {
                        code: video.error && video.error.code || '',
                        msg: JSON.stringify(video.error) || '',
                        htmlPlayerErrorType: '',
                        htmlPlayerErrorDetails: '',
                        htmlPlayerErrorFrag: ''
                    }
                })
            }));
        },
        ended() {
            this.setLessonPlayer({
                id: this.playerStatus.id,
                isPlaying: false
            });
            clearTimeout(this.uploadPlayInfo);
            this.uploadPlayInfo = false;
            this.updateCourseLessonsHistory(this.playerStatus.audioMediaDTO.durationNum, true);
            this.setIsReportHeart(false);
            this.isReportHeart = true;
        },
        updateCourseLessonsHistory(time = 0, isPlaying) {
            if (!this.isLogin) return;
            let { courseId, sectionId, id: lessonId, hasLearned } = this.playerStatus;
            let historyNode = isPlaying ? parseInt(`${time}`, 10) : 0;
            const historyObj = {
                courseId,
                sectionId,
                lessonId,
                historyNode,
                mediaType: 0
            };
            fetchSaveHistory(historyObj).then(() => {
                if (!hasLearned) {
                    this.setLessonLearned({
                        sectionId,
                        lessonId
                    });
                }
            });
        },
        initAudio(needPlay) {
            let fileUrl = this.playerStatus && this.playerStatus.audioMediaDTO && this.playerStatus.audioMediaDTO.fileUrl || '';
            let video = document.getElementById('video');
            if (Hls.isSupported()) {
                let hls = new Hls();
                hls.loadSource(fileUrl);
                hls.attachMedia(video);
                this.player = video;
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = fileUrl;
                this.player = video;
            }

            if (!this.playerStatus.isSliderChange) {
                this.getLessonPlayHistory();
            }

            if (needPlay) this.player.play();
        },
        getLessonPlayHistory() {
            fetchLessonPlayHistory({ lessonId: this.playerStatus.id || '' })
                .then(res => {
                    if (res.state === 1 ) {
                        let { historyNode = 0 } = res.content || {};
                        let { audioMediaDTO } = this.playerStatus;
                        if (audioMediaDTO && historyNode >= audioMediaDTO.durationNum) {
                            historyNode = 0;
                        }
                        this.initTime = historyNode;
                        this.player.currentTime = historyNode;
                    }
                });
        },
    }
};
</script>
<style scoped>
    .video {
        display: none;
    }
</style>
