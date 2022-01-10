<template>
    <div
        class="message"
        :class="{'pc-message':pcMessage,
                 'bottom': isCoursePage && !isCanShowPurchase,
                 'no-padding-top': noPaddingTop
        }"
    >
        <div class="message-topic">
            <div
                v-if="(showEmpty || courseCommentList.length)"
                class="message-topic-title"
                :class="isCoursePage ? 'normal-font' : ''"
            >
                精选留言
            </div>
            <div
                v-if="showEdit"
                class="message-topic-write pointer"
                @click.stop="showEditContentFn"
            >
                <img
                    src="@/assets/public-class/message_icon@2x.png"
                    class="message-topic-write-icon"
                >
                写留言
            </div>
        </div>
        <div v-if="showEditContent">
            <div class="message-edit">
                <!-- 编辑留言组件 -->
                <EditDiv
                    v-model="editValue"
                    :hodel-value="hodelValue"
                    :is-pc-env="true"
                />
                <div class="message-edit-count">
                    <span
                        class="message-edit-count-cur"
                        :class="{'red':submitEditValue.length>2000}"
                    >
                        {{ editCount }}
                    </span>
                    <span class="message-edit-count-max">
                        /2000
                    </span>
                </div>
            <!-- </editdiv> -->
            </div>
            <div class="message-edit-footer flex">
                <div
                    ref="editEmoji"
                    class="message-edit-emoji"
                    @click="showEmoji=!showEmoji"
                >
                    <img
                        v-if="!showEmoji"
                        src="@/assets/public-class/emoji@2x.png"
                        alt=""
                        class="message-edit-emoji-icon"
                    >
                    <img
                        v-if="showEmoji"
                        src="@/assets/public-class/emoji-green@2x.png"
                        alt=""
                        class="message-edit-emoji-icon"
                    >
                    <span :class="{'message-edit-green':showEmoji}">表情</span>
                </div>
                <button
                    class="message-edit-btn"
                    :class="{'disableBg':editCount<=0 || submitEditValue.length>2000 || isNull(editValue)}"
                    @click.stop="submitMessage"
                >
                    发表留言
                </button>
                <div
                    v-show="showEmoji"
                    id="myPanel"
                    ref="myPanel"
                    class="message-edit-emojilist"
                >
                    <em class="message-edit-emojilist-tip">&#9670;</em>
                    <span class="message-edit-emojilist-tip">&#9670;</span>
                    <img
                        v-for="(emoji,index) in emojiList"
                        :key="index"
                        :class="'emoji_' + emoji.code"
                        class="emoji-icon"
                        :src="emoji.url"
                        :data-src="emoji.url"
                        :data-code="emoji.code"
                        @click="clickEmoji"
                    >
                </div>
            </div>
        </div>
        <div
            v-if="!showEmoji && !courseCommentList.length && showEmpty && !showEditContent"
            class="message-edit-empty"
        >
            学习知识要善于思考，思考，在思考。—爱因斯坦
        </div>
        <div
            v-for="(item,index) in myCourseCommentList"
            v-show="showEditContent"
            :key="+item.id+'s'"
            class="message-list"
        >
            <div class="message-list-title">
                <div class="message-list-title-left">
                    <div class="message-list-title-left-name">
                        {{ item.nickName }}
                    </div>
                    <div
                        class="message-list-title-left-tag tag-type3"
                    >
                        我的留言
                    </div>
                </div>
                <div
                    class="message-list-title-right"
                    @click="updateCourseCommentLikeCount(item.id,!item.favoriteTag,index,'myCourseCommentList')"
                >
                    <img
                        v-if="item.favoriteTag"
                        class="message-list-title-right-icon"
                        src="@/assets/public-class/praise_icon_click@2x.png"
                        alt="right-icon"
                    >
                    <img
                        v-if="!item.favoriteTag"
                        class="message-list-title-right-icon"
                        src="@/assets/public-class/praise_icon@2x.png"
                        alt="right-icon"
                    >
                    <div
                        class="message-list-title-right-praise"
                        :class="{'greenColor': item.favoriteTag}"
                    >
                        {{ item.likeCount | likeNum }}
                    </div>
                </div>
            </div>
            <div
                class="message-list-content"
                v-html="parseString(item.comment) "
            />
            <div
                v-if="item.replayComment"
                class="message-list-replay"
            >
                <span class="message-list-replay-name">{{ item.replayComment.nickName }}：</span>
                {{ item.replayComment.comment }}
            </div>
            <div
                v-if="item.owner"
                class="message-delete pointer"
                :class="{'greenColor': showDeleteModal && myCourseCommentListIndex ==index && modalType==1}"
                @click="showDeleteModalFn('myCourseCommentListIndex',index,1)"
            >
                <img
                    v-if="showDeleteModal && myCourseCommentListIndex ==index && modalType==1"
                    src="@assets/public-class/delete_icon_green@2x.png"
                    class="message-delete-icon"
                    alt="delete_icon"
                >
                <img
                    v-else
                    src="@assets/public-class/delete_icon@2x.png"
                    class="message-delete-icon"
                    alt="delete_icon"
                >
                删除
                <div
                    v-if="showDeleteModal && myCourseCommentListIndex ==index && modalType==1"
                    class="message-delete-modal"
                >
                    <div class="message-delete-modal-title">
                        确认删除该留言？
                    </div>
                    <div class="message-delete-modal-btn flex">
                        <button
                            class="message-delete-modal-btn-confirm"
                            @click="deleteCourseComment(item.id,'myCourseCommentList',$event)"
                        >
                            确认
                        </button>
                        <button
                            class="message-delete-modal-btn-cancel"
                            @click="hideDeleteModalFn"
                        >
                            取消
                        </button>
                    </div>
                    <em class="message-edit-emojilist-tip">&#9670;</em>
                    <span class="message-edit-emojilist-tip">&#9670;</span>
                </div>
            </div>
            <div
                v-if="index==myCourseCommentList.length-1"
                class="message-line"
            />
        </div>
        <div
            v-for="(item,index) in courseCommentList"
            :key="item.id"
            class="message-list"
        >
            <div class="message-list-title">
                <div class="message-list-title-left">
                    <div class="message-list-title-left-name">
                        {{ item.nickName }}
                    </div>
                    <div
                        class="message-list-title-left-tag"
                        :class="item.showTeacher ? 'tag-type2' : item.top ? 'tag-type1':'' "
                    >
                        {{ item.label }}
                    </div>
                </div>
                <div
                    class="message-list-title-right"
                    @click="updateCourseCommentLikeCount(item.id,!item.favoriteTag,index,'courseCommentList')"
                >
                    <img
                        v-if="item.favoriteTag"
                        class="message-list-title-right-icon"
                        src="@/assets/public-class/praise_icon_click@2x.png"
                        alt="right-icon"
                    >
                    <img
                        v-if="!item.favoriteTag"
                        class="message-list-title-right-icon"
                        src="@/assets/public-class/praise_icon@2x.png"
                        alt="right-icon"
                    >
                    <div
                        class="message-list-title-right-praise"
                        :class="{'greenColor': item.favoriteTag}"
                    >
                        {{ item.likeCount | likeNum }}
                    </div>
                </div>
            </div>
            <div
                class="message-list-content"
                v-html="parseString(item.comment)"
            />
            <div
                v-if="item.replayComment"
                class="message-list-replay"
            >
                <span class="message-list-replay-name">{{ item.replayComment.nickName }}：</span>
                {{ item.replayComment.comment }}
            </div>
            <div
                v-if="item.owner"
                class="message-delete pointer"
                :class="{'greenColor': showDeleteModal && courseCommentListIndex ==index && modalType==2}"
                @click="showDeleteModalFn('courseCommentListIndex',index,2)"
            >
                <img
                    v-if="showDeleteModal && courseCommentListIndex==index && modalType==2"
                    src="@assets/public-class/delete_icon_green@2x.png"
                    class="message-delete-icon"
                    alt="delete_icon"
                >
                <img
                    v-else
                    src="@assets/public-class/delete_icon@2x.png"
                    class="message-delete-icon"
                    alt="delete_icon"
                >
                删除
                <div
                    v-if="showDeleteModal && courseCommentListIndex==index && modalType==2"
                    class="message-delete-modal"
                >
                    <div class="message-delete-modal-title">
                        确认删除该留言？
                    </div>
                    <div class="message-delete-modal-btn flex">
                        <button
                            class="message-delete-modal-btn-confirm"
                            @click="deleteCourseComment(item.id, 'courseCommentList',$event)"
                        >
                            确认
                        </button>
                        <button
                            class="message-delete-modal-btn-cancel"
                            @click="hideDeleteModalFn"
                        >
                            取消
                        </button>
                    </div>
                    <em class="message-edit-emojilist-tip">&#9670;</em>
                    <span class="message-edit-emojilist-tip">&#9670;</span>
                </div>
            </div>
        </div>
        <div
            v-if="fetching && hasData"
            v-loading="fetching && hasData"
            class="message-edit-loading"
            background="none"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import  { getHashString }  from '@/common/js/util/getParam';
import EditDiv from '../common/EditDiv';
import { fetchGetCourseCommentList, fetchUpdateCourseCommentLikeCount, fetcheDeleteCourseComment, fetcheGetMyCommentList, fetchSaveCourseComment } from '../../service';
import  { getImageByCodePoint, fromCodePoint }  from '@js/emoji/emoji';
import EmojiCodeList from '@js/emoji';
import { messageMixins, validateMixins } from './mixin';
export default {
    name: 'PcMessage',
    components: {
        EditDiv
    },
    mixins: [messageMixins, validateMixins],
    props: {
        isMine: {
            type: Boolean,
            default: false
        },
        showEdit: {
            type: Boolean,
            default: false
        },
        pcMessage: {
            type: Boolean,
            default: false
        },
        showEmpty: {
            type: Boolean,
            default: false
        }
    },
    data() {
        let isCoursePage = true;
        return {
            courseCommentList: [],
            myCourseCommentList: [],
            hodelValue: '分享学习心得、思考感悟或者给自己一个小鼓励吧！',
            editValue: '',
            submitEditValue: '',
            showEmoji: false,
            showEditContent: true,
            myCourseCommentListIndex: 0,
            courseCommentListIndex: 0,
            modalType: 1,
            clickSubmit: false,
            emojiList: [],
            isCoursePage,
            noPaddingTop: false
        };
    },
    computed: {
        ...mapGetters([
            'hasPurchaseClass',
            'courseInfo',
            'currentCourseLessons',
            'courseSections',
            'userInfo',
            'isLogin'
        ]),
        isCanShowPurchase() {
            return this.hasPurchaseClass === false;
        },
        editCount() {
            return this.submitEditValue.length || 0;
        }
    },
    watch: {
        editValue(newVal, oldVal) {
            if (newVal == '<br>') {
                this.submitEditValue = '';
                return;
            }
            this.submitEditValue = newVal.replace(/<img[^>]+data-emoji-code="([a-fA-F0-9_]+)[^>]+[\/]?>/gi, function (mathch, group1) {
                return fromCodePoint(group1);
            });
            localStorage.setItem('editValue', newVal);
            localStorage.setItem('submitEditValue', this.submitEditValue);
        },
        currentCourseLessons(newVal, oldVal) {
            if (newVal.id === oldVal.id) return;
            this.showEditContent = false;
            this.clearValue();
        }
    },
    mounted() {

        this.getList();
        EmojiCodeList.forEach((v) => {
            // let url = require(`@assets/emoji/icons/emoji_${v.code}.png`);
            let url = 'https://www.lgstatic.com/mds-pipline-fed/instantMessaging/common/img/blank.56398e76.gif';
            this.emojiList.push({ url: url, code: v.code });
        });
        let $el = document.getElementsByClassName('right-content-wrap')[0] || window;
        $el.addEventListener('scroll', (e) => {
            let target = e.target;
            if (target.scrollTop + target.offsetHeight >= target.scrollHeight && !this.fetching) {
                this.fetching = true;
                setTimeout(() => {
                    this.hasData && this.getCourseCommentList();
                }, 500);
            }
        }, true);
        document.onclick = (e) => {
            let panelEle = this.$refs.myPanel;
            let emojiEle = this.$refs.editEmoji;
            if (panelEle && emojiEle) {
                if (!panelEle.contains(e.target) && !emojiEle.contains(e.target)) {
                    this.showEmoji = false;
                }
            }
        };
    },
    methods: {
        ...mapActions(['setH5LoginModalStatus']),
        toMessage() {
            let queryId = getHashString('id');
            this.$router.push({
                path: `/message`,
                query: { id: queryId }
            });
        },
        getList() {
            this.getCourseCommentList();
            this.isMine && this.getMyCommentList();
        },
        submitMessage(e) {
            let submitEditValue = this.trim(this.submitEditValue);
            if (!submitEditValue || submitEditValue.length > 2000) { return }
            this.saveCourseComment();
        },
        clickEmoji(e) {
            let val = e.target.dataset;
            let showEmoji = getImageByCodePoint(val.code);
            this.editValue += showEmoji;
        },
        showEditContentFn() {
            if (!this.isLogin) {
                this.setH5LoginModalStatus({
                    showH5LoginModal: true,
                    showH5LoginModalType: 'distribution'
                });
                return;
            }
            this.showEditContent = !this.showEditContent;
            this.showEmoji = false;
        },
        errorMessage(message) {
            let msg = message || '网络中断，稍后再试';
            this.$message({
                message: msg,
                type: 'error'
            });
        },
        saveCourseComment(res) {
            if (this.clickSubmit) {
                return;
            }
            this.clickSubmit = true;
            let param = {
                courseId: this.$route.query.courseId,
                comment: this.submitEditValue
            };
            fetchSaveCourseComment(param).then((res) => {
                if (res.state == 1) {
                    this.clickSubmit = false;
                    this.$message({
                        message: '发表成功',
                        type: 'success'
                    });
                    this.clearValue();
                } else {
                    this.errorMessage(res.message);
                }
            }).catch((error) => {
                this.clickSubmit = false;
                this.errorMessage();
            });
        },
        clearValue() {
            this.editValue = '';
            this.showEmoji = false;
            this.submitEditValue = '';
            this.pageNum = 1;
            this.courseCommentList = [];
            this.myCourseCommentList = [];
            this.getList();
        },
        getCourseCommentList() {
            let param = {
                courseId: this.$route.query.courseId,
                pageNum: this.pageNum,
                pageSize: 1000
            };
            fetchGetCourseCommentList(param).then((res) => {
                if (res.state == 1 && res.content) {
                    let { content } = res;
                    if (this.pageNum === 1) {
                        this.setCourseFooterCls(content);
                    }
                    this.pageNum++;
                    this.courseCommentList = this.courseCommentList.concat(content);
                    this.hasData = content.length === 20;
                }else{
                    this.fetching = false;
                    this.hasData = false
                }

            }).catch(() => {
                this.fetching = false;
                this.errorMessage();
            });
        },
        setCourseFooterCls(courseCommentList) {
            // 只有是 boolean 值的时候，也就是数据回来的时候，再展示相关内容
            if (this.isCoursePage
                && courseCommentList.length
            ) {
                this.$emit('setCourseFooterCls');
            }
        },
        getMyCommentList() {
            let { courseId, id } = this.currentCourseLessons;
            let param = {
                courseId: courseId,
                lessonId: id,
            };
            fetcheGetMyCommentList(param).then((res) => {
                if (res.state == 1) {
                    this.myCourseCommentList = res.content && res.content.courseCommentList;
                }else{
                    this.fetching = false;
                }
            }).catch((error) => {
                this.fetching = false;
                this.errorMessage();
            });
        },
        updateCourseCommentLikeCount(id, flag, index, type) {
            if (!this.isLogin) {
                this.setH5LoginModalStatus({
                    showH5LoginModal: true,
                    showH5LoginModalType: 'distribution'
                });
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
                if (res.state == 1) {
                    this[type][index].favoriteTag = flag;
                    if (flag) {
                        this[type][index].likeCount++;
                    } else {
                        this[type][index].likeCount--;
                    }
                    this.clickFlag = false;
                }
            }).catch((error) => {
                this.clickFlag = false;
                this.errorMessage();
            });
        },
        //删除当前评论
        deleteCourseComment(curId, type, e) {
            e.stopPropagation();
            if (!this.isLogin) {
                this.setH5LoginModalStatus({
                    showH5LoginModal: true,
                    showH5LoginModalType: 'distribution'
                });
                return;
            }
            let param = { commentId: curId };
            fetcheDeleteCourseComment(param).then((res) => {
                if (res.state == 1) {
                    let myCourseCommentListIndex = this.myCourseCommentList.findIndex((item) => item.id == curId);
                    let courseCommentListIndex = this.courseCommentList.findIndex((item) => item.id == curId);
                    if (myCourseCommentListIndex >= 0) {
                        this.myCourseCommentList.splice(myCourseCommentListIndex, 1);
                    }
                    if (courseCommentListIndex >= 0) {
                        this.courseCommentList.splice(courseCommentListIndex, 1);
                    }
                    this.showDeleteModal = false;
                } else {
                    this.errorMessage(res.message);
                }
            }).catch((error) => {
                this.errorMessage();
            });
        },
        showDeleteModalFn(type, index, modalType) {
            this.showDeleteModal = true;
            this.modalType = modalType;
            this[type] = index;
        },
        hideDeleteModalFn(e) {
            e.stopPropagation();
            this.showDeleteModal = false;
        },

    }
};
</script>
<style lang="less">
    @import '~@less/emoji.less';
    .el-loading-spinner .path{
        stroke: #00B38A;
    }
    .el-message{
        min-width: 110PX;
        background: #ffffff;
        border:none;
        font-size: 14PX;
        box-shadow:0 2PX 6PX 0 rgba(0,0,0,0.17);
        padding:10PX 15PX;
    }
    .el-message--error .el-message__content{
        color: #333333;
    }
    .el-message--success .el-message__content {
        color: #333333;
    }
    .emoji{
        width: 20PX;
        height: 20PX;
        vertical-align: text-bottom;
    }

</style>
<style scoped lang="less">
    [v-cloak] {
    display: none;
    }
    .message{
        padding: 20PX;
        padding-bottom: 130px;
        background: #FFFFFF;
        font-family:PingFangSC-Regular,PingFang SC;
        font-size: 16PX;
        &-edit{
            font-size: 16PX;
            position: relative;
            padding: 0 14PX 34PX;
            height: 190PX;
            border: 1px solid #ebebeb;
            border-radius: 4PX;
            box-sizing: border-box;
            margin-top: 10PX;
        &-loading{
            height: 50PX;
            margin-bottom: 60PX;
            color: #00B38A;
            z-index: 2;
        }
        &-footer{
           display: flex;
           flex-wrap: wrap;
           justify-content: space-between;
           margin-top: 20PX;
           position: relative;
        }
        &-emoji{
            font-size: 14PX;
            color: #666666;
            &-icon{
                width: 20PX;
                height: 20PX;
            }
        }
        &-green{
            color:#00B38A;
        }
        &-empty{
            font-size: 14PX;
            color: #999999;
            margin: 80PX 0;
            text-align: center;
        }
        &-emojilist{
            position: absolute;
            top: 30PX;
            left: 0;
            width: 415PX;
            height:180PX;
            padding: 18PX 10PX;
            border: 1PX solid #E2EBE8;
            box-shadow:0PX 2PX 3PX 0PX rgba(0,0,0,0.08);
            background: #ffffff;
            border-radius: 5PX;
            z-index: 9;
            margin-bottom: 80px;
            &-emoji{
                width: 36PX;
                height: 40PX;
            }
            &-tip{
                display: block;
                width: 30PX;
                height: 16PX;
                font-size: 12PX;
                overflow: hidden;
                position: relative;
                margin-left: 15PX;
            }
            em{
                margin-top: -29PX;
                color: #e2ebe8;
                font-style: normal;
            }
            span{
                margin-top: -14PX;
                color: #fff;
            }
        }
        &-count{
            position: absolute;
            bottom: 5PX;
            right: 10PX;
            font-size:14PX;
            text-align: right;
            flex: 1;
            color: #cccccc;
            &-cur{
                margin-right: -5PX;
            }
        }
        &-btn{
            background: #00B38A;
            color: #ffffff;
            font-size: 14PX;
            width: 107PX;
            height: 40PX;
            line-height: 40PX;
            border: none;
            border-radius: 4PX;
        }

    }
        &-topic{
            display: flex;
            &-title{
                font-size:19PX;
                color: #333333;
                flex: 1;
                font-weight: bold;
                margin-bottom: 10PX;
            }
            .normal-font {
                font-weight: normal;
            }
            &-write{
                width:91PX;
                height:30PX;
                background:#00B38A;
                border-radius:4PX;
                font-size:14PX;
                color: #ffffff;
                line-height: 30PX;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                &-icon{
                    width: 14PX;
                    height: 14PX;
                    margin-right: 2PX;
                }
            }
        }
        &-list{
            color: #333333;
            padding: 20PX 0 30PX 0;
            &-title{
                display: flex;
                &-left{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    text-align: left;
                    &-name{
                        font-size: 28px;
                        margin-right: 10px;
                        font-weight: bold;
                    }
                    &-tag{
                        min-width:26PX;
                        height:16PX;
                        line-height: 16PX;
                        padding: 1PX 5PX;
                        text-align: center;
                        border-radius:1PX;
                        font-size: 10PX;
                        border-radius: 2PX;
                        color: #ffffff;
                    }
                }
                &-right{
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    &-icon{
                        width: 14PX;
                        height: 14PX;
                        margin-right: 4PX;
                    }
                    &-praise{
                        // min-width:20PX;
                        height:10PX;
                        font-size:14PX;
                        font-family:PingFangSC-Regular,PingFang SC;
                        font-weight:400;
                        color:#666;
                        line-height:13PX;
                    }
                }
            }
            &-content{
                color: #666666;
                font-size: 16PX;
                margin-top: 10PX;
                word-wrap: break-word;
                word-break: break-all;
                overflow: hidden;
                line-height: 30PX;
            }
            &-replay{
                padding: 10PX 20PX;
                margin-top: 10PX;
                background: #F7F7F7;
                color: #666666;
                line-height: 26PX;
                font-size:14PX;
                border-radius: 2PX;
                &-name{
                    font-weight: bold;
                }
            }
        }
        &-delete{
            color: #999999;
            font-size: 14PX;
            display: flex;
            align-items: center;
            padding-top: 8PX;
            position: relative;
            width: 50PX;
            &-icon{
                width: 14PX;
                height: 14PX;
                margin-right: 5PX;
            }
            &-modal{
                position: absolute;
                top: -120PX;
                left: 0;
                width:250PX;
                height:116PX;
                border-radius: 4PX;
                background:rgba(255,255,255,1);
                box-shadow:0px 2PX 3PX 0PX rgba(0,0,0,0.08);
                border:1PX solid rgba(226,235,232,1);
                &-title{
                    text-align: center;
                    margin-top: 25PX;
                    font-size: 14PX;
                    color: #555555;
                    font-weight: 600;
                }
                &-btn{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 32PX;
                    margin-top: 24PX;
                    font-size: 14PX;
                    button{
                        width: 78PX;
                        height: 32PX;
                        border-radius:28px;
                        border: none;
                    }
                    &-confirm{
                        background:#00B38A;
                        color: #ffffff;
                    }
                    &-cancel{
                        background: #ffffff;
                        color: #333333;
                    }
                }
                 em{
                    margin-top: 5PX;
                    color: #e2ebe8;
                    font-style: normal;
                }
                span{
                    margin-top: -18PX;
                    color: #fff;
                }
            }
        }
        &-line{
            height: 1PX;
            width: 100%;
            margin-top: 50PX;
            background: #E6E6E6;
        }
    }
    .ellipsis{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
    }
    .tag-type1{
        background:linear-gradient(135deg,rgba(75,171,234,1) 0%,rgba(114,199,255,1) 100%);
    }
    .tag-type2{
        background:linear-gradient(135deg,rgba(255,163,28,1) 0%,rgba(255,202,95,1) 100%);
    }
    .tag-type3{
        background:rgba(237,237,237,1);
        color: #666666;
    }
    .greenColor{
        color: #00B38A !important;
    }
    .emoji-icon{
        margin: 8PX;
        &:hover{
            transform:scale(1.2);
            transition:all 0.2s ease;
            cursor: pointer;
        }
    }
    .margin{
       margin:  0 11PX 12PX 0 ;
    }
    .disableBg{
        background: #cccccc;
    }
    .red{
        color: #FF7452;
    }
    .pc-message{
        /*padding: 0  0 50PX 0 !important;*/
        padding: 0 !important;
    }
    .pointer{
        cursor: pointer;
    }
    .bottom{
        padding-bottom: 0 !important;
    }
    .no-padding-top {
        padding-top: 0;
    }

</style>
