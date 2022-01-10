import Vue from 'vue';
import Vuex from 'vuex';

import userInfo from './modules/userInfo';
import purchase from './modules/purchase';
import courseList from './modules/courseList';
import videoPlayer from './modules/videoPlayer';
import courseInfo from './modules/courseInfo';
import share from './modules/share';
import currentEnv from './modules/currentEnv';
import h5LoginModal from './modules/h5LoginModal';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loginUser: {}
    },
    modules: {
        userInfo,
        purchase,
        courseList,
        videoPlayer,
        courseInfo,
        share,
        currentEnv,
        h5LoginModal
    }
});
