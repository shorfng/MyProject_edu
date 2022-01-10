// @ts-ignore
import lgRequest from 'lagou-base-request';
import { FetchJsonType } from '../index.d';
import { HOST } from "../const/index";

const defaultHeaders = {
    "Content-Type": "application/json"
}


// Add a request interceptor
lgRequest.interceptors.request.use(function (config: any) {
    // Do something before request is sent
    config.options.headers = Object.assign({
        "Authorization": window.localStorage.getItem('accessToken')
    }, config.options.headers, defaultHeaders);
    return config;
}, function (error: FetchJsonType) {
    // Do something with request error
    return Promise.reject(error);
});

lgRequest.interceptors.response.use(function (response: FetchJsonType) {
    // Do something with response data
    try {
        let needReport = (response && response.url && response.url.indexOf('/pay/report/error') < 0) //上报接口异常不上报
            &&
            (response && response.content && (response.content.status != undefined && response.content.status != 1) ||  response.state != 1) // state ！= 1 content.status 异常
        if (needReport) {
            getErrorReport(response.url, response);
        }
    }catch(e) {
        console.log(e);
    }
    return response;
}, function (error: FetchJsonType) {
    // Do something with response error
    return Promise.reject(error);
});

// 支付流程中出现错误的通知
function getErrorReport(reqURL: string, data: any) {
    // @ts-ignore
    lgRequest.get(`${HOST.gnctx}/pay/report/error`, {
        address: encodeURIComponent(window.location.href),
        url: encodeURIComponent(reqURL),
        statusCode: data.content.status || data.state,
        message: data.msg || data.content && data.content.msg || data.message || 'error msg',
        pardId:data.headers && data.headers.get && data.headers.get('Pard-Id') || ''
    })
}

export default lgRequest;

