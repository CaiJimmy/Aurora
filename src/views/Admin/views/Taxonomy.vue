<template>
    <div>
        <v-card>
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
                    background: {
                        image: {
                            url: null,
                            colors: []
                        },
                        color: null,
                        mode: 0 /// 0: Image ; 1: color
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
        addTaxonomy () {
            this.form.loading = true;
            addTaxonomy(this.form.type, this.form).then(() => {
                this.form.loading = false;
                this.$forceUpdate();
            })
        }
    }
}
</script>
