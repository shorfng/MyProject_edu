<template>
    <div class='header-pc-wrap'>
        <div class='wrap-box'>
            <div @click="toToIndex" class='edu-icon'></div>
            <div @click="toToIndex" class='text'>拉勾教育</div>
            <div class='right-var-wrap'
                 v-if="!isLogin"
            >
                <div class="login-handler" @click="goToLogin">登录 | 注册</div>
            </div>
            <div class='right-var-wrap'
                v-if="isLogin"
            >
                <div :class='{"tip-icon": true,"has-new-message": isHasNewMessage}' @click="toToNotic">
                    <i class="el-icon-bell"></i>
                </div>
                <img
                    :src='portrait'
                    class='avatar-wrap'
                />
                <div class="bar-wrap">
                    <ul
                        class="account-bar"
                    >
                        <li
                            class="user_dropdown"
                            data-lg-tj-track-code="index_user"
                        >
                            <span class="unick">{{userInfo.userName}}</span>
                            <i />
                            <ul>
                                <li @click="goToSetting">
                                    账号设置
                                </li>
                                <li @click="logoutHandler">
                                    退出
                                </li>
                            </ul>
                        </li>
                    </ul>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { fetchUserLogout, updateReadStatus, getUnReadMessage } from '@/service';
    import { mapGetters, mapMutations, mapActions } from 'vuex';
    import io from 'socket.io-client/dist/socket.io.js';

    export default {
    name: 'PcHeader',

    props:{

    },
    data(){
        return{
            isHasNewMessage: false
        }
    },
    computed:{
        ...mapGetters(['userInfo','isLogin']),
        portrait(){
            return this.userInfo.portrait || `//www.lgstatic.com/thumbnail_100x100/i/image2/M01/5E/65/CgotOVszSAOANi0LAAAse2IVWAE693.jpg`
        }
    },
    watch: {
        isLogin(val) {
            if(val){
                this.isLogin && this.setConnection();
                this.isLogin && getUnReadMessage().then(res=>{
                    if(res && res.content){
                        this.isHasNewMessage = true;
                    }
                });
            }
        }
    },
    mounted(){
        this.isLogin && this.setConnection();
        this.isLogin && getUnReadMessage().then(res=>{
            if(res && res.content){
                this.isHasNewMessage = true;
            }
        });
    },
    methods:{
        ...mapActions(['logoutUser','setH5LoginModalStatus']),
        // 建立ws连接
        setConnection() {
            let self = this;
            io.connect('http://edufront.lagou.com/push', {
                'path': '/push',
                'force new connection': true,
                'reconnection': true,
                'reconnectionDelay': 2000,                  // starts with 2 secs delay, then 4, 6, 8, until 60 where it stays forever until it reconnects
                'reconnectionDelayMax': 5000,               // 1 minute maximum delay between connections
                'reconnectionAttempts': 10,         // to prevent dead clients, having the user to having to manually reconnect after a server restart.
                'timeout': 10000,                           // before connect_error and connect_timeout are emitted.
                'transports': ['websocket', 'polling'],
                'query': {
                    'Authorization': window.localStorage.getItem('accessToken'),
                    'uri': window.location.pathname
                }
            }).on('connect', function(data) {

            }).on('disconnect', function(data) {

            }).on('message', function(message) {
                message = JSON.parse(message);
                let type = message.type;
                if(type == 1){
                    self.isHasNewMessage = true;
                }
            });
        },
        goToSetting(){
            this.$router.push('/setting');
        },
        toToNotic(){
            updateReadStatus().then(()=>{
                this.isHasNewMessage = false;
                this.$router.push('/messageList');
            });
        },
        goToLogin(){
            this.setH5LoginModalStatus({
                showH5LoginModal: true,
                showH5LoginModalType: 'distribution'
            });
        },
        logoutHandler(){
            fetchUserLogout();
            this.logoutUser();
        },
        toToIndex(){
            this.$router.push('/');
        }
    }
};
</script>

<style lang="less" scoped>

    .header-pc-wrap{
        width: 100%;
        height:40PX;
        background:rgba(35,39,43,1);
    }
    .wrap-box{
        width: 1200PX;
        height: 100%;
        margin: 0 auto;
    }
    .edu-icon{
        float: left;
        width: 24PX;
        height: 24PX;
        background: url("./static/img/Icon@2x.png") no-repeat;
        background-size: 100% 100%;
        margin-top: 8PX;
    }
    .text{
        font-size:16PX;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:40PX;
        float: left;
        margin-left: 6PX;
    }
    .login-handler{
        font-size:12PX;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:40PX;
        float: left;
        cursor: pointer;
    }
    .right-var-wrap{
        float: right;
        font-size: 0;
        text-align: right;
    }
    .tip-icon,.avatar-wrap,.bar-wrap{
        display: inline-block;
        vertical-align: top;
    }
    .tip-icon{
        font-size: 16PX;
        line-height: 40PX;
        margin-right: 26PX;
        color: #818895;
        cursor: pointer;
        &:hover{
            color: #fff;
        }
        &.has-new-message{
            position: relative;
            &:after{
                content: ' ';
                display: inline-block;
                position: absolute;
                top: 50%;
                width: 6PX;
                height: 6PX;
                border-radius: 3PX;
                background: red;
                right: 0;
                margin-top: -7PX;
            }
        }
    }
    .user_dropdown {
        position: relative;
        cursor: pointer;
        font-size: 14PX;
        text-align: center;
        &:hover {
            .unick {
                color: #fff;
            }
            i {
                -webkit-transform: rotate(180deg);
                -moz-transform: rotate(180deg);
                -ms-transform: rotate(180deg);
                -o-transform: rotate(180deg);
                transform: rotate(180deg);
                animation-fill-mode: forwards;
                border-color: #fff transparent transparent;
            }
            >ul {
                display: block;
                position: absolute;
                top: 40PX;
                width: 100%;
                min-width: 80PX;
                line-height: 30PX;
                background-color: #32373e;
                z-index: 1000;
                >li {
                    width: 100%;
                    height: 30PX;
                    &:hover {
                        background-color: #25282D;
                        color: #fff;
                    }
                }
            }
        }
        .unick {
            display: block;
            height: 40PX;
            line-height: 40PX;
            font-size: 14PX;
            color: #AFB5C0;
            max-width: 96PX;
            margin: 0 9PX;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            &:hover {
                color: #fff;
            }
        }
        >i {
            position: absolute;
            top: 17PX;
            right: 0;
            font-size: 0;
            height: 0;
            width: 0;
            border-width: 5PX 4PX 0;
            border-style: solid dashed;
            border-color: #AFB5C0 transparent transparent;
            overflow: hidden;
            -webkit-transition: all 0.4s ease 0s;
            -moz-transition: all 0.4s ease 0s;
            -ms-transition: all 0.4s ease 0s;
            -o-transition: all 0.4s ease 0s;
            transition: all 0.4s ease 0s;
        }
        >ul {
            display: none;
            color: #AFB5C0;
        }
    }
    .avatar-wrap{
        width: 24PX;
        height: 24PX;
        margin-top: 8PX;
        border-radius: 50%;
    }
</style>
