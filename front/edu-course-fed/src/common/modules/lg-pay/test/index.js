// import LgPay from "../lib/main";
import LgPay, { h5Pay } from "../src/index";

var lgPay = new LgPay();

window.lgPay = lgPay;
console.log(lgPay);

document.getElementById('recharge').addEventListener('click', () => {
    lgPay.pay.TriggerRecharge()

});



document.getElementById('buy').addEventListener('click', () => {
    lgPay.submitV2({
        orderToken: 'orderToken',
        sellGoodsPriceId: 'sellGoodsPriceId',
        payLagouCoinNum: 'payLagouCoinNum',
        wxinfo: 2,
        onClose: ()=>{
        },

    }).then((res) => {
        if (res.source === lgPay.PAY_TYPE.pc) {
            console.log("pc支付成功");
        }
        if (res.source === lgPay.PAY_TYPE.h5) {
            console.log("h5支付页面跳转中");
        }
        if (res.source === lgPay.PAY_TYPE.native) {
            console.log("native支付已唤起");
        }
    }).catch((res) => {
        if(res.state === lgPay.STATE.unauthorized) {
            // 当前用户无身份 需要跳转登录
            console.log(res.message);
        }
        if (res.state === lgPay.STATE.h5PayNotAllowed) {
            // h5支付失败 苹果app内 不能使用h5支付
            console.log(res.message);
        }
        if (res.state === lgPay.STATE.serviceError) {
            // 服务器错误 创建订单失效
            console.log(res.message);
        }
    })
});
