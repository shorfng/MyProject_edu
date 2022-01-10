<template>
    <div
        class="player-modal"
    >
        <div
            id="playerContent"
            class="player-content"
        >
            <div
                class="fold-container"
                @click="closePlayerModal"
            >
                <img
                    src="../../assets/public-class/player-modal-fold@2x.png"
                    class="fold-icon"
                >
            </div>
            <div
                v-if="isRealShowModal"
                class="show-top-container"
            >
                <div class="show-container">
                    <div class="chapter-title">
                        {{ playerStatus.theme }}
                    </div>
                    <div class="course-name single-line">
                        {{ courseInfo.courseName }}
                    </div>
                    <img
                        class="course-img"
                        :src="courseInfo.courseListImg"
                        alt=""
                    >
                    <div>
                        <div
                            v-if="!iscanHideFast"
                            class="adjust-speed"
                            @click="showSpeedModal"
                        >
                            {{ playerRate }}X<span class="speed-icon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            id="controlContentPlayer"
            class="control-container"
        >
            <div class="progress-bar-container">
                <div
                    class="progress-bar-before progress-bar-blank"
                />
                <ProgressBar
                    :tooltip-style="tooltipStyle"
                    :rail-style="railStyle"
                    @dragging="dragging"
                />
                <div class="progress-bar-after progress-bar-blank" />
            </div>
            <div class="time-content">
                <span class="current-time">{{ playerCurrentTime }}</span>
                <span class="total-time">{{ playerStatus.audioMediaDTO && playerStatus.audioMediaDTO.duration }}</span>
            </div>
            <div class="control-content">
                <div
                    class="control-content-left control-content-part"
                    @click="showSectionsModal"
                >
                    <img
                        class="control-content-icon"
                        src="../../assets/public-class/player-modal-content@3x.png"
                        alt=""
                    >
                    <div>课程目录</div>
                </div>
                <div
                    class="control-content-player"
                >
                    <img
                        class="control-content-player-icon control-content-player-pre-icon"
                        :class="disablePlayerPreCls"
                        src="../../assets/public-class/player-modal-next@2x.png"
                        alt=""
                        @click="goPrevious"
                    >
                    <div
                        class="control-content-play-icon"
                        @click="togglePlay"
                    >
                        <img
                            v-if="playerStatus.isPlaying"
                            class="control-content-play-img"
                            src="../../assets/public-class/player-modal-pause@2x.png"
                            alt=""
                        >
                        <img
                            v-else
                            class="control-content-play-img"
                            src="../../assets/public-class/player-modal-play@2x.png"
                            alt=""
                        >
                    </div>
                    <img
                        class="control-content-player-icon"
                        :class="disablePlayerNextCls"
                        src="../../assets/public-class/player-modal-next@2x.png"
                        alt=""
                        @click="goNext"
                    >
                </div>
                <div class="control-content-right control-content-part">
                    <img
                        class="control-content-icon control-content-icon-chapter"
                        src="../../assets/public-class/player-modal-chapter@2x.png"
                        alt=""
                        @click="goDetail"
                    >
                    <div>回到文字</div>
                </div>
            </div>
            <div
                v-if="hasPurchaseClass"
                class="has-purchase-tip"
            />
            <div
                v-else
                class="purchase-tip"
                @click="purchaseCourse"
            >
                <span>本节为免费试看，购买后解锁全部章节</span>
                <img
                    src="../../assets/public-class/player-modal-purchase.png"
                    alt=""
                    class="purchase-btn"
                >
            </div>
        </div>
        <H5PlayerSectionsModal
            :show="isShowSectionsModal"
            @closeSectionsModal="closeSectionsModal"
        />
        <H5PlayerRateModal
            :show="isShowSpeedModal"
            @closeSectionsModal="closeSpeedModal"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import H5PlayerSectionsModal from './h5PlayerSectionsModal';
import H5PlayerRateModal from './h5PlayerRateModal';
import ProgressBar from '../common/ProgressBar';
import { setTimeout } from 'timers';
export default {
    name: 'PlayerModal',
    components: {
        H5PlayerSectionsModal,
        H5PlayerRateModal,
        ProgressBar
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isShowSectionsModal: false,
            isShowSpeedModal: false,
            isRealShowModal: false,
            tooltipStyle: {
                padding: '2px 12px 2px 12px',
                borderRadius: '14px',
                fontSize: '14px',
                color: '#FFFFFF',
                background: 'rgba(0,0,0,0.35)',
                minWidth: '20px',
                borderColor: 'rgba(0,0,0,0.35)'
            },
            railStyle: {
                height: '3px',
                background: '#D5DADF',
                borderRadius: '1.5px',
            }
        };
    },
    mounted() {
        this.twoPlatTrack('1nd2', {
            address_id: '1niv',
            content_id: this.playerStatus.id || ''
        });
        this.setStyle();
    },
    computed: {
        ...mapGetters([
            'playerStatus',
            'playerRate',
            'playerAllTime',
            'playerCurrentTime',
            'hasPurchaseClass',
            'courseInfo',
            'iscanHideFast'
        ]),
        disablePlayerPreCls() {
            if (!this.playerStatus.isHasPrevious) {
                return 'disable-control';
            }
            else {
                return '';
            }
        },
        disablePlayerNextCls() {
            let { isHasNext, nextLesson } = this.playerStatus;
            // 1. 没有下一节；2.没有资源 3.没购买且不是免费
            return isHasNext ? '' : 'disable-control';
        }
    },
    methods: {
        ...mapActions([
            'setLessonPlayer',
            'setRate',
            'triggerPurchase'
        ]),
        setStyle() {
            let controlDOM = document.getElementById('controlContentPlayer');
            let playerContent = document.getElementById('playerContent');
            if (controlDOM && playerContent) {
                playerContent.style.bottom = controlDOM.offsetHeight + 'px';
            }
            this.isRealShowModal = true;
        },
        goPrevious() {
            if (!this.disablePlayerPreCls) {
                this.$router.push({ name: 'H5Detail', query: { id: this.playerStatus.previousLesson.id } });
                this.setLessonPlayer({
                    id: this.playerStatus.previousLesson.id,
                    isPlaying: true
                });
                this.twoPlatTrack('1nd2', {
                    address_id: '1ndx',
                    content_id: this.playerStatus.id || ''
                });
            }
        },
        togglePlay() {
            let { isPlaying } = this.playerStatus;
            this.setLessonPlayer({
                id: this.playerStatus.id,
                isPlaying: !isPlaying
            });
            let addressId = isPlaying ? '1ndz' : '1ndy';
            this.twoPlatTrack('1nd2', {
                address_id: addressId,
                content_id: this.playerStatus.id || ''
            });
        },
        goNext() {
            if (!this.disablePlayerNextCls) {
                this.$router.push({ name: 'H5Detail', query: { id: this.playerStatus.nextLesson.id } });
                this.setLessonPlayer({
                    id: this.playerStatus.nextLesson.id,
                    isPlaying: true
                });
                this.twoPlatTrack('1nd2', {
                    address_id: '1ndw',
                    content_id: this.playerStatus.id || ''
                });
            }
        },
        goDetail() {
            // 课程目录页去到对应课时
            let { name } = this.$route;
            if (name === 'courseContent') {
                this.$router.push({
                    name: 'H5Detail',
                    query: { id: this.playerStatus.id }
                });
            }
            this.twoPlatTrack('1nd2', {
                address_id: '1ne3',
                content_id: this.playerStatus.id || ''
            });
            this.closePlayerModal();
        },
        closePlayerModal() {
            this.$emit('closePlayerModal');
            this.twoPlatTrack('1nd2', {
                address_id: '1ne4',
                content_id: this.playerStatus.id || ''
            });
        },
        showSectionsModal() {
            this.isShowSectionsModal = true;
            this.twoPlatTrack('1nd2', {
                address_id: '1ne2',
                content_id: this.playerStatus.id || ''
            });
        },
        closeSectionsModal() {
            this.isShowSectionsModal = false;
        },
        showSpeedModal() {
            this.isShowSpeedModal = true;
            this.twoPlatTrack('1nd2', {
                address_id: '1ne1',
                content_id: this.playerStatus.id || ''
            });
        },
        closeSpeedModal() {
            this.isShowSpeedModal = false;
        },
        purchaseCourse() {
            this.triggerPurchase();
            this.twoPlatTrack('1nd2', {
                address_id: '1ne5',
                content_id: this.playerStatus.id || ''
            });
            window.trackPurchase = {
                page_id: '1nd2',
                props: {
                    address_id: '1ne7',
                    content_id: this.playerStatus.id || ''
                }
            };
        },
        dragging() {
            let dotDom = document.getElementsByClassName('vue-slider-dot')[0];
            let tooltipDom = document.getElementsByClassName('vue-slider-dot-tooltip-top')[0];
            let tooltipOffsetLeft = 45;
            let clientWidth = document.body.clientWidth;
            let { offsetLeft: dotOffsetLeft, offsetWidth: dotOffsetWidth } = dotDom;
            // 拖动到左边边界
            if (dotOffsetLeft - tooltipOffsetLeft <= 0) {
                tooltipDom.style.marginLeft = tooltipOffsetLeft - dotOffsetLeft + 'px';
            }
            // 拖动到右边边界
            else if (clientWidth - dotOffsetLeft - dotOffsetWidth - tooltipDom.offsetWidth / 2 < 0) {
                tooltipDom.style.marginLeft = clientWidth - dotOffsetLeft - dotOffsetWidth - tooltipDom.offsetWidth / 2 + 'px';
            }
            else {
                tooltipDom.style.marginLeft = 0;
            }
        }
    }
};
</script>
<style scoped lang="less">
    .progress-bar-container {
        position: absolute;
        left: 14px;
        right: 14px;
        top: -16px;
        .progress-bar-blank {
            height: 3PX;
            background: rgb(213, 218, 223);
            width: 16px;
            position: absolute;
            top: 7PX;
        }
        .progress-bar-before {
            left: -14px;
            background: rgb(0, 179, 138);
        }
        .progress-bar-after {
            right: -14px;
        }
    }
    .player-modal{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        background: #5B5D6E;
        text-align: center;
        font-family: PingFangSC-Regular;
    }
    .player-content {
        overflow-y: scroll;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }
    .fold-container {
        height: 88px;
        position: relative;
        .fold-icon {
            width: 40px;
            height: 16px;
            position: absolute;
            left: 50%;
            margin-left: -20px;
            bottom: 10px;
        }
    }
    .show-top-container {
        position: absolute;
        width: 100%;
        bottom: 0;
        top: 100px;
    }
    .show-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }
    .chapter-title {
        font-weight: bold;
        font-size: 32px;
        color: #FFFFFF;
        max-width: 550px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin: 0 auto;
    }
    .course-name {
        font-size: 26px;
        color: rgba(255, 255, 255, 0.7);
        max-width: 350px;
        margin: 16px auto 0;
    }
    .course-img {
        height: 380px;
        border-radius: 4px;
        margin: 40px auto 0;
    }
    .adjust-speed {
        height: 60px;
        border: 1px solid rgba(255,255,255,0.80);
        border-radius: 22px;
        font-size: 26px;
        color: #FFFFFF;
        line-height: 60px;
        margin: 55px auto 0;
        display: inline-block;
        width: 150px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        text-align: center;
    }
    .speed-icon {
        width: 14px;
        height: 14px;
        background: url("../../assets/public-class/player-modal-arrow-icon.png") no-repeat;
        background-size: contain;
        vertical-align: middle;
        margin-left: 10px;
        display: inline-block;
    }
    .control-container {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
    }
    .time-content {
        margin: 22px 30px 0;
        font-size: 24px;
        color: #999999;
        overflow: hidden;
    }
    .current-time {
        float: left;
    }
    .total-time {
        float: right;
    }
    .control-content {
        margin-top: 66px;
        position: relative;
        padding-bottom: 35px;
    }
    .control-content-part {
        font-size: 22px;
        color: #666666;
        text-align: center;
        position: absolute;
        top: 20px;
    }
    .control-content-left {
        left: 30px;
    }
    .control-content-right {
        right: 30px;
    }
    .control-content-icon {
        width: 40px;
        height: 40px;
        margin-bottom: 12px;
    }
    .control-content-icon-chapter {
        width: 36px;
    }
    .control-content-player {
        display: inline-block;
        margin: 0 auto;
    }
    .control-content-player-icon {
        width: 34px;
        height: 32px;
        margin-top: 40px;
    }
    .control-content-player-pre-icon {
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        transform: rotate(180deg);
    }
    .disable-control {
        opacity: 0.4;
    }
    .control-content-play-icon {
        width: 110px;
        height: 110px;
        margin: 0 65px;
        -webkit-background-size: contain;
        background-size: contain;
        background-repeat: no-repeat;
        display: inline-block;
        background-image: url("../../assets/public-class/player-modal-bg@2x.png");
        position: relative;
        .control-content-play-img {
            width: 50px;
            height: 50px;
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
        }
    }
    .purchase-tip {
        height: 80px;
        line-height: 80px;
        padding-left: 30px;
        text-align: left;
        position: relative;
        font-size: 26px;
        color: #9F7A1F;
        background: #FFFADC;
    }
    .has-purchase-tip {
        background: #ffffff;
        height: 40px;
    }
    .purchase-btn {
        position: absolute;
        right: 40px;
        top: 28px;
        height: 26px;
        width: 126px;
    }
</style>
