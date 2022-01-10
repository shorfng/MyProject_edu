<template>
    <div
        v-if="show"
        id="modal"
        class="weChat-modal"
    >
        <div class="content">
            <div class="purchase-tip">
                <img
                    class="purchase-icon"
                    src="../../../assets/public-class/icon-purchase@2x.png"
                    alt=""
                >
                <span class="purchase-text">购买成功</span>
            </div>
            <div class="course-name">
                伴读课：{{ joinInfo.courseName }}
            </div>
            <div class="link-content">
                <div class="line-content-left">
                    <div
                        v-for="(item, index) in joinInfo.wechatJoinTip"
                        :key="index"
                        class="link-word"
                    >
                        {{ item }}
                    </div>
                </div>
                <div class="link-signal">
                    {{ joinInfo.wechatUserTip }}
                </div>
                <div class="account-content">
                    <span class="account">{{ joinInfo.wechatNo }}</span>
                    <button
                        class="copy"
                        @click="copyText"
                    >
                        复制微信号
                    </button>
                </div>
            </div>
            <button
                class="link-btn"
                @click="confirmLink"
            >
                我已确认添加
            </button>
        </div>
        <Toast
            :show="isShowToast"
            :msg="toastStr"
            @onHide="hideToast"
        />
    </div>
</template>

<script>

export default {
    name: 'H5AccompanyModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        joinInfo: {
            type: Object,
            default: () => {
                return {
                    wechatJoinTip: []
                };
            }
        }
    },
    data() {
        return {};
    },
    mounted() {},
    methods: {
        confirmLink() {
            this.$emit('confirmLink');
        },
        copyText() {
            // 数字没有 .length 不能执行selectText 需要转化成字符串
            const textString = this.joinInfo.wechatNo.toString();
            this.Clipboard().copy(textString);
            this.showToast('复制成功');
        },
        Clipboard() {
            var input;
                var copy;
            function isOS() {
                return navigator.userAgent.match(/ipad|iphone/i);
            }

            function createInput(text) {
                input = document.createElement('input');
                input.style.height = '1px';
                input.style.width = '1px';
                input.contentEditable = true;
                input.readOnly = true;
                input.value = text;
                document.body.appendChild(input);
            }

            function selectText() {
                var range;
                    var selection;

                if (isOS()) {
                    range = document.createRange();
                    range.selectNodeContents(input);
                    selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    input.setSelectionRange(0, 999999);
                } else {
                    input.select();
                }
            }

            function copyToClipboard() {
                document.execCommand('copy');
                document.body.removeChild(input);
            }

            copy = function(text) {
                createInput(text);
                selectText();
                copyToClipboard();
            };

            return {
                copy: copy
            };
        }
    }
};
</script>

<style scoped lang="less">
    .weChat-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10;
    }
    .content {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background: white;
        text-align: center;
        padding: 60px 30px 30px;
    }
    .purchase-icon {
        width: 40px;
        height: 40px;
        margin-right: 6px;
        vertical-align: middle;
    }
    .purchase-text {
        font-family: PingFangSC-Medium;
        font-size: 40px;
        color: #00B08C;
    }
    .course-name {
        font-size: 22px;
        color: #999999;
        margin-top: 14px;
    }
    .link-content {
        background: #F9FAFB;
        padding: 60px 30px 50px;
        margin-top: 28px;
        position: relative;
    }
    .link-word {
        font-family: PingFangSC-Medium;
        font-size: 32px;
        color: #333333;
    }
    .link-signal {
        font-family: PingFangSC-Regular;
        font-size: 22px;
        color: #999999;
        margin-top: 30px;
    }
    .account-content {
        height: 74px;
        line-height: 74px;
        background: #ffffff;
        padding: 0 30px;
        font-family: PingFangSC-Regular;
        font-size: 32px;
        color: #666666;
        text-align: left;
        position: relative;
        margin: 23px 42px 0;
    }
    .account {
        display: inline-block;
        max-width: 320px;
    }
    .copy {
        font-family: PingFangSC-Regu89lar;
        font-size: 24px;
        color: #00B38A;
        position: absolute;
        top: 18px;
        right: 30px;
        background: white;
        border: none;
        &:active {
            color: #cccccc;
        }
        &::before {
            display: block;
            width: 1px;
            height: 25px;
            background: #E9E9E9;
            content: '';
            position: absolute;
            left: -28px;
            top: 6px;
        }
    }
    .link-btn {
        height: 88px;
        line-height: 88px;
        font-family: PingFangSC-Regular;
        font-size: 32px;
        color: #FFFFFF;
        background: #00B38A;
        border-radius: 2px;
        margin-top: 30px;
        padding: 0 20px;
        outline: none;
        border: none;
        width: 100%;
        &:active {
            background: #cccccc;
        }
    }
    #copy-input{
        position: absolute;
        left: -1000px;
        z-index: -1000;
    }
</style>