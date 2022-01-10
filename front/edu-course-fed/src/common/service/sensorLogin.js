import { fetchPost } from './index';
import HOST from './host';
export const fetchSensorLogin = (params) => {
    return fetchPost(`${HOST.gnctx}/kaiwu/sensors/login`, params);
};