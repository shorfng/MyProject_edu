import {rechargePayTpl} from "./tpls";
import { postCancelPay } from "../../../services/order";
import { PayType, SubmitDataType, CancelPayParamsType } from "../../../index.d";
import Order  from "../services/order";
import {CLASS_NAME} from "./classNames";
// @ts-ignore
import QRCode from "qrcode";
import * as utils from "../../../util/dom";


export default class PayPop {
    onFirstChangeToAliCb: ()=> void
    isFirst: boolean = true;
    popElem: HTMLElement;
    queryBtnClickHandker: ()=> void;
    onCloseCb: ()=> void;
    onCloseHandler: ()=> void;
    constructor() {
        this.init();
    }

    show() {
        // 展示弹窗
        this.popElem.style.display = "block";
    }

    hide() {
        this.onCloseCb && this.onCloseCb();
        this.popElem.style.display = "none";
        this.reset();
    }

    init() {
        // dom注入
        this.appendHtml();
        // 事件绑定
        this.bindEvent();
    }

    appendHtml() {
        var div = document.createElement("div");
        div.className = "lg-pay lg-recharge-pay-container";
        div.innerHTML = rechargePayTpl;
        document.body.appendChild(div);
        this.popElem = div;
    }

    bindEvent() {

        // 绑定关闭
        this.bindClose();

        // 绑定选择
        this.bindSelect();

        // 绑定支付成功 重新查询
        this.bindQueryBtn();
    }


    bindQueryBtn(){
        let popElem = this.popElem as HTMLElement;
        let btnElem = popElem.querySelector('.pay-qrcode-status .link') as HTMLElement;
        btnElem.addEventListener('click', () => {
            this.queryBtnClickHandker && this.queryBtnClickHandker();
        });
    }

    queryClickFail(){
        let popElem = this.popElem as HTMLElement;
        let btnPretextElem = popElem.querySelector('.pay-qrcode-status .left-text') as HTMLElement;
        let btnTextElem = popElem.querySelector('.pay-qrcode-status .link') as HTMLElement;
        btnPretextElem.style.display = 'inline-block';
        btnTextElem.textContent = '  重新查询';
    }

    queryClickInit(){
        let popElem = this.popElem as HTMLElement;
        let btnPretextElem = popElem.querySelector('.pay-qrcode-status .left-text') as HTMLElement;
        let btnTextElem = popElem.querySelector('.pay-qrcode-status .link') as HTMLElement;
        btnPretextElem.style.display = 'none';
        btnTextElem.textContent = '我已完成支付';
    }


    bindClose() {
        let popElem = this.popElem as HTMLElement;
        let closeElem = popElem.querySelector(CLASS_NAME.close) as HTMLElement;
        closeElem.addEventListener('click', () => {
            this.cancelOrder()
            this.hide();
            this.onCloseHandler && this.onCloseHandler();
        });
    }

    cancelOrder() {
        // @ts-ignore
        let { goodsOrderNo, AliNo, WXNo } = Order.orderList;
        if(AliNo) {
            postCancelPay({
                goodsOrderNo: goodsOrderNo,
                payOrderNo: AliNo
            })
        }
        if(WXNo) {
            postCancelPay({
                goodsOrderNo: goodsOrderNo,
                payOrderNo: WXNo
            })
        }
    }

    bindSelect() {
        let popElem = this.popElem as HTMLElement;
        let wxSelectElem = popElem.querySelector(CLASS_NAME.wxSelect) as HTMLElement;
        let aliSelectElem = popElem.querySelector(CLASS_NAME.aliSelect) as HTMLElement;
        let wxQrcode = popElem.querySelector(CLASS_NAME.wxQrcode) as HTMLElement;
        let aliQrcode = popElem.querySelector(CLASS_NAME.aliQrcode) as HTMLElement;
        let selectText = popElem.querySelector('.channel-text') as HTMLElement;
        wxSelectElem.addEventListener("click", (e: any) => {
            if (this.isFirst) {
                this.isFirst = false;
                this.onFirstChangeToAliCb && this.onFirstChangeToAliCb();
            }
            utils.addClass(wxSelectElem, CLASS_NAME.active);
            utils.removeClass(aliSelectElem, CLASS_NAME.active);
            wxQrcode.style.display = "block";
            aliQrcode.style.display = "none";
            selectText.textContent = '微信支付';
        });

        aliSelectElem.addEventListener("click", (e: any) => {
            utils.addClass(aliSelectElem, CLASS_NAME.active);
            utils.removeClass(wxSelectElem, CLASS_NAME.active);
            aliQrcode.style.display = "block";
            wxQrcode.style.display = "none";
            selectText.textContent = '支付宝支付';
        });
    }

    setCouponDOM(data: PayType) {
        let popElem = this.popElem as HTMLElement;
        let realPrice = popElem.querySelector(CLASS_NAME.realPrice) as HTMLElement;
        let originalPrice = popElem.querySelector(CLASS_NAME.originalPrice) as HTMLElement;
        let couponInfo = popElem.querySelector(CLASS_NAME.couponInfo) as HTMLElement;
        let rechargeAmount = popElem.querySelector('.pay-qrcode-label-money') as HTMLElement;
        if(rechargeAmount){
            rechargeAmount.textContent = data.amount + '元';
        }

        if(data.isRecharge){
            rechargeAmount.style.display = 'inline-block';
            realPrice.style.display = 'none';
            originalPrice.style.display = 'none';
            couponInfo.style.display = 'none';
            return;
        }else{
            rechargeAmount.style.display = 'none';
        }
        if(data.discount && data.discount !== data.price) {
            originalPrice.style.display = "inline-block";
            realPrice.innerText = data.discount + '元';
            originalPrice.innerText = data.price + '元'
        }
        else {
            originalPrice.style.display = "none";
            realPrice.innerText = data.price + '元'
        }

        if(data.userCouponList && data.userCouponList[0] && data.userCouponList[0].couponTips) {
            couponInfo.style.display = "table";
            couponInfo.innerText = data.userCouponList[0].couponTips
        }
        else {
            couponInfo.style.display = "none";
        }
    }

    setWxQrcode(url: string) {
        let popElem = this.popElem as HTMLElement;
        let canvas = popElem.querySelector(CLASS_NAME.canvas);
        QRCode.toCanvas(canvas, url, {
            width: 136,
            margin: 0
        });
    }

    setAliQrcode(url: string) {
        let popElem = this.popElem as HTMLElement;
        let canvas = popElem.querySelector(CLASS_NAME.aliCanvas);
        QRCode.toCanvas(canvas, url, {
            width: 136,
            margin: 0
        });

    }

    onFirstChangeToAli(cb: ()=>void) {
        this.onFirstChangeToAliCb = cb;
    }

    onClose(cb: ()=>void) {
        // @ts-ignore
        this.onCloseCb = cb;
    }

    reset() {
        let popElem = this.popElem as HTMLElement;
        let aliSelectElem = popElem.querySelector(CLASS_NAME.aliSelect);
        let wxQrcode = popElem.querySelector(CLASS_NAME.wxQrcode).querySelector("iframe");
        let canvas = popElem.querySelector(CLASS_NAME.canvas);
        // @ts-ignore
        let context = canvas.getContext('2d') as CanvasRenderingContext2D;
        aliSelectElem.dispatchEvent(new Event("click"));
        // @ts-ignore
        context.clearRect(0, 0, canvas.width, canvas.height);
        wxQrcode && wxQrcode.remove();
        this.isFirst = true;
    }

}
