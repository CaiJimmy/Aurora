<template>
    <v-container fill-height
        v-if="auth.firebaseReady && !currentUser.isAdmin">
        <v-layout row
            wrap
            align-center
            justify-center>
            <v-flex sm6>
                <v-card class="mx-auto"
                    color="error"
                    dark
                    max-width="400">
                    <v-card-title>
                        <span class="title font-weight-light">Error 403 / Página restringida</span>
                    </v-card-title>

                    <v-card-text class="headline font-weight-bold">
                        Lo sentimos, pero no tienes permiso para acceder a esta página
                    </v-card-text>

                    <v-card-actions>
                        <v-btn text
                            to="/"
                            :replace="true">Volver al inicio</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
    name: "Restricted",
    metaInfo: {
        title: "Restringido"
    },
    created () {
        this.$store.commit('theme/set', {
            'toolbar': {
                'hidden': true
            }
        });
        this.redirect();
    },
    watch: {
        "currentUser.isAdmin" () {
            this.redirect()
        }
    },
    methods: {
        redirect () {
            if (this.currentUser.isAdmin) {
                /*
                    User is an admin, redirected to this page due because Firebase's data was not loaded yet.
                */
                this.$router.replace({
                    path: this.$route.query.go || '/'
                });
            }
        }
    }
};
</script>