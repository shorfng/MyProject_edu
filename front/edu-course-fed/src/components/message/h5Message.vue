<template>
    <div
        v-if="courseCommentList && courseCommentList.length && !hideStatus"
        v-cloak
        class="message"
        :class="showBorderTop ? 'message-border' : ''"
    >
        <div class="message-topic">
            <div
                class="message-topic-title"
                :class="{'mine-font':showGray}"
            >
                {{ isMine ? '我的留言': '精选留言' }}
                <span
                    v-if="commentCount && !isMine && showMessageCount"
                    class="comment-count"
                >/{{ commentCount }}条</span>
            </div>
            <div
                v-if="showEdit"
                class="message-topic-write"
                @click="toMessage"
            >
                <img
                    :src="icons.message_icon[iconType]"
                    class="message-topic-write-icon"
                >
                写留言
            </div>
        </div>
        <div
            v-for="(item,index) in courseCommentList"
            :key="item.commentId"
            ref="courseCommentList"
            class="message-list"
        >
            <div class="message-list-title">
                <div class="message-list-title-left">
                    <div
                        v-if="item.label"
                        class="message-list-title-left-tag"
                        :class="item.showTeacher ? 'tag-type2' : item.top ? 'tag-type1' : ''"
                    >
                        {{ item.label }}
                    </div>
                    <div class="message-list-title-left-name">
                        {{ item.nickName }}
                    </div>
                </div>
                <div
                    class="message-list-title-right"
                    @click="updateCourseCommentLikeCount(item.commentId,!item.like,index)"
                >
                    <div class="message-list-title-right-praise">
                        {{ item.likeCount | likeNum }}
                    </div>
                    <img
                        v-show="item.like"
                        class="message-list-title-right-icon"
                        :src="icons.like_icon[iconType]"
                        alt="right-icon"
                    >
                    <img
                        v-show="!item.like"
                        class="message-list-title-right-icon"
                        :src="icons.unlike_icon[iconType]"
                        alt="right-icon"
                    >
                </div>
            </div>
            <div class="message-list-container">
                <div
                    :ref="'list'+index"
                    class="message-list-content"
                    :class="{'ellipsis':!item.expand}"
                    v-html="parseString(item.comment)"
                />
                <div
                    v-if="!item.expand"
                    :class="expandCls"
                    @click="expandFn(index)"
                >
                    {{ item.expand ? '' : '全部' }}
                </div>
            </div>
            <div
                v-if="item.replayComment"
                class="message-list-replay"
            >
                <span class="message-list-replay-name">{{ item.replayComment.nickName }}：</span>
                {{ item.replayComment.comment }}
            </div>
            <div
                v-if="item.lessonName && routeName !== 'H5Detail'"
                class="message-list-lesson flex a-center"
            >
                <span class="flex-1 message-list-lesson-name single-line">
                    {{ item.lessonName }}
                </span>
                <span
                    class="message-list-detail"
                    @click="lessonDetail(item)"
                >
                    查看
                </span>
            </div>
            <div
                v-if="item.owner"
                class="message-delete"
                @click="showDeleteModalFn(item.commentId)"
            >
                <img
                    :src="icons.delete_icon[iconType]"
                    class="message-delete-icon"
                    alt="delete_icon"
                >
                删除
            </div>
        </div>
        <Toast
            :show="isShowToast"
            :msg="toastStr"
            @onHide="hideToast"
        />
        <div
            v-if="fetching && hasData"
            v-loading="fetching && hasData"
            class="message-list-loading"
            :class="{'message-bottom':showBottom}"
            background="none"
        />
        <!-- 删除留言确认框 -->
        <el-dialog
            title="确认删除该留言吗？"
            top="35vh"
            :visible.sync="showDeleteModal"
            center=""
            width="80%"
            custom-class="h5message-delete-modal"
            :show-close="false"
            :append-to-body="true"
        >
            <div class="message-delete-btn">
                <button
                    class="message-delete-btn-cancel"
                    @click="showDeleteModal=false"
                >
                    取消
                </button>
                <button
                    class="message-delete-btn-confirm"
                    :class="{'lagouEduTheme-confirm':lagouEduTheme}"
                    @click="deleteCourseComment()"
                >
                    确认
                </button>
            </div>
        </el-dialog>
    </div>
    <div v-else-if="showEmpty">
        <H5EmptyMessage />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import  { getHashString }  from '@/common/js/util/getParam';
import { fetchGetCourseCommentList, fetchUpdateCourseCommentLikeCount, fetcheDeleteCourseComment, fetcheGetMyCommentList } from '../../service';
import H5EmptyMessage from './h5EmptyMessage';
import { messageMixins } from './mixin';
export default {
    name: 'H5Message',
    components: {
        H5EmptyMessage
    },
    mixins: [messageMixins],
    props: {
        isMine: {
            type: Boolean,
            default: false
        },
        showEdit: {
            type: Boolean,
            default: false
        },
        showEmpty: {
            type: Boolean,
            default: false
        },
        update: {
            type: Boolean,
            default: false
        },
        showGray: {
            type: Boolean,
            default: false
        },
        isView: {
            type: Boolean,
            default: true
        },
        showMessageCount: {
            type: Boolean,
            default: true
        }
    },
    data() {
        let routeName = this.$route.name;
        let isCoursePage = routeName === 'courseContent';
        let expandCls = isCoursePage ? 'message-list-expand' : 'message-list-expand-color';
        return {
            courseCommentList: [],
            commentId: '',
            expand: false,
            expandCls,
            isCoursePage,
            icons: {},
            iconType: 'common',
            commentCount: 0,
            firstCompute: true,
            page_id: '1pz3',
            routeName,
            isFirstLoad: false
        };
    },
    computed: {
        ...mapGetters([
            'courseInfo'
        ]),
        showBottom() {
            let { type } = this.currentCourseLessons;
            return !this.hasPurchaseClass && type !== 'free' && !this.isMine;
        },
        showBorderTop() {
            return this.courseCommentList.length && this.isCoursePage;
        }
    },
    watch: {
        update(newVal, oldVal) {
            if (newVal) {
                this.getMyCommentList();
            }
        },
        currentCourseLessons(newVal, oldVal) {
            if (newVal.id === oldVal.id || !this.isFirstLoad) return;
            this.showEditContent = false;
            this.clearValue();
        },
        isView(newVal, oldVal) {
             if (newVal && !oldVal && this.firstCompute) {
                this.caculateListHeight();
                this.firstCompute = false;
             }
        }
    },
    mounted() {
        console.log('mounted++++++++++++ lagouEduTheme: ', this.lagouEduTheme);
        this.$nextTick(() => {
            this.getList();
        });
        this.icons = this.getIcon();
        this.iconType = this.lagouEduTheme ? 'lagouEduTheme' : 'common';
        window.addEventListener('scroll', (e) => {
            let selectEl = document.getElementsByClassName('message')[0];
            if (!selectEl || !this.isView) { return }
            let { bottom } = selectEl.getBoundingClientRect();
            if (parseInt(document.body.clientHeight) >= parseInt(bottom) && !this.fetching && !this.isMine) {
                this.fetching = true;
                setTimeout(() => {
                    //this.hasData && this.getCourseCommentList();
                }, 500);
            }
        }, true);
    },

    methods: {
        lessonDetail(item) {
            let { search, origin } = window.location;
            let id = item.lessonId;
            let url = `${origin}/course/courseInfo.htm${search}#/detail/h5?id=${id}`;
            this.eduPlatTrack('WebButtonClick', {
                'page_id': this.page_id,
                'button_name': '查看课时链接'
            });
            if (this.routeName === 'interactive') {
                this.jumpLink(url);
                return;
            }
            console.log('lessonDetail', this.$route.name);
            this.$router.push({
                name: 'H5Detail',
                query: { id, from: this.$route.name }
            });
        },
        jumpLink(url) {
            let redirectUrl = url;
            redirectUrl = 'lgedu://lgedu.com/h5/open?url=' + encodeURIComponent(url);
            sessionStorage && sessionStorage.setItem('interactCourseId', JSON.stringify({
                courseId: this.courseInfo.id
            }));
            window.location.href = redirectUrl;
        },
        getIcon() {
          let iconObj = {
            message_icon: { common: require('@/assets/public-class/message_icon@2x.png'), lagouEduTheme: require('@/assets/public-class/jd_xiaoke_ic_liuyan_m@2x.png') },
            like_icon: { common: require('@/assets/public-class/praise_icon_click@2x.png'), lagouEduTheme: require('@/assets/course/publi_ic_dianzan_pre@2x-min.png') },
            unlike_icon: { common: require('@/assets/public-class/praise_icon@2x.png'), lagouEduTheme: require('@/assets/course/publi_ic_dianzan@2x-min.png') },
            delete_icon: { common: require('@/assets/public-class/delete_icon@2x.png'), lagouEduTheme: require('@/assets/public-class/jd_xiaoke_ic_shanchu@2x.png') }
            };
            return iconObj;
        },
        toMessage() {
            if (!window.userInfo || !window.userInfo.id) {
                window.open('/frontLogin.do', '_self');
                return;
            }
            this.courseCommentList = [];
            let queryId = getHashString('id');
            this.$router.push({
                path: `/message`,
                query: { id: queryId }
            });
        },
        clearValue() {
            this.pageNum = 1;
            this.courseCommentList = [];
            //this.getCourseCommentList();
        },
        expandFn(index) {
            this.courseCommentList[index].expand = true;
        },
        getList() {
            // if (this.isMine) {
            //     this.getMyCommentList();
            // } else {
            //     this.getCourseCommentList();
            // }
        },
        // 计算行数 超过5行显示展示按钮
        cuntLine(ele, index) {
            let element =  ele && this.$refs[ele];
            if (element && this.isView) {
                let styles = window.getComputedStyle(element[0], null);
                let lineHeight = styles.lineHeight === 'normal' ? styles.fontSize : styles.lineHeight; // 判断行高
                let lh = parseInt(lineHeight, 10);
                let h = parseInt(styles.height, 10);
                this.courseCommentList[index].expand = (Math.round(h / lh) <= 3);
            }
        },
        showDeleteModalFn(id) {
            this.showDeleteModal = true;
            this.commentId = id;
        },
        getCourseCommentList() {
            let { courseId, id, type } = this.currentCourseLessons;
            if (!getHashString('id')) {
                id = '';
            }
            if ((!window.userInfo || !window.userInfo.id) || !this.hasPurchaseClass) {
                if (type === 'free' && getHashString('id')) {
                    id = '';
                }
            }
            let param = {
                courseId: courseId || this.courseInfo.id,
                lessonId: id,
                pageNum: this.pageNum,
                needCount: this.pageNum === 1
            };
            fetchGetCourseCommentList(param).then((res) => {
                if (res.state == 1 && res.content) {
                    if (this.pageNum === 1) {
                        this.commentCount = res.content.commentCount;
                    }
                    this.pageNum++;
                    this.courseCommentList = this.courseCommentList.concat(res.content.courseCommentList);
                    this.courseCommentList.map((val, index) => {
                        val.expand = true;
                        return val;
                    });
                    this.hasData = res.content.courseCommentList.length === 20;
                    this.fetching = false;
                }
            }).then(() => {
                this.caculateListHeight();
            }).catch((error) => {
                this.showToast('网络中断，稍后再试');
                this.fetching = false;
            }).finally(() => {
                this.isFirstLoad = true;
            });
        },
        caculateListHeight() {
            if (!this.isView) return;
            this.courseCommentList.forEach((val, index) => {
                this.$nextTick(() => {
                    this.cuntLine('list' + index, index);
                });
            });
        },
        getMyCommentList() {
            let { courseId, id } = this.currentCourseLessons;
            let param = {
                courseId: courseId || this.courseInfo,
                lessonId: id,
            };
            fetcheGetMyCommentList(param).then((res) => {
                if (res.state == 1) {
                    this.courseCommentList = res.content && res.content.courseCommentList;
                    this.fetching = false;
                    this.courseCommentList.map((val, index) => {
                        val.expand = true;
                        return val;
                    });
                    this.courseCommentList.length && this.$emit('getCommentList', true);
                }
            }).then(() => {
                this.caculateListHeight();
            }).catch((error) => {
                this.showToast('网络中断，稍后再试');
            });
        },
        updateCourseCommentLikeCount(id, flag, index) {
            if (!window.userInfo || !window.userInfo.id) {
                window.open('/frontLogin.do', '_self');
                return;
            }
            if (this.clickFlag) {
                return;
            }
            this.clickFlag = true;
            let param = {
                commentId: id,
                flag: flag
            };
            fetchUpdateCourseCommentLikeCount(param).then((res) => {
                this.clickFlag = false;
                if (res.state == 1) {
                    this.courseCommentList[index].like = flag;
                    if (flag) {
                        this.courseCommentList[index].likeCount++;
                    } else {
                        this.courseCommentList[index].likeCount--;
                    }
                }
            }).catch((error) => {
                this.clickFlag = false;
                this.showToast('网络中断，稍后再试');
            });
        },
        deleteCourseComment() {
            let param = { commentId: this.commentId };
            fetcheDeleteCourseComment(param).then((res) => {
                if (res.state == 1) {
                    let index = this.courseCommentList.findIndex((item) => item.commentId === this.commentId);
                    this.courseCommentList.splice(index, 1);
                    this.showDeleteModal = false;
                    if (!this.courseCommentList.length) {
                        this.$emit('getCommentList', false);
                    }
                }
            }).catch((error) => {
                this.showToast('网络中断，稍后再试');
            });
        }

    }
};
</script>
<style lang="less">
.el-dialog__wrapper{
    z-index: 9999 !important;
    .h5message-delete-modal{
    border-radius:10px;
    overflow: hidden;
    .el-dialog__title{
        color: #666;
        font-size: 16px;
    }
    .el-dialog__body{
            padding: 0;
    }
    .el-dialog__header{
        padding: 20px 0px;
        margin:0 20px;
        border-bottom: 1px solid #e8e9eb;
    }
    }
}

.el-loading-mask{
    z-index: 2;
    background: none;
}
.el-loading-spinner .path{
    stroke: #00B38A;
}
 .emoji{
    width: 40px;
    height: 40px;
    padding-top: 2px;
     vertical-align: text-top;
}


</style>
<style scoped lang="less">
    .comment-count {
        font-size:24px;
        color: #666666;
        font-weight: normal;
    }
    .message{
        padding: 50px 40px;
        background: #FFFFFF;
        font-family:PingFangSC-Regular,PingFang SC;
        font-size: 30px;
        &-topic{
            display: flex;
            &-title{
                font-size:40px;
                color: #333333;
                flex: 1;
                font-weight: bold;
            }
            &-write{
                width:178px;
                height:52px;
                background:rgba(0,179,138,1);
                border-radius:26px;
                border:1px solid rgba(0,179,138,1);
                font-size:24px;
                color: #ffffff;
                line-height: 52px;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                &-icon{
                    width: 28px;
                    height: 28px;
                    margin-right: 5px;
                }
            }
        }
        &-list{
            color: #333333;
            padding-top: 55px;
            &:first-of-type {
                padding-top: 50px;
            }
            &-container{
                overflow: hidden;
                position: relative;
            }
            &-expand-color, &-expand{
                position: absolute;
                width:100px;
                background:linear-gradient(90deg,rgba(252,253,253,0) 0%, rgba(255,255,255,1) 35%);
                color: #00B38A;
                text-align: right;
                line-height: 42px;
                bottom: 6px;
                right: 0;
                font-size: 28px;
            }
            &-loading{
                height: 50px;
                // padding-bottom: 50px;
            }
            &-title{
                display: flex;
                &-left{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    text-align: left;
                    &-name{
                        font-size: 28px;
                        font-weight: bold;
                    }
                    &-tag{
                        width:60px;
                        padding: 5px 0;
                        line-height: 20px;
                        text-align: center;
                        border-radius:2px;
                        font-size: 20px;
                        margin-right: 20px;
                        color: #ffffff;
                        font-weight: bold;
                    }
                }
                &-right{
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    &-icon{
                        width: 32px;
                        height: 32px;
                        margin-left: 8px;
                        transform: translateY(-2px);
                    }
                    &-praise{
                        font-size: 24px;
                        font-family:PingFangSC-Regular,PingFang SC;
                        font-weight:400;
                        color: #666666;
                        line-height:24px;
                        padding-top: 6px;
                    }
                }
            }
            &-content{
                color: #666666;
                font-size: 28px;
                margin-top: 11px;
                word-wrap: break-word;
                word-break: break-all;
                overflow: hidden;
                line-height: 50px;
            }
            &-replay{
                padding: 20px 20px 0;
                color: #666666;
                font-size:28px;
                word-break: break-all;
                position: relative;
                &-name{
                    font-weight: bold;
                }
                &:before {
                    position: absolute;
                    content: '';
                    width:4px;
                    height:28px;
                    background:rgba(204,204,204,1);
                    left: 0;
                    top: 30px;
                }
            }
            &-lesson {
                background:rgba(248,249,250,1);
                border-radius: 4px;
                font-size:24px;
                font-weight:400;
                color: #666666;
                margin-top: 18px;
                padding-left: 20px;
            }
            &-lesson-name {
                width: 0;
            }
            &-detail {
                color: #5580C8;
                font-size:24px;
                padding: 10px 20px;
            }
        }
        &-delete{
            color: #999999;
            font-size: 28px;
            display: flex;
            align-items: center;
            padding-top: 20px;
            width: 100px;
            &-icon{
                width: 28px;
                height: 28px;
                padding-right: 8px;
            }
            &-modal{
                border-radius: 20px;
                height: 1000px;
            }
            &-btn{
                width: 100%;
                height: 100px;
                line-height: 100px;
                box-sizing: border-box;
                text-align: center;
                font-size: 34px;
                display: flex;
                button{
                    border:0;
                    height: 48px;
                    margin: 30px 0;
                    background: #ffffff;
                    flex: 1;
                    box-sizing: border-box;
                    font-size: 34px;
                    &:active{
                        border: 0;
                    }
                    &:focus{
                        border: 0;
                    }
                }
                &-confirm{
                    color:#00B38A;
                    border-left:1px solid  #E8E9EB !important;
                }
                &-cancel{
                    color:#666666;
                }
            }
        }
    }
    .ellipsis{
        overflow: hidden;
        max-height: 150px;
    }
    .tag-type1{
        background:linear-gradient(135deg,rgba(75,171,234,1) 0%,rgba(114,199,255,1) 100%);
    }
    .tag-type2{
        background:linear-gradient(135deg,rgba(255,163,28,1) 0%,rgba(255,202,95,1) 100%);
    }
    .activityColor{
        color: #00B38A;
    }
    .el-dialog--center .el-dialog__body{
        padding: 0;
    }
    .mine-font{
        font-size: 32px;
        font-weight:bold;
    }
    .message-bottom{
        padding-bottom: 50px;
    }
    .message-border {
        border-top: 10px solid #F8F9FA;
    }
    // 教育
    .lagouEduTheme {
        .message-topic-write{
            color: #333333;
            border:none;
            background:#FBC546;
        }
        .message-list-expand,.message-list-expand-color{
           color: #E5A817;
            background:linear-gradient(90deg,rgba(252,253,253,0) 0%, rgba(255,255,255,1) 35%);
        }
        .message-list-content{
            font-size: 28px;
        }
        .tag-type1 {
            background:rgba(255,116,82,0.08);
            color: #FF7452;
        }
        .tag-type2 {
            background:rgba(107,160,250, 0.08);
            color: #6BA0FA;
        }
        .activityColor{
            color: #E5A817;
        }

    }
.lagouEduTheme-confirm{
    color:#E5A817 !important;
}
</style>
