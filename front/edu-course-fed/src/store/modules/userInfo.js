import {
    SET_USER_INFO,
    GET_USER_INFO
} from '../actions';
import {
    fetchUserInfo
} from '../../service';

const state = {
    userInfo: {}
};

const getters = {
    isLogin: state => {
        return !!state.userInfo.userName ;
    },
    userInfo: state => state.userInfo
};

const mutations = {
    [SET_USER_INFO]: (state, { data }) => {
        Object.assign(state, data);
    },
    [GET_USER_INFO]: (state, { data }) => {
        Object.assign(state, data);
    },
};

const actions = {
    updateRefreshToken({ commit }) {
        fetchCheckCourseShareStatus().then(res => {
            if (res.state === 1) {
                commit(SHARE_SET_STATUS, { data: { isSharedCourse: true } });
            }
            else if (res.state === 0) {
                commit(SHARE_SET_STATUS, { data: { shareData: res.content } });
            }
        });
    },
    getUserInfo({ commit }) {
        fetchUserInfo().then(res => {
            if (res.data.state === 1) {
                commit(SET_USER_INFO, { data: { userInfo: res.data.content } });
            }
        });
    },
    logoutUser({ commit }) {
        commit(SET_USER_INFO, { data: { userInfo: {} } });
        window.localStorage.removeItem('refreshToken');
        window.localStorage.removeItem('accessToken');
    },
};

export default {
    getters,
    state,
    mutations,
    actions
};
