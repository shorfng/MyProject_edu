

declare global {
    interface Window {
        isCreatingOrder: boolean;
        orderToken: string;
    }
}


declare global {
    interface Window {
        isCreatingOrder: boolean;
        orderToken: string;
    }
}
export interface GoodsOrderParameType {
    buyNum: number,
    expandInfo: string,
    payLagouBpNum: number,
    payLagouCoinNum: number,
    remark: string,
    sellGoodsPriceId: number
}


export interface GoodsOrderPayType{
    onClose?: () => void;
    goodsOrderNo: string;
    childOrderNum: number,
    createTimeStr: string,
    expandInfo: string,
    msg: string,
    needMoneyNum: number,
    orderDesc: string,
    orderNo: string,
    orderStatus: string,
    payLagouBpNum: number,
    payLagouCoinNum: number,
    preferentialPolicy: string,
    remark: string,
    status: number,
    timeoutStr: string,
    updateTimeStr: string,
    useBalance: false,
    userId: number;
    payOrderNo?: string;
    shopOrderToken?: string;
}


export interface PayInfoType {
    discount: number;
    goodsName: string;
    goodsOrderNo: string;
    pictureUrl: string;
    price: number;
    processStrategyType: string;
    sellGoodsPriceId?: string;
    payOrderNo?: string;
    orderToken?: string;
    onClose?: ()=> void;
    returnUrl?: any;
}


export interface SellGoodsInfoType extends SellGoodsInfoDetailType, SellGoodsInfoStatusType {

}

export interface SellGoodsInfoStatusType {
    shopOrderToken: string;
    status: number;
}

export interface SellGoodsInfoDetailType {
    baseGoodsId: number;
    goodsDesc: string;
    goodsDetail: string;
    goodsName: string;
    goodsPrice: number;
    goodsPriceUnit: string;
    goodsTips: string;
    merchantId: number;
    originalGoodsPrice: number;
    sellGoodsId: number;
    sellGoodsStrategyResList: Array<SellGoodsStrategyResType>;
}

export interface SellGoodsStrategyResType {
    baseGoodsId: number;
    goodsName: string;
    goodsNum: number;
    merchantId: number;
    originalPrice: number;
    remark: string;
    sellGoodsId: number;
    sellGoodsPriceResList: Array<SellGoodsPriceResListType>;
    sellGoodsStrategyId: number;
    sellPrice: number;
    sellTag: string;
    shopUnitType: number;
}

export interface FetchJsonType {
    state: number;
    content: any;
    message: string;
    status: number;
    url?: string;
}


export interface OrderListType{
    payOrderNo?: string;
    goodsOrderNo?: string;
    AliNo?: string;
    WXNo?: string;
}

declare class OrderList{
    goodsOrderNo?: string;
    AliNo?: string;
    WXNo?: string;
}

export interface QueryCheckType {
    status?: number;
    state?: number
}

export interface UserCouponType {
    couponTips?: string;
}


export interface CreateOrderType {
    channel: string,
    orderNo: string,
    payUrl: string,
    source: number,
    status: number
}


export interface PayType {
    amount?: number;
    isRecharge?: false;
    discount?: number;
    price?: number;
    userCouponList?: Array<UserCouponType>
}


export interface RechargePopType {
    isFirst: boolean;
    show: ()=> void;
    hide: ()=> void;
    init: ()=> void;
    reset: ()=> void;
    popElem: HTMLElement;
    btnClickHandker?: ()=> void;
}

export interface PrechargeInfoType {
    maxRechargeCount?: number
}

export interface PayPopType {
    onCloseHandler: () => void;
    queryBtnClickHandker: () => void;
    isFirst: boolean;
    show: ()=> void;
    hide: ()=> void;
    init: ()=> void;
    reset: ()=> void;
    onClose: (cb: ()=> void)=> void;

    setCouponDOM(data: SubmitDataType): void;

    queryClickFail(): void;

    queryClickInit(): void;

    onFirstChangeToAli(param: () => void): void;
}

export interface TriggerRechargeParamsType {
    onBuySuccess?: ()=>void
}

export interface RechargeOrderType{
    channel: string;
    amount?: number;
    userCouponNoList?: Array<string>;
    currency?: string;
}

export interface PayOrderType{
    channel: string;
    goodsOrderNo: string;
    source?: string|number;
    userCouponNoList?: Array<string>;
    amount?:number;
    returnUrl?: any;
}

export interface TriggerRechargeType {
    onBuySuccess?: (params: FetchJsonType) => void
}

export interface handleListType{
    [index: string]: any;
}


declare global {
    interface Window {
        isCreatingOrder: boolean;
        lgSa: any
    }
}

declare global {
    interface Window {
        isCreatingOrder: boolean;
        lgSa: any
    }
}

export interface SubmitDataType {
    onCreated?: any;
    payLagouCoinNum?: number;
    goodsOrderNo?: string;
    payOrderNo?: string;
    goodsName?: string;
    price?: number;
    isRecharge?: boolean;
    amount?: number;
    expandInfo?: any;
    onClose?: ()=> void;
    orderToken?: string;
    sellGoodsPriceId?: string;
    userCouponList?: any;
    channel?:any;
    from?:any;
    wxinfo?:any;
    payLagouBpNum?:any;
    goodsId?:any;
    returnUrl?: any;
}
declare class AbstractPay {
    submit: (data: SubmitDataType)=> Promise<any>
}


export interface CancelPayParamsType {
    goodsOrderNo: string,
    payOrderNo: string
}

export interface SellGoodsPriceResListType {
    baseGoosId: number;
    checkCode: number;
    checkMsg: string;
    goodsDesc: string;
    goodsDetail: string;
    goodsName: string;
    goodsOriginalPrice: number;
    goodsSellPrice: number;
    lagouBpPrice: number;
    lagouCoinPrice: number;
    merchantId: number;
    preferentialPolicy: string;
    preferentialPolicyCurrencyId: number;
    preferentialPolicyCurrencyNum: number;
    preferentialPolicyDeduction: number;
    preferentialPolicyDesc: string;
    sellGoodsId: number;
    sellGoodsPriceId: number;
    sellGoodsStrategyId: number;
    sellLimitId: number;
    sellLimitRemainNum: number;
    sellLimitType: string;
    shopUnitType: number;
    stockId: number;
    stockRemainNum: number;
    stockTotalNum: number;
}
