const getDefaultState = () => {
    return {
        flatToolbar: false,
        toolbarColor: null,
        hideNav: false
    }
}
const theme = {
    namespaced: true,
    state: getDefaultState(),
    mutations: {
        set(state, payload) {
            /*
             *   payload:
             *       {
             *           toolbarColor: '#000'
             *           hideNav: true
             *       }
             */

            for (const key in payload) {
                state[key] = payload[key];
            }
        }
    },
    actions: {
        reset({
            commit
        }) {
            commit('set', getDefaultState());
        }
    }
};

export default theme;