<template>
    <div style="height: 100%;">
        <PhotoPreview />
        <TopLoginBanner />
        <div :class="{'chapter': true, 'chapter-bottom': !hasPurchaseClass }">
            <div id="target" />
            <div class="chapter-container">
                <div class="chapter-title">
                    {{ currentCourseLessons.theme }}
                </div>
                <div class="teacher-update">
                    {{ publishDate }}&nbsp;&nbsp;{{ teacherDTO.teacherName }}
                </div>
                <div
                    class="chapter-video-container"
                    :class="{'scale-1px':isEduApp}"
                >
                    <div
                        :class="['audio-img', playerStatusClassName]"
                        @click="setChapterPlayStatus"
                    />
                    <div class="audio-content">
                        <div class="audio-theme">
                            {{ currentCourseLessons.theme }}
                        </div>
                        <div class="audio-time">
                            大小 {{ audioMediaDTO && audioMediaDTO.fileSize }}M 时长 {{ audioMediaDTO && audioMediaDTO.duration }}
                        </div>
                    </div>
                    <div
                        v-if="videoMediaDTO.fileId"
                        class="video-content"
                        @click="showVideoModal"
                    >
                        <div class="left-line" />
                        <div class="video-img" />
                        看视频
                    </div>
                </div>
                <div
                    ref="richTextWrap"
                    class="chapter-content"
                    v-html="textContent"
                />
            </div>
            <div
                v-if="lagouEduTheme"
                class="line"
            />
            <div
                class="course-list"
                :class="isLoadCompleted ? 'course-list-show' : 'course-list-hide'"
            >
                <div class="course-list-title">
                    课时
                </div>
                <div class="course-container">
                    <div class="course-content">
                        <div
                            v-for="(lesson, index) in handleCourseSections"
                            :key="index"
                            class="chapter-item"
                            :class="getLessonCls(lesson)"
                            @click="switchLesson(lesson)"
                        >
                            <div class="chapter-item-title">
                                {{ setTheme(lesson) }}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="lagouEduTheme"
                    class="block"
                />
                <H5Message
                    :show-gray="true"
                    :show-edit="true"
                    :show-empty="true"
                    :show-message-count="false"
                />
            </div>
        </div>
        <div
            v-if="isShowPurchaseBtn"
            class="purchase-content"
            @click="purchaseCourse"
        >
            <div class="chapter-tip">
                本节为免费试看，购买后解锁全部章节
            </div>
            <button class="purchase-btn">
                <template v-if="lagouEduTheme">
                    <span class="current-price">
                        <span
                            v-if="!isVerifyUserId"
                            class="current-price-unite"
                        >￥</span>
                        <span>{{ discounts || price }}</span>
                        <span
                            v-if="isVerifyUserId"
                            class="current-price-ios-unite"
                        >勾豆</span>
                    </span>
                    <XButton
                        action-type="button"
                        class="purchase-button"
                        type="primary"
                        mini
                    >
                        {{ courseInfo.discountsTag || courseInfo.priceTag }}
                    </XButton>
                </template>
                <template v-else>
                    {{ courseInfo.discountsTag || courseInfo.priceTag }} ￥{{ discounts }}
                </template>
            </button>
        </div>
        <H5MiniPlayer
            :bottom-cls="playerBottomCls"
            :show="isShowMiniBar"
            :is-forbid-scroll="!isLoadCompleted"
            container-d-o-m-cls="chapter"
        />
        <H5ShareModal
            :show="isShowShareModal"
            @close="closeModal"
        />
        <H5Video
            :show="isShowVideoModal"
            @close="closeModal"
        />
        <Toast
            :show="isShowToast"
            :msg="toastStr"
            @onHide="hideToast"
        />
        <Purchase
            ref="Purchase"
            :w-x-purchase-success="isWXPurchaseSuccess"
            :show-purchase-alert="isShowPurchaseAlert"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { XButton } from 'vux';
import { fetchCourseLessonDetail } from '../../service';
import H5MiniPlayer from '../common/h5MiniPlayer';
import Purchase from '../common/Purchase';
import H5ShareModal from './h5ShareModal';
import H5Video from './h5VideoModal';
import TopLoginBanner from '../../common/components/Login/TopLoginBanner';
import PhotoPreview from './photoPreview';
import { getStrLength } from '../../common/js/util/string';
import { isApp, isEduApp, isLgApp, getEduAppVersion, getAppVersion, isBiggerThanSpecifiedVersion } from '../../common/js/userAgent/getVersion';
import  H5Message  from '../message/h5Message';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import { OSName } from '@js/userAgent/browser-name-and-OS';
import { Clipboard } from '@js/util/copy';

export default {
    name: 'H5',
    components: {
        H5MiniPlayer,
        H5Message,
        H5ShareModal,
        H5Video,
        Purchase,
        TopLoginBanner,
        PhotoPreview,
        XButton
    },
    data() {
        return {
            publishDate: '',
            teacher: '',
            audioTime: '',
            audioMediaDTO: {},
            content: '',
            chapterId: -1,
            discounts: -1,
            isShowShareModal: false,
            isShowVideoModal: false,
            playerBottomCls: '',
            isShowPurchaseAlert: false,
            isWXPurchaseSuccess: false,
            teacherDTO: {},
            videoMediaDTO: {},
            textContent: '',
            isApp: isApp(),
            isLoadCompleted: false,
            pageHeight: 0,
            maxScrollSite: 0,
            currentScrollSite: 0,
            timerId: null,
            isTimeToSetHistoryReq: false,
            isVerifyUserId: window.userInfo && window.userInfo.id === 3659138
        };
    },
    computed: {
        ...mapGetters([
            'courseSections',
            'currentCourseLessons',
            'hasPurchaseClass',
            'playerStatus',
            'courseInfo',
            'isShowMiniBar',
            'isSlideShowMiniBar',
            'isSharedCourse',
            'isNativeAudioPlay',
            'isGotCourseSections',
            'nativeAudioPlayerPrefix',
            'nativeLgVideoPlayerVersion',
            'userInfo',
            'isLogin'
        ]),
        playerStatusClassName() {
            console.log('playerStatusClassName: ', this.currentCourseLessons, this.playerStatus);
            let isSameCourse = this.currentCourseLessons.id === this.playerStatus.id;
            let className = 'audio-img-play';
            if (isSameCourse && this.playerStatus.isPlaying) {
                className = 'audio-img-pause';
            }
            return className;
        },
        handleCourseSections() {
            let lessons = [];
            this.courseSections.forEach(list => {
                list.courseLessons.forEach(item => {
                    lessons.push(item);
                });
            });
            return lessons;
        },
        getLessonCls() {
            return function (lesson) {
                let { type, id } = lesson;
                let freeCls = '';
                if (type === 'free') {
                    freeCls = 'chapter-item-free';
                }
                if (id === this.chapterId) {
                    return `chapter-item-lighter ${freeCls}`;
                }
                else if (type === 'lock') {
                    return 'chapter-item-lock';
                }
                else if (type === 'wait') {
                    return 'chapter-item-is-wait';
                }
                else {
                    return freeCls;
                }
            };
        },
        isShowPurchaseBtn() {
            return typeof this.hasPurchaseClass === 'boolean' && !this.hasPurchaseClass;
        }
    },
    watch: {
        $route() {
            this.isLoadCompleted = false;
            this.getChapterDetail();
            this.reportLessonRecord();
        },
        isSharedCourse(val) {
            if (val && this.isShowShareModal) {
                this.isShowShareModal = false;
                this.showVideoModal();
            }
        },
        isGotCourseSections(val, oldVal) {
            if (val && !oldVal && this.isTimeToSetHistoryReq) {
                this.reportLessonRecord();
            }
        }
    },
    mounted() {
        this.chapterId = Number(this.$route.query.id);
        this.discounts = this.courseInfo.discounts;
        this.getChapterDetail();
        this.reportLessonRecord();
        this.eduPlatTrack('WebView', { page_id: '1pqc' });
        this.isLogin && !this.playerStatus.isPlaying && this.setIsReportHeart(true);
        if (window.lgBridge) {
            window.lgBridge.request('synWebPlayStatus');
            window.lgBridge.request('LgJsNavigationBarIconInfo');
        }
    },
    methods: {
        ...mapActions([
            'setCurrentCourseLessons',
            'setLessonPlayer',
            'setMiniBarStatus',
            'setSlideMiniBarShow',
            'triggerPurchase',
            'setLessonHistoryReq',
            'setIsReportHeart'
        ]),
        reportLessonRecord() {
            if (!window.userInfo || !window.userInfo.id) return;
            if (!this.isGotCourseSections) {
                this.isTimeToSetHistoryReq = true;
                return;
            }
            this.setLessonHistoryReq();
        },
        getChapterDetail() {
            this.chapterId = Number(this.$route.query.id);
            this.setCurrentCourseLessons();
            fetchCourseLessonDetail({ lessonId: this.chapterId }).then(res => {
                if (res.state === 1) {
                    res.content.textContent = res.content.textContent.replace(/<pre>([\s\S]*?)<\/pre>/g, function(match, p1) {
                        let btnEl = p1.includes('<code') && p1.includes('</code>') ? '<div class="copy-btn">复制</div>' : '';
                        return '<div class="course-code-area">' + btnEl + '<div class="pre">' + p1 + '</div></div>';
                    });
                    res.content.audioMediaDTO = res.content.audioMedia;
                    res.content.videoMediaDTO = res.content.videoMedia;
                    Object.assign(this, res.content);
                    this.contentDetailImgAddListener();
                    this.autoScroll();
                    setTimeout(() => {
                        this.getDataForScroll();
                        // let preDOM = document.getElementsByTagName('pre');
                        // for (let i = 0, l = preDOM.length; i < l; i++) {
                        //     preDOM[i].innerHTML = '<code>' + preDOM[i].textContent + '</code>';
                        // }
                    });
                }
            }).catch(() => {
                this.isLoadCompleted = true;
            });
        },
        getDataForScroll() {
            let container = document.getElementsByClassName('chapter')[0];
            this.pageHeight = container.offsetHeight;
            document.body.addEventListener('scroll', this.pageScroll, false);
        },
        pageScroll(e) {
            this.isLogin && !this.playerStatus.isPlaying && this.setIsReportHeart(true);
            let container = document.getElementsByClassName('chapter')[0];
            if (!container) return;
            let top = Math.abs(container.getBoundingClientRect().top);
            this.currentScrollSite = top;
            if (this.maxScrollSite < top) {
                this.maxScrollSite = top;
            }
        },
        contentDetailImgAddListener() {
            $(this.$refs.richTextWrap).on('click', 'img', (e) => {
                let { currentSrc, width, height } = e.currentTarget || {};
                let pswpElement = document.querySelectorAll('.pswp')[0];
                let items = [
                    {
                        src: currentSrc,
                        w: width,
                        h: height
                    }
                ];

                let options = {
                    index: 0,
                    tapToClose: true
                };
                let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                gallery.init();
            });
            $(this.$refs.richTextWrap).on('click', '.copy-btn', (e) => {
                if (e.target.className === 'copy-btn') {
                    let val = e.target.nextSibling.innerText;
                    Clipboard(true).copy(val);
                    this.showToast('复制成功');
                }
            });
        },
        // 底部自动滚动
        autoScroll() {
            // 触发 下面课时 滚动
            let learningDOM = document.getElementsByClassName('chapter-item-lighter')[0];
            let left = learningDOM.offsetLeft;
            let width = learningDOM.offsetWidth;
            let halfWidth = document.body.clientWidth / 2 - width / 2;
            document.getElementsByClassName('course-content')[0].scrollTo(left - halfWidth, 0);
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            // 防止滚动条消失
            setTimeout(() => {
                this.isLoadCompleted = true;
            }, 300);
        },
        setChapterPlayStatus() {
            let { id } = this.currentCourseLessons;
            let { isPlaying = false, id: playerId } = this.playerStatus;
            if (playerId !== id) {
                isPlaying = false;
            }
            this.setLessonPlayer({
                id,
                isPlaying: !isPlaying
            });
            if (!isPlaying) {
                this.twoPlatTrack('1nd1', {
                    address_id: '1niu',
                    content_id: this.currentCourseLessons.id || ''
                });
            }
            let addressId = isPlaying ? '1ndi' : '1ndh';
            this.twoPlatTrack('1ncz', {
                address_id: addressId,
                content_id: this.currentCourseLessons.id || ''
            });
        },
        showVideoModal() {
            if (this.isLogin) {
                let nativeVideoPlayerVersion = '1.1.0';
                let nativeLgVideoPlayerVersion = this.nativeLgVideoPlayerVersion;
                let isNeedNativePlay = false;
                if (isEduApp()) {
                    isNeedNativePlay = isBiggerThanSpecifiedVersion(getEduAppVersion(), nativeVideoPlayerVersion);
                }
                else if (isLgApp()) {
                    let isIOS = OSName === 'iOS';
                    isNeedNativePlay = isBiggerThanSpecifiedVersion(getAppVersion(), nativeLgVideoPlayerVersion) && isIOS;
                }
                if (!this.isSharedCourse) {
                    this.isShowShareModal = true;
                    this.twoPlatTrack('1ncz', {
                        address_id: '1ndn',
                        content_id: this.currentCourseLessons.id || ''
                    });
                    return;
                }
                if (isNeedNativePlay) {
                    let courseId = this.courseInfo.id;
                    let { id, sectionId } = this.currentCourseLessons;
                    if (this.playerStatus && this.playerStatus.isPlaying) {
                        this.setLessonPlayer({
                            id: this.playerStatus.id,
                            isPlaying: false
                        });
                    }
                    let videoPlayUrl = `${this.nativeAudioPlayerPrefix}/VideoPlay?courseId=${courseId}&sectionId=${sectionId}&lessonId=${id}`;
                    window.location.href = videoPlayUrl;
                    console.log('videoPlayUrl: ', videoPlayUrl);
                    return;
                }
                else {
                    this.isShowVideoModal = true;
                }
            }
            else {
                window.open('/frontLogin.do', '_self');
            }
            this.twoPlatTrack('1ncz', {
                address_id: '1ndj',
                content_id: this.currentCourseLessons.id || ''
            });
        },
        closeModal() {
            this.isShowShareModal = false;
            this.isShowVideoModal = false;
        },
        switchLesson(item) {
            let { type, id } = item;
            let lessonType = '';
            if (type === 'lock') {
                lessonType = '未解锁';
                this.showToast('购买后即可解锁课程');
            }
            else if (type !== 'wait' && id !== this.chapterId) {
                this.$router.replace({ name: 'H5Detail', query: { id: id } });
                lessonType = this.hasPurchaseClass ? '已购买' : '试看';
            }
            lessonType && this.twoPlatTrack('1ncz', {
                address_id: '1ndq',
                lesson_type: lessonType,
                content_id: this.currentCourseLessons.id || ''
            });
        },
        setTheme(item) {
            let str = item.theme;
            let isWait = item.type === 'wait';
            let targeLen = isWait ? 30 : 13;
            if (getStrLength(str) > targeLen) {
                str = str.substr(0, 11) + '...';
            }
            return isWait ? `${str}[待更新]` : str;
        },
        purchaseCourse() {
            this.triggerPurchase();
            this.twoPlatTrack('1ncz', {
                address_id: '1nda',
                content_id: this.currentCourseLessons.id || ''
            });
            window.trackPurchase = {
                page_id: '1ncz',
                props: {
                    address_id: '1ne6',
                    content_id: this.currentCourseLessons.id || ''
                }
            };
        },
    },
    destroyed() {
        document.body.removeEventListener('scroll', this.pageScroll, false);
        document.body.scroll(0, 0);
        this.twoPlatTrack('1ncz', {
            address_id: '1nir',
            content_id: this.currentCourseLessons.id || '',
            reading_pixel_current: this.currentScrollSite,
            reading_pixel_max: this.maxScrollSite,
            page_pixel: this.pageHeight
        });
    }
};
</script>

<style lang="less">
    body {
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar {
             display: none;
         }
    }
    .chapter-content {
        @import '../../common/css/richText';
        @import '../../common/css/hljs.less';
        padding: 30px 0;
        font-size: 16PX;
        word-break: break-word;
        img{
            max-width: 100%;
        }
        .pre {
            width: auto;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            padding: 0;
            font-family: Menlo,Monaco,Consolas,Courier New,monospace;
            background-color: #fff5f5;
            font-size: .87em;
            padding: .065em .4em;
            word-break: normal;
            white-space: pre;
            color: #333;
            margin-bottom: 10px;
            code {
                margin: 0;
                word-break: normal;
                display: block;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                padding: .4em .6em;
                &::-webkit-scrollbar {
                    height: 2PX;
                }
            }
        }
    }
</style>

<style scoped lang="less">
    /deep/ .course-code-area{
        position: relative;
    }
    /deep/ .copy-btn{
        position: absolute;
        right: 10px;
        top: 8px;
        z-index: 9;
        cursor: pointer;
        background: #fff;
        font-size: 24px;
        outline: none;
        padding: 5px 20px;
        color: #333;
        font-weight: 500;
        margin-top: 5px;
        vertical-align: middle;
        border-radius: 22px;
    }
    .chapter-container {
        padding: 50px 40px;
        font-family: PingFangSC-Regular;
    }
    .chapter-title {
        font-family: PingFangSC-Medium;
        font-weight: bold;
        font-size: 40px;
        color: #333333;
    }
    .teacher-update {
        margin-top: 10px;
        font-size: 24px;
        color: #999999;
    }
    .course-info {
        margin-top: 20px;
        font-size: 0;
    }
    .course-title {
        float: left;
        font-size: 28px;
        color: #333333;
        max-width: 484px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        margin-top: 12px;
    }
    .course-btn {
        font-size: 26px;
        color: #00B38A;
        text-align: center;
        float: right;
        display: inline-block;
        padding: 18px 26px 17px;
        line-height: 26px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        font-weight: bold;
    }
    .course-btn:after {
        -webkit-border-radius: 35px;
        -moz-border-radius: 35px;
        border-radius: 35px;
        border-color: rgba(0,179,138, 0.7);
    }
    .chapter-video-container {
        background: rgba(248, 249, 250, 0.8);
        border-radius: 6px;
        padding: 28px 47px 18px 20px;
        margin-top: 30px;
        position: relative;
        height: 100px;
        .audio-img {
            width: 100px;
            height: 100px;
            background-size: 100%;
            float: left;
            background-repeat: no-repeat;
            background-image: url("../../assets/public-class/audio_bg.png");
        }
        .audio-img-play {
            background-image: url("../../assets/public-class/audio_play.png");
        }
        .audio-img-pause {
            background-image: url("../../assets/public-class/audio_pause.png");
        }
        .audio-content {
            float: left;
            margin-left: 14px;
        }
        .audio-theme {
            overflow: hidden;
            max-width: 330px;
            text-overflow:ellipsis;
            white-space: nowrap;
            font-size: 32px;
            color: #333333;
        }
        .audio-time {
            margin-top: 4px;
            font-size: 24px;
            color: #999999;
        }
        .video-content {
            font-size: 22px;
            color: #666666;
            position: absolute;
            right: 40px;
            .video-img {
                width: 60px;
                height: 60px;
                background: url("../../assets/public-class/ic_video.png") no-repeat;
                -webkit-background-size: 100%;
                background-size: 100%;
                margin: 0 auto;
            }
            .left-line {
                position: absolute;
                left: -50px;
                height: 60px;
                width: 0.5px;
                background: #E3E3E3;
                top: 20px;
            }
        }
    }

    .course-list {
        padding-top: 50px;
        .course-list-title {
            padding-left: 40px;
            font-size: 32px;
            color: #333333;
            font-family: PingFangSC-Medium;
            font-weight: 500;
        }
        .course-container {
            position: relative;
            overflow: hidden;
            height: 138px;
            margin-top: 40px;
            touch-action: pan-x;
        }
        .course-content {
            height: 200px;
            overflow-x: scroll;
            overflow-y: hidden;
            touch-action: pan-x;
            width: 100%;
            position: relative;
            -webkit-overflow-scrolling: touch;
            text-align: justify;
            -webkit-backface-visibility: hidden;
            -webkit-perspective: 1000;
            white-space: nowrap;
            padding-left: 40px;

            &::-webkit-scrollbar {
                display: none;
            }
        }
        .chapter-item {
            position: relative;
            width: 289px;
            height: 134px;
            display: inline-block;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            /*padding: 30px;*/
            touch-action: pan-x;
            border: 1px solid #E8E9EB;
            border-radius: 4px;
            -webkit-overflow-scrolling: touch;
            font-size: 26px;
            color: #333333;
            white-space: normal;
            .chapter-item-title {
                position: absolute;
                top: 30px;
                left: 30px;
                right: 30px;
                overflow: hidden;
                z-index:-1;
                text-overflow:ellipsis;
                display:-webkit-box;
                -webkit-line-clamp:2;
                -webkit-box-orient:vertical;
            }
            &:nth-of-type(n+2) {
                margin-left: 30px;
            }
            &:last-of-type {
                margin-right: 40px;
            }
        }
        .chapter-item-lighter {
           border-color: #00B38A;
           color: #00B38A;
        }
        .chapter-item-free {
            &::after {
                content: '试看';
                position: absolute;
                width: 80px;
                padding: 7px 0 6px;
                line-height: 20px;
                text-align: center;
                bottom: 0;
                right: 0;
                background: rgba(0, 179, 138, 0.8);
                border-radius: 5px 0 0 0;
                font-weight: bold;
                font-size: 20px;
                color: #FFFFFF;
            }
        }
        .chapter-item-lock {
            border: 1px solid #E8E9EB;
            &::after {
                content: '';
                position: absolute;
                width: 22px;
                height: 22px;
                bottom: 10px;
                right: 10px;
                background: url("../../assets/public-class/sale-lock.png") no-repeat;
                background-size: contain;
            }
        }
        .chapter-item-is-wait {
            color: #999999
        }
    }
    .course-list-show {
        opacity: 1;
    }
    .course-list-hide {
        opacity: 0;
    }
    .purchase-content {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        font-size: 0;
        z-index: 5;
        .chapter-tip {
            background: #FFFADC;
            font-size: 22px;
            color: #9F7A1F;
            padding: 14px 0;
            line-height: 22px;
        }
        .purchase-btn {
            font-size: 32px;
            height: 100px;
            line-height: 100px;
            border: none;
            width: 100%;
            background: #00B38A;
            color: #FFFFFF;
        }
    }
    .chapter-bottom {
        padding-bottom: 140px;
    }
    .chapter {
        position: relative;
        z-index: 1;
    }
    .line{
        margin: 0 40px;
        height: 1PX;
        background: #efefef;
    }
    .block{
        margin-top: 30px;
        height: 20px;
        width: 100%;
        background: #F8F9FA;
    }
    // 教育
    .lagouEduTheme{
        .chapter-item-lighter {
            border-color: #FBC546;
            color: #E5A817;
        }
        .chapter-item-free {
             &::after {
                background: #FBC546;
             }
        }
        .audio-img-play {
            background-image: url("../../assets/public-class/jd_xiaoke_ic_zanting@2x.png");
        }
        .audio-img-pause {
            background-image: url("../../assets/public-class/jd_xiaoke_ic_bofang@2x.png");
        }
        .chapter-video-container{
            background: none;
            border-radius:0px;
                &:after{
                    border: 1px solid #E8E9EB !important;
                    border-radius:6px;
                    z-index: -10;
                }
        }
        .course-btn{
            color: #E5A817;
        }
        .course-btn:after {
            background: rgba(251,197,70,0.12) !important;
            border: none;
        }
        .video-content {
            .video-img {
                background: url("../../assets/public-class/jd_xiaoke_ic_shexiangji@2x.png") no-repeat;
                -webkit-background-size: 100%;
                background-size: 100%;
            }
        }
        .purchase-btn {
            padding: 15px 0;
            width: 100%;
            height: 110px;
            line-height: 110px;
            z-index: 2;
            padding: 0 40px;
            border-top: 1px solid #eeeeee;
            background: #ffffff;
            text-align: left;
            box-sizing: border-box;
            max-width: 750PX;
            position: relative;
            margin: 0 auto;
            .current-price {
                font-size: 52px;
                font-weight: 600;
                color: #ff7452;
            }
            .current-price-unite {
                font-size: 32px;
                margin-right: -15px;
            }
            .current-price-ios-unite {
                font-size: 24px;
                margin-left: -10px;
                display: inline-block;
            }
            .purchase-button {
                width: 500px;
                margin: 15px 0;
                text-align: center;
                display: inline-block;
                font-size: 32px;
                color: #333333;
                border: none;
                position: absolute;
                right: 20px;
                cursor: pointer;
                border-radius: 45px;
                font-weight: bolder;
                background:linear-gradient(270deg,rgba(250,168,62,1) 0%,rgba(251,197,70,1) 100%);
                &:after{
                    border: none;
                }
                &:active{
                    color: #333333;
                }
            }
        }

    }
</style>
