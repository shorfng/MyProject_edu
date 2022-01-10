<template>
    <div
        class="top-card-wrap"
    >
        <img
            class="bg"
            :src="courseInfo.courseListImg"
            alt=""
        >
        <div class="card-right">
            <div class="name">
                {{ courseInfo.courseName }}
            </div>
            <div class="brief">
                {{ courseInfo.brief }}
            </div>
            <div
                v-for="(item, index) in courseInfo.courseTags"
                :key="index"
                :class="{
                    'inline-block':true,
                    'tag-item': true,
                    'tag-item-last': index === courseInfo.courseTags.length - 1
                }"
            >
                {{ item }}
            </div>
            <div class="discounts-wrap">
                <span class="discounts">{{ courseInfo.discounts || courseInfo.price }}</span>
                <span
                    v-if="courseInfo.discounts && courseInfo.price && courseInfo.discounts !== courseInfo.price"
                    class="price"
                >
                    ￥{{ courseInfo.price }}
                </span>
            </div>
            <div class="top-button-wrap">
                <div
                    class="button-item buttton-left inline-block"
                    @click="learn"
                >
                    加入学习
                </div>
                <div
                    v-if="distributionInfo.brokerage"
                    class="button-item buttton-right inline-block"
                    @click="openDistribution"
                >
                    <div class="share-tips">
                        赚￥{{ distributionInfo.brokerage }}
                    </div>
                    <div class="shre-icon" />
                    <div class="text">
                        去分享
                    </div>
                </div>
            </div>
        </div>
        <PcDistributionDialog
            :visible="isPc && showDistribution"
            :share-url="distributionInfo.url"
            :money="distributionInfo.brokerage"
            @close="closeDistributionModal"
        />
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';
    import PcDistributionDialog from '../pc-cotents/PcDistributionDialog';
    export default {
        components: {
            PcDistributionDialog
        },
        props: {
            distributionInfo: {
            type: Object,
            default: () => {
                return {
                };
            }
        }
        },
        data() {
            return {
                showDistribution: false,
                page_id: '1pvk'
            };
        },
        computed: {
            ...mapGetters([
                'courseInfo',
            ]),
        },
        watch: {
        },
        mounted() {
        },
        methods: {
            openDistribution() {
                this.showDistribution = true;
                this.eduPlatTrack('WebButtonClick', { page_id: this.page_id, button_name: '分享赚' });
            },
            closeDistributionModal() {
                this.showDistribution = false;
            },
            learn() {
                this.eduPlatTrack('WebButtonClick', { page_id: this.page_id, button_name: '顶部加入学习' });
                this.$emit('goToLearn');
            }
        }
    };
</script>
<style lang="less" scoped>
    .top-card-wrap{
        font-size: 0;
        padding-bottom: 40PX;
        .bg{
            width: 480PX;
            height: 358PX;
            display: inline-block;
            vertical-align: top;
        }
        .card-right{
            display: inline-block;
            vertical-align: top;
            padding-left: 40PX;
            min-height: 358PX;
            width: 480PX;
            position: relative;
        }
        .name{
            font-size:24PX;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height:33PX;
            margin-bottom: 12PX;
        }
        .brief{
            font-size:16PX;
            color:rgba(153,153,153,1);
            line-height:22PX;
            margin-bottom: 20PX;
        }
        .tag-item{
            background:rgba(248,249,250,1);
            border-radius:4px;
            padding: 11PX 16PX;
            font-size:14PX;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:400;
            color:rgba(102,102,102,1);
            line-height: 14PX;
            margin-right: 16PX;
        }
        .discounts {
            color: #FF7452;
            font-size:32PX;
            font-weight: bolder;
            display: inline-block;
            vertical-align: top;
            &::before {
                display: inline;
                content: '￥';
                font-size: 20PX;
            }
        }
        .price {
            display: inline-block;
            vertical-align: top;
            font-size:16PX;
            color: #999999;
            text-decoration: line-through;
            padding-left: 7PX;
            padding-top: 19PX;
        }
        .discounts-wrap{
            padding-top: 17PX;
        }
        .top-button-wrap{
            position: absolute;
            left: 40PX;
            bottom: 0;
            font-size:20PX;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(255,255,255,1);
        }
        .button-item{
            border-radius:4PX;
            line-height: 52PX;
            text-align: center;
            cursor: pointer;
        }
        .buttton-left{
            width:200PX;
            height:52PX;
            margin-top: 2PX;
            background:rgba(0,179,138,1);
        }
        .buttton-right{
            box-sizing: border-box;
            width:125PX;
            height:52PX;
            margin-top: 2PX;
            background:rgba(0,179,138,0.1);
            border:1PX solid rgba(0,179,138,1);
            margin-left: 10PX;
            color:rgba(0,179,138,1);
            font-size: 0;
            position: relative;
        }
        .share-tips{
            position: absolute;
            padding: 4PX 6PX;
            background:rgba(255,116,82,1);
            border-radius:12PX 12PX 12PX 0;
            top:0;
            right: 0;
            transform: translate(50%,-50%);
            font-size:14PX;
            font-weight:400;
            line-height: 14PX;
            color:rgba(255,255,255,1);
        }
        .shre-icon{
            display: inline-block;
            vertical-align: middle;
            width: 20PX;
            height: 20PX;
            background: url('~@assets/course/sale/share.png') no-repeat;
            background-size: 100% 100%;
            margin-right: 7PX;
        }
        .text{
            display: inline-block;
            vertical-align: top;
            font-size:20PX;
        }
    }

</style>

