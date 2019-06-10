<template>
    <div class="questionList">
        <v-card v-for="question in topicStore.questions"
            :key="question.id"
            :loading="!questionReady(question)">

            <v-card-title v-if="getUserData(question.author)">
                <v-list-item class="grow">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6"
                            :src="getUserData(question.author).photoURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ getUserData(question.author).displayName }}</v-list-item-title>
                        
                        <v-list-item-subtitle>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">

                                    <span v-on="on">
                                        <timeago :datetime="question.date.toDate()"></timeago>
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
        </v-card>
    </div>
</template>
<script>
import Vue from 'vue'
import VueTimeago from 'vue-timeago'

Vue.use(VueTimeago, {
    name: 'Timeago', // Component name, `Timeago` by default
    locale: 'es-ES',
    locales: {
        'es-ES': [
            "ahora", ["hace %s segundo", "hace %s segundos"],
            ["hace %s minuto", "hace %s minutos"],
            ["hace %s hora", "hace %s horas"],
            ["hace %s día", "hace %s días"],
            ["hace %s semana", "hace %s semanas"],
            ["hace %s mes", "hace %s meses"],
            ["hace %s año", "hace %s años"]
        ]
    }
})

export default {
    name: "QuestionList",
    props: {
        topicId: String,
        topic: Object
    },
    computed: {
        topicStore () {
            return this.$store.state[`topic-${this.topicId}`]
        }
    },
    methods: {
        getUserData (userEmail) {
            return this.$store.state.users[userEmail];
        },
        questionReady (question) {
            if (this.currentUser.isAdmin) {
                return this.$store.state.users.hasOwnProperty(question.author);
            }
            else {
                return true;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.questionList {
    .v-list-item {
        user-select: text !important; /// Overite Vuetify's default style, which doesn't allow text to be selected
    }
}
</style>
