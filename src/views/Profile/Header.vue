<template>
    <!-- Profile header start -->
    <v-layout column
        justify-center
        class="userProfile--header elevation-1"
        :style="{'background': config.theme.primary}">
        <div class="userProfile--background"
            :style="background"></div>

        <div class="userProfile--color"
            :style="{ background: `linear-gradient(0deg, ${config.theme.primary} 0%, ${config.theme.secondary} 100%)`}"></div>

        <v-layout row
            wrap
            justify-center
            align-center
            class="userProfile--meta">
            <v-flex shrink
                class="mr-4">
                <v-avatar :size="100">
                    <img :src="user.photoURL"
                        :alt="user.displayName">
                </v-avatar>
            </v-flex>

            <v-flex>
                <h1 class="headline font-weight-light">{{ user.displayName }}</h1>
                <h2 class="subtitle-1 font-weight-thin">{{ user.id }} |
                    <strong>{{ userRole }}</strong>
                </h2>
                <h3 class="overline"
                    v-if="user.lastLogin">Last Login: <strong>{{ user.lastLogin.toDate() }}</strong></h3>
            </v-flex>
        </v-layout>
    </v-layout>
</template>

<script>
import userUtil from '@/utils/user';

export default {
    name: "ProfileHeader",
    props: {
        user: Object
    },
    computed: {
        background () {
            return {
                "background-image": `url(${this.user.photoURL})`
            }
        },
        userRole () {
            if (userUtil(this.user).isAdmin()) {
                return 'Administrador'
            }
            else if (userUtil(this.user).isStudent()) {
                return 'Alumno'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.userProfile--header {
    padding: 50px 25px;
    border-radius: 5px;
    position: relative;
    margin-bottom: 20px;
    overflow: hidden;

    .userProfile--background,
    .userProfile--color {
        height: 100%;
        width: 100%;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
    }

    .userProfile--background {
        background-position: center center !important;
        background-size: cover !important;
        transition: all 0.5s ease;
        filter: blur(5px);
    }

    .userProfile--color {
        opacity: 0.9;
    }

    .userProfile--meta {
        z-index: 0;
        color: #fff;
    }
}
</style>

