import defaultConfig from './default';
import {
    Firestore
} from '@/firebase/firestore';
import {
    firebaseAction
} from 'vuexfire'

const CONFIG_DOC = Firestore.collection('config').doc('default');

let config = {
    namespaced: true,
    state: {
        defaultConfig: defaultConfig,
        cloudConfig: {}
    },
    getters: {
        merged: state => {
            return {
                ...state.defaultConfig,
                ...state.cloudConfig
            }
        }
    },
    mutations: {},
    actions: {
        bindCloudConfig: firebaseAction(({
            bindFirebaseRef
        }) => {
            return bindFirebaseRef('cloudConfig', CONFIG_DOC)
        }),
        unbindCloudConfig: firebaseAction(({
            unbindFirebaseRef
        }) => {
            return unbindFirebaseRef('cloudConfig', CONFIG_DOC)
        })
    }
};

export default config;