<template>
    <v-layout row
        wrap>
        <v-flex xs12
            s6
            md4
            v-for="item in items"
            :key="item.id">
            <v-card :color="item.color"
                class="white--text"
                hover
                :to="`/a/${item.id}`">
                <v-card-title primary-title>
                    <div>
                        <div class="headline">{{ item.title }}</div>
                        <div>{{ item.description }}</div>
                    </div>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
export default {
    name: 'AdminPanelHome',
    metaInfo: {
        title: 'Administrar'
    },
    data () {
        return {
            items: [{
                id: 'taxonomy',
                title: "Taxonomias",
                description: "Añadir categorias y temas.",
                color: "blue-grey"
            }]
        }
    }
}
</script>
