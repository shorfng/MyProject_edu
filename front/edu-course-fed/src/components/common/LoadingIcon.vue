<template>
    <div class="loading-icon">
        <img
            class="icon"
            src="../../assets/public-class/loading.gif"
        >
    </div>
</template>

<script>

export default {
    name: 'LoadingIcon',
    components: {
    },
    props: {
    },
    data() {
        return {
        };
    },
    computed: {
    },
    watch: {
    },
    methods: {
    }
};
</script>

<style scoped lang="less">
.loading-icon{
    width: 12px;
    height: 12px;
    .icon{
      display: block;
      width: 100%;
      height: 100%;
    }
}
</style>
