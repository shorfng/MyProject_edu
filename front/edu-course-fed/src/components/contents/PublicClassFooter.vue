<template>
    <div
        v-if="!isCharge"
        class="public-class-footer"
    >
        <div
            v-if="isShowSecKillBtn && !isPc"
            class="special-btn-wrap"
        >
            <SpecialAnimateBtn
                @gotoPurchaseClass="gotoPurchaseClass"
                @hideBtn="hideSecKillBtn"
            />
        </div>
        <H5ActivityBtn
            v-else-if="activityButtonInfo&& !isPc && isVideoAudioCourse"
            :discounts="discounts"
            :price="price"
            @gotoPurchaseClass="gotoPurchaseClass"
        />
        <template v-else>
            <div
                v-if="discountCoupon"
                :class="couponCls"
            >
                <span class="coupon-info">{{ discountCoupon }}</span>
                <div class="triangle" />
            </div>
            <span class="product-descript">{{ discountsTag }}</span>
            <span class="current-price">
                <span class="current-price-unite">￥</span>
                {{ discounts || price }}
            </span>
            <span class="current-price price" v-if="discounts && price && discounts !== price">
                <span class="current-price-unite">￥</span>
                {{ price }}
            </span>
            <XButton
                action-type="button"
                class="purchase-button"
                type="primary"
                mini
                @click.native="gotoPurchaseClass"
            >
                立即购买
            </XButton>
        </template>
    </div>
</template>

<script>
import { XButton } from 'vux';
import { mapGetters } from 'vuex';
import H5ActivityBtn from './H5ActivityBtn';
import SpecialAnimateBtn from '../common/SpecialAnimateBtn';
import { getAppVersion, isBiggerThanSpecifiedVersion } from '../../common/js/userAgent/getVersion';

export default {
    components: {
        XButton,
        H5ActivityBtn,
        SpecialAnimateBtn
    },
    props: {
        isNewDes: {
            type: String,
            default: ''
        },
        discounts: {
            type: String | Number,
            default: ''
        },
        price: {
            type: String | Number,
            default: ''
        },
        discountsTag: {
            type: String,
            default: ''
        },
        priceTag: {
            type: String,
            default: ''
        },
        isCharge: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            discountCoupon: '',
            activityButtonInfo: window.activityButtonInfo || null,
            isSetSecKillBtn: true
        };
    },
    computed: {
        ...mapGetters([
            'isVideoAudioCourse',
            'courseInfo'
        ]),
        couponCls() {
            let cls = 'coupon ';
            cls += this.isPc ? 'pc-discount-coupon' : 'discount-coupon';
            if (!this.isNewDes) {
                cls += this.isPc ? ' pc-discount-coupon-no-new' : ' discount-coupon-no-new';
            }
            return cls;
        },
        isShowSecKillBtn() {
            let { joinSeckill, seckillRemainSeconds } = this.courseInfo;
            return joinSeckill && seckillRemainSeconds && this.isSetSecKillBtn;
        },
    },
    mounted() {
        //折扣信息
        // this.getCoupon();
    },
    methods: {
        getCoupon() {
            this.axios.get('https://gate.lagou.com/v1/neirong/coupon/promptCoupon', {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'X-L-REQ-HEADER': '{deviceType:1}'
                },
                params: {
                    courseId: this.$router.query.courseId
                }
            }).then(res => {
                let { state, message } = res;
                if (state === 1) {
                    let appVersion = getAppVersion();
                    let newPayVersion = '7.21.0';
                    if (appVersion && !isBiggerThanSpecifiedVersion(appVersion, newPayVersion)) return;
                    this.discountCoupon = message;
                }
            }).catch(err => {
                console.log('axios: ', err);
            });
        },
        gotoPurchaseClass() {
            this.$emit('gotoPurchaseClass');
        },
        hideSecKillBtn() {
            this.isSetSecKillBtn = false;
        },
    }
};

</script>

<style lang="less" scoped>
.public-class-footer {
    height: 130px;
    width: 100%;
    line-height: 130px;
    position: fixed;
    bottom: 0px;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 0 30px;
    border-top: 1px solid #eeeeee;
    background: #fff;
    box-sizing: border-box;
    max-width: 750PX;
    margin: 0 auto;
    .special-btn-wrap {
        padding: 14px 38px 14px 32px;
    }
    .product-descript {
        font-size: 26px;
        color: #333333;
    }
    .current-price {
        font-size: 40px;
        color: #ff7452;
        &.price{
            color: #999;
            text-decoration: line-through;
            padding-left: 2px;
            font-size: 12px;
        }
    }
    .current-price-unite {
        font-size: 26px;
        margin-right: -10px;
    }
    .orgin-price {
        font-size: 28px;
        color: #999999;
    }
    .purchase-button {
        width: 360px;
        height: 90px;
        text-align: center;
        display: inline-block;
        font-size: 32px;
        color: #ffffff;
        border: none;
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
    }
    .coupon {
        position: absolute;
        background: #FF7452;
        color: white;
        font-size: 12px;
        top: -20px;
        height: 44px;
        line-height: 46px;
        padding: 0 28px;
        border-radius: 44px;
        .triangle {
            position: absolute;
            width: 0;
            height: 0;
            top: 44px;
            border: 4px solid #ffffff;
            border-top-color: #FF7452;
            left: 50%;
            transform: translateX(-50%);
        }
    }
    .discount-coupon {
        font-size: 13PX;
        .coupon-info {
            font-size: 13PX;
        }
    }
    .pc-discount-coupon {
        height: 70px;
        line-height: 70px;
        padding: 0 50px;
        font-size: 32px;
        top: -40px;
        left: -40px;
        .triangle {
            border-width: 5px;
            top: 70px;
        }
    }
    .discount-coupon-no-new .triangle {
        left: 16%;
    }
    .pc-discount-coupon-no-new .triangle {
        left: 27%;
    }
    .gray-btn-containter{
        margin: 20px auto;
    }
}
</style>
