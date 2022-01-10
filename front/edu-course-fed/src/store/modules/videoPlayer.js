import {
    PLAYER_GET_STATUS,
    PLAYER_SET_RATE,
    SET_MINI_BAR_IS_SHOW,
    SET_CLICK_START_PLAY_MUSIC_STATUS,
    GET_PLAYER_ALL_TIME,
    GET_PLAYER_CURRENT_TIME,
    SET_PLAYER_IS_FIRST,
    GET_PLAYER_DURATION,
    SLIDE_SET_TIME,
    GET_SECOND_CURRENT_TIME,
    SET_OTHER_VIDEO_PLAYER_STATE,
    SET_IS_PLAYER_FIRST_LOADED,
    SET_PLAYER_IS_READY,
    SET_IS_SWITCH_VIDEO,
    SWITCH_PLAY_STATUS,
    SET_PLAYER_BACK_STATUS
} from '../actions';

import { formatTime } from '../../common/js/util/formatTime';
import { getEduAppVersion, isEduApp, getAppVersion, isLgApp, isBiggerThanSpecifiedVersion } from '../../common/js/userAgent/getVersion';

const nativeAudioPlayer = '1.2.0';
const nativeLgVideoPlayerVersion = '7.41.0';
let isNativeAudioPlay = false;
let nativeAudioPlayerPrefix = '';

if (isEduApp()) {
    nativeAudioPlayerPrefix = 'lgedu://lgedu.com';
    isNativeAudioPlay = isBiggerThanSpecifiedVersion(getEduAppVersion(), nativeAudioPlayer);
}
else if (isLgApp()) {
    nativeAudioPlayerPrefix = 'lagou://lagou.com';
    isNativeAudioPlay = isBiggerThanSpecifiedVersion(getAppVersion(), nativeLgVideoPlayerVersion);
}

const state = {
    playerStatus: {
        isPlaying: false,
        theme: '',
        time: '',
        fileId: ''
    },
    otherVideoPlayerState: null,
    isSlideShowMiniBar: false, //是否滑动展示音乐小条
    isShowMiniBar: false, //是否展示音乐小条
    playerRate: 1,
    playerAllTime: '00:00',
    playerCurrentTime: '00:00',
    playerDuration: 0,
    isPlayerFirstLoaded: false, //音频第一次加载完成
    playerSecondCurrentTime: 0,
    slideSetTime: null,
    isFirstPlay: true,
    isPlayerReady: true,
    isNativeAudioPlay,
    isSwitchVideo: false,
    isPause: false,
    nativeAudioPlayerPrefix,
    nativeLgVideoPlayerVersion,
    isPlayingBeforeBack: false
};

const getters = {
    isPause: state => state.isPause,
    nativeLgVideoPlayerVersion: state => state.nativeLgVideoPlayerVersion,
    playerStatus: state => state.playerStatus,
    playerRate: state => state.playerRate,
    playerAllTime: state => state.playerAllTime,
    playerCurrentTime: state => state.playerCurrentTime,
    isSlideShowMiniBar: state => state.isSlideShowMiniBar,
    isShowMiniBar: state => state.isShowMiniBar,
    playerDuration: state => {
        let { playerDuration } = state;
        if (typeof playerDuration === 'number' && !isNaN(playerDuration)) {
            return playerDuration;
        } else {
            return 0;
        }
    },
    slideSetTime: state => state.slideSetTime,
    isPlayerReady: state => state.isPlayerReady,
    isPlayerFirstLoaded: state => state.isPlayerFirstLoaded,
    otherVideoPlayerState: state => state.otherVideoPlayerState,
    playerSecondCurrentTime: state => state.playerSecondCurrentTime,
    isNativeAudioPlay: state => state.isNativeAudioPlay,
    isSwitchVideo: state => state.isSwitchVideo,
    nativeAudioPlayerPrefix: state => state.nativeAudioPlayerPrefix,
    isPlayingBeforeBack: state => state.isPlayingBeforeBack
};

const mutations = {
    [SWITCH_PLAY_STATUS]: (state, data) => {
        state.isPause = data;
        return state.isPause;
    },
    [PLAYER_GET_STATUS]: (state, data) => {
        state.playerStatus = { ...data };
        return state.playerStatus;
    },
    [PLAYER_SET_RATE]: (state, rate) => {
        state.playerRate = rate;
        return state.playerRate;
    },
    [SET_MINI_BAR_IS_SHOW]: (state, { data }) => {
        Object.assign(state, data);
    },
    [SET_CLICK_START_PLAY_MUSIC_STATUS]: (state, { data }) => {
        Object.assign(state, data);
    },
    [SLIDE_SET_TIME]: (state, { data }) => {
        Object.assign(state, data);
    },
    [GET_PLAYER_ALL_TIME]: (state, time) => {
        state.playerAllTime = time;
        return state.playerAllTime;
    },
    [GET_PLAYER_CURRENT_TIME]: (state, time) => {
        state.playerCurrentTime = time;
        return state.playerCurrentTime;
    },
    [GET_SECOND_CURRENT_TIME]: (state, time) => {
        state.playerSecondCurrentTime = time;
        return state.playerSecondCurrentTime;
    },
    [SET_PLAYER_IS_FIRST]: (state, flag) => {
        state.isFirstPlay = flag;
        return state.isFirstPlay;
    },
    [SET_OTHER_VIDEO_PLAYER_STATE]: (state, data) => {
        state.otherVideoPlayerState = data;
        return state.otherVideoPlayerState;
    },
    [SET_IS_PLAYER_FIRST_LOADED]: (state, isPlayerFirstLoaded) => {
        state.isPlayerFirstLoaded = isPlayerFirstLoaded;
        return state.isPlayerFirstLoaded;
    },
    [GET_PLAYER_DURATION]: (state, playerDuration) => {
        state.playerDuration = playerDuration;
        return state.playerDuration;
    },
    [SET_PLAYER_IS_READY]: (state, isReady) => {
        state.isPlayerReady = isReady;
        return state.isPlayerReady;
    },
    [SET_IS_SWITCH_VIDEO]: (state, flag) => {
        state.isSwitchVideo = flag;
        console.log('SET_IS_SWITCH_VIDEO', flag);
        return state.isSwitchVideo;
    },
    [SET_PLAYER_BACK_STATUS]: (state, flag) => {
        state.isPlayingBeforeBack = flag;
        return state.isPlayingBeforeBack;
    },
};

const actions = {
    setLessonPlayer({ state, commit, rootGetters }, data = {}) {
        if (rootGetters.isVideoCourse) {
            commit(SET_IS_SWITCH_VIDEO, true);
        }
        let { id, isPlaying, isSliderChange = false, isNativeNotify = false } = data;
        let target = getCurrentLesson(rootGetters.courseSections, id);
        console.log('setLessonPlayer+++++++');
        console.log(target);
        if (!target || !target.id) {
            target = { id };
        }
        // 视频课程只切换当前课时信息
        if (rootGetters.isVideoCourse) {
            target.isPlaying = true;
            commit(PLAYER_GET_STATUS, target);
            setTimeout(() => {
                commit(SET_IS_SWITCH_VIDEO, false);
            });
            return;
        }
        console.log('buildAudioPlayURL: ', !isNativeNotify, state.isNativeAudioPlay);
        // isNativeNotify: 原生的回调时，啥都不用做
        // 自己设置播放状态，且原生支持音频播放，之后他们那边会有回调回来，所以直接 return
        if (!isNativeNotify && state.isNativeAudioPlay) {
            let url = buildAudioPlayURL(target, isPlaying);
            console.log('buildAudioPlayURL', url);
            window.location.href = url;
            return;
        }
        if (isPlaying && !state.isNativeAudioPlay) {
            actions.setMiniBarStatus({ state, commit }, { isShowMiniBar: true });
            actions.setSlideMiniBarShow({ state, commit }, { isSlideShowMiniBar: false });
        }
        target.isPlaying = isPlaying;
        target.isSliderChange = isSliderChange;
        commit(PLAYER_GET_STATUS, target);
    },
    setRate({ state, commit }, rate) {
        commit(PLAYER_SET_RATE, rate);
    },
    setSlideMiniBarShow({ state, commit }, data) {
        commit(SET_MINI_BAR_IS_SHOW, { data });
    },
    setMiniBarStatus({ state, commit }, data) {
        console.log('setMiniBarStatus', data);
        commit(SET_CLICK_START_PLAY_MUSIC_STATUS, { data });
    },
    setPlayerAllTime({ state, commit }, time) {
        commit(GET_PLAYER_DURATION, parseInt(time));
        let getTime = formatTime(time);
        commit(GET_PLAYER_ALL_TIME, getTime);
    },
    setFormatPlayerCurrentTime({ state, commit }, time) {
        commit(GET_SECOND_CURRENT_TIME, parseInt(time));
        let getTime = formatTime(time);
        commit(GET_PLAYER_CURRENT_TIME, getTime);
    },
    setSlideDragTime({ state, commit }, data) {
        commit(SLIDE_SET_TIME, { data });
    },
    setPlayerIsFirst({ state, commit }, flag) {
        commit(SET_PLAYER_IS_FIRST, flag);
    },
    setOtherVideoPlayerState({ state, commit }, data) {
        commit(SET_OTHER_VIDEO_PLAYER_STATE, data);
    },
    setIsPlayerFirstLoaded({ state, commit }, data) {
        commit(SET_IS_PLAYER_FIRST_LOADED, data);
    },
    setPlayerIsReady({ state, commit }, flag) {
        commit(SET_PLAYER_IS_READY, flag);
    },
    savePlayerBackStatus({ state, commit }, flag) {
        commit(SET_PLAYER_BACK_STATUS, flag);
    }
};

function buildAudioPlayURL(lesson, status) {
    let { courseId, sectionId, id } = lesson;
    // 1: 播放  2: 暂停
    let playStatus = status ? 1 : 0;
    let url = `${state.nativeAudioPlayerPrefix}/AudioPlay?courseId=${courseId}&sectionId=${sectionId}&lessonId=${id}&playStatus=${playStatus}`;
    return url;
}

function getCurrentLesson(courseSections = [], targetLessonId) {
    let currentLesson = {};
    courseSections.find((section, sectionIndex) => {
        currentLesson = section.courseLessons.find((lesson, lessonIndex) => {
            if (lesson.id === targetLessonId) {
                Object.assign(lesson, {
                    sectionIndex,
                    lessonIndex
                });
                let preLesson = getPrevLesson(lesson, courseSections);
                let nextLesson = getNextLesson(lesson, courseSections);
                Object.assign(lesson, preLesson, nextLesson);
                return true;
            }
            return false;
        });
        return currentLesson;
    });
    return currentLesson;
}

function getPrevLesson(currentLesson, courseSections) {
    let { sectionIndex, lessonIndex } = currentLesson;
    // 是否是课程第一节课时
    if (!sectionIndex && !lessonIndex) {
        return {
            isHasPrevious: false
        };
    }
    // 是否是章节第一节课时
    else if (!lessonIndex) {
        let lessonsItem = courseSections[sectionIndex - 1].courseLessons;
        return {
            isHasPrevious: true,
            previousLesson: lessonsItem[lessonsItem.length - 1]
        };
    }
    else {
        let lessonsItem = courseSections[sectionIndex].courseLessons;
        return {
            isHasPrevious: true,
            previousLesson: lessonsItem[lessonIndex - 1]
        };
    }
}

function getNextLesson(currentLesson, courseSections) {
    let { sectionIndex, lessonIndex } = currentLesson;
    let lastLessonIndex = courseSections[sectionIndex].courseLessons.length - 1;
    let courseSectionsLen = courseSections.length;
    let isLastLesson = sectionIndex === courseSectionsLen - 1 && lessonIndex === lastLessonIndex;
    // 是否是最后一课时
    if (isLastLesson) {
        return { isHasNext: false };
    }
    let nextLesson = null;
    // 是否有下一个章节
    if (sectionIndex < courseSectionsLen - 1) {
        // 是否是最后一节课时
        if (lessonIndex === lastLessonIndex) {
            nextLesson = courseSections[sectionIndex + 1].courseLessons[0];
        }
        else {
            nextLesson = courseSections[sectionIndex].courseLessons[lessonIndex + 1];
        }
    }
    else {
        nextLesson = courseSections[sectionIndex].courseLessons[lessonIndex + 1];
    }

    let { type } = nextLesson;
    let isDisabledNext = type === 'wait' || type === 'lock';
    if (isDisabledNext) {
        return { isHasNext: false };
    }
    else {
        return {
            isHasNext: true,
            nextLesson
        };
    }
}

export default {
    getters,
    state,
    mutations,
    actions
};
