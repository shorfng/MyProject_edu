import { fetchJsonp } from '@service/index';

export const fetchPhoneCode = (params) => {
    return fetchJsonp(`https://passport.lagou.com/login/sendVerifyCode.json`, params);
};

export const submitPassWord = (params) => {
    return fetchJsonp(`https://passport.lagou.com/login/registerAndLogin.json`, params);
};

export const fetchCountryCode = (params) => {
    return fetchJsonp(`https://passport.lagou.com/register/getPhoneCountryCode.json`, params);
};
