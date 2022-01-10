<template>
    <div
        v-if="swiperOption.assetsList && swiperOption.assetsList.length"
        class="mobile-training-camp"
    >
        <p class="course-title">
            训练营
            <span
                class="course-title-more"
                @click="linkList"
            >更多</span>
        </p>
        <camp-swiper
            :swiper-option="swiperOption"
            :is-set-swipper="isSetSwipper"
            class="swiper-container"
        />
    </div>
</template>
<script>
import CampSwiper from './CampSwiper';
import { fetchGetContentList } from '../service';

export default {
    name: 'MobileTrainingCamp',
    components: {
        CampSwiper,
    },
    data() {
        return {
            swiperOption: {
                assetsList: [], // 轮播图
                wrapperClass: {
                    'margin-left': '15px',
                    'margin-top': '0',
                    // 'height': '160px',
                    'width': '96%'
                },
                slideStyle: {
                    boxSizing: 'border-box'
                }
            },
            isSetSwipper: false
        };
    },
    mounted() {
        this.getCampList();
    },
    methods: {
        linkList() {
            this.$router.push('/campList');
        },
        // 获取训练营列表
        async getCampList() {
            let res = await fetchGetContentList();
            if (res.data.state === 1 && res.data.content && res.data.content.contentCardList) {
                let resObj = res.data.content.contentCardList[0] || {};
                window.campList = resObj.bigCourseList || [];
                this.swiperOption.assetsList = window.campList.slice(0, 5);
            }
        }
    }
};
</script>
<style lang="less" scoped>
    @import '~@less/common.less';
    .mobile-training-camp {
        background-color: #F8F9FA;
        .training-wrap{
            display: block;
            margin: 40px 30px 60px;
        }
        .training-img{
            width: 100%;
            border-radius: 4px 4px 0 0;
        }
        .course-title{
            overflow: hidden;
            font-size:36px;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height:50px;
            padding: 0 30px;
            margin-bottom: 20px;
            background:linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(248,249,250,1) 100%);

            &-more {
                float: right;
                font-size: 24px;
                position: relative;
                left: -16px;
                &::after{
                    display: block;
                    content: '';
                    width: 20px;
                    height: 20px;
                    background: url('~@/assets/course-list/right.png') no-repeat;
                    background-size: contain;
                    position: absolute;
                    right: -16px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }

    }
</style>
