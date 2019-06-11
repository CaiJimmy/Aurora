<template>
    <v-card :disabled="loading"
        :loading="loading">
        <v-card-title>
            <v-list-item class="grow">
                <v-list-item-avatar>
                    <v-img :src="getUserData(form.author).photoURL"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>{{ getUserData(form.author).displayName }}</v-list-item-title>

                    <v-list-item-subtitle>
                        {{ getUserData(form.author).email }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-card-title>

        <v-card-text>
            <!-- Form start -->
            <v-form>
                <v-container>
                    <v-text-field v-model="form.title"
                        label="Pregunta"
                        required
                        prepend-icon="title"
                        v-validate="'required'"
                        :error-messages="errors.collect('title')"
                        data-vv-name="title"
                        data-vv-as="Título"></v-text-field>

                    <v-layout v-for="(option, index) in form.options"
                        :key="index"
                        justify-center>

                        <v-flex shrink>
                            <v-radio-group v-model="form.correctAnswer">
                                <v-radio :value="index"></v-radio>
                            </v-radio-group>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="form.options[index]"
                                :label="`Opción ${(index + 10).toString(36).toUpperCase()}`"
                                required
                                v-validate="'required'"
                                :error-messages="errors.collect(`option-${index}`)"
                                :data-vv-name="`option-${index}`"
                                :data-vv-as="`opción ${(index + 10).toString(36).toUpperCase()}`"></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-form>
            <!-- Form end -->
        </v-card-text>

        <v-card-actions>
            <template v-if="mode == 'edit'">

                <v-dialog v-model="deleteDialog"
                    persistent
                    max-width="400">
                    <template v-slot:activator="{ on }">
                        <v-btn v-if="questionRemovable"
                            color="error"
                            text
                            v-on="on">Eliminar</v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="headline">Confirmación</v-card-title>
                        <v-card-text v-html="removeConfirmContent"></v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1"
                                text
                                @click="deleteDialog = false">Cancelar</v-btn>
                            <v-btn color="green darken-1"
                                text
                                v-on:click="removeQuestion()">Eliminar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-spacer></v-spacer>

                <v-btn text
                    color="primary"
                    v-on:click="editQuestion()"
                    :disabled="loading">Guardar</v-btn>
            </template>
            <template v-else>
                <v-btn text
                    color="primary"
                    v-on:click="createQuestion()"
                    :disabled="loading">Enviar</v-btn>
            </template>
        </v-card-actions>
    </v-card>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

import { Firestore, firestore } from '@/firebase/firestore'

import getUserData from '@/utils/getUserData/'

export default {
    name: "QuestionForm",
    $_veeValidate: {
        validator: 'new'
    },
    props: {
        mode: String,
        topicId: String,
        questionData: Object,
        callback: Function
    },
    data () {
        return {
            loading: false,
            form: {},
            deleteDialog: false
        }
    },
    created () {
        this.reset();
        this.initialize()
    },
    computed: {
        removeConfirmContent () {
            let questionTitle = this.questionData.title,
                authorDisplayName = getUserData(this.questionData.author).displayName;

            return 'Estas seguro de que quieres eliminar la pregunta <strong>' + questionTitle + '</strong>, publicado por <strong>' + authorDisplayName + '</strong>?'
        },
        questionRemovable () {
            /*
                If current user is not admin, and questionRemovable is true, 
                then the question is only removable when current user is the author
            */

            const questionRemovable = this.config.topic.questionRemovable,
                isAdmin = this.currentUser.isAdmin;

            return (isAdmin) || (questionRemovable && this.questionData.author === this.currentUser.email);
        }
    },
    methods: {
        getUserData,
        removeQuestion () {
            const questionData = this.questionData,
                questionId = questionData.id;

            Firestore.collection('questions').doc(questionId).delete().then(() => {
                if (this.callback) {
                    this.callback({
                        type: 'delete',
                        deleted: true,
                        question: questionData
                    })
                }
            });
        },
        async editQuestion () {
            let validatorResult = await this.$validator.validateAll();
            if (!validatorResult) return;

            this.loading = true;

            let questionRef = Firestore.collection('questions').doc(this.questionData.id);

            return questionRef.set(this.form, { merge: true }).then(() => {
                if (this.callback) {
                    this.callback({
                        type: 'edit',
                        edited: true,
                        question: this.form
                    });
                }

                this.loading = false;
            })
        },
        async createQuestion () {
            let validatorResult = await this.$validator.validateAll();
            if (!validatorResult) return;

            this.loading = true;

            let collection = Firestore.collection('questions')

            collection.add({
                ...this.form,
                date: firestore.FieldValue.serverTimestamp()
            }).then(() => {
                this.reset();
                this.initialize();
                this.loading = false;
            })
        },
        initialize () {
            if (this.mode == 'edit') {
                this.form = Object.assign({}, this.questionData);  /// Don't mutate the original data
            }
            else {
                this.form = {
                    ...this.form,
                    author: this.currentUser.email,
                    topic: this.topicId
                }
            }
        },
        reset () {
            this.$validator.reset();
            this.form = {
                title: null,
                date: new Date(),
                author: null,
                options: ['', '', '', ''],
                correctAnswer: 0,
                status: 1,
                topic: null,
            }
        }
    }
}
</script>

<style>
</style>
