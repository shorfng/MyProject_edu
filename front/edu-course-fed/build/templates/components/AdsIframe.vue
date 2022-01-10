<template>
    <div class="scroll-box">
        <iframe
            id="adsIframe"
            :src="link"
        />
    </div>
</template>
<script>
export default {
  components: {
  },
  props: {
    link: {
      type: String,
      default: ''
    }
  },

  mounted() {
    this.link = decodeURIComponent(this.$route.query.link);
    console.log(this.link);
  }
};
</script>
<style lang="less" scoped>
.scroll-box {
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  iframe {
     width: 100%;
    height: 100%;
    border: none;
    position: absolute;
  }
}

</style>

