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
            <v-spacer></v-spacer>
            <v-btn text
                color="primary"
                v-on:click="createQuestion()"
                :disabled="loading">Enviar</v-btn>
        </v-card-actions>
    </v-card>

</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

import { Firestore, firestore } from '@/firebase/firestore'

export default {
    name: "QuestionForm",
    $_veeValidate: {
        validator: 'new'
    },
    props: {
        mode: String,
        topicId: String,
        questionData: Object
    },
    data () {
        return {
            loading: false,
            form: {}
        }
    },
    created () {
        this.reset();
        this.initialize()
    },
    methods: {
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
        getUserData (userEmail) {
            return this.$store.state.users[userEmail];
        },
        initialize () {
            this.form = {
                ...this.form,
                author: this.currentUser.email,
                topic: this.topicId
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
