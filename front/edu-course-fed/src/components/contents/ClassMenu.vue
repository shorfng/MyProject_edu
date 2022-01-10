<template>
    <div :class="{'class-menu-container': true, 'lg-app': isLgApp ,'is-pc':needUsePcClass}">
        <div
            v-show="isSectionNameFixed"
            class="section-name-fixed"
        >
            <div class="section-name-single single-line">
                {{ fixedSectionName }}
            </div>
        </div>
        <div
            v-for="(course, courseIndex) in handleSections"
            :key="courseIndex"
            class="section-item"
        >
            <div
                v-if="isMoreSectionsCourse && course.sectionName"
                class="section-name single-line"
            >
                {{ course.sectionName }}
            </div>
            <div
                class="course-item"
                :class="isMoreSectionsCourse ? 'course-item-bg' : ''"
            >
                <div
                    v-for="(lesson, lessonIndex) in course.courseLessons"
                    :key="lessonIndex"
                    :class="{
                        [setClassName(lesson)]: true,
                        'lesson-name single-line': true,
                        'is-playing': isLessonPlaying(lesson),
                        'is-first-lesson': isFirstLesson(lessonIndex)}"
                    @click.stop="chooseCourseLessonsByUser(lesson)"
                >
                    <span
                        :class="{
                            'theme single-line': true,
                            'theme-line': !setClassName(lesson) && !isLessonPlaying(lesson)
                        }"
                    >
                        {{ lesson.theme }}
                    </span>
                    <!-- 只在视频课以及专栏课展示 -->
                    <template v-if="isVideoAudioCourse || isVideoCourse">
                        <div v-if="lesson.type !== 'wait' && hasPurchaseClass && !needUsePcClass">
                            <span
                                v-if="!lesson.hasLearned && lesson.canPlay"
                                class="not-learn"
                            >未学</span>
                            <span
                                v-if="lesson.audioMediaDTO"
                                class="video-duration"
                            >时长 {{ lesson.audioMediaDTO.duration }}</span>
                        </div>
                        <template v-if="isShowSaleStatus(lesson)">
                            <span
                                v-show="isShowPauseIcon(lesson) && isShowPlayIcon"
                                class="lesson-pause"
                                @click.stop="setAudioPlayer(lesson)"
                            />
                            <span
                                v-show="isLessonPlaying(lesson)"
                                :class="{'lesson-playing': true, 'lesson-player-pause': !playerStatus.isPlaying}"
                                @click.stop="goLessonDetail(lesson)"
                            />
                        </template>
                    </template>
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
import { OSName } from '../../common/js/userAgent/browser-name-and-OS.js';

export default {
    components: {},
    props: {
        isChangeTab: {
            type: Boolean,
            default: false
        },
        isShowPlayIcon: {
            type: Boolean,
            default: true
        },
        isFromSalePage: {
            type: Boolean,
            default: false
        },
        needUsePcClass: {
            type: Boolean,
            default: false
        },
        isNeedToFixed: {
            type: Boolean,
            default: false
        },
        scrollContainerDOM: {
            type: String,
            default: 'body'
        },
        maxSectionCount: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            isFetchHistory: false,
            isFetchSection: false,
            courseSectionsTop: [],
            isSectionNameFixed: false,
            fixedSectionTop: null,
            fixedSectionName: ''
        };
    },
    computed: {
        ...mapGetters([
            'hasPurchaseClass',
            'playerStatus',
            'courseInfo',
            'isAccompanyCourse',
            'isVideoCourse',
            'courseSections',
            'isEmploymentCourse',
            'isShowLastLearnLesson',
            'isLoadingHistory',
            'isMoreSectionsCourse',
            'isNativeAudioPlay',
            'isGotCourseSections',
            'isVideoAudioCourse',
        ]),
        isShowSaleStatus() {
            return function (lesson) {
                let { id } = this.playerStatus;
                let { type } = lesson;
                let isFree = type === 'free';
                let isLast = type === 'last';
                let isShowStatus = isFree || isLast || (id === lesson.id);
                return isShowStatus && !this.isVideoCourse;
            };
        },
        isLessonPlaying() {
            return function (lesson) {
                let { id } = this.playerStatus;
                return id === lesson.id;
            };
        },
        isFirstLesson() {
            return function(index) {
                return !this.isMoreSectionsCourse && index === 0;
            };
        },
        isShowPauseIcon() {
            return function (lesson) {
                let { isPlaying, id } = this.playerStatus;
                return id !== lesson.id;
            };
        },
        handleSections() {
            let courseSections = this.courseSections;
            console.log('handleSections++++', courseSections);
            if (!this.maxSectionCount || !this.isMoreSectionsCourse) return courseSections;
            // 处理多级目录 只取八条数据展示
            let max = this.maxSectionCount;
            let init = 0;
            let course = [];
            courseSections.findIndex(sections => {
                let lessonIndex = sections.courseLessons.findIndex(lesson => {
                    init++;
                    return init >= max;
                });
                if (lessonIndex === -1) {
                    course.push(sections);
                    return false;
                }
                else {
                    let copySections = Object.assign({}, sections);
                    copySections.courseLessons = copySections.courseLessons.slice(0, lessonIndex + 1);
                    course.push(copySections);
                    return true;
                }
            });
            return course;
        },
        setClassName() {
            return function(lesson) {
                if (this.isAccompanyCourse) return;
                let { type } = lesson;
                if (type === 'last') {
                    return 'is-status is-last';
                }
                else if (type === 'wait') {
                    return 'is-status is-wait';
                }
                else if (type === 'lock') {
                    return 'is-status kw-icon-lock';
                }
                else if (type === 'free') {
                    return 'is-status is-free';
                }
            };
        }
    },
    watch: {
        isLoadingHistory(val, oldVal) {
            if (!val && oldVal) {
                this.isFetchHistory = true;
                this.loadedData();
            }
        },
        isGotCourseSections: {
            handler(val, oldVal) {
                if (val && !oldVal) {
                    this.isFetchSection = true;
                    this.loadedData();
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.getCoursePlayHistory();
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll, true);
    },
    methods: {
        ...mapActions([
            'getCoursePlayHistory',
            'setLessonPlayer',
            'setMiniBarStatus',
            'setSlideMiniBarShow',
            'setCurrentCourseLessons'
        ]),
        goLessonDetail(lesson) {
            if (this.$route.name === 'H5Detail') return;
            this.linkToNewPage(lesson);
        },
        setAudioPlayer(lesson) {
            this.setLessonPlayer({
                id: lesson.id,
                isPlaying: true
            });
            this.linkToNewPage(lesson);

            let { id: courses_id, courseName: courses_name } = this.courseInfo;
            let { id: class_id = '', theme: reclass_name = '' } = lesson;
            this.eduPlatTrack('TryListenCourse',
                {
                    page_id: window.enterNewPage ? '1pvk' : '1pqd',
                    on_module: '课程列表',
                    courses_id: [courses_id.toString()],
                    reclass_name,
                    reclass_id: class_id.toString(),
                    courses_name: [courses_name]
                }
            );
        },
        linkToNewPage(lesson) {
            let key =  this.isPc ? 'pc' : 'h5';
            if (this.isPc) {
                this.setCurrentCourseLessons(lesson);
            }
            this.$router.push({
                path: `#/detail/${key}?id=${lesson.id}`,
            });
        },
        loadedData() {
            if (!this.isFetchSection || !this.isFetchHistory) return;
            this.isFetchHistory = false;
            this.$nextTick(() => {
                // DOM 没有渲染出来
                setTimeout(() => {
                    if (this.isNeedToFixed && this.isMoreSectionsCourse) {
                        this.getSectionsOffsetTop();
                        window.addEventListener('scroll', this.handleScroll, true);
                    }
                    // this.autoScrollLastLearn();
                });
            }, 600);
        },
        handleScroll(e) {
            if (!this.scrollContainerDOM) return;
            let dom = this.scrollContainerDOM;
            let courseContainer = document.querySelector(dom);
            let top = Math.abs(courseContainer.getBoundingClientRect().top);
            let targetIndex = this.courseSectionsTop.findIndex(item => {
                if (top > item.top) {
                    this.fixedSectionName = item.text;
                    return true;
                }
                return false;
            });
            this.scrollSectionName(targetIndex, top);
        },
        scrollSectionName(targetIndex, scrollTop) {
            let fixDOM = document.querySelector('.section-name-fixed');
            if (!fixDOM) return;
            console.log(this.fixedSectionTop, targetIndex);
            if (!this.fixedSectionTop) {
                this.fixedSectionTop = fixDOM.getBoundingClientRect().top;
            }
            this.isSectionNameFixed = targetIndex !== -1;
            if (targetIndex > 0) {
                let nextSectionNameTop = this.courseSectionsTop[targetIndex - 1].top;
                let criticalHeight = scrollTop + this.sectionNameHeight;
                if (nextSectionNameTop < criticalHeight) {
                    fixDOM.style.top = this.fixedSectionTop - (criticalHeight - nextSectionNameTop) + 'px';
                }
                else {
                    fixDOM.style.top = this.fixedSectionTop + 'px';
                }
            }
            else if (targetIndex === 0) {
                fixDOM.style.top = this.fixedSectionTop + 'px';
            }
        },
        getSectionsOffsetTop() {
            this.courseSectionsTop = [];
            let courseSections = document.querySelectorAll('.section-name');
            if (!courseSections) return;
            let { height } = courseSections[0].getBoundingClientRect();
            if (!courseSections) return;
            this.sectionNameHeight = height;
            let PcContainerPaddingTop = 90;
            courseSections.forEach(item => {
                let top = item.offsetTop;
                this.courseSectionsTop.unshift({
                    top,
                    text: item.textContent.trim()
                });
            });
            console.log(this.courseSectionsTop);
        },
        autoScrollLastLearn() {
            if (this.isChangeTab) return;
            let selectDOM = document.getElementsByClassName('is-last')[0];
            if (!selectDOM) return;
            let { top, height } = selectDOM.getBoundingClientRect();
            let isLastDOMInView = document.body.clientHeight < top + height;
            let offsetTop = selectDOM.offsetTop;
            if (isLastDOMInView) {
                selectDOM.scrollIntoView({
                    behavior: 'instant',
                    block: 'center'
                });
                if (['Android'].indexOf(OSName) >= 0) return;
                let scrollTop = offsetTop - document.body.clientHeight / 2;
                document.body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
            }
        },
        chooseCourseLessonsByUser(lesson) {
            if (this.isAccompanyCourse || this.isEmploymentCourse) return;
            if (lesson.type === 'wait') {
                this.showToast('内容还未更新，请等等哦');
                return;
            }
            if (lesson.type === 'lock') {
                this.showToast('购买后可以解锁全部内容');
                return;
            }
            this.$emit('chooseCourseLessonsByUser', lesson);
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../common/css/animation.less';
.section-name-fixed {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    padding: 44px 40px 38px;
    font-weight: bold;
    background: #ffffff;
    z-index: 1;
    font-family: PingFangSC-Regular;
    .section-name-single {
        max-width: 600px;
        font-size: 32px;
    }
}
.lesson-pause {
    background: url("../../assets/public-class/icon-free@2x.png") no-repeat;
    background-size: cover;
    position: absolute;
    width: 40px;
    height: 40px;
    right: 0;
    top: -1px;
}
.lesson-playing {
    position: absolute;
    width: 60px;
    height: 60px;
    animation: playAnimate 2s step-start infinite;
    background: url('../../assets/train-course/playing-icon.png') no-repeat;
    background-size: cover;
    top: -10px;
    right: -10px;
}
.lesson-player-pause {
    animation-play-state: paused;
}
.class-menu-container {
    font-family: PingFangSC-Regular;
    padding: 0 40px;
    .section-name {
        max-width: 600px;
        font-weight: bold;
        font-size: 32px;
        padding: 48px 0 38px;
    }
    .lesson-name {
        font-size: 28px;
        line-height: 40px;
        position: relative;
        cursor: pointer;
        color: #333333;
        margin-bottom: 40px;
    }
    .is-first-lesson {
        margin-top: 40px;
    }
    .section-item .lesson-name:last-of-type {
        margin-bottom: 22px;
    }
    .section-item:last-of-type .lesson-name:last-of-type {
        margin-bottom: 40px;
    }
    .theme {
        display: inline-block;
        max-width: 580px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal;
    }
    .theme-line {
        max-width: max-content;
    }
    .kw-icon-lock::before, .is-status::after {
        position: absolute;
        right: 0;
        width: 96px;
        text-align: center;
        top: 0;
    }
    .is-free .theme::before, .is-last .theme::before, .not-learn {
        padding: 6px 8px;
        font-weight: bold;
        display: inline-block;
        line-height: 20px;
        transform: translateY(-2px);
        color: #6BA0FA;
        background:rgba(107,160,250,0.08);
        font-size: 20px;
        border-radius: 2px;
    }
    .is-free .theme::before {
        content: "试看";
    }
    // .is-last .theme::before {
    //     content: "上次学习";
    // }
    .video-duration {
        color: #999999;
        font-size:20px;
    }
    .is-wait {
        color: #999;
        cursor: default;
        &::after {
            content: "待更新";
            opacity: 0.8;
            border-radius: 22px;
            padding: 11px 0 10px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            font-size: 20px;
            line-height: 20px;
            color: #CCCCCC;
            font-weight: 600;
            width: auto;
            top: -4px;
        }
    }
    .kw-icon-lock::before {
        width: auto;
        right: 0;
        top: 1px;
        color: #E8E9EB;
        font-size: 40px;
    }
    .is-playing {
        color: #E5A817;
    }
}
.lg-app {
    // .lesson-pause {
    //     background: url("../../../assets/public-class/icon-free-lg@2x.png") no-repeat;
    //     background-size: 100%;
    // }
    // .is-playing {
    //     color: #00B38A;
    // }
    .is-free .theme::before {
         background:rgba(0,179,138, 0.08);
        color: #00B38A;
    }
    .is-last .theme:before {
        background:rgba(0,179,138, 0.08);
        color: #00B38A;
    }
}
.class-menu-container.is-pc{
    padding: 0;
    .section-name{
        padding: 40PX 0 31PX 0;
        font-size:18PX;
        font-weight:700;
        color:rgba(51,51,51,1);
        max-width: 900PX;
    }
    .lesson-name{
        font-size:16PX;
        color:rgba(102,102,102,1);
        margin-bottom: 32PX;
        &.is-free{
            margin-bottom: 27PX;
        }
        &:last-of-type {
            margin-bottom: 0;
        }
        &.kw-icon-lock{
            &::before{
                font-size: 20PX;
                color: #cccccc;
            }
        }
    }
    .section-item:last-of-type .lesson-name:last-of-type {
        margin-bottom: 0;
    }
    .theme{
        max-width: 900PX;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
    }
    .is-free .theme::before, .is-last .theme::before {
        content: "试看";
        padding: 2PX 8PX;
        font-weight: bold;
        display: inline-block;
        line-height: 20PX;
        transform: translateY(0);
        font-size:14PX;
        border-radius: 2PX;
        background: #E9FBF2;
        color: #00B38A;
    }
    .is-wait {
        color: #999;
        cursor: default;
        &::after {
            font-size: 14PX;
            font-weight: 400;
        }
    }
    .is-playing{
        color: #00b38a;
    }
    .lesson-pause{
        width: 20PX;
        height: 20PX;
        background: url('~@assets/course/sale/play.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 2PX;
    }
    .lesson-playing{
        background: url('../../assets/course/sale/play-status.png') no-repeat;
        background-size: cover;
        width: 18PX;
        height: 18PX;
        animation: pcPlayerAnimate 2s step-start infinite;
        top: 3px;
        right: 2px;
    }
    .lesson-player-pause {
        animation-play-state: paused;
    }
}
</style>
