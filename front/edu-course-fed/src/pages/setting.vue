<template>
    <div >
        <CommonHeader :secName="'账号设置'"></CommonHeader>
        <div class='content-wrap'>
            <el-tabs :tab-position="'left'" class='tabs-wrap'>
                <el-tab-pane label="基本设置">
                    <div class='base-setting-wrap'>
                        <div class='avatar-text'>头像</div>
                        <img
                            v-if="userInfo.portrait"
                            :src='userInfo.portrait'
                            alt='用户头像'
                            class='avatar'
                        >
                        <div class='change-avatar-button'>
                            <el-upload
                                class="upload-demo"
                                :action="uploadImgUrl"
                                :on-success="handleAvatarSuccess"
                                :headers="uploadHeaderExtend"
                            >
                                <div class='change-avatar-wrap'><div class='change-icon'></div><span v-text="userInfo.portrait?'更换头像':'上传头像'"></span></div>
                            </el-upload>
                        </div>
                        <div class='avatar-text'>昵称</div>
                        <el-input v-model="userInfo.userName" placeholder="请输入内容" class='nick-name-input'></el-input>
                        <div class='base-info-send' @click="updateUserInfo">更新信息</div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="账号绑定">
                    <div class='bind-account-wrap'>
                        <div class='wechat-wrap'></div>
                        <div class='bind-text-wrap'>
                            <div class='one'>绑定微信</div>
                            <div class='two'> {{userInfo.weixinNickName ? `当前绑定账号：${userInfo.weixinNickName}` : '当前尚未绑定微信账号'}}</div>
                        </div>
                        <div class='bind-button' @click='bindAccountSwitch'>{{userInfo.weixinNickName ? '解除绑定>' : '绑定>'}}</div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="修改密码">
                    <div class='password-wrap'>
                        <div class='change-password-wrap'>
                            <div class='title'>账户密码</div>
                        </div>
                        <div class='change-password-button' @click='setPassWord'>{{userInfo.isUpdatedPassword ? '修改密码' : '设置密码'}}</div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <Footer />
        <el-dialog
            :class="{'bind-account-modal-wrap':true,'is-confirm':bindAccount.isBind}"
            title=""
            :visible.sync="bindAccount.showModal"
            :width="bindAccount.isBind ? '334px':'30%'"
        >
            <div v-if='!bindAccount.isBind'>
                <div class='qrcode-title'>微信登录</div>
                <img class='qrcode-item' :src='bindAccount.qrCodeUrl'>
                <div class='qrcode-text'>请使用微信扫描二维码登录 “拉勾教育”</div>
            </div>
            <div v-else>
                <div class='unbind-one'> 确认要解除与微信的绑定吗？</div>
                <div class='unbind-two'> 确认后，将不能使用微信登录拉勾教育</div>
            </div>
            <span slot="footer" class="dialog-footer" v-if='bindAccount.isBind'>
                <div class='confirm-button' @click="confirmBindModal">确 定</div>
                <div class='cancel-button' @click="closeBindModal">取 消</div>
            </span>
        </el-dialog>



        <el-dialog
            :title="''"
            :visible.sync="passWordSet.showModal"
            class='password-change-modal-wrap'
            width="30%"
        >
            <div v-if='userInfo.isUpdatedPassword'>
                <div class='password-modal-title'>修改密码</div>
                <el-form  :model="passWordFormOldAccount" label-width="70px">
                    <el-form-item label="当前密码">
                        <el-input v-model="passWordFormOldAccount.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input v-model="passWordFormOldAccount.newPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input v-model="passWordFormOldAccount.configPassword"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-else>
                <div class='password-modal-title'>设置密码</div>
                <el-form  :model="passWordFormNewAccount" label-width="70px">
                    <el-form-item label="输入密码">
                        <el-input v-model="passWordFormNewAccount.passWord"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input v-model="passWordFormNewAccount.confirmWord"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <div class='confirm-button' @click="confirmPassWordModal">确 定</div>
                <div class='cancel-button' @click="closePassWordModal">取 消</div>
            </span>
        </el-dialog>
        <Toast
            :show="isShowToast"
            :msg="toastStr"
            @onHide="hideToastHandler"
        />
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import HOST from '@/common/service/host';
    import { fetchUpdateInfo, fetchUserLogout, fetchUpdatePassword, fetchSetPassword, unBindWeChat, bindWeChat } from '@/service';

    import CommonHeader from '../components/setting/CommonHeader';
    import Footer from '@/common/components/Footer';

export default {
    name: 'Detail',
    components: {
        CommonHeader,
        Footer
    },
    data() {
        return {
            uploadImgUrl: HOST.gnctx + '/upload/img',
            uploadHeaderExtend: {
                Authorization: window.localStorage.getItem('accessToken')
            },
            toastStr: '',
            isShowToast: false,
            imageUrl: '',
            bindAccount:{
                isBind:true,
                showModal:false,
                qrCodeUrl:'https://s0.lgstatic.com/i/image/M00/04/62/Ciqc1F6z9KCAVC9tAADn9L3IVkk332.png'
            },
            passWordSet:{
                havePassWord:false,
                showModal:false
            },
            passWordFormNewAccount:{
                passWord:'',
                confirmWord:'',
            },
            passWordFormOldAccount:{
                passWord:'',
                confirmWord:'',
                currentWord:''
            }
        };
    },
    computed: {
        ...mapGetters(['userInfo', 'isLogin'])
    },
    mounted() {
        if(this.$route.query.msg){
            this.showToast(this.$route.query.msg);
            this.$router.push('/setting');
        }

    },
    methods: {
        ...mapActions(['getUserInfo']),
        updateUserInfo(){
            fetchUpdateInfo({
                portrait: this.imageUrl,
                userName: this.userInfo.userName
            }).then((res)=>{
                if(res.data.state === 1){
                    this.getUserInfo();
                    this.showToast('保存成功！');
                }else{
                    this.showToast(res.data.message);

                }
            });
        },
        hideToastHandler(){
            this.isShowToast = false;
        },
        bindAccountSwitch(){
            if(this.userInfo.weixinNickName){
                unBindWeChat().then(res=>{
                    if(res.data.state === 1){
                        this.getUserInfo();
                    }
                })
            }else{
                bindWeChat().then(res=>{
                    if(res.data.state === 1){
                        window.location.href = res.data.content;
                    }
                })
            }
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = res.content.name;
        },
        closeBindModal(){
            this.bindAccount.showModal = false
        },
        confirmBindModal(){
            fetchUserLogout(this.passWordFormOldAccount).then((res)=>{
                if(res.data.state === 200){
                    this.passWordSet.showModal = false;
                    this.showToast('修改成功');
                }else{
                    this.showToast(res.data.message);
                }
            });
            this.bindAccount.showModal = false
        },
        closePassWordModal(){
            this.passWordSet.showModal = false
        },
        confirmPassWordModal(){
            if(this.userInfo.isUpdatedPassword){
                fetchUpdatePassword(this.passWordFormOldAccount).then((res)=>{
                    if(res.data.state === 1){
                        this.passWordSet.showModal = false;
                        this.showToast('修改成功');
                    }else{
                        this.showToast(res.data.message);
                    }
                });
            }else{
                fetchSetPassword(this.passWordFormNewAccount).then((res)=>{
                    if(res.data.state === 200){
                        this.passWordSet.showModal = false;
                        this.showToast('设置成功');
                    }else{
                        this.showToast(res.data.message);
                    }
                });
            }

        },
        setPassWord(){
            this.passWordSet.showModal = true
        }

    }
};
</script>

<style lang="less" scoped>
    .content-wrap{
        width: 750PX;
        margin: 30PX auto 0 auto;
        min-height: 800PX;
    }
    .base-info-send{

    }
    .avatar-text{
        font-size:14PX;
        color:rgba(85,85,85,1);
        margin-bottom: 20PX;
    }
    .avatar{
        display: block;
        width: 80PX;
        height: 80PX;
        border-radius: 50%;
        margin-left: 8PX;
    }
    .change-avatar-button{
        width:96Px;
        height:30PX;
        border-radius:3PX;
        border:1px solid rgba(217,217,217,1);
        line-height: 30PX;
        color:rgba(85,85,85,1);
        text-align: center;
        margin-bottom: 60PX;
        margin-top: 20PX;
        font-size: 0;
    }
    .base-info-send{
        padding: 12PX 20PX;
        background:rgba(0,179,138,1);
        border-radius:3PX;
        font-size:16PX;
        color:rgba(255,255,255,1);
        margin-top: 40PX;
        float: left;
        cursor: pointer;
    }
    .bind-account-wrap{
        font-size: 0;
        width: 400PX;
    }
    .wechat-wrap,.bind-text-wrap{
        display: inline-block;
        vertical-align: top;
    }
    .wechat-wrap{
        width: 56PX;
        height: 56PX;
        margin-right: 20PX;
        background: url("../assets/course/wechat.png") no-repeat;
        background-size: 100% 100%;
    }
    .bind-text-wrap{
        font-size: 14PX;
        .one{
            font-size:18PX;
            color:rgba(51,51,51,1);
            margin-bottom: 12PX;
            margin-top: 6PX;
            line-height:18PX;
        }
        .two{
            color:rgba(85,85,85,1);
            line-height:14PX;
        }
    }
    .bind-button{
        font-size: 14PX;
        color:rgba(0,179,138,1);
        float: right;
        cursor: pointer;
        line-height: 56PX;
    }
    .qrcode-title{
        font-size:22PX;
        color:rgba(85,85,85,1);
        text-align: center;
    }
    .qrcode-item{
        display: block;
        width: 126PX;
        height: 126PX;
        margin: 29PX auto 27PX ;
    }
    .qrcode-text{
        width:168PX;
        font-size:14PX;
        color:rgba(85,85,85,1);
        line-height:21PX;
        text-align: center;
        margin: 0 auto;
    }
    .unbind-one{
        font-size:14PX;
        color:rgba(85,85,85,1);
        text-align: center;
        margin-bottom: 11PX;
        line-height:14PX ;
    }
    .unbind-two{
        font-size:12PX;
        color:rgba(153,153,153,1);
        line-height:12PX;
        text-align: center;
    }
    .change-avatar-wrap{
        font-size:14PX;
    }
    .change-icon{
        display: inline-block;
        vertical-align: top;
        width: 15PX;
        height: 15PX;
        background: url("../assets/course/upload.png") no-repeat;
        background-size: 100% 100%;
        margin-top: 7PX;
        margin-right: 6PX;
    }
    .change-password-wrap{
        float: left;
        .title{
            font-size:18PX;
            color:rgba(51,51,51,1);
            line-height:27PX;
        }
        .tips{
            font-size:14PX;
            color:rgba(85,85,85,1);
            line-height:21PX;
        }
    }
    .password-wrap{
        width: 300PX;
    }
    .change-password-button{
        float: right;
        font-size:14PX;
        color:rgba(0,179,138,1);
        line-height:21Px;
        cursor: pointer;
        margin-top: 12PX;
    }


    .password-change-modal-wrap{
        .password-modal-title{
            font-size:18PX;
            color:rgba(51,51,51,1);
            margin-bottom: 30PX;
        }
        .confirm-button,.cancel-button{
            display: inline-block;
            vertical-align: top;
            text-align: center;
            padding: 12PX 22PX;
            border-radius:3PX;
            font-size:16PX;
            line-height: 16PX;
            cursor: pointer;
        }
        .confirm-button{
            background:rgba(0,179,138,1);
            color:rgba(255,255,255,1);
        }
        .cancel-button{
            color:rgba(0,179,138,1);
            margin-left: 4px;
        }
        .dialog-footer{
            display: block;
            font-size: 0;
            text-align: left;
        }
    }



</style>

<style lang="less">
    .tabs-wrap{
        .el-tabs__nav{
            min-height: 500PX;
        }
        .el-tabs__item{
            padding-left: 0;
            padding-right: 62PX;
            font-size:14PX;
            font-weight:400;
            color:rgba(85,85,85,1);
            height: 50PX;
            &.is-active{
                color: #00b38a;
            }
        }
        .el-tabs__active-bar{
            background: #00b38a;
        }
        .el-tab-pane{
            padding-left: 57PX;
        }
    }
    .nick-name-input{
        .el-input__inner{
            padding: 0 12PX;
            width: 292PX;
        }
        .el-input.is-active .el-input__inner, .el-input__inner:focus {
            border-color: #00b38a;
            outline: 0;
        }
    }
    .bind-account-modal-wrap.is-confirm{
        .el-dialog__header{
            display: none;
        }
        .el-dialog__footer{
            background:rgba(250,250,250,1);
        }
        .confirm-button{
            display: inline-block;
            vertical-align: top;
            width:75PX;
            height:36PX;
            background:rgba(0,179,138,1);
            border-radius:24PX;
            text-align: center;
            line-height: 36PX;
            font-size:14PX;
            color:rgba(255,255,255,1);
            cursor: pointer;
        }
        .el-dialog__footer{
            text-align: center;
        }
        .cancel-button{
            display: inline-block;
            vertical-align: top;
            font-size:14PX;
            width:75PX;
            height:36PX;
            text-align: center;
            line-height: 36PX;
            color:rgba(51,51,51,1);
            cursor: pointer;
        }
    }
    .password-change-modal-wrap{
        .el-dialog__body{
            padding: 20PX 50PX;
        }
        .el-form-item__label{
            text-align: left;
        }
        .el-dialog__footer{
            padding: 0 50PX 50PX ;
        }
    }
</style>
