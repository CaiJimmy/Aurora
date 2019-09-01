<template>
    <v-container fill-height>
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
                        <span class="title font-weight-light">Error 404 / Página no encontrada</span>
                    </v-card-title>

                    <v-card-text class="headline font-weight-bold">
                        Lo sentimos, pero la página que busca no existe.
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
    name: "NotFound",
    metaInfo: {
        title: "404 Not Found"
    },
    created () {
        this.$store.commit('theme/set', {
            'toolbar': {
                'hidden': true
            }
        });
    }
};
</script>