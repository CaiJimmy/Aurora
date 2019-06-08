<template>
    <v-app>
        <v-progress-linear :indeterminate="true"
            height="4"
            v-if="$store.state.queue.pending.length || !auth.firebaseReady"></v-progress-linear>

        <template v-else>
            <AppBar v-if="!siteTheme.toolbar.hidden" />

            <transition-page>
                <router-view />
            </transition-page>
        </template>
    </v-app>
</template>

<script>
import TransitionPage from './transitions/TransitionPage.vue';
import AppBar from './components/AppBar.vue';

export default {
    name: "app",
    components: {
        TransitionPage,
        AppBar
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
            if (!this.config) {
                return;
            }

            this.$vuetify.theme = this.config.theme;
        }
    }
};
</script>
<style lang="scss">
.v-progress-linear {
    margin: 0;
}
.v-toolbar {
    z-index: 5;
}
</style>
