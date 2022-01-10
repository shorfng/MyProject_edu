<template>
    <div class="pub-header">
        <div class="pub-header-container-wrap">
            <div
                class="item-wrap inline-block catalog"
                @click="clickItem('catalogue')"
            >
                <div class="img-wrap inline-block" />
                <div class="text-wrap inline-block">
                    {{ isShowMenu ? '收起目录' : '展开目录' }}
                </div>
            </div>
            <div class="splice-line inline-block" />
            <div
                class="item-wrap inline-block pre"
                :class="{'disable-button':!getClassInfo.preLesson.isHasPrevious}"
                @click="clickItem('pre')"
            >
                <div class="img-wrap inline-block" />
                <div class="text-wrap inline-block">
                    上一讲
                </div>
            </div>
            <div class="splice-line inline-block" />
            <div
                class="item-wrap inline-block next"
                :class="{'disable-button':!getClassInfo.nextLesson.isHasNext}"
                @click="clickItem('next')"
            >
                <div class="img-wrap inline-block" />
                <div class="text-wrap inline-block">
                    下一讲
                </div>
            </div>
            <div class="splice-line inline-block" />
            <div
                class="item-wrap inline-block detail"
                @click="clickItem('detail')"
            >
                <div class="img-wrap inline-block" />
                <div class="text-wrap inline-block">
                    课程详情
                </div>
            </div>
            <div class="splice-line inline-block" />
            <div
                class="item-wrap inline-block all"
                @click="clickItem('all')"
            >
                <div class="img-wrap inline-block" />
                <div class="text-wrap inline-block">
                    全部课程
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
    },
    data() {
        return {
            isShowMenu: true, //菜单展示状态
        };
    },
    computed: {
        ...mapGetters([
            'hasPurchaseClass',
            'currentCourseLessons',
            'courseSections',
            'courseInfo',
            'isGotCourseSections'
        ]),
        getClassInfo() {
            if (this.isGotCourseSections) {
                let currentLesson = this.currentCourseLessons;
                let sectionIndex = 0;
                let lessonIndex = 0;
                this.courseSections.forEach((section, sectionIdx) => {
                    section.courseLessons.forEach((lesson, lessonIdx) => {
                        if (lesson.id === currentLesson.id) {
                            sectionIndex = sectionIdx;
                            lessonIndex = lessonIdx;
                        }
                    });
                });
                let preLesson = this.getPreviousLesson(sectionIndex, lessonIndex);
                let nextLesson = this.getNextLesson(sectionIndex, lessonIndex);
                return {
                    preLesson,
                    nextLesson
                };
            } else {
                return {
                    preLesson: {},
                    nextLesson: {}
                };
            }
        }
    },
    mounted() {
    },
    methods: {
        clickItem(type) {
            let addressId = '';
            switch (type) {
                case 'catalogue':
                    if (this.isShowMenu) {
                        addressId = '1ndc';
                    } else {
                        addressId = '1ndb';
                    }
                    this.switchMenu();
                    break;
                case 'pre':
                    addressId = '1ndd';
                    this.clickPre();
                    break;
                case 'next':
                    addressId = '1nde';
                    this.clickNext();
                    break;
                case 'detail':
                    addressId = '1ndf';
                    this.clickDetail();
                    break;
                case 'all':
                    addressId = '1ndg';
                    this.clickAll();
                    break;
                default:
                    break;
            }
        },
        switchMenu() {
            this.isShowMenu = !this.isShowMenu;
            this.$emit('switchMenu', this.isShowMenu);
        },
        clickPre() {
            let { isHasPrevious, previousLesson } = this.getClassInfo.preLesson;
            if (isHasPrevious) {
                this.$router.push({ name: 'pcDetail', query: { id: previousLesson.id } });
            }
        },
        clickNext() {
            let { isHasNext, nextLesson } = this.getClassInfo.nextLesson;
            if (isHasNext) {
                this.$router.push({ name: 'pcDetail', query: { id: nextLesson.id } });
            }
        },
        clickDetail() {
            this.$router.push({ name: 'courseContent', query: { courseId: this.courseInfo.id, isShowSections: true } });
        },
        clickAll() {
            window.location.href = 'https://kaiwu.lagou.com/';
        },
        getPreviousLesson(sectionIndex, lessonIndex) {
            let courseSections = this.courseSections;
            if (!sectionIndex && !lessonIndex) {
                return {
                    isHasPrevious: false
                };
            }
            else if (!lessonIndex) {
                let lessonsItem = courseSections[sectionIndex - 1].courseLessons;
                return {
                    isHasPrevious: true,
                    previousLesson: lessonsItem[lessonsItem.length - 1]
                };
            }
            else {
                let lessonsItem = courseSections[sectionIndex].courseLessons;
                return {
                    isHasPrevious: true,
                    previousLesson: lessonsItem[lessonIndex - 1]
                };
            }
        },
        getNextLesson(sectionIndex, lessonIndex) {
            let courseSections = this.courseSections;
            let lastLessonIndex = courseSections[sectionIndex].courseLessons.length - 1;
            let courseSectionsLen = courseSections.length;
            let isLastLesson = sectionIndex === courseSectionsLen - 1 && lessonIndex === lastLessonIndex;
            if (isLastLesson) {
                return { isHasNext: false };
            }
            let nextLesson = {};
            // 有下一个章节
            if (sectionIndex < courseSectionsLen - 1) {
                // 是否是最后一节课时
                if (lessonIndex === lastLessonIndex) {
                    nextLesson = courseSections[sectionIndex + 1].courseLessons[0];
                }
                else {
                    nextLesson = courseSections[sectionIndex].courseLessons[lessonIndex + 1];
                }
            }
            else {
                nextLesson = courseSections[sectionIndex].courseLessons[lessonIndex + 1];
            }
            let type = nextLesson.type;
            let isDisabledNext = type === 'wait' || type === 'lock';
            if (isDisabledNext) {
                return { isHasNext: false };
            }
            else {
                return {
                    isHasNext: true,
                    nextLesson
                };
            }
        }
    }
};
</script>

<style lang="less" scoped>
  div{
      box-sizing: border-box;
  }
  .inline-block{
    display: inline-block;
    vertical-align: top;
  }
  .pub-header{
    position: fixed;
    z-index: 9;
    top: 40PX;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    min-width: 1000PX;
    height: 50PX;
    padding: 0 20PX;
    background-color: #fff;
    border-bottom: 1PX solid #D5DADF;
    transition: .3s;
    text-align: center;
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
  .pub-header-container-wrap{
    margin: 0 auto;
    width: 836PX;
    padding-top: 7PX;
    font-size: 0;
    .item-wrap{
        width: 130PX;
        height: 36PX;
        color: #666666;
        border-radius: 4PX;
        cursor: pointer;
        line-height: 14PX;
        text-align: center;
        padding-top: 10PX;
        &.disable-button{
            color: #cccccc;
            cursor: default;
            &:hover{
                color: #cccccc;
                background: #ffffff;
            }
            &.pre{
                .img-wrap{
                    background-image: url("../../assets/pc-detail/pre-lesson-unable.png");
                }
                &:hover{
                    .img-wrap{
                       background-image: url("../../assets/pc-detail/pre-lesson-unable.png");
                    }
                }
            }
            &.next{
                .img-wrap{
                    background-image: url("../../assets/pc-detail/next-lesson-unable.png");
                }
                &:hover{
                    .img-wrap{
                        background-image: url("../../assets/pc-detail/next-lesson-unable.png");
                    }
                }
            }
        }
        &:hover{
            color: #00b38a;
            background: #F8F8F8;
        }
        .img-wrap{
          width: 16PX;
          height: 16PX;
          margin-right: 12PX;
          background-size: 100%;
          background-repeat: no-repeat;
        }
        .text-wrap{
            font-family: PingFangSC-Regular;
            font-size: 14PX;
            margin-top: 1PX;
        }
      }
      .splice-line{
        width: 1PX;
        height: 16PX;
        background: #ededed;
        margin-top: 10PX;
        margin-left: 22PX;
        margin-right: 22PX;
      }
      .catalog{
          .img-wrap{
              background-image: url("../../assets/pc-detail/list-lesson-nor.png");
          }
          &:hover{
              .img-wrap{
                    background-image: url("../../assets/pc-detail/list-lesson.png");
              }
          }
      }
      .pre{
          .img-wrap{
              background-image: url("../../assets/pc-detail/per-lesson-nor.png");
          }
          &:hover{
              .img-wrap{
                    background-image: url("../../assets/pc-detail/per-lesson.png");
              }
          }
      }
      .next{
          .img-wrap{
              background-image: url("../../assets/pc-detail/next-lesson-nor.png");
          }
          &:hover{
              .img-wrap{
                    background-image: url("../../assets/pc-detail/next-lesson.png");
              }
          }
      }
      .detail{
          .img-wrap{
              background-image: url("../../assets/pc-detail/detail-lesson-nor.png");
          }
          &:hover{
              .img-wrap{
                    background-image: url("../../assets/pc-detail/detail-lesson.png");
              }
          }
      }
      .all{
          .img-wrap{
              background-image: url("../../assets/pc-detail/all-lesson-nor.png");
          }
          &:hover{
              .img-wrap{
                    background-image: url("../../assets/pc-detail/all-lesson.png");
              }
          }
      }
  }
</style>
