import {
    Auth
} from '@/firebase/auth';

import pick from '@/utils/pick';
import Sentry from '@/plugins/sentry';

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
    },
    actions: {
        async suscribe({
            commit
        }) {
            Auth.onAuthStateChanged((user) => {
                const allowedProps = ['displayName', 'email', 'photoURL', 'uid']
                if (user) {
                    commit('authStateChange', {
                        loggedIn: true,
                        currentUser: pick(user, allowedProps)
                    })
                } else {
                    commit('authStateChange', {
                        loggedIn: false,
                        currentUser: {}
                    })
                }

                Sentry.configureScope((scope) => {
                    scope.setUser({
                        "email": user.email || null
                    });
                });
            });
            return true;
        }
    }
};

export default authStore;