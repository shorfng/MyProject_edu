<template>
    <div :class="{'footer':true,'is-pc':needUsePcClass}">
        <div :class="{'sale-footer-container':true,'scale-1px':!needUsePcClass}">
            <div :class="{box: true, 'box-special': isShowSecKillBtn}">
                <div
                    v-show="isShowBack"
                    class="back-top"
                    @click="backTop"
                />
                <Swiper
                    v-if="showBuyUser"
                    :swiper-option="swiperOption"
                >
                    <div
                        slot="slide"
                        slot-scope="{slide}"
                        class="flex a-center slider-item-wrap"
                    >
                        <img
                            class="swiper-avatar"
                            :src="slide.buyUserPortrait"
                            alt=""
                        >
                        <span class="swiper-name">
                            {{ slide.buyUserName }}已加入学习
                        </span>
                    </div>
                </Swiper>

                <div
                    v-if="!needUsePcClass"
                    class="button-container"
                >
                    <SpecialAnimateBtn
                        v-if="isShowSecKillBtn"
                        @gotoPurchaseClass="gotoPurchaseClass"
                        @hideBtn="hideSecKillBtn"
                    />
                    <H5ActivityBtn
                        v-else-if="activityButtonInfo && isVideoAudioCourse"
                        :discounts="courseInfo.discounts"
                        :price="courseInfo.price"
                        @gotoPurchaseClass="gotoPurchaseClass"
                    />
                    <div
                        v-else
                        class="flex a-center"
                    >
                        <div
                            v-if="courseInfo.hasFreeListen"
                            class="button-left flex flex-column a-center"
                            @click="playAudio"
                        >
                            <div :class="auditionClassname">
                                <img
                                    v-show="playerStatus.isPlaying"
                                    class="icon-playing-container"
                                    src="../../assets/public-class/icon-sale-play.png"
                                    alt=""
                                >
                            </div>
                            <span>{{ isPlaying ? '试听中' : '试听' }}</span>
                        </div>
                        <button
                            class="flex-1"
                            @click="gotoPurchaseClass()"
                        >
                            {{ getBtnText }}
                        </button>
                    </div>
                </div>
                <div
                    v-else
                    class="pc-handle-wrap"
                >
                    <div class="discounts-wrap">
                        <span class="text">{{ courseInfo.isNewDes }}</span>
                        <span class="discounts">{{ courseInfo.discounts || courseInfo.price }}</span>
                        <span
                            v-if="courseInfo.discounts && courseInfo.price && courseInfo.discounts !== courseInfo.price"
                            class="price"
                        >
                            ￥{{ courseInfo.price }}
                        </span>
                    </div>
                    <div
                        class="handle-button-wrap"
                        @click="gotoPurchaseClass()"
                    >
                        {{ getBtnText }}
                    </div>
                    <div
                        v-if="courseInfo.hasFreeListen"
                        class="test-button-wrap"
                        @click="playAudio"
                    >
                        <div :class="[auditionClassname,'test-icon']">
                            <img
                                v-show="playerStatus.isPlaying"
                                class="icon-playing-container"
                                src="../../assets/course/sale/footer-play-status.png"
                                alt=""
                            >
                        </div>
                        <div class="test-text">
                            {{ isPlaying ? '试听中' : '试听' }}
                        </div>
                    </div>
                </div>
            </div>
            <Purchase
                source="salePage"
                @repeatPurchase="repeatPurchase"
            />
            <Toast
                :show="isShowToast"
                :msg="toastStr"
                @onHide="hideToast"
            />
            <div
                v-if="isShowRepeatModal"
                class="modal"
            >
                <div class="modal-container">
                    <img
                        class="img"
                        src="../../assets/public-class/repeat@2x.png"
                        alt=""
                    >
                    <div class="text">
                        您已买过该课程～
                    </div>
                    <button @click="learn">
                        立即学习
                    </button>
                    <img
                        class="close"
                        src="../../assets/public-class/home_pop_close@2x.png"
                        alt=""
                        @click="closeModal"
                    >
                </div>
            </div>
            <PcAllDirlog
                :visible="showPcDirlog"
                @close="closeDirlog"
            />
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';
    import Swiper from '@components/Swiper/Index';
    import Purchase from '../common/Purchase';
    import { fetchBuyUserInfo } from '../../service';
    import Toast from '../common/Toast';
    import SpecialAnimateBtn from '../common/SpecialAnimateBtn';
    import PcAllDirlog from './PcAllDirlog';
    import H5ActivityBtn from '../contents/H5ActivityBtn';
    import { getParam } from '@js/util/getParam';
    export default {
        components: {
            Swiper,
            Purchase,
            Toast,
            PcAllDirlog,
            H5ActivityBtn,
            SpecialAnimateBtn
        },
        props: {
            isShowBack: {
                type: Boolean,
                default: false
            },
            needUsePcClass: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                showBuyUser: false,
                swiperOption: {},
                isShowToast: false,
                toastMsg: '',
                isShowRepeatModal: false,
                showPcDirlog: false,
                isVerifyUserId: window.userInfo && window.userInfo.id === 3659138,
                activityButtonInfo: window.activityButtonInfo || null,
                page_id: '1pvk',
                isSetSecKillBtn: true,
            };
        },
        computed: {
            ...mapGetters([
                'hasPurchaseClass',
                'courseInfo',
                'courseSections',
                'playerStatus',
                'isNativeAudioPlay',
                'isVideoAudioCourse',
                'isSpecialCourseId'
            ]),
            isPlaying() {
                return this.playerStatus.isPlaying;
            },
            auditionClassname() {
                return this.playerStatus.isPlaying ? 'icon-playing' : 'kw-icon-headset';
            },
            getBtnText() {
                let { discounts, price } = this.courseInfo;
                if (this.hasPurchaseClass) {
                    return '立即学习';
                }
                else {
                    return '￥' + (discounts || price) + ' 加入学习';
                }
            },
            isShowSecKillBtn() {
                let { joinSeckill, seckillRemainSeconds } = this.courseInfo;
                return joinSeckill && seckillRemainSeconds && this.isSetSecKillBtn;
            },
        },
        watch: {
            hasPurchaseClass(val, oldVal) {
                if (val && !oldVal) {
                    if (this.isPc) {
                        this.$router.replace({ name: 'courseContent' });
                    }
                }
            }
        },
        mounted() {
            fetchBuyUserInfo().then(res => {
                if (res.state === 1) {
                    if (!res.content.showBuyUser) return;
                    let buyUsers = res.content.buyUsers || null;
                    this.swiperOption = {
                        assetsList: buyUsers,
                        swiper: {
                            direction: 'vertical',
                            pagination: null
                        }
                    };
                    this.showBuyUser = buyUsers;
                    setTimeout(() => {
                        this.showBuyUser = false;
                    }, 3000 * buyUsers.length);
                }
            });
        },
        methods: {
            ...mapActions([
                'triggerPurchase',
                'setLessonPlayer',
                'setCurrentCourseLessons'
            ]),
            gotoPurchaseClass(param = { needReport: true }) {
                let { needReport } = param;
                if (needReport) {
                    this.eduPlatTrack('WebButtonClick', { page_id: this.page_id, button_name: '底栏加入学习' });
                }

                if (this.hasPurchaseClass) {
                    this.$router.replace({
                        path: 'content'
                    });
                }
                else {
                    this.triggerPurchase();
                }
            },
            backTop() {
                this.$emit('backTop');
            },
            playAudio() {
                let { isPlaying, id = null, sectionId = null } = this.playerStatus;
                if (this.playerStatus.isPlaying) {
                    let key =  this.isPc ? 'pc' : 'h5';
                    if (this.isPc) {
                       this.setCurrentCourseLessons(this.playerStatus);
                    }
                    this.$router.push({
                        path: `/detail/${key}?id=${id}`,
                    });
                    return;
                }
                let firstLesson = this.courseSections[0].courseLessons[0];
                let lessonId = id || firstLesson.id;
                sectionId = sectionId || firstLesson.sectionId;
                if (firstLesson.audioMediaDTO && firstLesson.audioMediaDTO.fileUrl) {
                    this.setLessonPlayer({
                        id: lessonId,
                        isPlaying: true
                    });
                }
                else {
                    this.showToast('该商品无试听音频');
                }
                let { id: courses_id, courseName: courses_name } = this.courseInfo;
                let { id: class_id = '', theme: reclass_name = '' } = firstLesson;
                this.eduPlatTrack('TryListenCourse',
                    {
                        page_id: this.page_id,
                        on_module: '底部',
                        courses_id: [courses_id.toString()],
                        reclass_name,
                        reclass_id: class_id.toString(),
                        courses_name: [courses_name]
                    }
                );
            },
            repeatPurchase() {
                if (this.isPc) {
                    this.showPcDirlog = true;
                } else {
                    this.isShowRepeatModal = true;
                }
                this.setPurchaseSuccess();
            },
            closeModal() {
                this.isShowRepeatModal = false;
            },
            learn() {
                let path = this.isApp ? '/content' : '/saled';
                this.$router.replace({
                    path
                });
            },
            closeDirlog() {
                this.showPcDirlog = false;
            },
            hideSecKillBtn() {
                this.isSetSecKillBtn = false;
            }
        }
    };
</script>
<style lang="less" scoped>
    @import '../../common/css/animation.less';
    @import '../../common/css/modal.less';
    .footer {
        height: 100px;
        display: block;
    }
    .sale-footer-container {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        &::after {
            border-color: #EFEFEF transparent transparent;
            top: -1px;
            z-index: -1;
        }
    }
    .back-top {
        width: 80px;
        height: 80px;
        position: absolute;
        bottom: 128px;
        left: 20px;
        background: url('~@assets/public-class/top@2x.png') no-repeat;
        background-size: 100% 100%;
    }
    .swiper-container {
        height: 26px;
        line-height: 26px;
        position: absolute;
        right: 20px;
        bottom: 64px;
        border-radius:14px;

        width: auto;
        z-index: 2;
    }
    /deep/ .swiper-slide {
        background:rgba(0,0,0,0.35);
        padding: 0 4px;
    }
    .box-special {
        .back-top {
            bottom: 178px;
        }
        .swiper-container {
            bottom: 102px;
        }
    }
    .swiper-avatar {
        width: 18px;
        height: 18px;
        border-radius: 50%;
    }
    .swiper-name {
        font-size: 10px;
        color: #ffffff;
        margin-left: 4px;
        max-width: 120px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .button-container {
        padding: 14px 38px 14px 32px;
        box-sizing: border-box;
        background: white;
         button {
            height: 72px;
            background:linear-gradient(270deg,rgba(250,168,62,1) 0%,rgba(251,197,70,1) 100%);
            border-radius: 22px;
            font-size:28px;
            font-weight: bolder;
            color: #333333;
            justify-content: center;
            text-align: center;
        }
    }
    .button-left {
        font-size: 20px;
        line-height: 20px;
        color: #666666;
        margin-right: 32px;
        min-width: 64px;
        .kw-icon-headset {
            font-size: 45px;
            color: #FF7452;
        }
        span:first-child {
            margin-bottom: 2px;
        }
    }
    .icon-playing {
        width: 50px;
        height: 50px;
        overflow: hidden;
        text-align: center;
        .icon-playing-container {
            width: 50px;
            animation: saleAnimate 3s steps(22) infinite;
        }
    }
    .modal {
        z-index: 11;
    }
    .modal-container {
        padding: 0 75px 60px;
        border-radius: 12px;
        text-align: center;
        .img {
            width: 306px;
            height: 215px;
            position: absolute;
            left: 50%;
            top: -75px;
            transform: translateX(-50%);
            color: #333333;
        }
        .text {
            font-weight:500;
            font-size:32px;
            padding: 197px 0 60px;
        }
        button {
            width:450px;
            height:88px;
            background:rgba(251,197,70,1);
            border-radius:44px;
            font-size:32px;
            font-weight:400;
            outline: none;
        }
        .close {
            width: 60px;
            height: 60px;
            bottom: -122px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
    }
    .footer.is-pc{
        height: 60PX;
        .sale-footer-container{
            border-top: 1PX solid #EDEDED;
            background: #ffffff;
        }
        .box{
            width: 1000PX;
            margin: 0 auto;
        }
        .back-top{
            width: 50PX;
            height: 50PX;
            right: 40PX;
            left:auto;
            cursor: pointer;
            z-index: 16;
            bottom: 100PX;
            background: url('~@assets/course/sale/back-top.png') no-repeat;
            background-size: 100% 100%;
        }
        .pc-handle-wrap{
            height: 60PX;
            background: white;
            line-height: 60PX;
        }
        .discounts {
            color: #FF7452;
            font-size:28PX;
            font-weight: bolder;
            display: inline-block;
            vertical-align: top;
            box-sizing: border-box;
            height: 60PX;
            &::before {
                display: inline;
                content: '￥';
                font-size: 16PX;
            }
        }
        .price {
            display: inline-block;
            height: 60PX;
            vertical-align: top;
            font-size:14PX;
            color: #999999;
            text-decoration: line-through;
            padding-left: 2PX;
            padding-top: 5PX;
            box-sizing: border-box
        }
        .text{
            font-size:14PX;
            color:rgba(51,51,51,1);
            margin-right: 11PX;
            display: inline-block;
            vertical-align: bottom;
            box-sizing: border-box;
            padding-top: 5PX;
            height: 60PX;
        }
        .handle-button-wrap{
            float: right;
            height:40PX;
            width: 160PX;
            padding: 0 ;
            background:rgba(0,179,138,1);
            border-radius:4PX;
            border:1PX solid rgba(0,178,138,1);
            font-size:16px;
            font-weight:400;
            color: #ffffff;
            line-height: 40PX;
            margin-top: 10PX;
            text-align: center;
            cursor: pointer;
        }
        .discounts-wrap{
            float: left;
        }
        .test-button-wrap{
            float: right;
            margin-right: 40PX;
            height: 60PX;
            line-height: 60PX;
            font-size:0;
            color:rgba(102,102,102,1);
            cursor: pointer;
        }
        .test-icon{
            display: inline-block;
            vertical-align: middle;
            margin-right: 8PX;
            &.kw-icon-headset {
                font-size: 30PX;
                color: #FF7452;
            }
            &.icon-playing{
                font-size: 30PX;
            }
        }
        .test-text{
            display: inline-block;
            vertical-align: middle;
            font-size:16px;
            color:rgba(102,102,102,1);
        }
        .swiper-container{
            height: 36PX;
            line-height: 36PX;
            bottom: 82PX;
            right: 50%;
            border-radius:28PX;
            transform: translateX(500PX);
        }
        .swiper-avatar{
            width: 24PX;
            height: 24PX;
            display: inline-block;
            vertical-align: top;
        }
        .swiper-name{
            font-size: 14PX;
            display: inline-block;
            vertical-align: top;
            line-height: 36PX;
        }
        .slider-item-wrap{
            font-size: 0;
        }
        .icon-playing{
            width: 28PX;
            height: 28PX;
        }
        .icon-playing-container {
            width: 28PX;
            animation: pcFooterAnimate 3s steps(20) infinite;
        }
    }
</style>

