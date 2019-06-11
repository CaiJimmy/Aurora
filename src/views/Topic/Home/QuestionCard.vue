<template>
    <v-card :loading="!questionReady(question)"
        class="questionCard">
        <template v-if="questionReady(question)">
            <v-card-title v-if="shouldDisplayAuthorData">
                <v-list-item class="grow">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img :src="getUserData(question.author).photoURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ getUserData(question.author).displayName }}</v-list-item-title>

                        <v-list-item-subtitle>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">

                                    <span v-on="on">
                                        <timeago :datetime="question.date.toDate()"
                                            locale="es-ES"></timeago>
                                    </span>

                                </template>
                                <span>{{ question.date.toDate() }}</span>
                            </v-tooltip>
                        </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-layout align-center
                        justify-end>
                        <v-icon class="mr-1">mdi-share-variant</v-icon>
                    </v-layout>
                </v-list-item>
            </v-card-title>

            <v-card-text>
                <span class="body-1 black--text pl-3 pr-3">
                    {{ question.title }}
                </span>
                <v-list>
                    <v-list-item v-for="(option,index) in question.options"
                        :key="index">

                        <v-list-item-content>
                            <v-list-item-title><strong>{{ (index + 10).toString(36).toUpperCase() }}</strong>. {{ option }}</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-icon v-if="index == question.correctAnswer">
                            <v-icon>star</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </template>
    </v-card>
</template>
<script>
import Vue from 'vue'
import VueTimeago from 'vue-timeago'

Vue.use(VueTimeago, {
    name: 'Timeago'
})

export default {
    name: "QuestionList",
    props: {
        question: Object
    },
    computed: {
        shouldDisplayAuthorData () {
            const displayAuthorData = this.config.topic.displayAuthorData,
                isAdmin = this.currentUser.isAdmin;

            if (!isAdmin && !displayAuthorData) {
                /*
                    If current user is not admin, and displayAuthorData is false, then only show author data when it's user's own publication
                */
                return this.question.author == this.currentUser.email;
            }
            else {
                /*
                    Otherwise, start loading user data
                */
                return this.getUserData(this.question.author)
            }
        },
    },
    methods: {
        getUserData (userEmail) {
            if (!userEmail) {
                return;
            }

            /// Start fetching in case it has not been triggered, like when it's a new question
            if (!this.$store.state.users.hasOwnProperty(userEmail)) {
                this.$store.dispatch('users/requestUser', userEmail);
            }

            return this.$store.state.users[userEmail];
        },
        questionReady (question) {
            if (this.currentUser.isAdmin) {
                return !question.loading && this.$store.state.users.hasOwnProperty(question.author);
            }
            else {
                return !question.loading;
            }
        }
    }
}
</script>

<style>
</style>
