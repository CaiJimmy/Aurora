<template>
    <v-snackbar v-model="snackbar"
        :timeout="timeout">
        <span v-html="content"></span>
        <v-btn color="primary"
            text
            @click="close()">
            {{ buttonText }}
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
    computed: {
        ...mapState('message', ['content', 'timeout', 'action', 'actionText']),
        buttonText () {
            return this.actionText || 'Cerrar';
        }
    },
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