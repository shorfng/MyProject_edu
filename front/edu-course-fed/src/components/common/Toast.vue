<template>
    <div
        v-if="show"
        class="toast"
        @click="clickModal"
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
            default: 1500
        }
    },
    data() {
        return {
            clearInterval: null
        };
    },
    watch: {
        show(value) {
            if (value) {
                this.clearInterval = setTimeout(() => {
                    this.$emit('onHide');
                }, this.duration);
            }
        }
    },
    methods: {
        clickModal(e) {
            e.stopPropagation();
            this.$emit('onHide');
            if (this.clearInterval) {
                clearTimeout(this.clearInterval);
                this.clearInterval = null;
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
        background:rgba(0,0,0,0.7);
        border-radius: 5px;
        padding: 22px 30px;
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
        word-break: keep-all;
    }
</style>