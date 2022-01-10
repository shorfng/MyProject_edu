<template>
    <div>
        <div class="media-container">
            <div
                class="button-wrap inline-block"
                @click="switchStartOrPaus"
            >
                <div
                    v-if="isPlayerReady"
                    class="button-icon inline-block"
                    :class="{'isPause':currentPlayerStatus.isPlaying}"
                />
                <div
                    v-else
                    class="loading-icon-wrap"
                >
                    <LoadingIcon />
                </div>
            </div>
            <div class="data-wrap inline-block">
                <ProgressBar
                    :current-lesson-last-play-history="currentLessonLastPlayHistory"
                    @changeSlider="changeSlider"
                />
                <div class="detail-wrap ">
                    <div class="detail-one">
                        {{ audioMediaData && audioMediaData.fileSize }}M
                    </div>
                    <div class="detail-two">
                        {{ renderCurrentPlayerTime }}/{{ audioMediaData && audioMediaData.duration }}
                    </div>
                </div>
            </div>
            <div class="division-line inline-block" />
            <div
                class="viedo-wrap inline-block"
                :class="{'unable-video':!videoMediaData.fileId}"
                @click="openDialog"
            >
                <div class="viedo-icon" />
                <div class="text">
                    看视频
                </div>
            </div>
        </div>
        <div v-if="videoStatus.dialogVisible">
            <el-dialog
                :visible="videoStatus.dialogVisible"
                :modal-append-to-body="true"
                :append-to-body="true"
                :custom-class="'video-modal-wrap'"
                :width="videoStatus.width"
                :top="videoStatus.top"
                :lock-scroll="true"
                center
            >
                <div
                    class="video-content-wrap"
                >
                    <div
                        class="close-icon"
                        @click="closeDialog"
                    />
                    <div
                        v-if="videoStatus.isNeedShare"
                        class="share-wrap"
                    >
                        <div class="share-bg-wrap">
                            <img
                                class="image"
                                :src="shareImageUrl"
                            >
                            <div class="lock-image" />
                        </div>
                        <div class="share-info">
                            <div
                                id="qrcode"
                                ref="qrcode"
                                class="qrcode"
                            />
                            <div class="text-wrap">
                                <div class="dec-one">
                                    分享即可解锁视频功能
                                </div>
                                <div class="dec-two">
                                    微信扫一扫，分享到微信好友/朋友圈
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="video-wrap">
                            <div class="top-title">
                                {{ currentCourseLessons.theme }}
                            </div>
                            <CourseVideo />
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { formatTime } from '../../common/js/util/formatTime';
import ProgressBar from '../common/ProgressBar';
import LoadingIcon from '../common/LoadingIcon';
import QRCode  from 'qrcodejs2';
import { fetchCheckCourseShareStatus, fetchGetAutoLoginUrl } from '../../service';
import { getParam } from '../../common/js/util/getParam';

export default {
    components: {
        CourseVideo: () => import('../common/VideoPlayer'),
        ProgressBar,
        LoadingIcon
    },
    props: {
        audioMediaData: {
            type: Object,
            default: () => {
                return {
                };
            }
        },
        videoMediaData: {
            type: Object,
            default: () => {
                return {
                };
            }
        },
        currentLessonLastPlayHistory: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            value: 0,
            audio: {
                currentTime: 0,
                maxTime: 180,
                playing: false,
                muted: false,
                speed: 1,
                waiting: true,
                preload: 'auto'
            },
            videoStatus: {
                isNeedShare: false,
                width: '800px',
                top: '20vh',
                dialogVisible: false
            },
            shareImageUrl: '',
            shareQrCodeUrl: '',
            pollGetShareStateTimer: null,
        };
    },
    computed: {
        ...mapGetters([
            'currentCourseLessons', //当前课程
            'playerStatus', //播放的按钮状态
            'isSlideShowMiniBar', //mini小条是否展示
            'isShowMiniBar', //点击播放纽播放音乐
            'hasPurchaseClass', //是否购买该课
            'playerAllTime',  //格式化后的所有时间
            'playerCurrentTime', //格式化后的当前时间
            'playerDuration', //未格式化的总时间
            'playerSecondCurrentTime', //未格式化的当前时间
            'courseInfo',
            'isPlayerReady',
            'isPlayerFirstLoaded',
            'userInfo',
            'isLogin'

        ]),
        currentPlayerStatus: function() {
            let { id: currentId } = this.currentCourseLessons;
            let { id: playerId } = this.playerStatus;
            if (currentId === playerId) {
                return this.playerStatus;
            } else {
                return {
                    isPlaying: false
                };
            }
        },
        renderCurrentPlayerTime: function() {
            let { id: currentId } = this.currentCourseLessons;
            let { id: playerId } = this.playerStatus;
            if (currentId === playerId && this.isPlayerFirstLoaded) {
                return this.playerCurrentTime;
            } else {
                return formatTime(this.currentLessonLastPlayHistory);
            }
        },
    },
    watch: {
        currentCourseLessons: function() {
            this.getAutoLoginUrl();
        },
    },
    mounted() {
        this.getVideShareStatus();
    },
    methods: {
        ...mapActions([
            'setLessonPlayer',
            'setSlideMiniBarShow',
            'setMiniBarStatus',
            'setFormatPlayerCurrentTime',
        ]),
        switchStartOrPaus() {
            if (!this.isPlayerReady) return;
            let { isSlideShowMiniBar } = this;
            let { id } = this.currentCourseLessons;
            let { isPlaying } = this.currentPlayerStatus;
            if (!isPlaying && !isSlideShowMiniBar) { isSlideShowMiniBar = true }
            if (isPlaying) {
                this.saReport('1ndi');
            } else {
                this.saReport('1ndh');
            }
            this.setLessonPlayer({ id, isPlaying: !isPlaying });
            this.setSlideMiniBarShow({ isSlideShowMiniBar });
            if (!this.isShowMiniBar) {
                this.saReport('1niu', '1nd1');
            }
            this.setMiniBarStatus({ isShowMiniBar: true });
        },
        saReport(reportAddress, pageId = '') {
        },
        openDialog() {
            if (!this.isLogin) {
                window.open('/frontLogin.do', '_self');
                return;
            }
            if (!this.videoMediaData.fileId) return;
            // let { isNeedShare } = this.videoStatus;
            document.documentElement.style.overflowY = `hidden`;
            this.videoStatus.dialogVisible = true;
            // if (isNeedShare) {
            //     this.$nextTick(function () {
            //         this.qrcode();
            //     });
            //     !this.pollGetShareStateTimer && this.pollGetShareStatus();
            //     this.saReport('1ndn');
            // } else {
            this.saReport('1ndj');
            document.body.classList.add('pcVideoModalShow');
            // }
        },
        closeDialog() {
            let { isNeedShare } = this.videoStatus;
            if (isNeedShare) {
                isNeedShare && (this.$refs.qrcode.innerHTML = '');
            } else {
                document.body.classList.remove('pcVideoModalShow');
            }
            document.documentElement.style.overflowY = `auto`;
            this.videoStatus.dialogVisible = false;
        },
        qrcode() {
            new QRCode('qrcode', {
                width: 80,
                height: 80,
                text: this.shareQrCodeUrl,
            });
        },
        setVideCanWatch() {
            Object.assign(this.videoStatus, {
                isNeedShare: false,
                width: '800px',
                top: '20vh',
            });
        },
        getVideShareStatus() {
            let { id: courseId } = this.courseInfo;
            let url = `#/content?courseId=${this.courseInfo.id}&shareFrom=PC_SHARE&lessonId=${this.currentCourseLessons.id}`;
            fetchCheckCourseShareStatus(url)
                .then(res => {
                    if (res.state === 1) {
                        this.setVideCanWatch();
                    } else {
                        let { shareImageUrl = '', autoLoginUrl = '' } = res && res.content || {};
                        this.shareImageUrl = shareImageUrl;
                        this.shareQrCodeUrl = autoLoginUrl;
                    }
                });
        },
        pollGetShareStatus() {
            this.pollGetShareStateTimer = setInterval(() => {
                fetchCheckCourseShareStatus()
                    .then(res => {
                        if (res.state === 1) {
                            let { dialogVisible } = this.videoStatus;
                            dialogVisible && document.body.classList.add('pcVideoModalShow');
                            this.setVideCanWatch();
                            this.pollGetShareStateTimer && clearInterval(this.pollGetShareStateTimer);
                            this.saReport('1ndp');
                        }
                    });
            }, 2000);
        },
        getAutoLoginUrl() {
            let { isNeedShare } = this.videoStatus;
            if (!isNeedShare) return;
            let url = `https://kaiwu.lagou.com/course/main.html#/detail/h5?id=${this.currentCourseLessons.id}&from=PC_SHARE`;
            fetchCheckCourseShareStatus(url)
                .then(res => {
                    let { autoLoginUrl = '' } = res && res.content || {};
                    this.shareQrCodeUrl = autoLoginUrl;
                });
        },
        changeSlider() {
            let { isSlideShowMiniBar } = this;
            let { isPlaying } = this.currentPlayerStatus;
            if (!isPlaying && !isSlideShowMiniBar) { isSlideShowMiniBar = true }
            this.setSlideMiniBarShow({ isSlideShowMiniBar });
            this.setMiniBarStatus({ isShowMiniBar: true });
        }

    }
};
</script>

<style lang="less">

</style>

<style lang="less" scoped>
    div{
      box-sizing: border-box;
    }
    .loading-icon-wrap{
        padding-top: 12PX;
        padding-left: 15PX;
        .loading-icon{
            width: 30PX;
            height: 30PX;
        }
    }
    .inline-block{
        display: inline-block;
        vertical-align: top;
    }
    .video-content-wrap{
        .close-icon{
            width: 26PX;
            height: 26PX;
            background-repeat: no-repeat;
            background-size:100% 100%;
            background-image:url('../../assets/pc-detail/close-icon.png');
            position: absolute;
            top: 0;
            right: -46PX;
            cursor: pointer;
        }
        .share-wrap{
            background: #FFFFFF;
            border-radius: 3PX;
        }
        .share-bg-wrap{
            position: relative;
            .image{
                display: block;
                width: 100%;
            }
            .lock-image{
                position: absolute;
                width: 80PX;
                height: 80PX;
                top:50%;
                left: 50%;
                background-repeat: no-repeat;
                background-size:100% 100%;
                background-image:url('../../assets/pc-detail/page-lock.png');
                transform: translate(-50%,-50%);
            }
        }
        .share-info{
            padding: 15PX 0 15PX 107PX;
            overflow: hidden;
            .qrcode{
                width: 80PX;
                height: 80PX;
                background: #E6E6E6;
                margin-right: 22PX;
                float: left;
            }
            .text-wrap{
                float: left;
                font-size: 12PX;
                color: #999999;
                margin-top: 10PX;
                .dec-one{
                    margin-bottom: 5PX;
                    font-size: 20PX;
                    color: #333333;
                    font-weight: 700;
                }
            }
        }
        .video-wrap{
            position: relative;
            .top-title{
                position: absolute;
                left: 0;
                top: -50PX;
                font-size: 20PX;
                color: #FFFFFF;
                font-weight: 700;
            }
        }
    }
    .media-container{
        width: 100%;
        font-size: 0;
        text-align: left;
        padding-left: 20PX;
        padding-top: 18PX;
        padding-bottom: 8PX;
        background: #F6F6F6;
        border-radius: 6PX;
        .button-wrap{
            width: 60PX;
            height: 60PX;
            border-radius: 100%;
            margin-right: 30PX;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url('../../assets/pc-detail/green-background.png');
            text-align: center;
            cursor: pointer;
        }
        .button-icon{
            width: 22PX;
            height: 23PX;
            background-size: 100%;
            background-repeat: no-repeat;
            background-image: url('../../assets/pc-detail/pause.png');
            margin-top: 16PX;
            &.isPause{
                background-image: url('../../assets/pc-detail/start.png');
            }
        }
        .data-wrap{
            width: 460PX;
            margin-top: 9PX;
            font-size: 14PX;
            color: #999999;
        }
        .detail-wrap{
            margin-top: 8PX;
            .detail-one{
                float: left;
            }
            .detail-two{
                float: right;
            }
        }
        .division-line{
            width: 1PX;
            height: 40PX;
            background: #E6E6E6;
            margin-left: 34PX;
            margin-right: 35PX;
            margin-top: 6PX;
        }
        .viedo-wrap{
            font-size: 14PX;
            color: #666666;
            text-align: center;
            cursor: pointer;
            &.unable-video{
                color: #999999;
                cursor: default;
                .viedo-icon{
                    background-image: url('../../assets/pc-detail/video-unable.png');
                }
            }
            .viedo-icon{
                width: 31PX;
                height: 30PX;
                margin-bottom: 4PX;
                margin-left: 5PX;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-image: url('../../assets/pc-detail/video.png');
            }
        }
    }

</style>
