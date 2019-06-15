<template >
    <div v-if="getTopicsByCategory(category.id, taxonomies).length || showEmptyCategories">

        <v-layout v-if="editingName"
            justify-center
            align-center>
            <v-flex mr-2>
                <v-text-field label="Nombre de la categoria"
                    v-model="categoryName"></v-text-field>

            </v-flex>

            <v-btn text
                :loading="loading"
                v-on:click="editCategoryName()">
                Guardar
            </v-btn>
            <v-btn text
                v-on:click="editingName = false"
                :disabled="loading">
                Cancelar
            </v-btn>
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
                v-if="!getTopicsByCategory(category.id, taxonomies).length"></slot>

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
        }
    },
    data () {
        return {
            editingName: false,
            categoryName: null,
            loading: false
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
        }
    },
    methods: {
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
