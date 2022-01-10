<template>
    <div>
        <div
            ref="player"
            class="player-label"
        />
        <div
            v-if="show"
            class="player"
            :class="getClassname()"
            @click="showPlayerModal"
        >
            <div
                class="close-btn-container"
                :class="{'hide-close-btn':playerStatus.isPlaying}"
                @click="closeMiniBar"
            >
                <div class="close-btn" />
            </div>
            <div class="content">
                <div class="theme single-line narrow-theme">
                    {{ playerStatus && playerStatus.theme || '' }}
                </div>
                <div class="time-course">
                    <div class="time">
                        {{ playerCurrentTime }}<span class="line" />
                    </div>
                    <span class="course-name single-line">{{ courseName }}</span>
                </div>
            </div>
            <div class="player-control">
                <div class="play-btn">
                    <div
                        :class="playBtnClassName"
                        @click.stop="togglePlay"
                    />
                </div>
                <div
                    class="play-next"
                    :class="judgeNext"
                    @click.stop="nextPlay"
                />
            </div>
        </div>
        <H5PlayerModal
            v-if="isShowPlayerModal"
            @closePlayerModal="closePlayerModal"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import H5PlayerModal from '../detail/h5PlayerModal';
export default {
    name: 'H5MiniPlayer',
    components: {
        H5PlayerModal
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        isInitCompute: {
            type: Boolean,
            default: false
        },
        bottomCls: {
            type: String,
            default: ''
        },
        isForbidScroll: {
            type: Boolean,
            default: false
        },
        containerDOMCls: {
            type: String,
            default: 'body'
        }
    },
    data() {
        return {
            courseName: this.courseInfo.courseName,
            isShowPlayerModal: false,
            preScrollY: null,
            isSlideShow: true,
            initTop: 0,
            isAutoShow: false,
            containerDOM: null
        };
    },
    computed: {
        ...mapGetters([
            'playerStatus',
            'currentCourseLessons',
            'isShowMiniBar',
            'isSlideShowMiniBar',
            'playerAllTime',
            'hasPurchaseClass',
            'playerCurrentTime'
        ]),
        playBtnClassName() {
            let classname = 'play-status';
            let playStatus = this.playerStatus.isPlaying ? 'pause' : 'playing';
            return `${classname} ${playStatus}`;
        },
        judgeNext() {
            return this.playerStatus.isHasNext ? '' : 'play-next-disabled';
        }
    },
    watch: {
        isInitCompute(val) {
            val && this.resetSlideHeight();
        }
    },
    mounted() {
        this.containerDOM = document.getElementsByClassName(this.containerDOMCls)[0];
        document.body.addEventListener('scroll', this.scrollFunc, true);
    },
    destroyed() {
        document.body.removeEventListener('scroll', this.scrollFunc);
    },
    methods: {
        ...mapActions([
            'setLessonPlayer',
            'setCurrentCourseLessons',
            'setSlideMiniBarShow',
            'setMiniBarStatus'
        ]),
        showPlayerModal() {
            this.isShowPlayerModal = true;
        },
        closePlayerModal() {
            this.isShowPlayerModal = false;
        },
        togglePlay() {
            let { id, isPlaying } = this.playerStatus;
            console.log('togglePlay isPlaying +++++++++', !isPlaying);
            this.setLessonPlayer({ id, isPlaying: !isPlaying });
            let addressId = isPlaying ? '1ndt' : '1nds';
            this.track(addressId);
        },
        nextPlay() {
            let { nextLesson, isHasNext } = this.playerStatus;
            if (isHasNext) {
                this.setLessonPlayer({ id: nextLesson.id, isPlaying: true });
                this.$route.name === 'H5Detail' && this.$router.push({
                    name: 'H5Detail',
                    query: { id: nextLesson.id }
                });
                this.track('1ndv');
            }
        },
        scrollFunc(e) {
            if (!this.containerDOM) return;
            let containerTop = this.containerDOM.getBoundingClientRect().top;
            if (!this.isShowMiniBar || !cplayer || containerTop > 0 || this.isForbidScroll || this.isShowPlayerModal) return;
            if (this.isForbidScroll && this.isSlideShowMiniBar) {
                this.setSlideMiniBarShow({ isSlideShowMiniBar: false });
                return;
            }
            let { preScrollY } = this;
            if (!preScrollY) {
                preScrollY = containerTop;
            }
            let diffY = preScrollY - containerTop;
            let isShow = diffY >= 0;
            if (isShow !== this.isSlideShowMiniBar && containerTop <= 0) {
                this.setSlideMiniBarShow({ isSlideShowMiniBar: isShow });
            }
            else if (this.isAutoShow) {
                this.setSlideMiniBarShow({ isSlideShowMiniBar: true });
                this.isAutoShow = false;
            }
            this.preScrollY = containerTop;
        },
        closeMiniBar(e) {
            e.stopPropagation();
            this.setMiniBarStatus({ isShowMiniBar: false });
            this.track('1ndr');
        },
        track(address_id) {
            this.twoPlatTrack('1nd1', {
                address_id,
                content_id: this.currentCourseLessons.id || ''
            });
        },
        getClassname() {
            let cls = '';
            if (this.hasPurchaseClass) {
                cls = 'detail-bottom';
            }
            if (this.isSlideShowMiniBar) {
                return `slide-hide ${cls}`;
            }
            return `${cls}`;
        },
        resetSlideHeight() {
            this.isAutoShow = true;
            setTimeout(() => {
                this.preScrollY = null;
                if (this.isInitCompute) {
                    this.$emit('resetCompute');
                }
            }, 300);
        }
    }
};
</script>

<style scoped lang="less">
    .player {
        position: fixed;
        left: 22px;
        right: 22px;
        bottom: 170px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 5px;
        background: rgba(91, 93, 110, 0.9);
        padding: 10px 15px 10px 10px;
        font-size: 0;
        transition: 0.3s;
        opacity: 1;
        z-index: 1;
    }
    .detail-bottom {
        bottom: 30px;
    }
    .slide-hide {
        bottom: -100px;
        opacity: 0;
    }
    .close-btn-container {
        width: 54px;
        height: 56px;
        position: relative;
        float: left;
        opacity: 1;
        transition: 0.3s;
    }
    .close-btn {
        position: absolute;
        left: 20px;
        top: 20px;
        width: 32px;
        height: 32px;
        background: url("../../assets/public-class/player-close.png") no-repeat;
        background-size: 100%;
        vertical-align: text-bottom;
    }
    .hide-close-btn {
        width: 0;
        opacity: 0;
    }
    .content {
        display: inline-block;
        margin-left: 30px;
    }
    .theme {
        font-size: 26px;
        color: #FFFFFF;
    }
    .narrow-theme {
        max-width: 412px;
    }
    .time-course {
        font-size: 0;
        color: rgba(255, 255, 255, 0.7);
    }
    .time {
        font-size: 20px;
        display: inline-block;
        vertical-align: middle;
        padding-right: 26px;
        position: relative;
    }
    .line {
        position: absolute;
        width: 1px;
        height: 15px;
        background: rgba(255, 255, 255, 0.5);
        right: 10px;
        top: 10px;
    }
    .course-name {
        font-size: 20px;
        display: inline-block;
        vertical-align: middle;
        max-width: 280px;
    }
    .single-line {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .player-control {
        font-size: 0;
        position: absolute;
        top: 50%;
        right: 0px;
        transform: translateY(-50%);
    }
    .play-btn {
        width: 58px;
        height: 58px;
        padding-left: 10px;
        display: inline-block;
        position: relative;
        .play-status {
            position: absolute;
            left: 10px;
            right: 0;
            top: 0;
            bottom: 0;
            border: 1px solid rgba(255, 255, 255, 0.5);
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            box-sizing: border-box;
            background-size: 18px;
            background-repeat: no-repeat;
            vertical-align: inherit;
            background-position: center;
        }
        .playing {
            background-image: url('../../assets/public-class/player-play@2x.png');
            -ms-background-position-x: 20px;
            background-position-x: 20px;
        }
        .pause {
            background-image: url('../../assets/public-class/player-pause@2x.png');
        }
    }
    .play-next {
        width: 24px;
        height: 58px;
        background: url("../../assets/public-class/player-next@2x.png") no-repeat 24px 18px;
        background-size: 22px 24px;
        padding: 0 30px;
        display: inline-block;
        position: relative;
        top: 0;
    }
    .play-next-disabled {
        opacity: 0.35;
    }
</style>
