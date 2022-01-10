// import "babel-polyfill";
import { SubmitDataType, GoodsOrderPayType, PayInfoType } from './index.d'

import {
    getQueryString,
    isPC,
    isIphone,
    isLagouApp,
    isApp,
    isSupportNative,
    isEduApp,
    compareVersion,
    getEduAppVersion,
    isKw
} from "./util/index";

import {HOST, SERVICE_STATE, MESSAGE, PAY_TYPE, STATE, APP_VERSION, PRICE_CHANGE, ORDER_REPEAT, PAYED_ORDER} from "./const/index";

import H5Pay from "./pay/h5Pay";

import NativePay from "./pay/nativePay";

import PcPay from "./pay/pcPay/index";

import {
    createGoodsOrder,
    getPayInfo,
    getSaleGoodsPrice,
    goodsOrderPay,
} from "./services/order";

// @ts-ignore
import lgSa from 'lagou-mds-lgsa';

const SUPPORT_VERSION = '7.3.0';

const IOS_AUDITOR_ID = "3659138";

export const h5Pay = new H5Pay();




export default class LgPay {
    pay: typeof NativePay | typeof H5Pay  | typeof PcPay;
    static isCreatingOrder = false;
    static orderToken = '';
    STATE: any;
    PAY_TYPE: any;
    tryGoodsOrder: boolean;
    submitData: SubmitDataType;
    nativeExtraParams?: any;
    constructor() {
        let payType = this.getPayType();
        // @ts-ignore
        this.pay = this.getPay(payType);
        this.STATE = STATE;
        this.PAY_TYPE = PAY_TYPE;
        this.tryGoodsOrder = true;
    }

    getPay(payType: string) {
        let pay;
        switch(payType) {
            case PAY_TYPE.pc:
                pay = new PcPay();
            break;
            case PAY_TYPE.native:
                pay = new NativePay();
            break;
            case PAY_TYPE.h5:
                pay = new H5Pay();
            break;
            default:
            break;
        }
        return pay;
    }

    getPayType() {

        let _isIphone = isIphone();

        let isAPP = isLagouApp();

        let supportNative = isSupportNative(SUPPORT_VERSION);

        let userId = getQueryString('userId');

        if (isPC()) {
            return PAY_TYPE.pc;
        }

        if(isEduApp()) {
            let needSupportH5 = !compareVersion(getEduAppVersion(), '1.0.0');
            return needSupportH5 && PAY_TYPE.h5 || PAY_TYPE.native
        }

        if (!isAPP) {
            return PAY_TYPE.h5;
        }

        if (_isIphone && userId === IOS_AUDITOR_ID && supportNative) {
            return PAY_TYPE.native;
        }

        if (supportNative) {
            return PAY_TYPE.native;
        }
        return PAY_TYPE.h5;
    }

    submit(data: SubmitDataType) {
        this.submitData = data;
        // @ts-ignore
        return this.pay.submit(data);
    }

    // nativeExtraParams: 调用原生支付时传递的额外参数字段
    submitV2(data: SubmitDataType, nativeExtraParams?: any): any {
        data.expandInfo = data.expandInfo || window.location.href;
        this.submitData = data;
        data.orderToken = data.orderToken || window.orderToken;
        if(data.orderToken && !LgPay.orderToken ){
            LgPay.orderToken = data.orderToken;
            delete data.orderToken
        }
        this.nativeExtraParams = nativeExtraParams;
        if(!LgPay.isCreatingOrder) {
            LgPay.isCreatingOrder = true;
            return this.createPay();
        }
    }

    async kwPay(){
        // @ts-ignore
        return await this.pay.submit(this.submitData, this.nativeExtraParams)
    }

    // @ts-ignore
    async createPay(){
        let { goodsId, expandInfo } = this.submitData;
        let orderParams = {
            goodsId
        }
        let goodsOrder: GoodsOrderPayType = await createGoodsOrder(orderParams).catch((err: any) => {
            LgPay.isCreatingOrder = false;
        });
        LgPay.orderToken = goodsOrder.shopOrderToken;
        if(goodsOrder.orderNo) {
            let orderPay: any = {
                ...goodsOrder
            };
             let isNeedPay = true;
             orderPay = {
                 ...goodsOrder,
                 // @ts-ignore
                 ...(orderPay || {})
             };
             if (isNeedPay && isSupportNative(APP_VERSION.newPayVersion)) {
                 return await this.needPayNewVersionNative(goodsOrder);
             } else if (isNeedPay) {
                 return await this.needPayNormal(goodsOrder, orderPay);
             } else {
                 LgPay.isCreatingOrder = false;
                 // @ts-ignore
                 return Promise.resolve(orderPay, goodsOrder)
             }
        }
        else {
            LgPay.isCreatingOrder = false;
            return Promise.reject(goodsOrder)
        }

    }

    async needPayNewVersionNative(goodsOrder: GoodsOrderPayType){
        goodsOrder.goodsOrderNo = goodsOrder.orderNo;
        goodsOrder.onClose = this.submitData.onClose || function () {
        };
        // @ts-ignore
        return await this.pay.submit(goodsOrder, this.nativeExtraParams);
    }

    async needPayNormal(goodsOrder: GoodsOrderPayType, orderPay: any){
        let payInfo: PayInfoType = await getPayInfo(goodsOrder.orderNo);
        let {orderToken, sellGoodsPriceId, onClose = ()=>{}} = this.submitData;
        payInfo.goodsOrderNo = goodsOrder.orderNo;
        payInfo.orderToken = orderToken;
        payInfo.payOrderNo = goodsOrder.payOrderNo;
        payInfo.sellGoodsPriceId = sellGoodsPriceId;
        payInfo.onClose = onClose;
        payInfo.returnUrl = this.submitData.expandInfo;
        // @ts-ignore
        this.pay.setOrderPay && this.pay.setOrderPay(orderPay);
        // @ts-ignore
        return await this.pay.submit(payInfo, this.nativeExtraParams, goodsOrder, this.submitData);
    }

    async fetchSaleGoodsPrice() {
        let sellGoodsInfo: { shopOrderToken: any; sellGoodsPrice: any; } = await getSaleGoodsPrice(this.submitData.sellGoodsPriceId);
        // @ts-ignore
        let { shopOrderToken, sellGoodsPrice } = sellGoodsInfo;
        LgPay.orderToken = shopOrderToken;
        if(sellGoodsPrice && sellGoodsPrice.lagouCoinPrice) {
            this.submitData.payLagouCoinNum = sellGoodsPrice.lagouCoinPrice;
            return {
                status: PRICE_CHANGE,
                data: {
                    price: sellGoodsPrice.goodsOriginalPrice,
                    discounts: sellGoodsPrice.goodsSellPrice,
                    content: sellGoodsPrice
                }
            };
        }

    }

    async fetchPayInfo(goodsOrder: GoodsOrderPayType) {
        let payInfo: PayInfoType = await getPayInfo(goodsOrder.orderNo);
        let {orderToken, sellGoodsPriceId, onClose = ()=>{}} = this.submitData;
        payInfo.orderToken = orderToken;
        payInfo.payOrderNo = goodsOrder.payOrderNo;
        payInfo.sellGoodsPriceId = sellGoodsPriceId;
        payInfo.onClose = onClose;
        // @ts-ignore
        return await this.pay.submit(payInfo, this.nativeExtraParams, goodsOrder);
    }

}
