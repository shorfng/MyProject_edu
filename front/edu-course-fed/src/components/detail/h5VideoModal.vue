<template>
    <div
        v-if="show"
        class="modal"
    >
        <img
            src="../../assets/public-class/share-close.png"
            alt=""
            class="close"
            @click="close"
        >
        <div class="content">
            <div class="title">
                {{ courseInfo.courseName }}
            </div>
            <CourseVideo />
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        CourseVideo: () => import('../common/VideoPlayer')
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    computed: {
        ...mapGetters(['courseInfo'])
    },
    methods: {
        close() {
            this.$emit('close');
        }
    }
};
</script>
<style lang="less" scoped>
    @import '~@less/modal.less';
    .modal {
        display: block;
        background: #161618;
        font-family: PingFangSC-Regular;
        font-size: 28px;
        color: #FFFFFF;
        z-index: 9;
    }
    .close {
        position: absolute;
        top: 64px;
        right: 56px;
        width: 40px;
        height: 40px;
    }
    .content {
        margin-top: 340px;
    }
    .title {
        padding-left: 40px;
        padding-bottom: 37px;
    }
</style>
