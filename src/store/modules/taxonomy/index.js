import {
    Firestore
} from '@/firebase/firestore';
import {
    firebaseAction
} from 'vuexfire';

const TAXONOMY_COLLECTION = Firestore.collection('taxonomy');

const taxonomy = {
    namespaced: true,
    state: {
        taxonomies: []
    },
    actions: {
        bindTaxonomy: firebaseAction(({
            bindFirebaseRef
        }) => {
            return bindFirebaseRef('taxonomies', TAXONOMY_COLLECTION)
        }),
        unbindTaxonomy: firebaseAction(({
            unbindFirebaseRef
        }) => {
            return unbindFirebaseRef('taxonomies', TAXONOMY_COLLECTION)
        })
    }
};

export default taxonomy;