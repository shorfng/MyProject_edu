<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
    import loadScript from '@js/util/load-script';
    export default {
        data() {
            return {};
        },
        mounted() {
            if (!this.isLogin) {
                loadScript('https://passport.lagou.com/static/js/passport.js', {
                    id: '_lgpassport_',
                    'data-css-site': '0',
                    'data-css-popup': '0'
                }, () => {
                    /* 设置自动登录监听器 */
                    window.PASSPORT.on('autologin:succ', function(userInfo) {
                        window.location.reload();
                    });
                    window.PASSPORT.on('autologin:fail', function(data) {
                    });
                    /* 设置弹窗登录监听器 */
                    window.PASSPORT.on('popuplogin:succ', function() {
                        window.location.reload();
                    });
                    window.PASSPORT.on('popuplogin:fail', function() {
                    });
                    // 触发自动登录
                    window.PASSPORT.auto();
                });
            }
        }
    };
</script>
<style lang="less">
    @import "../common/css/template.less";
    @import "../common/css/common.less";
    #app {
        height: 100%;
    }
</style>
