<template>
    <div v-c="'course'">
        <PcHeader></PcHeader>
        <TopLoginBanner />
        <course-swiper
            v-if="isPc"
            v-show="topAds && topAds.length"
            :top-ads="topAds"
        />
        <mobile-header
            v-if="!isPc"
        />
        <mobile-training-camp
            v-if="!isPc"
        />
        <div v-c="'content-main'">
            <course-list v-if="!isPc" />
            <Pc-course-list v-if="isPc" />
            <recommend
                v-if="isPc"
                :sidebar-ads="sidebarAds"
            />
        </div>
        <mobile-footer v-if="!isPc" />
        <Footer
            v-if="isPc"
            v-c="'footer'"
        />
        <GiftModal />
        <PCWeChatModal
            v-if="isShowPCWeChatModal"
            :join-info="joinInfo"
            @confirmLink="purchaseConfirmLink"
        />
        <H5WeChatModal
            v-if="isShowH5WeChatModal"
            :join-info="joinInfo"
            @confirmLink="purchaseConfirmLink"
        />
    </div>
</template>

<script>
import CourseSwiper from '../components/CourseSwiper';
import CourseList from '../components/CourseList';
import PcCourseList from '../components/PcCourseList';
import Recommend from '../components/Recommend';
import MobileHeader from '../components/MobileHeader';
import MobileFooter from '../components/MobileFooter';
import MobileTrainingCamp from '../components/MobileTrainingCamp';
import Footer from '../components/footer';
import GiftModal from '../components/GiftModal';
import PCWeChatModal from '../components/PCWeChatModal';
import H5WeChatModal from '../components/H5WeChatModal';
import PcHeader from '../common/components/Header/index';
import TopLoginBanner from '@components/Login/TopLoginBanner';
import loadScript from '@js/util/load-script.js';
import { OSName } from '@js/userAgent/browser-name-and-OS.js';

import { fetchCheckAccompanyCourse, fetchConfirmAccompany, getAds } from '../service';
import { getParam } from '@js/util/getParam';
import { addBuyTarget } from '@js/pcLoginAutoBuy';
import { fetchSensorLogin } from '@service/sensorLogin';
export default {
    name: 'CourseListContainer',
    components: {
        MobileTrainingCamp,
        MobileFooter,
        CourseList,
        CourseSwiper,
        Recommend,
        MobileHeader,
        Footer,
        GiftModal,
        PCWeChatModal,
        H5WeChatModal,
        TopLoginBanner,
        PcCourseList,
        PcHeader
    },
    data() {
        return {
            sidebarAds: [],
            topAds: [],
            isShowPCWeChatModal: false,
            isShowH5WeChatModal: false,
            joinInfo: {}
        };
    },
    created() {
    },
    mounted() {
        this.getPcAd();
    },
    methods: {
        getPcAd() {
            getAds(999).then((res)=>{
                this.topAds = res.content && res.content[0] && res.content[0].adDTOList && res.content[0].adDTOList.filter(item => item.status)
            })
            // this.axios.get('/ads').then((res) => {
            //     const { data: { state, content } } = res;
            //     if (state === 1) {
            //         this.sidebarAds = content.data.sidebarAds;
            //         this.topAds = content.data.topAds;
            //     }
            // });
        },
        purchaseConfirmLink() {
            this.isShowPCWeChatModal = false;
            this.isShowH5WeChatModal = false;
            fetchConfirmAccompany(this.joinInfo.courseId);
        }
    }

};
</script>

<style lang="less" scoped>
    body {
        background-color: #fafafa;
        -webkit-overflow-scrolling: touch;
    }
    .course{
        background: #fff;
        position: absolute;
        left:0;
        right: 0;
        top: 0;
        bottom: 0;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .content-main{
        &-pc{
            width: 1200px;
            margin: 20px auto 0;
            overflow: hidden;
        }
    }
    .course-title{
        font-size:36px;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:50px;
        padding: 0 40px;
    }
    .lg_tbar_r{
        font-size: 14PX;
    }
</style>
