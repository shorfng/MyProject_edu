const protocol = window.location.protocol;
const host = window.location.host;
const baseUrl = `${protocol}//${host}`;

export default {
    ctx: 'https://www.lagou.com',
    rctx: 'https://hr.lagou.com',
    crctx: 'https://hr.lagou.com/company',
    pctx: 'https://passport.lagou.com',
    actx: 'https://account.lagou.com',
    cpctx: 'https://xiaoyuan.lagou.com',
    acctx: 'https://activity.lagou.com',
    paictx: 'https://pai.lagou.com',
    sctx: 'https://suggest.lagou.com',
    zctx: 'https://yanzhi.lagou.com',
    ectx: 'https://easy.lagou.com',
    kctx: 'https://kaiwu.lagou.com',
    proctx: 'https://pro.lagou.com',
    lgsctx: `${protocol}//www.lgstatic.com`,
    FE_frontLogin: `${baseUrl}/frontLogin.do`,
    FE_frontLogout: `${baseUrl}/frontLogout.do`,
    FE_frontRegister: `${baseUrl}/frontRegister.do`,
};
