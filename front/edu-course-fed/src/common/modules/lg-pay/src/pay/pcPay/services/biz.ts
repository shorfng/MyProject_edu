import api from "./api";
import {PayOrderType, RechargeOrderType} from "../../../index.d";

// @ts-ignore
export default {
    createOrderV2(data: PayOrderType) {
        return api.createOrderV2(data)
    },
    createRechargeOrder({channel, amount }: RechargeOrderType) {
        return api.createRechargeOrder({
            amount: amount,
            currency: "CNY",
            channel: channel
        })
    },
    preRechargeOrder() {
        return api.preRecharge()
    },
    querySuccess(orderNo: string) {
        return api.querySuccess(orderNo);
    },
    cancelPayOrder(goodsOrderNo: string, payOrderNo: string) {
        return api.cancelPayOrder(goodsOrderNo, payOrderNo);
    }
}