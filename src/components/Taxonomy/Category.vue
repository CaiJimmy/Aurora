<template >
    <div v-if="getTopicsByCategory(category.id, taxonomies).length || showEmptyCategories">
        <h3 class="taxonomyList--name font-weight-light">
            {{ category.name }}

            <v-btn flat
                fab>
                <v-icon>edit</v-icon>
            </v-btn>
        </h3>

        <v-layout class="taxonomyList--items"
            row
            wrap>

            <slot name="emptyCategory"
                v-if="!getTopicsByCategory(category.id, taxonomies).length"></slot>

            <v-flex xs6
                md4
                lg3
                xl2
                v-for="topic in getTopicsByCategory(category.id, taxonomies)"
                :key="topic.id">
                <TaxonomyTopic :topic="topic" />
            </v-flex>

        </v-layout>
    </div>
</template>

<script>
import TaxonomyTopic from './Topic.vue';
import { getTopicsByCategory } from '@/utils/taxonomy';

export default {
    name: "TaxonomyCategory",
    props: {
        showEmptyCategories: Boolean,
        category: {
            type: Object,
            required: true
        },
        taxonomies: {
            type: Array,
            required: true
        }
    },
    components: {
        TaxonomyTopic
    },
    methods: {
        getTopicsByCategory
    }
}
</script>

<style lang="scss" scoped>
.taxonomyList--items {
    margin: 0 -10px;
    margin-bottom: 30px;
}

.taxonomyList--name {
    color: #80868b;
}
</style>
