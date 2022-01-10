<template>
    <div
        v-if="list.length"
        class="seckill-list"
    >
        <ul
            class="course-ul"
        >
            <li
                v-for="(item, index) in list"
                :key="index"
                class="course-li"
                @click="goCourse($event, item)"
            >
                <div class="seckill-head">
                    <img
                        src="~@/assets/course-list/home_bg_xianshimiaosha@2x.png"
                        alt="限时秒杀"
                    >
                    <div class="seckill-head-time">
                        <div>距结束</div>
                        <div class="seckill-head-countDown">
                            <span>{{ item.leftHours || '--' }}</span> :
                            <span>{{ item.leftMinutes || '--' }}</span> :
                            <span>{{ item.leftSeconds || '--' }}</span>
                        </div>
                    </div>
                </div>
                <img
                    :src="item.image"
                    class="teacher-portrait hover-pointer"
                    alt=""
                >
                <div
                    class="content-main"
                >
                    <div
                        class="content-title hover-pointer"
                        :style="contentTitleOffset(item.teacherDTO)"
                    >
                        <div class="p-title">
                            <span class="p-title-dec">{{ item.title }}</span>
                        </div>
                        <p class="p-describe">
                            {{ item.brief }}
                        </p>
                        <p
                            v-if="item.teacherName"
                            class="p-author"
                        >
                            <span class="p-author-span">{{ item.teacherName }}</span>
                            <span
                                v-if="item.teacherTitle"
                                class="p-author-line"
                            />
                            <span class="p-author-span">{{ item.teacherTitle }}</span>
                        </p>
                    </div>
                    <div
                        class="content-price"
                    >
                        <div
                            v-if="item.hasBuy"
                            class="content-price-p"
                        >
                            <span class="content-price-grey-sm">已购买</span>
                        </div>
                        <div
                            v-if="!item.hasBuy"
                            class="content-price-p"
                        >
                            <span class="content-price-orange">{{ item.price }}</span>
                            <s
                                v-if="item.originalPrice"
                                class="content-price-grey-sm"
                            >￥{{ item.originalPrice }}</s>
                            <span
                                v-if="item.pruchasedCount"
                                class="p-title-buy"
                            >
                                {{ item.pruchasedCount }}
                            </span>
                        </div>
                        <button
                            class="content-buy-button"
                            @click.stop="goCourse($event, item)"
                        >
                            <img
                                src="~@/assets/course-list/home_ic_shandian@2x.png"
                                alt=""
                            >
                            <span>立即抢</span>
                        </button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'SeckillList',
    props: {
        // 秒杀列表
        list: {
            type: Array,
            default: () => {}
        }
    },
    data() {
        return {
            timer: [], // 倒计时计时器
        };
    },
    watch: {
        'list.length': {
            handler() {
                this.timer = [];

                this.list.forEach((item, index) => {
                    this.timer[index] = setInterval(() => {
                        item.remainSeconds--;
                        if (item.remainSeconds <= 0) {
                            clearInterval(this.timer[index]);
                            this.$emit('getCourseList');
                        }
                        this.setCountdown(item.remainSeconds, index);
                    }, 1000);
                });


            },
            immediate: true
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        contentTitleOffset(data) {
            this.$emit('contentTitleOffset', data);
        },
        formatCourseName(name) {
            this.$emit('formatCourseName', name);
        },
        // 数字补0方法
        padStart(num) {
            if (Number(num) >= 10) {
                return num;
            } else {
                return `0${num}`;
            }
        },
        // 倒计时计算方法
        setCountdown(sec, index) {
            let allLeft = sec || 0;
            if (!this.list[index]) return false;
            this.list[index].leftHours = Math.floor(allLeft / 60 / 60);
            this.list[index].leftMinutes = Math.floor(allLeft / 60 % 60);
            this.list[index].leftSeconds = Math.floor(allLeft % 60);
            this.list[index].leftHours = this.padStart(this.list[index].leftHours);
            this.list[index].leftMinutes = this.padStart(this.list[index].leftMinutes);
            this.list[index].leftSeconds = this.padStart(this.list[index].leftSeconds);
            this.$set(this.list, index, this.list[index]);
        },
        // 跳转到课程详情页
        goCourse(e, item) {
            this.$emit('goCourse', e, item);
        }
    }
};
</script>

<style lang="less" scoped>
    @import '~@less/common.less';
    p {
        margin-top: 0;
    }
    .btn(@a, @b){
        background-color: @a;
        color: @b;
        border: 1px solid @a;
    }
    .course-ul{
        padding: 0 30px;
        .seckill-head {
            width: 100%;
            height: 108px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 24px;
            color: #999;

            img {
                height: 36px;
            }

            &-time {
                & > div {
                    display: inline-block;
                }
            }
            &-countDown {
                margin-left: 12px;

                span {
                    display: inline-block;
                    text-align: center;
                    min-width: 48px;
                    height: 30px;
                    background-color: #FF7452;
                    color: #fff;
                    padding: 0 5px;
                    box-sizing: border-box;
                    line-height: 30px;
                    border-radius: 3px;
                }
            }
        }
        .course-li{
            overflow: hidden;
            padding:0 30px 30px 30px;
            background: url('~@/assets/course-list/home_ic_card_bg1@3x .png') left top/140px no-repeat,
                                url('~@/assets/course-list/home_ic_card_bg1@2x.png') right center/60px no-repeat;
            background-color: #fff;
            border:1px solid rgba(239,239,239,1);
            border-radius: 4px;
            margin-bottom: 20px;
            &:last-child{
                // border-bottom: 0;
            }
            &:first-child{
                margin-top: 30px;
            }
        }
        .teacher-portrait{
            width: 150px;
            height: 200px;
            border-radius: 4px;
            .fl;
        }
        .content-main{
            line-height: 1.4;
            margin-left: 174px;
            position: relative;
            .p-title {
                .font(32px);
                color: #333;
                line-height: 48px;
                font-weight: 500;
                /*float: left;*/
                /*overflow: hidden;*/
                line-height:45px;
                .p-title-dec {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                }
                &-buy{
                    .font(20px);
                    color: #999;
                    display: inline-block;
                    margin-left: 30px;
                    font-weight: normal;
                }
            }
            .p-describe{
                .font(24px);
                line-height: 33px;
                color: #666;
                margin-top: 14px;
                display:-webkit-box;
                -webkit-box-orient:vertical;
                -webkit-line-clamp:1;
                overflow:hidden;
                font-size:24px;
            }
            .p-author{
                .font(20px);
                font-size:20px;
                color:rgba(153,153,153,1);
                line-height:28px;
                margin-top: 12px;
                position: relative;
                overflow:hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                &+p{
                    margin-top: 10px;
                }
                &-span{
                    background:rgba(248,249,250,1);
                    padding: 6px 10px;
                    border-radius: 2px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: 2
                }
                &-span:not(:first-child){
                    margin-left: 10px;
                }
            }
            .content-price{
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                // margin-top: 20px;
                &-p{
                    font-size: 0;
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: flex-end;
                }
                &-orange{
                    color: rgba(255,116,82,1);
                    .font(32px);
                    font-weight:bold;
                    line-height: 33px;
                    &-sm{
                        color:rgba(255,116,82,1);
                        font-weight: 600;
                        line-height:30px;
                        .font(24px);
                    }
                }
                &-grey{
                    color: #999;
                    .font(24px);
                    margin-left: 5px;
                    &-sm{
                        color:rgba(153,153,153,1);
                        line-height:28px;
                        margin-left: 4px;
                        .font(20px);
                    }
                }
                &-buyed{
                    color: #999;
                    .font(24px);
                }
                .content-buy-button {
                    width: 135px;
                    display: flex;
                    font-size: 13px;
                    font-weight: 500;
                    align-items: center;
                    color: #383D50;
                    font-size: 24px;
                    padding: 10px;
                    border-radius: 3px;
                    outline: none;
                    border: none;
                    background:linear-gradient(90deg,rgba(253,228,124,1) 0%,rgba(251,197,70,1) 100%);
                    box-sizing: border-box;

                    img {
                        width: 24px;
                        margin-right: 5px;
                        margin-left: 5px;
                    }
                }
                .activity-name {
                    .font(20px);
                    display: inline-block;
                    font-weight:500;
                    color:rgba(255,116,82,1);
                    border-radius:4px;
                    line-height:28px;
                    padding: 2px 8px;
                    margin-right: 10px;
                    border-radius: 2px;
                    // transform: translate(8px, -7px);
                    border: 1px solid rgba(255,116,82,0.5);
                }
            }
        }
    }
</style>
