import services from "../services/biz";
import {rechargeConfirmTpl} from "./tpls";
import {CLASS_NAME} from "./classNames";
import Order from "../services/order";
import { PrechargeInfoType } from "../../../index.d";


export default class RechargePop {
    isFirst: true;
    btnClickHandker?: ()=> void;
    onCloseCb?: ()=> void;
    popElem: HTMLElement;
    constructor() {
        this.init();
    }

    show() {
        services.preRechargeOrder().then((precharge: PrechargeInfoType)=>{
            let amount = this.popElem.querySelector('.amount') as HTMLInputElement;
            amount.value = '100';
            this.popElem.querySelector('.count-show').textContent = `100元`;
            this.popElem.querySelector('.amount').setAttribute('max', String(precharge.maxRechargeCount))
        });
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
        div.className = "lg-pay-recharge";
        div.innerHTML = rechargeConfirmTpl;
        document.body.appendChild(div);
        this.popElem = div;
        this.popElem.style.display = 'none'
    }

    bindEvent() {

        // 绑定关闭
        this.bindClose();

        // 绑定输入框
        this.bindInput();

        // 绑定按钮
        this.bindButton();

    }

    bindInput(){
        let popElem = this.popElem as HTMLElement;
        let inputElem = popElem.querySelector('.amount') as HTMLInputElement;
        inputElem.oninput = (e)=>{
            inputElem.value = inputElem.value.replace(/[^\d]/g,'')
            this.inputEndHandler(inputElem, popElem);
        };
    }

    inputEndHandler(inputElem: HTMLInputElement, popElem: HTMLElement){
        if(isNaN(Number(inputElem.value))){
            return;
        }
        if (+inputElem.value > +inputElem.getAttribute('max')) {
            inputElem.value = inputElem.value.substr(0, 4)
        }
        if(!inputElem.value){
            popElem.querySelector('.recharge-btn').className = 'recharge-btn disabled';
        }else{
            popElem.querySelector('.recharge-btn').className = 'recharge-btn';
        }
        popElem.querySelector('.count-show').textContent = (+inputElem.value) + '元';
    }


    bindButton(){
        let popElem = this.popElem as HTMLElement;
        let btnElem = popElem.querySelector('.recharge-btn');
        btnElem.addEventListener('click', () => {
            this.btnClickHandker && this.btnClickHandker();
        });
    }

    clearInput(){
        let amount = document.querySelector('.lg-pay-recharge .amount') as HTMLInputElement;
        amount.value = '';
    }

    bindClose() {
        let popElem = this.popElem as HTMLElement;
        let closeElem = popElem.querySelector(CLASS_NAME.close);
        closeElem.addEventListener('click', () => {
            this.clearInput()
            this.hide();
        });
    }

    reset() {
        this.isFirst = true;
        Order.handleList = {};
        Order.orderList = {};
    }

}
