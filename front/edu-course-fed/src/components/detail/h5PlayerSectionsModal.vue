<template>
    <div
        v-show="show"
        class="section-modal"
        @click="closeModal"
    >
        <div class="content">
            <div
                v-show="isSectionNameFixed"
                class="section-name-fixed"
            >
                <div class="single-line">
                    {{ sectionName }}
                </div>
            </div>
            <div class="sections">
                <div
                    v-show="isFromSalePage"
                    class="label"
                >
                    <span class="content-label">课程目录</span>
                    <span>/共{{ lessonCount }}节</span>
                </div>
                <ClassMenu
                    :is-from-sale-page="isFromSalePage"
                    @chooseCourseLessonsByUser="chooseCourseLessonsByUser"
                />
            </div>
            <button
                class="close-btn scale-1px"
                @click.stop="closeModal"
            >
                取消
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ClassMenu from '../contents/ClassMenu';
export default {
    name: 'H5PlayerSectionsModal',
    components: {
        ClassMenu
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        isFromSalePage: {
            type: Boolean,
            default: false
        },
        lessonCount: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            sectionsDOM: null,
            sectionNameData: [],
            isSectionNameFixed: false,
            sectionName: '',
            fixedDOMHeight: 0,
            fixedDOM: null,
            fixedDOMTop: 8
        };
    },
    computed: {
        ...mapGetters([
            'playerStatus',
            'hasPurchaseClass',
            'isMoreSectionsCourse'
        ]),
        isShowSaleStatus() {
            return function (lesson) {
                return this.isFromSalePage && lesson.type === 'free';
            };
        },
    },
    watch: {
        show(val, oldVal) {
            if (val && this.isMoreSectionsCourse) {
                // DOM 渲染出来之后绑定事件
                this.$nextTick(() => {
                    this.sectionsDOM = document.querySelector('.sections');
                    let sectionNameDOM =  document.querySelectorAll('.section-name');
                    if (!this.sectionsDOM || !sectionNameDOM) return;
                    this.fixedDOMHeight = document.querySelector('.section-name').offsetHeight;
                    if (!this.sectionNameData.length) {
                        for (let i = 0, l = sectionNameDOM.length; i < l; i++) {
                            this.sectionNameData.unshift({
                                top: sectionNameDOM[i].offsetTop,
                                text: sectionNameDOM[i].innerHTML.trim()
                            });
                        }
                    }
                    // this.sectionsDOM.addEventListener('scroll', this.sectionsScroll, true);
                    let learningDOM = document.querySelector('.is-playing');
                    if (!learningDOM) return;
                    let container = document.querySelector('.sections');
                    let top = learningDOM.offsetTop;
                    let clientHeight = document.body.clientHeight;
                    container.scrollTop = top - clientHeight / 2;
                });
            }
        }
    },
    methods: {
        ...mapActions([
            'setLessonPlayer',
            'setCurrentCourseLessons'
        ]),
        chooseCourseLessonsByUser(lesson) {
            let lessonType = '';
            let { type } = lesson;
            if (type === 'wait') {
                lessonType = '待更新';
            }
            else if (type === 'lock') {
                lessonType = '未解锁';
            }
            if (!lessonType) {
                if (this.isFromSalePage) {
                    this.setCurrentCourseLessons(lesson);
                    let key =  this.isPc ? 'pc' : 'h5';
                    this.$router.push({
                        path: `/detail/${key}?id=${lesson.id}`,
                    });
                    return;
                }
                (lesson.id !== this.playerStatus.id) && this.setLessonPlayer({
                    id: lesson.id,
                    isPlaying: true
                });
            }
        },
        closeModal() {
            this.$emit('closeSectionsModal');
        },
        sectionsScroll() {
            let targetIndex = this.sectionNameData.findIndex((item, index) => {
                if (this.sectionsDOM.scrollTop > item.top) {
                    targetIndex = index;
                    this.sectionName = item.text;
                    return true;
                }
                return false;
            });
            this.isSectionNameFixed = targetIndex >= 0;
            let fixedDOM = document.querySelector('.section-name-fixed');
            if (typeof targetIndex !== 'number' || !fixedDOM) return;
            if (targetIndex > 0) {
                let touchDistance = this.sectionNameData[targetIndex - 1].top - this.sectionsDOM.scrollTop - this.fixedDOMHeight;
                if (touchDistance < 0) {
                    console.log(this.fixedDOMTop, touchDistance);
                    fixedDOM.style.transform = 'translateY(' + this.fixedDOMTop + touchDistance + 'px)';
                }
                else {
                    fixedDOM.style.top = this.fixedDOMTop + 'px';
                }
            }
            else {
                fixedDOM.style.top = this.fixedDOMTop + 'px';
            }
        }
    }
};
</script>

<style scoped lang="less">
    @import '../../common/css/animation.less';
    .section-modal {
        background: rgba(0, 0, 0, 0.50);
        font-family: PingFangSC-Regular;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: left;
        z-index: 5;
    }
    .content {
        -webkit-border-radius: 8px 8px 0 0;
        -moz-border-radius: 8px 8px 0 0;
        border-radius: 14px 14px 0 0;
        background: #ffffff;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 19%;
        overflow: hidden;
    }
    .sections {
        position: absolute;
        top: 8PX;
        bottom: 100px;
        left: 0;
        right: 0;
        overflow-y: auto;
    }
    .section-name, .section-name-fixed {
        font-size: 32px;
        color: #333333;
        font-weight: bold;
        padding: 38px 0 38px 40px;
        position: relative;
    }
    .section-name-fixed {
        background: #00ff00;
        z-index: 99;
        top: 8PX;
        position: absolute;
        left: 0;
        right: 0;
        div {
            max-width: 600px;
        }
    }
    .size {
        margin-top: 10px;
        font-size: 22px;
        color: #999999;
    }
    .close-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100px;
        line-height: 100px;
        font-size: 32px;
        color: #666666;
        text-align: center;
        width: 100%;
        background: white;
        &:after {
            border: none;
            border-top: 1px solid #E8E9EB;
        }
    }
    .label {
        padding: 30px 0 0 40px;
        font-size: 20px;
        color: #999999;
    }
    .content-label {
        font-weight: bolder;
        font-size: 32px;
        color: #333333;
        margin-right: 8px;
    }
.lagouEduTheme{
    .vux-tab-bar-inner{
        background: #FBC546;
    }
    .tab-free{
        background: rgba(251,197,70,0.12);
        color: #E5A817;
        border: none;
    }
    .section-name, .section-name-fixed {
        &::after {
            background: #fbc546;
        }
    }
}
</style>
