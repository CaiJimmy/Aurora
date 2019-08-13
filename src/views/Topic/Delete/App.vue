<template>
    <v-stepper v-model="stepper">
        <v-stepper-header>
            <v-stepper-step :complete="stepper > 1"
                step="1">Confirmación</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="stepper > 2"
                step="2">Eliminación</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content step="1">
                <p>
                    Vas a eliminar el tema <strong>{{ topic.name }}</strong> de la categoria <strong>{{ categoryName }}</strong>.
                </p>

                <p>
                    Este tema cuenta con {{ topic.counter.total }} preguntas en total, {{ topic.counter.hidden }} ocultas.
                </p>

                <p>
                    Cuando se elimina un tema, las preguntas publicadas bajo dicho tema será eliminadas al mismo tiempo.
                </p>

                <v-checkbox v-model="deleteConfirm"
                    color="primary"
                    :label="`Estoy seguro de que quiero eliminar el tema ${ topic.name }`"></v-checkbox>

                <v-btn color="warning"
                    @click="confirmDelete()"
                    :disabled="!deleteConfirm">
                    Continuar
                </v-btn>

                <v-btn text
                    @click="cancelDelete()">Cancelar</v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
                <transition name="fade">
                    <v-alert v-if="deleteCountdown.current !== 0"
                        prominent
                        type="warning">
                        <v-layout align-center
                            wrap>
                            El proceso se iniciará en {{ deleteCountdown.current }} segundos.
                            <v-spacer></v-spacer>
                            <v-btn @click="cancelDelete()">Cancelar</v-btn>
                        </v-layout>
                    </v-alert>

                    <v-alert type="info"
                        v-else
                        prominent>
                        {{ progressMessage }}
                    </v-alert>
                </transition>
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<script>
import { getCategoryById, TAXONOMY_COLLECTION } from '@/utils/taxonomy';
import asyncForEach from '@/utils/asyncForEach';
import { Storage } from '@/firebase/storage';
import { Firestore } from '@/firebase/firestore';
import Console from '@/utils/Console';
import { setTimeout } from 'timers';
import { Promise } from 'q';

export default {
    name: "DeleteTaxonomy",
    props: {
        topic: {
            type: Object,
            required: true
        },
        topicId: String
    },
    data () {
        return {
            stepper: 1,
            deleteCountdown: {
                total: 10,
                current: 10,
                function: null
            },
            deleteConfirm: false,
            progressMessage: `Se está iniciando el proceso...`,
            deleteCompleted: false
        }
    },
    beforeRouteLeave (to, from, next) {
        if (this.deleteCompleted) {
            /// Delete topic ref
            const topicRef = TAXONOMY_COLLECTION.doc(this.topicId);
            topicRef.delete();
        }
        next()
    },
    computed: {
        categoryName () {
            return getCategoryById(this.topic.parent, this.$store.state.taxonomy.taxonomies).name;
        }
    },
    methods: {
        cancelDelete () {
            /// Clear delete countdown, and go back to previous page (should be topic's settings)
            clearInterval(this.deleteCountdown.function);
            this.$router.go(-1);
        },
        confirmDelete () {
            this.stepper = 2;
            this.deleteCountdown.function = setInterval(() => {
                this.deleteCountdown.current--;
                if (this.deleteCountdown.current == 0) {
                    clearInterval(this.deleteCountdown.function);
                    this.deleteTopic();
                }
            }, 1000);
        },
        async deleteTopic () {
            /// Save topic's name before being deleted
            const topicName = String(this.topic.name);

            /// Change topic status to `deleted` in order to avoid Cloud Functions trying to update `counter`, which is unnecessary
            /// Still, Cloud Functions will be triggered, which will lead to a over-quota error. 
            /// The best practice would be to pause/stop the `counter` function while deleting a topic, but this is not yet possible due to Google Firebase's limitations.

            const topicRef = TAXONOMY_COLLECTION.doc(this.topicId);
            await topicRef.update({
                status: 'deleted'
            });

            /// Delete topic image
            const imageRef = Storage.refFromURL(this.topic.config.background.url);
            try {
                await imageRef.delete();
                // eslint-disable-next-line
            } catch (error) {
                /// It's possible that imageRef is not deleted due to different reasons
                /// Such as it's already deleted. It's not a important error to handle.
            }

            this.progressMessage = `Ha sido eliminado la imagen del tema.`;

            /// Delete questions
            const questionsRef = Firestore.collection('questions').where('topic', '==', this.topicId);
            const waitFor = (ms) => new Promise(r => setTimeout(r, ms))

            await new Promise(async resolve => {
                questionsRef.get().then(questions => {
                    Console.log(questions);

                    if (questions.empty) {
                        this.progressMessage = `No hay ninguna pregunta en este tema, saltando al paso siguiente.`;
                        resolve();
                        return;
                    }

                    /// Because Firestore's `forEach` does not support async, we need to create a temporary array
                    let questionsList = [];
                    questions.forEach(item => {
                        questionsList.push(item);
                    });

                    asyncForEach(questionsList, async (item, index) => {
                        Console.log(item);
                        await item.ref.delete();
                        this.progressMessage = `Ha sido eliminado la pregunta #${index + 1} del ${questions.size}`;

                        /// Wait 100ms before continue, to avoid hitting Firestore's rate 
                        await waitFor(100);

                        if (index == (questions.size - 1)) {
                            await waitFor(1000);
                            resolve();
                        }
                    });
                });
            })

            this.progressMessage = `Se ha eliminado el tema, redirigiendo a la página principal...`;
            this.deleteCompleted = true;

            this.$store.commit('message/display', {
                content: `Se ha eliminado el tema <strong>${topicName}</strong>`
            });

            setTimeout(() => {
                this.$router.replace('/')
            }, 2000)
        }
    }
}
</script>

<style>
</style>
