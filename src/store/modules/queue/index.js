const queue = {
    namespaced: true,
    state: {
        pending: ['config/bindCloudConfig']
    },
    mutations: {
        add(state, payload) {
            /**
             * payload: {String} /// Vuex action name
             */
            if (!state.pending.includes(payload)) {
                state.pending.push(payload)
            }
        },
        remove(state, payload) {
            const index = state.pending.indexOf(payload);
            if (index > -1) {
                state.pending.splice(index, 1);
            }
        }
    },
    actions: {
        async process({
            state,
            dispatch,
            commit
        }) {
            if (state.pending.length) {
                for (const task of state.pending) {

                    await dispatch(task, null, {
                        root: true
                    }).then(() => {
                        /**
                         * Remove item from the queue
                         */

                        commit('remove', task)
                    })

                }
            }
        }
    }
};

export default queue;