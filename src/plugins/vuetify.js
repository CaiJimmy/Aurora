import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import store from '../store';

const opts = {
    theme: store.getters['config/merged'].theme
};

Vue.use(Vuetify);

export default new Vuetify(opts);