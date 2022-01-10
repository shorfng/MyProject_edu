<template>
    <div class="recommend-content-pc">
        <div
            v-show="sidebarAds && sidebarAds.length"
            class="section-1"
        >
            <lagou-swiper :swiper-option="swiperOption" />
        </div>
        <div
                v-if="ads.imgUrl"
                :class="{
                'section-3': true,
                'section-hover': ads.link
            }"
        >
            <img
                    :src="ads.imgUrl"
                    class="active-img"
                    alt="活动页面"
                    @click="clickImg"
            >
        </div>
        <div class="section-2">
            <p class="title">
                精选文章
            </p>
            <ul class="article-content">
                <li
                    v-for="(item, index) in articleList"
                    :key="index"
                >
                    <p
                        v-if="index<3"
                        class="article-content-item text-overflow"
                    >
                        <span class="article-content-item-index">0{{ index+1 }}</span>
                        <a
                            class="article-content-item-name"
                            :href="item.topicUrl"
                            target="_blank"
                        >{{ item.topicName }}</a>
                    </p>
                </li>
            </ul>
            <p class="split-line">
                <span class="split-word">还可以在这里找到我们</span>
            </p>
            <ul class="social-list">
                <li
                    v-for="(item, index) in socialLink"
                    :key="index"
                    class="social-item"
                    :class="isHover(item)"
                    @click="linkSocialHtml(item.link)"
                    @mouseenter="index === 0 && showQr()"
                    @mouseleave="index === 0 && showQr(false)"
                >
                    <div
                        v-show=" index === 0 && qrStatus"
                        class="qr-wrapper"
                    >
                        <img
                            class="qr-wrapper-img"
                            src="~@assets/course-list/wechat-qr.png"
                            alt="二维码"
                        >
                    </div>
                    <img
                        class="social-item-img"
                        :src="item.url"
                        :alt="item.name"
                    >
                    <p class="social-name">
                        {{ item.name }}
                    </p>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
import LagouSwiper from './LagouSwiper';
import {getAds} from '../service';

import jsonp from 'jsonp';
export default {
    name: 'Recommend',
    components: { LagouSwiper },
    props: {
        sidebarAds: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            articleList: [],
            socialLink: [
                {
                    url: require('@assets/course-list/logo-wechat.png'),
                    name: '微信',
                },
                {
                    url: require('@assets/course-list/logo-zhihu.png'),
                    name: '知乎',
                    link: 'https://www.zhihu.com/org/la-gou-kai-wu-xun-lian-ying/activities'
                },
                {
                    url: require('@assets/course-list/logo-weibo.png'),
                    name: '微博',
                    link: 'https://weibo.com/p/1006066707072494/home?from=page_100606&mod=TAB#place'
                }
            ],
            swiperOption: {
                wrapperClass: {
                    'width': '330px',
                    'height': '192px',
                    'margin': '0 auto 30px'
                },
                paginationClass: {
                    display: 'none'
                },
                assetsList: []
            },
            qrStatus: false,
            spaceKeyURL: 'https://ggservice.lagou.com/promotionSpace/data?spaceKey=',
            ads: {}
        };
    },
    computed: {

    },
    watch: {
        sidebarAds: function(newVal) {
            this.swiperOption.assetsList = newVal.map((item) => {
                item.imgurl = item.img;
                item.link = item.link;
                return item;
            });
        }
    },
    created() {
        // this.axios.get('/topics').then((res) => {
        //     const { data: { state, content } } = res;
        //     if (state === 1) {
        //         this.articleList = content.data.topics;
        //     }
        // });
        this.getRightImgURL();
    },
    methods: {
        linkSocialHtml(url) {
            url && window.open(url);
        },
        showQr(flag = true) {
            this.qrStatus = flag;
        },
        isHover(item) {
            return item.link ? 'hover-pointer' : '';
        },
        getRightImgURL() {
            getAds(888).then((res)=>{
                const { img, link, status } = res.content && res.content[0] && res.content[0].adDTOList && res.content[0].adDTOList[0] || {};
                if(status){
                    this.ads = { imgUrl: img, link: link };
                }
            })
        },
        clickImg() {
            let { link } = this.ads;
            link && window.open(link);
        }
    }
};
</script>

<style lang="less" scoped>
    @import "~@less/common.less";
    .recommend-content-pc{
        float: left;
        margin-left: 20px;
        width: 330px;
        .section-1{
            height: 192px;
            margin-bottom: 30px;
        }
        .section-2{
            height: 284px;
            background: #fff;
            padding: 30px 30px 40px;
            margin-bottom: 20px;
            .title{
                .font(16px);
                color: #333;
                margin-bottom: 20px;
                font-weight: 500;
            }
            .article-content{
                .font(14px);
                margin-bottom: 40px;
                &-item{
                    line-height: 20px;
                    margin-bottom: 20px;
                    color: #666;
                    &:hover{
                        color: #0abf89;
                    }
                }
                &-item-index{
                    color: #ccc;
                }
                &-item-name{
                    color: #666;
                    margin-left: 5px;
                    &:hover{
                        color: #0abf89;
                    }
                }
            }
            .split-line{
                text-align: center;
                .split-word{
                    display: inherit;
                    color: #999;
                    font-size: 14px;
                    margin: 0 10px;
                    position: relative;
                    .line-common{
                        content: '';
                        display: inline-block;
                        position: absolute;
                        width: 30px;
                        height: 1px;
                        background-color: #D8D8D8;
                    }
                    &:after{
                        .line-common;
                        margin: 10px 0 0 13px;
                    }
                    &:before{
                        .line-common;
                        margin: 10px 0 0 -44px;
                    }
                }
                .line-unit{
                    width: 30px;
                    height: 3px;
                    border-top: 1px solid #D8D8D8;
                    display: inline-block;
                }
            }
            .social-list{
                margin-top: 20px;
                text-align: center;
                .social-item{
                    display: inline-block;
                    position: relative;
                    width: 80px;
                    height: 62px;
                    &:hover{
                        .social-name{
                            color: #0abf89;
                        }
                    }
                    .social-name{
                        color: #999;
                        margin-top: 4px;
                        font-size: 14px;
                    }
                    &-img{
                        width: 32px;
                        height: 32px;
                    }
                }
                .qr-wrapper{
                    position: absolute;
                    width: 140px;
                    height: 140px;
                    display: block;
                    z-index: 10;
                    background: #FFFFFF;
                    border: 1px solid #E3EBE9;
                    box-shadow: 0 2px 3px 0 rgba(0,0,0,0.08);
                    border-radius: 3px;
                    box-sizing: border-box;
                    left: -30px;
                    top: -150px;
                    &-img{
                        width: 138px;
                        height: 138px;
                    }
                }
            }
        }
        .section-3{
            height: auto;
            .active-img{
                width: 330px;
                height: inherit;
            }
        }
        .section-hover {
            cursor: pointer;
        }
        .app-guide{
            width: 330px;
            height: 160px;
            margin-bottom: 20px;
            .edu-image{
                width: 100%;
                height: 100%;
            }

        }
    }
</style>
