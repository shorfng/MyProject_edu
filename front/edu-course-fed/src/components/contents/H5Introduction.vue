<template>
    <div>
        <div
            class="intro"
        >
            <div
                class="intro-content"
            >
                <div class="intro-top">
                    <img
                        :src="courseInfo.courseListImg"
                        alt="课程图片"
                        class="course-img"
                    >
                    <div class="intro-container">
                        <div class="course-name">
                            {{ courseInfo.courseName }}
                        </div>
                        <div class="sub-title">
                            {{ courseInfo.brief }}
                        </div>
                        <div class="teacher-time">
                            <div
                                v-if="courseInfo.teacherDTO"
                                class="teacher"
                            >
                                {{ isAccompanyCourse ? '作者：': '讲师：' }}{{ courseInfo.teacherDTO.teacherName }}<span
                                    v-if="courseInfo.teacherDTO.position"
                                    class="division-line"
                                />{{ courseInfo.teacherDTO.position }}
                            </div>
                            <div class="course-info">
                                {{ courseDesc.tipsText }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sales-view-btn clearfix">
                    <div
                        v-if="!isEmploymentCourse"
                        class="sale-info"
                    >
                        <div class="sale-num-total">
                            <span class="sale-num">{{ courseInfo.sales }}</span>
                            <span class="sale-other">人已购买</span>
                        </div>
                    </div>
                    <div
                        class="detail-btn scale-1px"
                        @click="goLearn"
                    >
                        <span class="detail-text">{{ courseDesc.buttonText }}</span>
                        <span class="arrow" />
                    </div>
                </div>
                <div
                    v-if="showDistributionButton && lagouEduTheme"
                    class="intro-bottom flex"
                >
                    <div class="invite-friends">
                        邀请好友即赚￥{{ distributionInfo.brokerage }}
                    </div>
                    <div
                        class="invite-go"
                        @click="toMoney"
                    >
                        去赚钱
                        <img src="../../assets/public-class/jd_xiaoke_ic_jiantou2@2x.png">
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="!showDistributionButton && lagouEduTheme"
            class="block"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { fetchFavoriteCourse } from '../../service';
import { isLgApp } from '../../common/js/userAgent/getVersion';

export default {
    name: 'H5Introduction',
    props: {
        distributionInfo: {
            type: Object,
            default: () => {}
        },
        showDistributionButton: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isFavorite: this.courseInfo.isFavorite,
            isLgApp: isLgApp()
        };
    },
    computed: {
        ...mapGetters([
            'courseInfo',
            'hasPurchaseClass',
            'playerStatus',
            'playerSecondCurrentTime',
            'isAccompanyCourse',
            'isEmploymentCourse',
            'isVideoCourse',
            'courseIntroHref',
            'courseSections',
            'coursePlayRecord',
            'userInfo',
            'isLogin'
        ]),
        courseDesc() {
            let { totalCourseTime, totalDuration, previewFirstField, previewSecondField } = this.courseInfo;
            if (this.isAccompanyCourse) {
                return {
                    tipsText: `${totalCourseTime}章 / ${totalDuration}天学完`,
                    buttonText: `什么是作者伴读`
                };
            }
            else if (this.isEmploymentCourse) {  //就业课
                return {
                    tipsText: `共${totalCourseTime}个阶段 / 学习周期${totalDuration}个月`,
                    buttonText: `免费咨询`
                };
            }
            else {
                let tipsText = `${totalCourseTime}讲 / 约${totalDuration}分钟`;
                if (previewFirstField && previewSecondField) {
                    tipsText = `${previewFirstField} / ${previewSecondField}`;
                }
                return {
                    tipsText,
                    buttonText: this.hasPurchaseClass ? '开始学习' : '免费试看'
                };
            }
        }
    },
    mounted() {
        this.getCoursePlayHistory();
    },
    methods: {
        ...mapActions(['setFormatPlayerCurrentTime', 'getCoursePlayHistory']),
        toMoney() {
            location.href = this.distributionInfo.url;
        },
        goLearn() {
            this.track();
            if (this.courseIntroHref) {
                window.location.href = this.courseIntroHref;
                return;
            }
            let { courseLessons } = this.courseSections[0];
            let path = this.isVideoCourse ? '/videoDetail?lessonId=' : '/detail/h5?id=';
            let history = this.coursePlayRecord;
            // 未购买跳转首页
            if (!this.hasPurchaseClass) {
                path += courseLessons[0].id;
            }
            // 跳转正在播放的课程
            else if (this.playerStatus && this.playerStatus.id) {
                path += this.playerStatus.id;
            }
            // 跳转到播放历史的课时
            else if (this.hasPurchaseClass && history && history.lessonId) {
                path += history.lessonId;
            }
            // 默认首页
            else {
                path += courseLessons[0].id;
            }
            this.$router.push({
                path
            });
        },
        track() {
            let { id, courseName } = this.courseInfo;
            this.eduPlatTrack('ClickFreeTrial', {
                courses_id: [String(id)],
                courses_name: [courseName]
            });
        },
        toggleFavorite() {
            if (!this.isLogin) {
                window.open('/frontLogin.do', '_self');
                return;
            }
            let isFavorite = this.isFavorite;
            fetchFavoriteCourse(isFavorite).then(() => {
                this.isFavorite = !isFavorite;
                this.twoPlatTrack('1kkn', {
                    address_id: '1nq7',
                    content_id: this.courseInfo.id,
                    click_type: isFavorite ? '取消' : '选中'
                });
            });
        }
    }
};
</script>

<style scoped lang="less">
    .flex{
        display: flex;
    }
    .intro {
        background: #5B5D6E;
        font-family: PingFangSC-Regular;
    }
    .intro-content {
        padding: 70px 40px 30px;
    }
    .intro-top {
        overflow: hidden;
    }
    .course-img {
        width: 230px;
        height: 300px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        -webkit-box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1) ;
        -moz-box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1);
        float: left;
    }
    .intro-container {
        margin-left: 251px;
    }
    .course-name {
        font-family: PingFangSC-Medium;
        font-weight: bold;
        font-size: 36px;
        color: #FFFFFF;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .sub-title {
        opacity: 0.7;
        font-size: 22px;
        color: #FFFFFF;
        overflow:hidden;
        text-overflow:ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-top: 10px;
    }
    .teacher-time {
        background: rgba(0, 0, 0, 0.06);
        border-radius: 4px;
        padding: 20px;
        margin-top: 28px;
    }
    .division-line{
        width: 1px;
        height: 17px;
        background: #FFFFFF;
        opacity: 0.5;
        display: inline-block;
        margin-left:10px;
        margin-right: 10px;
        margin-top: 6px;
    }
    .teacher {
        color: #FFFFFF;
        font-size: 24px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    .course-info {
        opacity: 0.7;
        font-size: 22px;
        color: #FFFFFF;
    }
    .sales-view-btn {
        margin-top: 30px;
        font-size: 0;
    }
    .sale-info {
        float: left;
        position: relative;
        height: 40px;
    }
    .sale-num-total {
        position: relative;
        height: 40px;
        line-height: 1;
    }
    .sale-num {
        font-family: DINAlternate-Bold;
        font-size: 36px;
        color: #FFFFFF;
        display: inline-block;
        margin-top: 10px;
    }
    .sale-other {
        font-size: 20px;
        color: #FFFFFF;
        display: inline-block;
        margin-left: 4px;
        vertical-align: super;
    }
    .detail-btn {
        float: right;
        height: 52px;
        line-height: 52px;
        font-size: 0;
        padding: 0 16px 0 24px;
        overflow: visible;
        border-radius:31px;
    }
    .favorite {
        float: right;
        height: 54px;
        line-height: 54px;
        margin-right: 60px;
        margin-top: 1px;
    }
    .favorite-icon {
        width: 30px;
        height: 30px;
        display: inline-block;
        vertical-align: middle;
        background-image: url('../../assets/public-class/icon-favorite@3x.png');
        background-repeat: no-repeat;
        background-size: cover;
        margin-right: 14px;
    }
    .is-active {
        background-image: url('../../assets/public-class/icon-favorite-pre@3x.png');
    }
    .favorite-txt {
        font-size: 26px;
        color: #FFFFFF;
        display: inline-block;
        vertical-align: middle;
    }
    .scale-1px:after {
        border-radius: 29px;
        border-color: #FFFFFF;
    }
    .detail-text {
        font-family: PingFangSC-Medium;
        font-weight: bold;
        font-size: 26px;
        color: #FFFFFF;
    }
    .arrow {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url("../../assets/public-class/sale-arrow.png") no-repeat;
        background-size: 100%;
    }
    .intro-bottom{
        width: 100%;
        height:60px;
        line-height: 60px;
        font-size:24px;
        background:linear-gradient(90deg,rgba(251,229,193,1) 0%,rgba(230,206,176,1) 100%);
        border-radius:6px;
        color: #877065;
        margin-top: 30px;
    }
    .invite-friends{
        padding: 0 30px;
        display: inline-block;
    }
    .invite-go{
        display: inline-block;
        text-align: right;
        flex: 1;
        padding: 0 30px;
        display: flex;
        text-align: right;
        align-items: center;
        justify-content: flex-end;
        img{
            width: 16px;
            height: 16px;
            vertical-align: baseline;
        }
    }
.lagouEduTheme{
    .intro{
        background: #FFFFFF;
    }
    .intro-content {
        padding: 20px 40px 30px;
    }
    .course-img{
        width: 220px;
        height: 287px;
        color: #333;
    }
    .course-info{
        color: #999
    }
    .course-name{
        color: #333;
    }
    .sale-num, .sale-other{
        color:#666666;
    }
    .sale-other{
        border-radius:31px;

    }
    .sub-title {
        color: #999999;
    }
    .teacher-time{
        background: #F8F9FA;

    }
    .detail-btn{
        padding-top: 1px;
        background: rgba(251,197,70,0.12);
    }
    .teacher{
        color: #666666;
    }
     .favorite-icon{
        width: 50px;
        height: 50px;
        background-image: url('../../assets/public-class/jd_xiaoke_ic_like_nor@2x.png');
     }
     .is-active{
          background-image: url('../../assets/public-class/jd_xiaoke_ic_like_pre@2x.png');
     }
     .favorite-txt{
         color: #666666;
     }
     .detail-text{
        color: #E5A817;

     }
     .block{
         width: 100%;
         height: 20px;
         background: #F8F9FA;
     }
     .arrow{
        background: url("../../assets/public-class/jd_xiaoke_ic_jiantou@2x.png") no-repeat;
        background-size: 100%;
     }
     .scale-1px:after {
        border-radius: 29px;
        border:none;
    }
}
</style>
