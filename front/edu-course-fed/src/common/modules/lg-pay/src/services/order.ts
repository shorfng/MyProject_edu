import LgRequest from "./api";
import { FetchJsonType, SubmitDataType, CancelPayParamsType} from '../index.d';
import { HOST, SERVICE_STATE, MESSAGE, PAY_TYPE, STATE, APP_VERSION } from "../const/index";
import LgPay from "../index";


// 创建商品订单
export function createGoodsOrder(data: SubmitDataType) {
    let url = `${HOST.gzctx}/order/saveOrder`;
    // @ts-ignore
    return LgRequest.post(url, JSON.stringify(data), {
        headers: {
            'SHOP-ORDER-TOKEN': LgPay.orderToken
        }
    }).then((res: FetchJsonType) => {
        // @ts-ignore
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


// 支付商城订单
export function goodsOrderPay(orderNo: string) {
    let url = `${HOST.gzctx}/shop/goodsOrder/pay/${orderNo}`;
    // @ts-ignore
    return LgRequest.post(url).then((res: FetchJsonType) => {
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

// 准备进行支付时，获取支付相关信息
export function getPayInfo(shopOrderNo: string) {
    // @ts-ignore
    return LgRequest.get(`${HOST.gnctx}/pay/getPayInfo`, {
        shopOrderNo
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
}


//"shopOrderToken": "string",
  //  "status": 0

// 根据ID, 查询在售商品详情
export function getSaleGoodsPrice(id: string) {
    // @ts-ignore
    return LgRequest.get(`${HOST.gzctx}/shop/goods/sellPrice/${id}`)
        .then((res: FetchJsonType) => {
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
// 取消订单
export function postCancelPay(data: CancelPayParamsType) {
    let url = `${HOST.gnctx}/pay/cancel`;
    // @ts-ignore
    return LgRequest.post(url, JSON.stringify(data)).then((res: FetchJsonType) => {
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
