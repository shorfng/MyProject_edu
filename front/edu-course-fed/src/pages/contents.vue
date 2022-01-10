<template>
    <div
        v-cloak
        v-if="(!isPC && isCanShowPurchase) || isPC"
        class="content-container"
    >

        <div
            v-if="isPc"
            ref="permanent"
        />
        <PcHeader  v-if="isPc"></PcHeader>
        <TopLoginBanner />
        <navigation
            v-if="isPc"
            :course-name="courseInfo.courseName"
        />
        <div class="container">
            <div style="height: 100%">
                <view-box
                    v-cloak
                    class="content-wrapper"
                >
                    <div
                        v-if="!isPc"
                        ref="permanent"
                    />
                    <div style="position:relative;">
                        <PcIntroduction v-if="isPC" />
                        <H5Introduction
                            v-else
                            :show-distribution-button="showDistributionButton"
                            :distribution-info="distributionInfo"
                        />
                        <div
                            v-if="showDistributionButton && !lagouEduTheme"
                            :class="isPc ? 'distribution-entry-pc' : 'distribution-entry-h5'"
                            @click="openDistributionModal"
                        >
                            <img
                                src="~@assets/pc-detail/icon-money.png"
                                class="distribution-entry-icon"
                                alt="icon"
                            >
                            <span>赚￥{{ distributionInfo.brokerage }}</span>
                            <img
                                src="~@assets/public-class/sale-arrow.png"
                                class="right-arrow"
                                alt="arrow"
                            >
                        </div>
                    </div>
                    <div
                        class="public-class-container"
                        :class="{'has-footer':!hasPurchaseClass && hasFooterCls,
                                 'tab-fixed':isTabFixed,
                                 'is-pc':isPc}"
                    >
                        <div
                            ref="tabWrap"
                            :class="{'tab-fix-wrap':currentEnvironment==='PC',
                                     'h5-tab-fix-wrap':currentEnvironment!=='PC'
                            }"
                        >
                            <tab
                                class="choose-tab"
                                custom-bar-width="0.4rem"
                                :line-width="2"
                            >
                                <tab-item
                                    :selected="classSelect==='info'"
                                    @on-item-click="changeCourseTab('info')"
                                >
                                    课程信息
                                </tab-item>
                                <tab-item
                                    :selected="classSelect==='menu'"
                                    @on-item-click="changeCourseTab('menu')"
                                >
                                    <span class="tab-menu">
                                        课程目录
                                        <div
                                            v-if="showFreeLabel && !isPC && isCanShowPurchase"
                                            class="tab-free"
                                        ><span class="tab-free-txt">试看</span></div>
                                        <div
                                            v-if="showFreeLabel&&currentEnvironment=='PC'&&courseInfo.courseType !== 3"
                                            class="test-lesson"
                                        >试看</div>
                                    </span>
                                </tab-item>
                            </tab>
                        </div>
                        <div
                            v-if="isTabFixed"
                            :class="isPC ? 'tab-blank-PC' : 'tab-blank'"
                        />
                        <div
                            v-if="isSectionNameFixed && classSelect === 'menu'"
                            class="section-name-fixed"
                            :class="sectionNameFixedCls"
                        >
                            <div class="section-name-single">
                                {{ fixedSectionName }}
                            </div>
                        </div>
                        <div>
                            <CourseIntroduction
                                v-if="classSelect==='info'"
                                :class="isPC ? 'pc-background' : ''"
                                :course-description="courseInfo.courseDescription"
                                :is-des-has-teacher-info="isDesHasTeacherInfo"
                                :is-show-teacher-data="courseInfo.courseType !== 3"
                            />
                            <div
                                v-if="classSelect==='menu'&&currentEnvironment!=='PC'"
                                class="pc-background"
                            >
                                <ClassMenu
                                    :is-change-tab="!!changeTabLabel"
                                    @chooseCourseLessonsByUser="chooseCourseLessonsByUser"
                                />
                            </div>

                            <PcClassMenu
                                v-if="classSelect==='menu'&&currentEnvironment==='PC'"
                                :is-list-page="true"
                                :is-change-tab="!!changeTabLabel"
                                :has-footer="!hasPurchaseClass && hasFooterCls"
                            />
                        </div>
                        <template v-if="!isPC && classSelect==='info'">
                            <H5Message
                                :show-edit="false"
                                :is-mine="false"
                            />
                        </template>
                    </div>
                    <Toast
                        :show="isShowToast"
                        :msg="toastStr"
                        @onHide="hideToast"
                    />
                </view-box>
            </div>
            <template>
                <PublicClassFooter
                    v-if="isCanShowPurchase && !lagouEduTheme"
                    v-cloak
                    slot="bottom"
                    :is-charge="hasPurchaseClass"
                    :is-new-des="courseInfo.isNewDes"
                    :discounts="courseInfo.discounts"
                    :price="courseInfo.price"
                    :discounts-tag="videoCourseTag || courseInfo.discountsTag"
                    :price-tag="courseInfo.priceTag"
                    @gotoPurchaseClass="gotoPurchaseClass('footerButton')"
                />
                <H5Footer
                    v-if="isCanShowPurchase && lagouEduTheme"
                    v-cloak
                    slot="bottom"
                    :is-charge="hasPurchaseClass"
                    :is-new-des="isNewDes"
                    :discounts="discounts"
                    :price="price"
                    :discounts-tag="videoCourseTag || discountsTag"
                    :price-tag="priceTag"
                    @gotoPurchaseClass="gotoPurchaseClass('footerButton')"
                />
                <div
                    v-if="showVideoToast"
                    v-c="'show-more'"
                >
                    <div
                        class="show-more-wrap"
                    >
                        <div class="show-more-text">
                            扫描下方二维码<br>获取完整课程内容
                        </div>
                        <div class="show-more-qrcode" />
                        <div class="show-more-des">
                            微信扫码
                        </div>
                    </div>
                </div>
            </template>
            <Purchase
                ref="Purchase"
                :w-x-purchase-success="isWXPurchaseSuccess"
                :show-purchase-alert="isShowPurchaseAlert"
            />
            <div
                v-if="isPc"
                class="pc-mini-player-wrap"
                :class="{'has-purchase-class':!hasPurchaseClass,'show-mini-player':isSlideShowMiniBar}"
            >
                <PcMiniPlayer />
            </div>
            <H5MiniPlayer
                v-else
                :is-init-compute="isInitCompute"
                :show="isShowMiniBar"
                container-d-o-m-cls="container"
                @resetCompute="resetCompute"
            />
            <BackHome
                v-if="currentEnvironment !== 'PC' && currentEnvironment !== 'app'"
                :is-charge="hasPurchaseClass"
            />
            <H5ShareModal
                :show="isShowShareModal"
                @close="closeModal"
            />
            <PcDistributionDialog
                :visible="isPc && isShowPcDistributionModal"
                :share-url="distributionInfo.url"
                :money="distributionInfo.brokerage"
                @close="closeDistributionModal"
            />
            <PcMessage
                v-if="classSelect==='info' && isPC"
                :show-edit="isLogin"
                @setCourseFooterCls="setCourseFooterCls"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { Tab, TabItem, querystring, ViewBox } from 'vux';
import CourseIntroduction from '../components/contents/CourseIntroduction';
import H5Introduction from '../components/contents/H5Introduction';
import H5ShareModal from '../components/detail/h5ShareModal';
import PcMiniPlayer from '../components/pc-cotents/PcMiniPlayer';
import PcIntroduction from '../components/pc-cotents/PcIntroduction';
import PcClassMenu from '../components/pc-cotents/PcClassMenu';
import ClassMenu from '../components/contents/ClassMenu';
import BackHome from '../components/common/BackHome';
import TopLoginBanner from '../common/components/Login/TopLoginBanner';
import PublicClassFooter from '../components/contents/PublicClassFooter';
import H5Footer from '../components/contents/H5Footer';
import Navigation from '../components/contents/Navigation';
import Purchase from '../components/common/Purchase';
import H5MiniPlayer from '../components/common/h5MiniPlayer';
import { browserName, OSName, fullVersion } from '../common/js/userAgent/browser-name-and-OS.js';
import { getAppVersion, isBiggerThanSpecifiedVersion, isApp, isLgApp } from '../common/js/userAgent/getVersion';
import { fetchSaveHistory, fetchCourseDescription, fetchDistributionInfo, fetchCourseInfo } from '../service';
import PcDistributionDialog from '../components/pc-cotents/PcDistributionDialog';
import { getParam } from '../common/js/util/getParam';
import PcHeader from '../common/components/Header/index';

window.page_id = '1kkn';
window.click_props = {};
const urlParam = querystring.parse();
const sid = urlParam['sid'] || '';
let sidArr = [];
if (sid.indexOf('|') !== -1) {
    sidArr = sid.split('|');
}
else {
    sidArr = sid.split('-');
}
if (sidArr[2] !== undefined) {
    sidArr[2] = sidArr[2] == '0' ? new Date().getTime() : sidArr[2];
}
window.click_props = {
    isPurchased: 0,
    courseId: window.courseInfo.id,
    adKeyId: sidArr.join('|')
};

window.lgBridge && window.lgBridge.request('setTitleBarStyle', {
    'data': {
        'hr': {
            'color': 'rgba(255, 255, 255, 0)' // 设置标题栏底部分割线颜色为#efefef
        },
    }
});

export default {
    name: 'Index',
    components: {
        H5Message: () => import('../components/message/h5Message'),
        PcMessage: () => import('../components/message/PcMessage'),
        PcHeader,
        ViewBox,
        TopLoginBanner,
        Navigation,
        Tab,
        TabItem,
        CourseIntroduction,
        ClassMenu,
        PublicClassFooter,
        H5Footer,
        Purchase,
        PcIntroduction,
        PcClassMenu,
        PcMiniPlayer,
        H5Introduction,
        H5MiniPlayer,
        BackHome,
        H5ShareModal,
        PcDistributionDialog,
    },
    data() {
        let appVersion = null;
        let biggerThanVersion = false;
        if (['Android', 'iOS'].indexOf(OSName) !== -1 && isApp()) {
            appVersion = getAppVersion();
            biggerThanVersion = isBiggerThanSpecifiedVersion(appVersion);
        }
        // let {
        //     courseName = '',
        //     coursePlayHistoryDTO = {},
        //     courseDescription = '',
        //     isNewDes = '',
        //     discounts = '',
        //     price = '',
        //     discountsTag = '',
        //     priceTag = '',
        //     courseType = 0
        // } = window.courseInfo;
        return {
            courseName : '',
            courseDescription : '',
            isNewDes : '',
            discounts : '',
            price : '',
            discountsTag : '',
            priceTag : '',
            courseType : 0,
            lastPlayHistory: {},//coursePlayHistoryDTO
            appVersion,
            biggerThanVersion,
            isTabFixed: false,
            tabOffsetTop: 0,
            isWXPurchaseSuccess: false,
            isShowPurchaseAlert: false,
            isInitCompute: false,
            isShowShareModal: false,
            isShowPcDistributionModal: false,
            showDistributionButton: false,
            distributionInfo: {
                brief: '',
                brokerage: '',
                courseName: '',
                shareImage: '',
                url: ''
            },
            // tabOffsetTop: 0,
            pageHeight: 0,
            maxScrollSite: 0,
            currentScrollSite: 0,
            isNotLoginFix: false,
            topLoginBannerHeight: 0,
            tabOffsetHeight: 0,
            changeTabLabel: '',
            courseSectionsTop: [],
            fixedSectionName: '',
            isSectionNameFixed: false,
            sectionNameHeight: null,
            fixedSectionTop: null,
            isDesHasTeacherInfo: false,
            hasFooterCls: true,
            LgApp: isLgApp(),
            isSelectMenu: false,
            isFinishDistribution: false,
            showVideoToast: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (window.enterNewPage && !from.name) {
                vm.$router.replace({
                    path: '/sale'
                });
            }
        });
    },
    computed: {
        ...mapGetters([
            'hasPurchaseClass',
            'courseInfo',
            'currentCourseLessons',
            'courseSections',
            'isSlideShowMiniBar',
            'playerStatus',
            'isShowMiniBar',
            'isAccompanyCourse',
            'isSharedCourse',
            'isVideoCourse',
            'isMoreSectionsCourse',
            'userInfo',
            'isLogin'
        ]),
        videoCourseTag() {
            if (!this.hasPurchaseClass && this.courseInfo.courseType === 4) {
                return '申请试学';
            }
            return '';
        },
        showFreeLabel() {
            return !this.isAccompanyCourse && this.classSelect === 'info' && !this.hasPurchaseClass;
        },
        isCanShowPurchase() {
            // 只有是 boolean 值的时候，也就是数据回来的时候，再展示相关内容
            let isBoolean = typeof this.hasPurchaseClass === 'boolean';
            console.log('isCanShowPurchase isBoolean+++++++++', isBoolean);
            // 不是在 PC 且已购买 打开学习页
            if (!this.isPc && this.hasPurchaseClass) {
                // window.location.href = `https://kaiwu.lagou.com/#/content?courseId=${this.courseInfo.id}#/learn`;
                this.$router.replace({
                    path: '/learn'
                });
            }
            return isBoolean;
        },
        classSelect() {
            return this.getCourseTabSelect();
        },
        sectionNameFixedCls() {
            if (this.isPC) {
                return 'section-name-fixed-PC';
            }
            return '';
        },
        // isH5EnvAndNotLogin() {
        //     return (this.currentEnvironment === 'H5' || this.currentEnvironment === 'WX') && !this.isLogin;
        // },
        isPC() {
            return this.currentEnvironment === 'PC';
        },
        notTrackSa() {
            return window.enterNewPage || (!this.isPc && this.hasPurchaseClass);
        }
    },
    watch: {
        isSharedCourse(val) {
            if (val && this.isShowShareModal) {
                this.closeModal();
            }
        },
        classSelect: {
            handler(val) {
                if (val === 'menu' && this.isMoreSectionsCourse && !this.courseSectionsTop.length) {
                    this.isSelectMenu = true;
                    if (this.isFinishDistribution) {
                        this.$nextTick(() => {
                            this.getSectionNameTop();
                        });
                    }
                }
            },
            immediate: true
        },
        isFinishDistribution(val) {
            if (val && this.isSelectMenu) {
                this.$nextTick(() => {
                    this.getSectionNameTop();
                });
            }
        }
    },
    created() {
        this.getCourseInfo();
        this.getCourseSections({courseId: this.$route.query.courseId});

    },
    mounted() {
        this.saLogin();
        window.scrollTo(0, 0);
        this.checkIsPCShare();
        this.isPC && this.resizeThisPage();
        // this.getCourseDescription();
        // this.getDistributionInfo();
        let { p = '' } =  getParam();
        let { id, courseName } = this.courseInfo;
        // 不重定向才上报
        if (!this.notTrackSa) {
            this.eduPlatTrack('ViewCourseDetail', {
                page_id: '1pqd',
                page_from: p ? '分销扫码' : '',
                courses_id: [String(id)],
                courses_name: [courseName]
            });
        }
        let loginDOM = document.getElementsByClassName('login-banner')[0];
        if (loginDOM) {
            this.topLoginBannerHeight = loginDOM.getBoundingClientRect().height;
        }
       document.addEventListener('click', (e) => {
            let panelEle = document.getElementsByClassName('purchase-button')[0];
            if (panelEle && !panelEle.contains(e.target)) {
                this.showVideoToast = false;
            }
        });
        if (window.lgBridge) {
            window.lgBridge.request('synWebPlayStatus');
            window.lgBridge.request('LgJsNavigationBarIconInfo');
        }
    },
    destroyed() {
        this.unInstallClearCss();
    },
    methods: {
        ...mapActions([
            'setCurrentCourseLessons',
            'triggerPurchase',
            'isMoreSections',
            'setH5LoginModalStatus',
            'setLessonHistoryReq',
            'setBaseInfoCourse',
            'getCourseSections'
        ]),
        getCourseInfo() {
            fetchCourseInfo(this.$route.query.courseId).then(res => {
                let courseInfo = res.content || {};
                this.setBaseInfoCourse({ courseInfo, isVideoCourse: true });
                console.log('getCourseInfo', res);
            });
        },
        handleScroll(e) {
            if (this.isPC) {
                let container = document.querySelector('.content-container');
                let scrollTop = container.scrollTop;
                this.isTabFixed = scrollTop > this.tabOffsetTop + 50;
                this.getScrollSite();
                this.handleSectionNameScroll();
            }
            else {
                this.handleH5Scroll();
            }
        },
        getScrollSite() {
            let courseContainer = this.$refs.permanent;
            let top = courseContainer && Math.abs(courseContainer.getBoundingClientRect().top);
            this.currentScrollSite = top;
            if (this.currentScrollSite > this.maxScrollSite) {
                this.maxScrollSite = this.currentScrollSite;
            }
            return top;
        },
        handleH5Scroll() {
            this.isTabFixed = this.getScrollSite() - this.tabOffsetTop >= 0;
            this.handleSectionNameScroll();
        },
        handleSectionNameScroll() {
            if (!this.isMoreSectionsCourse || this.classSelect !== 'menu') {
                return;
            }
            let standardHeight = this.getScrollSite() + this.tabOffsetHeight;
            if (this.isPC) {
                standardHeight += 40;
            }
            let targetIndex = this.courseSectionsTop.findIndex(item => {
                if (standardHeight > item.top) {
                    this.fixedSectionName = item.text;
                    return true;
                }
                return false;
            });
            this.scrollSectionName(targetIndex, standardHeight);
            this.isSectionNameFixed = targetIndex >= 0;
        },
        scrollSectionName(targetIndex, standardHeight) {
            let sectionFixDOM = document.querySelector('.section-name-fixed');
            if (!sectionFixDOM) return;
            if (!this.fixedSectionTop && !this.isPC) {
                this.fixedSectionTop = sectionFixDOM && sectionFixDOM.getBoundingClientRect().top || 0;
            }
            if (targetIndex > 0 && sectionFixDOM) {
                let nextSectionNameTop = this.courseSectionsTop[targetIndex - 1].top;
                let criticalHeight = standardHeight + this.sectionNameHeight;
                if (nextSectionNameTop < criticalHeight) {
                    if (this.isPC) {
                        sectionFixDOM.style.top = 90 - (criticalHeight - nextSectionNameTop) + 'px';
                    }
                    else {
                        sectionFixDOM.style.top = this.fixedSectionTop - (criticalHeight - nextSectionNameTop) + 'px';
                    }
                }
                else {
                    if (this.isPC) {
                        sectionFixDOM.style.top = '90px';
                    }
                    else {
                        sectionFixDOM.style.top = this.fixedSectionTop + 'px';
                    }
                }
            }
            else if (targetIndex === 0) {
                if (this.isPC) {
                    sectionFixDOM.style.top = '90px';
                }
                else {
                    sectionFixDOM.style.top = this.fixedSectionTop + 'px';
                }
            }
        },
        // 是否购买判断对应的tab
        getCourseTabSelect() {
            let classSelect = 'info';
            const { query } = this.$route;
            if (this.hasPurchaseClass || query.isShowSections) {
                classSelect = 'menu';
            }
            classSelect = this.changeTabLabel || classSelect;
            return classSelect;
        },
        changeCourseTab(tabName) {
            let addressId = tabName === 'info' ? '1kkq' : '1kkr';
            this.changeTabLabel = tabName;
            if (!this.isPC) {
                this.isInitCompute = true;
            }

            if (this.isTabFixed) {
                // 切换 tab，页面内容滚动到顶端
                let containerOffsetTop = document.querySelector('.public-class-container').offsetTop;
                let otherHeight = 0;
                if (this.isPC) {
                    otherHeight = document.querySelector('.nav-wrap').offsetHeight;
                }
                this.isSectionNameFixed = false;
                let tabFixedTop = containerOffsetTop + otherHeight;
                document.body.scrollTo(0, tabFixedTop);
            }
        },
        chooseCourseLessonsByUser(lesson) {
            let lessonType = '';
            let { type } = lesson;
            if (type === 'wait') {
                lessonType = '待更新';
            }
            else if (type === 'lock') {
                lessonType = '未解锁';
                if (this.isLogin) {
                    this.showToast('购买后即可解锁课程');
                }
                else {
                    window.open('/frontLogin.do', '_self');
                    return;
                }
            }
            if (!lessonType) {
                this.setCurrentCourseLessons(lesson);
                let key =  this.isPC ? 'pc' : 'h5';

                lessonType = type === 'free' ? '试看' : '已购买';
                if (this.isVideoCourse) {
                    this.$router.push({
                        path: `/videoDetail?lessonId=${lesson.id}`,
                    });
                }
                else {
                    this.$router.push({
                        path: `/detail/${key}?id=${lesson.id}`,
                    });
                }
            }
        },
        updateCourseLessonsHistory(historyNode) {
            if (!this.isLogin) {
                return;
            }
            let { courseId, sectionId, id, hasLearned } = this.currentCourseLessons;
            let history = historyNode || parseInt(this.player && this.player.currentTime(), 10);
            this.setLessonHistoryReq({
                courseId,
                sectionId,
                id,
                historyNode: history,
                hasLearned
            });
        },
        resizeThisPage() {
            window.notUseFlexible = true; //禁用flexible中的resize事件
            document.documentElement.style.fontSize = `37.5px`;
            document.body.style.backgroundColor = 'rgb(237, 237, 237)';
        },
        initScrollListener() {
            this.$nextTick(() => {
                let header = this.$refs.tabWrap;
                if (!header) return;
                this.tabOffsetTop = header.offsetTop;
                this.tabOffsetHeight = header.offsetHeight;
                window.addEventListener('scroll', this.handleScroll, true);
            });
        },
        getSectionNameTop() {
            this.courseSectionsTop = [];
            let courseSections = document.querySelectorAll('.section-name');
            if (!courseSections) return;
            let { height } = courseSections[0] && courseSections[0].getBoundingClientRect();
            this.sectionNameHeight = height;
            let PcContainerPaddingTop = 90;
            courseSections.forEach(item => {
                let top = 0;
                if (this.isPC) {
                    top = item.offsetTop + PcContainerPaddingTop;
                }
                else {
                    top = item.offsetTop;
                }
                // if (this.isH5EnvAndNotLogin) {
                //     top -= this.topLoginBannerHeight;
                // }
                this.courseSectionsTop.unshift({
                    top,
                    text: item.textContent.trim()
                });
            });
        },
        unInitScrollListener() {
            window.removeEventListener('scroll', this.handleScroll, true);
        },
        unInstallClearCss() {
            document.body.style.backgroundColor = '';
            this.unInitScrollListener();
        },
        gotoPurchaseClass(position) {
            if (this.videoCourseTag) {
                this.showVideoToast = true;
                return;
            }
            // this.$refs.Purchase.gotoPurchaseClass();
            this.triggerPurchase();
            window.trackPurchase = {
                page_id: '1kkn',
                props: {
                    address_id: '1n34',
                    content_id: this.courseInfo.id || '',
                    reading_pixel_current: this.currentScrollSite,
                    reading_pixel_max: this.maxScrollSite,
                    page_pixel: this.pageHeight
                }
            };
        },
        resetCompute() {
            this.isInitCompute = false;
        },
        closeModal() {
            this.isShowShareModal = false;
        },
        checkIsPCShare() {
            setTimeout(() => {
                if (/shareFrom=PC_SHARE/.test(window.location.search)) {
                    this.showVideoModal();
                }
            }, 500);
        },
        showVideoModal() {
            if (this.isLogin) {
                if (this.isSharedCourse) {
                    let newUrl = location.href.replace('shareFrom=PC_SHARE', '');
                    window.location.replace(newUrl);
                    window.history.replaceState(null, null, newUrl);
                }
                else {
                    this.isShowShareModal = true;
                }
            }
            else {
                window.open('/frontLogin.do', '_self');
            }
        },
        getDistributionInfo() {
            fetchDistributionInfo().then(res => {
                const data = res;
                if (data.state && data.state === 1) {
                    let { showDistributionButton, distributionBaseInfoVo } = data.content;
                    this.showDistributionButton = showDistributionButton;
                    if (distributionBaseInfoVo) {
                        this.distributionInfo = distributionBaseInfoVo;
                    }
                }
            }).finally(() => {
                this.initScrollListener();
                this.isFinishDistribution = true;
            });
        },
        openDistributionModal() {
            if (this.isPc) {
                this.isShowPcDistributionModal = true;
            } else {
                if (this.isLogin || browserName !== 'WX') {
                    location.href = this.distributionInfo.url;
                }
                else {
                    this.setH5LoginModalStatus({
                        showH5LoginModal: true,
                        showH5LoginModalType: 'distribution'
                    });
                }

            }
        },
        closeDistributionModal() {
            this.isShowPcDistributionModal = false;
        },
        setCourseFooterCls() {
            this.hasPurchaseClass === false && (this.hasFooterCls = false);
        }
    }
};
</script>

<style lang="less" scoped >
    .weui-tab__panel{
        padding-bottom: 0 !important;
    }
    body {
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar {
            display: none;
        }
    }
    @media screen and (min-width: 750px) {
        .container{
            width: 750PX;
            margin: 0 auto;
        }
        .content-container {
            height: 100%;
            overflow-y: scroll;
            scrollbar-width: none;
        }
        .test-lesson{
            font-family: PingFangSC-Regular;
            box-sizing: border-box;
            position: absolute;
            right: -42PX;
            top: -1PX;
            font-size: 12PX;
            padding: 2PX 6PX;
            line-height: 12PX;
            border: 1px solid rgba(0,179,138,0.5);
            border-radius: 2PX;
            color: #00b38a;
        }
        .pc-background{
            padding: 20PX;
        }
        .pc-background,.public-class-container{
            background: #ffffff;
            min-height: calc(~"100vh - 330px");;
        }
        .vux-tab.choose-tab {
            border-bottom: 1PX solid #EDEDED;;
            box-sizing: border-box;
            height: 50PX;
            overflow: hidden;
            .vux-tab-container {
                width: 260PX;
            }
            .vux-tab-item {
                background: none;
                line-height: 50PX;
            }
            .vux-tab-ink-bar{
                bottom: -1PX;
                .vux-tab-bar-inner{
                    height: 2PX;
                }
            }
        }
        .public-class-footer {
            position: fixed !important;
        }
    }
    .content-wrapper {
        box-sizing: border-box;
        min-height: 100%;
    }
    .has-footer {
        padding-bottom: 130px;
        box-sizing: border-box;
    }
    .pc-mini-player-wrap{
        position: fixed;
        bottom: -50PX;
        left: 50%;
        margin-left: -345PX;
        z-index: 1;
        transition: .3s;
        opacity: 0;
        &.show-mini-player{
            bottom: 10PX;
            opacity: 1;
        }
        &.has-purchase-class{
            margin-bottom: 65PX;
        }
    }
    .divider-block {
        height: 20px;
        background: #f8f9fa;
    }
    .h5-tab-fix-wrap {
        .vux-tab {
            height: 90px;
            z-index: 2;
        }
    }
    .tab-fixed{
        .tab-fix-wrap{
            position: fixed;
            top: 40PX;
            left: 50%;
            transform: translateX(-50%);
            width: 750PX;
            z-index: 9;
            background: #ffffff;
            .choose-tab{
                width: 750PX;
                margin: 0 auto;
            }
        }
        .h5-tab-fix-wrap {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 3;
            background: #ffffff;
        }
        .tab-login-fixed {
            top: 90px;
        }

    }
    .tab-blank {
        height: 90px;
    }
    .tab-blank-PC {
        height: 50PX;
    }
    .section-name-fixed {
        position: fixed;
        left: 0;
        top: 88px;
        right: 0;
        padding: 44px 40px 38px;
        font-weight: bold;
        font-size: 32px;
        background: #ffffff;
        z-index: 1;
        font-family: PingFangSC-Regular;
    }
    .section-name-fixed-PC {
        width: 750PX;
        top: 90PX;
        left: 50%;
        transform: translateX(-50%);
        box-sizing: border-box;
        padding: 30PX 0 20PX 30PX;
        font-size: 18PX;
        &::after {
            display: none;
        }
        .section-name-single {
            max-width: 540PX;
        }
    }
    .section-name-single {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 600px;
        color: rgb(51, 51, 51);
    }

    .choose-tab {
        .vux-tab-container {
            overflow: visible;
        }
        .vux-tab-bar-inner {
            background-color: #00b38a;
            height: 6px;
            transform: translateY(-3px);
            border-radius: 3px;
        }
        .vux-tab-item {
            cursor: pointer;
        }
        .vux-tab-item.vux-tab-selected {
            font-weight: 500;
            cursor: default;
        }
        .tab-menu {
            position: relative;
        }
        .tab-free {
            position: absolute;
            right: -72px;
            top: 0;
            width: 60px;
            height: 34px;
            font-family: PingFangSC-Regular;
            font-size: 11PX;
            line-height: 11PX;
            color: #00B38A;
            font-weight: 100;
            box-sizing: border-box;
            white-space: nowrap;
            border: 0.5px solid #00B38A;

        }
        .tab-free-txt {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-weight: 500;
        }
        .scale-1px:after {
            border-radius: 4px;
            border-color: #00B38A;
        }
    }
    .h5-tab-fix-wrap {
        .vux-tab-bar-inner{
        background-color: #00b38a;
        //    background-color: #FBC546;
        }
    }
    .WX-purchase-success {
        width: 100%;
        height: 100%;
        .WX-purchase-bg {
            width: 100%;
            height: 100%;
            opacity: 0.7;
            z-index: 2;
            background: #000000;
            position: absolute;
            left: 0px;
            top: 0px;
        }
        .success-icon {
            width: 40px;
            height: 40px;
            position: absolute;
            left: 244px;
            top: 121px;
            z-index: 3;
        }
        .success-short-text {
            width: 165px;
            height: 56px;
            position: absolute;
            left: 313px;
            top: 113px;
            z-index: 3;
        }
        .success-long-text {
            width: 616px;
            height: 56px;
            position: absolute;
            left: 67px;
            top: 187px;
            z-index: 3;
        }
        .success-arrow {
            width: 55px;
            height: 80px;
            position: absolute;
            left: 582px;
            top: 61px;
            z-index: 3;
        }
    }

    .purchase-alert-container {
        position: relative;
        .weui-dialog {
            width: 540px;
            background: #ffffff;
            border: 1px solid #e8e9eb;
            border-radius: 10px;
            overflow: visible;
        }
        .weui-dialog__hd {
            margin-top: 10px;
            padding: 0px;
        }
        .weui-dialog__title {
            font-size: 34px;
            color: #333333;
        }
        .purchase-alert-content {
            font-size: 30px;
            color: #666666;
            .important {
                font-size: 30px;
                color: #151515;
                font-weight: bolder;
            }
        }
        .weui-dialog__bd {
            padding: 0px;
            margin-top: 20px;
        }
        .weui-dialog__ft {
            margin-left: 40px;
            margin-right: 40px;
        }
        .weui-dialog__ft:after {
            border-top: 1px solid #d9d9d9;
        }
        .weui-dialog__btn_primary {
            font-size: 32px;
        }
        .purchase-success-img {
            position: absolute;
            width: 70px;
            height: 70px;
            top: -35px;
            left: 240px;
        }
    }
    .qrcode-container-bg {
        width: 100%;
        height: 100%;
        background: #000000;
        opacity: 0.1;
        z-index: 101;
        position: fixed;
        left: 0;
        top: 0;
    }
    .qrcode-container {
        width: 600PX;
        height: 320PX;
        background: #ffffff;
        z-index: 102;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .pc-purchase-success {
            width: 100%;
            height: 100%;
            padding: 64PX;
            box-sizing: border-box;
            text-align: center;
            img {
                width: 112PX;
                height: 112PX;
            }
            h5 {
                font-family: HiraginoSansGB-W6;
                font-size: 18PX;
                color: #333333;
                letter-spacing: 0;
            }
        }
        .qrcode-close-icon {
            position: absolute;
            top: 8PX;
            right: 8PX;
            fill: rgb(211, 211, 211);
            cursor: pointer;
        }
    }

    .distribution-entry-pc, .distribution-entry-h5 {
        background: linear-gradient(to right, #AEA192, #8A7E72);
        color: #FFF5DE;
        position: absolute;
        animation: slideInRight .3s forwards;
        transform: translate3d(100%, 0, 0);
        -webkit-transform: translate3d(100%, 0, 0);
        cursor: pointer;

        .distribution-entry-icon, span, .right-arrow {
            float: left;
        }
    }

    .distribution-entry-pc {
        width: 104px;
        height: 26px;
        right: 0;
        top: 31px;
        border-radius: 2px 0 0 2px;

        .distribution-entry-icon {
            width: 14px;
            height: 13px;
            margin: 7px 4px 0 9px;
        }

        span {
            font-size: 12px;
            line-height: 17px;
            margin: 6px 3px 0 0;
        }

        .right-arrow {
            width: 7px;
            height: 7px;
            margin-top: 10px;
        }
    }

    .distribution-entry-h5 {
        height: 48px;
        right: 0;
        top: 11px;
        border-radius: 47px 0 0 47px;
        padding-right: 20px;

        .distribution-entry-icon {
            width: 24px;
            height: 24px;
            margin: 11px 11px 0 23px;
        }

        span {
            font-size: 24px;
            line-height: 24px;
            margin: 11px 6px 0 0;
        }

        .right-arrow {
            width: 13px;
            height: 13px;
            margin-top: 15px;
        }
    }

    @-webkit-keyframes slideInRight {
        0% {
            -webkit-transform: translate3d(100%,0,0);
            transform: translate3d(100%,0,0);
            visibility: visible
        }

        to {
            -webkit-transform: translateZ(0);
            transform: translateZ(0)
        }
    }

    @keyframes slideInRight {
        0% {
            -webkit-transform: translate3d(100%,0,0);
            transform: translate3d(100%,0,0);
            visibility: visible
        }

        to {
            -webkit-transform: translateZ(0);
            transform: translateZ(0)
        }
    }
    .show-more-wrap{
        width: 223PX;
        height: 243PX;
        background: url('~@assets/course/qipao-bg.png') top center no-repeat;
        padding-top: 31PX;
        text-align: center;
        margin-left: 120PX;
        background-size: 100% 100%;
    }
    .show-more{
        &-pc{
            position: fixed;
            width: 0;
            bottom: 70PX;
            left: 0;
            right: 0;
            z-index: 4;
            margin: 0 auto;
        }
        .show-more-wrap{
            position: fixed;
            bottom: 70PX;
            right: 100PX;
        }
        &-text{
            font-size:13PX;
            color:rgba(53,46,44,1);
            margin: 0 auto;
            line-height:18PX;
            margin-bottom: 8PX;
            width: 196PX;
        }
        &-qrcode{
            width: 140PX;
            height: 140PX;
            margin: 0 auto;
            background: url('~@assets/course/qrcode.jpg') top center no-repeat;
            background-size: cover;
        }
        &-des{
            font-size:13Px;
            font-weight:300;
            color:rgba(136,136,136,1);
            margin-top: 4PX;
        }
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
        .vux-tab .vux-tab-item{
            background: linear-gradient(180deg,#efefef,#efefef,hsla(0,0%,89.8%,0)) 0 100% no-repeat;
            background-size: 100% 1px;
        }
    }
</style>
