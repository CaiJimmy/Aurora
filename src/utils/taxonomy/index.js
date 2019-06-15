import {
    Firestore
} from '@/firebase/firestore';

const TAXONOMY_COLLECTION = Firestore.collection('taxonomy');

function filterTaxonomy (type, taxonomies) {
    return taxonomies.filter(taxonomy => taxonomy.type === type);
}

function getTopicsByCategory (parent, taxonomies) {
    return filterTaxonomy('topic', taxonomies).filter(topic => topic.parent === parent);
}

function getTopicById (topicId, taxonomies) {
    return filterTaxonomy('topic', taxonomies).filter(topic => topic.id === topicId)[0];
}

function getCategoryById (categoryId, taxonomies) {
    return filterTaxonomy('category', taxonomies).filter(category => category.id === categoryId)[0];
}

async function addTaxonomy (type, data) {
    let allowedFields = ['name', 'type', 'description']
    if (type == 'topic') {
        allowedFields.push('parent', 'config', 'counter', 'status')
    }

    let filteredData = {};

    for (const key in data) {
        let value = data[key];

        if (data.hasOwnProperty(key) && value !== null && allowedFields.includes(key)) {
            filteredData[key] = value;
        }
    }

    return TAXONOMY_COLLECTION.add(filteredData);
}
export {
    filterTaxonomy,
    getTopicsByCategory,
    addTaxonomy,
    getTopicById,
    getCategoryById,
    TAXONOMY_COLLECTION
}