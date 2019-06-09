<template>
    <v-container>
        <TopicHeader :topic="topic" />
        <router-view :topic="topic" />
    </v-container>
</template>
<script>
import { getTopicById } from '@/utils/taxonomy/';
import TopicHeader from './Header.vue';
import topicPageModule from './store';

export default {
    name: 'TopicPage',
    props: {
        topicId: String
    },
    components: {
        TopicHeader
    },
    mounted () {
        if (!this.topic) {
            /// Topic does not exist
            this.$router.replace('/404')
        }

        if (!this.$store._modules.root._children[`topic-${this.topicId}`]) {
            this.$store.registerModule(`topic-${this.topicId}`, {
                ...topicPageModule(this.topicId, this.topic)
            });
            this.$store.dispatch(`topic-${this.topicId}/init`);
        }
    },
    computed: {
        topic () {
            return getTopicById(this.topicId, this.$store.state.taxonomy.taxonomies)
        }
    }
}
</script>