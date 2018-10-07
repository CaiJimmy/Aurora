import Vue from 'vue'
import {
    Vuetify,
    VApp,
    VAvatar,
    VAlert,
    VCard,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VSnackbar,
    VProgressLinear,
    transitions
} from 'vuetify'
import 'vuetify/src/stylus/app.styl';

import store from '../store';

Vue.use(Vuetify, {
    components: {
        VApp,
        VAvatar,
        VAlert,
        VCard,
        VNavigationDrawer,
        VFooter,
        VList,
        VBtn,
        VIcon,
        VGrid,
        VToolbar,
        VSnackbar,
        VProgressLinear,
        transitions
    },
    theme: store.getters['config/merged'].theme,
    iconfont: 'md',
})