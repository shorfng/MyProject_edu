<template>
    <div
        :class="{
            'left-container top-container': true,
            'left-container-all': !this.isShowContents
        }"
    >
        <nav
            v-if="isPc"
            class="nav"
        >
            <div class="nav-back">
                <span class="kw-icon-back" />
                <span @click="back">&nbsp;返回</span>
            </div>
            <span>{{ courseInfo.courseName }}> {{ playerStatus.theme }}</span>
        </nav>
        <div
            :class="{
                'video-content': true,
                calc: isPc
            }"
        >
            <VideoPlayer
                ref="video"
                :container-style="containerStyle"
                @switchLesson="switchLesson"
                @updateLessonHistory="updateLessonHistory"
                @reportHeart="reportHeart"
                @switchPlayStatus="switchPlayStatus"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { fetchLessonPlayHistory, fetchSaveHistory } from '@/service/index';
import { PLAYER_GET_STATUS, SWITCH_PLAY_STATUS } from '@/store/actions';

export default {
    name: 'Container',
    components: {
        VideoPlayer: () => import('@components/Video/VideoPlayer')
    },
    props: {
        isShowContents: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {};
    },
    watch: {
        isSwitchVideo(val, oldVal) {
            if (!val && oldVal) {
                this.setMediaContainer();
            }
        }
    },
    computed: {
        ...mapGetters([
            'courseInfo',
            'playerStatus',
            'isSwitchVideo',
            'courseSections',
            'iscanHideFast'
        ]),
        containerStyle() {
            return this.isPc ? {} : { background: 'white' };
        }
    },
    methods: {
        ...mapMutations([
            'PLAYER_GET_STATUS',
            'SET_COURSE_SECTIONS',
            'SWITCH_PLAY_STATUS',
        ]),
        ...mapActions([
            'setLessonPlayer',
            'setLessonHistoryReq'
        ]),
        back() {
            window.history.back();
        },
        setMediaContainer() {
            let { id: lessonId, theme: lessonName } = this.playerStatus;
            fetchLessonPlayHistory({
                lessonId
            }).then(res => {
                this.PLAYER_GET_STATUS(Object.assign({}, this.playerStatus, {
                    historyNode: res.content && res.content.historyNode || 0
                }));
                setTimeout(() => {
                    let videoConfig = {
                        lessonId,
                        isTCPlayer: false,
                        controlBar: {
                            playbackRateMenuButton: !this.iscanHideFast,
                            progressControl: !this.iscanHideFast
                        },
                    };
                    this.$refs.video.initVideo(videoConfig, lessonName);
                }, 500);
            }).catch(err => {
                this.$message(err.msg);
            });
        },
        switchLesson(type, lessonInfo) {
            let { nextLesson, previousLesson, isHasNext, isHasPrevious } = this.playerStatus;
            let id = null;
            if (type === 'next' && isHasNext) {
                id = nextLesson.id;
            }
            else if (type === 'prev' && isHasPrevious) {
                id = previousLesson.id;
            }
            else if (type === 'lesson') {
                id = lessonInfo.id;
            }
            id && this.setLessonPlayer({ id });
        },
        updateLessonHistory(historyNode) {
            let { courseId, sectionId, id, hasLearned } = this.playerStatus;
            this.setLessonHistoryReq({
                courseId,
                sectionId,
                id,
                mediaType: 1,
                historyNode,
                hasLearned
            });
        },
        reportHeart() {

        },
        switchPlayStatus(status) {
            let isPause = status !== 'play';
            this.SWITCH_PLAY_STATUS(isPause);
        }
    }
};
</script>
<style lang="less">
    .exam-content-h5-tip-title {
        font-weight:500;
        font-size:32px;
        color: #ffffff;
        margin-bottom: 20px;
    }
</style>
<style lang="less" scoped>
button:active {
    opacity: 0.7;
}


@media screen and (min-width: 750px) {
    .left-container {
        margin-right: 380PX;
        transition: margin-right 0.3s ease 0s;
        height: 100%;
        overflow-y: auto;
        .nav {
            height:60PX;
            line-height: 60PX;
            background:rgba(50,55,62,1);
            font-size:14PX;
            font-weight:400;
            color:rgba(255,255,255,1);
            padding-left: 80PX;
            position: relative;
        }
        .kw-icon-back {
            &:before {
                top: 1px;
                position: relative;
            }
            &:after {
                position: absolute;
                right: -10PX;
                top: 24PX;
                display: block;
                content: '';
                height: 13PX;
                border-right: 1PX solid rgba(255, 255, 255, 0.49);
            }
        }
        .nav-back {
            position: absolute;
            top: 1PX;
            left: 10PX;
            cursor: pointer;
            &:hover {
                color: #00B38a;
            }
        }
        .video-content {
            position: relative;
            background: #272C30;
            overflow-x: hidden;
        }
    }
}

.left-container-all {
    margin-right: 0;
}

@media screen and (max-width: 750px) {
    .nav {
        display: none;
    }
    .top-container {
        height: 422px;
        position: relative;
        background: url('../../assets/train-course/live-bg@2x.png') no-repeat;
        background-size: 100%;
        .video-content {
            height: 100%;
        }
    }
}

</style>
