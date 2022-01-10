<template>
    <div
        class="gray-btn-containter"
    >
        <button
            class="btn btn-prime-price"
            @click="gotoPurchaseClass"
        >
            <span>{{ isVerifyUserId? `${discounts || price}勾豆`: `￥${discounts || price}` }}购买</span>
        </button>
        <button
            v-if="activityButtonInfo.link"
            class="btn btn-prime-activity"
            @click="gotoPurchaseActivity"
        >
            <i class="icon-fire" />
            <span>{{ activityButtonInfo.name }}</span>
            <i class="icon-arrow" />
        </button>
    </div>
</template>
<script>
import { getRandom } from '@js/util/util';
import { isApp } from '@js/userAgent/getVersion';
import { getParam, parseObjToUrl } from '@js/util/getParam';

export default {
    props: {
        discounts: {
            type: String,
            default: ''
        },
        price: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            isVerifyUserId: window.userInfo && window.userInfo.id === 3659138,
            activityButtonInfo: window.activityButtonInfo || null,
            page_id: '1pus',
        };
    },
    mounted() {
        this.eduPlatTrack('WebView', { page_id: this.page_id });
    },
    methods: {
        gotoPurchaseClass() {
            this.$emit('gotoPurchaseClass');
        },
        gotoPurchaseActivity() {
            this.eduPlatTrack('WebButtonClick', {
                'page_id': this.page_id,
                'button_name': '限时一元抢'
            });
            const { link } = this.activityButtonInfo;
            const param  = parseObjToUrl(Object.assign({}, { v: getRandom(6) }, getParam({ url: link })));
            let jumpUrl = `${link.split('?')[0]}?${param}`;
            if (isApp()) {
                jumpUrl = `https://www.lagou.com/center/login?forward=${window.encodeURIComponent(jumpUrl)}`;
            }
            window.location.href = jumpUrl;
        },
    }
};

</script>
<style lang="less" scoped>
    .gray-btn-containter{
        display: flex;
        border-radius: 45px;
        overflow: hidden;
        background: #fff;
        .btn{
            height: 80px;
            line-height:80px;
            border: unset;
            font-size:28px;
            font-weight:500;
            color:rgba(255,255,255,1);
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            outline: none;
            display: flex;
            align-items: center;
            justify-content: center
        }
        .icon-fire{
            display: inline-block;
            width: 32px;
            height: 32px;
            background:url('~@assets/course/fire.png')no-repeat;
            background-size: contain;
            margin-right: 10px;
        }
        .icon-arrow{
           display: inline-block;
            width: 16px;
            height: 16px;
            background:url('~@assets/course/arrow.png')no-repeat;
            background-size: contain;
            margin-left: 10px
        }
        .btn-prime-price{
            width: 250px;
            color:rgba(51,51,51,1);
            background:rgba(251,197,70,1);
        }
        .btn-prime-activity{
            flex:1;
            background:rgba(255,116,82,1);
        }
    }
</style>
