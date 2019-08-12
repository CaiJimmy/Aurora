<template>
    <section class="taxonomyList--category">
        <div v-for="category in filterTaxonomy('category', taxonomies)"
            :key="category.id">
            <TaxonomyCategory :category="category"
                :showEmptyCategories="showEmptyCategories"
                :taxonomies="taxonomies"
                :canEditCategoryName="canEditCategoryName" />
        </div>

        <slot name="emptyTaxonomy"
            v-if="isEmpty"></slot>
    </section>
</template>

<script>
import { filterTaxonomy, getTopicsByCategory } from '@/utils/taxonomy';
import TaxonomyCategory from './Category.vue';

export default {
    name: 'TaxonomyList',
    props: {
        showEmptyCategories: Boolean,
        topicStatus: String,
        canEditCategoryName: {
            type: Boolean,
            default: false
        }
    },
    components: {
        TaxonomyCategory
    },
    methods: {
        filterTaxonomy
    },
    computed: {
        isEmpty () {
            const categories = filterTaxonomy('category', this.taxonomies);
            let isEmpty = true;

            for (let category of categories) {
                if(getTopicsByCategory(category.id, this.taxonomies).length !== 0){
                    isEmpty = false;
                    break;
                }
            }

            return isEmpty;
        },
        taxonomies () {
            const taxonomies = this.$store.state.taxonomy.taxonomies;

            if (!this.topicStatus) {
                return taxonomies;
            }

            return taxonomies.filter((item) => {
                return (item.status === this.topicStatus) || item.type === 'category';
            });
        }
    }
}
</script>