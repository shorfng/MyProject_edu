import {
    SubmitDataType,
    PayPopType,
    RechargePopType,
    PayOrderType,
    GoodsOrderPayType,
    TriggerRechargeType,
    FetchJsonType,
    QueryCheckType
} from '../index.d';
import { isLagouApp, isIphone, isApp, isEduApp, isKw, isPayPage } from "../util/index";
import { PAY_TYPE, STATE, MESSAGE } from "../const/index";
import { getMessage } from ".././services/message";
import LgPay from "../index";
import Order, {STATUS} from "./pcPay/services/order";


export default class H5Pay{
    payUrl: string;
    isAPP: boolean;
    isIphone: boolean;
    orderPay: any;
    order: typeof Order;
    constructor() {
        this.isAPP = isLagouApp();
        this.isIphone = isIphone();
        this.order = Order;
        this.payUrl = `https://activity.lagou.com/app/pay/lg-buy.html`;
    }

    // @ts-ignore
    async submit(data: SubmitDataType, nativeExtraParams?: any, goodsOrder?: GoodsOrderPayType, creatSubmit?: SubmitDataType) {

        if(isPayPage()){
            // @ts-ignore
            let res: { orderNo: any; payUrl: any; channel: any; } = await this.getFetch({goodsOrderNo: data.goodsOrderNo,...creatSubmit});
            let { orderNo } = res;
            // @ts-ignore
            Order.orderList[data.channel] = orderNo;
            // let queryRes: QueryCheckType = await Order.checkOrderSuccess(orderNo);
            // if (queryRes.status === STATUS.PAY_SUCCESS) {
            return this.successCloseCallback(goodsOrder, res);
            // }
        }else if(isKw()){
            data.expandInfo = data.expandInfo || 'https://kaiwu.lagou.com';
            this.kwPay(data);
            return;
        }
        this.goToh5PayUrl(data);

    }

    async getFetch(data: PayOrderType){
        // @ts-ignore
        let { channel, goodsOrderNo, source, returnUrl, userCouponNoList, creditStagesCount, expandInfo } = data;
        let creatParams = {
            channel,
            goodsOrderNo,
            source,
            returnUrl,
            userCouponNoList,
            expandInfo
        }
        if(channel !== 'weChat'){
            creatParams.returnUrl = `https://activity.lagou.com/activity/dist/pay/paid/${goodsOrderNo}.html`;
        }
        // @ts-ignore
        creditStagesCount && (creatParams.creditStagesCount = creditStagesCount);
        if (channel === 'jdPay' || channel === 'lfqPay') {
            creatParams.returnUrl && delete creatParams.returnUrl;
        }
        if(`${location.origin}${location.pathname}` === this.payUrl){
            // @ts-ignore
            creatParams.wxType = 2;
        }
        return await Order.createOrder(creatParams).then((data: any) => {
            LgPay.isCreatingOrder = false;
            return data;
        }).catch(() =>{
            LgPay.isCreatingOrder = false;
        });
    }

    setOrderPay(orderPay: any){
        this.orderPay = orderPay || {};
    }

    successCloseCallback = (goodsOrder?: GoodsOrderPayType, orderPayV2?: any)=>{
        Order.orderList = {};
        let result = {
            state: STATE.success,
            source: orderPayV2.channel || PAY_TYPE.h5,
            payUrl: orderPayV2.payUrl,
            message: MESSAGE.aliPCSuccess,
            orderNo: orderPayV2.orderNo,
            orderPay: orderPayV2,
            goodsOrder: this.orderPay
        };
        return result;
    }


    kwPay(data: SubmitDataType){
        window.location.href = `${this.payUrl}?wxinfo=${data.wxinfo || ''}&expandInfo=${encodeURIComponent(data.expandInfo)}&processStrategyCodes=1&payLagouCoinNum=${data.payLagouCoinNum || ''}&sellGoodsPriceId=${data.sellGoodsPriceId}&isEduApp=${(this.isIphone && isEduApp())}`;
    }

    goToh5PayUrl(data: SubmitDataType){
        window.location.href = `${this.payUrl}?wxinfo=${data.wxinfo || ''}&expandInfo=${encodeURIComponent(data.expandInfo)}&goodsOrderNo=${data.goodsOrderNo || ''}&sellGoodsPriceId=${data.sellGoodsPriceId}&isEduApp=${(this.isIphone && isEduApp())}`;
    }

}

