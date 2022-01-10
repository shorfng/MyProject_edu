import { COURSE_SET_PLAY_HISTORY, COURSE_SET_LOADING_HISTORY, LESSON_SET_REPORT_HEART, COURSE_SET_COPY_RIGHT, SET_COURSE_INFOS_BASE } from '../actions';
import { fetchSaveHistory, fetchGetCourseHistory } from '../../service';

const VIDEO_AUDIO = 'VIDEO_AUDIO';
const ACCOMPANY = 'ACCOMPANY';
const EMPLOYMENT = 'EMPLOYMENT';
const VIDEO = 'VIDEO';
const SPECIAL_COURSE_ID = 185;

const state = {
    courseInfo: {},
    courseId: '',
    isAccompanyCourse: getCourseInfo().type === ACCOMPANY,
    isEmploymentCourse: getCourseInfo().type === EMPLOYMENT,
    isVideoAudioCourse: getCourseInfo().type === VIDEO_AUDIO,
    isVideoCourse: true,
    courseIntroHref: getCourseInfo().url,
    coursePlayRecord: {},
    isLoadingHistory: false,
    isReportHeart: false,
    reportTimerId: null,
    isPreventCopyRight: false,
    startTimerId: null,
    isSpecialCourseId: SPECIAL_COURSE_ID === courseInfo.id
};

const getters = {
    courseInfo: state => state.courseInfo,
    courseId: state => state.courseId,
    isAccompanyCourse: state => state.isAccompanyCourse,
    isEmploymentCourse: state => state.isEmploymentCourse,
    isVideoAudioCourse: state => state.isVideoAudioCourse,
    isVideoCourse: state => state.isVideoCourse,
    coursePlayRecord: state => state.coursePlayRecord,
    isLoadingHistory: state => state.isLoadingHistory,
    isReportHeart: state => state.isReportHeart,
    courseIntroHref: state => state.courseIntroHref,
    isPreventCopyRight: state => state.isPreventCopyRight,
    isSpecialCourseId: state => state.isSpecialCourseId
};

const mutations = {
    [COURSE_SET_PLAY_HISTORY]: (state, { data }) => {
        let { coursePlayRecord } = state;
        coursePlayRecord.lessonId = data.lessonId;
        Object.assign(state, { coursePlayRecord });
    },
    [COURSE_SET_LOADING_HISTORY]: (state, { data }) => {
        Object.assign(state, data);
    },
    [LESSON_SET_REPORT_HEART]: (state, { data }) => {
        Object.assign(state, data);
    },
    [COURSE_SET_COPY_RIGHT]: (state, { data }) => {
        Object.assign(state, data);
    },
    [SET_COURSE_INFOS_BASE]: (state, { data }) => {
        Object.assign(state, data);
    },
};

const actions = {
    setLessonHistoryReq({ commit, rootGetters, dispatch }, historyObj) {
        let data = historyObj || rootGetters.currentCourseLessons;
        let { courseId, sectionId, id, mediaType, historyNode, hasLearned } = data;
        let saveData = {
            courseId,
            sectionId,
            lessonId: id,
        };
        // mediaType: 0 播放音频
        // mediaType: 1 播放视频
        // mediaType: 2 查看课时详情
        if (typeof mediaType === 'number') {
            saveData.mediaType = mediaType;
            saveData.historyNode = historyNode || 0;
        }
        else {
            saveData.mediaType = 2;
        }
        fetchSaveHistory(saveData).then(() => {
            console.log('fetchSaveHistory++++', hasLearned);
            if (!hasLearned) {
                dispatch('setLessonLearned', {
                    sectionId,
                    lessonId: id
                });
            }
        });
    },
    getCoursePlayHistory({ commit, state }) {
        commit(COURSE_SET_LOADING_HISTORY, {
            data: { isLoadingHistory: true }
        });
        if (!window.userInfo || !window.userInfo.id) {
            commit(COURSE_SET_LOADING_HISTORY, {
                data: { isLoadingHistory: false }
            });
            return;
        }
        fetchGetCourseHistory().then(res => {
            let { content = {} } = res;
            if (!content || !content.lessonId) return;
            commit(COURSE_SET_PLAY_HISTORY, {
                data: { lessonId: content.lessonId }
            });
        }).finally(() => {
            commit(COURSE_SET_LOADING_HISTORY, {
                data: { isLoadingHistory: false }
            });
        });
    },
    reportLessonHeart({ commit, rootGetters }) {

    },
    setIsReportHeart({ commit, rootGetters }, isReportHeart) {
        if (!state.isReportHeart && isReportHeart) {
            setReportTimer(commit);
            actions.reportLessonHeart({ commit, rootGetters });
        }
        else if (isReportHeart) {
            setReportTimer(commit);
        }
        else if (!isReportHeart) {
            clearTimeout(state.startTimerId);
            clearTimeout(state.reportTimerId);
        }
        (isReportHeart !== state.isReportHeart) && commit(LESSON_SET_REPORT_HEART, {
            data: { isReportHeart }
        });
    },
    setBaseInfoCourse({ commit, rootGetters }, setData) {
        commit(SET_COURSE_INFOS_BASE, {
            data: { ...setData }
        });
    }
};

export default {
    getters,
    state,
    mutations,
    actions
};

function getCourseInfo() {
    return {
        type: VIDEO,
        url:''
    };
}

function setReportTimer(commit) {
    if (state.reportTimerId) {
        clearTimeout(state.startTimerId);
    }
    state.startTimerId = setTimeout(() => {
        clearTimeout(state.reportTimerId);
        state.reportTimerId = null;
        commit(LESSON_SET_REPORT_HEART, {
            data: { isReportHeart: false }
        });
    }, 61000);
}
