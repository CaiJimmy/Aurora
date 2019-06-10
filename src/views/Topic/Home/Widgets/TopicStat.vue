<template>
    <v-card flat
        outlined>
        <v-card-text>
            <div>Estadística</div>

            <v-list disabled>
                <v-list-item-group>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>visibility</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Visible: {{ totalCount - hiddenCount }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>visibility_off</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Oculto: {{ hiddenCount }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text
                :loading="reCounting"
                v-on:click="reCount()">Refrescar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: "TopicStat",
    props: {
        topic: Object
    },
    data () {
        return {
            reCounting: false
        }
    },
    computed: {
        totalCount () {
            if (this.topic.hasOwnProperty('counter')) {
                return this.topic.counter.total || 0;
            }
            else {
                return 0;
            }
        },
        hiddenCount () {
            if (this.topic.hasOwnProperty('counter')) {
                return this.topic.counter.hidden || 0;
            }
            else {
                return 0;
            }
        }
    },
    methods: {
        reCount () {
            /// TODO: Move to config
            const VUE_APP_FIREBASE_FUNCTION_DOMAIN = process.env.VUE_APP_FIREBASE_FUNCTION_DOMAIN;

            this.reCounting = true;

            fetch(`${VUE_APP_FIREBASE_FUNCTION_DOMAIN}/reCount/?topic=${this.topic.id}`).then(() => {
                this.reCounting = false;
            })
        }
    }
}
</script>
