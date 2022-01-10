<template>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div
                v-for="(item, index) in swiperOption.assetsList"
                :key="index"
                class="swiper-slide"
            >
                <slot
                    name="slide"
                    :slide="item"
                >
                    <a
                        v-if="item && item.link"
                        :href="item.link"
                        target="_blank"
                    >
                        <img
                            class="banner-img hover-pointer"
                            :src="item.imgurl"
                            :alt="item.subsite"
                        >
                    </a>
                </slot>
            </div>
        </div>
        <slot name="navigation" />
        <div class="swiper-pagination" />
    </div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.css';

export default {
    name: 'Swiper',
    props: {
        swiperOption: {
            type: Object,
            default() {
                return {
                    assetsList: [],
                    swiper: {}
                };
            }
        }
    },
    data() {
        return {
            swiperInstance: {}
        };
    },
    watch: {
        'swiperOption.assetsList': {
            handler: function(val) {
                this.renderSwiper();
            }
        }
    },
    mounted() {
        if (this.swiperOption.assetsList.length) {
            this.renderSwiper();
        }
    },
    methods: {
        renderSwiper() {
            let defaultOption = {
                direction: 'horizontal',
                loop: true,
                speed: 500,
                pagination: '.swiper-pagination',
                paginationType: 'bullets',
                paginationClickable: true,
                autoplayDisableOnInteraction: false,
                autoplay: 3000,
            };
            let options = Object.assign({}, defaultOption, this.swiperOption.swiper);
            this.$nextTick(() => {
                const lagouSwiper = new Swiper(this.$el, options);
                this.swiperInstance = lagouSwiper;
                //只有一个banner时  锁定  官方写法
                if (lagouSwiper && lagouSwiper.slides && lagouSwiper.slides.length <= 1) {
                    lagouSwiper.lockSwipes();
                }
            });
        },
        swiperMethod(method, params) {
            this.swiperInstance[method](params);
        }
    }
};
</script>

<style lang="less">
    @import '~@less/common';

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
</style>
