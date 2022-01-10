<template>
    <lagou-swiper :swiper-option="swiperOption" />
</template>

<script>
import LagouSwiper from './LagouSwiper';
export default {
    name: 'CourseSwiper',
    components: { LagouSwiper },
    props: {
        topAds: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            swiperOption: {
                assetsList: []
            }
        };
    },
    watch: {
        topAds: function(newVal) {
            this.swiperOption.assetsList = newVal.map((item) => {
                item.imgurl = item.img;
                item.link = item.link;
                return item;
            });
        }
    }
};
</script>

<style scoped>

</style>
