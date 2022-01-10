<template>
    <section class="container">
        <h1>Hello {{ myName }}!</h1>
    </section>
</template>

<script>

export default {
  name: 'About',
  components: {
  },
  data() {
    return {
      myName: 'about'
    };
  },
  mounted() {

  },
  methods: {
  }
};
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  width: 10rem;
  height: 100%;
  background-color: #f7f7f7;

  h1 {
    text-align: center;
  }
}
</style>
