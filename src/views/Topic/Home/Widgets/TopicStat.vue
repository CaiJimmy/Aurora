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
import { Functions } from '@/firebase/functions';
import Console from '@/utils/Console';

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
            const recountFn = Functions.httpsCallable('reCount')

            this.reCounting = true;
            recountFn({ topic: this.topic.id }).then(() => {
                this.reCounting = false;
            }).catch((e) => {
                Console.error(e);
                this.reCounting = false;
            })
        }
    }
}
</script>
