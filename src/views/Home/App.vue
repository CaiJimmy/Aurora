<template>
    <v-container>
        <taxonomy :topicStatus="'active'"></taxonomy>
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
