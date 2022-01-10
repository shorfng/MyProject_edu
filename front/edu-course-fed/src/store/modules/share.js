import {
    SHARE_SET_STATUS,
    GET_SHARE_DATA
} from '../actions';
import {
    fetchShareCourse,
    fetchCheckCourseShareStatus
} from '../../service';

const state = {
    isSharedCourse: false,
    shareData: {}
};

const getters = {
    isSharedCourse: state => {
        return state.isSharedCourse;
    },
    getShareInfo: state => state.shareData
};

const mutations = {
    [SHARE_SET_STATUS]: (state, { data }) => {
        Object.assign(state, data);
    },
    [GET_SHARE_DATA]: (state, { data }) => {
        Object.assign(state, data);
    },
};

const actions = {
    checkShareCourseStatus({ commit }) {
        fetchCheckCourseShareStatus().then(res => {
            if (res.state === 1) {
                commit(SHARE_SET_STATUS, { data: { isSharedCourse: true } });
            }
            else if (res.state === 0) {
                commit(SHARE_SET_STATUS, { data: { shareData: res.content } });
            }
        });
    },
    submitShareRecord({ commit }) {
        fetchShareCourse().then(res => {
            if (res.state === 1) {
                commit(SHARE_SET_STATUS, { data: { isSharedCourse: true } });
            }
        });
    }
};

export default {
    getters,
    state,
    mutations,
    actions
};
