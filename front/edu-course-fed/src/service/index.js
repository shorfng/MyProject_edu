import { fetchGet, fetchPost, fetchJsonp, Serialize } from '../common/service';
import HOST from '../common/service/host';
import qs from 'qs';

export function fetchLessonPlayHistory(params) {
    return fetchGet(`${HOST.gnctx}/course/historyNode/getByLessonId`, params);
}


export function fetchSuccessUrlV2(params) {
    return fetchGet(`${HOST.gnctx}/pay/successUrlV2`, params);
}

export function fetchSaveHistory(params) {
    return fetchPost(`${HOST.gnctx}/course/historyNode/saveCourseHistoryNode`, params);
}


export function fetchCourseLessonDetail(params) {
    return fetchGet(`${HOST.gnctx}/kaiwu/getCourseLessonDetail`, params);
}


export function fetchShareCourse() {
    return fetchGet(`${HOST.gnctx}/kaiwu/shareCourse?courseId=${window.courseInfo.id}`);
}

export function fetchGetAutoLoginUrl(params) {
    return fetchGet(`${HOST.gnctx}/kaiwu/getAutoLoginUrl`, params);
}


export const fetchPhoneCode = (params) => {
    return fetchJsonp(`https://passport.lagou.com/login/sendVerifyCode.json`, params);
};

export const fetchCountryCode = (params) => {
    return fetchJsonp(`https://passport.lagou.com/register/getPhoneCountryCode.json`, params);
};

export const submitPassWord = (params) => {
    return fetchJsonp(`https://passport.lagou.com/login/registerAndLogin.json`, params);
};

// 课程留言列表
export const fetchGetCourseCommentList = (params) => {
    return fetchPost(`${HOST.gnctx}/comment/getCourseCommentList`, params);
};
// 点赞👍
export const fetchUpdateCourseCommentLikeCount = (params) => {
    let url = `${HOST.gnctx}/comment/favorite`;
    if(!params.flag){
        url = `${HOST.gnctx}/comment/cancelFavorite`;
    }

    return fetchGet(url, params);
};
// 发表留言
export const fetchSaveCourseComment = (data) => {
    return fetchPost(`${HOST.gnctx}/comment/saveCourseComment`, data);
};
// 删除留言
export const fetcheDeleteCourseComment = (params) => {
    return fetchGet(`${HOST.gnctx}/comment/deleteCourseComment`, params);
};
// 获取自己的留言
export const fetcheGetMyCommentList = (params) => {
    return fetchGet(`${HOST.gnctx}/course/comment/getMyCommentList`, params);
};

export const fetchDecorateComment = () => {
    return fetchGet(`${HOST.gnctx}/course/comment/getDecorateCommentVo`, {
        moduleId
    });
};

export const fetchDecorateDes = () => {
    return fetchGet(`${HOST.gnctx}/kaiwu/getDecorateDescription`, {
        moduleId
    });
};

export const fetchBuyUserInfo = () => {
    return fetchGet(`${HOST.gnctx}/kaiwu/getBuyUserInfo`, {
        decorateId
    });
};
// 小鹅通二期：判断是否需要获取UnionId
export const fetchCheckUnionNeedRebind = (params) => {
    return fetchGet(`${HOST.gnctx}/kaiwu/checkUnionNeedRebind`, params);
};
export const fetchCourseLessons = (courseId) => {
    return fetchGet(`${HOST.gnctx}/course/session/getSectionAndLesson`, {
        courseId
    });
};


export const fetchCourseInfo = (courseId) => {
    return fetchGet(`${HOST.gnctx}/course/getCourseById`, {
        courseId
    });
};



import axios from '@/common/service/index';


export function fetchCouponStatus() {
    return axios.get(`${HOST.gnctx}/coupon/popCoupon`);
}

export function fetchGiftReward(couponId) {
    return axios.get(`${HOST.gnctx}/coupon/drawCoupon?couponId=${couponId}`, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });
}

export function fetchCheckAccompanyCourse() {
    return axios.get(`${HOST.gnctx}/kaiwu/getUnCheckAccompanyCourse`);
}


export function fetchBannerList() {
    return axios.get(`${HOST.gnctx}/kaiwu/getBannerListV2`);
}

export function fetchIceBreakingLocation() {
    return axios.get(`${HOST.gnctx}/kaiwu/iceBreakingLocation/info`);
}

export function fetchPurchasedRecord() {
    return axios.get(`${HOST.gnctx}/kaiwu/getAllCoursePurchasedRecordForPC`).then(res => {
        let { state, content } = res.data;
        if (state === 1 && content) {
            return content;
        }
    });
}
export function fetchGetCourseSecondType(param) {
    return axios.get(`${HOST.gnctx}/edu/enterprise/getCourseSecondType`, param);
}

// 首页头部banner和运营活动位
export function fetchGetPromotionList() {
    return axios.get(`${HOST.gnctx}/edu/homepage/getPromotionList`);
}

// 首页训练营列表
export function fetchGetContentList() {
    return axios.get(`${HOST.gnctx}/edu/homepage/getContentList`);
}

// 首页课程列表
export function fetchGetCourseList() {
    return axios.get(`${HOST.gnctx}/edu/homepage/getCourseList`);
}

//pc课程列表 异步
export function fetchPcCourseList() {
    return axios.get(`${HOST.gnctx}/course/getAllCourse`);
}

//pc 已购课程列表 异步
export function fetchPcPurchaseCourse() {
    return axios.get(`${HOST.gnctx}/course/getPurchaseCourse`);
}



//登录|注册
export function loginRegiste(data) {

    return axios.post(`${HOST.gnctx}/user/login?${Serialize(data)}`);
}

//获取验证码
export function sendValidateCode(data) {
    return axios.post(`${HOST.gnctx}/user/vfcode/sendCode?${Serialize(data)}`)
}

//检查验证码是否正确
export function checkValidateCode(data) {
    return axios.post(`${HOST.gnctx}/user/vfcode/checkCode?${Serialize(data)}`)
}

//获取用户信息
export function fetchUserInfo() {
    return axios.get(`${HOST.gnctx}/user/getInfo`);
}

//微信解绑
export function unBindWeChat() {
    return axios.get(`${HOST.gnctx}/weixin/unBind`)
}

//微信绑定
export function bindWeChat() {
    return axios.post(`${HOST.gnctx}/weixin/bind`)
}



//用户登出
export function fetchUserLogout() {
    return axios.post(`${HOST.gnctx}/user/logout`);
}

//修改密码
export function fetchUpdatePassword(data) {
    return axios.post(`${HOST.gnctx}/user/updatePassword?${Serialize(data)}`);
}

//设置密码
export function fetchSetPassword(data) {
    return axios.post(`${HOST.gnctx}/user/setPassword?${Serialize(data)}`);
}

//更新用户信息
export function fetchUpdateInfo(data) {
    // return axios({
    //     method: 'post',
    //     url: `${HOST.gnctx}/user/updateInfo?${Serialize(data)}`
    // })
    return axios.post(`${HOST.gnctx}/user/updateInfo?${Serialize(data)}`);
    // return axios.post(`${HOST.gnctx}/user/updateInfo?${qs.stringify(data)}`);
}

//更新token
export function fetchUpdateToken(data) {
    return axios.post(`${HOST.gnctx}/user/refresh_token?${Serialize(data)}`);
}

//更新消息为已读
export  function updateReadStatus() {
    return axios.get(`${HOST.gnctx}/message/updateReadStatus`);
}

//消息列表
export function getMessageList(data) {
    return axios.post(`${HOST.gnctx}/message/getMessageList`,data);
}

export function getAds(spaceKeys) {
    return fetchGet(`${HOST.gnctx}/ad/getAllAds`,{spaceKeys})
}


export function getUnReadMessage(spaceKeys) {
    return fetchGet(`${HOST.gnctx}/message/getUnReadMessage`,{spaceKeys})
}
