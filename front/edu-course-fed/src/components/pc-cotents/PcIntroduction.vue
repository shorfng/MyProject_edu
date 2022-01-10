<template>
    <div class="intro">
        <div class="intro-content">
            <img
                :src="courseInfo.courseListImg"
                alt="课程图片"
                class="course-img"
            >
            <div class="conent-wrap">
                <div class="name">
                    {{ courseInfo.courseName }}
                </div>
                <div class="des text-omit">
                    {{ courseInfo.brief }}
                </div>
                <div class="title">
                    <div class="teacher-name text-omit">
                        {{ isAccompanyCourse?'作者：':'讲师：' }}{{ courseInfo.teacherDTO && courseInfo.teacherDTO.teacherName }}
                        <span
                            v-if="courseInfo.teacherDTO && courseInfo.teacherDTO.position"
                            class="line"
                        />
                        {{ courseInfo.teacherDTO && courseInfo.teacherDTO.position }}
                    </div>
                </div>
                <div class="lesson-info">
                    <div class="boook-icon backgroun-img-set" />
                    <div class="time">
                        {{ courseDesc.tipsText }}
                    </div>
                    <div
                            v-if="!isEmploymentCourse && courseInfo.sales"
                            class="person-icon backgroun-img-set"
                    />
                    <div
                            v-if="!isEmploymentCourse && courseInfo.sales"
                            class="person"
                    >
                        {{ courseInfo.sales }}人已购买
                    </div>
                </div>
            </div>
            <div class="content-right">
                <div
                    class="button-wrap"
                    @click="clickLinkButton"
                >
                    <div class="small-arrows" />
                    {{ courseDesc.buttonText }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { fetchFavoriteCourse } from '../../service';
import { getParam } from '../../common/js/util/getParam';
export default {
    name: '',
    data() {
        return {
            isFavorite: this.courseInfo && this.courseInfo.isFavorite
        };
    },
    computed: {
        ...mapGetters([
            'courseInfo',
            'hasPurchaseClass',
            'courseSections',
            'isAccompanyCourse',
            'isEmploymentCourse',
            'courseIntroHref',
            'coursePlayRecord',
            'isVideoCourse',
            'userInfo',
            'isLogin'
        ]),
        courseDesc() {
            let { previewFirstField, previewSecondField } = this.courseInfo;
                let tipsText = ``;
                if (previewFirstField && previewSecondField) {
                    tipsText = `${previewFirstField} / ${previewSecondField}`;
                }else if(previewFirstField || previewSecondField){
                    tipsText = `${previewFirstField || previewSecondField}`;
                }
                return {
                    tipsText,
                    buttonText: this.hasPurchaseClass ? '开始学习' : '免费试看'
                };
        }
    },
    methods: {
        ...mapActions([
            'setCurrentCourseLessons',
        ]),
        clickLinkButton: function() {
            let { courseType, id, courseName } = this.courseInfo;
            this.eduPlatTrack('ClickFreeTrial', {
                courses_id: [String(id)],
                courses_name: [courseName]
            });
            if (this.courseIntroHref) {
                window.open(this.courseIntroHref, '_blank');
                return;
            }
            let jumpId = null;
            let renderData = null;
            let { courseSections, hasPurchaseClass } = this;
            let allLesson = courseSections && courseSections[0] && courseSections[0].courseLessons || [];
            if (hasPurchaseClass) {
                courseSections.find(sections => {
                    renderData = sections.courseLessons.find(item => {
                        return item.id === this.coursePlayRecord.lessonId;
                    });
                    return !!renderData;
                });
                renderData ?
                    (jumpId = renderData.id)
                    :
                    (jumpId = allLesson[0].id);
            }
            else {
                renderData = allLesson.find(item => {
                    return item.type === 'free';
                });
                renderData ?
                    (jumpId = renderData.id)
                    :
                    (jumpId = allLesson[0].id);
            }
            if (this.isVideoCourse) {
                this.$router.push({ name: 'videoDetail', query: { lessonId: jumpId,courseId: id } });
            } else {
                jumpId && this.$router.push({ name: 'pcDetail', query: { id: jumpId } });
            }
            this.setCurrentCourseLessons(renderData || allLesson[0]);
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
                    content_id: $.router.query.courseId,
                    click_type: isFavorite ? '取消' : '选中'
                });
            });
        }
    }
};
</script>

<style scoped lang="less">
    .intro {
        background: #5B5D6E;
        font-family: PingFangSC-Regular;
    }
    .intro-content{
        overflow: hidden;
        padding: 30PX;
        position: relative;
        min-height: 133PX;
    }
    .course-img{
        width: 102PX;
        max-height: 133PX;
        overflow: hidden;
        box-shadow: 0 6PX 10PX 0 rgba(0,0,0,0.10);
        border-radius: 2PX;
        float: left;
        margin-right: 20PX;
    }
    .conent-wrap{
        float: left;
        max-width: 450PX;
        position: relative;
    }
    .name{
        font-family: PingFangSC-Medium;
        font-size: 20PX;
        color: #FFFFFF;
        font-weight: 700;
        margin-bottom: 53PX;
    }
    .des{
        font-size: 14PX;
        color: #FFFFFF;
        position:absolute;
        width: 450PX;
        top: 36PX;
        left: 0;
    }
    .title{
        font-size: 12PX;
        line-height: 12PX;
        color: #FFFFFF;
        overflow: hidden;
        margin-bottom: 13PX;
        font-weight: normal;
        font-family: PingFangSC-Regular;
    }
    .text-omit{
        overflow: hidden;
        word-wrap: normal;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .teacher-name{
        float: left;
    }
    .line{
        width: 1PX;
        height: 8PX;
        opacity: 0.5;
        display: inline-block;
        background: #FFFFFF;
        margin-left: 10PX;
        margin-right: 10PX;
    }
    .lesson-info{
        overflow: hidden;
        font-family: PingFangSC-Regular;
        font-size: 12PX;
        line-height: 20PX;
        color: #FFFFFF;
        font-weight: normal;
    }
    .backgroun-img-set{
        background-repeat:no-repeat;
        background-size: 100% 100%;
    }
    .boook-icon{
        width: 18PX;
        height: 18PX;
        background-image: url('../../assets/pc-detail/book-icon.png');
        float: left
    }
    .time{
        margin-left: 8PX;
        float: left
    }
    .person-icon{
        width: 18PX;
        height: 18PX;
        background-image: url('../../assets/pc-detail/person-icon.png');
        margin-left: 30PX;
        float: left
    }
    .person{
        margin-left: 4PX;
        float: left
    }
    .content-right {
        position: absolute;
        top: 118PX;
        right: 40PX;
    }
    .button-wrap{
        font-family: PingFangSC-Medium;
        font-size: 14PX;
        color: #FFFFFF;
        height: 34PX;
        padding: 0 22Px;
        border: 1px solid rgba(225,225,225,0.5);
        border-radius: 2px;
        line-height: 34PX;
        font-weight: 700;
        cursor: pointer;
        position: relative;
        float: right;
    }
    .small-arrows{
        width: 10PX;
        height: 10Px;
        background-repeat:no-repeat;
        background-size: 100% 100%;
        background-image: url('../../assets/pc-detail/small-arrows.png');
        top: 12PX;
        right: 12PX;
        position: absolute;
    }
    .favorite {
        float: right;
        height: 25PX;
        line-height: 25PX;
        font-size: 0;
        margin: 7PX 36PX 0 0;
        cursor: pointer;
    }
    .favorite-icon {
        width: 18PX;
        height: 18PX;
        display: inline-block;
        vertical-align: middle;
        background-image: url('../../assets/public-class/icon-favorite@3x.png');
        background-repeat: no-repeat;
        background-size: cover;
        margin-right: 8PX;
    }
    .is-active {
        background-image: url('../../assets/public-class/icon-favorite-pre@3x.png');
    }
    .favorite-txt {
        font-size: 14PX;
        color: #FFFFFF;
        display: inline-block;
        vertical-align: middle;
    }
</style>
