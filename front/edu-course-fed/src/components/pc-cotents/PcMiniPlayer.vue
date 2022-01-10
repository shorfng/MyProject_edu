<template>
    <div
        class="player-container-wrap"
    >
        <div
            class="player"
        >
            <div
                class="close-btn"
                :class="{'pause-state':pauseState}"
                @click="closeMiniBar"
            />
            <div class="content">
                <div class="theme single-line narrow-theme">
                    {{ playerStatus && playerStatus.theme || '' }}
                </div>
                <div class="time-course">
                    <div class="time">
                        {{ playerCurrentTime ||'' }}<span class="line" />
                    </div>
                    <span class="course-name single-line">{{ courseInfo.courseName }}</span>
                </div>
            </div>
            <div class="player-container">
                <div
                    class="play-btn"
                    @click="togglePlay"
                >
                    <div
                        v-if="isPlayerReady"
                        :class="playBtnClassName"
                    />
                    <div
                        v-else
                        class="loading-icon-wrap"
                    >
                        <LoadingIcon />
                    </div>
                </div>
                <div
                    class="play-next"
                    :class="{'next-unable':!playNextButtonUseable}"
                    @click="nextPlay"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import LoadingIcon from '../common/LoadingIcon';
import Toast from '../common/Toast';
import { getParam } from '../../common/js/util/getParam';

export default {
    name: 'PcMiniPlayer',
    components: {
        LoadingIcon
    },
    props: {
    },
    data() {
        return {
            msg: '',
            preScrollY: null,
            DOMCls: '',
            scrollDOMCls: ''
        };
    },
    computed: {
        ...mapGetters([
            'playerStatus',
            'currentCourseLessons',
            'courseInfo',
            'miniBarIsShow',
            'isClickStartToPlayMusic',
            'playerCurrentTime',
            'isSlideShowMiniBar',
            'isShowMiniBar',
            'isPlayerReady',
            'userInfo',
            'isLogin'
        ]),
        playBtnClassName() {
            let classname = 'play-status';
            let playStatus = this.playerStatus.isPlaying ? 'pause' : 'playing';
            return `${classname} ${playStatus}`;
        },
        playNextButtonUseable() {
            return !!(this.playerStatus.isHasNext);
        },
        pauseState() {
            return !!(!this.playerStatus.isPlaying && this.isSlideShowMiniBar);
        },
    },
    watch: {
    },
    mounted() {
        let DOMCls = '';
        if (this.$route.name === 'courseContent') {
            DOMCls = '.content-container';
            this.scrollDOMCls = '.container';
        }
        else {
            DOMCls = '.right-content-wrap';
            this.scrollDOMCls = '.main-wrap';
        }
        this.DOMCls = DOMCls;
        let selectDOM = document.querySelector(DOMCls);
        selectDOM && selectDOM.addEventListener('scroll', this.scrollFunc);
    },
    destroyed() {
        let selectDOM = document.querySelector(this.DOMCls);
        selectDOM && selectDOM.removeEventListener('scroll', this.scrollFunc);
    },
    methods: {
        ...mapActions([
            'setLessonPlayer',
            'setCurrentCourseLessons',
            'setSlideMiniBarShow',
            'setMiniBarStatus',
            'setIsReportHeart'
        ]),
        togglePlay() {
            if (!this.isPlayerReady) return;
            let { id, isPlaying } = this.playerStatus;
            if (isPlaying) {
                this.saReport('1ndt');
            } else {
                this.saReport('1nds');
            }
            this.setLessonPlayer({ id, isPlaying: !isPlaying });
            if (id === this.currentCourseLessons.id) {
                let newData = Object.assign({}, this.currentCourseLessons, { isPlaying: !isPlaying });
                this.setCurrentCourseLessons(newData);
            }
        },
        saReport(reportAddress) {
        },
        nextPlay() {
            let { id } = this.currentCourseLessons;
            let { nextLesson, isHasNext } = this.playerStatus;
            let { name } = this.$router.history.current;
            if (isHasNext) {
                this.setLessonPlayer({ id: nextLesson.id, isPlaying: true });
                this.saReport('1ndv');
                if (name === 'pcDetail') {
                    this.$router.push({ name: 'pcDetail', query: { id: nextLesson.id } });
                } else {
                    this.setCurrentCourseLessons(nextLesson);
                }
            }
        },
        closeMiniBar() {
            this.saReport('1ndr');
            let { id, isPlaying } = this.playerStatus;
            this.setSlideMiniBarShow({ isSlideShowMiniBar: false });
            this.setLessonPlayer({ id, isPlaying: false });
            this.setMiniBarStatus({ isShowMiniBar: false });
        },
        scrollFunc(e) {
            this.isLogin && !this.playerStatus.isPlaying && this.$route.name === 'pcDetail' && this.setIsReportHeart(true);
            if (!this.isShowMiniBar) return;
            let { preScrollY } = this;
            let top = 0;
            let selectDOM = document.querySelector(this.scrollDOMCls);
            if (!selectDOM) return;
            top = selectDOM.getBoundingClientRect().top;
            if (!preScrollY) {
                preScrollY = top;
            }
            let diffY = preScrollY - top;
            let isSlideShowMiniBar = diffY <= 0;
            if (this.isSlideShowMiniBar !== isSlideShowMiniBar) {
                this.setSlideMiniBarShow({ isSlideShowMiniBar });
            }
            this.preScrollY = top;
        }
    }
};
</script>

<style scoped lang="less">
    div{
        box-sizing: border-box;
    }
    .player-container-wrap{
        background: rgba(91,93,110,0.9);
        border-radius: 3PX;
        padding: 8PX 20PX 8PX 20PX;
        font-size: 0;
        width: 690PX;
        height:54PX;
        overflow: hidden;
    }
    .player {
        // position: fixed;
        // bottom: 51PX;
        // left: 50%;
        // margin-left: -345PX;
        // z-index: 30;
        text-align: left;
    }
    .close-btn {
        width: 21PX;
        height: 22PX;
        background: url("../../assets/pc-detail/mini-close.png") no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        vertical-align: top;
        margin-top: 8PX;
        margin-right: 20PX;
        cursor: pointer;
        transition: .3s;
        margin-left: -41PX;
        opacity: 0;
        &.pause-state{
            margin-left:0;
            opacity: 1;
        }
    }
    .content {
        display: inline-block;
        vertical-align: top;
        transition: .3s;
    }
    .theme {
        font-size: 14PX;
        line-height: 14PX;
        color: #FFFFFF;
        margin-bottom: 8PX;
        margin-top: 2PX;
    }
    .narrow-theme {
        max-width: 412PX;
    }
    .time-course {
        font-size: 0;
        color: rgba(255, 255, 255, 0.7);
    }
    .time {
        font-size: 12PX;
        display: inline-block;
        vertical-align: middle;
        padding-right: 20PX;
        position: relative;
        opacity: 0.7;
        line-height: 12PX;
    }
    .line {
        position: absolute;
        width: 1PX;
        height: 9PX;
        background: rgba(255, 255, 255, 0.5);
        right: 10PX;
        top: 2PX;
    }
    .course-name {
        font-size: 12PX;
        display: inline-block;
        vertical-align: middle;
        max-width: 280PX;
        line-height: 12PX;
        opacity: 0.7;
    }
    .single-line {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .player-container {
        float: right;
        font-size: 0;
        margin-top: 3PX;
    }
    .play-btn {
        width: 34PX;
        height: 34PX;
        display: inline-block;
        border: 1PX solid rgba(255, 255, 255, 0.5);
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        line-height: 32PX;
        text-align: center;
        vertical-align: middle;
        box-sizing: border-box;
        cursor: pointer;
        .play-status {
            width: 19PX;
            height: 19PX;
            display: inline-block;
            background-size: contain;
            background-repeat: no-repeat;
            vertical-align: inherit;
        }
        .playing {
            background-image: url('../../assets/pc-detail/mini-play.png');
        }
        .pause {
            background-image: url('../../assets/pc-detail/mini-pause.png');
        }
    }
    .play-next {
        width: 20PX;
        height: 20PX;
        background: url("../../assets/pc-detail/mini-next.png") no-repeat;
        background-size: 100%;
        margin-left: 28PX;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
        &.next-unable{
            opacity: 0.35;
        }
    }
    .loading-icon-wrap{
        padding-top: 6PX;
        padding-left: 6PX;
        .loading-icon{
            width: 20PX;
            height: 20PX;
        }
    }
</style>
