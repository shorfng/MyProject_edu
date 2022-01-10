<template>
    <div class="menu-top-tips inline-block">
        <img
            :src="courseInfo.courseListImg"
            class="image-wrap"
        >
        <div class="menu-top-tips-wrap inline-block">
            <div class="title">
                {{ courseInfo.courseName }}
            </div>
            <div class="name">
                {{ courseInfo.teacherDTO && courseInfo.teacherDTO.teacherName }}
                <div class="incise inline-block" />
                {{ courseInfo.teacherDTO && courseInfo.teacherDTO.position }}
            </div>
            <div v-if="courseInfo.sales" class="person">
                {{ courseInfo.sales }}人已购买
            </div>
            <div
                class="button"
                @click="clickButton"
            >
                {{ purchaseText }}
            </div>
        </div>
        <Purchase
            ref="Purchase"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Purchase from '../common/Purchase';
export default {
    components: {
        Purchase,
    },
    props: {
    },
    computed: {
        ...mapGetters([
            'hasPurchaseClass',
            'currentCourseLessons',
            'courseInfo'
        ]),
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
    methods: {
        ...mapActions([
            'triggerPurchase'
        ]),
        clickButton() {
            if (this.hasPurchaseClass) {
                this.$router.push({ name: 'courseContent', query: { courseId: this.courseInfo.id } });
            } else {
                this.twoPlatTrack('1ncz', {
                    address_id: '1nd8',
                    content_id: this.courseInfo.id || '',
                    ...window.pcDetailBuryRrport
                });
                window.trackPurchase = {
                    page_id: '1ncz',
                    props: {
                        address_id: '1ne6',
                        content_id: this.currentCourseLessons.id || ''
                    }
                };
                this.triggerPurchase();
            }
        }
    }
};
</script>

<style scoped lang="less">
  .inline-block{
    display: inline-block;
    vertical-align: top;
  }
  .menu-top-tips{
    background: #fff;
    padding: 25PX 0 25PX 30PX;
    width: 100%;
    height: 208PX;
    border-right: 1PX solid #ededed;
    position: relative;
    font-size: 0;
      z-index: 2;
    .image-wrap{
        width: 112PX;
        max-height: 146PX;
        overflow: hidden;
        margin-right: 20PX;
    }
    .menu-top-tips-wrap{
        width: 194PX;
        font-size: 12PX;
        color: #666666;
    }
    .title{
        font-size: 16PX;
        font-weight: 700;
        color: #333333;
        margin-bottom: 12PX;
        line-height: 22PX;
        margin-top: 4PX;
    }
    .name{
        margin-bottom: 8PX;
        line-height: 12PX;
    }
    .incise{
        width: 1PX;
        height: 8PX;
        background: #999999;
        margin: 2PX 7PX 0 7PX;
    }
    .person{
        margin-bottom: 18PX;
        line-height: 12PX;
    }
    .button{
        background: #00B38A;
        border: 1PX solid #00B28A;
        border-radius: 2PX;
        font-size: 14PX;
        width: 100PX;
        height: 30PX;
        color: #FFFFFF;
        line-height: 30PX;
        text-align: center;
        cursor: pointer;
        position: absolute;
        left: 162PX;
        bottom: 34PX;
    }
  }

</style>
