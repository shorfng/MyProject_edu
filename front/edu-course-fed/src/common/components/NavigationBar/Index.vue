<template>
    <div>
        <div
            id="navigateBar"
            class="navigate-container"
            @click="clickNavigation"
        >
            <span
                v-if="navOpt.isShowBack"
                class="kw-icon-back back"
                @click="goBack"
            />
            <span class="single-line navigation-title">{{ navOpt.title }}</span>
            <div v-if="navOpt.rightOptions">
                <div v-if="navOpt.rightOptions.go">
                    <router-link :to="navOpt.rightOptions.go">
                        <img
                            v-if="navOpt.rightOptions.type === 'img'"
                            class="img"
                            :src="navOpt.rightOptions.src"
                        >
                        <div
                            v-else-if="navOpt.rightOptions.type === 'text'"
                            class="subtitle"
                            :style="navOpt.rightOptions.style"
                        >
                            {{ navOpt.rightOptions.text }}
                        </div>
                    </router-link>
                </div>
                <!-- 跳转外链配置href参数 -->
                <div
                    v-else-if="navOpt.rightOptions.href"
                    @click.stop="redirectToUrl(navOpt.rightOptions.href)"
                >
                    <img
                        v-if="navOpt.rightOptions.type === 'img'"
                        class="img"
                        :src="navOpt.rightOptions.src"
                    >
                    <div
                        v-else-if="navOpt.rightOptions.type === 'text'"
                        class="subtitle"
                        :style="navOpt.rightOptions.style"
                    >
                        {{ navOpt.rightOptions.text }}
                    </div>
                </div>
            </div>
        </div>
        <div class="navigation-black" />
    </div>
</template>

<script>
import { isLgApp, isEduApp } from '@js/userAgent/getVersion';
export default {
  props: {
    navOpt: {
      type: Object,
      default() {
        return {
          title: '拉勾网',
          isShowBack: true,
          rightOptions: {
            type: 'none'
          }
        };
      }
    }
  },
  data() {
    return {
      firstEnterRouteName: null
    };
  },
  watch: {
        '$route'(to, from) {
            if (to.name && !from.name) {
                this.firstEnterRouteName = to.name;
            }
        }
  },
  methods: {
    clickNavigation(e) {
      this.$emit('clickNavigation', e);
    },
    goBack() {
      if (this.$route && this.$route.name === this.firstEnterRouteName) {
        if (isEduApp()) {
          // 开悟关闭 h5
          window.location.href = 'lgedu://lgedu.com/h5/close';
        }
        else if (isLgApp()) {
          window.location.href = 'https://www.lagou.com/h5/close';
        }
        else {
          window.location.href = 'https://kaiwu.lagou.com';
        }

      }
      else {
        this.$router.go(-1);
      }
    },
    redirectToUrl(url) {
      window.location.href = url;
    }
  }
};

</script>

<style lang="less">
    @supports(-webkit-overflow-scrolling: touch) {
        #navigateBar , .subtitle{
            padding-top: 20PX;
        }
    }

    @supports(padding-top: constant(safe-area-inset-top)) or (padding-top: env(safe-area-inset-top)) {
        #navigateBar, .subtitle{
            padding-top: constant(safe-area-inset-top);
            padding-top: env(safe-area-inset-top);
        }
    }
</style>

<style lang="less" scoped>
  @media screen and (min-width: 750px) {
    .navigate-container {
      width: 750PX !important;
    }
  }
  .navigate-container {
    position: fixed;
    top: 0;
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 34px;
    color: #333333;
    background: white;
    z-index: 9;
    width: 100%;
  }
  .back {
    position: absolute;
    width: 80px;
    height: 80px;
    line-height: 80px;
    left: 10px;
    box-sizing: content-box;
    font-weight: bolder;
  }
  .navigation-title {
      max-width: 500px;
      display: inline-block;
  }
  .img {
    width: 42px;
    height: 42px;
    float: right;
    position: absolute;
    right: 27px;
    top: 19px;
  }
  .subtitle {
    position: absolute;
    right: 30px;
    top: 0;
    font-family: none;
    font-size: 30px;
    color: #666;
  }
  .navigation-black {
    height: 80px;
  }
  .single-line {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
  }

</style>
