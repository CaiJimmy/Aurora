<template>
    <v-snackbar v-model="snackbar"
        :timeout="timeout">
        {{ content }}
        <v-btn color="pink"
            text
            @click="close()">
            Cerrar
        </v-btn>
    </v-snackbar>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'MessageBar',
    data () {
        return {
            snackbar: false
        }
    },
    computed: mapState('message', ['content', 'timeout', 'action']),
    created () {
        this.$store.subscribe(mutation => {
            if (mutation.type !== 'message/display') return;

            this.snackbar = true;
        })
    },
    methods: {
        close () {
            this.snackbar = false;
            if (typeof this.action == 'function') {
                this.action();
            }

            this.$store.commit('message/reset');
        }
    }
}
</script>