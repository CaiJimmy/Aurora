<template>
    <div>
        <TaxonomyForm class="taxonomyForm" />

        <taxonomy :showEmptyCategories="true"
            :canEditCategoryName="true">
            <template v-slot:emptyCategory>
                <v-alert type="info">
                    No hay ningún tema debajo de esta categoria
                </v-alert>
            </template>
        </taxonomy>

    </div>
</template>
<script>
import taxonomy from '@/components/Taxonomy/App.vue';
import TaxonomyForm from './Form.vue';

export default {
    name: 'AdminTaxonomy',
    metaInfo: {
        title: 'Taxonomias'
    },
    components: {
        taxonomy,
        TaxonomyForm
    },
    computed: {
        statusOptions () {
            return this.config.topic.statusOptions;
        }
    }
}
</script>
<style lang="scss" scoped>
.taxonomyForm {
    margin-bottom: 20px;
}
</style>
