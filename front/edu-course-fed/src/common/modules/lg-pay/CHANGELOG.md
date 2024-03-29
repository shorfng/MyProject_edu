# 项目更新日志 参考<a href="https://www.jianshu.com/p/75374e299ef8">软件版本号规范与命名原则</a>
- 版本号规范 `<主版本号>.<次版本号>.<修订版本号>`
    - 主版本号(1)：当功能模块有较大的变动，比如增加多个模块或者整体架构发生变化。此版本号由项目决定是否修改。
    - 子版本号(1)：当功能有一定的增加或变化，比如增加了对权限控制、增加自定义视图等功能。此版本号由项目决定是否修改。
    - 阶段版本号(1)：一般是 Bug 修复或是一些小的变动，要经常发布修订版，时间间隔不限，修复一个严重的bug即可发布一个修订版。此版本号由项目经理决定是否修改。
 - 举例
    ```
        [1.0.0] - 2019-07-30 @monica
        - 增加 changelog.md
    ```
----------

- [0.7.0] - 2019-06-06 @sket
    - 支付第一版提供h5调起微信支付宝支付
- [0.8.32] - 2019-06-16 @Nicalyang
    - 支持勾豆以及商品查询
- [0.8.33] - 2019-08-16 @jianqiuwang
    - 支持nativePay增加额外参数
- [0.8.34] - 2019-08-19 @jianqiuwang
    - deviceType改为1
- [0.9.19] - 2019-09-30 @stormlu
        - 充值和支付统一一个框 样式统一
- [0.9.20] - 2019-10-10 @stormlu
    - submitV2支持支付关闭回调 onClose
- [0.9.21] - 2019-10-14 @stormlu
    - 充值支付框 隐藏 满减活动
- [0.9.22] - 2019-10-14 @stormlu
    - 弹框 滚动条锁定
- [0.9.22] - 2019-10-16 @stormlu
    - TS改造完成 发包
- [0.9.23] - 2019-10-16 @stormlu
    - 异常上报 统一处理 status state 异常都上报
- [0.9.24] - 2019-10-16 @stormlu
    - 异常上报 统一处理 优惠券显示
- [0.9.26] - 2019-10-17 @stormlu
    - 异常上报 统一处理 优惠券显示bugfix    
- [0.9.27] - 2019-10-17 @stormlu
    - 订单缓存 关闭弹框 清掉已创建已取消的订单  
- [0.9.28] - 2019-10-17 @stormlu
    - order 实例导出    
- [0.9.73] - 2020-02-4 @stormlu
    - errorReport bugfix      
- [0.9.78] - 2020-02-4 @stormlu
    - errorReport bugfix         
- [0.9.79] - 2020-02-24 @stormlu
    - errorReport 上报 Pard-Id
    