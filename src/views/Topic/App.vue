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

        <tempalte v-else>
            <v-banner v-if="isTopicArchived"
                two-line
                :elevation="1"
                sticky
                class="archivedBanner">
                <v-avatar slot="icon"
                    color="primary"
                    size="40">
                    <v-icon icon="mdi-lock"
                        color="white">
                        mdi-lock
                    </v-icon>
                </v-avatar>

                El tema está archivado. No se puede añadir ni editar preguntas.
            </v-banner>

            <transition-page>
                <router-view :topic="topic"
                    :topicId="topicId" />
            </transition-page>
        </tempalte>
    </v-container>
</template>
<script>
import { getTopicById } from '@/utils/taxonomy/';
import TopicHeader from './Header.vue';
import topicPageModule from './store';

import TransitionPage from '@/transitions/TransitionPage.vue';

export default {
    name: 'TopicPage',
    props: {
        topicId: String
    },
    metaInfo () {
        return {
            title: this.topic.name || 'Tema'
        }
    },
    components: {
        TopicHeader,
        TransitionPage
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
        isTopicArchived () {
            return this.topic.status == 'archived';
        },
        topic () {
            return getTopicById(this.topicId, this.$store.state.taxonomy.taxonomies)
        }
    },
    watch: {
        "topic.config" () {
            /*
                Add current topic config to Vuex config store
            */
            let topicConfig = {
                theme: {
                    primary: this.topic.config.background.color.Vibrant
                },
                topic: this.topic.config
            };

            this.$store.commit('config/addTopicConfig', topicConfig);
        }
    },
    beforeRouteLeave (to, from, next) {
        /*
            Remove current topic config before leaving topic page
        */
        this.$store.commit('config/removeTopicConfig');
        next();
    }
}
</script>
<style lang="scss" scoped>
.archivedBanner {
    margin-bottom: 20px;
    border-radius: 5px;
}
</style>
