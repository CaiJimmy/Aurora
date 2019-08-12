<template>
    <v-container>
        <taxonomy :topicStatus="'active'">
            <template v-slot:emptyTaxonomy>
                <div class="empty-state">
                    <v-icon class="empty-state--icon mb-4">mdi-inbox</v-icon>

                    <p class="empty-state--message headline font-weight-light">
                        No hay temas en estado activo
                    </p>
                    
                    <v-btn to="/archived">
                        Ver temas archivados
                    </v-btn>
                </div>
            </template>
        </taxonomy>
    </v-container>
</template>
<script>
import taxonomy from '@/components/Taxonomy/App.vue';

export default {
    name: 'Home',
    metaInfo: {
        title: 'Inicio'
    },
    components: {
        taxonomy
    }
}
</script>
<style lang="scss" scoped>
.empty-state {
    text-align: center;
    height: 100%;
    width: 100%;
    .empty-state--icon {
        width: 160px;
        min-width: 160px;
        height: 160px;
        font-size: 160px !important;
        margin: 0;
    }
}
.taxonomyList--category {
    width: 100%;
}
</style>