<template>
    <div style="height: 100%;">
        <div
            class="detail-part-content-title"
        >
            课程目录
        </div>
        <div class="study-percent-tip">
            <div class="week-progress">
                <img
                    class="video-book"
                    src="../../assets/public-class/video_ic_book@2x.png"
                    alt=""
                >
                <span class="progress-label">{{ courseInfo.courseName }}</span>
            </div>
        </div>
        <div class="detail-part-content-pc calc detail-part-content">
            <!-- pc 左侧收起按钮 -->
            <div
                v-if="isPc"
                class="content-fold"
                @click="toggleContents"
            >
                <div
                    :class="{
                        'content-fold-img': true,
                        'content-fold-img-rotate': !isShowContents
                    }"
                />
            </div>
            <div class="content-container">
                <div
                    v-if="isPc && isShowFixed"
                    class="section-name-fixed"
                    :class="{'right-hide': isShowFixed && !isShowContents}"
                >
                    <div class="section-name-single single-line">
                        {{ fixedSectionName }}
                    </div>
                </div>
                <div
                    v-for="(sectionItem, sectionIndex) in courseSections"
                    :key="sectionItem.id"
                    v-if="sectionItem.status"
                >
                    <div
                        class="content-label"
                        @click="clickLabel(sectionIndex)"
                    >
                        <div class="content-label-title single-line">
                            {{ sectionItem.sectionName }}
                        </div>
                        <img
                            src="../../assets/train-course/day-arrow@2x.png"
                            :class="'arrow-icon ' + (sectionItem.fold && 'arrow-icon-fold' || '')"
                            alt=""
                        >
                    </div>
                    <div :class="'content-sections ' + (sectionItem.fold && 'content-sections-fold' || '')">
                        <div
                            v-for="(item, index) in sectionItem.courseLessons"
                            :key="item.id"
                            v-if="item.status"
                            :class="{
                                'content-section': true,
                                'content-section-choose': playerStatus.id === item.id
                            }"
                            @click="clickSection(item, sectionIndex, index)"
                        >
                            <div
                                :class="{
                                    'section-item clearfix': true,
                                    'section-item-wait': !item.hasVideo
                                }"
                            >
                                <span
                                    v-if="isPc"
                                    class="kw-icon-video section-type-icon fl"
                                />
                                <span
                                    :class="{
                                        'multiple-lines': getStrLength(item.theme) > 66,
                                        'section-dec': true,
                                        'need-update': item.type === 'wait' || item.type === 'lock'
                                    }"
                                >
                                    {{ getSectionContent(item) }}
                                </span>
                                <span
                                    :class="{
                                        'section-status-icon': true,
                                        'lesson-icon-media': !isPause,
                                        'pause-play': isPause,
                                    }"
                                >
                                    {{ item.type === 'wait' ? '待更新' : '' }}
                                    {{ item.type === 'lock' ? '未解锁' : '' }}
                                </span>
                            </div>
                            <div
                                v-if="item.type !== 'wait'"
                                class="section-duration"
                            >
                                <span
                                    v-if="!item.hasLearned && item.canPlay"
                                    class="not-learn"
                                >未学</span>
                                <span>时长：{{ item.duration || '' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Toast
            :show="isShowToast"
            :msg="toastStr"
            @onHide="hideToast"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getStrLength } from '@js/util/string';

export default {
    name: 'Content',
    data() {
        return {
            isShowContents: true,
            courseSectionsTop: [],
            sectionNameHeight: null,
            isShowFixed: false,
            fixedSectionName: '',
            fixedSectionTop: null,
        };
    },
    computed: {
        ...mapGetters([
            'courseSections',
            'courseInfo',
            'isGotCourseSections',
            'playerStatus',
            'isPause',
        ])
    },
    watch: {
        isGotCourseSections: {
            handler(val, oldVal) {
                if (val && !oldVal) {
                    this.handleLessonsData();
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.getSectionNameTop();
        this.initScrollListener();
    },
    methods: {
        ...mapActions([
            'setLessonPlayer'
        ]),
        getStrLength,
        getSectionContent(item) {
            let str = item.theme;
            return getStrLength(str) > 70 ? this.sliceStr(str, 70) : str;
        },
        sliceStr(str, count) {
            if (!str) {
                return '';
            }
            let strCount = count || 10;
            let num = 0;
            let ind;
            for (let i = 0; i < str.length; i++) {
                num += getStrLength(str[i]);
                if (num >= strCount) {
                    ind = i;
                    break;
                }
            }
            return str.slice(0, ind);
        },
        handleLessonsData(isSetContainer = true) {
            if (!this.isGotCourseSections) return;
            let { lessonId } = this.$route.query;
            this.setLessonPlayer({
                id: Number(lessonId)
            });
            this.$nextTick(() => {
                setTimeout(() => {
                    let playingLessonDOM = document.querySelector('.content-section-choose');
                    playingLessonDOM && playingLessonDOM.scrollIntoView({
                        behavior: 'smooth'
                    });
                }, 300);
            });
        },
        toggleContents() {
            this.isShowContents = !this.isShowContents;
            this.$emit('switchMenu', this.isShowContents);
        },
        clickSection(lesson) {
            let { id, courseId } = lesson;
            if (id === this.playerStatus.id) return;
            if (lesson.type === 'wait') {
                let method = this.isPc ? '$message' : 'showToast';
                this[method]('内容还未更新，请等等哦');
                return;
            }
            if (lesson.type === 'lock') {
                let method = this.isPc ? '$message' : 'showToast';
                this[method]('请购买课程');
                return;
            }
            this.setLessonPlayer({ id });
            this.$router.replace({
                name: 'videoDetail',
                query: {
                    lessonId: id,
                    courseId
                }
            });
        },
        clickLabel(index) {
            let item = this.courseSections[index];
            item.fold = !item.fold;
            this.$set(this.courseSections, index, item);
        },
        getSectionNameTop() {
            this.courseSectionsTop = [];
            let courseSections = document.querySelectorAll('.content-label');
            let { height } = courseSections[0].getBoundingClientRect();
            this.sectionNameHeight = height;
            let PcContainerPaddingTop = 60;
            courseSections.forEach(item => {
                let top = 0;
                if (this.isPC) {
                    top = item.offsetTop + PcContainerPaddingTop;
                }
                else {
                    top = item.offsetTop;
                }
                this.courseSectionsTop.unshift({
                    top,
                    text: item.textContent.trim()
                });
            });
        },
        initScrollListener() {
            window.addEventListener('scroll', this.handleScroll, true);
        },
        handleScroll(e) {
            let container = document.querySelector('.content-container');
            let scrollTop = container.scrollTop;
            this.isShowFixed = scrollTop > 20;
            this.handleSectionNameScroll();
        },
        handleSectionNameScroll() {
            let container = document.querySelector('.content-container');
            let scrollTop = container.scrollTop;
            let targetIndex = this.courseSectionsTop.findIndex(item => {
                if (scrollTop > item.top) {
                    this.fixedSectionName = item.text;
                    return true;
                }
                return false;
            });
            this.scrollSectionName(targetIndex, scrollTop);
        },
        scrollSectionName(targetIndex, standardHeight) {
            let sectionFixDOM = document.querySelector('.section-name-fixed');
            if (!sectionFixDOM) return;
            if (targetIndex > 0 && sectionFixDOM) {
                let nextSectionNameTop = this.courseSectionsTop[targetIndex - 1].top;
                let criticalHeight = standardHeight + 60;
                if (nextSectionNameTop < criticalHeight) {
                    sectionFixDOM.style.top = 60 - (criticalHeight - nextSectionNameTop) + 'px';
                }
                else {
                    sectionFixDOM.style.top = '60px';
                }
            }
            else if (targetIndex === 0) {
                sectionFixDOM.style.top = '60px';
            }
        },
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll, true);
    }
};
</script>

<style lang="less">
    .calc{
        height: calc(~"100% - 60px");
    }
</style>
<style scoped lang="less">
    @import '../../common/css/animation.less';
    @media screen and (min-width: 750px) {
        .detail-part-content-title {
            height: 60PX;
            line-height: 60PX;
            background:rgba(64,70,77,1);
            font-size:18PX;
            font-weight:500;
            color:rgba(255,255,255,1);
            padding-left: 20PX;
            position: relative;
            z-index: 10;
            .week-progress {
                position: absolute;
                top: 13PX;
                right: 20PX;
                line-height: 30PX;
                font-size: 0;
            }
            .progress-label {
                font-size: 12PX;
                color: #989B9E;
                padding-right: 6PX;
            }
            .progress-num {
                font-size: 16PX;
            }
            .progress-point {
                font-size: 12PX;
            }
        }
        .study-percent-tip {
            display: none;
        }
        .detail-part-content-pc {
            display: block;
            .content-container {
                overflow: auto;
                padding: 10PX 10PX 0;
                position: relative;
                height: 100%;
                box-sizing: border-box;
            }
            .section-name-fixed {
                width: 360PX;
                height: 60PX;
                position: fixed;
                top: 60PX;
                right: 10PX;
                background: #2b3035;
                box-sizing: border-box;
                line-height: 60PX;
                padding: 0 10PX;
                font-size: 14PX;
                font-weight: 400;
                color: #fff;
                z-index: 1;
                border-radius: 4PX;
                font-family: PingFangSC-Regular;
                transition: right 0.3s;
            }
            .right-hide {
                right: -380PX;
            }
            .content-fold {
                position: absolute;
                left: -24PX;
                top: 50%;
                transform: translate(0, -50%);
                width:24PX;
                height:100PX;
                background-color:rgba(50,55,62, 0.7);
                border-radius:8px 0PX 0PX 8px;
                z-index: 1;
            }
            .content-fold-img {
                background: url("../../assets/train-course/day-arrow@2x.png") no-repeat;
                width: 18PX;
                height: 18PX;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) rotate(90deg);
                background-size: contain;
                transition: all 0.3s ease 0s;
            }
            .content-fold-img-rotate {
                transform: translate(-50%, -50%) rotate(270deg);
            }
            .content-label {
                position: relative;
                height: 60PX;
                line-height: 60PX;
                font-size:14PX;
                font-weight:400;
                color:rgba(255,255,255,1);
                padding: 0 10PX;
                background:rgba(43,48,53,1);
                border-radius:4px;
                margin-top: 10PX;
            }
            .content-label-title {
                width: 310PX;
                height: 60PX;
            }
            .arrow-icon {
                width: 18PX;
                height: 18PX;
                position: absolute;
                top: 21PX;
                right: 10PX;
                transition: all 0.3s ease;
                transform: rotate(180deg);
            }
            .arrow-icon-fold {
                transform: rotate(0);
            }
            .section-item {
                position: relative;
            }
            .section-dec {
                max-width: 270PX;
                display: inline-block;
                vertical-align: bottom;
                word-break:break-all;
            }
            .section-status-icon {
                font-size: 12PX;
                position: absolute;
                right: 0;
                top: 1PX;
                color: rgba(152,155,158,1);
            }
            .content-sections {
                transition: all 1s ease;
            }
            .content-sections-fold {
                height: 0;
                overflow: hidden;
            }
            .content-section {
                padding: 15PX 10PX;
                color: #FFFFFF;
                font-size: 14PX;
                min-height: 40PX;
                border-bottom: 1px solid rgba(39,44,48,1);
                font-family: none;
                opacity: 0.7;
                &:hover {
                    background: #2b3035;
                    cursor: pointer;
                }
                &:last-of-type {
                    border-bottom: none;
                    margin-bottom: 25PX;
                }
            }
            .section-type-icon {
                font-size: 16PX;
                vertical-align: middle;
                margin: 4PX 10PX 0 0;
            }
            .kw-icon-exam {
                font-size: 17PX;
            }
            .content-section-choose {
                color: #00B38a;
                .section-status-icon {
                    color: #00B38a;
                }
                .lesson-icon-media {
                    width: 18PX;
                    height: 18PX;
                    animation: pcPlayerAnimate 2s step-start infinite;
                    background: url('../../assets/course/player-icon.png') no-repeat;
                    background-size: cover;
                    background-position: 0 0;
                    right: -6px;
                    &::before {
                        content: '';
                    }
                }
                .pause-play {
                    width: 18PX;
                    height: 18PX;
                    background: url('../../assets/course/player-icon.png') no-repeat;
                    background-size: cover;
                    background-position: 0 0;
                }
            }
            .section-duration {
                font-size: 12PX;
                margin-top: 4PX;
                padding-left: 26PX;
                color: rgba(255, 255, 255, 70%);
            }
            .not-learn {
                width: 30PX;
                display: inline-block;
                text-align: center;
                height: 16PX;
                background: rgba(255, 255, 255, 0.096);
                border-radius: 2PX;
                font-size: 12PX;
                color: rgba(255,255,255,1);
                line-height: 16PX;
            }
            .need-update {
                color: rgba(152,155,158,1);
            }
        }
        .multiple-lines {
            position: relative;
            max-height: 44PX;
            overflow: hidden;
        }
        .multiple-lines:after {
            content: "...";
            font-weight: 400;
            position: absolute;
            bottom: 0;
        }
    }

    @media screen and (max-width: 750px) {
        .detail-part-content-title {
            display: none;
        }
        .study-percent-tip {
            display: block;
            height: 80px;
            .week-progress {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                padding-left: 80px;
                line-height: 80px;
                font-size: 0;
                height: 80px;
                box-shadow:0px 2px 10px 0px rgba(0,0,0,0.05);
            }
            .video-book {
                width: 28px;
                height: 28px;
                position: absolute;
                top: 26px;
                left: 40px;
            }
            .progress-label {
                font-size: 24px;
                color: #333333;
            }
        }
        .detail-part-content {
            display: block;
            overflow: auto;
            padding: 30px 40px 30px;
            box-sizing: border-box;
            position: absolute;
            top: 80px;
            left: 0;
            right: 0;
            bottom: 0;
            height: auto;
            .content-label {
                height: 85px;
                line-height: 85px;
                font-size: 32px;
                font-weight: 500;
                color: #333;
            }
            .arrow-icon {
                display: none;
            }
            .content-section {
                color: #666;
                &:last-of-type {
                    margin-bottom: 40px;
                }
            }
            .content-section-choose {
                color: #E5A817;
                .lesson-icon-media {
                    width: 60px;
                    height: 60px;
                    animation: playAnimate 2s step-start infinite;
                    background: url('../../assets/train-course/playing-icon.png') no-repeat;
                    background-size: cover;
                    top: 10px;
                    right: -6px;
                    &::before {
                        content: '';
                    }
                }
            }
            .section-item {
                padding-top: 20px;
                line-height: 40px;
                font-size: 28px;
                font-weight: 400;
                position: relative;
            }
            .section-item-wait {
                color: #CCCCCC;
            }
            .section-dec {
                max-width: 600px;
                vertical-align: bottom;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .section-status-icon {
                font-size:20px;
                position: absolute;
                right: 0;
                top: 18px;
                color: #E8E9EB;
            }
            .section-duration {
                font-size:20px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                margin-top: 12px;
                color: #999999;
            }
            .not-learn {
                font-family:PingFangSC-Medium,PingFang SC;
                font-weight:500;
                color: #6BA0FA;
                background:rgba(107,160,250, 0.08);
                border-radius: 2px;
                display: inline-block;
                padding: 2px 8px;
                margin-right: 12px;
            }
        }
    }
</style>
