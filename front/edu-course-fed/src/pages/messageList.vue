<template>
    <div >
        <CommonHeader secName="通知"></CommonHeader>
        <div class='content-wrap'>
            <div class='title'>新消息通知</div>
            <div class='list-wrap'>
                <div v-for='(item,index) in listData' :key='index' :class='{"list-item-wrap": true, "has-readed": item.hasRead}'>
                    <div class='title-wrap'>
                        <div class='one-title'>你的课程{{item.courseName}}更新了</div>
                        <div class='two-title'>{{item.theme}}</div>
                    </div>
                    <div class='click-button' @click='goToDetail(item)'>查看详情></div>
                </div>
                <div
                        v-if="listData.length == 0"
                        class="no-data course-ul-pc"
                >
                    <img
                            src="~@assets/course-list/no-course@2x.png"
                            alt=""
                            class="no-data-icon"
                    >
                    <div class="no-data-title">
                        您还没有消息
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import CommonHeader from '../components/setting/CommonHeader';
import Footer from '@/common/components/Footer';
import { getMessageList } from '@/service';

export default {
    name: 'Detail',
    components: {
        CommonHeader,
        Footer
    },
    data() {
        return {
            listData:[

            ]
        };
    },
    computed: {
    },
    mounted() {
        getMessageList({
            rows: 1000,
            page: 1
        }).then((res)=>{
            this.listData = res.data && res.data.content && res.data.content.rows || [];
        })
    },
    methods: {
        goToDetail(item){
            this.$router.push({ name: 'videoDetail', query: { lessonId: item.courseLessonId, courseId: item.courseId } });
        }
    }
};
</script>

<style lang="less" scoped>
    .content-wrap{
        width: 750PX;
        margin: 0 auto;
        min-height: 800PX;
    }
    .title{
        font-size:20PX;
        color:rgba(51,51,51,1);
        margin-top: 40PX;
        margin-bottom: 40PX;
    }
    .list-item-wrap{
        padding-bottom: 30PX;
        padding-top: 30PX;
        border-bottom: 1PX solid #E8E9EB;
        overflow: hidden;
        &:first-of-type{
            padding-top: 0;
        }
        &.has-readed{
            .one-title{
                color: #777;
            }
        }
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
    .title-wrap{
        float: left;
    }
    .click-button{
        float: right;
        font-size:14PX;
        color:rgba(0,179,138,1);
        cursor: pointer;
    }
    .one-title{
        font-size:16PX;
        font-weight:600;
        color:rgba(85,85,85,1);
    }
    .two-title{
        font-size:14PX;
        color:rgba(153,153,153,1);
    }


</style>
