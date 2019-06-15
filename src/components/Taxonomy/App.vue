<template>
    <section class="taxonomyList--category">
        <div v-for="category in filterTaxonomy('category', taxonomies)"
            :key="category.id">
            <TaxonomyCategory :category="category"
                :showEmptyCategories="showEmptyCategories"
                :taxonomies="taxonomies" />
        </div>
    </section>
</template>

<script>
import { filterTaxonomy } from '@/utils/taxonomy';
import TaxonomyCategory from './Category.vue';

export default {
    name: 'TaxonomyList',
    props: {
        showEmptyCategories: Boolean,
        topicStatus: String
    },
    components: {
        TaxonomyCategory
    },
    methods: {
        filterTaxonomy
    },
    computed: {
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