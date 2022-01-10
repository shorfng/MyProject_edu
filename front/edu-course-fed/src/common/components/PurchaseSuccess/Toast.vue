<template>
    <div
        v-if="show"
        class="toast"
    >
        <div class="toast-content">
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
            default: 50500
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
    }
    .toast-content {
        background: rgba(17, 17, 17, .7);
        border-radius: 5px;
        padding: 15px;
        color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        line-height: 30px;
        font-size: 30px;
        text-align: center;
    }
</style>
