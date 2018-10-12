<template>
    <section class="taxonomyList">
        <div v-for="category in filterTaxonomy('category')"
            :key="category.id">

            <v-layout row
                wrap
                justify-space-between
                v-if="getTopicsByCategory(category.id).length">

                <!-- Hide empty categories -->
                <v-flex xs12 md2>
                    <h3 class="levelName">{{ category.name }}</h3>
                </v-flex>
                <v-flex xs12 md9>
                    <v-card v-for="topic in getTopicsByCategory(category.id)"
                        :key="topic.id"
                        color="blue-grey darken-2"
                        class="white--text">
                        <v-card-title primary-title>
                            <router-link :to="`/t/${topic.id}`"
                                class="headline">{{ topic.name }}</router-link>
                        </v-card-title>
                    </v-card>
                </v-flex>
            </v-layout>
        </div>
    </section>
</template>

<script>
import { filterTaxonomy, getTopicsByCategory } from '@/utils/taxonomy';
export default {
    name: 'TaxonomyList',
    methods: {
        filterTaxonomy,
        getTopicsByCategory
    }
}
</script>
