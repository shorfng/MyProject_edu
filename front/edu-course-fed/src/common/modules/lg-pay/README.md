# lg-zhifu-fed

## 命令

- 执行测试

```bash
npm run test
```

- 打包demo

```bash
npm run build
```

- 编译ES5

```bash
npm run lib
```

## 发版流程

1. `npm run lib` 打包
2. 升级 package.json 里面 version
3. 切换 npm 源 http://npm-repo.lagou.com/
4. npm publish

[参考 wiki](https://wiki.lagou.com/pages/viewpage.action?pageId=77889560)

## 支付流程简要概述

1. 创建商品订单-[/shop/goodsOrder/create](https://gate.lagou.com/v1/zhaopin/swagger-ui.html#!/shopGoodsOrder/createShopGoodsOrderUsingPOST)
2. 尝试支付商城订单-[/shop/goodsOrder/pay/{orderNo}](https://gate.lagou.com/v1/zhaopin/swagger-ui.html#!/shopGoodsOrder/payShopGoodsOrderUsingPOST)
3. 然后具体走各端的支付逻辑

其他接口说明：

1. [创建支付订单v2版本](https://gate.lagou.com/v1/neirong/swagger-ui.html#!/Pay/payUsingPOST_1)
2. [查询订单](https://gate.lagou.com/v1/neirong/swagger-ui.html#!/Pay/queryOrderUsingGET)
3. [准备进行支付时，获取支付相关信息](https://gate.lagou.com/v1/neirong/swagger-ui.html#!/Pay/getPayInfoUsingGET)

## h5 的支付页面

在 [plat-activity-fed](http://git.lagou.com/plat-fe/plat-activity-fed) 项目 pay 文件夹内；在开发机上必须手动推资源，并且修改引用的静态资源；具体上线步骤查看该项目 readme。

## App 版本的支持情况

`7.21.0`版本开始重构支付流程，具体参考 `src/pay/nativePay.js` 文件代码。

## demo

```javascript
import LgPay from "../index";
var lgPay = new LgPay();

// 必须在 window 下初始化一个 orderToken 放置在 createOrder 请求下的 header 中
window.orderToken = shopOrderToken;

document.getElementById('buy').addEventListener('click', () => {
    var payLagouCoinNum = document.getElementById("price").value;
    var sellGoodsPriceId = document.getElementById("id").value;
    // 第二个参数表示调起Native支付时额外传递的参数，其他支付不用传
    // payLagouCoinNum,
    // sellGoodsPriceId,
    // expandInfo 
//orderToken 页面防刷
    lgPay.submitV2({
        payLagouCoinNum,
        orderToken,
        sellGoodsPriceId,
        from : 'kaiwu'|'';
    }, {
        payScenesKey: "kai_wu"
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
```

## 基本流程

1. 支持原生支付的app：IOS/安卓唤起原生支付
2. 不支持原生支付的老app：安卓走h5支付，IOS因审核问题 不进行支付（目前线上是 出弹窗提示）
3. App外：走h5支付
4. PC引用页面需要登录
