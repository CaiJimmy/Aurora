import Vue from 'vue'
import {
    Vuetify,
    VApp,
    VCard,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VSnackbar,
    transitions
} from 'vuetify'
import 'vuetify/src/stylus/app.styl';

import store from '../store';

Vue.use(Vuetify, {
    components: {
        VApp,
        VCard,
        VNavigationDrawer,
        VFooter,
        VList,
        VBtn,
        VIcon,
        VGrid,
        VToolbar,
        VSnackbar,
        transitions
    },
    theme: store.state.config.theme,
    iconfont: 'md',
})