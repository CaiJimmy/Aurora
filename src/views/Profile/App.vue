<template>
    <v-container class="userProfile">

        <!-- Wait until user data is loaded -->
        <v-progress-linear :indeterminate="true"
            height="4"
            v-if="loading.user"></v-progress-linear>

        <template v-else>

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
                </header>
                <userCard :user="user"
                    class="userProfile--card"></userCard>
                <!-- Profile header end -->
            </div>

        </template>
    </v-container>
</template>
<script>
import { Firestore } from '@/firebase/firestore';
import userCard from '@/components/UserCard.vue';

export default {
    name: 'Profile',
    metaInfo () {
        return {
            title: this.user.displayName || 'Perfil'
        }
    },
    props: {
        userEmail: String
    },
    components: {
        userCard
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
                'toolbar': {
                    'color': this.config.theme.primary,
                    'flat': true
                }
            });
            if (this.$store.state.users.hasOwnProperty(this.userEmail)) {
                /* 
                    If that user ID is found under $store.state.users[], copy it directly
                */
                this.user = this.$store.state.users[this.userEmail];
                this.loading.user = false;
            }
            else {
                Firestore.collection('users').doc(this.userEmail).get().then((snapshot) => {
                    if (snapshot.exists) {
                        /* User ID found on databse */
                        this.user = snapshot.data();
                        this.user.email = this.userEmail;

                        /* Save it to Vuex, avoid reload on next time */
                        this.$store.commit('users/addUser', this.user);
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
}
</script>
<style lang="scss" scoped>
.userProfile--header {
    padding: 80px 0;
    border-radius: 5px
}
.userProfile--card {
    margin-top: -70px;
}
</style>
