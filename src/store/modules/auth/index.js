import {
    Auth
} from '@/firebase/auth';
import {
    Firestore
} from '@/firebase/firestore';
import {
    firestoreAction
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
        authStateChange (state, payload) {
            if (!state.firebaseReady) {
                state.firebaseReady = true;
            }

            state.loggedIn = payload.loggedIn;
            state.firebaseCurrentUser = payload.firebaseCurrentUser;
        },
        userValidation (state, isUserValid) {
            /**
             *  After OAuth login, Login.vue will attempt to validate user
             */

            state.validUser = isUserValid;
        }
    },
    actions: {
        bindCurrentUser: firestoreAction(({
            bindFirestoreRef
        }, firebaseCurrentUser) => {
            return bindFirestoreRef('cloudCurrentUser', USER_COLLECTION.doc(firebaseCurrentUser.email), { reset: () => new Object() }).catch(() => {
                /// Catch error, in case user hasn't got a valid account, "Missing or insufficient permissions." error will pop out.
            })
        }),
        unbindCurrentUser: firestoreAction(({
            unbindFirestoreRef
        }) => {
            return unbindFirestoreRef('cloudCurrentUser')
        }),
        async suscribe ({
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
                    dispatch('bindCurrentUser', firebaseCurrentUser);

                    /// Add current user data to store.state.users
                    commit('users/addUser', firebaseCurrentUser, { root: true });
                } else {
                    commit('authStateChange', {
                        loggedIn: false,
                        firebaseCurrentUser: {}
                    });
                    dispatch('unbindCurrentUser');
                }

                Sentry.configureScope((scope) => {
                    let email = null;
                    if (user) {
                        email = user.email;
                    }

                    scope.setUser({
                        "email": email
                    });
                });
            });
            return true;
        }
    }
};

export default authStore;