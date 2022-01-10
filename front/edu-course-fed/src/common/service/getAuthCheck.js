import axios from '.';

let http = process.env.NODE_ENV === 'development' ? window.location.origin : 'https://gate.lagou.com/v1/neirong';
const courseId = window.courseInfo.id;

export function fetchAuthCheck() {
    let { courseCId, courseType, sellGoodsId } = this.courseInfo;
    return axios.get(`${http}/kaiwu/getAuthCheck`, {
        params: {
            courseType,
            sellGoodsId,
            courseId,
            courseCId
        }
    });
}

export function fetchConfirmAccompany(courseId = window.courseInfo.id) {
    return axios.post(`${http}/kaiwu/checkCourse`, {
        courseId
    });
}
