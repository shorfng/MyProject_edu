import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    redirect: '/index'
  },
  {
    path: '/index',
    component: () => import('../pages/index.vue'),
    meta: {
      title: '首页',
    }
  },
  {
    path: '/about',
    component: () => import('../pages/about.vue'),
    meta: {
      title: '首页',
    }
  },
];

export default new VueRouter({
  routes,
});
