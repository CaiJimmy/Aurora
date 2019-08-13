import merge from 'deepmerge';

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
            Object.assign(state, merge(getDefaultState(), payload));
        }
    }
};

export default message;