<template>
    <v-container class="userProfile"
        grid-list-md>
        <!-- Wait until user data is loaded -->
        <v-layout v-if="loading.user"
            align-content-center
            justify-center
            wrap>
            <v-flex xs12
                subtitle-2
                text-xs-center>
                Obteniendo datos
            </v-flex>
            <v-flex xs2>
                <v-progress-linear indeterminate
                    rounded
                    height="6"></v-progress-linear>
            </v-flex>
        </v-layout>

        <template v-else>

            <!-- If user ID is not found in database -->
            <div v-if="notFound"
                class="notFound">
                <v-alert :value="true"
                    type="error">
                    Usuario no encontrado
                </v-alert>

            </div>

            <!-- User ID is found in database -->
            <div v-else>

                <!-- Profile header start -->
                <Header :user="user"
                    class="mb-2" />
                <!-- Profile header end -->

                <v-layout justify-space-between
                    v-bind="binding">
                    <v-flex xs12
                        md3
                        class="sidebar">
                        <Sidebar :user="user"
                            :questions="questions" />
                    </v-flex>

                    <v-flex xs12
                        md9
                        :class="{'pl-5': $vuetify.breakpoint.mdAndUp}">
                        <QuestionList :questions="questions"
                            :user="user"
                            :loading="loading.questions" />
                    </v-flex>
                </v-layout>
            </div>
        </template>
    </v-container>
</template>
<script>
import { Firestore } from '@/firebase/firestore';
import Header from './Header.vue';
import QuestionList from './QuestionList.vue';
import Sidebar from './Sidebar.vue';

import { firestorePlugin } from 'vuefire'
import Vue from 'vue'

Vue.use(firestorePlugin)

export default {
    name: 'Profile',
    metaInfo () {
        if (this.user) {
            return {
                title: this.user.displayName
            }
        }
        else {
            return {
                title: 'Perfil'
            }
        }
    },
    props: {
        userEmail: String
    },
    components: {
        Header,
        Sidebar,
        QuestionList
    },
    data () {
        return {
            user: {},

            loading: {
                user: true,
                questions: true
            },

            notFound: false,

            questions: []
        }
    },
    computed: {
        binding () {
            const binding = {}

            if (this.$vuetify.breakpoint.mdAndUp) {
                binding.row = true
            }
            else {
                binding.column = true
            }

            return binding
        },
    },
    created () {
        this.init();
    },
    watch: {
        userEmail (userEmail) {
            if (userEmail) {
                this.loading.user = true;
                this.loading.questions = true;
                this.notFound = false;
                this.$unbind('user');
                this.init();
            }
        }
    },
    methods: {
        bindQuestions () {
            const questionRef = Firestore.collection('questions')
                .where('author', '==', this.userEmail)
                .orderBy("date", 'desc');

            /* Download questions and subscribe to real time updates */
            this.$bind('questions', questionRef).then(() => {
                /* Once downloaded, start to build filter options */
                this.loading.questions = false;
            })
        },
        init () {
            const userRef = Firestore.collection('users').doc(this.userEmail);
            this.$bind('user', userRef).then(user => {
                this.loading.user = false;
                if (Object.entries(user).length === 0 && user.constructor === Object) {
                    this.notFound = true;
                    return;
                }

                /* Save it to Vuex, avoid reload on next time */
                this.$store.commit('users/addUser', user);

                this.bindQuestions();
            })
        }
    }
}
</script>