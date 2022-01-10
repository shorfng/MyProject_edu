<template>
    <div
        v-if="show"
        class="toast"
    >
        <div v-c="'toast-content'">
            {{ msg }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Toast',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        msg: {
            type: String,
            default: ''
        },
        duration: {
            type: Number,
            default: 1500
        }
    },
    watch: {
        show(value) {
            if (value) {
                setTimeout(() => {
                    this.$emit('onHide');
                }, this.duration);
            }
        }
    }
};
</script>

<style scoped lang="less">
    .toast {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 9999;
    }
    .toast-content {
        background: rgba(0,0,0, .7);
        border-radius: 5px;
        padding: 23px 40px;
        color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 30px;
        font-size: 30px;
        text-align: center;
        &-pc{
            background:rgba(0,0,0,0.7);
            border-radius: 5px;
            padding: 11Px 10Px;
            color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            word-break: keep-all;
            font-size: 14Px;
            font-weight: normal;
            line-height: 21Px;
        }

    }
</style>