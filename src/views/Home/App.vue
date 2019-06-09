<template>
    <v-container>
        <taxonomy></taxonomy>
    </v-container>
</template>
<script>
import taxonomy from '@/components/Taxonomy.vue';

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
