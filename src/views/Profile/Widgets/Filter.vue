<template>
    <v-card>
        
    </v-card>
</template>

<script>
import { getTopicById, getCategoryById } from '@/utils/taxonomy/'

export default {
    methods: {
        buildFilter () {
            return new Promise((resolve) => {
                this.questions.forEach((question) => {
                    const topicId = question.topic,   /* Topic that current question belongs to */
                        topicData = getTopicById(topicId);

                    if (!topicData) {
                        /*
                            Before loading this component, all topics data should be loaded. (Logic on Profile/App.vue)
                            So, if that topic's data can not be found, means that topic ID is not valid.
                        */
                        return;
                    }

                    const categoryId = topicData.parent;

                    let category = this.filter.options[categoryId];

                    if (!category) {
                        /* 
                            If this category has not been added yet to options, add it.
                        */
                        category = getCategoryById(categoryId);   /* Copy level data from Vuex */
                        category.topics = [];   /* Create a array of child topics */
                        category.topics.push(topicData);
                    }
                    else {
                        /* 
                            This level has already been added to options.
                        */
                        if (!category.topics.includes(topicData)) {
                            /*
                                If this topic has not been added yet to options, add it.
                            */
                            category.topics.push(topicData);
                        }
                    }
                });
                resolve();
            });
        }
    }
}
</script>

<style>
</style>
