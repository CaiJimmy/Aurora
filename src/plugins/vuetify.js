import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import store from '../store';
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

const opts = {
    theme: store.getters['config/merged'].theme,
    icons: {
        iconfont: 'mdi'
    }
};

Vue.use(Vuetify);

export default new Vuetify(opts);