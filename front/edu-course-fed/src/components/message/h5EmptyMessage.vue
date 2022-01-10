<template>
    <div
        class="message-empty"
    >
        <div class="message-empty-title">
            精选留言
        </div>
        <div class="message-empty-content">
            <div
                class="message-empty-content-btn"
                @click="toMessage"
            >
                <img
                    v-if="lagouEduTheme"
                    src="@/assets/public-class/jd_xiaoke_ic_liuyan_m@2x.png"
                    class="message-empty-content-btn-icon"
                >
                <img
                    v-if="!lagouEduTheme"
                    src="@/assets/public-class/message_icon@2x.png"
                    class="message-empty-content-btn-icon"
                >
                写留言
            </div>
            <div class="message-empty-content-des">
                学习知识要善于思考，思考，再思考。 —爱因斯坦
            </div>
        </div>
    </div>
</template>

<script>
import  { getHashString }  from '@/common/js/util/getParam';
export default {
    name: 'H5EmptyMessage',
    data() {
        return {};
    },
    methods: {
        toMessage() {
            if (!window.userInfo || !window.userInfo.id) {
                window.open('/frontLogin.do', '_self');
                return;
            }
            let queryId = getHashString('id');
            this.$router.push({
                path: `/message`,
                query: { id: queryId }
            });
        }
    }
};
</script>
<style scoped lang="less">
.message-empty{
    padding: 40px;
    margin-top: 36px;
    // background: #F8F9FA;
    background: #FFFFFF;
    font-family:PingFangSC-Regular,PingFang SC;
    font-size: 32px;
    &-content{
        display: flex;
        padding: 100px 0 ;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &-btn{
            width:232px;
            height:72px;
            background:rgba(0,179,138,1);
            border-radius:26px;
            font-size:26px;
            border:1px solid rgba(0,179,138,1);
            color: #ffffff;
            line-height: 72px;
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
        &-des{
            color: #999999;
            font-size: 24px;
            margin-top: 40px;
        }
    }
    &-title{
        font-weight: bold;
        color: #333333;
    }
}
.lagouEduTheme{
    .messagepage-btn{
        border: none;
        background: #FBC546;
        color: #333333
    };
    .message-empty-content-btn{
        border: none;
        background: #FBC546;
        color: #333333
    }
}
</style>
