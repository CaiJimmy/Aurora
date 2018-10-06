<template>
    <div class="userCard elevation-1">
        <header class="userCard--header">
            <div class="userCard--headerImage"
                :style="headerImage"></div>
            <figure>
                <img :src="user.photoURL"
                    :alt="user.displayName">
            </figure>
        </header>
        <div class="userCard--meta">
            <h1>{{ user.displayName }}</h1>
            <h2>{{ user.email }} |
                <strong>{{ userRole }}</strong>
            </h2>
            <v-btn flat
                small
                color="primary"
                v-on:click="$router.push({ path: '/profile/' + user.uid})">Perfil</v-btn>
            <v-btn flat
                small
                color="warning"
                v-on:click="signOut()">Cerrar sesión</v-btn>
        </div>
    </div>
</template>
<script>
import { Auth } from '@/firebase/auth';
export default {
    props: ['user'],
    computed: {
        headerImage () {
            return {
                "background-image": `url(${this.config.currentUserCard.background})`
            }
        },
        isAdmin () {
            /// TODO: Add isAdmin verification
            return false;
        },
        userRole () {
            if (this.isAdmin) {
                return 'Admin'
            }
            else {
                return 'Alumno'
            }
        },
    },
    methods: {
        signOut () {
            Auth.signOut().then(() => {
                if (!this.$route.query.go || this.$route.path !== '/login') {
                    this.$router.replace({
                        path: '/login',
                        query: {
                            go: this.$route.fullPath,
                        },
                    });
                }
            });
        },
    }
}
</script>
<style lang="scss" scoped>
.userCard {
  margin-top: 1em;
  background: #fff;

  header {
    position: relative;
    margin-bottom: 50px;
  }
  .userCard--headerImage {
    width: 100%;
    height: 150px;
    position: relative;
    overflow: hidden;
    background-size: cover !important;
    background-position: top center !important;
    background-repeat: no-repeat !important;
  }

  figure {
    margin: 0;
    height: 120px;
    width: 120px;
    position: absolute;
    bottom: -50px;
    display: block;
    left: 50%;
    transform: translateX(-50%);

    img {
      border-radius: 100%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      border: 2px solid #fff;
      width: 100%;
    }
  }

  .userCard--meta {
    padding: 5px 15px;
    text-align: center;

    h1,
    h2 {
      font-weight: lighter;
    }

    h1 {
      font-size: 20px;
    }
    h2 {
      color: #999;
      font-size: 15px;
    }
  }
}
</style>