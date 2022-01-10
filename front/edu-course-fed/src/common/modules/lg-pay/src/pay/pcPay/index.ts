import {
    SubmitDataType,
    PayPopType,
    RechargePopType,
    PayOrderType,
    GoodsOrderPayType,
    TriggerRechargeType,
    FetchJsonType,
    QueryCheckType
} from '../../index.d';
import "../../static/styles/pc-pop.less";
import services from "./services/biz";
import {PAY_TYPE, STATE, MESSAGE, HOST} from "../../const/index";
import { getMessage } from "../../services/message";
import PayPop from "./pops/PayPop";
import RechargePop from "./pops/RechargePop";
import Order, { STATUS } from './services/order';
import LgPay from "../../index";



export default class PCPay{
    payPop: PayPopType;
    rechargePop: RechargePopType;
    order: typeof Order;
    resolveCallback: ()=>any;
    orderPay: any;
    constructor() {
        this.payPop = new PayPop();
        this.order = Order;
        this.rechargePop = new RechargePop();
        this.init();
    }

    init() {
        window.addEventListener("beforeunload",  () => {
            let { goodsOrderNo, AliNo, WXNo } = Order.orderList;
            if(goodsOrderNo && (AliNo || WXNo)) {
                this.cancelPayOrder(goodsOrderNo, (AliNo || WXNo));
            }
        });
    }

    cancelPayOrder(goodsOrderNo: string, payOrderNo: string) {
        services.cancelPayOrder(goodsOrderNo, payOrderNo)
    }

    getFetch(data: PayOrderType, isRecharge: boolean){
        if(isRecharge){
            return Order.createRechargeOrder({
                channel: data.channel,
                amount: data.amount
            });
        }
        //支付多余参数去掉
        delete data.amount;
        return Order.createOrder(data).then((data: any) => {
            LgPay.isCreatingOrder = false;
            return data;
        }).catch(() =>{
            LgPay.isCreatingOrder = false;
        });
    }

    TriggerRecharge(options: TriggerRechargeType){
        this.rechargePop.show();
        this.rechargePop.btnClickHandker = () => {
            let btn = this.rechargePop.popElem.querySelector('.recharge-btn') as HTMLElement
            if(btn.className.indexOf('disabled') > -1){
                return;
            }
            if (window.lgSa && window.lgSa.track) {
                window.lgSa.track('1nbv', {
                    address_id: '1nc8'
                });
            }
            this.rechargePop.hide();
            let amountInput = this.rechargePop.popElem.querySelector('.amount') as HTMLInputElement;
            let amount = amountInput.value || 100
            return this.submit({
                isRecharge: true,
                amount: +amount
            }).then((res: FetchJsonType)=>{
                options && options.onBuySuccess && options.onBuySuccess(res);
                return res;
            })
        }
    }

    submit(data: SubmitDataType, nativeExtraParams?: any, goodsOrder?: GoodsOrderPayType) {
        let { payPop, successCloseCallback } = this;
        Order.orderList = {
            goodsOrderNo: data.goodsOrderNo
        };
        payPop.setCouponDOM(data);

        payPop.onCloseHandler = () =>{
            data.onClose && data.onClose();
        }

        return new Promise((resolve, reject) => {
            this.resolveCallback = resolve;
            payPop.queryBtnClickHandker = async () => {
                let queryResult: QueryCheckType = await Order.queryOnce();
                if (queryResult.status === STATUS.PAY_SUCCESS) {
                    payPop.queryClickInit();
                    Order.cancleAllCheckSuccess();
                    successCloseCallback(goodsOrder)
                }else{
                    payPop.queryClickFail();
                }
                Order.cancleAllCheckSuccess();
            }
            let userCouponNoList: any[] = [];
            if(data.userCouponList) {
                let len = data.userCouponList.length;
                for(let i = 0; i < len; i++) {
                    userCouponNoList.push(data.userCouponList[i].userCouponNo)
                }
            }
            // 获取微信二维码
            this.setQRCode(data, userCouponNoList, false ,goodsOrder);
            payPop.onFirstChangeToAli(() => {
                this.setQRCode(data, userCouponNoList, true, goodsOrder);
            });

            payPop.onClose(() => {
                Order.cancleAllCheckSuccess();
            });
        });
    }

    successCloseCallback = (goodsOrder?: GoodsOrderPayType)=>{
        let { payPop, resolveCallback } = this;
        payPop.hide();
        Order.orderList = {};
        let result = {
            state: STATE.success,
            source: PAY_TYPE.pc,
            message: MESSAGE.aliPCSuccess,
            orderNo: goodsOrder && goodsOrder.orderNo,
            ...this.orderPay
        };
        // @ts-ignore
        resolveCallback(result);
    }

    async setQRCode(data: SubmitDataType, userCouponNoList: any[], isWeChat: boolean, goodsOrder: GoodsOrderPayType) {
        let { payPop } = this;
        let PC: string = 'PC';
        let channel = isWeChat ? 'weChat' : 'aliPay';
        let orderKey = isWeChat ? 'WXNo' : 'AliNo';
        let QrCodeKey = isWeChat ? 'setWxQrcode' : 'setAliQrcode';
        let res: { orderNo: any; payUrl: any; } = await this.getFetch({
            channel,
            source: PC,
            goodsOrderNo: data.goodsOrderNo,
            userCouponNoList,
            amount: data.amount,
            returnUrl: data.returnUrl,
        }, data.isRecharge)

        let { orderNo = '', payUrl } = res;
        // @ts-ignore
        Order.orderList[orderKey] = orderNo;
        payPop.show();
        payPop.queryClickInit();
        // @ts-ignore
        payPop[QrCodeKey](payUrl);
        data.onCreated && data.onCreated(res);
        let queryRes: QueryCheckType = await Order.checkOrderSuccess(orderNo);
        if (queryRes.status === STATUS.PAY_SUCCESS) {
            this.successCloseCallback(goodsOrder);;
        }
    }

    setOrderPay(orderPay: any){
        this.orderPay = orderPay || {};
    }

}

