<template>
    <v-card>
        <v-card-title>Añadir</v-card-title>
        <v-container>
            <v-form ref="form">
                <v-text-field v-model="form.name"
                    label="Nombre"
                    v-validate="'required'"
                    :error-messages="errors.collect('name')"
                    data-vv-name="name"></v-text-field>

                <v-select v-model="form.type"
                    :items="type"
                    item-text="name"
                    item-value="value"
                    label="Tipo"></v-select>

                <v-select v-validate="'required'"
                    :error-messages="errors.collect('category')"
                    data-vv-name="category"
                    v-if="form.type == 'topic'"
                    v-model="form.parent"
                    :items="filterTaxonomy('category', taxonomies)"
                    item-text="name"
                    item-value="id"
                    label="Categoria al que pertence"></v-select>
            </v-form>
        </v-container>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text
                color="primary"
                v-on:click="addTaxonomy()"
                :loading="form.loading">Añadir</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { filterTaxonomy, addTaxonomy, TAXONOMY_COLLECTION } from '@/utils/taxonomy';
import getColorFromImage from '@/utils/getColorFromImage';
import uploadFile from '@/utils/uploadFile';

import Vue from 'vue'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

const getDefaultForm = () => {
    return {
        name: null,
        type: "category",
        parent: null,
        description: null,
        config: {
            requiredQuestions: 5,
            background: {
                url: null,
                colors: []
            }
        },
        counter: {
            total: 0,
            hidden: 0
        },
        loading: false,
        status: null
    }
}

export default {
    name: 'TaxonomyForm',
    $_veeValidate: {
        validator: 'new'
    },
    data () {
        return {
            form: getDefaultForm(),
            type: [
                {
                    name: "Tema",
                    value: "topic"
                },
                {
                    name: "Categoria",
                    value: "category"
                }
            ]
        }
    },
    computed: {
        taxonomies () {
            return this.$store.state.taxonomy.taxonomies;
        }
    },
    watch: {
        "form.type" () {
            if (this.form.type == 'category') {
                this.form.parent = ''
            }
        }
    },

    methods: {
        filterTaxonomy,
        getRandomPic: async function () {
            return fetch(this.config.topic.defaultHeaderImage).then(async (response) => {   /// Fetch a random image from Unsplash, and add it to form
                let imageFile = await fetch(response.url).then(res => {
                    return res.blob();
                });
                return {
                    url: response.url,
                    color: await getColorFromImage(URL.createObjectURL(imageFile)),
                    file: imageFile
                };
            })
        },
        async addTaxonomy () {
            let validatorResult = await this.$validator.validateAll();
            if (!validatorResult) return;

            this.form.loading = true;

            const newTaxonomyId = TAXONOMY_COLLECTION.doc().id;

            if (this.form.type == 'topic') {
                const randomPic = await this.getRandomPic();
                /// By default, the image will be uploaded to /coverImage/ folder, named with newTaxonomyId
                const uploadImageURL = await uploadFile(randomPic.file, `coverImage/${newTaxonomyId}`);
                this.form.config.background = {
                    url: uploadImageURL,
                    color: randomPic.color
                };

                this.form.status = this.config.topic.defaultStatus;
            }

            addTaxonomy(this.form.type, this.form, newTaxonomyId).then(() => {
                this.form.loading = false;

                if (this.form.type == 'topic') {
                    this.$store.commit('message/display', {
                        content: `Se ha creado correctamente el tema <strong>${this.form.name}</strong>`,
                        action: () => {
                            this.$router.push(`/t/${newTaxonomyId}`)
                        },
                        actionText: 'Ir'
                    });
                }
                else {
                    this.$store.commit('message/display', {
                        content: `Se ha creado correctamente la categoria <strong>${this.form.name}</strong>`,
                    });
                }

                this.form = getDefaultForm();
                this.$validator.reset();
            })
        }
    }
}
</script>