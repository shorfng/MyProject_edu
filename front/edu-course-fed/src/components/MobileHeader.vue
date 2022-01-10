<template>
    <div class="mobile-header">
        <lagou-swiper
            v-show="swiperOption.assetsList.length"
            class="swiper-container"
            :swiper-option="swiperOption"
            :is-set-swipper="isSetSwipper"
        />
        <mobile-operation :operations="operations" />
    </div>
</template>

<script>
import LagouSwiper from './LagouSwiper';
import { fetchGetPromotionList } from '../service';
import MobileOperation from './MobileOperation';
export default {
  name: 'MobileHeader',
  components: {
    MobileOperation,
    LagouSwiper,
  },
  data() {
    return {
      swiperOption: {
        assetsList: [],
        wrapperClass: {
          'margin-top': 0,
          height: '124px',
          width: '100%',
        },
        paginationClass: {
          // bottom: '-3px',
          // zIndex: -1,
          lineHeight: 0,
          paddingBottom: '10px',
        },
        imgStyle: {
          height: '110px',
          // borderRadius: '12px'
        },
        slideStyle: {
          padding: '0 15px',
          boxSizing: 'border-box',
        },
      },
      isSetSwipper: false,
      operations: [], // 活动运营位列表
    };
  },
  created() {
    this.getPromotionList();
  },
  methods: {
    // 获取banner列表和运营活动位列表
    async getPromotionList() {
      let res = await fetchGetPromotionList();
      if (
        res.data.state === 1 &&
        res.data.content &&
        res.data.content.promotionCardList &&
        res.data.content.promotionCardList[0]
      ) {
        let bannerList = []; // banner列表
        let activityList = [];
        let resArr = res.data.content.promotionCardList;
        resArr.forEach(item => {
            item.bannerList && bannerList.push(...item.bannerList);
            item.activityList && activityList.push(...item.activityList);
        });
        this.swiperOption.assetsList = this.machingList(bannerList);
        this.operations = this.machingList(activityList);
      }
    },
    // 跳转链接解码
    decodeUrl(url) {
      let formatUrl = 'https://kaiwu.lagou.com';
      try {
        let centerLoginReg = /^https:\/\/www\.lagou\.com\/center\/login\?forward=(.*)/g;
        let execArr = centerLoginReg.exec(url);
        if (execArr && execArr[1]) {
          formatUrl = decodeURIComponent(execArr[1]);
        } else {
          formatUrl = url;
        }
      } catch (e) {}

      return formatUrl;
    },
    // 处理列表链接
    machingList(list) {
      if (!list) return [];
      let arr = list.map((item) => {
        item.imgurl = item.image;
        item.link = this.decodeUrl(item.href);
        return item;
      });
      return arr;
    },
  },
};
</script>

<style lang="less" scoped>
@import '~@less/common.less';
.banner {
  width: 100%;
}
/deep/.banner-img {
  border-radius: 4px;
}
/deep/.swiper-container-horizontal > .swiper-pagination-bullets {
  .swiper-pagination-bullet {
    margin: 0 2px;
  }
}
/deep/.swiper-container {
  .swiper-pagination-bullet {
    background: #fff;
  }
  .swiper-pagination-bullet-active {
    background: #fff;
  }
}
.mobile-header {
  min-height: 290px;
  overflow: hidden;
  padding: 50px 0;
}
.swiper-container {
  border-radius: 4px;
}
</style>
