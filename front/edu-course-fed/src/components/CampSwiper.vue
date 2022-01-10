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
                    :href="item.href"
                    target="_blank"
                    class="swiper-slide-camp"
                >
                    <img
                        class="banner-img hover-pointer"
                        :src="item.image"
                        :style="swiperOption.imgStyle"
                        :alt="item.subsite"
                    >
                    <!-- <p class="training-des">{{ item.brief }}</p> -->
                </a>
            </div>
            <div
                class="check-more"
                @click="linkList"
            >
                {{ showMore ? '松开查看' : '查看更多' }}
            </div>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.css';

export default {
  name: 'CampSwiper',
  props: {
    swiperOption: {
      type: Object,
      default() {
        return {
          wrapperClass: {},
          paginationClass: {},
          assetsList: [],
          imgStyle: {},
          slideStyle: {},
        };
      },
    },
    isSetSwipper: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      startEnd: false, // 开始滑动时是否是最后一张
      showMore: false, // 松开查看更多查看
      lagouSwiper: null,
    };
  },
  watch: {
    'swiperOption.assetsList': {
      handler: function(val) {
        this.$nextTick(() => {
          this.setSwipper();
        });
      },
      immediate: true,
    },
    isSetSwipper(val, oldVal) {
      if (val !== oldVal) {
        this.$nextTick(() => {
          this.setSwipper();
        });
      }
    },
  },
  deactivated() {
    this.lagouSwiper.slideTo(0);
  },
  methods: {
    // 初始化轮播
    setSwipper() {
      let _this = this;

      const lagouSwiper = new Swiper(this.$el, {
        direction: 'horizontal',
        loop: false,
        speed: 500,
        // freeMode: true,
        centeredSlides: true,
        slidesPerView: 1.2,
        spaceBetween: 10,
        slidesOffsetBefore: -30,
        resistanceRatio: 0.6,
        onTouchStart: function(swiper, event) {
          _this.startEnd = swiper.isEnd;
        },
        onTouchMove: function(swiper, event) {
          if (_this.startEnd && swiper.isEnd) {
            _this.showMore = swiper.isEnd;
          } else {
            _this.showMore = false;
          }
        },
        onTouchEnd: function(swiper, event) {
          if (_this.startEnd && swiper.isEnd && _this.showMore) {
            _this.$router.push('/campList');
          }
        },
      });
      this.lagouSwiper = lagouSwiper;
      return lagouSwiper;
    },
    // 跳转列表页
    linkList() {
        this.$router.push('/campList');
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@less/common';
.swiper-container {
  width: 100%;
  height: 140px;
  // margin: 20px auto 0;
}
.banner-img {
  width: 103%;
  // height: 140px;
  object-fit: cover;
  border-radius: 4px;

}

// /deep/.swiper-slide {
//     width: 80%!important;
// }
.swiper-slide-camp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.check-more {
  font-size: 20px;
  height: 220px;
  display: flex;
  align-items: center;
  padding: 0 100px 0 25px;
  // padding-right: 100px;
  background: #f8f9fa;
  color: #999;
  margin-left: 25px;
  border-radius: 4px 0px 0px 4px;
}
.training-des {
  padding: 40px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 33px;
  text-shadow: 0px 10px 28px rgba(0, 0, 0, 0.04);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 10px 28px 0px rgba(0, 0, 0, 0.04);
  border-radius: 0px 0px 4px 4px;
  border: 1px solid rgba(239, 239, 239, 1);
  border-top: none;
}
</style>
