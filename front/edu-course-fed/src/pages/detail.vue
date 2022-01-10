<template>
    <router-view />
</template>

<script>
import { TCPLAYER } from '../common/components/Player/constants';
import { isIE } from '../common/js/util/util';

export default {
    name: 'About',
    data() {
        return {
            myName: 'about'
        };
    },
    computed: {
    },
    mounted() {
        this.saLogin();
    },
    methods: {
    }
};
</script>

<style scoped lang="less">

</style>
