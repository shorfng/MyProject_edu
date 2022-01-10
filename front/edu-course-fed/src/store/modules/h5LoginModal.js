import {
  SET_H5_LOGIN_MODAL_STATUS
} from '../actions';

const state = {
    showH5LoginModal: false,
    showH5LoginModalType: '',
    showH5LoginModalSelfTop: 0
};

const getters = {
  showH5LoginModal: state => {
      return state.showH5LoginModal;
  },
  showH5LoginModalType: state => {
      return state.showH5LoginModalType;
  },
  showH5LoginModalSelfTop: state => {
    return state.showH5LoginModalSelfTop;
  }
};

const mutations = {
    [SET_H5_LOGIN_MODAL_STATUS]: (state, { data }) => {
        Object.assign(state, data);
    },
};

const actions = {
    setH5LoginModalStatus({ commit, state }, data) {
      if (data.showH5LoginModal) {
        let container = document.querySelector('#app div');
        let selfTop = 0;
        if (container) {
          selfTop = container.getBoundingClientRect().top;
        }
        document.body.style.cssText += 'position:fixed;overflow: hidden;height: auto;top: ' + selfTop + 'px';
        console.log('selfTop open', selfTop);
        data.showH5LoginModalSelfTop = selfTop;
      }
      else {
        let body = document.body;
        body.style.position = '';
        body.style.height = '100%';
        body.style.overflow = 'scroll';
        document.body.scrollTop = document.documentElement.scrollTop = Math.abs(state.showH5LoginModalSelfTop);
        console.log('showH5LoginModalSelfTop close', state.showH5LoginModalSelfTop);
      }
      console.log('actions data', data);
      commit(SET_H5_LOGIN_MODAL_STATUS, { data });
    },
};

export default {
    getters,
    state,
    mutations,
    actions
};
