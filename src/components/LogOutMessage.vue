<template>
    <v-dialog v-model="showDialog"
        persistent
        max-width="400">
        <v-card>
            <v-card-title class="headline">Has salido de la cuenta</v-card-title>
            <v-card-text>
                Se ha cerrado la sesión. Debes volver a iniciar sesión para continuar utilizando la página.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text
                    color="primary"
                    v-on:click="$router.go()">Acceder</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "LogOutMessage",
    data () {
        return {
            showDialog: false
        }
    },
    watch: {
        "auth.loggedIn" (newVal, oldVal) {
            /**
             *  If oldVal.loggedIn is true, means that user had logged in
             *  And if newVal.loggedIn is false, user has logged out. 
             *  Then display the banner, asking user to manually refresh and re-login
            */

            if (oldVal && !newVal) {
                this.showDialog = true;
            }
        }
    }
}
</script>

<style>
</style>
