import LgRequest from "../../../services/api";
import { HOST, STATE, SERVICE_STATE, MESSAGE } from "../../../const/index";

import {
    PayOrderType,
    RechargeOrderType,
    FetchJsonType
} from '../../../index.d';

export default {
    preRecharge() {
        // @ts-ignore
        return LgRequest.get(`${HOST.gnctx}/pay/preRecharge`).then((res: FetchJsonType) => {
            let { state, content } = res;
            if (state == SERVICE_STATE.success) {
                return Promise.resolve(content);
            }
            if (state == SERVICE_STATE.unauthorized ) {
                return Promise.reject({
                    state: STATE.unauthorized,
                    message: MESSAGE.unauthorized
                });
            }
            return Promise.reject({
                state: STATE.serviceError,
                message: res.message
            });
        });
    },
    createRechargeOrder({ amount, channel } : RechargeOrderType) {
        // @ts-ignore
        return LgRequest.post(`${HOST.gnctx}/pay/recharge`, JSON.stringify({
            amount,
            channel
        })).then((res: FetchJsonType) => {
            let { state, content } = res;
            if (state == SERVICE_STATE.success) {
                return Promise.resolve(content);
            }
            if (state == SERVICE_STATE.unauthorized ) {
                return Promise.reject({
                    state: STATE.unauthorized,
                    message: MESSAGE.unauthorized
                });
            }
            return Promise.reject({
                state: STATE.serviceError,
                message: res.message
            });
        });
    },
    createOrderV2(data: PayOrderType) {
        let params = data;
        params.userCouponNoList && params.userCouponNoList.length > 0 && (params.userCouponNoList = data.userCouponNoList.slice(0,1))
        // @ts-ignore
        return LgRequest.post(`${HOST.gnctx}/pay/saveOrder`, JSON.stringify(params)).then((res: FetchJsonType) => {
            let { state, content } = res;
            if (state == SERVICE_STATE.success) {
                return Promise.resolve(content);
            }
            if (state == SERVICE_STATE.unauthorized ) {
                return Promise.reject({
                    state: STATE.unauthorized,
                    message: MESSAGE.unauthorized
                });
            }
            return Promise.reject({
                state: STATE.serviceError,
                message: res.message
            });
        });
    },
    querySuccess(orderNo: string) {
        // @ts-ignore
        return LgRequest.get(`${HOST.gnctx}/pay/getPayResult`, {
            orderNo
        }).then((res: FetchJsonType) => {
            let { state, content } = res;
            if (state != 1) {
                return Promise.reject({
                    state: STATE.serviceError,
                    message: res.message
                });
            }
            return Promise.resolve(content);
        }).catch((res: FetchJsonType) => {
            return Promise.reject({
                state: STATE.serviceError,
                message: res
            });
        });
    },
    cancelPayOrder(goodsOrderNo: string, payOrderNo: string) {
        // @ts-ignore
        return LgRequest.post(`${HOST.gnctx}/pay/cancel`,JSON.stringify({goodsOrderNo, payOrderNo})).then((res: FetchJsonType) => {
            let { state, content } = res;
            if (state != 1) {
                return Promise.reject({
                    state: STATE.serviceError,
                    message: res.message
                });
            }
            return Promise.resolve(content);
        }).catch((res: FetchJsonType) => {
            return Promise.reject({
                state: STATE.serviceError,
                message: res
            });
        });
    }
}
