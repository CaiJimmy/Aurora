import Vue from 'vue'
import {
    Vuetify,
    VApp,
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
    theme: store.state.config.theme,
    iconfont: 'md',
})