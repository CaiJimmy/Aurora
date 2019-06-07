<template>
    <v-layout>
        <v-flex shrink>
            <v-navigation-drawer :mini-variant="miniVariant"
                permanent
                hide-overlay>
                <v-list>
                    <v-list-tile v-for="item in items"
                        :key="item.title"
                        :to="`/a/${item.id}`">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
        </v-flex>

        <v-flex grow>
            <v-layout justify-center>
                <router-view />
            </v-layout>
        </v-flex>
    </v-layout>
</template>
<script>
export default {
    name: 'AdminPanel',
    data () {
        return {
            items: [{
                id: 'taxonomy',
                title: "Taxonomias",
                description: "Añadir categorias y temas.",
                icon: "category"
            },
            {
                id: 'user',
                title: "Usuarios",
                description: "Buscar usuarios",
                icon: "account_circle"
            }],

            windowWidth: 0
        }
    },
    mounted () {
        this.windowWidth = window.innerWidth;
        this.$nextTick(() => {
            window.addEventListener('resize', () => {
                this.windowWidth = window.innerWidth;
            });
        })
    },
    computed: {
        miniVariant () {
            return this.windowWidth < 800;
        }
    }
}
</script>
