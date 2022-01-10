<template>
    <div ref="topContainer">
        <app-header v-if="isPc" />
        <navigation
            v-if="isPc"
            class="sale-navigation"
            :course-name="courseName"
        />
        <div
            ref="container"
            :class="{
                'sale-container':true,
                'pc-sale-container':isPc
            }"
        >
            <section
                class="section-top"
            >
                <PcTopCard
                    v-if="isPc"
                    :distribution-info="distributionBaseInfoVo"
                    @goToLearn="pcTopCardLearn"
                />
                <div v-else>
                    <img
                        class="bg"
                        :src="courseListImg"
                        alt=""
                    >
                    <div
                        v-if="showDistributionButton"
                        class="distribution-entry flex a-center"
                        @click="goDistribution"
                    >
                        <span>分享赚￥{{ distributionBaseInfoVo.brokerage }}</span>
                        <span class="kw-icon-arrow" />
                    </div>
                </div>
            </section>
            <section class="section-middle">
                <div
                    v-if="!isPc"
                    class="course-intro"
                >
                    <div class="name">
                        {{ courseName }}
                    </div>
                    <div class="brief">
                        {{ brief }}
                    </div>
                    <div class="tag flex">
                        <div class="flex-1">
                            <span class="discounts">{{ discounts || price }}</span>
                            <span
                                v-if="discounts && price && discounts !== price"
                                class="price"
                            >
                                ￥{{ price }}
                            </span>
                        </div>
                        <span
                            v-for="(item, index) in courseTags"
                            :key="index"
                            class="tag-item"
                        >{{ item }}</span>
                    </div>
                </div>
                <div
                    ref="detail"
                    class="course-info"
                >
                    <div
                        v-show="tabFixed"
                        class="tab-blank"
                    />
                    <div
                        v-if="showCatalog || showEvaluation"
                        ref="tabs"
                        :class="{'tab': true, 'tab-fixed': tabFixed}"
                        @click="clickTab($event)"
                    >
                        <div class="tab-item-wrap flex">
                            <div
                                class="tab-item flex-1"
                                data-type="detail"
                                :class="{'active': tabSelect === 'detail'}"
                            >
                                详情
                            </div>
                            <div
                                v-if="showCatalog"
                                class="tab-item flex-1"
                                data-type="catalog"
                                :class="{'active': tabSelect === 'catalog'}"
                            >
                                目录
                            </div>
                            <div
                                v-if="showEvaluation"
                                class="tab-item flex-1"
                                data-type="evaluation"
                                :class="{'active': tabSelect === 'evaluation'}"
                            >
                                评价
                            </div>
                            <div
                                v-if="!isPc"
                                class="scale-1px"
                            />
                        </div>
                    </div>
                    <div
                        class="rich-text-wrap"
                        v-html="courseDetail"
                    />
                    <!--目录-->
                    <div
                        v-if="showCatalog"
                        class="content"
                    >
                        <div
                            ref="catalog"
                            class="catalog"
                        />
                        <div class="content-title flex">
                            <div class="flex-1">
                                <span class="content-label">目录</span>
                                <span
                                    v-show="lessonCount"
                                    class="menu-side-span"
                                >/共{{ lessonCount }}节</span>
                            </div>
                        </div>
                        <ClassMenu
                            :is-from-sale-page="true"
                            :max-section-count="maxSectionCount"
                            :need-use-pc-class="isPc"
                            @chooseCourseLessonsByUser="chooseCourseLessonsByUser"
                        />
                        <div
                            v-if="isPc && showMoreMenuButton"
                            class="show-more-menu-button-wrap"
                            @click="pcShowMoreMenu"
                        >
                            <div class="button-text">
                                {{ isLimitSections ? '全部课程' : '收起' }}
                            </div>
                            <div
                                :class="{
                                    'triangle-slider-icon': true,
                                    'active': !isLimitSections
                                }"
                            />
                        </div>
                        <div
                            v-if="isPc && !showMoreMenuButton"
                            class="show-more-menu-button-wrap-blank"
                        />
                    </div>
                    <!--评价-->
                    <div ref="resizeEvaluation" />
                    <div
                        v-if="showEvaluation"
                        class="evaluation-container"
                    >
                        <div
                            ref="evaluation"
                            class="evaluation"
                        />
                        <Appraisal
                            :need-use-pc-class="isPc"
                            @hideEvaluation="hideEvaluation"
                        />
                    </div>
                </div>
            </section>
            <Footer
                ref="footer"
                :need-use-pc-class="isPc"
                :is-show-back="isShowBack"
                @backTop="backTop"
            />
            <Toast
                :show="isShowToast"
                @onHide="hideToast"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { fetchDistributionInfo, fetchDecorateDes  } from '../service';
import Footer from '../components/sale/Footer';
import ClassMenu from '../components/contents/ClassMenu';
import Appraisal from '../components/sale/Appraisal';
import Toast from '../components/common/Toast';
import Navigation from '../components/contents/Navigation';
import { getParam } from '@js/util/getParam';
import { setLocalStorage } from '@js/util/localStorage';
import { backTopMethod } from '@js/util/util';
import PcTopCard from '../components/sale/PcTopCard';

let courseInfo = this.courseInfo;

export default {
    name: 'Index',
    components: {
        Appraisal,
        ClassMenu,
        Footer,
        Toast,
        Navigation,
        PcTopCard
    },
    data() {
        let copyCourseInfo = Object.assign({}, courseInfo);
        delete copyCourseInfo.courseSections;
        let data = Object.assign({}, {
            showDistributionButton: false,
            distributionBaseInfoVo: {},
            showCatalog: false,
            showEvaluation: false,
            tabSelect: 'detail',
            catalogTop: 0,
            evaluationTop: 0,
            tabsTop: 0,
            tabFixed: false,
            clientHeight: document.body.clientHeight,
            isShowBack: false,
            lessonCount: 0,
            courseDetail: '',
            preventScroll: false,
            courseTags: [],
            page_id: '1pvk',
            showMoreMenuButton: false,
            maxSectionCount: 0
        }, copyCourseInfo);
        return data;
    },
    beforeRouteEnter(to, from, next) {
        let { hasPurchaseClass = '' } =  getParam();
        next(vm => {
            if (hasPurchaseClass === 'true') {
                vm.$router.replace({
                    path: '/saled'
                });
            }
            else if (!window.enterNewPage && !from.name) {
                vm.$router.replace({
                    path: '/content'
                });
            }
            else if (window.enterNewPage && from.name === 'H5Detail') {
                vm.autoScrollTop = from.query.scrollTop;
            }
        });
    },
    computed: {
        ...mapGetters([
            'hasPurchaseClass',
            'courseSections',
            'courseInfo',
            'isGotCourseSections'
        ]),
        isLimitSections() {
            return !!this.maxSectionCount;
        },
    },
    watch: {
        isGotCourseSections: {
            handler(val, oldVal) {
                if (val && !oldVal) {
                    this.computeCourseSection();
                }
            },
            immediate: true
        }
    },
    created() {
        this.maxSectionCount = this.isPc ? 8 : 0;
    },
    mounted() {
        let { hasPurchaseClass = '', p = '' } =  getParam();
        let { id, courseName } = this.courseInfo;
        if (hasPurchaseClass !== 'true' && window.enterNewPage) {
            this.eduPlatTrack('ViewCourseDetail', {
                page_id: this.page_id,
                page_from: p ? '分销扫码' : '',
                courses_id: [String(id)],
                courses_name: [courseName]
            });
        }
        this.isPc && this.resizeThisPage();
        let { successShowType, weixinQrUrl } = window.courseInfo;
        successShowType && setLocalStorage('successShowType', successShowType);
        weixinQrUrl && setLocalStorage('weixinQrUrl', weixinQrUrl);
        (this.showCatalog || this.showEvaluation) && this.getTabOffsetTop();
        this.getDistributionInfo();
        fetchDecorateDes().then(res => {
            if (res.state === 1) {
                this.courseDetail = res.content;
            }
        });
        this.setLastTagStyle();
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.scrollFunction, true);
    },
    methods: {
        ...mapActions([
            'setCurrentCourseLessons'
        ]),
        computeCourseSection() {
            let lessonCount = 0;
            this.courseSections.forEach(item => {
                item.courseLessons.forEach(() => {
                    lessonCount++;
                });
            });
            this.lessonCount = lessonCount;
            this.showMoreMenuButton = lessonCount > 8;
        },
        hideEvaluation() {
            this.showEvaluation = false;
        },
        // 判断最后一个 span 长度过长时省略
        setLastTagStyle() {
            let tags = document.querySelectorAll('.tag-item') || [];
            let lastTag = tags[tags.length - 1];
            if (!lastTag) return;
            let isSupperClient = lastTag.offsetLeft + lastTag.offsetWidth > document.body.offsetWidth - 10;
            if (isSupperClient) {
                lastTag.classList.add('tag-item-super');
            }
        },
        getTabOffsetTop() {
            let tabsDOM = this.$refs.tabs;
            if (!tabsDOM) return;
            setTimeout(() => {
                let { offsetTop, offsetHeight } = tabsDOM;
                if (this.showCatalog) {
                    this.catalogTop = this.$refs.catalog.getBoundingClientRect().top - offsetHeight;
                }
                if (this.showEvaluation) {
                    this.evaluationTop = this.$refs.evaluation.getBoundingClientRect().top - offsetHeight;
                }
                this.tabsTop = offsetTop;
                this.bindScroll();
            }, 1500);
        },
        bindScroll() {
            window.addEventListener('scroll', this.scrollFunction, true);
            if (this.autoScrollTop) {
                document.body.scrollTop = this.autoScrollTop;
                document.documentElement.scrollTop = this.autoScrollTop;
                this.autoScrollTop = null;
            }
        },
        scrollFunction() {
            let that = this;
            let topContainer = this.$refs.topContainer;
            if (that.preventScroll) return;
                let scrollTop = Math.abs(topContainer.getBoundingClientRect().top);
                if (that.isPc) {
                    scrollTop = scrollTop + 40;
                }
                that.tabFixed = scrollTop > that.tabsTop;
                that.isShowBack = scrollTop > that.clientHeight;
                if (scrollTop > that.evaluationTop && that.evaluationTop) {
                    that.tabSelect = 'evaluation';
                }
                else if (scrollTop > that.catalogTop && that.catalogTop) {
                    that.tabSelect = 'catalog';
                }
                else if (that.tabFixed && that.tabSelect !== 'detail') {
                    that.tabSelect = 'detail';
                }
        },
        getDistributionInfo() {
            fetchDistributionInfo().then(res => {
                if (res.state === 1) {
                    Object.assign(this, res.content);
                }
            });
        },
        goDistribution() {
            location.href = this.distributionBaseInfoVo.url;
        },
        clickTab(e) {
            let type = e.target.getAttribute('data-type');
            if (type === this.tabSelect) return;
            let targetTop = null;
            if (type === 'detail') {
                targetTop = this.tabsTop;
            }
            else if (type === 'catalog') {
                targetTop = this.catalogTop;
            }
            else if (type === 'evaluation') {
                targetTop = this.evaluationTop;
            }
            if (targetTop) {
                this.preventScroll = true;
                this.tabFixed = true;
                this.tabSelect = type;
                if (this.isPc && type === 'detail') {
                    targetTop = targetTop - 20;
                    document.body.scrollTop = targetTop;
                    document.documentElement.scrollTop = targetTop;
                } else {
                    this.$refs[type].scrollIntoView();
                }
                setTimeout(() => {
                    this.preventScroll = false;
                }, 100);
            }
        },
        backTop() {
            this.tabSelect = 'detail';
            this.$refs.topContainer.scrollIntoView();
            // backTopMethod();
        },
        chooseCourseLessonsByUser(lesson) {
            let lessonType = '';
            let { type } = lesson;
            if (type === 'wait') {
                lessonType = '待更新';
            }
            else if (type === 'lock') {
                lessonType = '未解锁';
                this.showToast('购买后可以解锁全部内容');
            }
            if (!lessonType) {
                this.setCurrentCourseLessons(lesson);
                let key =  this.isPc ? 'pc' : 'h5';
                let topContainer = this.$refs.topContainer;
                let scrollTop = Math.abs(topContainer.getBoundingClientRect().top);
                this.$router.push({
                    path: `/detail/${key}?id=${lesson.id}&scrollTop=${scrollTop}`,
                });
            }
        },
        hideToast() {
            this.isShowToast = false;
        },
        resizeThisPage() {
            window.notUseFlexible = true; //禁用flexible中的resize事件
            document.documentElement.style.fontSize = `37.5px`;
        },
        pcShowMoreMenu() {
            this.maxSectionCount = this.maxSectionCount ? 0 : 8;
            this.$nextTick(() => {
                this.evaluationTop = this.$refs.resizeEvaluation.offsetTop - 90;
            });
        },
        pcTopCardLearn() {
            this.$refs.footer.gotoPurchaseClass({ needReport: false });
        }
    }
};
</script>

<style scoped lang="less">
    .sale-container {
        padding-bottom: 100px;
        &::-webkit-scrollbar {
            width: 0;
        }
    }
    .evaluation-container {
        position: relative;
    }
    .evaluation, .catalog {
        position: absolute;
        top: -90px;
    }
    .section-top {
        position: relative;
        .bg {
            width: 750px;
            height: 560px;
        }
        .distribution-entry {
            position: absolute;
            bottom: 20px;
            right: 0;
            padding: 16px 20px;
            line-height: 24px;
            font-size: 24px;
            box-shadow: 0 4px 16px 0 rgba(0,0,0,0.16);
            border-radius: 14px 0 0 14px;
            background: #FBC546;
            font-weight: bolder;
        }
        .kw-icon-arrow {
            font-size: 12px;
            display: inline-block;
            font-weight: bolder;
            margin: 0 0 0 5px;
            vertical-align: middle;
        }
    }
    .section-middle {
        .course-intro {
            padding: 40px 40px 24px;
            border-bottom: 10px solid #F8F9FA;
        }
        .name {
            font-size:36px;
            font-weight: bolder;
            color: #333333;
        }
        .brief {
            color: #666666;
            font-size:24px;
            margin-top: 12px;
        }
        .tag {
            margin-top: 8px;
            align-items: baseline;
            overflow: hidden;
        }
        .discounts {
            color: #FF7452;
            font-size: 52px;
            font-weight: bolder;
            &::before {
                display: inline;
                content: '￥';
                font-size: 32px;
            }
        }
        .price {
            font-size:24px;
            color: #999999;
            text-decoration: line-through;
            display: inline-block;
            padding-left: 14px;
            padding-top: 32px;
        }
        .tag-item {
            line-height: 24px;
            background: #F8F9FA;
            border-radius:2px;
            padding: 14px 16px;
            font-size:24px;
            font-weight: bolder;
            color: #666666;
            margin-left: 20px;
            word-break: keep-all;
            &:first-child {
                margin: 0;
            }
            &.tag-item-super {
                flex: 1;
                width: 0;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            }
        }
        .course-info {
            .tab {
                height: 90px;
                line-height: 90px;
                font-size:28px;
                position: relative;
            }
            .tab-blank {
                height: 90px;
            }
            .tab-fixed {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1;
                background: #fff;
            }
            .tab-item {
                justify-content: center;
                position: relative;
                color: #666;
                text-align: center;
                &.active {
                    font-weight: bolder;
                    color: #333333;
                    &::after {
                        content: '';
                        display: block;
                        position: absolute;
                        width: 34px;
                        height: 5px;
                        background: #FBC546;
                        border-radius: 1px;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }
            }
            .scale-1px{
                position: absolute;
                width: 100%;
                border: none;
                height: 1px;
                bottom: 0;
                &::after {
                    border-color: transparent;
                    border-bottom-color: #efefef;
                    height: 1px;
                }
            }

        }
        .content {
            padding-top: 60px;
            border-top: 10px solid #F8F9FA;
            position: relative;
            .content-title {
                padding: 0 40px;
                &>div {
                    font-size:20px;
                    color: #999999;
                    align-items: baseline;
                }
                &>button {
                    font-size:28px;
                    color: #666;
                    background: white;
                    outline: none;
                    border: none;
                }
                .kw-icon-list-arrow {
                    font-size: 20px;
                    line-height: 20px;
                    margin-right: 4px;
                }
            }
            .content-label {
                font-weight: bolder;
                font-size:40px;
                line-height: 40px;
                color: #333333;
                margin-right: 14px;
            }
        }
    }
    /deep/.rich-text-wrap {
        @import '../common/css/richText';
        padding: 30px 40px;
        font-size: 16PX;
        color: #666;
        img{
            max-width: 100%;
        }
        pre {
            max-width: 100%;
            touch-action: auto;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            width: 100%;
            word-break: normal;
            code {
                touch-action: auto;
                margin: 0;
                word-break: normal;
                display: block;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            &::-webkit-scrollbar {
                height: 2PX;
            }
        }
        h1 {
            font-size: 40px;
        }
        h2 {
            font-size: 32px;
        }
        h3 {
            font-size: 28px;
        }
        h1, h2, h3 {
            color: #333333;
        }
    }

    .sale-container.pc-sale-container{
        width: 1000PX;
        margin: 0 auto;
        &::-webkit-scrollbar {
            width: 3PX;
        }
        .section-middle .course-info{
            .tab{
                width:1000PX;
                height:50PX;
                background:rgba(248,249,250,1);
                border:1PX solid rgba(237,237,237,1);
                cursor: pointer;
            }
            .tab-item{
                font-size:20PX;
                font-family:PingFangSC-Regular,PingFang SC;
                color:rgba(102,102,102,1);
                line-height: 50PX;
                &.active{
                    &::after{
                        width: 32PX;
                        height: 3PX;
                        background:rgba(0,179,138,1);
                    }
                }
            }
            .tab-blank{
                height:50PX;
            }
            .tab-item-wrap{
                font-size: 0;
                padding:0 134PX;
                .tab-item{
                    width: 33.3%;
                    line-height: 50PX;
                    display: inline-block;
                }
            }
            .tab-fixed{
                width: 100%;
                background: #ffffff;
                top: 40PX;
                .tab-item-wrap{
                    width: 1000PX;
                    margin: 0 auto;
                    box-sizing: border-box;
                }
            }
        }
        /deep/.rich-text-wrap {
            @import '../common/css/richText';
            padding: 30PX 0 0 0 ;
            font-size: 16PX;
            color: #666;
            img{
                max-width: 100%;
            }
            pre {
                max-width: 100%;
                touch-action: auto;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                width: 100%;
                word-break: normal;
                code {
                    touch-action: auto;
                    margin: 0;
                    word-break: normal;
                    display: block;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }
                &::-webkit-scrollbar {
                    height: 2PX;
                }
            }
            h1 {
                font-size: 20PX;
            }
            h2 {
                font-size: 16PX;
            }
            h3 {
                font-size: 14PX;
            }
            h1, h2, h3 {
                color: #333333;
                margin: 10PX 0;
            }
            a{
                cursor: pointer;
            }
            p{
                margin-bottom: 0;
            }
        }
        .content{
            border: none;
            padding-top: 80PX;
            font-family:PingFangSC-Regular,PingFang SC;
            .content-title{
                font-size:14PX;
                color:rgba(153,153,153,1);
                padding: 0;
                margin-bottom: 4PX;
            }
            .content-label{
                font-size:28PX;
                font-weight:700;
                color:rgba(51,51,51,1);
                margin-right: 8PX;
            }
            .menu-side-span{
                font-size: 14PX;
            }

        }
        .show-more-menu-button-wrap{
            width:100%;
            height:50PX;
            background:rgba(248,249,250,1);
            text-align: center;
            line-height: 50PX;
            font-size:0;
            color:rgba(102,102,102,1);
            margin-top: 20PX;
            cursor: pointer;
            .button-text{
                display: inline-block;
                vertical-align: top;
                font-size:14PX;
            }
            .triangle-slider-icon{
                display: inline-block;
                vertical-align: middle;
                width: 12PX;
                height: 12PX;
                margin-left: 4PX;
                background: url('~@assets/course/sale/arrow.png') no-repeat;
                background-size: 100% 100%;
                transition: all .3s;
            }
            .active{
                transform: rotate(180deg);
            }
        }
        .show-more-menu-button-wrap-blank{
            height: 80PX;
        }
        .evaluation{
            top: -110PX;
        }
    }
    .sale-navigation{
        /deep/ .nav-p-pc{
            width: 1000PX;
            font-size: 14PX;
        }
    }
</style>

