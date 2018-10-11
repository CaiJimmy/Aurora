import {
    Firestore
} from '@/firebase/firestore';
import {
    firebaseAction
} from 'vuexfire'

const TAXONOMY_COLLECTION = Firestore.collection('taxonomy');

function filterTaxonomy(taxonomies, type) {
    return taxonomies.filter(taxonomy => taxonomy.type === type);
}

const taxonomy = {
    namespaced: true,
    state: {
        taxonomies: []
    },
    getters: {
        category: state => {
            return filterTaxonomy(state.taxonomies, 'category')
        },
        topic: state => {
            return filterTaxonomy(state.taxonomies, 'topic')
        },
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