import Vue from 'vue'
import Vuex from 'vuex'

import moduleConfig from './modules/config';
import moduleAuth from './modules/auth';

Vue.use(Vuex);

/**
 * Load `config` variable into every component
 * Just to avoid writting `this.$store.state.config` :)
 */
Vue.mixin({
    computed: {
        config: function () {
            return this.$store.state.config;
        },
        auth: function () {
            return this.$store.state.auth;
        }
    }
});

const store = new Vuex.Store({
    state: {
        loading: []
    },
    mutations: {
        loading: (state, payload) => {
            /**
             * Example of payload:
             * {
             *      what: "UserData",
             *      loaded: true
             * }
             */
            if (!payload.loaded) {
                /**  
                 * Adding new item to loading queue
                 */

                if (!state.loading.includes(payload.what)) {
                    state.loading.push(payload.what)
                }
            } else {
                /**
                 * Remove item from the queue
                 */

                const index = state.loading.indexOf(payload.what);

                if (index > -1) {
                    state.loading.splice(index, 1);
                }
            }
        }
    },
    modules: {
        config: moduleConfig,
        auth: moduleAuth
    }
});


import {
    Auth
} from '@/firebase/auth';

import pick from '@/utils/pick';
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
});

export default store;