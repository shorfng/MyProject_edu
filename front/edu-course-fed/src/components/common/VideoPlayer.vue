<template>
    <VideoPlayer
        ref="video"
        class="video-container"
        :video-config="videoConfig"
        @setPlayer="setPlayer"
        @canplay="getLessonPlayHistory"
        @play="playHandler"
        @timeupdate="timeupdateHandler"
        @pause="pauseHandle"
        @ended="endedHandler"
        @error="errorHandler"
    />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { reportPlayInfo } from '@js/util/reportPlayInfo';
import { browserName, OSName, fullVersion } from '@js/userAgent/browser-name-and-OS.js';
import { getAppVersion, isApp } from '@js/userAgent/getVersion';
import { fetchSaveHistory, fetchLessonPlayHistory } from '../../service';
import VideoPlayer from '@/common/components/Player/Index';

export default {
    name: 'CourseVideo',
    components: {
        VideoPlayer
    },
    data() {
        return {
            player: null,
            uploadPlayInfo: false,
            uploadPlayAuth: false,
            appVersion: '',
            isReportHeart: true,
            isTCPlayer: true,
            appId: null,
            fileId: null,
            lessonId: null,
            isFirstCanPlay: true,
            videoConfig: {}
        };
    },
    computed: {
        ...mapGetters([
            'currentCourseLessons',
            'courseInfo',
            'hasPurchaseClass',
            'playerStatus',
            'playerSecondCurrentTime',
            'isTCPlayerChannel',
            'iscanHideFast',
            'userInfo',
            'isLogin'
        ]),
        getBasicInfo() {
            return {
                userId: window.userInfo && window.userInfo.id || '',
                currentEnvironment: this.currentEnvironment,
                browserName: browserName || '',
                OSName: OSName,
                browserVersion: fullVersion || '',
                appVersion: this.appVersion || '',
                courseId: this.currentCourseLessons.courseId,
                lessonId: this.currentCourseLessons.id
            };
        }
    },
    created() {
        if (isApp()) {
            this.appVersion = getAppVersion();
        }
    },
    mounted() {
        this.initData(true);
    },
    beforeDestroy() {
        if (this.player && this.player.getCurrentTime()) {
            if (this.currentCourseLessons.id === this.playerStatus.id) {
                this.setFormatPlayerCurrentTime(this.player.getCurrentTime());
            }
        }
        clearTimeout(this.uploadPlayInfo);
        clearInterval(this.uploadPlayAuth);
        this.uploadPlayAuth = false;
        this.uploadPlayInfo = false;
        this.updateCourseLessonsHistory(true);
        this.player && this.player.dispose();
        this.setIsReportHeart(false);
        this.isReportHeart = true;
    },
    methods: {
        ...mapActions([
            'setCurrentCourseLessons',
            'setFormatPlayerCurrentTime',
            'setLessonPlayer',
            'setIsReportHeart',
            'setLessonHistoryReq'
        ]),
        initData() {
            let { id } = this.currentCourseLessons;
            this.videoConfig = {
                lessonId: id,
                isTCPlayer: this.isTCPlayerChannel,
                controlBar: {
                    playbackRateMenuButton: !this.iscanHideFast,
                    progressControl: !this.iscanHideFast
                },
            };
            if (this.playerStatus && this.playerStatus.isPlaying) {
                this.setLessonPlayer({
                    id: this.playerStatus.id,
                    isPlaying: false
                });
            }
        },
        setPlayer(player) {
            this.player = player;
        },
        getLessonPlayHistory() {
            fetchLessonPlayHistory({ lessonId: this.currentCourseLessons.id || '' })
                .then(res => {
                    let historyNode = 0;
                    if (res.state === 1) {
                        historyNode = res.content && res.content.historyNode || 0;
                        console.log('fetchLessonPlayHistory++++++++++++', historyNode);
                        this.player.setCurrentTime(historyNode);
                    }
                });
        },
        track() {
            try {
                let startTime = this.player.getCurrentTime() || 0;
                let hour = Math.floor(startTime / 60);
                hour = hour > 9 ? hour : '0' + hour;
                let min = Math.floor(startTime % 60);
                min = min > 9 ? min : '0' + min;
                startTime = hour + ':' + min;
                let { courseName } = this.courseInfo;
                let { courseId, id, theme } = this.currentCourseLessons;
                this.eduPlatTrack('StartWatchVideo', {
                    courses_id: [String(courseId)],
                    courses_name: [courseName],
                    reclass_id: String(id),
                    reclass_name: theme,
                    video_time: 0,
                    start_time: startTime
                });
            }
            catch (e) {
                console.log(e);
            }
        },
        playHandler() {
            let { id, isPlaying } = this.playerStatus;
            if (this.currentCourseLessons.id === id && isPlaying) {
                this.setLessonPlayer({
                    id: this.currentCourseLessons.id,
                    isPlaying: false
                });
            }
            else {
                this.track();
            }
            const basicInfo = this.getBasicInfo;
            reportPlayInfo(Object.assign(basicInfo, {
                playInfo: JSON.stringify({
                    isError: false,
                    error: ''
                })
            }), true);
            this.twoPlatTrack('1ncz', {
                address_id: '1ndk',
                content_id: this.currentCourseLessons.id || ''
            });
        },
        timeupdateHandler() {
            if (this.isLogin && !this.uploadPlayInfo) {
                this.uploadPlayInfo = setTimeout(() => {
                    this.updateCourseLessonsHistory(true);
                    clearTimeout(this.uploadPlayInfo);
                    this.uploadPlayInfo = false;
                }, 3000);
            }
            if (this.isLogin && this.isReportHeart) {
                this.isReportHeart = false;
                this.setIsReportHeart(true);
                setTimeout(() => {
                    this.isReportHeart = true;
                }, 61000);
            }
        },
        pauseHandle() {
            this.twoPlatTrack('1ncz', {
                address_id: '1ndm',
                content_id: this.currentCourseLessons.id || ''
            });
            this.setIsReportHeart(false);
            this.isReportHeart = true;
        },
        endedHandler() {
            if (this.currentCourseLessons.fileId) {
                this.player.setCurrentTime(0);
                this.player.pause();
            }
            clearTimeout(this.uploadPlayInfo);
            this.uploadPlayInfo = false;
            this.updateCourseLessonsHistory(false);
            this.setIsReportHeart(false);
            this.isReportHeart = true;
        },
        errorHandler(e) {
            const data = e.data;
            const isSpecialError = data && data.code > 13 && data.code < 18;
            const basicInfo = this.getBasicInfo;
            reportPlayInfo(Object.assign(basicInfo, {
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
        },
        updateCourseLessonsHistory(isPlaying) {
            if (!this.isLogin) return;
            let { courseId, sectionId, id, hasLearned } = this.currentCourseLessons;
            let historyNode = isPlaying ? parseInt(this.player && this.player.getCurrentTime(), 10) : 0;
            this.setLessonHistoryReq({
                courseId,
                sectionId,
                id,
                mediaType: 1,
                historyNode,
                hasLearned
            });
        },
    }
};
</script>

<style lang="less" scoped>
    @media screen and (min-width: 750px) {
        .video-container {
            height: 450PX !important;
        }
    }
    .player-container.video-container {
        height: 420px;
        position: relative;
        background-color: #ffffff;
    }
</style>
