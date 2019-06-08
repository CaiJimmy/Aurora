<template>
    <v-container>
        <v-layout fill-height>
            <v-flex shrink>
                <v-navigation-drawer :mini-variant="miniVariant"
                    permanent
                    hide-overlay
                    class="elevation-1 sideNav">
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
                <router-view />
            </v-flex>
        </v-layout>
    </v-container>
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
        });
    },
    computed: {
        miniVariant () {
            return this.windowWidth < 800;
        }
    }
}
</script>
<style lang="scss" scoped>
.sideNav {
    margin-right: 20px;
}
</style>
