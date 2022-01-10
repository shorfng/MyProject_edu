<template>
    <div
        class="interact-box"
    >
        <div
            v-if="courseInteractVos.length"
            class="list"
        >
            <div
                v-for="(item, index) in courseInteractVos"
                :key="item.id"
                class="interact-section"
                :data-type="item.interactType"
                :show-type="item.showType"
            >
                <div
                    v-if="item.interactType === 'GENERIC_NOTIFICATION'"
                    class="flex a-center"
                >
                    <img
                        class="horn"
                        src="../../assets/course/jd_xiaoke_ic_tongzhi@2x-min.png"
                        alt=""
                    >
                    <div class="generic-title single-line">
                        {{ item.interactTitle }}
                    </div>
                    <div
                        class="btn-wrap flex-1 a-center flex"
                        @click="genericClick(item)"
                    >
                        <img
                            class="generic-arrow"
                            src="../../assets/course/publi_ic_arrow20_666@2x.png"
                            alt=""
                        >
                        <span class="generic-btn">{{ item.buttonText }}</span>
                    </div>
                </div>
                <div
                    v-if="item.interactType === 'PRESENT_COURSE'"
                    class="flex flex-column"
                >
                    <div class="present-title single-line">
                        {{ item.interactTitle }}
                    </div>
                    <div class="present-wrap flex">
                        <img
                            class="present-img"
                            :src="item.courseImgUrl"
                            alt=""
                        >
                        <div class="course-info">
                            <div class="course-title single-line">
                                {{ item.presentCourseName }}
                            </div>
                            <div class="course-desc single-line">
                                {{ item.courseDesc }}
                            </div>
                            <div class="price-wrap flex">
                                <span class="price-point">￥</span>
                                <span class="price">{{ item.coursePrice }}</span>
                            </div>
                        </div>
                        <button
                            class="btn"
                            @click="courseDetail(item)"
                        >
                            {{ item.buttonText }}
                        </button>
                    </div>
                </div>
                <div
                    v-if="item.interactType === 'JOIN_STUDY_GROUP'"
                    class="study-wrap"
                >
                    <div class="study-title single-line flex a-center">
                        <span>{{ item.interactTitle }}</span>
                        <img
                            v-if="item.showType === 'WECHAT_NUMBER'"
                            class="tip-img"
                            src="../../assets/course/jd_xiaoke_ic_shuoming@2x-min.png"
                            alt=""
                            @click="jumpLink('https://activity.lagou.com/topic/czsm.html')"
                        >
                    </div>
                    <div v-if="item.showType === 'QR_CODE'">
                        <div class="study-desc">
                            长按保存图片微信扫码入群
                        </div>
                        <div
                            class="flex a-center study-operate"
                            @click="jumpLink('https://activity.lagou.com/topic/ydsm.html')"
                        >
                            <span>如何操作</span>
                            <img
                                class="qrcode-arrow"
                                src="../../assets/course/publi_ic_arrow20@2x-min.png"
                                alt=""
                            >
                        </div>
                        <img
                            v-if="isWx"
                            class="qrcode-img"
                            :src="item.qrCodePicture"
                            alt=""
                        >
                        <div
                            v-else
                            id="qrcode"
                            class="qrcode-img"
                            :style="{backgroundImage: 'url(' + item.qrCodePicture + ')'}"
                            alt=""
                        />
                    </div>
                    <div v-else-if="item.showType === 'WECHAT_NUMBER'">
                        <div class="wechat-num single-line">
                            添加小助手微信：{{ item.wechatNumber }}
                        </div>
                        <button
                            class="copy"
                            @click="copy(item.wechatNumber)"
                        >
                            复制
                        </button>
                    </div>
                </div>
                <div
                    v-if="item.interactType === 'NOTICE'"
                    class="notice-wrap"
                >
                    <div class="section-title">
                        {{ item.interactTitle }}
                    </div>
                    <div
                        :class="{
                            'notice-content': true,
                            'muti-ellip': item.expand
                        }"
                    >
                        {{ item.noticeContent }}
                        <span
                            v-if="item.expand"
                            class="expand"
                            @click="expand(item, index)"
                        >全部</span>
                    </div>
                </div>
            </div>
        </div>
        <H5Message :is-view="isView" />
    </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';
import { COURSE_SET_COPY_RIGHT } from '@/store/actions';
import { fetchCourseInteracts } from '../../service';
import { copyContext, LongTap } from '@js/util/util';
import { isEduApp, isBiggerThanSpecifiedVersion, getEduAppVersion } from '@js/userAgent/getVersion';
import { browserName } from '@js/userAgent/browser-name-and-OS';
import H5Message from '../message/h5Message';

export default {
    components: {
        H5Message
    },
    props: {
        isView: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            courseInteractVos: [],
            isFirstLoad: true,
            routeName: this.$route.name,
            isInstallWeChat: false,
            qrCodeUrl: '',
            isWx: browserName === 'WX'
        };
    },
    computed: {
        ...mapGetters([
            'courseInfo'
        ])
    },
    mounted() {
        fetchCourseInteracts().then(res => {
            if (res.state === 1) {
                this.courseInteractVos = res.content || [];
                let isExitQrCodeIndex = this.courseInteractVos.findIndex(item => {
                    return item.showType === 'QR_CODE';
                });
                isExitQrCodeIndex > -1 && setTimeout(() => {
                    let url = this.courseInteractVos[isExitQrCodeIndex].qrCodePicture;
                    this.initSaveImg(url);
                }, 1000);
            }
            this.calculateNoticeHeight(res.content || []);
        });
        this.checkInstallWeChat();
    },
    methods: {
        ...mapMutations([
            COURSE_SET_COPY_RIGHT
        ]),
        getBase64(url, outputFormat = 'image/png') {
            return new Promise(function (resolve, reject) {
                let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    let img = new Image();
                img.crossOrigin = 'Anonymous'; // 重点！设置image对象可跨域请求
                img.onload = function () {
                    canvas.height = img.height;
                    canvas.width = img.width;
                    ctx.drawImage(img, 0, 0);
                    let dataURL = canvas.toDataURL(outputFormat);
                    canvas = null;
                    console.log('dataURL:', dataURL);
                    resolve(dataURL);
                };
                img.src = url + '?t=' + new Date().valueOf();
            });
        },
        initSaveImg(url) {
            let that = this;
            let qrcodeDOM = document.getElementById('qrcode');
            if (!qrcodeDOM) return;
            this.getBase64(url).then(urlData => {
                this.qrCodeUrl = urlData;
            });
            const qrcode = new LongTap(qrcodeDOM, 800);
            qrcode.longTap(() => {
                if (!window.lgBridge) return;
                this.track('JOIN_STUDY_GROUP');
                window.lgBridge.request('savePicture', {
                    data: {
                        pic: that.qrCodeUrl,
                        name: `qrcode-${new Date().getTime()}.png`,
                        isShowToast: false
                    }
                }, (res) => {
                    let confirmText = '保存成功，前往微信扫一扫二维码添加';
                    if (!this.isInstallWeChat) {
                        this.$emit('toast', '保存成功，请安装微信扫描二维码添加');
                        return;
                    }
                    this.judgeNativeModal(confirmText);
                });
            });
        },
        // 教育 App 并且大于 1.2.4，展示原生弹窗
        judgeNativeModal(confirmText) {
            if (isEduApp() && isBiggerThanSpecifiedVersion(getEduAppVersion(), '1.2.4')) {
                this.showWechatModal(confirmText);
            }
            else {
                this.$emit('showModal', {
                    confirmText
                }, true);
            }
        },
        showWechatModal(content) {
            this.showNativeDialog({
                title: '',
                content,
                img: '',
                confirmBtnText: '前往微信',
                cancelBtnText: '取消'
            }).then(res => {
                if (res.data && res.data.state === 1) {
                    window.lgBridge.request('openWeChat');
                }
            });
        },
        showNativeDialog(data, identifier = String(new Date().getTime()), type = 'modal') {
            return new Promise((resolve, reject) => {
                window.lgBridge && window.lgBridge.request('showTipDialog', {
                    data: { identifier, type, data }
                }, (res) => {
                    resolve(res);
                });
            });
        },
        expand(item, index) {
            item.expand = false;
            this.$set(this.courseInteractVos, item, index);
            this.track('NOTICE');
        },
        calculateNoticeHeight() {
            let noticeArr = [];
            this.courseInteractVos.forEach((item, index) => {
                if (item.interactType === 'NOTICE') {
                    noticeArr.push(index);
                }
                return false;
            });
            if (!noticeArr) {
                return;
            }
            this.$nextTick(() => {
                let doms = document.querySelectorAll('.notice-content');
                doms.forEach((dom, index) => {
                    let styles = window.getComputedStyle(dom, null);
                    let lineHeight = styles.lineHeight === 'normal' ? styles.fontSize : styles.lineHeight; // 判断行高
                    let lh = parseInt(lineHeight, 10);
                    let h = parseInt(styles.height, 10);
                    if (Math.round(h / lh) > 3) {
                        let dataIndex = noticeArr[index];
                        let item = this.courseInteractVos[dataIndex];
                        item.expand = true;
                        this.$set(this.courseInteractVos, dataIndex, item);
                    }
                });
            });
        },
        genericClick(item) {
            let { jumpType, jumpUrl, interactType } = item;
            this.track(interactType);
            if (jumpType === 'DIALOG') {
                this.$emit('showModal', item);
            }
            else if (jumpType === 'LINK') {
                this.jumpLink(jumpUrl);
            }
        },
        courseDetail(item) {
            let { presentCourseId, interactType } = item;
            this.track(interactType);
            this.jumpLink(`https://kaiwu.lagou.com/#/content?courseId=${presentCourseId}`);
        },
        jumpLink(url) {
            let redirectUrl = url;
            if (this.routeName === 'interactive') {
                redirectUrl = 'lgedu://lgedu.com/h5/open?url=' + encodeURIComponent(url);
            }
            console.log(redirectUrl);
            sessionStorage && sessionStorage.setItem('interactCourseId', JSON.stringify({
                courseId: this.courseInfo.id
            }));
            window.location.href = redirectUrl;
        },
        copy(wechatNumber) {
            this.track('JOIN_STUDY_GROUP');
            this.setPreventCopy(true);
            copyContext(wechatNumber).then(() => {
                if (!this.isInstallWeChat) {
                    this.$emit('toast', '复制成功，请安装微信添加好友');
                    return;
                }
                this.judgeNativeModal('复制成功，前往微信搜索好友添加');
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                this.setPreventCopy(false);
            });
        },
        checkInstallWeChat() {
            window.lgBridge && window.lgBridge.request('check_install', {
                'data': {
                    'app_names': ['wechat']
                }
            }, (res) => {
                if (res.data && res.data.data) {
                    let { wechat } = res.data.data;
                    if (wechat === 0) {
                        this.isInstallWeChat = true;
                    }
                }
            });
        },
        setPreventCopy(isPreventCopyRight) {
            if (this.routeName === 'interactive') {
                return;
            }
            let isFunc = typeof this.COURSE_SET_COPY_RIGHT === 'function';
            isFunc && this.COURSE_SET_COPY_RIGHT({
                data: { isPreventCopyRight }
            });
        },
        track(Interact) {
            let { id, courseName } = this.courseInfo;
            this.eduPlatTrack('CourseInteract', {
                Interact,
                courses_id: [String(id)],
                courses_name: [courseName]
            });
        }
    }
};
</script>
<style lang="less" scoped>
.interact-box {
    user-select: none;
}
.list {
    padding: 20px 30px;
}
.interact-section {
    padding: 40px 30px 40px 28px;
    background:rgba(248,249,250,1);
    border-radius: 6px;
    margin-top: 28px;
    &:first-of-type {
        margin: 0;
    }
    &[show-type='QR_CODE'] {
        background: url('~@/assets/course/jd_xiaoke_bg_saoma@2x-min.png') no-repeat;
        background-size: 100%;
    }
    &[data-type='GENERIC_NOTIFICATION'] {
        padding: 30px;
        .horn {
            width: 28px;
            height: 28px;
        }
        .generic-title {
            font-size:24px;
            line-height: 24px;
            color: #666666;
            margin-left: 12px;
            flex: 2;
            width: 0;
            max-width: 400px;
        }
        .btn-wrap {
            flex-direction: row-reverse;
        }
        .generic-arrow {
            width: 18px;
            height: 18px;
            margin: -1px 0 0 2px;
        }
        .generic-btn {
            font-size:24px;
            line-height: 24px;
            font-weight: 500;
            color: #333333;
        }
        .kw-icon-arrow {
            font-size: 18px;
            line-height: 18px;
        }
    }
    &[data-type='PRESENT_COURSE'] {
        .present-title {
            font-size:32px;
            font-weight:500;
            color: #333333;
        }
        .present-wrap {
            margin-top: 40px;
            position: relative;
        }
        .present-img {
            width: 120px;
            height: 160px;
        }
        .course-info {
            margin-left: 28px;
        }
        .course-title {
            font-size:28px;
            font-weight: bold;
            color: #333333;
            max-width: 400px;
        }
        .course-desc {
            font-size:24px;
            color: #666666;
            margin-top: 6px;
            max-width: 400px;
        }
        .price-wrap {
            margin-top: 21px;
            color: #FF7452;
            align-items: baseline;
        }
        .price-point {
            font-size: 24px;
        }
        .price {
            font-size: 36px;
        }
        .btn {
            height: 60px;
            line-height: 60px;
            background:rgba(251,197,70,1);
            border-radius:35px;
            padding: 0 33px;
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
    &[data-type='JOIN_STUDY_GROUP'] {
        position: relative;
        .study-title {
            font-size:32px;
            font-weight:500;
            color: #333333;
        }
        .study-desc {
            color: #666666;
            font-size:24px;
            font-weight:400;
            margin-top: 10px;
        }
        .kw-icon-arrow {
            font-size: 20px;
        }
        .study-operate {
            font-size: 24px;
            line-height: 24px;
            color: #E5A817;
            margin-top: 20px;
            padding-bottom: 60px;
            width: max-content;
        }
        .qrcode-arrow {
            width: 20px;
            height: 20px;
        }
        .qrcode-img {
            width: 210px;
            height: 210px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 40px;
            background-size: 100%;
        }
        .tip-img {
            width: 30px;
            height: 30px;
            margin-left: 10px;
        }
        .wechat-num {
            font-size:28px;
            color: #333333;
            margin-top: 22px;
            max-width: 500px;
        }
        .copy {
            height: 60px;
            line-height: 60px;
            width: 104px;
            text-align: center;
            position: absolute;
            right: 30px;
            bottom: 32px;
            font-size:28px;
            color: #333333;
            font-weight: bold;
            background:rgba(251,197,70,1);
            border-radius: 17px;
            outline: none;
            border: none;
        }
    }
    &[data-type='NOTICE'] {
        .section-title {
            font-size:32px;
            font-weight:500;
            color: #333333;
        }
        .notice-content {
            color: #666666;
            line-height: 50px;
            font-size:28px;
            margin-top: 20px;
            position: relative;
        }
        .muti-ellip {
            max-height: 150px;
            overflow: hidden;
            display: flex;
            justify-content: center;
        }
        .expand {
            position: absolute;
            line-height: 42px;
            padding-left: 5px;
            font-size:28px;
            color: #E5A817;
            bottom: 6px;
            right: 0;
            background: #f8f9fa;
            box-shadow: -7px 0 5px -5px #fff;
        }
    }
}
</style>

