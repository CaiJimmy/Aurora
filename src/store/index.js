import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations } from 'vuexfire'

import moduleConfig from './modules/config';
import moduleAuth from './modules/auth';
import moduleQueue from './modules/queue';
import moduleTheme from './modules/theme';
import moduleUsers from './modules/users';
import moduleTaxonomy from './modules/taxonomy';

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
        theme: moduleTheme,
        users: moduleUsers,
        taxonomy: moduleTaxonomy
    }
});

export default store;