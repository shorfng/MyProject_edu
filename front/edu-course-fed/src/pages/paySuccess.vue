<template>
    <div class="pay-success-wrap">
        <div class="icon" />
        <div class="text">
            支付成功
        </div>
        <div
            class="button"
            @click="goApp"
        >
            前往拉勾教育学习
        </div>
    </div>
</template>

<script>
const CURRENT_PAGE_REPORT_ID = '1pex';
export default {
    components: {
    },
    data() {
        return {
        };
    },
    computed: {
    },
    created() {
    },
    mounted() {
      this.twoPlatTrack(CURRENT_PAGE_REPORT_ID, {});
    },
    methods: {
      goApp() {
        this.twoPlatTrack(CURRENT_PAGE_REPORT_ID, {
           content_id: '1pey',
        });
        window.location.href = 'https://shenceyun.lagou.com/r/9a';
      }
    }
};
</script>

<style lang="less" scoped>
.pay-success-wrap{
  padding-top: 176px;
}
.icon{
  width: 130px;
  height: 130px;
  background: url('../assets/h5-login-modal/success.png') no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
}
.text{
  font-size:28px;
  color:rgba(51,51,51,1);
  margin-top: 25px;
  text-align: center;
}
.button{
  width:480px;
  height:88px;
  background:rgba(251,197,70,1);
  border-radius:22px;
  font-size:32px;
  color:rgba(51,51,51,1);
  line-height:88px;
  text-align: center;
  margin: 80px auto 0;
}
</style>
