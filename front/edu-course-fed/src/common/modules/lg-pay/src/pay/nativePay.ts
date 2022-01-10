import { SubmitDataType } from "../index.d";
import { getQueryString, isSupportNative, isEduApp } from "../util/index";
import { PAY_TYPE, STATE, MESSAGE, APP_VERSION } from "../const/index";
import { getMessage } from "../services/message";
import LgPay from "../index";


export default class NativePay {
    keyAdSource: string;
    pageType: string;
    constructor() {
        this.keyAdSource = getQueryString("keyAdSource");
        this.pageType = getQueryString('pageType');
    }

    send(url: string) {
        let iframe = document.createElement('iframe');
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        setTimeout(function () {
            iframe.remove();
        }, 200);
    }

    submit(data: SubmitDataType, extraParams?: any) {
        return new Promise((resolve, reject) => {
            let url;
            if(isEduApp()){
                url = 'lgedu://lgedu.com/zhifu'
            }else{
                try {
                    let regx = new RegExp(/Lagou\/\S+\s+\((\w+)\)/gi);
                    let match = navigator.userAgent.match(regx);
                    let isBUserPay = match && match[0].indexOf('B') > -1;
                    url = isBUserPay ? 'lagouhr://lagou.com/zhifu' : 'lagou://lagou.com/zhifu';
                } catch (error) {
                    console.log(error)
                }
                
            }
            let { goodsOrderNo, payOrderNo, goodsName, price } = data;
            if(isSupportNative(APP_VERSION.newPayVersion) || isEduApp()) {
                url += `?goodsOrderNo=${goodsOrderNo}`
                if (extraParams && typeof extraParams === 'object') {
                    url += `&extraParams=${JSON.stringify(extraParams)}`
                }
            }
            else {
                url += `?code=${payOrderNo}&name=${encodeURIComponent(goodsName)}&price=${price}`
            }

            if (this.keyAdSource) {
                url += `&sid=${encodeURIComponent(this.keyAdSource)}`;
            }
            if(this.pageType && this.pageType !== 'publish') {
                url += `&pageType=${this.pageType}`;
            }
            this.send(url);
            setTimeout(() => {
                LgPay.isCreatingOrder = false;
            }, 1000);
            resolve(getMessage(STATE.success, PAY_TYPE.native, MESSAGE.nativeSucess));
        });
    }

}
