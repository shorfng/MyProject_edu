<template>
    <div >
        <PcHeader></PcHeader>
        <navigation
            class='common-nav-wrap'
            :course-name="secName"
        />
    </div>
</template>

<script>
import PcHeader from '../../common/components/Header/index';
import Navigation from '../contents/Navigation';

export default {
    name: 'CommonHeader',
    components: {
        PcHeader,
        Navigation
    },
    props:{
        secName:{
            type: String,
            default: ''
        }
    },
    data() {
        return {

        };
    },
    computed: {
    },
    mounted() {
    },
    methods: {

    }
};
</script>

<style lang="less" scoped>
.common-nav-wrap{
    /deep/ .nav-p-pc{
        width: 750PX;
    }
}

</style>
