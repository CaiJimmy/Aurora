import {
    Auth
} from '@/firebase/auth';
import {
    Firestore
} from '@/firebase/firestore';
import {
    firebaseAction
} from 'vuexfire';

import pick from '@/utils/pick';
import Sentry from '@/plugins/sentry';

const USER_COLLECTION = Firestore.collection('users');

const authStore = {
    namespaced: true,
    state: {
        loggedIn: false,
        firebaseReady: false,
        validUser: false,

        firebaseCurrentUser: {},
        cloudCurrentUser: {},
    },
    getters: {
        currentUser: state => {
            return Object.assign(state.cloudCurrentUser, state.firebaseCurrentUser);
        }
    },
    mutations: {
        authStateChange(state, payload) {
            if (!state.firebaseReady) {
                state.firebaseReady = true;
            }

            state.loggedIn = payload.loggedIn;
            state.firebaseCurrentUser = payload.firebaseCurrentUser;
        },
        userValidation(state, isUserValid) {
            /**
             *  After OAuth login, Login.vue will attempt to validate user
             */

            state.validUser = isUserValid;
        }
    },
    actions: {
        bindCurrentUser: firebaseAction(({
            bindFirebaseRef
        }, firebaseCurrentUser) => {
            return bindFirebaseRef('cloudCurrentUser', USER_COLLECTION.doc(firebaseCurrentUser.email))
        }),
        unbindCurrentUser: firebaseAction(({
            unbindFirebaseRef
        }) => {
            unbindFirebaseRef('cloudCurrentUser')
        }),
        async suscribe({
            commit,
            dispatch
        }) {
            Auth.onAuthStateChanged((user) => {
                const allowedProps = ['displayName', 'email', 'photoURL', 'uid']
                if (user) {
                    const firebaseCurrentUser = pick(user, allowedProps);

                    commit('authStateChange', {
                        loggedIn: true,
                        firebaseCurrentUser: firebaseCurrentUser
                    });
                    dispatch('bindCurrentUser', firebaseCurrentUser)
                } else {
                    commit('authStateChange', {
                        loggedIn: false,
                        currentUser: {}
                    });
                    dispatch('unbindCurrentUser');
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