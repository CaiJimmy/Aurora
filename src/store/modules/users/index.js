import Vue from 'vue';

const users = {
    namespaced: true,
    state: {},
    mutations: {
        addUser(state, userData) {
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
    actions: {}
};

export default users;