<template>
    <section class="taxonomyList--category">
        <div v-for="category in filterTaxonomy('category', taxonomies)"
            :key="category.id">
            <template v-if="getTopicsByCategory(category.id, taxonomies).length || showEmptyCategories">

                <h3 class="taxonomyList--name font-weight-light">{{ category.name }}</h3>

                <v-layout class="taxonomyList--items"
                    row
                    wrap>

                    <slot name="emptyCategory"
                        v-if="!getTopicsByCategory(category.id, taxonomies).length"></slot>

                    <v-flex xs12
                        md4
                        v-for="topic in getTopicsByCategory(category.id, taxonomies)"
                        :key="topic.id">
                        <router-link :to="`/t/${topic.id}`"
                            class="taxonomyList--item elevation-1">
                            <div class="taxonomyList--item-background"
                                v-if="topic.config.background.url"
                                :style="{ background: `url(${topic.config.background.url})`}"></div>

                            <div class="taxonomyList--item-color"
                                v-if="topic.config.background.url"
                                :style="{ background: `linear-gradient(0deg, ${topic.config.background.color.Vibrant} 50%, ${topic.config.background.color.Muted} 100%)`}"></div>

                            <div class="taxonomyList--item-meta">
                                <h1 class="font-weight-thin">{{ topic.name }}</h1>
                            </div>
                        </router-link>
                    </v-flex>

                </v-layout>
            </template>
        </div>
    </section>
</template>

<script>
import { filterTaxonomy, getTopicsByCategory } from '@/utils/taxonomy';
export default {
    name: 'TaxonomyList',
    props: {
        showEmptyCategories: Boolean
    },
    methods: {
        filterTaxonomy,
        getTopicsByCategory
    },
    computed: {
        taxonomies () {
            return this.$store.state.taxonomy.taxonomies;
        }
    }
}
</script>
<style lang="scss" scoped>
.taxonomyList--items {
    margin: 0 -10px;
}

.taxonomyList--name {
    color: #80868b;
}
.taxonomyList--item {
    min-height: 200px;
    position: relative;
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    margin: 10px;
    flex-grow: 1;

    &:hover {
        .taxonomyList--item-color {
            opacity: 0.7;
        }
    }

    .taxonomyList--item-background,
    .taxonomyList--item-color {
        height: 100%;
        width: 100%;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
    }
    .taxonomyList--item-background {
        background-position: center center !important;
        background-size: cover !important;
        transition: all 0.5s ease;
    }

    .taxonomyList--item-color {
        opacity: 0.9;
        transition: opacity 0.5s ease;
    }

    .taxonomyList--item-meta {
        position: absolute;
        bottom: 0;
        padding: 20px;
        color: #fff;
        font-weight: lighter;
        font-size: 1.25em;
    }
}
</style>
