<template>
    <div
        v-if="commentTags.length || commentVos.length"
        :class="{'appraisal':true,'is-pc':needUsePcClass}"
    >
        <div class="title">
            评价
        </div>
        <div class="tag-container clearfix">
            <div
                v-for="(tag, index) in commentTags"
                :key="index"
                class="tag"
            >
                {{ tag }}
            </div>
        </div>
        <div>
            <div
                v-for="(item, index) in commentVos"
                :key="index"
                class="comment-item"
            >
                <div class="person-info">
                    <img
                        class="avatar"
                        :src="item.userHeadUrl"
                        alt=""
                    >
                    <span class="name">{{ item.userName }}</span>
                </div>
                <div class="evaluation">
                    {{ item.evaluation }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { fetchDecorateComment } from '../../service';
export default {
    props: {
        needUsePcClass: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            commentVos: [],
            commentTags: []
        };
    },
    mounted() {
        fetchDecorateComment().then(res => {
            if (res.state !== 1) return;
            let { commentTags, commentVos } = res.content;
            commentTags = commentTags || [];
            commentVos = commentVos || [];
            Object.assign(this, {
                commentTags,
                commentVos
            });
            if (!commentVos.length && !commentTags.length) {
                this.$emit('hideEvaluation');
            }
        });
    }
};
</script>
<style lang="less" scoped>
.appraisal {
    padding: 60px 40px 0;
    border-top: 10px solid #F8F9FA;
    .title {
        font-weight: bolder;
        color: #333333;
        font-size:40px;
        margin-bottom: 32px;
    }
    .tag-container {
        margin-left: -20px;
    }
    .tag {
        float: left;
        background: rgba(107, 160, 250, 0.08);
        height:64px;
        line-height: 64px;
        font-size:28px;
        font-weight: bolder;
        color: #6BA0FA;
        padding: 0 20px;
        margin: 0 0 20px 20px;
        border-radius: 2px;
    }
    .comment-item {
        padding-top: 60px;
        &:first-of-type {
            padding-top: 40px;
        }
        .person-info {
            font-size:28px;
            line-height: 28px;
            font-weight:500;
            color: #333333;
        }
        .avatar {
            height: 48px;
            width: 48px;
            border-radius: 50%;
            vertical-align: middle;
        }
        .name {
            display: inline-block;
            vertical-align: middle;
            margin-left: 12px;
            font-weight: bolder;
        }
        .evaluation {
            font-size:28px;
            font-weight:400;
            color: #666666;
            margin-top: 16px;
        }
    }
}
.appraisal.is-pc{
    border-top: none;
    padding: 0;
    .title{
        font-size:28PX;
        font-weight:700;
        color:rgba(51,51,51,1);
        margin-bottom: 40PX;
        margin-top: 80PX;
    }
    .tag{
        font-size:16PX;
        font-weight:400;
        line-height: 48PX;
        color:rgba(0,179,138,1);
        height: 48PX;
        text-align: center;
        margin:0 0 16PX 20PX;
        background:#E9FAF7;
        border-radius:4PX;
        padding:0 20PX;
    }
    .tag-container{
        margin-left: -20PX;
    }
    .comment-item{
        padding-top: 0;
        margin-top: 60PX;
        &:first-of-type{
            margin-top: 44PX;
        }
        .avatar{
            width: 36PX;
            height: 36PX;
        }
        .name{
            font-size:18PX;
            font-weight:700;
            color:rgba(51,51,51,1);
            margin-left: 12PX;
        }
        .evaluation{
            margin-top: 24PX;
            font-size:16PX;
            color:rgba(102,102,102,1);
            line-height:22PX;
        }
    }
}
</style>

