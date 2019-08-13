import merge from 'deepmerge';
import Vue from 'vue';

const getDefaultState = () => {
    return {
        content: null,
        timeout: 5000,
        action: null,
        actionText: null
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