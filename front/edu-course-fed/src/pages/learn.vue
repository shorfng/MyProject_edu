<template>
    <div class="learn-wrap">
        <div
            class="learn-container"
            :style="'min-height:' + clientHeight"
        >
            <div
                class="container-top"
                :style="'background:' + backGroundrgb"
            >
                <img
                    class="course-top-bg"
                    src="../assets/public-class/video_bg@2x.png"
                    alt=""
                >
                <div class="course-info">
                    <img
                        class="cover-img"
                        :src="baseInfo.coverImage"
                        alt=""
                    >
                    <div class="desc">
                        <div class="course-name multi-lines-2">
                            {{ baseInfo.courseName }}
                        </div>
                        <div class="tag">
                            <span class="single-line">{{ baseInfo.teacherName }}</span>
                            <span class="field">
                                {{ baseInfo.previewFirstField }} {{ baseInfo.previewSecondField }}
                            </span>
                        </div>
                    </div>
                    <div
                        v-if="isShowDistribution"
                        class="distribution"
                        @click="goDistribution"
                    >
                        赚￥{{ distributionInfo.brokerage }}
                    </div>
                    <div class="last-learn">
                        <div>
                            <div class="learn-info">
                                <div class="learn-info-one">
                                    {{ baseInfo.learnChapters || 0 }}
                                </div>
                                <div class="learn-info-two">
                                    已学章节(讲)
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="learn-info">
                                <div class="learn-info-one">
                                    {{ learnTime }}
                                </div>
                                <div class="learn-info-two">
                                    学习时长
                                </div>
                            </div>
                        </div>
                        <div v-if="baseInfo.showCourseCredit && isApp">
                            <div
                                class="learn-info"
                                @click="toGrowth"
                            >
                                <img
                                    v-if="baseInfo.creditReceiveFlag"
                                    class="credit-red-dot"
                                    src="../assets/course/profile_modal_ic_jingshi@2x.png"
                                    alt=""
                                >
                                <div class="learn-info-one">
                                    {{ baseInfo.courseCredit > 999 ? '999+' : (baseInfo.courseCredit || 0) }}
                                </div>
                                <div class="learn-info-two">
                                    学分
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-show="isFixedTab"
                class="tab-blank"
            />
            <div
                v-if="!!baseInfo.interactUrl"
                :class="{'tab-info': true, 'tab-fixed': isFixedTab}"
                @click="clickTab($event)"
            >
                <div
                    data-type="course"
                    :class="{
                        'tab-item': true,
                        'tab-item-active': isShowCourse
                    }"
                >
                    课程
                </div>
                <div
                    data-type="interactive"
                    :class="{
                        'tab-item': true,
                        'tab-item-active': isShowInteract
                    }"
                >
                    <div
                        data-type="interactive"
                        class="tab-item-interact"
                    >
                        互动
                        <span
                            v-if="isShowRedPoint"
                            data-type="interactive"
                            :class="{
                                'red-dot': true,
                                'red-num-dot': !!baseInfo.interactUpdateNum
                            }"
                        >
                            {{ baseInfo.interactUpdateNum || '' }}
                        </span>
                    </div>
                </div>
            </div>
            <div v-show="isShowCourse">
                <div
                    v-if="!isAccompanyCourse && !isEmploymentCourse"
                    class="learn-continue flex a-center"
                >
                    <img
                        src="../assets/public-class/history_record@2x.png"
                        alt=""
                    >
                    <div class="lesson-name single-line">
                        {{ baseInfo.lastLearnLessonName || '还未开始学习该课程~' }}
                    </div>
                    <button @click="goLearn">
                        {{ baseInfo.lastLearnLessonId ? '继续学习' : '立即学习' }}
                    </button>
                </div>
                <ClassMenu
                    :is-show-play-icon="false"
                    @chooseCourseLessonsByUser="chooseCourseLessonsByUser"
                />
            </div>
            <div v-show="isShowInteract">
                <Interacts
                    :is-view="isShowInteract"
                    @toast="toast"
                    @showModal="showModal"
                />
            </div>
            <H5MiniPlayer
                :show="isShowMiniBar"
                container-d-o-m-cls="learn-container"
            />
        </div>
        <Toast
            :show="isShowToast"
            :msg="toastStr"
            @onHide="hideToast"
        />
        <InteractModal
            :is-show-modal="isShowModal"
            :modal-data="modalData"
            @close="closeModal"
        />
        <Confirm
            :show="isShowConfirm"
            :msg="confirmMsg"
            @close="closeConfirm"
        />
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { fetchCourseBaseInfo, fetchDistributionInfo, fetchReportInteracts } from '../service';
import ClassMenu from '../components/contents/ClassMenu';
import Interacts from '../components/contents/Interacts';
import InteractModal from '../components/contents/InteractModal';
import H5MiniPlayer from '../components/common/h5MiniPlayer';
import Confirm from '@components/Confirm/Index.vue';
import { getParam } from '@js/util/getParam';

export default {
    components: {
        ClassMenu,
        H5MiniPlayer,
        Interacts,
        InteractModal,
        Confirm
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            let isFromInteractSection = vm.judgeIsFromInteract();
            console.log('beforeRouteEnter+++++++++', from, isFromInteractSection);
            let isFromH5Detail = from.name === 'H5Detail' && from.query.from === 'learn';
            if (isFromH5Detail || isFromInteractSection) {
                vm.tabActive = 'interactive';
            }
        });
    },
    data() {
        return {
            baseInfo: {},
            isShowDistribution: false,
            distributionInfo: {},
            tabActive: 'course',
            tabOffsetTop: 0,
            isFixedTab: false,
            swiperOption: {
                assetsList: []
            },
            slideHeight: 'auto',
            page_id: '1pz4',
            // isPreventSlideChangeEndCallback: false,
            isShowModal: false,
            modalData: {},
            selfTop: 0,
            isShowConfirm: false,
            confirmMsg: '',
            btnText: '前往微信',
            swiperTouchStartIndex: null,
            swiperTouchStartTranslate: null,
            firstSlideHeight: null,
            clientHeight: window.screen.height + 'px',
            isFirstReported: false,
        };
    },
    computed: {
        ...mapGetters([
            'isVideoCourse',
            'courseSections',
            'isShowMiniBar',
            'isAccompanyCourse',
            'isEmploymentCourse',
            'courseInfo'
        ]),
        isShowCourse() {
            return this.tabActive === 'course';
        },
        isShowInteract() {
            return this.tabActive === 'interactive';
        },
        learnTime() {
            let time = '';
            let { learnTime = 0 } = this.baseInfo;
            let h = parseInt(learnTime / 60);
            if (h) {
                time += h + 'h';
            }
            time += learnTime % 60 + 'm';
            return time;
        },
        backGroundrgb() {
            let rgb = this.baseInfo.backGroundrgb;
            if (!rgb) return;
            let r = parseInt(rgb[0], 16);
            let g = parseInt(rgb[1], 16);
            let b = parseInt(rgb[2], 16);
            return `rgb(${r}, ${g}, ${b})`;
        },
        isLearned() {
            return !!this.baseInfo.lastLearnLessonId;
        },
        isShowRedPoint() {
            let { showRedDot, interactUpdateNum } = this.baseInfo;
            return showRedDot || interactUpdateNum;
        }
    },
    created() {
        let { p = '' } =  getParam();
        this.eduPlatTrack('WebView', {
            page_id: this.page_id,
            page_from: p ? '分销扫码' : ''
        });
        fetchCourseBaseInfo().then(res => {
            if (res.state === 1) {
                this.baseInfo = res.content;
                let { interactUrl } = res.content;
                if (interactUrl) {
                    this.$nextTick(() => {
                        this.bindScroll();
                    });
                }
            }
        });
        fetchDistributionInfo().then(res => {
            if (res.state === 1) {
                let { showDistributionButton, distributionBaseInfoVo } = res.content;
                this.isShowDistribution = showDistributionButton;
                if (distributionBaseInfoVo) {
                    this.distributionInfo = distributionBaseInfoVo;
                }
            }
        });
    },
    mounted() {},
    destroyed() {
        document.removeEventListener('scroll', this.containerScroll, true);
    },
    methods: {
        closeConfirm() {
            this.isShowConfirm = false;
        },
        fixedBody() {
            this.selfTop = document.body.scrollTop || document.documentElement.scrollTop;
            document.body.style.cssText += 'position:fixed;overflow: hidden;height: auto;top: -' + this.selfTop + 'px';
        },
        looseBody() {
            let body = document.body;
            body.style.overflow = 'auto';
            body.style.height = 'auto';
            body.style.position = '';
            document.body.scrollTop = document.documentElement.scrollTop = parseInt(this.selfTop);
        },
        showModal(data, isConfirm) {
            if (isConfirm) {
                this.isShowConfirm = true;
                this.confirmMsg = data.confirmText;
                return;
            }
            this.modalData = data;
            this.fixedBody();
            this.isShowModal = true;
        },
        closeModal() {
            this.looseBody();
            this.isShowModal = false;
        },
        toast(str) {
            this.showToast(str);
        },
        bindScroll() {
            let tab = document.querySelector('.tab-info');
            if (!tab) return;
            this.tabOffsetTop = tab.getBoundingClientRect().top;
            document.addEventListener('scroll', this.containerScroll, true);
        },
        containerScroll() {
            let container = document.querySelector('.learn-container');
            if (!container) return;
            let scrollHeight = Math.abs(container.getBoundingClientRect().top);
            this.isFixedTab = scrollHeight > this.tabOffsetTop;
        },
        clickTab(e) {
            let { type } = e.target.dataset;
            this.tabActive = type;
            this.reportInteract(type);
            this.reportSwitchInteract(type);
            let container = document.querySelector('.learn-wrap');
            if (container && this.isFixedTab) {
                container.scrollTop = this.tabOffsetTop;
            }
        },
        reportInteract(type) {
            if (type === 'interactive' && this.isShowRedPoint) {
                fetchReportInteracts().then(res => {
                    if (res.state === 1) {
                        Object.assign(this.baseInfo, {
                            showRedDot: false,
                            interactUpdateNum: false
                        });
                    }
                });
            }
        },
        reportSwitchInteract(type) {
            if (type !== 'interactive' || this.isFirstReported) return;
            this.isFirstReported = true;
            let { id, courseName } = this.courseInfo;
            this.eduPlatTrack('ViewInteractivePage', {
                courses_id: [String(id)],
                courses_name: [courseName]
            });
        },
        chooseCourseLessonsByUser(lesson) {
            let { id } = lesson;
            let name = '';
            let query = {};
            if (this.isVideoCourse) {
                name = 'videoDetail';
                query = { lessonId: id };
            }
            else {
                name = this.isPc ? 'pcDetail' : 'H5Detail';
                query = { id };
            }
            this.$router.push({
                name,
                query
            });
        },
        goDistribution() {
            window.location.href = this.distributionInfo.url;
        },
        goLearn() {
            let firstLessonId = this.courseSections[0].courseLessons[0].id;
            let lessonId = this.baseInfo.lastLearnLessonId || firstLessonId;
            let name = this.isVideoCourse ? 'videoDetail' : 'H5Detail';
            let key = this.isVideoCourse ? 'lessonId' : 'id';
            this.$router.push({
                name,
                query: {
                    [key]: lessonId
                }
            });
        },
        toGrowth() {
            this.eduPlatTrack('EnterCreditSystem', {
                    'page_id': '1pz4',
                    'courses_id': [String(this.courseInfo.id)],
                    'courses_name': [this.baseInfo.courseName],
            });
            if (!this.isApp) return;
            let url = 'https://kaiwu.lagou.com/user_growth/credit.htm?type=course&courseId=' + this.courseInfo.id;
            let proto = this.isEduApp ? `lgedu://lgedu.com/h5/open` : `lagou://lagou.com/h5/open`;
            window.location.href = `${proto}?hideTitle=1&url=${encodeURIComponent(url)}`;
        },
        judgeIsFromInteract() {
            if (!sessionStorage) return false;
            let isFromInteract = false;
            try {
                let interactInfo = sessionStorage.getItem('interactCourseId');
                if (interactInfo && JSON.parse(interactInfo).id === this.courseInfo.id) {
                    sessionStorage.removeItem('interactCourseId');
                    isFromInteract = true;
                }
            } catch (e) {
                console.log(e);
            }
            return isFromInteract;
        }
    }
};
</script>
<style lang="less" scoped>
.learn-wrap {
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
}
.swiper-container {
    height: auto;
}
.container-top {
    position: relative;
    margin-bottom: 91px;
    .course-top-bg {
        width: 100%;
        height: 365px;
    }
    .course-info {
        padding: 74px 40px 60px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .cover-img {
        width: 120px;
        height: 160px;
        box-shadow: 0px 8px 40px 0px rgba(0,0,0,0.14);
        border-radius: 8px;
        float: left;
    }
    .desc {
        float: left;
        color: #ffffff;
        margin-left: 30px;
    }
    .distribution {
        position: absolute;
        top: 80px;
        right: -1px;
        background:linear-gradient(90deg,rgba(248,217,152,1) 0%,rgba(239,197,142,1) 100%);
        box-shadow:0px 2px 4px 0px rgba(0,0,0,0.06);
        border-radius: 12px 0px 0px 12px;
        font-size:22px;
        line-height: 22px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        padding: 10px 8px 10px 22px;
        color: #785541;
    }
    .course-name {
        font-size:36px;
        font-weight: 500;
        font-family:PingFangSC-Medium,PingFang SC;
        max-width: 400px;
    }
    .tag {
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        margin-top: 14px;
        font-size: 0;
        span {
            font-size:24px;
            display: inline-block;
            position: relative;
            vertical-align: middle;
            &:first-of-type {
                margin-right: 20px;
                max-width: 300px;
            }
            &:last-of-type::before {
                position: absolute;
                content: '';
                width: 1px;
                height: 20px;
                background: rgba(255, 255, 255, 0.5);
                transform: scaleX(0.5);
                top: 10px;
                left: -10px;
            }
        }
    }
    .last-learn {
        position: absolute;
        bottom: -70px;
        left: 50%;
        transform: translateX(-50%);
        width: 690px;
        height:150px;
        background:rgba(255,255,255,1);
        box-shadow:0px 8px 32px 0px rgba(0,0,0,0.04);
        border-radius: 10px;
        display: flex;
        &>div {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .learn-info {
            position: relative;
            text-align: center;
            .learn-info-one {
                font-size:36px;
                font-family:PingFangSC-Medium,PingFang SC;
                font-weight:500;
                color: #333333;
            }
            .learn-info-two {
                color: #999999;
                font-size:24px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
            }
            .credit-red-dot {
                width: 90px;
                height: 46px;
                position: absolute;
                top: -44px;
                right: -40px;
            }
        }
    }
}
.tab-blank {
    height: 90px;
}
.tab-info {
    height: 90px;
    display: flex;
    font-size: 32px;
    font-family: PingFangSC-Medium,PingFang SC;
    font-weight: 500;
    background: white;
    .tab-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        color: #666666;
    }
    .tab-item-interact {
        position: relative;
    }
    .red-dot {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        top: 14px;
        left: 80px;
        background:rgba(255,91,66,1);
    }
    .red-num-dot {
        height: 33px;
        min-width: 20px;
        line-height: 33px;
        border-radius: 10px;
        font-size:24px;
        font-weight: 500;
        color: #FFFFFF;
        padding: 0 6px;
        text-align: center;
        width: fit-content;
        top: 6px;
    }
    .tab-item-active {
        color: #333333;
        &:after {
            content: '';
            position: absolute;
            bottom: 1px;
            width:64px;
            height: 4px;
            background:rgba(251,197,70,1);
            border-radius: 1px;
            left: 50%;
            margin-left: -32px;
        }
    }
}
.tab-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
}
.swiper-wrap {
    padding: 10px 0 0;
}
.slide-scroll {
     overflow-y: scroll;
}
.learn-continue {
    margin: 20px 30px 0;
    height:90px;
    background:rgba(248,249,250,1);
    border-radius: 6px;
    padding: 0 30px;
    img {
        width: 28px;
        height: 28px;
    }
    .lesson-name {
        font-size:24px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color: #666;
        flex-grow: 1;
        width: 0;
        margin: 0 20px 0 12px;
    }
    button {
        width:140px;
        background:rgba(251,197,70,1);
        border-radius:12px;
        font-size:24px;
        line-height: 24px;
        padding: 10px 0;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        text-align: center;
        outline: none;
        border: none;
    }
}
</style>

