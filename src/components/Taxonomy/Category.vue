<template>
    <div v-if="!isEmpty || showEmptyCategories">

        <v-layout v-if="editingName"
            justify-center
            align-center>
            <v-flex mr-2>
                <v-text-field label="Nombre de la categoria"
                    v-model="categoryName"></v-text-field>

            </v-flex>

            <v-btn text
                fab
                color="primary"
                :loading="loading"
                v-on:click="editCategoryName()">
                <v-icon>save</v-icon>
            </v-btn>

            <v-btn text
                fab
                v-on:click="editingName = false"
                :disabled="loading">
                <v-icon>close</v-icon>
            </v-btn>

            <!-- Delete category dialog -->
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <span v-on="on">
                        <v-btn text
                            fab
                            color="error"
                            :disabled="!isEmpty"
                            @click.stop="deleteCategoryDialog = true">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </span>
                </template>
                <span v-if="isEmpty">Eliminar la categoria</span>
                <span v-else>No puedes eliminar la categoria porque no está vacío</span>
            </v-tooltip>

            <v-dialog v-model="deleteCategoryDialog"
                persistent
                max-width="290">
                <v-card>
                    <v-card-title class="headline">Confirmación</v-card-title>
                    <v-card-text>
                        Eliminar la categoria <strong>{{ categoryName }}</strong>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text
                            @click="deleteCategoryDialog = false">Cancelar</v-btn>
                        <v-btn color="error"
                            text
                            @click="deleteCurrentCategory()">Eliminar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-layout>

        <h3 class="taxonomyList--name font-weight-light"
            v-else>
            {{ category.name }}

            <v-btn text
                fab
                v-on:click="editingName = true"
                v-if="shouldDisplayEditButton">
                <v-icon>edit</v-icon>
            </v-btn>
        </h3>

        <v-layout class="taxonomyList--items"
            row
            wrap>

            <slot name="emptyCategory"
                v-if="isEmpty"></slot>

            <v-flex xs6
                md4
                lg3
                xl2
                v-for="topic in getTopicsByCategory(category.id, taxonomies)"
                :key="topic.id">
                <TaxonomyTopic :topic="topic" />
            </v-flex>

        </v-layout>
    </div>
</template>

<script>
import TaxonomyTopic from './Topic.vue';
import { getTopicsByCategory, TAXONOMY_COLLECTION } from '@/utils/taxonomy';
import userUtil from '@/utils/user';

export default {
    name: "TaxonomyCategory",
    props: {
        showEmptyCategories: Boolean,
        category: {
            type: Object,
            required: true
        },
        taxonomies: {
            type: Array,
            required: true
        },
        canEditCategoryName: {
            type: Boolean,
            default: false
        },
        canDeleteEmptyCategory: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            editingName: false,
            categoryName: null,
            loading: false,
            deleteCategoryDialog: false
        }
    },
    components: {
        TaxonomyTopic
    },
    created () {
        this.categoryName = this.category.name;
    },
    computed: {
        isAdmin () {
            return userUtil(this.currentUser).isAdmin();
        },
        shouldDisplayEditButton () {
            return this.canEditCategoryName && this.isAdmin;
        },
        isEmpty () {
            return getTopicsByCategory(this.category.id, this.taxonomies).length === 0;
        }
    },
    methods: {
        deleteCurrentCategory () {
            this.deleteCategoryDialog = false;

            const categoryId = this.category.id,
                categoryRef = TAXONOMY_COLLECTION.doc(categoryId);

            categoryRef.delete();
        },
        getTopicsByCategory,
        editCategoryName () {
            const categoryRef = TAXONOMY_COLLECTION.doc(this.category.id);

            if (!this.categoryName) return;

            this.loading = true;

            categoryRef.set({
                name: this.categoryName
            }, { merge: true }).then(() => {
                this.loading = false;
                this.editingName = false;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.taxonomyList--items {
    margin: 0 -10px;
    margin-bottom: 30px;
}

.taxonomyList--name {
    color: #80868b;
}
</style>
