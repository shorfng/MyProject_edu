import '@babel/polyfill';
import Vue from 'vue';
import router from './router/index.js';
import App from './App.vue';
import store from './store';

import '@js/init.js';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#root');
