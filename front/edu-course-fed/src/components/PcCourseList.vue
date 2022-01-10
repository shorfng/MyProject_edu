<template>
    <div>
        <div
                class="course-ads"
                @click="linkToCourse(recommendCourse.href)"
        >
            <img
                v-if="recommendCourse.canShow && isPc"
                :src="recommendCourse.image"
            >
        </div>
        <div :class="isPc ? 'course-ul-container' : ''">
            <div class="tab-container">
                <tab
                        class="course-tab"
                        custom-bar-width="40px"
                        :line-width="2"
                        bar-active-color="#00B38A"
                >
                    <tab-item
                            :selected="classSelect==='allLesson'"
                            @on-item-click="changeCourseTab('allLesson')"
                    >
                        选课{{ classSelect }}
                    </tab-item>
                    <tab-item
                            :selected="classSelect==='hasPay'"
                            @on-item-click="changeCourseTab('hasPay')"
                    >
                        已购{{ classSelect }}
                    </tab-item>
                </tab>
            </div>
            <div v-if="classSelect==='allLesson'">
                <ul
                        v-c="'course-ul'"
                >
                    <li
                            v-for="item in list"
                            :key="item.id"
                            class="course-li"
                            @click="goCourse($event, item)"
                    >
                        <div
                                class="seckill-head"
                                v-if="item.activityCourse"
                        >
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
                                :src="item.courseImgUrl"
                                class="teacher-portrait hover-pointer"
                                alt=""
                        >
                        <div class="content-main">
                            <div
                                    class="content-title hover-pointer"
                            >
                                <div class="p-title">
                                    <span :class="isPc ? '' :'p-title-dec'">{{ formatCourseName(item.courseName ) }}</span>
                                    <div
                                            v-if="item.courseType === 2 && isPc"
                                            class="companion-reading"
                                    >
                                        作者伴读
                                        <div class="companion-tip">
                                            <div
                                                    v-for="(desc, decIndex) in courseAccompanyDesc"
                                                    :key="decIndex"
                                            >
                                                {{ desc }}
                                            </div>
                                            <div class="triangle"/>
                                        </div>
                                    </div>
                                </div>
                                <p
                                        class="p-title-buy text-overflow"
                                >
                                    <span class="p-author-span">{{ item.teacherDTO && item.teacherDTO.teacherName }}</span>
                                    <span
                                            v-if="item.teacherDTO && item.teacherDTO.position"
                                            class="p-author-line"
                                    />
                                    <span class="p-author-span">{{ item.teacherDTO && item.teacherDTO.position }}</span>
                                </p>
                                <p v-if="item.sales && isPc"/>
                                <p class="p-describe">
                                    {{ item.brief }}
                                </p>
                            </div>
                            <ul
                                    v-if="isPc"
                                    class="content-course"
                            >
                                <li
                                        v-for="(u, index) in item.topNCourseLesson.slice(0,2)"
                                        :key="u.id"
                                        class="content-course-lesson text-overflow"
                                        :class="{'leftSpace':index%2===0}"
                                        :value="u.id"
                                >
                                    <img
                                            v-if="index === 0 && item.courseType !== 2"
                                            src="~@assets/course-list/free-course.png"
                                            class="free-label hover-pointer"
                                    >
                                    <span
                                            :class="isHover(u, item.courseType)"
                                    >{{ u.theme }}</span>
                                </li>
                            </ul>
                            <div class="content-price">
                                <p
                                        v-if="!item.isBuy"
                                        class="content-price-p"
                                >
                                    <span class="content-price-orange-sm">￥</span>
                                    <span class="content-price-orange">{{ item.discounts }}</span>
                                    <span
                                            v-if="item.discounts && item.price && item.discounts !== item.price"
                                            class="current-price"
                                    >
                                        <span class="current-price-unite">￥</span>
                                       {{ item.price }}
                                    </span>
                                    <span
                                            v-if="item.discountsTag"
                                            class="activity-name"
                                    >
                                        {{ item.discountsTag }}
                                    </span>
                                    <span
                                            v-if="item.sales && isPc"
                                            class="content-price-buy"
                                    >
                                        {{ item.sales }}人购买
                                    </span>
                                </p>
                                <p
                                        v-if="item.isBuy"
                                        class="content-price-p"
                                >
                                    <span class="content-price-buyed">已购买</span>
                                </p>
                                <div
                                        v-if="isPc && !item.isBuy"
                                        class="btn btn-green btn-offset"
                                        @click="buy($event, item)"
                                >
                                    立即购买
                                </div>
                                <div
                                        v-if="isPc && item.isBuy"
                                        class="btn btn-white btn-offset"
                                        @click="goClass(item)"
                                >
                                    去听课
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div
                    v-if="classSelect==='hasPay'"
                    class="hasPay-content"
            >
                <template v-if="isLogin && courseRecordList.length ">
                    <div
                            v-if="courseRecordList.length"
                            class="course-container"
                    >
                        <ul v-c="'course-ul'">
                            <div
                                    class="common-course-title"
                            >
                                <img
                                        class="course-icon"
                                        src="~@assets/course-list/zhuanlan@2x.png"
                                        alt=""
                                >
                                专栏课程
                            </div>
                            <li
                                    v-for="(item,index) in courseRecordList"
                                    :key="index"
                                    class="course-li pay-padding"
                                    @click="goCourse($event, item)"
                            >
                                <img
                                        :src="item.image"
                                        class="teacher-portrait hover-pointer"
                                        alt=""
                                >
                                <img
                                        v-if="item.isEnterpriseCourse"
                                        src="~@assets/course-list/tag@2x.png"
                                        alt=""
                                        class="tag-icon"
                                >
                                <div class="pay-course-main">
                                    <div
                                            class="content-title hover-pointer"
                                    >
                                        <div class="p-title">
                                            <span>{{ formatCourseName(item.name ) }}</span>
                                        </div>
                                        <div class="course-update flex">
                                            <span class="progress-title">{{ item.previewFirstField }} {{item.previewSecondField && ` / ${item.previewSecondField}` }}</span>
                                        </div>
                                        <div
                                                class="course-tips text-overflow"
                                                :class="{'gray': !item.lastLearnLessonName}"
                                        >
                                            <img
                                                    v-if="item.lastLearnLessonName"
                                                    src="~@assets/course-list/Rectangle@2x.png"
                                                    class="learnReacord-icon"
                                                    alt=""
                                                    srcset=""
                                            >
                                            {{ item.lastLearnLessonName || '暂无学习记录' }}
                                        </div>
                                    </div>
                                    <div
                                            class="btn btn-green btn-offset hasPay-btn"
                                            @click="goClass(item)"
                                    >
                                        {{ !item.lastLearnLessonName? '立即学习':'继续学习' }}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </template>
                <template v-else>
                    <div
                            v-if="isLogin"
                            class="no-data course-ul-pc"
                            :style="{height:noDataHeight+'px'}"
                    >
                        <img
                                src="~@assets/course-list/no-course@2x.png"
                                alt=""
                                class="no-data-icon"
                        >
                        <div class="no-data-title">
                            您还没有课程
                        </div>
                        <div class="no-data-tips">
                            立即选择一门好课开始学习吧～
                        </div>
                        <div
                                class="btn btn-green btn-center"
                                @click="findCourse"
                        >
                            发现好课
                        </div>
                    </div>
                    <div
                            v-if="!isLogin"
                            class="no-data course-ul-pc"
                            :style="{height:noDataHeight+'px'}"
                    >
                        <img
                                src="~@assets/course-list/no-login@2x.png"
                                alt=""
                                class="no-data-icon"
                        >
                        <div class="no-data-title">
                            您还没有登录
                        </div>
                        <div class="no-data-tips">
                            登录后即可查看已购课程
                        </div>
                        <div
                                class="btn btn-green btn-center"
                                @click="onceLogin"
                        >
                            立即登录
                        </div>
                    </div>
                </template>
            </div>
            <Toast
                    :show="isShowToast"
                    :msg="toastStr"
                    @onHide="hideToast"
            />
        </div>
    </div>
</template>
<script>
    import {mapActions, mapMutations, mapGetters} from 'vuex';

    import {Tab, TabItem,} from 'vux';
    import LgPay from '../common/modules/lg-pay';
    import {getParam} from '@js/util/getParam';
    import store from '../store';
    import jsonp from 'jsonp';
    import {triggerLoginPop, switchNeedToTriggerBuy} from '@js/pcLoginAutoBuy';

    const lgPay = new LgPay();
    import {courseListMixin} from '../mixin';
    import {fetchPcCourseList, fetchPcPurchaseCourse, getAds} from '../service';

    export default {
        name: 'CourseList',
        components: {
            Tab,
            TabItem
        },
        mixins: [courseListMixin],
        data() {
            return {
                list: [],
                courseList: [],
                recommendCourse: {
                },
                courseRecordList: [],
                bigCourseStatues: {
                    notPayRtainage: 0,
                    notJoinClass: 1,
                    joinClass: 2
                },
                courseAccompanyDesc: [
                    '高效学习：严选全网优质图书',
                    '作者亲伴：全程为你答疑解惑',
                    '社群陪伴：随时随地讨论分享',
                    '专人督导：赶走你的“小懒虫”'
                ],
                courseAds: {},
                classSelect: sessionStorage.courseTab || 'allLesson',
                noDataHeight: 0
            };
        },
        computed: {
            ...mapGetters(['userInfo', 'isLogin'])
        },
        created() {
            this.getCourseList();
            //顶部广告位
            getAds(666).then((res)=>{
                const adDTOList = res.content && res.content[0] && res.content[0].adDTOList && res.content[0].adDTOList[0] && res.content[0].adDTOList || []
                const { link, img, status } = adDTOList[0] && adDTOList[0] || {}
                if(status){
                    this.recommendCourse.canShow = true;
                    this.recommendCourse.image = img;
                    this.recommendCourse.href = link;
                }

            })
        },
        mounted() {
            this.getNoDataHeight();
            this.fetchAds();
        },
        watch: {
            'list.length': {
                handler() {
                    this.timer = [];

                    this.list.forEach((item, index) => {
                        this.timer[index] = setInterval(() => {
                            item.activityTime--;
                            if (item.activityTime <= 0) {
                                clearInterval(this.timer[index]);
                                debugger;
                                this.getCourseList();
                            }
                            this.setCountdown(item.activityTime, index);
                        }, 1000);
                    });


                },
                immediate: true
            }
        },
        methods: {
            ...mapActions(['setH5LoginModalStatus']),
            getCourseList() {
                fetchPcCourseList()
                    .then(res => {
                        console.log('getCourseList', res);

                        this.list = res.data.content.map((item => {
                            if(item.activityCourse && item.activityTime){
                                item.activityTime  = parseInt(item.activityTime/1000);
                            }else{
                                delete item.activityCourse;
                                delete item.activityTime;
                            }
                            return item;
                        }));
                    });
                fetchPcPurchaseCourse()
                    .then(res => {
                        console.log('getPurchaseCourse', res);
                        this.courseRecordList = res.data.content;
                    });
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
            setProgressStyle(value) {
                return {width: value + '%'};
            },
            parseString(dateString) {
                let date = dateString.split(' ')[0];
                return date.split('-')[0] + '年' + date.split('-')[1] + '月' + date.split('-')[2] + '日';
            },
            getNoDataHeight() {
                let ele = document.getElementsByClassName('recommend-content-pc')[0];
                let noH = ele.clientHeight;
                this.noDataHeight = noH - 50;
            },
            changeCourseTab(tabName) {
                this.classSelect = tabName;
                sessionStorage && sessionStorage.setItem('courseTab', tabName);
            },
            buy(e, item) {
                e && e.stopPropagation();
                // 没有登录 跳去登录
                if (!this.isLogin) {
                    this.setH5LoginModalStatus({
                        showH5LoginModal: true,
                        showH5LoginModalType: 'distribution'
                    });
                    return;
                }
                let {id} = item;
                lgPay.submitV2({
                    goodsId: id,
                    expandInfo: window.location.href
                }).then((res) => {
                    if (res.source === lgPay.PAY_TYPE.pc) {
                        this.list.forEach((t) => {
                            if (t.id === id) {
                                item.isBuy = true;
                                location.href = `/#/content?courseId=${id}`;
                            }
                        });

                    }
                }).catch(err => {
                    let repeatOrder = 70002;
                    let priceChange = 60205;
                    let {status, data} = err;
                    if (status === repeatOrder) {
                        this.showToast('该课程已付款，快开始学习吧');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else if (status === priceChange) {
                        this.showToast('课程价格发生变化');
                        item.lgCoinPrice = `${data.discounts}`;
                        this.buy(item);
                    }
                });
            },
            isHover(item, courseType) {
                if (Number(courseType) === 2) {
                    return '';
                } else {
                    return item.type === 'wait' ? 'disabled-word' : 'theme-span hover-pointer';
                }
            },
            contentTitleOffset(data) {
                return {
                    'height': (data && data.length) > 1 ? '115px' : '105px'
                };
            },
            fetchAds() {

            },
            linkToCourse(url) {
                window.open(url, '_blank');
            },
            findCourse() {
                this.classSelect = 'allLesson';
            },
            toLearnBigCourse(item) {
                const {joinClass} = this.bigCourseStatues;
                const {prepayProgress, id, prepayTip} = item;
                if (prepayProgress === joinClass) {
                    location.href = `/xunlianying/index.html?courseId=${id}`;
                } else {
                    this.showToast(`请${prepayTip}`);
                }

            },
            onceLogin() {
                triggerLoginPop();
            }
        }
    };
</script>
<style lang="less" scoped>
    @import '~@less/common.less';
    p {
        margin-top: 0;
    }
    li{
        list-style: none;
    }
    flex{
        display: flex;
    }
    .btn(@a, @b){
        background-color: @a;
        color: @b;
        border: 1px solid @a;
    }
    .course-ads {
        margin-bottom: 20PX;
        cursor: pointer;
        width: 100%;
        max-height: 280PX;
        overflow: hidden;
        img {
            width: 100%;
            border-radius: 2px;
        }
    }
    .tab-container{
        width: 100%;
        height: 60PX;
        background: #ffffff;
        border-bottom: 1PX solid #EDEDED;
    }
    .vux-tab.course-tab{
        box-sizing: border-box;
        height: 60PX;
        width: 200PX;
        overflow: hidden;
        font-size: 20PX;
        .vux-tab-container {
            width: 260PX;
        }
        .vux-tab-item {
            cursor: pointer;
            background: none;
            line-height: 60PX;
            font-size: 20PX;
        }
        .vux-tab-ink-bar{
            bottom: -1PX;
            .vux-tab-bar-inner{
                height: 2PX;
            }
        }
    }
    .course-ul{
        padding: 0 20PX;

        &-pc{
            width: 790px;
            background-color: #fff;
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
            // .fl;
            .course-li{
                padding: 30px 0 40px 0;
                border-bottom: 1px solid #EDEDED;
                position: relative;
                &:last-child{
                    border-bottom: 0;
                }
            }
            .current-price {
                font-size: 12px;
                color: #999;
                font-weight: 600;
                text-decoration: line-through;
            }
            .current-price-unite {
                font-size: 12PX;
                margin-right: -4PX;
            }
            .p-author-line {
                content: '';
                display: inline-block;
                width: 1px;
                height: 10px;
                position: absolute;
                background: #999;
                margin-left: 5px;
                top: 3px;
            }
            .teacher-portrait{
                width: 121PX;
                height: 159PX;
                border-radius: 4PX;
                .fl;
            }
            .content-main{
                line-height: 1.4;
                margin-left: 141px;
                position: relative;
                height: 150px;
                .content-title{
                    // height: 110px;
                }
                .content-course{
                    .font(14px);
                    padding-top: 25px;
                    color: #666;
                    .free-label{
                        width: 50px;
                        height: 16px;
                        margin: 1px 5px 0 0;
                    }
                    &-lesson{
                        display: inline-block;
                        width: 304px;
                        margin: 2px 40px 6px 0;
                        &:nth-child(2n){
                            margin-right: 0;
                        }
                        .disabled-word{
                            color: #999;
                            cursor: default;
                        }
                    }
                    .theme-span{
                        &:hover{
                            color: #0abf89;
                        }
                    }
                }
                .content-price{
                    height: 28PX;
                    line-height:28PX;
                    position: absolute;
                    width: 100%;
                    bottom: -4PX;
                    &-p{
                        font-size: 0;
                    }
                    &-orange{
                        color: #FF7452;
                        .font(20px);
                        &-sm{
                            color: #FF7452;
                            .font(14px);
                        }
                    }
                    &-buy{
                        font-size: 14px;
                        .font(14px);
                        color: #999;
                        margin-left: 20px;
                        transform: translate(8px,-2px);
                        display: inline-block;
                    }
                    &-grey{
                        color: #999;
                        .font(12px);
                        margin-left: 5px;
                    }
                    &-buyed{
                        color: #999;
                        .font(14px);
                    }
                    .activity-name {
                        .font(12px);
                        line-height: 14px;
                        color: rgba(255,255,255,1);
                        padding: 2px 4px;
                        background: linear-gradient(180deg,rgba(255,137,110,1) 0%,rgba(255,123,92,1) 100%);
                        border-radius: 2px;
                        display: inline-block;
                        transform: translate(6px, -3px);
                    }
                }
                .p-title {
                    .font(20PX);
                    color: #333;
                    font-family:PingFangSC-Medium,PingFang SC;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 350px;
                    .p-title-dec {
                        display:-webkit-box;
                        -webkit-box-orient:vertical;
                        -webkit-line-clamp:1;
                        overflow:hidden;
                    }
                    &-buy{
                        .font(12px);
                        color: #999;
                        display: inline-block;
                        margin-top: 6px;
                        position: relative;
                        .fr;
                        top: -28PX;
                        font-weight: normal;
                    }
                }
                .companion-reading {
                    background: rgba(0, 179, 138, 0.06);
                    border-radius: 2px;
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #00B38A;
                    display: inline-block;
                    padding: 0 8px;
                    height: 22px;
                    line-height: 22px;
                    margin-left: 10px;
                    vertical-align: text-bottom;
                    position: relative;
                    .companion-tip {
                        display: none;
                        position: absolute;
                        font-family: HiraginoSansGB-W3;
                        font-size: 14px;
                        color: #777777;
                        background: #FFFFFF;
                        border: 1px solid #E3EBE9;
                        box-shadow: 0 2px 3px 0 rgba(0,0,0,0.08);
                        border-radius: 3px;
                        line-height: 29px;
                        top: -7px;
                        word-break: keep-all;
                        left: 80px;
                        padding: 0 10px;
                        width: 200px;
                        z-index: 2;
                    }
                    &:hover .companion-tip {
                        display: inline-block;
                    }
                    .triangle {
                        position: absolute;
                        top: 12px;
                        left: -3px;
                        width: 0;
                        height: 0;
                        content: '';
                        border: 5px solid;
                        border-color: transparent transparent white white;
                        transform: rotate(45deg);
                        box-shadow: -2px 2px 2px rgba(0,0,0,0.08);
                    }
                    &:hover .companion-tip {
                        display: block;
                    }
                }
                .p-describe{
                    .font(14px);
                    margin-top: 5px;
                    color: #333;
                    .text-overflow;
                }
                .p-author{
                    margin: 10px 0 5px 0;
                    .font(12px);
                    color: #999;
                    position: relative;
                    &+p{
                        margin-top: 0;
                    }
                    .p-author-line {
                        content: '';
                        display: inline-block;
                        width: 1px;
                        height: 10px;
                        position: absolute;
                        background: #999;
                        margin-left: 5px;
                        top: 3px;
                    }
                    &-span:not(:first-child){
                        margin-left: 18px;
                    }
                }
            }
            .btn {
                width: 94px;
                height: 34px;
                text-align: center;
                line-height: 34px;
                cursor: pointer;
                border-radius: 3px;
                font-size: 14px;
                box-sizing: content-box;
                &-green{
                    .btn(#00B38A, #fff);
                    &:hover{
                        background: #00a57f;
                        border-color: #00a57f;
                    }
                }
                &-white{
                    .btn(#fff,#00B38A);
                    border: 1px solid #00B38A;
                    &:hover{
                        color: #fff;
                        border-color: #00B38A;
                        background-color: #00B38A;
                    }
                }
                &-offset{
                    position: absolute;
                    right: 0;
                    top: -4px;
                }
            }
        }
    }
    .hasPay-content{
        background: #FFFFFF;
        .course-li{
            .pay-course-main{
                line-height: 1.4;
                margin-left: 120PX;
                position: relative;
                height: 130PX;
            }
        }
        .gray{
            color: #999999;
        }
        .course-icon{
            width: 20PX;
            height: 20PX;
            margin-top: 3PX;
        }

        .course-progress{
            display: flex;
            align-items: center;
            font-size: 14PX;
            padding-top: 16PX;
            .progress-content{
                width: 371PX;
                height: 8PX;
                background:rgba(238,238,238,1);
                border-radius:4PX;
                margin-bottom: 1PX;
            }
            .progress-title{
                font-size: 14PX;
                margin-right: 20PX;

            }
            .progress-percent{
                color: #00B38A;
                padding: 0 19PX 0 6PX;
            }
            .progress-active{
                height: 8PX;
                width: 0;
                background: #00B38A;
                border-radius:4PX;
                transition: width .6s ease;
            }
        }
        .course-update{
            font-size: 14PX;
            padding:15PX 0  44PX 0;
        }
        .course-tips{
            width: 100%;
            font-size: 14PX;
        }
        .course-date{
            font-size: 14PX;
            color: #999999;
            padding: 6PX 0 17PX 0;
            height: 19PX;
        }
        .learnReacord-icon{
            width: 18PX;
            height: 18PX;
        }
        .teacher-portrait{
            width:99PX;
            height:129PX;
            border-radius:4PX;
        }
        .big-course-title{
            padding-top: 40PX;
            font-size: 17PX;
        }
        .common-course-title{
            padding-top: 34PX;
            font-size: 17PX;
            position: relative;
        }
        .cunting{
            border-top: 1PX solid #ededed;
        }
        .p-title{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            font-size: 20PX;
            font-family:PingFangSC-Medium,PingFang SC;
        }
        .hasPay-btn{
            top: 45PX;
        }
        .no-data{
            padding-top: 22%;
            text-align: center;
            box-sizing: border-box;
            height: 887PX;
            width: 100%;
        }
        .no-data-icon{
            width: 220PX;
            height: 220PX;
        }
        .no-data-tips{
            font-size: 16PX;
            color: #999999;
            padding: 10PX 0 30PX 0;
        }
        .no-data-title{
            font-size: 20PX;
            color: #333333;
            font-weight: 500;
        }
        .btn-center{
            margin: 10PX auto;
        }
        .pay-padding{
            padding: 30PX 0;
        }
        .prepay-tips{
            font-size:14PX;
            font-weight:400;
            color:rgba(102,102,102,1);
            line-height:20PX;
            margin: 15PX 0 42PX;
        }
        .orange{
            color: #FF7452
        }
        .btn-green-grey {
            background-color: rgba(0, 179, 138, 0.35);
            color: #fff;
        }
        .more-course{
            position: absolute;
            right: 0;
            bottom: 0;
            font-size: 14PX;
            color: #999999;
            cursor: pointer;
        }
    }


    .course-ul-container {
        width: 850PX;
        display: inline-block;
        float: left;
    }

    .course-ul {
        padding: 0 20PX;

        &-pc {
            width: 790px;
            background-color: #fff;
            padding: 0 30px;
            .fl;

            .tag-icon {
                width: 57PX;
                height: 18PX;
                position: absolute;
                top: 30PX;
                left: 0;
            }

            .more-icon {
                width: 10PX;
                height: 10PX;
                vertical-align: middle;
            }
        }
    }
</style>
