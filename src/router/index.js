import Vue from 'vue'
import Router from 'vue-router'
import {
    Auth
} from '@/firebase/auth'
import store from '@/store'

import Meta from 'vue-meta';

Vue.use(Router)
Vue.use(Meta);

function loadView(view) {
    return () =>
        import( /* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

var router = new Router({
    mode: 'history',
    routes: [{
        path: '*',
        component: loadView('NotFound')
    }, {
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
        children: [{
            path: '',
            component: loadView('Admin/views/Home')
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
    if (to.auth && !Auth.currentUser) {
        next({
            path: '/login',
            query: {
                go: to.path,
            }
        })
    } else {
        if (to.matched.some(m => m.meta.isAdmin) && !store.state.user.isAdmin && !store.state.loading.user) {
            next({
                path: '/403'
            })
        } else {
            next();
        }
    }
});

router.afterEach((to) => {
    if (to.path !== '/login' && !Auth.currentUser) {
        router.replace({
            path: '/login',
            query: {
                go: to.fullPath,
            },
        });
    }

    store.dispatch('theme/reset');
})

export default router