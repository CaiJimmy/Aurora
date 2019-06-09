import Vue from 'vue'
import Router from 'vue-router'
import {
    Auth
} from '@/firebase/auth'
import store from '@/store'

import Meta from 'vue-meta';

Vue.use(Router)
Vue.use(Meta);

function loadView (view) {
    return () =>
        import( /* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

var router = new Router({
    mode: 'history',
    routes: [{
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
        children: [{
            path: '',
            component: loadView('Admin/views/Home')
        },
        {
            path: 'settings',
            component: loadView('Admin/views/Settings'),

        },
        {
            path: 'taxonomy',
            component: loadView('Admin/views/Taxonomy')
        },
        {
            path: 'user',
            component: loadView('Admin/views/User'),

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
        if (to.matched.some(m => m.meta.isAdmin) && !store.getters["auth/currentUser"].isAdmin) {
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