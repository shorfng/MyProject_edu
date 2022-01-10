<template>
    <div
        class="footer-back"
        :class="styleOffset"
        @click="backHome"
    >
        <i class="icon-home" />
        <span class="footer-back-word">返回首页</span>
    </div>
</template>

<script>
import { getParam } from '@js/util/getParam';

export default {
    name: 'BackHome',
    props: {
        isCharge: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        styleOffset() {
            return {
                'footer-back-offset': this.isCharge
            };
        }
    },
    methods: {
        backHome() {
            let isEnterprise = getParam('source') === 'enterprise';
            location.href = isEnterprise ? 'https://kaiwu.lagou.com/enterprise/index.html' : 'https://kaiwu.lagou.com';
        }
    }
};
</script>

<style scoped lang="less">
    .footer-back{
        width: 224px;
        height: 80px;
        line-height: 80px;
        box-sizing: border-box;
        background: #FFF;
        border: 0.5px solid rgba(151,151,151,0.21);
        box-shadow: 0 4px 18px 0 rgba(0,0,0,0.07);
        border-radius: 40px;
        text-align: center;
        font-size: 28px;
        position: fixed;
        right: 30px;
        bottom: 280px;
        color: #666;
        z-index: 5  ;
        cursor: pointer;
        &-word{
            margin-left: 34px;
            font-size: 28px;
        }
        .icon-home{
            background: url("~@assets/course-list/icon-home.png");
            display: inline-block;
            width: 34px;
            height: 34px;
            background-size: contain;
            position: absolute;
            top: 22px;
            left: 30px;
        }
        &-offset{
            bottom: 160px;
        }
    }
</style>