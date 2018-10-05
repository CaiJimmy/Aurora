const authStore = {
    namespaced: true,
    state: {
        loggedIn: false,
        firebaseReady: false,
        currentUser: {},
        validUser: false
    },
    mutations: {
        authStateChange(state, payload) {
            if (!state.firebaseReady) {
                state.firebaseReady = true;
            }

            state.loggedIn = payload.loggedIn;
            state.currentUser = payload.currentUser;
        },
        userValidation(state, isUserValid) {
            /**
             *  After OAuth login, Login.vue will attempt to validate user
             */

            state.validUser = isUserValid;
        }
    }
};

export default authStore;