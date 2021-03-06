import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire';

import { moduleConfig } from './modules/config';
import moduleAuth from './modules/auth';
import moduleQueue from './modules/queue';
import moduleTheme from './modules/theme';
import moduleUsers from './modules/users';
import { moduleTaxonomy } from './modules/taxonomy';
import moduleMessage from './modules/message';

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
        currentUser: function () {
            return this.$store.getters['auth/currentUser'];
        },
        siteTheme: function () {
            return this.$store.state.theme;
        }
    }
});

const store = new Vuex.Store({
    state: {},
    mutations: {
        ...vuexfireMutations
    },
    actions: {},
    modules: {
        config: moduleConfig,
        auth: moduleAuth,
        queue: moduleQueue,
        theme: moduleTheme,
        users: moduleUsers,
        taxonomy: moduleTaxonomy,
        message: moduleMessage
    }
});

export default store;