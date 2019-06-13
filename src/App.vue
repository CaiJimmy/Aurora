<template>
    <v-app>
        <LogOutMessage />
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
import LogOutMessage from './components/LogOutMessage.vue';

export default {
    name: "app",
    components: {
        TransitionPage,
        AppBar,
        LogOutMessage
    },
    metaInfo: {
        titleTemplate (titleChunk) {
            // If undefined or blank then we don't need the hyphen
            return titleChunk ? `${titleChunk} | ${this.config.siteName}` : this.config.siteName;
        }
    },
    beforeCreate () {
        this.$store.dispatch('queue/process')
    },
    watch: {
        config () {
            if (!this.config) {
                return;
            }
        },
        "config.theme" () {
            this.$vuetify.theme.setTheme('light', this.config.theme)
        }
    }
};
</script>