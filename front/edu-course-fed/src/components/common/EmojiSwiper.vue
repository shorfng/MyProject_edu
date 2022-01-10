<template>
    <div
        ref="myPanel"
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
                <span
                    v-for="(emoji,index) in item.emojiList"
                    :key="index"
                    class="emoji"
                ><img
                    :src="emoji.url"
                    :data-src="emoji.url"
                    :data-code="emoji.code"
                    class="emoji-icon"
                    :class="'emoji_' + emoji.code"
                    @click="clickEmoji"
                ></span>
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
    name: 'EmojiSwiper',
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
                        autoplay: false,
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
                        autoplay: false,
                    });
                    //只有一个banner时  锁定  官方写法
                    if (lagouSwiper && lagouSwiper.slides && lagouSwiper.slides.length <= 3) {
                        lagouSwiper.lockSwipes();
                    }
                });
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            const lagouSwiper = new Swiper(this.$el, {
                direction: 'horizontal',
                loop: true,
                speed: 500,
                pagination: '.swiper-pagination',
                paginationType: 'bullets',
                paginationClickable: true,
                autoplay: false,
            });
            //只有一个banner时  锁定  官方写法
            if (lagouSwiper && lagouSwiper.slides && lagouSwiper.slides.length <= 3) {
                lagouSwiper.lockSwipes();
            }
        });
    },
    methods: {
        clickEmoji(e) {
            this.$emit('pickerEmoji', e.target.dataset);
        }
    }
};
</script>

<style lang="less">
    @import '~@less/common';
    @import '~@less/emojih5.less';
    .swiper-container {
        width: 100%;
        height: 150px;
        margin: 10px auto 0;
        .swiper-pagination{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .swiper-pagination-bullet{
            width: 6px;
            height: 6px;
            background: #cccccc;
            border-radius: 50%;
            opacity: 1;
            &-active{
                border-radius: 50% ;
                width: 8px;
                height: 8px;
                background: #D8D8D8
            }
        }
    }
    .banner-img{
        width: 100%;
        height: 100%;
        border-radius: 4px;
    }
    .emoji-icon{
        width: 48px;
        height: 48px;
        padding: 12px;
        transform: scale(0.8);
        margin-left: 8px;
        margin-top:8px;
    }
    .margin{
        margin:  0 36px 34px 0 ;
    }
</style>