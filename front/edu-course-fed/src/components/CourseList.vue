<template>
    <div class="mobile-course-list">
        <p
            class="course-title"
        >
            专栏
            <!-- <a
                v-if="iceBreakingInfo.url"
                :href="`${iceBreakingInfo.url}?v=${linkVersion}`"
                class="ice-break"
            >
                <img
                    :src="iceBreakingInfo.imgUrl"
                    :alt="iceBreakingInfo.text"
                    class="ice-break-icon"
                >
            </a> -->
        </p>
        <seckill-list
            :list="seckillList"
            @contentTitleOffset="contentTitleOffset"
            @formatCourseName="formatCourseName"
            @goCourse="goCourse"
            @getCourseList="getCourseList"
        />
        <ul v-c="'course-ul'">
            <li
                v-for="item in list"
                :key="item.id"
                class="course-li"
                @click="goCourse($event, item)"
            >
                <img
                    :src="item.image"
                    class="teacher-portrait hover-pointer"
                    alt=""
                >
                <div class="content-main">
                    <div
                        class="content-title hover-pointer"
                        :style="contentTitleOffset(item.teacherDTO)"
                    >
                        <div class="p-title">
                            <span class="p-title-dec">{{ formatCourseName(item.title ) }}</span>
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
                            <span
                                v-if="item.tag"
                                class="activity-name"
                            >
                                {{ item.tag }}
                            </span>
                            <span class="content-price-orange">{{ item.price }}</span>
                            <s
                                v-if="item.originalPrice"
                                class="content-price-grey-sm"
                            >{{ handlerbigNum(item.originalPrice) }}</s>
                            <span
                                v-if="item.pruchasedCount"
                                class="p-title-buy"
                            >
                                {{ item.pruchasedCount }}
                            </span>
                        </div>
                        <p class="content-detail-gold">
                            {{ item.hasBuy? '学习' : '试看' }}
                        </p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import LgPay from '../common/modules/lg-pay';
import SeckillList from './SeckillList.vue';
import { getParam } from '@js/util/getParam';
import store from '../store';
import jsonp from 'jsonp';
import  { fetchIceBreakingLocation, fetchGetCourseList } from '../service';
import { triggerLoginPop, switchNeedToTriggerBuy } from '@js/pcLoginAutoBuy';
const lgPay = new LgPay();
import { getRandom } from '@js/util/util';
export default {
    name: 'CourseList',
    components: {
        SeckillList,
    },
    data() {
        return {
            list: [], // 全部课程列表
            seckillList: [], // 秒杀列表
            iceBreakingInfo: {},
            linkVersion: getRandom(6)
        };
    },
    created() {
        fetchIceBreakingLocation().then(res => {
            const { state, content } = res.data;
            if (state && state === 1) {
                this.iceBreakingInfo = content || {};
            }
        });
    },
    mounted() {
        this.switchNeedAutoPay();
        this.getCourseList();
    },
    methods: {
        // 课程元价格大数字转万
        handlerbigNum(num) {
            let price = num.slice(1);
            return Number(price) > 10000 ? `￥${Number(price) / 10000}w` : num;
        },
        //获取课程列表
        async getCourseList() {
            let seckillList = [];
            let res = await fetchGetCourseList();
            if (res.data.state === 1 && res.data.content && res.data.content.courseCardList && res.data.content.courseCardList[0]) {
                let resList = res.data.content.courseCardList[0].courseList || [];
                seckillList = resList.filter(item => (item.promotionType === 1 && !item.hasBuy));
                this.list = resList.filter(item => (item.hasBuy || item.promotionType !== 1));
                this.seckillList = seckillList;
            }
        },
        formatCourseName(name) {
            return name && name.replace(/\《([^》《]*)\》/img, '$1');
        },
        goCourse(e, course) {
            if (this.isPc) {
                //跳转到指定课程页的dom节点
                const courseNodeNameList = ['teacher-portrait', 'content-title'];
                //跳转到指定课程页指定章节的dom节点
                const designatedChaptersNodeNameList = ['content-course-lesson'];
                let node  = e.target;
                if (node.className.indexOf('disabled-word') > -1) return false;
                while (node.className !== 'course-li') {
                    if (this.isContainDom(courseNodeNameList, node.className)) {
                        location.href = `#/content?courseId=${course.id}`;
                        break;
                    }
                    if (this.isContainDom(designatedChaptersNodeNameList, node.className)) {
                        location.href = `#/content?courseId=${course.id}&id=${node.value}`;
                        break;
                    }
                    node = node.parentNode;
                }

            } else {
                location.href = `#/content?courseId=${course.id}`;
            }
        },

        isContainDom(arr, e) {
            return arr.some((item) => {
                return e.indexOf(item) > -1;
            });
        },
        switchNeedAutoPay() {
            let payData = switchNeedToTriggerBuy() || false;
            let id = payData && payData.id;
            let courseList = window.courseList;
            let isBuy = courseList.some(item => {
                return item.id === id && item.isBuy;
            });
            if (payData && !isBuy) {
                this.buy(false, payData);
            }
        },
        buy(e, item) {
            e && e.stopPropagation();
            // 没有登录 跳去登录
            if (!store.state.loginUser.id) {
                // window.open('/frontLogin.do', '_self');
                triggerLoginPop(item);
                return;
            }
            let { price, sellGoodsPriceId, id } = item;
            lgPay.submitV2({
                goodsId: id,
                expandInfo: window.location.href
            }).then((res) => {
                if (res.source === lgPay.PAY_TYPE.pc) {
                    this.list.forEach((t) => {
                        if (t.id === id) {
                            item.isBuy = true;
                            location.href = `#/content?courseId=${id}`;
                        }
                    });

                }
            }).catch(err => {
                let repeatOrder = 70002;
                let priceChange = 60205;
                let { status, data } = err;
                if (status === repeatOrder) {
                    this.showToast('该课程已付款，快开始学习吧');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
                else if (status === priceChange) {
                    this.showToast('课程价格发生变化');
                    item.lgCoinPrice = `${data.discounts}`;
                    this.buy(item);
                }
            });

        },
        goClass(item) {
            location.href = `#/content?courseId=${item.id}`;
        },
        contentTitleOffset(data) {
            if (this.isPc) {
                return {
                    'height': (data && data.length) > 1 ? '115px' : '105px'
                };
            }

        },
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
    .mobile-course-list {
        background-color: #F8F9FA;
        overflow: auto;
        -webkit-overflow-scrolling:touch;
    }
    .course-title{
        overflow: hidden;
        font-size:36px;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:50px;
        padding: 0 30px;
        margin-bottom: 28px;
        padding-top: 10px;
    }
    .course-ads {
        margin-bottom: 30PX;
        cursor: pointer;
        width: 840PX;
        img {
            width: 100%
        }
    }
    .ice-break{
        float: right;
        &-icon{
            height: 50px;
        }
    }
    .course-ul{
        padding: 0 30px;
        .course-li{
            overflow: hidden;
            padding: 30px 30px;
            background-color: #fff;
            &:last-child{
                border-bottom: 0;
            }
            &:first-child{
                margin-top: -7px;
                border-radius:4px 4px 0px 0px;
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
                    margin-left: 20px;
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
                margin-top: 20px;
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
                .content-detail-gold{
                    .font(24px);
                    position: relative;
                    display: inline-block;
                    font-weight:500;
                    color:#333;
                    line-height:33px;
                    padding-right: 20px;
                    &::after{
                        display: block;
                        content: '';
                        width: 20px;
                        height: 20px;
                        background: url('~@/assets/course-list/right.png') no-repeat;
                        background-size: contain;
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
                .activity-name {
                    .font(20px);
                    display: inline-block;
                    max-width: 100px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
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
