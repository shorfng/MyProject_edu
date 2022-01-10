import axios from './index';
import HOST  from './host';

export function fetchVideoPlayInfo(videoConfig) {
    let url = HOST.gnctx + '/course/media/videoPlayInfo';
    let params = {
        lessonId: videoConfig.lessonId
    }
    return axios.get(url, { params });
}

export function fetchWatermarkInfo() {
    return axios.get('https://gate.lagou.com/v1/neirong/kaiwu/getCourseVideoWaterMark');
}

export function reportDelete(lessonId) {
    let{ id: courseId = 0, courseType = 2 } = this.courseInfo || {};
    return axios.post('https://gate.lagou.com/v1/neirong/kaiwu/reportRemoveVideoWaterMark', {
        courseId,
        courseType,
        lessonId
    });
}
