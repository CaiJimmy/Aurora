<template>
    <v-container>
        <taxonomy :topicStatus="'archived'"></taxonomy>
    </v-container>
</template>
<script>
import taxonomy from '@/components/Taxonomy.vue';

export default {
    name: "Archived",
    components: {
        taxonomy
    }
}
</script>

<style>
</style>
