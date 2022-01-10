<template>
    <div
        v-if="!isCharge"
        class="public-class-footer"
    >
        <div
            v-if="isShowSecKillBtn"
            class="special-btn-wrap"
        >
            <SpecialAnimateBtn
                @gotoPurchaseClass="gotoPurchaseClass"
                @hideBtn="hideSecKillBtn"
            />
        </div>
        <H5ActivityBtn
            v-else-if="activityButtonInfo && isVideoAudioCourse"
            :discounts="discounts"
            :price="price"
            @gotoPurchaseClass="gotoPurchaseClass"
        />

        <div v-else>
            <div
                v-if="discountCoupon"
                :class="couponCls"
            >
                <span class="coupon-info">{{ discountCoupon }}</span>
                <div class="triangle" />
            </div>
            <!-- <span class="product-descript">{{ isNewDes }}</span> -->
            <span class="current-price">
                <span
                    v-if="!isVerifyUserId"
                    class="current-price-unite"
                >￥</span>
                <span>{{ discounts || price }}</span>
                <span
                    v-if="isVerifyUserId"
                    class="current-price-ios-unite"
                >勾豆</span>
            </span>
            <XButton
                action-type="button"
                class="purchase-button"
                type="primary"
                mini
                @click.native="gotoPurchaseClass"
            >
                {{ discountsTag || priceTag }}
            </XButton>
        </div>
    </div>
</template>

<script>
import { XButton } from 'vux';
import { mapGetters } from 'vuex';
import { getAppVersion, isBiggerThanSpecifiedVersion } from '../../common/js/userAgent/getVersion';
import { OSName } from '@js/userAgent/browser-name-and-OS';
import { isApp } from '@js/userAgent/getVersion';
import H5ActivityBtn from './H5ActivityBtn';
import SpecialAnimateBtn from '../common/SpecialAnimateBtn';
import { getRandom } from '@js/util/util';

export default {
    components: {
        XButton,
        H5ActivityBtn,
        SpecialAnimateBtn,
    },
    props: {
        isNewDes: {
            type: String,
            default: ''
        },
        discounts: {
            type: String,
            default: ''
        },
        price: {
            type: String,
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
        }
    },
    data() {
        return {
            discountCoupon: '',
            isVerifyUserId: window.userInfo && window.userInfo.id === 3659138,
            activityButtonInfo: window.activityButtonInfo || null,
            isSetSecKillBtn: true,
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
        //this.getCoupon();
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
    padding: 15px 0;
    width: 100%;
    line-height: 110px;
    position: fixed;
    bottom: 0px;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 0 40px;
    border-top: 1px solid #eeeeee;
    background: #ffffff;
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
        font-size: 52px;
        color: #ff7452;
        font-weight: 600;
    }
    .current-price-unite {
        font-size: 32px;
        margin-right: -15px;
    }
    .current-price-ios-unite {
        font-size: 24px;
        margin-left: -10px;
        display: inline-block;
    }
    .orgin-price {
        font-size: 28px;
        color: #999999;
    }
    .purchase-button {
        width: 500px;
        height: 80px;
        text-align: center;
        display: inline-block;
        font-size: 32px;
        color: #333333;
        border: none;
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border-radius: 45px;
        font-weight: 500;
        background:linear-gradient(270deg,rgba(250,168,62,1) 0%,rgba(251,197,70,1) 100%);
        &::after{
            border: none;
        }
        &:active{
            color: #333333;
        }
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
        display: flex;
        margin: 14px auto;
        border-radius: 45px;
        overflow: hidden;
        button{
            height: 80px;
            line-height:80px;
            border: unset;
            font-size:28px;
            font-weight:500;
            color:rgba(255,255,255,1);
        }
        .icon-fire{
            display: inline-block;
            width: 32px;
            height: 32px;
            background:url('../../assets/course/fire.png')no-repeat;
            background-size: contain;
            vertical-align: text-bottom;
        }
        .btn-prime-price{
            width: 250px;
            color:rgba(51,51,51,1);
            background:rgba(251,197,70,1);
        }
        .btn-prime-activity{
            flex:1;
            background:rgba(255,116,82,1);
        }
    }
}
</style>
