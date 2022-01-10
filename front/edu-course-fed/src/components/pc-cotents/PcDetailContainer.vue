<template>
    <div
        v-show="purchasePortIsFetch"
        class="main-wrap"
    >
        <div v-if="!isShowBuyPage">
            <div class="main-title">
                {{ currentCourseLessons.theme }}
            </div>
            <div class="main-tips">
                {{ detailData.publishDate }}
                <span class="auth">{{ detailData.teacherDTO && detailData.teacherDTO.teacherName }}</span>
            </div>
            <div class="media-player-wrap">
                <PcVoiceBand
                    v-if="detailData.audioMediaDTO || detailData.videoMediaDTO"
                    :audio-media-data="detailData.audioMediaDTO"
                    :video-media-data="detailData.videoMediaDTO"
                    :current-lesson-last-play-history="currentLessonLastPlayHistory"
                />
            </div>
            <div class="main-container">
                <div
                    ref="richTextWrap"
                    class="rich-text-wrap"
                    v-html="detailData.textContent"
                />
            </div>
        </div>
        <div v-else>
            <div class="buy-page-wrap">
                <div class="image" />
                <div class="tips-main">
                    别偷看哦
                </div>
                <div class="tips-sec">
                    干货内容，付费后立即解锁
                </div>
                <div
                    class="buy-button"
                    @click="goToPay"
                >
                    {{ purchaseText }} ￥{{ buyPrice }}
                </div>
            </div>
        </div>
        <Purchase />
        <el-dialog
            :visible.sync="showImgModal"
            :modal-append-to-body="true"
            :append-to-body="true"
            :custom-class="'show-img-wrap'"
            :width="'60%'"
            center
        >
            <div
                class="video-content-wrap"
            >
                <img
                    class="img-item"
                    :src="showImgUrl"
                    @click="clickContentImg"
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PcVoiceBand from './PcVoiceBand';
import { fetchCourseLessonDetail, fetchLessonPlayHistory } from '../../service';
import Purchase from '../common/Purchase';
import { getParam } from '../../common/js/util/getParam';
import { Clipboard } from '@js/util/copy';
export default {
    name: 'PcDetailContainer',
    components: {
        PcVoiceBand,
        Purchase
    },
    data() {
        return {
            detailData: {},
            showImgModal: false,
            showImgUrl: '',
            currentLessonLastPlayHistory: 0
        };
    },
    computed: {
        ...mapGetters([
            'hasPurchaseClass',
            'courseInfo',
            'currentCourseLessons',
            'playerStatus',
            'purchasePortIsFetch'
        ]),
        isShowBuyPage: function() {
            let { type } = this.currentCourseLessons;
            let isLock = type === 'lock';
            return isLock;
        },
        buyPrice: function() {
            return this.courseInfo.discounts || this.courseInfo.price;
        },
        purchaseText: function() {
            let { courseInfo = {}, hasPurchaseClass } = this;
            let { discountsTag = '', priceTag = '' } = courseInfo;
            if (hasPurchaseClass) {
                return `查看详情`;
            } else {
                return `${discountsTag || priceTag}`;
            }
        }
    },
    watch: {
        currentCourseLessons: function(val) {
            if (!val.id) return;
            this.getCourseLessonDetail();
            this.switchSliderTime();
            this.reportLessonRecord();
        },
        showImgModal: function(data) {
            data ?
                (document.documentElement.style.overflowY = `hidden`) :
                (document.documentElement.style.overflowY = `auto`);
        }
    },
    mounted: function() {
        this.getCourseLessonDetail(true);
        this.reportLessonRecord();
    },
    methods: {
        ...mapActions([
            'triggerPurchase',
            'setIsPlayerFirstLoaded',
            'setLessonHistoryReq'
        ]),
        reportLessonRecord() {
            if (!window.userInfo || !window.userInfo.id) return;
            this.setLessonHistoryReq();
        },
        getCourseLessonDetail: function(isFirst = false) {
            let { type } = this.currentCourseLessons;
            let id = Number(this.$route.query.id);
            if (!id) return;
            if (!this.hasPurchaseClass && type !== 'free' && !isFirst) return;
            fetchCourseLessonDetail({ lessonId: id })
                .then((res) => {
                    if (res.state === 1) {
                    res.content.textContent = res.content.textContent.replace(/<pre>([\s\S]*?)<\/pre>/g, function(match, p1) {
                        let btnEl = p1.includes('<code') && p1.includes('</code>') ? '<div class="copy-btn">复制</div>' : '';
                        return '<pre>' + btnEl + p1 + '</pre>';
                    });
                        res.content.audioMediaDTO = res.content.audioMedia;
                        res.content.videoMediaDTO = res.content.videoMedia;
                        this.detailData = res.content;
                        this.$nextTick(() => {
                            this.contentDetailImgAddListener();
                            let rightContainer = document.querySelector('.right-content-wrap');
                            if (rightContainer) {
                                rightContainer.scrollTop = 0;
                            }
                        });
                    }
                })
                .catch(res => {
                });
            fetchLessonPlayHistory({ lessonId: id })
                .then(res => {
                    if (res.state === 1 && res.content) {
                        let { historyNode = 0 } = res.content;
                        this.currentLessonLastPlayHistory = historyNode;
                    }
                });
        },
        contentDetailImgAddListener() {
            $(this.$refs.richTextWrap).on('click', 'img', (e) => {
                let url = e.currentTarget && e.currentTarget.currentSrc || '';
                this.showImgUrl = url;
                this.showImgModal = true;
            });
            $(this.$refs.richTextWrap).on('click', '.copy-btn', (e) => {
                if (e.target.className === 'copy-btn') {
                    let val = e.target.nextSibling.innerText;
                    Clipboard(true).copy(val);
                    this.$message({
                        message: '复制成功',
                        type: 'success'
                    });
                }
            });
        },
        clickContentImg: function() {
            this.showImgModal && (this.showImgModal = false);
        },
        goToPay: function() {
            this.twoPlatTrack('1ncz', {
                address_id: '1nda',
                content_id: this.courseInfo.id || ''
            });
            window.trackPurchase = {
                page_id: '1ncz',
                props: {
                    address_id: '1ne6',
                    content_id: this.currentCourseLessons.id || ''
                }
            };
            this.triggerPurchase();
        },
        switchSliderTime: function() {
            if (this.currentCourseLessons.id !== this.playerStatus.id) {
                this.setIsPlayerFirstLoaded(false);
            } else {
                this.setIsPlayerFirstLoaded(true);
            }
        }
    }
};
</script>
<style lang="less">
    .main-container{
        img{
            // display: block;
            // margin: 0 auto;
            max-width: 100%;
            cursor: zoom-in;
        }
    }
    .el-dialog__wrapper{
        .video-modal-wrap,.show-img-wrap{
            .el-dialog__header{
                display: none;
            }
            .el-dialog__body{
                padding: 0;
            }
        }
    }
    .rich-text-wrap{
        font-size: 16PX;
        pre {
            width: 716PX;
        }
        @import '../../common/css/richText.less';
        @import '../../common/css/hljs.less';
    }
</style>
<style scoped lang="less">
    /deep/ .copy-btn{
        float: right;
        cursor: pointer;
        background: #fff;
        border: none;
        font-size: 12PX;
        color: #333;
        line-height: 1.5;
        padding: 2PX 10PX;
        font-weight: 500;
        border-radius: 3PX;
    }
    .show-img-wrap{
        .img-item{
            display: block;
            width: 100%;
            cursor: zoom-out;
        }
    }
  .main-wrap{
    max-width: 716PX;
      background-color: #fff;
    box-sizing: border-box;
      margin: 50PX auto;

      .main-title{
        font-weight: 700;
        font-size: 20PX;
        color: #333333;
        margin-bottom: 8PX;
    }
    .main-tips{
        font-size: 14PX;
        color: #999999;
        margin-bottom: 30PX;
        .auth{
            margin-left: 10PX;
        }
    }
    .media-player-wrap{
        margin-bottom: 40PX;
    }
    .buy-page-wrap{
      width: 200PX;
      margin: 0 auto;
      padding-top: 50PX;
      text-align: center;
      .image{
        width: 200PX;
        height: 200PX;
        background-image: url('../../assets/pc-detail/buy-icon.png') ;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .tips-main{
        font-size: 20PX;
        color: #333333;
        font-weight: 700;
        margin-top: 15PX;
      }
      .tips-sec{
        font-size: 16PX;
        color: #999999;
        margin-top: 10PX;
      }
      .buy-button{
        height: 44PX;
        background: #00B38A;
        border-radius: 2PX;
        line-height: 44PX;
        font-size: 16PX;
        color: #FFFFFF;
        text-align: center;
        margin-top: 30PX;
        cursor: pointer;
      }
    }
  }
</style>
