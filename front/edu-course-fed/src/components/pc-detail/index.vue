<template>
    <div>
        <app-header />
        <div
            v-cloak
            class="container"
        >
            <PcHeaderHandleBar
                @switchMenu="switchMenu"
            />
            <div
                class="content-wrap"
                :class="{'hideMenu':!isShowMenu}"
            >
                <div
                    class="left-content-wrap"
                >
                    <PcCurrentClassInfo />
                    <div
                        v-if="isSectionNameFixed"
                        class="menu-section-fixed single-line"
                    >
                        {{ fixedSectionName }}
                    </div>
                    <div class="menu-content calc">
                        <PcClassMenu :is-auto-scroll="autoScroll" />
                    </div>
                </div>
                <div
                    class="right-content-wrap"
                    :class="hasPurchaseClass ? '' : 'right-wrap-padding-btm'"
                    :style="'height: ' + rightContentWrap"
                >
                    <PcDetailContainer />
                    <div class="fix-box-wrap">
                        <div
                            class="mini-player-wrap"
                            :class="{'show-mini-player':isSlideShowMiniBar}"
                        >
                            <PcMiniPlayer />
                        </div>
                        <div
                            v-if="currentCourseLessons.type === 'free'"
                            class="buy-tips-wrap"
                        >
                            <div class="text inline-block">
                                本节为免费试看，购买后解锁全部章节
                            </div>
                            <div
                                class="button"
                                @click="goToPay"
                            >
                                {{ purchaseText }} ￥{{ buyPrice }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="!hideMessage"
                        class="right-content-space"
                    />
                    <div
                        v-if="!hideMessage"
                        class="right-content-message"
                    >
                        <PcMessage
                            :show-edit="true"
                            :pc-message="true"
                            :show-empty="true"
                            :is-mine="true"
                        />
                    </div>
                </div>
            </div>
            <Purchase />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { OSName } from '../../common/js/userAgent/browser-name-and-OS';
import PcClassMenu from '../pc-cotents/PcClassMenu';
import PcHeaderHandleBar from '../pc-cotents/PcHeaderHandleBar';
import PcCurrentClassInfo from '../pc-cotents/PcCurrentClassInfo';
import PcDetailContainer from '../pc-cotents/PcDetailContainer';
import  PcMessage  from '../message/PcMessage';
import PcMiniPlayer from '../pc-cotents/PcMiniPlayer';
import Purchase from '../common/Purchase';

export default {
    name: 'PcDetail',
    components: {
        PcClassMenu,
        PcHeaderHandleBar,
        PcCurrentClassInfo,
        PcDetailContainer,
        PcMiniPlayer,
        Purchase,
        PcMessage
    },
    data() {
        return {
            currentEnvironment: this.setCurrentEnvironment(), //当前环境
            isShowMenu: true, //是否展示菜单
            pageHeight: 0,
            maxScrollSite: 0,
            currentScrollSite: 0,
            courseSectionsTop: [],
            isSectionNameFixed: false,
            fixedSectionName: '',
            fixedSectionTop: 0,
            autoScroll: true,
            rightContentWrap: document.body.clientHeight - 50 + 'px'
        };
    },
    computed: {
        ...mapGetters([
            'hasPurchaseClass',
            'currentCourseLessons',
            'courseSections',
            'courseInfo',
            'playerStatus',
            'isSlideShowMiniBar',
            'isMoreSectionsCourse',
            'userInfo',
            'isLogin'
        ]),
        buyPrice: function() {
            return this.courseInfo.discounts || this.courseInfo.price;
        },
        purchaseText: function() {
            let { courseInfo = {}, hasPurchaseClass } = this;
            let { discountsTag = '', priceTag = '' } = courseInfo;
            if (hasPurchaseClass) {
                return `查看详情`;
            } else {
                return `${discountsTag || priceTag}`;
            }
        },
        hideMessage: function() {
            let { type } = this.currentCourseLessons;
            return !this.hasPurchaseClass && type !== 'free';
        }
    },
    mounted() {
        this.resizeThisPage();
        this.getDataForScroll();
        if (this.isMoreSectionsCourse) {
            this.bindSectionScroll();
        }
        this.eduPlatTrack('WebView', { page_id: '1pqc' });
        this.isLogin && !this.playerStatus.isPlaying && this.setIsReportHeart(true);
    },
    destroyed() {
        this.unInstallClearCss();
        window.removeEventListener('scroll', this.pageScroll);
        document.body.scroll(0, 0);
        this.twoPlatTrack('1ncz', {
            address_id: '1nir',
            content_id: this.currentCourseLessons.id || '',
            reading_pixel_current: this.currentScrollSite,
            reading_pixel_max: this.maxScrollSite,
            page_pixel: this.pageHeight
        });
    },
    beforeRouteUpdate(to, from, next) {
        next();
        this.$store.dispatch('setCurrentCourseLessons');
        scrollTo(0, 0);
    },
    methods: {
        ...mapActions([
            'setCurrentCourseLessons',
            'triggerPurchase',
            'setIsReportHeart'
        ]),
        getDataForScroll() {
            let container = document.getElementsByClassName('content-wrap')[0];
            if (!container) return;
            this.pageHeight = container.offsetHeight;
            window.pcDetailBuryRrport = {
                reading_pixel_current: this.currentScrollSite,
                reading_pixel_max: this.maxScrollSite,
                page_pixel: this.pageHeight
            };
            window.addEventListener('scroll', this.pageScroll, false);
        },
        pageScroll(e) {
            this.isLogin && !this.playerStatus.isPlaying && this.setIsReportHeart(true);
            let container = document.getElementsByClassName('content-wrap')[0];
            if (!container) return;
            let top = Math.abs(container.getBoundingClientRect().top);
            this.currentScrollSite = top;
            if (this.maxScrollSite < top) {
                this.maxScrollSite = top;
            }
            window.pcDetailBuryRrport = {
                reading_pixel_current: this.currentScrollSite,
                reading_pixel_max: this.maxScrollSite,
                page_pixel: this.pageHeight
            };
        },
        bindSectionScroll() {
            this.courseSectionsTop = [];
            let courseSections = document.querySelectorAll('.section-name-detail');
            let firstSectionDOM = document.querySelector('.section-name-detail');
            let initTop = firstSectionDOM.getBoundingClientRect().top;
            for (let i = 0, l = courseSections.length; i < l; i++) {
                let top = courseSections[i].offsetTop;
                this.courseSectionsTop.unshift({
                    top,
                    text: courseSections[i].textContent.trim()
                });
            }
            let sectionElement = document.querySelector('.menu-content');
            sectionElement.addEventListener('scroll', () => {
                let scrollTop = Math.abs(firstSectionDOM.getBoundingClientRect().top - initTop);
                let targetIndex = null;
                for (let i = 0, l = this.courseSectionsTop.length; i < l; i++) {
                    if (scrollTop > this.courseSectionsTop[i].top) {
                        targetIndex = i;
                        this.fixedSectionName = this.courseSectionsTop[i].text;
                        break;
                    }
                }
                if (typeof targetIndex !== 'number') {
                    this.isSectionNameFixed = false;
                    return;
                }
                let sectionFixDOM = document.querySelector('.menu-section-fixed');
                if (!this.fixedSectionTop && sectionFixDOM) {
                    this.fixedSectionTop = sectionFixDOM.offsetTop;
                }
                this.isSectionNameFixed = true;
                let fixedSectionDOM = document.querySelector('.menu-section-fixed');
                if (!fixedSectionDOM) return;
                if (targetIndex === 0) {
                    fixedSectionDOM.style.top = this.fixedSectionTop + 'px';
                    return;
                }
                let touchDistance = this.courseSectionsTop[targetIndex - 1].top - scrollTop - firstSectionDOM.offsetHeight;
                if (this.courseSectionsTop[targetIndex - 1].top - scrollTop < firstSectionDOM.offsetHeight) {
                    fixedSectionDOM.style.top = this.fixedSectionTop + touchDistance + 'px';
                }
                else if (fixedSectionDOM) {
                    fixedSectionDOM.style.top = this.fixedSectionTop + 'px';
                }
            });
        },
        resizeThisPage() {
            let { currentEnvironment } = this;
            if (currentEnvironment === 'PC') {
                window.notUseFlexible = true; //禁用flexible中的resize事件
                document.documentElement.style.fontSize = `37.5px`;
                document.body.style.width = `100%`;
                document.body.style.margin = ` `;
                document.body.style.height = ` `;
                document.body.style.backgroundColor = 'rgb(237, 237, 237)';
            }
        },
        unInstallClearCss() {
            document.body.style.backgroundColor = '';
        },
        setCurrentEnvironment() {
            return ['Android', 'iOS'].indexOf(OSName) !== -1 ? 'H5' : 'PC';
        },
        switchMenu(type) {
            this.isShowMenu = type;
        },
        goToPay: function() {
            this.twoPlatTrack('1ncz', {
                address_id: '1nda',
                content_id: this.courseInfo.id || ''
            });
            window.trackPurchase = {
                page_id: '1ncz',
                props: {
                    address_id: '1ne6',
                    content_id: this.currentCourseLessons.id || ''
                }
            };
            this.triggerPurchase();
        },
        setPageToTop: function() {
            this.$refs.detailContentWrap.scrollTop = 0;
        }
    }
};
</script>

<style lang="less">
    #app{
        height: 100%;
    }
    .pcVideoModalShow{
        .left-content-wrap,
        .right-content-wrap .main-wrap,
        .right-content-wrap .fix-box-wrap,
        .pub-header,
        #lg_tbar{
            -webkit-filter: blur(5PX); /* Chrome, Opera */
            -moz-filter: blur(5PX);
            -ms-filter: blur(5PX);
            // filter: blur(~"5PX");
        }
        .v-modal{
            opacity: 0.8;
        }
    }
</style>
<style scoped lang="less">
    div{
        box-sizing: border-box;
    }
    .container {
        min-width: 1220PX;
        .common-nav{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
        }
    .content-wrap{
        position: absolute;
        top: 40PX;
        left: 50%;
        box-sizing: border-box;
        width: 1220PX;
        min-height: 100%;
        margin-left: -610PX;
        overflow: hidden;
        transition: .3s;
    }
    .hideMenu{
        .left-content-wrap{
                margin-left: -520PX;
                // z-index:1;
                pointer-events: none;
                opacity: 0;
        }
        .right-content-wrap{
            margin-left: 192PX;
            z-index: 3;
        }
        .fix-box-wrap{
            margin-left: -418PX;
        }
    }
    .left-content-wrap{
        position: fixed;
        z-index: 2;
        top: 40PX;
        bottom: 0;
        left: 50%;
        width: 384PX;
        font-size: 14PX;
        transition: .3s;
        opacity: 1;
        margin-left: -610PX;
        pointer-events: auto;
        padding-top: 50PX;
    }

    .menu-content{
        overflow-y: auto;
        background: #f6f6f6;
        position: relative;
        &::-webkit-scrollbar {
            width: 2PX;
        }
    }
    .menu-section-fixed {
        position: absolute;
        left: 0;
        top: 258PX;
        right: 0;
        font-size: 16PX;
        padding: 39PX 0 39PX 30PX;
        color: #333;
        font-weight: 700;
        z-index: 1;
        background: #f1f1f1;
        font-family: PingFangSC-Regular;
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
    .calc{
        height:  calc(~"100% - 208px");
    }
    .right-content-wrap{
        position: relative;
        box-sizing: border-box;
        width: 836PX;
        margin-top: 50PX;
        background-color: #fff;
        -webkit-transition: .3s;
        transition: .3s;
        margin-left: 384PX;
        /* margin-bottom: -9900PX; */
        overflow-y: scroll;
        &::-webkit-scrollbar {
            width: 2PX;
        }
    }
        .right-wrap-padding-btm {
            padding-bottom: 60PX;
        }
    .right-content-space{
        width: 100%;
        height: 10PX;
        background: #f8f8f8;
    }
    .right-content-message{
        box-sizing: border-box;
        width: 100%;
        padding: 50PX 60PX 0;
        background-color: #fff;
    }
    .fix-box-wrap{
        position: fixed;
        bottom: 0;
        left: 50%;
        margin-left: -226PX;
        transition: .3s;
        z-index: 30;
        width: 836PX;
        .buy-tips-wrap{
            width: 836PX;
            height: 60PX;
            background: #FFFADC;
            font-size: 18PX;
            color: #9F7A1F;
            line-height: 60PX;
            padding: 0 60PX 0 60PX;
            .button{
                width: 170PX;
                height: 44PX;
                font-size: 16PX;
                color: #FFFFFF;
                text-align: center;
                line-height: 44PX;
                background: #00B38A;
                border-radius: 2PX;
                float: right;
                cursor: pointer;
                margin-top: 8PX;
            }
        }
    }
    .inline-block{
        display: inline-block;
        vertical-align: top;
    }
    .mini-player-wrap{
        transition: .5s;
        margin-bottom: -50PX;
        opacity: 0;
        position: relative;
        z-index: -1;
        &.show-mini-player{
            margin-bottom: 0;
            opacity: 1;
        }
        .player-container-wrap{
            margin: 0 auto;
            margin-bottom: 10PX;
        }
    }

}
</style>
