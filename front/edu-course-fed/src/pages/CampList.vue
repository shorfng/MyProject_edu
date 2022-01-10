<template>
    <div class="camp-list">
        <!-- <div class="header">
            <img
                src="~@/assets/course-list/back-arrow.png"
                alt="返回"
                @click="goBack()"
            >
            训练营
        </div> -->
        <div class="camp-list-body">
            <template
                v-for="item in trainingCard"
            >
                <a
                    :key="item.id"
                    class="training-wrap"
                    :href="item.href"
                >
                    <img
                        class="training-img"
                        :src="item.image"
                        :alt="item.title"
                    >
                    <!-- <p class="training-des">{{ item.brief }}</p> -->
                </a>
            </template>
        </div>
    </div>
</template>

<script>
import { fetchGetContentList } from '../service';

export default {
  name: 'CampList',
  data() {
    return {
      trainingCard: window.campList || [],
    };
  },
  mounted() {
    if (!window.campList) {
      this.getCampList();
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取训练营列表
    async getCampList() {
      let res = await fetchGetContentList();
      if (
        res.data.state === 1 &&
        res.data.content &&
        res.data.content.contentCardList
      ) {
        let resObj = res.data.content.contentCardList[0] || {};
        window.campList = resObj.bigCourseList || [];
        this.trainingCard = window.campList;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import '~@less/common.less';
.camp-list {
  display: flex;
  flex-direction: column;
  position: absolute;
  left:0;
  right: 0;
  top: 0;
  bottom: 0;
  -webkit-overflow-scrolling:touch;
  .header {
    text-align: center;
    font-size: 36px;
    padding: 20px 30px;
    flex-shrink: 0;
    position: relative;
    box-shadow: 0 2px 3px 0 rgba(100,100,100,0.15);

    img {
      height: 40px;
      position: absolute;
      left: 30px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  &-body {
    flex: 1;
    overflow: auto;
  }
  .training-wrap {
    display: block;
    margin: 30px 30px 0;
  }
  .camp-list-body {
      padding-bottom: 80px;
  }
  .training-img {
    width: 100%;
    border-radius: 4px;
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
}
</style>
