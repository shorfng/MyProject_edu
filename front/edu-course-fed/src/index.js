import '@babel/polyfill';
import Vue from 'vue';
import router from './router';
import App from './App.vue';
import store from './store';
import {
    Dialog,
    Loading,
    Message ,
    Tabs,
    TabPane,
    Upload,
    Input,
    Form,
    FormItem,
    Select,
    Option,
    OptionGroup,
    Button,
    Popover
} from 'element-ui';
import Toast from '@components/Toast/index';
import '@/common/js/init';

Vue.use(Toast);
Vue.component('Toast', Toast);

function appBeforeGoBack() {
    window.location.href = 'https://www.lagou.com/h5/close';
    return false;
}

Vue.use(Dialog).use(Loading);
Vue.prototype.$message = Message;
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Upload);
Vue.use(Input);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Popover);



new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#root');
