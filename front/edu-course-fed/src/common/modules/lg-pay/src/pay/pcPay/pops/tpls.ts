export const payTpl = `
    <div class="lg-pay-container">
        <div class="lg-pay-close"></div>
        <div class="lg-pay-content">
            <div class="lg-pay-title price-title">支付金额</div>
            <div class="price">
                <span class="real-price">800</span>
                <span class="original-price">1000</span>
                <div class="coupon-info">
                    首单立减20
                </div>
            </div>
        </div>
        <div class="lg-pay-content">
            <div class="lg-pay-title pay-title">支付方式</div>
            <div class="lg-pay-select lg-pay-select-wx active">
                <i class="icon"></i>
                <span>微信支付</span>
            </div>
            <div class="lg-pay-select lg-pay-select-ali">
                <i class="icon"></i>
                <span>支付宝支付</span>
            </div>
        </div>
        <div class="lg-pay-content">
            <div class="lg-pay-title">扫码支付</div>
            <div class="lg-pay-qrcode lg-pay-qrcode-wx" style="display:block">
                <canvas id="wxQrcode"></canvas>
            </div>
            <div class="lg-pay-qrcode lg-pay-qrcode-ali">
                <canvas id="aliQrcode"></canvas>
            </div>
        </div>
    </div>
`;

export const rechargePayTpl = `
    <div class="lg-pay-container recharge-pay-container">
        <div class="lg-pay-close"></div>
        <div class='modal-payment-title'>
            <i class='icon-hd'></i>
            <span class='title-text'>已开启安全支付</span>
        </div>
        <div class="recharge-pay-title">请选择支付方式</div>
        <div class='pay-methods'>
                    <div class='pay-method-list'>
                        <div
                            class="lg-pay-select lg-pay-select-ali pay-method-item pay-ali active"
                        >
                            <i class="pay-icon-ali"></i>
                            <span class='pay-method-name'>支付宝支付</span>
                        </div>
                        <div
                            class="lg-pay-select lg-pay-select-wx pay-method-item pay-wx "
                        >
                            <i class="pay-icon-wx"></i>
                            <span class='pay-method-name'>微信支付</span>
                        </div>
                    </div>
                </div>
                <div class="lg-pay-qrcode lg-pay-qrcode-wx">
                    <canvas id="wxQrcode"></canvas>
                </div>
                <div class="lg-pay-qrcode lg-pay-qrcode-ali" style="display:block">
                    <canvas id="aliQrcode"></canvas>
                </div>
                <div class='pay-qrcode-label'>
                    <span>请使用<span class="channel-text">支付宝支付</span>：</span>
                    <span>
                    <span class="price-container">
                        <span class='pay-qrcode-label-money'>100元</span>
                        <span class='real-price'>100元</span>
                        <div class="coupon-info">
                            首单立减20
                        </div>
                    </span>
                    <span class="original-price">1000</span>
                   
                    </span>
                  
                </div>
                <div class="pay-qrcode-status">
                    <span>
                        <span class="left-text">未支付成功，请重新扫码支付</span>
                        <a class="link">我已完成支付</a>
                    </span>
                </div>
                <div class='pay-notes'>
                    <span>付费即表示同意<a href="https://activity.lagou.com/app/business/service-agreement.html"} target="_blank">《拉勾网在线增值服务协议》</a></span>
                </div>
    </div>
`;

export const rechargeConfirmTpl = `
    <div class="lg-pay-container lg-pay-recharge-confirm">
        <div class="lg-pay-close"></div>
        <div class="recharge-title">勾豆充值</div>
        <div>
            <div class="recharge-label">填写充值勾豆数量</div>
            <div class="recharge-amount">
                <input 
                type="text" 
                class="amount input" 
                min="0" 
                max="9999" 
                value="100" 
                />
            </div>
        </div>
        <div class="recharge-tips">
            需支付：<span class="count-show">100元</span><span class="recharge-description">（1元=1勾豆）</span>
        </div>
        <div  class="recharge-btn">立即充值</div>
    </div>
`;