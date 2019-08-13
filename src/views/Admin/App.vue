<template>
    <v-container fill-height>
        <v-layout>
            <v-flex shrink>
                <v-navigation-drawer :mini-variant="miniVariant"
                    permanent
                    hide-overlay
                    class="elevation-1 sideNav">
                    <v-list>
                        <v-list-item exact
                            v-for="item in items"
                            :key="item.title"
                            :to="`/a/${item.id}`">
                            <v-list-item-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-action>

                            <v-list-item-title>
                                {{ item.title }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>
            </v-flex>

            <v-flex>
                <transition-page>
                    <router-view />
                </transition-page>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import TransitionPage from '@/transitions/TransitionPage.vue';

export default {
    name: 'AdminPanel',
    components: {
        TransitionPage
    },
    data () {
        return {
            items: [
                {
                    id: '',
                    title: "Inicio",
                    icon: "home"
                },
                {
                    id: 'settings',
                    title: "Ajustes",
                    description: "Configuar la página",
                    icon: "settings"
                },
                {
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
