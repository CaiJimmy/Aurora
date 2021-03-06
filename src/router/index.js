import Vue from 'vue'
import Router from 'vue-router'
import {
    Auth
} from '@/firebase/auth'
import store from '@/store'

import Meta from 'vue-meta';

Vue.use(Router)
Vue.use(Meta);

import userUtil from '@/utils/user';

function loadView (view) {
    return () =>
        import( /* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

var router = new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            component: loadView('NotFound')
        },
        {
            path: '/restricted',
            component: loadView('Restricted')
        },
        {
            path: '/',
            component: loadView('Home/App'),
            auth: true
        },
        {
            path: '/archived',
            component: loadView('Archived/App'),
            auth: true
        },
        {
            path: '/login',
            component: loadView('Login/App'),
        },
        {
            path: '/user/:userEmail',
            component: loadView('Profile/App'),
            props: true
        },
        {
            path: '/a/',
            component: loadView('Admin/App'),
            meta: {
                isAdmin: true
            },
            children: [
                {
                    path: '',
                    component: loadView('Admin/Home/App')
                },
                {
                    path: 'settings',
                    component: loadView('Admin/Settings/App'),

                },
                {
                    path: 'taxonomy',
                    component: loadView('Admin/Taxonomy/App')
                },
                {
                    path: 'user',
                    component: loadView('Admin/User/App'),

                },
                {
                    path: 'export',
                    component: loadView('Admin/Export/App'),

                }
            ]
        },
        {
            path: '/t/:topicId',
            component: loadView('Topic/App'),
            props: true,
            children: [
                {
                    path: '',
                    component: loadView('Topic/Home/App')
                },
                {
                    path: 'settings',
                    component: loadView('Topic/Settings/App')
                },
                {
                    path: 'delete',
                    component: loadView('Topic/Delete/App')
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.path !== from.path) {
        store.dispatch('theme/reset');
    }

    if (to.path !== '/login' && !Auth.currentUser) {
        next({
            path: '/login',
            query: {
                go: to.fullPath,
            },
            replace: true
        })
    } else {
        if (to.matched.some(m => m.meta.isAdmin) && !userUtil(store.getters["auth/currentUser"]).isAdmin()) {
            next({
                path: '/restricted',
                query: {
                    go: to.fullPath,
                }
            })
        } else {
            next();
        }
    }
});

export default router