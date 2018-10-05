<template>
    <div id="loginPage">

        <div id="loginPage--background"
            v-bind:style="{'background-image': `url(${config.login.background})`}"></div>

        <div class="main">
            <v-card class="elevation-2"
                id="loginCard">

                <figure class="logo">
                    <img class="elevation-3" :src="config.logo">
                </figure>

                    <div class="loginCard--content">
                        <h1 class="display-1 font-weight-light">{{ config.siteName }}</h1>
                        <v-btn :loading="loading"
                            :disabled="loading"
                            color="blue-grey"
                            class="white--text"
                            @click="login()">
                            Login
                            <v-icon right
                                dark>account_circle</v-icon>
                        </v-btn>
                    </div>
            </v-card>
        </div>

        <v-snackbar v-model="snackbar.display"
            :bottom="config.snackbar.position.y === 'bottom'"
            :left="config.snackbar.position.x === 'left'"
            :right="config.snackbar.position.x === 'right'"
            :timeout="config.snackbar.timeout"
            :top="config.snackbar.position.y === 'top'">
            {{ snackbar.message }}
        </v-snackbar>
    </div>
</template>

<script>
import { Auth, auth } from '@/firebase/auth';
import validAccountCheck from './validAccountCheck.js';
import Console from '@/utils/Console';

export default {
    name: "Login",
    metaInfo: {
        title: 'Iniciar Sesión'
    },
    data () {
        return {
            loading: false,
            snackbar: {
                display: false,
                message: null
            }
        }
    },
    created: function () {
        if (this.auth.loggedIn) {
            /*
                User already logged in
            */

			/*
				Start downloading datas (levels and topics)
			*/
            ///this.$store.dispatch('initApp');

			/*
				If the user was logged in, he/she must have passed domain validation
				So there's no need to do it again.
			*/
            this.$store.commit('auth/userValidation', true);

            this.redirect();
        }
    },
    methods: {
        redirect () {
            this.$router.replace({
                path: this.$route.query.go || '/'
            });
        },
        login () {
            this.loading = true;

            const provider = new auth.GoogleAuthProvider();
            Auth.signInWithPopup(provider).then(() => {

                validAccountCheck().then((validAccount) => {
                    /**
                     * Check if user has a valid email account
                    */
                    if (validAccount == true) {
                        this.redirect();
                        ///this.$store.dispatch('initApp');
                        this.$store.commit('auth/userValidation', true);
                    }
                    else {
                        this.$store.commit('auth/userValidation', false);
                        this.snackbar.message = 'No es una cuenta válida';
                        this.snackbar.display = true;
                        Auth.signOut();
                    }

                }).then(() => {
                    this.loading = false;
                });

            }).catch(error => {
                const errorMessage = error.message;

                Console.error(error);

                this.snackbar.message = errorMessage; /// Display error message using snackbar
                this.snackbar.display = true;

                this.loading = false;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
#loginPage {
  display: flex;
  position: relative;
  height: 100%;
  width: 100%;
  #loginPage--background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-position: center center;
    background-size: cover;
  }
  .main {
    align-self: center;
    width: 100%;
  }

  #loginCard {
    margin: 0 auto;
    width: 100%;
    max-width: 300px;
    text-align: center;

    .logo {
      transform: translateY(-50%);
      margin: 0;
      img {
        width: 120px;
        height: 120px;
        border-radius: 100%;
        display: block;
        margin: 0 auto;
      }
    }

    .loginCard--content {
      margin-top: -60px;
      padding-top: 30px;
      display: flex;
      flex-direction: column;
      h1 {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
