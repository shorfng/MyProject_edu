import { querystring } from 'vux';
export const reportPlayInfo = (urlParam, isVideo = false) => {
    let errorImg = new Image();
    let key = isVideo ? 'video' : 'audio';
    errorImg.src = `/${key}/report.json?${querystring.stringify(urlParam)}`;
};
