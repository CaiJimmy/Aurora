import {
    Firestore
} from '@/firebase/firestore';
import {
    firestoreAction 
} from 'vuexfire';

const TAXONOMY_COLLECTION = Firestore.collection('taxonomy');

const taxonomy = {
    namespaced: true,
    state: {
        taxonomies: []
    },
    actions: {
        bindTaxonomy: firestoreAction(({
            bindFirestoreRef
        }) => {
            return bindFirestoreRef('taxonomies', TAXONOMY_COLLECTION)
        }),
        unbindTaxonomy: firestoreAction(({
            unbindFirestoreRef
        }) => {
            return unbindFirestoreRef('taxonomies')
        })
    }
};

export default taxonomy;