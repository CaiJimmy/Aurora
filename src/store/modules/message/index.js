import merge from 'deepmerge';
import Vue from 'vue';

const getDefaultState = () => {
    return {
        content: null,
        timeout: 1000,
        action: null
    }
}

const message = {
    namespaced: true,
    state: getDefaultState(),
    mutations: {
        display (state, payload) {
            Object.assign(state, merge(state, payload));
        },
        reset (state) {
            Vue.set(state, getDefaultState());
        }
    }
};

export default message;