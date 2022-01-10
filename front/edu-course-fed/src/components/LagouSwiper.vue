<template>
    <div
        class="swiper-container"
        :style="swiperOption.wrapperClass"
    >
        <div class="swiper-wrapper">
            <div
                v-for="(item, index) in swiperOption.assetsList"
                :key="index"
                class="swiper-slide"
                :style="swiperOption.slideStyle"
            >
                <a
                    :href="item.link"
                    target="_blank"
                >
                    <img
                        class="banner-img hover-pointer"
                        :src="item.imgurl"
                        :style="swiperOption.imgStyle"
                        alt=""
                    >
                </a>
            </div>
        </div>
        <div
            class="swiper-pagination"
            :style="swiperOption.paginationClass"
        />
    </div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.css';

export default {
    name: 'LagouSwiper',
    props: {
        swiperOption: {
            type: Object,
            default() {
                return {
                    wrapperClass: {},
                    paginationClass: {},
                    assetsList: [],
                    imgStyle: {},
                    slideStyle: {}
                };
            }
        },
        isSetSwipper: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    watch: {
        'swiperOption.assetsList': {
            handler: function(val) {
                this.$nextTick(() => {
                    const lagouSwiper = new Swiper(this.$el, {
                        direction: 'horizontal',
                        loop: true,
                        speed: 500,
                        pagination: '.swiper-pagination',
                        paginationType: 'bullets',
                        paginationClickable: true,
                        autoplayDisableOnInteraction: false,
                        autoplay: 3000,
                    });
                    //只有一个banner时  锁定  官方写法
                    if (lagouSwiper && lagouSwiper.slides && lagouSwiper.slides.length <= 3) {
                        lagouSwiper.lockSwipes();
                    }
                });

            }
        },
        isSetSwipper(val, oldVal) {
            if (val !== oldVal) {
                this.$nextTick(() => {
                    const lagouSwiper = new Swiper(this.$el, {
                        direction: 'horizontal',
                        loop: true,
                        speed: 500,
                        pagination: '.swiper-pagination',
                        paginationType: 'bullets',
                        paginationClickable: true,
                        autoplayDisableOnInteraction: false,
                        autoplay: 3000,
                    });
                    //只有一个banner时  锁定  官方写法
                    if (lagouSwiper && lagouSwiper.slides && lagouSwiper.slides.length <= 3) {
                        lagouSwiper.lockSwipes();
                    }
                });
            }
        }
    }
};
</script>

<style lang="less">
    @import '~@less/common';
    .swiper-container {
        width: 1200px;
        height: 320px;
        margin: 20px auto 0;
        // .swiper-pagination {
        //     left: 50%;
        //     display: inline-block;
        //     transform: translateX(-50%);
        //     width: auto;
        // }
        .swiper-pagination-bullet{
            width: 4px;
            height: 4px;
            background: #cccccc;
            border-radius: 50%;
            opacity: 1;
            &-active{
                border-radius: 2px ;
                width: 8px ;
                background: #00b38a;
            }
        }
    }
    .banner-img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>