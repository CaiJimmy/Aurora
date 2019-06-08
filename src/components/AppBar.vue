<template>
    <v-container class="navContainer">
        <v-app-bar color="white"
            light
            hide-on-scroll
            :height="60"
            width>

            <v-menu v-model="menu.main"
                right
                :close-on-content-click="true"
                :nudge-width="200"
                bottom>

                <template v-slot:activator="{ on }">
                    <v-app-bar-nav-icon v-on="on"></v-app-bar-nav-icon>
                </template>

                <v-card>
                    <v-list>
                        <v-list-item
                            link
                            :to="item.link"
                            v-for="item in menuItems"
                            :key="item.link">
                            <v-list-item-icon v-if="item.icon">
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>

            <v-spacer></v-spacer>

            <v-avatar class="siteLogo"
                :height="40"
                :width="40">
                <img :src="config.logo">
            </v-avatar>
            <v-toolbar-title class="siteTitle">{{ config.siteName }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-menu v-model="menu.user"
                left
                :close-on-content-click="true"
                bottom>

                <template v-slot:activator="{ on }">
                    <v-avatar :height="40"
                        :width="40"
                        v-on="on"
                        style="cursor: pointer;">
                        <img :src="currentUser.photoURL"
                            :alt="currentUser.displayName">
                    </v-avatar>
                </template>

                <v-card>
                    <v-list>
                        <v-list-item>
                            <v-list-item-avatar>
                                <img :src="currentUser.photoURL"
                                    :alt="currentUser.displayName">
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>{{ currentUser.displayName }}</v-list-item-title>
                                <v-list-item-subtitle>{{ currentUser.email }} |
                                    <strong>{{ userRole }}</strong></v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn flat
                            color="primary"
                            v-on:click="$router.push({ path: '/user/' + currentUser.email})">Perfil</v-btn>
                        <v-btn flat
                            color="warning"
                            v-on:click="signOut($route, $router)">Cerrar sesión</v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </v-app-bar>
    </v-container>
</template>
<script>
import signOut from '@/utils/signOut';
export default {
    name: "AppBar",
    data () {
        return {
            menu: {
                main: false,
                user: false,
                items: [
                    {
                        title: "Inicio",
                        icon: "home",
                        link: "/"
                    },
                    {
                        title: "Panel de control",
                        icon: "settings",
                        admin: true,
                        link: "/a/"
                    }
                ]
            }
        }
    },
    computed: {
        userRole () {
            if (this.currentUser.isAdmin) {
                return 'Admin'
            }
            else {
                return 'Alumno'
            }
        },
        menuItems () {
            return this.menu.items.filter(item => {
                if (item.admin) {
                    if (this.currentUser.isAdmin) {
                        return item;
                    }
                }
                else {
                    return item;
                }
            })
        }
    },
    methods: {
        signOut,
    }
}
</script>
<style lang="scss" scoped>
.navContainer {
    display: block !important;
    flex: none !important;
    margin: 0 auto !important;
    padding-bottom: 0 !important;
    .v-sheet {
        border-radius: 5px;
    }

    .siteLogo {
        margin: 0 5px;
    }

    .siteTitle {
        font-weight: bold;
    }
}
</style>
