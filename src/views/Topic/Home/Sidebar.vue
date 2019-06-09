<template>
    <v-card>
        <v-card-title>Estadística</v-card-title>

        <v-list>
            <v-list-item>
                <v-list-item-icon>
                    <v-icon>visibility</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Visible: {{ topic.counter.total - topic.counter.hidden }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item>
                <v-list-item-icon>
                    <v-icon>visibility_off</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Oculto: {{ topic.counter.hidden }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-card-actions>
            <v-btn text>Refrescar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: "TopicPage-Sidebar",
    props: {
        topic: Object
    }
}
</script>
