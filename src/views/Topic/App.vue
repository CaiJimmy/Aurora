<template>
    <v-container>
        <TopicHeader :topic="topic" />

        <v-layout v-if="loading"
            align-content-center
            justify-center
            wrap>
            <v-flex xs4>
                <v-progress-linear indeterminate
                    rounded
                    height="6"></v-progress-linear>
            </v-flex>
        </v-layout>

        <router-view v-else
            :topic="topic"
            :topicId="topicId" />
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
    data () {
        return {
            loading: true
        }
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
            this.$store.dispatch(`topic-${this.topicId}/init`).then(() => {
                this.loading = false;
            })
        }
        else {
            this.loading = false;
        }
    },
    computed: {
        topic () {
            return getTopicById(this.topicId, this.$store.state.taxonomy.taxonomies)
        }
    }
}
</script>