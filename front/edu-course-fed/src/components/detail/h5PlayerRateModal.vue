<template>
    <div
        v-if="show"
        class="container"
        @click="closeModal"
    >
        <div class="content">
            <div class="sections">
                <div
                    v-for="(item, index) in rates"
                    :key="index"
                    class="section-item scale-1px"
                    :class="{'section-item-key': playerRate === item}"
                    @click="switchRate(item)"
                >
                    {{ item === 1 ? '正常' : item }}倍速
                    <img
                        v-if="playerRate === item"
                        class="selected-icon"
                        src="../../assets/public-class/player-speed-selected.png"
                        alt=""
                    >
                </div>
            </div>
            <button class="close-btn scale-1px">
                关闭
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'H5PlayerSpeedModal',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            rates: [0.7, 1, 1.25, 1.5, 2]
        };
    },
    computed: {
        ...mapGetters([
            'playerStatus',
            'playerRate'
        ])
    },
    methods: {
        ...mapActions(['setRate']),
        switchRate(rate) {
            this.setRate(rate);
            this.twoPlatTrack('1nd2', {
                address_id: '1niw',
                content_id: this.playerStatus.id || '',
                speed_type: rate
            });
        },
        closeModal() {
            this.$emit('closeSectionsModal');
        }
    }
};
</script>

<style scoped lang="less">
    .container {
        background: rgba(0, 0, 0, 0.50);
        font-family: PingFangSC-Regular;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: left;
        z-index: 5;
    }
    .content {
        -webkit-border-radius: 8px 8px 0 0;
        -moz-border-radius: 8px 8px 0 0;
        border-radius: 8px 8px 0 0;
        background: #ffffff;
        padding-left: 40px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .sections {
        padding-top: 10px;
        padding-bottom: 100px;
    }
    .section-item {
        height: 100px;
        line-height: 100px;
        font-size: 28px;
        color: #666666;
        position: relative;
        &:first-of-type {
            &:after {
                border: none;
            }
        }
        &:after {
            border: none;
            border-top: 1px solid #E8E9EB;
        }
    }
    .section-item-key {
        color: #00b38a;
    }
    .selected-icon {
        width: 34px;
        height: 24px;
        position: absolute;
        right: 36px;
        top: 40px;
    }
    .close-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100px;
        line-height: 100px;
        font-size: 32px;
        color: #666666;
        text-align: center;
        width: 100%;
        background: white;
        border: none;
        &:after {
            border: none;
            border-top: 1px solid #E8E9EB;
        }
    }
</style>
