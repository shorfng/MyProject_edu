<template>
    <div>
        <div class="gray-btn-container">
            <button
                class="btn"
                @click="gotoPurchaseClass"
            >
                {{ price }}元立抢
            </button>
        </div>
        <div
            v-if="remainTime"
            class="time-container"
        >
            <img
                class="icon-clock"
                src="../../assets/course/sale/icon-clock@2x.png"
                alt=""
            >
            <div>
                优惠倒计时
            </div>
            <div class="remain-time">
                {{ remainTime }}.{{ ms }}
            </div>
        </div>
    </div>
</template>
<script>
import { formatRemainTime } from '@js/util/formatTime';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            remainTime: '',
            timer: null,
            ms: '',
            msTimer: null,
            seckillRemainSeconds: '',
        };
    },
    computed: {
        ...mapGetters([
            'courseInfo'
        ]),
        price() {
            let { discounts, price } = this.courseInfo;
            if (discounts === '0' || discounts === 0) {
                return discounts;
            }
            return discounts || price;
        }
    },
    mounted() {
        let time = this.courseInfo.seckillRemainSeconds || 0;
        this.seckillRemainSeconds = time * 1000;
        this.triggerTimer();
        this.computedMS();
    },
    beforeDestroy() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        clearInterval(this.msTimer);
    },
    methods: {
        triggerTimer() {
            let endTime = this.seckillRemainSeconds;
            let remainTime = formatRemainTime(endTime, false);
            if (remainTime) {
                this.seckillRemainSeconds -= 1000;
                this.remainTime = remainTime;
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    this.triggerTimer();
                }, 1000);
            }
            else {
                this.$emit('hideBtn');
            }
        },
        computedMS() {
            this.msTimer = setInterval(() => {
                if (this.ms) {
                    this.ms--;
                }
                else {
                    this.ms = 9;
                }
            }, 100);
        },
        gotoPurchaseClass() {
            this.$emit('gotoPurchaseClass');
        }
    }
};

</script>
<style lang="less" scoped>
    @import '~@/common/css/animation.less';
    .gray-btn-container{
        display: flex;
        border-radius: 45px;
        background: #fff;
        position: relative;
        .btn {
            width: 100%;
            height:88px;
            line-height: 88px;
            background:rgba(255,116,82,1);
            border-radius:45px;
            font-size:32px;
            font-weight:500;
            border: unset;
            color:rgba(255,255,255,1);
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            outline: none;
            animation: scaleAnimate 0.7s infinite linear;
            text-align: center;
        }
    }
    .time-container {
        position: absolute;
        left: 0;
        right: 0;
        top: -60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 500;
        background: #FFF8E2;
        color: #E5A817;
        .icon-clock {
            width: 26px;
            height: 26px;
            margin-right: 3px;
        }
        .remain-time {
            width: 136px;
            margin-left: 4px;
        }
    }
</style>
