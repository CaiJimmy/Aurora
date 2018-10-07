<template>
    <div class="userProfile">

        <!-- Wait until user data is loaded -->
        <v-progress-linear :indeterminate="true"
            height="4"
            v-if="loading.user"></v-progress-linear>

        <div v-else>

            <!-- If user ID is not found in database -->
            <div v-if="notFound"
                class="notFound container">
                <v-alert :value="true"
                    type="error">
                    Usuario no encontrado
                </v-alert>

            </div>

            <!-- User ID is found in database -->
            <div v-else>

                <!-- Profile header start -->
                <header class="userProfile--header elevation-1"
                    :style="{'background': config.theme.primary}">
                    <div class="container">
                        <div class="userProfile--card elevation-2">

                            <div class="userProfile--meta">
                                <h1 class="headline">{{ user.displayName }}</h1>
                                <h2 class="subheading">{{ user.email }}</h2>
                            </div>
                            <v-avatar :size="100">
                                <img :src="user.photoURL"
                                    :alt="user.displayName">
                            </v-avatar>
                        </div>
                    </div>
                </header>
                <!-- Profile header end -->
            </div>
        </div>
    </div>
</template>
<script>
import { Firestore } from '@/firebase/firestore';

export default {
    name: 'Profile',
    props: {
        userEmail: String
    },
    data () {
        return {
            user: {
                displayName: null,
                photoURL: null,
                email: null
            },

            loading: {
                user: true
            },

            notFound: false
        }
    },
    watch: {
        userEmail () {  /* When topic ID changes, re-render page */
            if (this.userEmail) {
                this.loading.user = true;
                this.notFound = false;
                this.init();
            }
        }
    },
    created () {
        this.init();
    },
    methods: {
        init () {
            this.$store.commit('theme/set', {
                'toolbarColor': this.config.theme.primary,
                'flatToolbar': true
            });

            Firestore.collection('users').doc(this.userEmail).get().then((snapshot) => {
                if (snapshot.exists) {
                    /* User ID found on databse */
                    this.user = snapshot.data();
                    this.user.email = this.userEmail;
                    /// this.$store.commit('addUser', this.user);
                    this.loading.user = false;
                }
                else {
                    /* Wrong user ID, display not found error */
                    this.notFound = true;
                    this.loading.user = false;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.userProfile--header {
  padding: 20px 0;
  .container {
    margin: 0 auto;
    max-width: 550px;
    padding: 0 15px;
  }
  .userProfile--card {
    background: #fff;
    transform: translateY(50%);
    display: flex;
    padding: 20px;
    flex-direction: row;
  }
  .userProfile--meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    h1 {
      color: #000;
    }
    h2 {
      color: #999;
      font-size: 15px;
    }
  }
}
</style>
