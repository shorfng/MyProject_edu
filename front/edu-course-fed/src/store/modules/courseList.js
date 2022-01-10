import  { getHashString }  from '../../common/js/util/getParam';
import {
    COURSE_GET_CURRENT_LESSONS_INFO,
    COURSE_GET_LESSONS_LIST,
    SET_IS_SHOW_LAST_LEARN_LESSON,
    SET_IS_GOT_COURSE_SECTIONS,
    SET_COURSE_SECTIONS,
    COURSE_GET_PURCHASE,
    SET_PURCHASE_PORT_IS_FETCH,
    SET_VIDEO_CHANNEL,
    SET_CAN_HIDE_FAST
} from '../actions';
import { fetchCourseLessons } from '../../service/index';

const state = {
    isShowLastLearnLesson: true, //是否展示上一次学习标签
    currentCourseLessons: {}, //当前选择的课程
    courseSections: [],  //所有课程列表
    isGotCourseSections: false, // 是否获取了所有的 lessons
    isMoreSectionsCourse: false, // 是否是多级目录
    isTCPlayerChannel: false, // 是否是多级目录
    canHideFast: false
};

const getters = {
    currentCourseLessons: state => {
        return state.currentCourseLessons;
    },
    courseSections: state => {
        return state.courseSections;
    },
    isShowLastLearnLesson: state => {
        return state.isShowLastLearnLesson;
    },
    isGotCourseSections: state => {
        return state.isGotCourseSections;
    },
    isMoreSectionsCourse: state => state.isMoreSectionsCourse,
    isTCPlayerChannel: state => state.isTCPlayerChannel,
    iscanHideFast: state => {
        return state.canHideFast;
    },
};

const mutations = {
    [COURSE_GET_CURRENT_LESSONS_INFO]: (state, { data }) => {
        Object.assign(state, data);
    },
    [COURSE_GET_LESSONS_LIST]: (state, { data }) => {
        Object.assign(state, data);
    },
    [SET_IS_SHOW_LAST_LEARN_LESSON]: (state, { data }) => {
        Object.assign(state, data);
    },
    [SET_IS_GOT_COURSE_SECTIONS]: (state, { data }) => {
        Object.assign(state, data);
    },
    [SET_COURSE_SECTIONS]: (state, { data }) => {
        Object.assign(state, data);
    },
    [SET_VIDEO_CHANNEL]: (state, { data }) => {
        Object.assign(state, data);
    },
    [SET_CAN_HIDE_FAST]: (state, { data }) => {
        Object.assign(state, data);
    },
};

const actions = {
    setCurrentCourseLessons({ commit, state }, data) {
        console.log('setCurrentCourseLessons: ', state);
        let currentCourseLessons = {};
        if (data) {
            currentCourseLessons = { ...data };
        }
        else {
            currentCourseLessons = getCurrentLesson(state.courseSections);
        }
        commit(COURSE_GET_CURRENT_LESSONS_INFO, { data: { currentCourseLessons } });
    },
    setLessonLearned({ commit, state }, data) {
        console.log(state);
        let { sectionId, lessonId } = data;
        let courseSections = state.courseSections.slice(0);
        let sectionIndex = null;
        let lessonIndex = null;
        sectionIndex = courseSections.findIndex((section) => {
            if (section.id === sectionId) {
                lessonIndex = section.courseLessons.findIndex((lesson) => {
                    return lesson.id === lessonId;
                });
                return true;
            }
            return false;
        });
        if (!courseSections[sectionIndex]
            || !courseSections[sectionIndex].courseLessons
        ) return;
        courseSections[sectionIndex].courseLessons[lessonIndex].hasLearned = true;
        console.log('setLessonLearned+++++++', courseSections);
        commit(SET_COURSE_SECTIONS, {
            data: {
                courseSections: courseSections,
            }
        });
    },
    setIsShowLastLearnLesson({ commit }, data) {
        commit(SET_IS_SHOW_LAST_LEARN_LESSON, { data });
    },
    getCourseSections({ commit, dispatch }, data) {
        fetchCourseLessons(data.courseId).then(res => {
            if (res.state === 1 && res.content) {
                let { courseSectionList, hasBuy, videoChannelCode, canHideFast } = res.content;
                courseSectionList = courseSectionList || [];
                console.log('fetchCourseLessons', courseSectionList);
                hasBuy = hasBuy || false;
                console.log('fetchCourseLessons hasBuy+++++++: ', hasBuy);
                dispatch('setCourseSectionList', {
                    courseSections: courseSectionList,
                    hasPurchaseClass: hasBuy
                });
                commit(SET_IS_GOT_COURSE_SECTIONS, { data: { isGotCourseSections: true } });
                // 视频渠道CODE,1 阿里云，2 腾讯云
                let isTCPlayerChannel = false;
                commit(SET_CAN_HIDE_FAST, { data: { canHideFast } });
                commit(SET_PURCHASE_PORT_IS_FETCH, { data: { purchasePortIsFetch: true } });
                commit(SET_VIDEO_CHANNEL, { data: { isTCPlayerChannel } });
                commit(COURSE_GET_PURCHASE, { data: { hasPurchaseClass: hasBuy } });
                commit(COURSE_GET_CURRENT_LESSONS_INFO, { data: { currentCourseLessons: getCurrentLesson(courseSectionList) } });
            }
        });
    },
    setCourseSectionList({ commit }, data) {
        let { courseSections, hasPurchaseClass } = data;
        courseSections = setLessonType(courseSections, hasPurchaseClass);
        commit(SET_COURSE_SECTIONS, {
            data: {
                courseSections: courseSections,
                isMoreSectionsCourse: courseSections.length > 1
            }
        });
    }
};

// 设置当前课时
function getCurrentLesson(courseSections) {
    console.log('设置当前课时', courseSections);
    let queryId = getHashString('id');
    console.log('queryId: ', queryId);
    let findCurrentLesson = null;
    if (queryId) {
        for (let k = 0, j = courseSections.length; k < j; k++) {
            const lessons = courseSections[k].courseLessons;
            for (let i = 0, l = lessons.length; i < l; i++) {
                if (lessons[i].id === Number(queryId)) {
                    findCurrentLesson = lessons[i];
                    break;
                }
            }
            if (findCurrentLesson) {
                break;
            }
        }
    }
    return findCurrentLesson || {};
}

// 设置课时类型
function setLessonType(courseSections = [], hasPurchaseClass = false) {
    let { coursePlayHistoryDTO: history } = window.courseInfo;
    courseSections.forEach(section => {
        section.courseLessons.forEach(item => {
            if (item.status === 'UNRELEASE') {
                item.type = 'wait';
            }
            else if (!item.canPlay) {
                item.type = 'lock';
            }
            else if (!hasPurchaseClass) {
                item.type = 'free';
            }
            else if (history && item.id === history.lessonId) {
                item.type = 'last';
            }
        });
    });
    return courseSections;
}

export default {
    getters,
    state,
    mutations,
    actions
};
