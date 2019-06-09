<template>
    <div>
        <v-card class="addTaxonomy">
            <v-card-title>Añadir</v-card-title>
            <v-container>
                <v-form ref="form">
                    <v-text-field v-model="form.name"
                        label="Nombre"
                        required></v-text-field>

                    <v-select v-model="form.type"
                        :items="type"
                        item-text="name"
                        item-value="value"
                        label="Tipo"></v-select>

                    <v-select :disabled="form.type !== 'topic'"
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

        <taxonomy :showEmptyCategories="true">
            <template v-slot:emptyCategory>
                <v-alert type="info">
                    No hay ningún tema debajo de esta categoria
                </v-alert>
            </template>
        </taxonomy>

    </div>
</template>
<script>
import taxonomy from '@/components/Taxonomy.vue';
import { filterTaxonomy, addTaxonomy } from '@/utils/taxonomy';
import getColorFromImage from '@/utils/getColorFromImage';
import uploadFile from '@/utils/uploadFile';

export default {
    name: 'AdminTaxonomy',
    metaInfo: {
        title: 'Taxonomias'
    },
    components: {
        taxonomy
    },
    data () {
        return {
            form: {
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
                loading: false
            },
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
        randomID () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 8; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        },
        getRandomPic: async function () {
            return fetch("https://source.unsplash.com/500x500/?technology").then(async (response) => {   /// Fetch a random image from Unsplash, and add it to form
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
            this.form.loading = true;

            if (this.form.type == 'topic') {
                const randomPic = await this.getRandomPic();
                /// By default, the image will be uploaded to /coverImage/ folder, because we don't have yet the topic id
                const uploadImageURL = await uploadFile(randomPic.file, `coverImage/${this.randomID()}`);
                this.form.config.background = {
                    url: uploadImageURL,
                    color: randomPic.color
                };
            }

            addTaxonomy(this.form.type, this.form).then(() => {
                this.form.loading = false;
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.addTaxonomy{
    margin-bottom: 20px;
}
</style>
