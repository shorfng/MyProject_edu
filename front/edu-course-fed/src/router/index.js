import Vue from 'vue';
import VueRouter from 'vue-router';
import { getParam } from '@js/util/getParam';
import { judgePC } from '@js/util/util';
import { fetchUpdateToken } from '@/service';
import axios from "axios";

Vue.use(VueRouter);

const CourseListContainer = () => import('../pages/CourseListContainer.vue');
const CampList = () => import('../pages/CampList.vue');

const ContentPage = () => import('../pages/contents.vue');
const DetailPage = () => import('../pages/detail.vue');
const H5SharePage = () => import('../pages/share.vue');
const H5Detail = () => import('../components/detail/h5Index.vue');
const PCDetail = () => import('../components/pc-detail/index.vue');
const MessagePage = () => import('../pages/message.vue');
const PaySuccessPage = () => import('../pages/paySuccess.vue');
const SalePage = () => import('../pages/sale.vue');
const SaleSuccessPage = () => import('../pages/saleSuccess.vue');
const LearnPage = () => import('../pages/learn.vue');
const VideoPage = () => import('../pages/videoDetail.vue');
const interactPage = () => import('../pages/interact.vue');
const AchievementPage = () => import('../pages/achievement.vue');
const SettingPage = () => import('../pages/setting.vue');
const MessageListPage = () => import('../pages/messageList.vue')


let isPc = judgePC();

const routes = [
    {
        path: '/',
        name: 'CourseListContainer',
        component: CourseListContainer,
        meta: {
            title: '',
        }
    },
    {
        path: '/campList',
        name: 'CampList',
        component: CampList,
        meta: {
            title: '',
        }
    },
    {
        path: '*',
        component: CourseListContainer
    },
    //详情页默认路由
    {
        path: '*',
        redirect: window.enterNewPage ? '/sale' : '/content'
    },
    {
        path: '/content',
        name: 'courseContent',
        component: ContentPage,
        meta: {
            title: '课程目录',
        }
    },
    {
        path: '/detail',
        component: DetailPage,
        meta: {
            title: '课时',
        },
        children: [
            {
                path: 'pc',
                name: 'pcDetail',
                component: PCDetail,
            },
            {
                path: 'h5',
                name: 'H5Detail',
                component: H5Detail
            },
        ]
    },
    {
        path: '/share',
        name: 'H5SharePage',
        component: H5SharePage,
        meta: {
            title: '“分享赚”操作指引'
        }
    },
    {
        path: '/message',
        name: 'MessagePage',
        component: MessagePage,
        meta: {
            title: '填写留言'
        }
    },
    {
        path: '/payed',
        name: 'PaySuccessPage',
        component: PaySuccessPage,
        meta: {
            title: '拉勾教育'
        }
    },
    {
        path: '/sale',
        name: 'sale',
        component: SalePage,
        meta: {
            title: '售卖页'
        }
    },
    {
        path: '/saled',
        name: 'saled',
        component: SaleSuccessPage,
        meta: {
            title: '售卖成功'
        }
    },
    {
        path: '/learn',
        name: 'learn',
        component: LearnPage,
        meta: {
            title: '学习页'
        }
    },
    {
        path: '/videoDetail',
        name: 'videoDetail',
        component: VideoPage,
        meta: {
            title: '视频播放页'
        }
    },
    {
        path: '/interactive',
        name: 'interactive',
        component: interactPage,
        meta: {
            title: '互动'
        }
    },
    {
        path: '/achievement',
        name: 'achievement',
        component: AchievementPage,
        meta: {
            title: '学习成就'
        }
    },
    {
        path: '/setting',
        name: 'setting',
        component: SettingPage,
        meta: {
            title: '账号设置'
        }
    },
    {
        path: '/messageList',
        name: 'messageList',
        component: MessageListPage,
        meta: {
            title: '通知'
        }
    },
];

const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            return { x: 0, y: 0 };
        }
    }
});

router.beforeEach((to, from, next) => {
    if(to.query.rtoken){
        fetchUpdateToken({refreshtoken: to.query.rtoken}).then((res)=>{
            if(res.data.state === 1){
                const { access_token, refresh_token } = JSON.parse(res.data.content)
                window.localStorage.setItem("accessToken", access_token);
                window.localStorage.setItem("refreshToken", refresh_token);
                to.query.rtoken = '';
                next({
                    name: to.name,
                    replace: true
                });
                window.location.reload();
            }

        });
    }
    if (from.name || to.name === 'H5Detail') {
        next();
    } else {
        let query = getParam();
        if (query.router === 'DETAIL') {
            next({
                name: 'H5Detail',
                query: {
                    id: query.id
                },
                replace: true
            });
        }
        next();
    }
  });

export default router;
