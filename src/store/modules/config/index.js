import defaultConfig from './default';
import {
    Firestore
} from '@/firebase/firestore';
import {
    firestoreAction
} from 'vuexfire'
import merge from 'deepmerge'

import Vue from 'vue';

const CONFIG_DOC = Firestore.collection('config').doc('default');

let moduleConfig = {
    namespaced: true,
    state: {
        defaultConfig: defaultConfig,
        cloudConfig: {},
        topicConfig: {}
    },
    getters: {
        merged: state => {
            return merge.all(
                [state.defaultConfig,
                state.cloudConfig,
                state.topicConfig]
            )
        }
    },
    mutations: {
        addTopicConfig (state, payload) {
            Vue.set(state, 'topicConfig', payload)
        },
        removeTopicConfig (state) {
            Vue.set(state, 'topicConfig', {})
        }
    },
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

export {
    moduleConfig,
    CONFIG_DOC
};