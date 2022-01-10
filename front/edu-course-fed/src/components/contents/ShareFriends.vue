<template>
    <div
        v-show="shareBoxStatus"
        class="share-box-wrapper"
    >
        <div class="share-box-shadow" />
        <div class="share-box">
            <i
                class="icon-close"
                @click="close"
            />
            <img
                class="share-box-content"
                :src="shareImgUrl"
            >
            <div
                class="btn-green"
                @click="shareFriends"
            >
                <p>
                    <span>收藏本课知识点</span>
                    <i class="icon-share" />
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShareFriends',
    components: {},
    props: {
        shareBoxStatus: {
            type: Boolean,
            default: false
        },
        shareImgUrl: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        };
    },
    mounted() {},
    methods: {
        close() {
            this.$emit('closeShareDialog');
        },
        shareFriends() {
            this.close();
            this.$emit('confirmShare');
        }
    }
};
</script>

<style lang="less" scoped>
.share-box-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    .share-box{
        width: 600px;
        height: 1068px;
        margin: auto;
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        &-content{
            width: inherit;
            height: 970px;
            display: block;
        }
        .btn-green{
            height: 98px;
            text-align: center;
            background: #03be8b;
            color: white;
            font-size: 32px;
            line-height: 98px;
            cursor: pointer;
        }
        &-shadow{
            background: rgba(0,0,0,.5);
            width: inherit;
            height: inherit;
            position: absolute;
        }
        .icon-share{
            width: 52px;
            height: 52px;
            background: url("../../assets/public-class/icon-share.png") ;
            background-size: contain;
            background-position-y: -4px;
            display: inline-block;
            vertical-align: middle;
        }
        .icon-close{
            width: 58px;
            height: 58px;
            background: url("../../assets/public-class/icon-close.png") no-repeat;
            background-size: contain;
            display: inline-block;
            position: absolute;
            top: 12px;
            right: 12px;
            cursor: pointer;
        }
    }
}
</style>
