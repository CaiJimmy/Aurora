import store from '@/store';
const taxonomies = store.state.taxonomy.taxonomies;

function filterTaxonomy(type) {
    return taxonomies.filter(taxonomy => taxonomy.type === type);
}

function getTopicsByCategory(parent){
    return filterTaxonomy('topic').filter(topic => topic.parent === parent);
}

export {
    filterTaxonomy,
    getTopicsByCategory
}