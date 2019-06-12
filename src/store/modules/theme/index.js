import merge from 'deepmerge';

const getDefaultState = () => {
    return {
        toolbar: {
            hidden: false
        }
    }
}
const theme = {
    namespaced: true,
    state: getDefaultState(),
    mutations: {
        set (state, payload) {
            /*
             *   payload:
             *       {
             *           toolbar: {
             *              flat: true  
             *           }
             *       }
             */

            Object.assign(state, merge(state, payload))
        }
    },
    actions: {
        reset ({
            commit
        }) {
            commit('set', getDefaultState());
        }
    }
};

export default theme;