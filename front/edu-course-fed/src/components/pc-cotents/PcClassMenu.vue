<template>
    <div
        class="class-menu-contaniner"
        :class="{
            'list-page-container': isListPage,
            'more-sections': isMoreSectionsCourse,
            'more-sections-detail': isMoreSectionsCourse && !isListPage,
            'more-sections-padding': isListPage && isMoreSectionsCourse && !hasPurchaseClass && !hasFooter
        }"
    >
        <div
            v-if="!isListPage && !isMoreSectionsCourse"
            class="class-menu-title"
        >
            <div class="active-block" />
            课程目录
        </div>
        <div
            v-for="course in courseSections"
            :key="course.id"
        >
            <div
                v-if="isMoreSectionsCourse && course.status"
                class="section-name single-line"
                :class="isListPage ? '': 'section-name-detail'"
            >
                {{ course.sectionName }}
            </div>
            <div class="class-menu-block" v-if="course.status">
                <div
                    v-for="lesson in course.courseLessons"
                    :key="lesson.id"
                    v-if="lesson.status"
                    class="class-level-one over-ellipsis "
                    :class="setLessonStyle(lesson)"
                    @click="selectLesson(lesson)"
                >
                    <div class="text-wrap">
                        <div class="content">
                            {{ lesson.theme }}
                        </div>
                        <div
                            v-if="!isAccompanyCourse && !isEmploymentCourse"
                            class="item-status-wrap"
                            :class="isListPage ? 'item-status-wrap-list' : ''"
                        >
                            <div
                                v-if="hasPurchaseClass &&
                                    (lesson.id === coursePlayRecord.lessonId) &&
                                    isShowLastLearnLesson &&
                                    isListPage"
                                class="item-status learn"
                            >
                                上次学习
                            </div>
                            <div
                                v-else-if="lesson.type === 'free'"
                                class="item-status test-watch"
                            >
                                试看
                            </div>
                            <div
                                v-else-if="lesson.type === 'wait'"
                                class="item-status wait"
                            >
                                待更新
                            </div>
                            <div
                                v-else-if="lesson.type === 'lock'"
                                class="item-status lock"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getParam } from '../../common/js/util/getParam';
export default {
    components: {},
    props: {
        isListPage: {
            type: Boolean,
            default: false
        },
        isChangeTab: {
            type: Boolean,
            default: false
        },
        isAutoScroll: {
            type: Boolean,
            default: false
        },
        hasFooter: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            autoScrollDomName: ''
        };
    },
    computed: {
        ...mapGetters([
            'hasPurchaseClass',
            'currentCourseLessons',
            'courseSections',
            'playerStatus',
            'isShowLastLearnLesson',
            'isEmploymentCourse',
            'isAccompanyCourse',
            'courseInfo',
            'isMoreSectionsCourse',
            'coursePlayRecord',
            'isLoadingHistory',
            'isGotCourseSections',
            'isVideoCourse',
            'userInfo',
            'isLogin'
        ])
    },
    watch: {
        isLoadingHistory(val, oldVal) {
            if (!val && oldVal) {
                this.autoScrollLastLearn('.learn');
            }
        },
        isGotCourseSections: {
            handler(val, oldVal) {
                console.log(val, oldVal);
                if (val && !oldVal) {
                    this.autoScrollLastLearn(this.autoScrollDomName);
                }
            },
            immediate: true
        }
    },
    mounted() {
        let path = this.$route.path;
        let isCourseContentPage = path === '/content';
        let isAutoScroll = false;
        if (isCourseContentPage) {
            isAutoScroll = this.isShowLastLearnLesson && !this.isChangeTab;
            isAutoScroll && this.getCoursePlayHistory();
        }
        else {
            this.isAutoScroll && this.autoScrollLastLearn('.isclick');
        }
    },
    methods: {
        ...mapActions([
            'setCurrentCourseLessons',
            'setIsShowLastLearnLesson',
            'getCoursePlayHistory'
        ]),
        autoScrollLastLearn(domName) {
            if (!this.isGotCourseSections || !domName) {
                this.autoScrollDomName = domName;
                return;
            }
            this.$nextTick(() => {
                // DOM 没有渲染出来
                setTimeout(() => {
                    let selectDOM = document.querySelector(domName);
                    if (!selectDOM) return;
                    let { top, height } = selectDOM.getBoundingClientRect();
                    let isLastDOMInView = document.documentElement.clientHeight < top + height;
                    isLastDOMInView && selectDOM.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 700);
            });
        },
        setLessonStyle(item) {
            let detailCls = this.isListPage ? '' : ' class-level-one-detail';
            if (this.isAccompanyCourse || this.isEmploymentCourse) {
                return `ispartner ${detailCls}`;
            }
            let cls = item.type === 'wait' ? 'iswait' : '';
            if (item.type === 'free') {
                cls += ' isfree';
            }
            if (Number(this.playerStatus.id) === Number(item.id)) {
                cls += ' playing';
            }
            if (Number(this.currentCourseLessons.id) === Number(item.id) && !this.isListPage) {
                cls += ' isclick';
            }
            return cls + ' ' + detailCls;
        },
        selectLesson(lesson) {
            if (this.isAccompanyCourse || this.isEmploymentCourse) return;
            let { id } = this.courseInfo;
            let { type, canPlay } = lesson;
            if (type === 'wait') return;
            if (this.isListPage) {
                if (!this.hasPurchaseClass && type !== 'free' && !this.isLogin) {
                    window.open('/frontLogin.do', '_self');
                    return;
                }
                let lessonType = '已购买';
                if (type === 'free') {
                    lessonType = '试看';
                } else if (type === 'lock') {
                    lessonType = '未解锁';
                }
                this.setCurrentCourseLessons(lesson);
            } else {
                if (lesson.id === this.currentCourseLessons.id) {
                    return;
                }
            }

            if (this.isVideoCourse && canPlay) {
                this.$router.push({ name: 'videoDetail', query: { courseId: id,lessonId: lesson.id } });
            } else if (!this.isVideoCourse) {
                this.$router.push({ name: 'pcDetail', query: { id: lesson.id } });
            }
        }
    }
};
</script>

<style lang="less" scoped>
div{
  box-sizing: border-box;
}
.class-menu-block{
    font-family: PingFangSC-Regular;
    font-size: 16PX;
    font-weight: 400;
}
.section-name {
    font-size: 18PX;
    color: #333333;
    font-weight: bold;
    padding: 30PX 0 20PX;
    max-width: 540PX;
    font-family: PingFangSC-Regular;
}
.section-name-detail {
    font-size: 16PX;
    padding: 39PX 0 39PX 30PX;
    position: relative;
    background: #f1f1f1;
    &::after {
        display: block;
        content: '';
        position: absolute;
        width: 3PX;
        height: 14PX;
        background: #00B38A;
        top: 46PX;
        left: 0;
    }
}
.class-menu-contaniner {
    &.list-page-container{
        padding: 20PX 15PX;
        background: #FFFFFF;
        .class-level-one{
            border-right: none;
            font-size: 16PX;
            color: #333333;
            padding-left: 15PX;
            min-height: 62PX;
            cursor: pointer;
            &:hover{
                background: #F8F8F8;
            }
            .text-wrap{
                border-top:none;
                padding-top: 20PX;
                padding-bottom: 20PX;
                .content{
                    width: 600PX;
                    word-break: break-all;
                    white-space: normal;
                }
            }
            .item-status-wrap{
                top:22PX;
            }
            &.ispartner{
                cursor: default;
                &:hover{
                    background: #FFFFFF;
                }
            }
            &.isclick{
                font-size: 16PX;
                color: #333333;
            }
            &.playing{
                font-size: 16PX;
                color: #333333;
            }
            &.iswait{
                &:hover{
                    .text-wrap{
                        border-top: none;
                    }
                    &.class-level-one + .class-level-one{
                        .text-wrap{
                            border-top: none;
                        }
                    }
                }
            }
        }
        .level-one-accompany {
            cursor: pointer;
            &:hover{
                background: #F8F8F8;
            }
        }
    }
    &.more-sections {
        padding: 0 20PX 50PX 30PX;
        .class-menu-block {
            background: #FBFBFB;
            font-size: 14px;
            color: #333333;
        }
        .class-level-one{
            padding-left: 20PX;
            font-size: 14PX;
            min-height: auto;
            .text-wrap {
                padding: 15PX 30PX 15PX 0;
            }
            .item-status-wrap{
                top: 30PX;
            }
            .item-status-wrap-list {
                top: 15PX;
            }
        }
        .class-level-one-detail {
            padding-left: 30PX;
            .text-wrap {
                padding: 30PX 30PX 30PX 0;
            }
        }
    }
    &.more-sections-detail {
        padding: 0;
        .class-menu-block {
            background: #F8F8F8;
        }
    }
    &.more-sections-padding {
        padding-bottom: 228px;
    }
    background: #F6F6F6;
    .over-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .bold-font {
        font-weight: bold;
    }
    .class-menu-title {
        font-size: 16PX;
        color: #333333;
        font-weight: 700;
        padding-top: 30PX;
        padding-bottom: 31PX;
        border-right: 1PX solid #ededed;
        padding-left: 30PX;
        line-height: 22PX;
        position: relative;
        .active-block{
          position: absolute;
          width: 3PX;
          height: 14PX;
          background: #00B38A;
          left: 0;
          top: 34PX;
        }
    }
    .class-level-one {
        font-size: 14PX;
        color: #666666;
        position: relative;
        width: 100%;
        min-height: 90PX;
        padding-left:30PX;
        border-right: 1PX solid #ededed;
        cursor: pointer;
        &:hover{
            background: #FFFFFF;
            .text-wrap{
                border-top:none;
            }
            &.class-level-one + .class-level-one{
                    .text-wrap{
                        border-top: none;
                    }
            }
        }
        &.iswait{
            &:hover{
                background: none;
                .text-wrap{
                    border-top: 1PX solid #E1E1E1;
                }
                &.class-level-one + .class-level-one{
                        .text-wrap{
                            border-top: 1PX solid #E1E1E1;
                        }
                }
            }
        }
        &:first-child{
            .text-wrap{
                border-top:none;
            }
        }
        &.ispartner{
            cursor: default;
        }
        &.iswait {
            color: #B4B4B4;
            cursor: default;
        }
        &.isclick{
            background: #FFFFFF;
            color: #00B38A;
            border-right: none;
            .text-wrap{
                border-top: none;
            }
            &.class-level-one + .class-level-one{
                    .text-wrap{
                        border-top: none;
                    }
            }
        }
        &.playing{
        }
        &.has-level-two {
            margin-bottom: 30PX;
            padding-right: 30PX;
        }
        .text-wrap{
          padding:34PX 30PX 34PX 0;
          border-top: 1PX solid #E1E1E1;
          position: relative;
          .content{
            width:260PX;
            word-break: break-all;
            white-space: normal;
          }
        }
        .item-status-wrap{
          position: absolute;
          top: 35PX;
          right: 30PX;
        }
        .item-status{
            &.lock{
                width: 20PX;
                height: 20PX;
                background: url('../../assets/pc-detail/lock.png') no-repeat;
                background-size: 100% 100%;
                margin-right: 14PX;
            }
            &.test-watch{
                width: 46PX;
                height: 20PX;
                border: 1px solid rgba(0,179,138,0.5);
                border-radius: 2PX;
                font-size: 12PX;
                text-align: center;
                display:table-cell;
                vertical-align:middle;
                color: #00B38A;
            }
            &.wait{
                width: 46PX;
                height: 20PX;
                border: 1PX solid #CCCCCC;
                font-size: 12PX;
                color: #B4B4B4;
                border-radius: 2PX;
                text-align: center;
            }
            &.learn{
                font-size: 12PX;
                color: #00B38A;
            }
        }

    }
    .level-one-accompany {
        cursor: pointer;
    }
    .class-level-two-container {
        padding: 10PX 0 10PX 70PX;
        background: #f8f9fa;
        margin-bottom: 30PX;
    }
    .class-level-two {
        font-size: 30PX;
        color: #666666;
        letter-spacing: 0;
        text-align: justify;
        line-height: 30PX;
        width: 100%;
        padding: 23PX 0PX;
        cursor: pointer;
        &.iswait {
            color: #cccccc;
            cursor: default;
        }
    }
    .expansion-icon {
        content: "";
        width: 17PX;
        height: 1em;
        display: inline-block;
        background-size: 17PX 17PX;
        background-repeat: no-repeat;
        background-position: center center;
        position: absolute;
        top: 9PX;
        right: 30PX;
        &.arrow-down {
            background-image: url("../../assets/public-class/arrow-down@3x.png");
            top: 12PX;
        }
        &.arrow-right {
            background-image: url("../../assets/public-class/arrow-right@3x.png");
        }
    }
}
</style>
