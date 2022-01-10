import { parseObjToUrl } from '@js/util/getParam';

const oceanEngineURL = 'https://ad.toutiao.com/track/activate/?';

export const fetchOceanEngine = event_type => {
    let url = oceanEngineURL + parseObjToUrl({
        link: encodeURIComponent(window.location.href),
        conv_time: parseInt(new Date().getTime() / 1000),
        event_type
    });
    let reportImg = new Image();
    reportImg.src = url;
};