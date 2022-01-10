import axios from 'axios';
import jsonp from 'jsonp';
import { fetchUpdateToken } from '@/service/index';

// axios.defaults.headers.common['token'] = window.localStorage.getItem('accessToken'); // for all requests （对于所有的请求）
axios.interceptors.request.use(
    config => {
        // 每次发送请求之前判断vuex中是否存在token
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = window.localStorage.getItem("accessToken");
        token && (config.headers.Authorization = token);
        return config;
    },
    error => {
        return Promise.error(error);
    }
);
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401: //Unauthorized
                    if(error.response.config.url.indexOf('/user/refresh_token')  == -1){
                        fetchUpdateToken().then((res)=>{
                            window.localStorage.getItem("accessToken");
                            return axios.request(error.response.config);
                        });
                    }else{
                        window.localStorage.removeItem("accessToken");
                        window.localStorage.removeItem("refreshToken");
                    }

                    break;

                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面
                case 403: //403
                    // vant.Toast.fail("登录过期，请关闭重新进入。");
                    // 清除token
                    break;

                // 404请求不存在
                case 404:
                    // vant.Toast.fail("您访问的网页不存在。");
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    // vant.Toast.fail(error.response.data.message);
            }
            return Promise.reject(error.response);
        }
    }
);
axios.defaults.withCredentials = true; // carry cookie（携带 cookie）

export function fetchGet(url, params = {}, config = {}) {
    return new Promise((resolve, reject) => {
        config.params = params;
        axios.get(url, config).then(res => {
            resolve(res.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function Serialize(a) {
    // /    <summary>
    // /        This method is internal.  Use serialize() instead.
    // /    </summary>
    // /    <param name="a" type="Map">A map of key/value pairs to serialize into a string.</param>'
    // /    <returns type="String" />
    // /    <private />

    var s = [];

    function add(key, value) {
        s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        // s[ s.length ] = (key) + '=' + (value);
    }

    // Serialize the key/values
    for (var j in a) {
        add(j, a[j]);
    }

    // Return the resulting serialization
    return s.join('&').replace(/%20/g, '+');
}

export function fetchPost(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data, config).then(res => {
            resolve(res.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function fetchJsonp(url, params) {
    let requestUrl = url;
    if (params) {
        params._ = Date.parse(new Date());
        const dataString = url.indexOf('?') === -1 ? '?' : '&';
        requestUrl = `${requestUrl}${dataString}`;
        for (const k in params) {
            requestUrl += `&${k}=${params[k]}`;
        }
    }
    return new Promise((resolve, reject) => {
        jsonp(requestUrl, { param: 'jsoncallback' }, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

export default axios;
