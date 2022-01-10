<template>
    <div>
        <router-view />
    </div>
</template>

<script>
import { isApp } from '@js/userAgent/getVersion';

export default {
  name: 'PagesView',
  data() {
    return {
      firstEnterRouteName: null
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.name && !from.name) {
        vm.firstEnterRouteName = to.name;
      }
    });
  },
  watch: {
    '$route'(route) {
      this.setNavigationBar(route.name);
    }
  },
  created() {
    let { name } = this.$route;
    this.setNavigationBar(name);
  },
  methods: {
    setNavigationBar(routeName) {
      let navOpt;
      switch (routeName) {
        case 'CoinPocketCard':
          document.title = '零钱提现';
          break;

        case 'CoinPocketList':
          document.title = '零钱明细';
          break;

      }
      this.navOpt = null;
    }
  }
};
</script>

<style lang="less">
</style>
