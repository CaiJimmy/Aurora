import defaultConfig from './default';
import {
    Firestore
} from '@/firebase/firestore';
import {
    firestoreAction 
} from 'vuexfire'
import merge from 'deepmerge'

const CONFIG_DOC = Firestore.collection('config').doc('default');

let config = {
    namespaced: true,
    state: {
        defaultConfig: defaultConfig,
        cloudConfig: {}
    },
    getters: {
        merged: state => {
            return merge(
                state.defaultConfig,
                state.cloudConfig
            )
        }
    },
    mutations: {},
    actions: {
        bindCloudConfig: firestoreAction(({
            bindFirestoreRef
        }) => {
            return bindFirestoreRef('cloudConfig', CONFIG_DOC)
        }),
        unbindCloudConfig: firestoreAction(({
            unbindFirestoreRef
        }) => {
            return unbindFirestoreRef('cloudConfig')
        })
    }
};

export default config;