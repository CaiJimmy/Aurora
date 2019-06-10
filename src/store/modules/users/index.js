import Vue from 'vue';
import {
    Firestore
} from '@/firebase/firestore';

const users = {
    namespaced: true,
    state: {},
    mutations: {
        addUser (state, userData) {
            /** 
             *  Example of payload:
             *  {
             *      displayName: 'JIMMY',
             *      email: 'xoxo@gmail.com'
             *  }
             */
            Vue.set(state, userData.email, userData);
        },
    },
    actions: {
        async requestUser ({ state, commit }, userEmail) {
            if (state.hasOwnProperty(userEmail)) {
                return;
            }
            
            commit('addUser', {
                email: userEmail,
                loading: true
            });

            Firestore.collection('users').doc(userEmail).get().then((doc) => {
                if (!doc.exists) {
                    return;
                }

                commit('addUser', {
                    ...doc.data(),
                    email: userEmail
                })
            })

        }
    }
};

export default users;