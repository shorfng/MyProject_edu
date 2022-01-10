<template>
    <div :class="hasCommentList ? 'content-color' : 'content'">
        <div class="messagepage">
            <div class="messagepage-title">
                {{ currentCourseLessons.theme }}
            </div>
            <div class="messagepage-edit">
                <!-- 编辑留言组件 -->
                <EditDiv
                    v-model="editValue"
                />
                <div class="flex">
                    <div
                        ref="editEmoji"
                        class="messagepage-edit-emoji"
                        @click="showEmoji=!showEmoji"
                    >
                        <img
                            src="../assets/public-class/jd_xiaoke_ic_biaoqing@2x.png"
                            alt=""
                            class="messagepage-edit-emoji-icon"
                        >
                    </div>
                    <div class="messagepage-edit-count">
                        <span
                            class="messagepage-edit-count-cur"
                            :class="{'red':editCount>2000}"
                        >
                            {{ editCount }}
                        </span>
                        <span class="messagepage-edit-count-max">
                            /2000
                        </span>
                    </div>
                </div>
                <!-- </editdiv> -->
            </div>
            <!-- emoji表情组件 -->
            <emoji-swiper
                v-if="showEmoji"
                id="myPanel"
                ref="myPanel"
                :swiper-option="swiperOption"
                @pickerEmoji="getEmoji"
            />
            <button
                class="messagepage-btn"
                :class="{'opacity':editCount<=0 || submitEditValue.length>2000 || isNull(editValue)}"
                @click.stop="submitMessage"
            >
                发表留言
            </button>
        </div>
        <H5Message
            :is-mine="true"
            :show-gray="true"
            :update="update"
            @getCommentList="getCommentList"
        />
        <Toast
            :show="isShowToast"
            :msg="toastStr"
            @onHide="hideToast"
        />
    </div>
</template>
<script>
import  H5Message  from '../components/message/h5Message';
import EmojiSwiper from '../components/common/EmojiSwiper';
import EditDiv from '../components/common/EditDiv';
import { mapGetters } from 'vuex';
import { fetchSaveCourseComment, fetcheDeleteCourseComment } from '../service';
import  { parseString, getImageByCodePoint, fromCodePoint }  from '@js/emoji/emoji';
import EmojiCodeList from '@js/emoji';
import { validateMixins } from '../components/message/mixin';
export default {
    name: 'Message',
    components: {
        H5Message,
        EmojiSwiper,
        EditDiv
    },
    mixins: [validateMixins],
    data() {
        return {
            myName: 'Message',
            courseName: window.courseInfo.courseName,
            swiperOption: {
                wrapperClass: {
                },
                assetsList: [
                ]
            },
            update: false,
            showEmoji: false,
            showPlaceHodel: true,
            editValue: localStorage.editValue || '',
            submitEditValue: localStorage.submitEditValue || '',
            emojiList: [],
            hasCommentList: false
        };
    },
    computed: {
        ...mapGetters([
            'currentCourseLessons'
        ]),
        editCount() {
            return this.submitEditValue.length;
        }
    },
    watch: {
        editValue(newVal, oldVal) {
            if (newVal == '<br>') {
                this.editValue = '';
                this.submitEditValue = '';
            }
            localStorage.setItem('editValue', newVal);
            this.submitEditValue = newVal.replace(/<img[^>]+data-emoji-code="([a-fA-F0-9_]+)[^>]+[\/]?>/gi, function (mathch, group1) {
                return fromCodePoint(group1);
            });
            localStorage.setItem('submitEditValue', this.submitEditValue);
        }
    },
    mounted() {
        this.swiperOption.assetsList = this.getEmojiList();
        document.onclick = (e) => {
            let panelEle = document.getElementById('myPanel');
            let emojiEle = this.$refs.editEmoji;
            if (panelEle && emojiEle) {
                if (!panelEle.contains(e.target) && !emojiEle.contains(e.target)) {
                    this.showEmoji = false;
                }
            }
        };
    },
    methods: {
        getEmojiList() {
            let count = 24; //每个面板展示24个表情
                let result = [];
                let len = Math.round(EmojiCodeList.length / count);
                let i = 0;
            EmojiCodeList.forEach((v) => {
                // let url = require(`@assets/emoji/icons/emoji_${v.code}.png`);
                let url = 'https://www.lgstatic.com/mds-pipline-fed/instantMessaging/common/img/blank.56398e76.gif';
                this.emojiList.push({ url: url, code: v.code });
            });
            for (; i < len; i++) {
                let childObj = this.emojiList.slice(i * count, (i + 1) * count);
                let emojiItem = { emojiList: childObj };
                result.push(emojiItem);
            }
            return result;

        },
        submitMessage(e) {
            let submitEditValue = this.trim(this.submitEditValue);
            if (!submitEditValue || submitEditValue.length > 2000) { return }
            this.saveCourseComment();
        },
        hideToast() {
            this.isShowToast = false;
            this.update = false;
        },
        getEmoji(val) {
            let showEmoji = getImageByCodePoint(val.code);
            this.editValue += showEmoji;
        },
        clearValue() {
            this.editValue = '';
            this.submitEditValue = '';
            localStorage.removeItem('editValue');
            localStorage.removeItem('submitEditValue');
        },
        saveCourseComment(res) {
            let { courseId, sectionId, id } = this.currentCourseLessons;
            let param = {
                sectionId: sectionId,
                courseId: this.currentCourseLessons.courseId,
                lessonId: this.currentCourseLessons.id,
                comment: this.submitEditValue
            };
            fetchSaveCourseComment(param).then((res) => {
                if (res.state == 1) {
                    this.showToast('发表成功');
                    this.clearValue();
                    this.update = true;
                }
            }).catch((error) => {
                this.showToast(error.message);
            });
        },
        getCommentList(status) {
            this.hasCommentList = status;
        }
    }
};
</script>

<style lang="less" scoped>
@import '~@less/emojih5.less';
.content-color {
        height: 100%;
    }
.flex{
    display: flex;
}
.opacity{
    opacity: 0.5;
}
.red{
    color: #FF7452;
}
.greyBg{
    background: #F8F9FA !important;
}
.messagepage{
    font-size:28px;
    padding: 0 40px 50px;
    font-family:PingFangSC-Regular,PingFang SC;
    color: #666666;
    background: white;
    .swiper-container {
        margin-top: 17PX;
    }
    &-title{
        height: 110px;
        line-height: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-wrap: break-word;
        word-break: break-all;
        position: relative;
        &::after{
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            border-bottom: 1px solid #E6E6E6;
            transform: scaleY(.5);
            transform-origin: left bottom;
        }
    }
    &-edit{
        font-size: 32px;
        position: relative;
        &-content{
            outline: none;
            height: 320px;
            overflow: scroll;
            margin-top: 20px;
            &-default{
                color: #cccccc;
            }
            overflow: auto;
            word-break: break-all;
            outline: none;
            user-select: text;
            white-space: pre-wrap;
            text-align: left;
            &[contenteditable=true]{
                user-modify: read-write-plaintext-only;
                &:empty:before {
                    content: attr(placeholder);
                    display: block;
                    color: #ccc;
            }
        }

        }
        &-emoji{
            width: 40px;
            height: 40px;
            &-icon{
                width: 100%;
                height: 100%;
            }
        }
        &-count{
            font-size:28px;
            text-align: right;
            flex: 1;
            color: #cccccc;
            &-cur{
                margin-right: -8px;
            }
        }

    }
    &-btn{
        width: 100%;
        height: 90px;
        font-size: 32px;
        line-height: 90px;
        background: #00B38A;
        color: #ffffff;
        border-radius: 45px;
        border:none;
        margin-top: 36px;
    }
}
.lagouEduTheme{
    .messagepage-btn{
        border: none;
        background: #FBC546;
        color: #333333
    };
    .opacity{
        opacity: 0.5;
        color: #ffffff;
    }
}
</style>
