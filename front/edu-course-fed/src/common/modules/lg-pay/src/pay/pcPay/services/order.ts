import services from "./biz";
import {
    handleListType,
    OrderListType,
    PayOrderType,
    RechargeOrderType,
    FetchJsonType
} from '../../../index.d';
export const STATUS = {
    PAY_SUCCESS: 2,
    NOT_PAY: 1,
    INVALID: -1
}

export default class Order{
    status = STATUS
    static handleList: handleListType = {};
    static orderList: OrderListType = {};
    static createOrder(data: PayOrderType) {
        return services.createOrderV2(data);
    }
    static createRechargeOrder(data: RechargeOrderType) {
        return services.createRechargeOrder(data);
    }
    static querySuccess(orderNo: string) {
        return services.querySuccess(orderNo)
    }
    static checkOrderSuccess(orderNo: string) {
        let handle: number = 0;
        return new Promise((resolve, reject) => {
            handle = window.setInterval(async () => {
                let res: FetchJsonType = await services.querySuccess(orderNo).catch((res: FetchJsonType) => {
                    reject(res)
                });
                if (res.status === STATUS.PAY_SUCCESS) {
                    clearInterval(handle);
                    resolve(res);
                }
            }, 1000);
            Order.handleList[orderNo] = handle;
        });
    }
    static queryOnce(){
        let allOrder: Array<FetchJsonType> = [];
        Object.keys(Order.handleList).forEach((key) => {
            allOrder.push(this.querySuccess(key));
        });
        return Promise.race(allOrder);
    }
    static cancleCheckSuccess(orderNo: string) {
        clearInterval(Order.handleList[orderNo]);
    }
    static cancelOrder(goodsOrderNo: string, payOrderNo: string){

        if(goodsOrderNo && payOrderNo){
            return services.cancelPayOrder(goodsOrderNo, payOrderNo);
        }
        return Promise.resolve({state: 1});
    }
    static cancleAllCheckSuccess() {
        Object.keys(Order.handleList).forEach((key) => {
            clearInterval(Order.handleList[key]);
        });
    }
}
