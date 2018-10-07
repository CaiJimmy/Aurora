import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations } from 'vuexfire'

import moduleConfig from './modules/config';
import moduleAuth from './modules/auth';
import moduleQueue from './modules/queue';
import moduleTheme from './modules/theme';

Vue.use(Vuex);

/**
 * Load `config` variable into every component
 * Just to avoid writting `this.$store.state.config` :)
 */
Vue.mixin({
    computed: {
        config: function () {
            return this.$store.getters['config/merged'];
        },
        auth: function () {
            return this.$store.state.auth;
        },
        siteTheme: function(){
            return this.$store.state.theme;
        }
    }
});

const store = new Vuex.Store({
    state: {},
    mutations: {
        ...firebaseMutations
    },
    actions: {},
    modules: {
        config: moduleConfig,
        auth: moduleAuth,
        queue: moduleQueue,
        theme: moduleTheme
    }
});

import {
    Auth
} from '@/firebase/auth';

import pick from '@/utils/pick';
import Sentry from '@/plugins/sentry';

Auth.onAuthStateChanged((user) => {
    const allowedProps = ['displayName', 'email', 'photoURL', 'uid']
    if (user) {
        store.commit('auth/authStateChange', {
            loggedIn: true,
            currentUser: pick(user, allowedProps)
        })
    } else {
        store.commit('auth/authStateChange', {
            loggedIn: false,
            currentUser: {}
        })
    }

    Sentry.configureScope((scope) => {
        scope.setUser({
            "email": user.email
        });
    });
});

export default store;