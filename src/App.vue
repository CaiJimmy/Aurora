<template>
    <v-app>
        <v-progress-linear :indeterminate="true"
            v-if="$store.state.loading.length"></v-progress-linear>

        <v-toolbar app
            v-if="!$route.meta.hideNav">
            <v-toolbar-title>{{ config.siteName }}</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>

        <v-content>
            <router-view />
        </v-content>
    </v-app>
</template>

<script>
export default {
    name: "app",
    metaInfo: {
        changed (newInfo) {
            this.$root.title = newInfo.titleChunk;
        },
        titleTemplate: (titleChunk) => {
            // If undefined or blank then we don't need the hyphen
            return titleChunk ? `${titleChunk} | ${this.config.siteName}` : this.config.siteName;
        }
    },
    methods: {
        goBack () {
            this.$router.push('/')
        }
    }
};
</script>