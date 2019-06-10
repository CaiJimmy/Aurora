<template>
    <v-card flat
        outlined>
        <v-card-text>
            <div>Estadística</div>

            <v-list disabled>
                <v-list-item-group>
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
                </v-list-item-group>
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
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
