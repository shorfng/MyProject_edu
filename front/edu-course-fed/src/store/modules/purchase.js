import {
  COURSE_GET_PURCHASE,
  COURSE_TRIGGER_PURCHASE,
  COURSE_CANCEL_PURCHASE,
  SET_PURCHASE_PORT_IS_FETCH,
  COURSE_GET_ACCOMPANY_MODAL
} from '../actions';
import { fetchAuthCheck } from '../../service/index';

const state = {
  hasPurchaseClass: null,
  isTriggerPurchase: false,
  purchasePortIsFetch: false,
  isShowAccompanyModal: false
};

const getters = {
  hasPurchaseClass: state => {
    return state.hasPurchaseClass;
  },
  isTriggerPurchase: state => state.isTriggerPurchase,
  purchasePortIsFetch: state => state.purchasePortIsFetch,
  isShowAccompanyModal: state => state.isShowAccompanyModal
};

const mutations = {
  [COURSE_GET_PURCHASE]: (state, { data }) => {
    Object.assign(state, data);
  },
  [COURSE_TRIGGER_PURCHASE]: (state, { data }) => {
    Object.assign(state, data);
  },
  [COURSE_CANCEL_PURCHASE]: (state, { data }) => {
    Object.assign(state, data);
  },
  [SET_PURCHASE_PORT_IS_FETCH]: (state, { data }) => {
    Object.assign(state, data);
  },
  [COURSE_GET_ACCOMPANY_MODAL]: (state, { data }) => {
    Object.assign(state, data);
  }
};

const actions = {
  getPurchaseStatus({ commit }) {
    return fetchAuthCheck().then(res => {
      if (res.state === 1) {
        commit(COURSE_GET_PURCHASE, { data: { hasPurchaseClass: true } });
      } else if (res.state === 2001) {
        commit(COURSE_GET_PURCHASE, { data: { hasPurchaseClass: true } });
        commit(COURSE_GET_ACCOMPANY_MODAL, {
          data: { isShowAccompanyModal: true }
        });
      } else {
        commit(COURSE_GET_PURCHASE, { data: { hasPurchaseClass: false } });
      }
      commit(SET_PURCHASE_PORT_IS_FETCH, {
        data: { purchasePortIsFetch: true }
      });
    });
  },
  setPurchaseSuccess({ commit, dispatch }, ) {
    commit(COURSE_GET_PURCHASE, { data: { hasPurchaseClass: true } });
    dispatch('getCourseSections', {courseId: this.$route.query.courseId});
  },
  triggerPurchase({ commit }) {
    console.log('triggerPurchase isTriggerPurchase++++++++');
    commit(COURSE_TRIGGER_PURCHASE, { data: { isTriggerPurchase: true } });
  },
  resetPurchaseStatus({ commit }) {
    commit(COURSE_CANCEL_PURCHASE, { data: { isTriggerPurchase: false } });
  },
  resetAccompanyModal({ commit }) {
    commit(COURSE_GET_ACCOMPANY_MODAL, {
      data: { isShowAccompanyModal: false }
    });
  }
};

export default {
  getters,
  state,
  mutations,
  actions
};
