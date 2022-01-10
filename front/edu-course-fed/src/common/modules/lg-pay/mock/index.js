const proxy = {
    'GET /pay/getPayResult': (req, res) => {
        if(new Date().getTime() > 1585101552262){
            return res.send({"state":1,"message":"操作成功","content":{"orderNo":"100905020689489926","productId":null,"amount":50.0,"currency":"gBeans","channel":"aliPay","status":2,"orderType":1,"source":3,"payTime":null},"uiMessage":null})
        }else{
            return res.send({"state":1,"message":"操作成功","content":{"orderNo":"100905020689489926","productId":null,"amount":50.0,"currency":"gBeans","channel":"aliPay","status":1,"orderType":1,"source":3,"payTime":null},"uiMessage":null})
        }
    },
    '/pay/cancel': {"state":1,"message":"操作成功","content":{"payOrderNo":"100907168869396482"},"uiMessage":null},
    '/pay/report/error': {
        "state": 1003,
        "message": "非法的访问"
    },
    'POST /pay/recharge': (req, res) => {
        const {
            amount,
            channel
        } = req.body;
        if (channel === "weChat") {
            return res.send({"state":1,"message":"操作成功","content":{"orderNo":"100904492211384321","channel":"weChat","source":3,"payUrl":"weixin://wxpay/bizpayurl?pr=54N3oC9","status":1},"uiMessage":null}
            );
        }
        if (channel === "aliPay") {
            return res.send({"state":1,"message":"操作成功","content":{"orderNo":"100904283041439746","channel":"aliPay","source":3,"payUrl":"https://qr.alipay.com/bax08997fp6ztqhhzlek006b","status":1},"uiMessage":null});
        }
    },
    '/pay/preRecharge': {"state":1,"message":"操作成功","content":{"accountBalance":0,"maxRechargeCount":9999,"information":["充值说明：","1、勾豆是拉勾网推出的支付货币，可以用来购买拉勾网提供的增值服务类产品，勾豆兑换比例为1元=1勾豆；","2、充值成功后的金额暂不支持退款和提现；如果遇到充值相关的问题，请到在线客服进行反馈。"],"rechargeButtonText":"立即充值","detailLink":"https://activity.lagou.com/app/business/consume-detail.html&hideTitle=0"},"uiMessage":null},
    'GET /basic/ifLogin': {
        "state": 200, "message": "操作成功", "success": true, "content": {"discount": 850}
    },
    'POST /pay/saveOrder': (req, res) => {
        const {
            channel,
            source
        } = req.body;
        if (source === 3 && channel === "weChat") {
            return res.send({"state":1,"message":"操作成功","content":{"orderNo":"100904123922128900","channel":"weChat","source":3,"payUrl":"weixin://wxpay/bizpayurl?pr=mhaRMS2","status":1},"uiMessage":null}
            );
        }
        if (source === 3 && channel === "aliPay") {
            return res.send({"state":1,"message":"操作成功","content":{"orderNo":"100903579790876678","channel":"aliPay","source":3,"payUrl":"https://qr.alipay.com/bax01106qadnmbjy2nz88013","status":1},"uiMessage":null});
        }
    },
    'POST /shop/goodsOrder/pay/UNITTP20191016103447583c6z686d30': {"state":1,"message":"操作成功","content":{"status":1,"msg":null,"userId":100012041,"orderNo":"UNITTP20200518163701995gZUE9959f","createTimeStr":"2020-05-18 16:37:01","updateTimeStr":"2020-05-18 16:37:14","timeoutStr":"2020-05-18 17:42:01","orderStatus":"SUCCESS","orderDesc":"yy就业课 x 1","remark":null,"payLagouCoinNum":0,"payLagouBpNum":0,"needMoneyNum":0,"preferentialPolicy":"NO","childOrderNum":1,"expandInfo":"https://kaiwu.lagou.com/#/content?courseId=63&decorateId=c5e48ef713354fcc85fd032589a69f55&token=310880501ce54b34a6a25e6f007a9fbd#/sale","useBalance":false},"uiMessage":null},
    '/order/saveOrder':{
        "state": 1,
        "message": "success",
        "content": {
            "orderNo": "362464763119046656"
        },
        "success": true
    }
    ,
    'GET /pay/getPayInfo': {
        "state": 1,
        "message": "操作成功",
        "content": {
            "goodsOrderNo": "UNITTP20191017175441686b69O0f614",
            "goodsName": "300分钟搞定数据结构与算法",
            "price": 68,
            "discount": 48,
            "pictureUrl": null,
            "userCouponList": [
                {
                    "couponTips": "面试必考课程券-抵扣20元",
                    "userCouponNo": "101018883334352904",
                    "couponId": 1,
                    "couponAmount": 20
                }
            ],
            "processStrategyType": 1
        },
        "uiMessage": null
    }
    // _proxy: {
    //     proxy: {
    //         '/pay/(.*)': 'https://gw.lagou.com',
    //     },
    //     changeHost: true,
    //     // modify the http-proxy options
    //     httpProxy: {
    //         options: {
    //             ignorePath: true,
    //         },
    //         listeners: {
    //             proxyReq: function (proxyReq, req, res, options) {
    //                 console.log('proxyReq');
    //             },
    //         },
    //     },
    // }
}

module.exports = proxy;
