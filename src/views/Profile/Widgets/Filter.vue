<template>
    <v-card v-if="questions.length">
        <v-list v-for="category in filter.options"
            :key="category.id">
            <v-subheader>{{ category.name }}</v-subheader>
            <v-list-item v-for="(topic, id) in category.topics"
                :key="topic.id">
                <v-list-item-action>
                    <v-radio-group v-model="filter.selected">
                        <v-radio :value="id"
                            color="primary"></v-radio>
                    </v-radio-group>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title>{{ topic.name }} ({{ topic.count}})</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-card-actions v-if="filter.selected">
            <v-spacer></v-spacer>
            <v-btn text
                v-on:click="filter.selected = null">Mostrar todo</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { getTopicById, getCategoryById } from '@/utils/taxonomy/'

export default {
    name: "QuestionFilter",
    props: {
        questions: Array
    },
    data () {
        return {
            filter: {
                options: {},
                selected: null
            }
        }
    },
    created () {
        this.buildFilter();
        if (this.$route.query.topic) {
            this.filter.selected = this.$route.query.topic;
        }
    },
    watch: {
        questions () {
            this.buildFilter();
        },
        "filter.selected" (selectedTopicId) {
            if (selectedTopicId) {
                /*
                    Add query string if a topic is selected
                */
                this.$router.replace({
                    query: {
                        topic: selectedTopicId
                    }
                })
            }
            else {
                /* 
                    Remove query string if there's no selected topic
                */
                this.$router.replace({
                    query: {}
                })
            }
        }
    },
    methods: {
        buildFilter () {
            /// Reset options before start building
            this.filter.options = {};
            this.questions.forEach((question) => {
                const taxonomies = this.$store.state.taxonomy.taxonomies,
                    topicId = question.topic,   /* Topic that current question belongs to */
                    topicData = getTopicById(topicId, taxonomies);

                if (!topicData) {
                    /*
                        Before loading this component, all topics data should be loaded. (Logic on Profile/App.vue)
                        So, if that topic's data can not be found, means that topic ID is not valid.
                    */
                    return;
                }

                const categoryId = topicData.parent;

                let category = this.filter.options[categoryId];

                if (!this.filter.options.hasOwnProperty(categoryId)) {
                    /* 
                        If this category has not been added yet to options, add it.
                    */
                    category = {
                        ...getCategoryById(categoryId, taxonomies), /* Copy level data from Vuex */
                        topics: {} /* Create a object for child topics */
                    };

                    category.topics[topicId] = {
                        ...topicData,
                        count: 1
                    };
                }
                else {
                    /* 
                        This level has already been added to options.
                    */
                    if (!category.topics.hasOwnProperty(topicId)) {
                        /*
                            If this topic has not been added yet to options, add it.
                        */
                        category.topics[topicId] = {
                            ...topicData,
                            count: 1
                        };
                    }
                    else {
                        category.topics[topicId].count += 1;
                    }
                }

                this.filter.options[categoryId] = category;
            });
        }
    }
}
</script>

<style>
</style>
