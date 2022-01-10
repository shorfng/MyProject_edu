<template>
    <div
        id="app"
        :class="{'lagouEduTheme':lagouEduTheme}"
    >
        <router-view />
        <AudioPlayer />
        <LoginModal />
    </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import '@/common/icon-font/style.less';
import { addBuyTarget } from '@js/pcLoginAutoBuy';
import loadScript from '@js/util/load-script';
import { getParam } from '@js/util/getParam';
import { SET_PURCHASE_PORT_IS_FETCH, COURSE_GET_PURCHASE } from './store/actions';

import { fetchSensorLogin } from '@service/sensorLogin';
export default {
    components: {
        AudioPlayer: () => import('./components/common/AudioPlayer.vue'),
        LoginModal: () => import('./components/common/LoginRegisterModal/LoginModal.vue')
    },
    computed: {
        ...mapGetters([
            'courseInfo',
            'getShareInfo',
            'currentCourseLessons',
            'isPreventCopyRight',
            'userInfo',
            'isLogin'
        ])
    },
    data() {
        return {};
    },
    created() {

    },
    mounted() {
        if (window.localStorage.getItem('accessToken')) {
            this.getUserInfo();
        }
    },
    methods: {
        ...mapActions([ 'setH5LoginModalStatus','getUserInfo', SET_PURCHASE_PORT_IS_FETCH]),
        ...mapMutations([
            SET_PURCHASE_PORT_IS_FETCH,
            COURSE_GET_PURCHASE
        ]),
        //设置复制版权信息
        setCopyData() {
            document.body.oncopy = event => {
                if (this.isPreventCopyRight) {
                    return;
                }
                event.preventDefault();
                let textFont = '';
                let copyFont = window.getSelection && window.getSelection(0) && window.getSelection(0).toString() || '';
                if (copyFont.length > 100 && event.target.type === 'input') {
                    copyFont = `${copyFont.substring(0, 100)}...`;
                    copyFont = copyFont.replace(/\s+/g, '');
                    textFont = `${copyFont}\n\n拉勾教育版权所有：https://kaiwu.lagou.com/#/content?courseId=${this.courseInfo && this.courseInfo.id}`;
                }
                textFont = copyFont;
                if (event.clipboardData) {
                    return event.clipboardData.setData('text', textFont); // 将信息写入粘贴板
                } else {
                    // 兼容IE
                    return window.clipboardData.setData('text', textFont);
                }
            };
        }
    }
};
</script>
<style lang="less">
    @import 'common/css/common.less';
    @import "common/css/template.less";

    [v-cloak] {
        display: none;
    }
    #app {
        height: 100%;
    }
    .header-pc-wrap{
        position: fixed;
        width: 100%;
        z-index: 10;
        left:0;
        top:0;
    }
    .lg_tbar_r{
        font-size: 14PX;
    }
    @media(min-width: 751px) {
        .el-message{
            box-shadow:0 2PX 6PX 0 rgba(0,0,0,0.17);
            min-width: 110PX;
            font-size: 23PX;
            padding:10PX 15PX;
        }
        .el-message__content {
            font-size: 15PX;
            line-height: 1;
        }
        .el-message--error .el-message__content{
            color: #333333;
        }
        .el-message--success .el-message__content {
            color: #333333;
        }
    }
</style>
