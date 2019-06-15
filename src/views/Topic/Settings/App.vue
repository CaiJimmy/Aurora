<template>
    <v-card>
        <v-card-title>Ajustes del tema</v-card-title>
        <v-container>
            <v-layout column>
                <v-flex>
                    <v-text-field v-model="newConfig.name"
                        label="Nombre del tema"
                        v-validate="'required'"
                        :error-messages="errors.collect('name')"
                        data-vv-name="name"></v-text-field>
                </v-flex>

                <v-flex>
                    <v-text-field v-model="newConfig.description"
                        label="Descripción del tema"></v-text-field>
                </v-flex>

                <v-flex>
                    <v-select v-validate="'required'"
                        :error-messages="errors.collect('category')"
                        data-vv-name="category"
                        v-model="newConfig.parent"
                        :items="filterTaxonomy('category', taxonomies)"
                        item-text="name"
                        item-value="id"
                        label="Categoria al que pertence"></v-select>
                </v-flex>

                <v-flex>
                    <v-select v-model="newConfig.status"
                        :items="statusOptions"
                        label="Estado del tema"></v-select>
                </v-flex>

                <v-flex>
                    <v-subheader class="pl-0">Número de preguntas que se tiene que publicar cada usuario</v-subheader>
                    <v-slider v-model="newConfig.config.requiredQuestions"
                        thumb-label
                        :max="30"
                        :min="1"></v-slider>
                </v-flex>

                <v-flex>
                    <v-text-field v-model="newConfig.config.background.url"
                        label="Imagen del tema"
                        v-validate="'required'"
                        :error-messages="errors.collect('image')"
                        data-vv-name="image"></v-text-field>

                    <v-btn :loading="loading.imageUploader"
                        :disabled="loading.imageUploader"
                        color="blue-grey"
                        class="mx-2 white--text"
                        v-on:click="$refs.fileInput.click();">
                        Subir imagen
                        <v-icon right
                            dark>cloud_upload</v-icon>

                        <input ref="fileInput"
                            type="file"
                            @change="changeHeaderImage($event.target.files[0]);"
                            accept="image/*"
                            style="display:none;" />
                    </v-btn>
                </v-flex>

            </v-layout>
        </v-container>
        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text
                v-on:click="$router.push(`/t/${topicId}`)">Cancelar</v-btn>
            <v-btn text
                color="primary"
                v-on:click="saveConfig()"
                :loading="loading.form">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { filterTaxonomy } from '@/utils/taxonomy';
import { TAXONOMY_COLLECTION } from '@/store/modules/taxonomy';
import resizeImage from '@/utils/resizeImage/';
import uploadFile from '@/utils/uploadFile';
import getColorFromImage from '@/utils/getColorFromImage';

import Vue from 'vue'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

export default {
    $_veeValidate: {
        validator: 'new'
    },
    name: "TopicSettings",
    props: {
        topic: Object,
        topicId: String
    },
    data () {
        return {
            valid: false,
            loading: {
                form: false,
                imageUploader: false
            },
            newConfig: {}
        }
    },
    created () {
        /// Clone current topic settings
        this.newConfig = JSON.parse(JSON.stringify(this.topic));
    },
    computed: {
        taxonomies () {
            return this.$store.state.taxonomy.taxonomies;
        },
        statusOptions () {
            return this.config.topic.statusOptions;
        }
    },
    methods: {
        filterTaxonomy,
        async changeHeaderImage (imageFile) {
            if (!imageFile) return;

            this.loading.imageUploader = true;

            let resizedImage = await resizeImage(imageFile, this.config.topic.headerImageMaxWidth),
                color = await getColorFromImage(URL.createObjectURL(resizedImage)),
                imageURL = await uploadFile(resizedImage, `coverImage/${this.topicId}`)

            this.newConfig.config.background = {
                color: color,
                url: imageURL
            };

            this.loading.imageUploader = false;
            this.saveConfig();
        },
        async saveConfig () {
            let validatorResult = await this.$validator.validateAll();
            if (!validatorResult) return;

            this.loading.form = true;

            let topicRef = TAXONOMY_COLLECTION.doc(this.topicId);

            topicRef.set(this.newConfig, { merge: true }).then(() => {
                this.loading.form = false;
            })
        }
    }
}
</script>

<style>
</style>
