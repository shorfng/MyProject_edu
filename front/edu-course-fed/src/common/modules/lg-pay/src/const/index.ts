const isDevelopment = process.env.NODE_ENV === "development";

export const HOST = {
    gzctx: isDevelopment ? "" :  "http://edufront.lagou.com/front",
    gnctx: isDevelopment ? "" :  "http://edufront.lagou.com/front",
}


export  const ORDER_REPEAT = 60301;
export  const PRICE_CHANGE = 60205;
export  const PAYED_ORDER = 70002;

export const PAY_TYPE = {
    pc: "pc",
    native: "native",
    h5: "h5"
}

export const STATE = {
    success: 1000,
    h5PayNotAllowed: 1100,
    unauthorized: 1201,
    serviceError: 1202,
    serviceNotFound: 1203
}

export const MESSAGE = {
    wxPCSuccess: "PC微信支付成功",
    aliPCSuccess: "PC支付宝支付成功",
    h5Success: "H5成功跳转",
    nativeSucess: "native支付已唤起",
    h5PayNotAllowed: "因IOS审核原因，拉勾app内不支持H5支付",
    unauthorized: "没有身份认证信息，请登录",
    serviceError: "服务器异常，请刷新重试",
    serviceNotFound: "服务访问不到"
}


export const SERVICE_STATE = {
    success: 1,
    unauthorized: 10401
}

export const APP_VERSION = {
    newPayVersion: '7.21.0'
}
