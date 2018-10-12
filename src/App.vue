<template>
    <v-app>
        <v-progress-linear :indeterminate="true"
            height="4"
            v-if="$store.state.queue.pending.length || !auth.firebaseReady"></v-progress-linear>

        <template v-else>
            <v-toolbar v-if="!siteTheme.toolbar.hidden"
                :flat="siteTheme.toolbar.flat"
                :color="siteTheme.toolbar.color">
                <v-toolbar-title>{{ config.siteName }}</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <transition-page>
                <router-view />
            </transition-page>
        </template>
    </v-app>
</template>

<script>
import TransitionPage from './transitions/TransitionPage.vue';

export default {
    name: "app",
    components: {
        TransitionPage
    },
    metaInfo: {
        changed (newInfo) {
            this.$root.title = newInfo.titleChunk;
        },
        titleTemplate: function (titleChunk) {
            // If undefined or blank then we don't need the hyphen
            return titleChunk ? `${titleChunk} | ${this.config.siteName}` : this.config.siteName;
        }
    },
    created () {
        this.$store.dispatch('queue/process')
    },
    watch: {
        config () {
            if(!this.config){
                return;
            }

            this.$vuetify.theme = this.config.theme;
        }
    },
    methods: {
        goBack () {
            this.$router.push('/')
        }
    }
};
</script>
<style lang="scss">
.v-progress-linear {
  margin: 0;
}
</style>
