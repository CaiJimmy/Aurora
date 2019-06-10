<template>
    <div class="questionList">
        <v-card v-for="question in topicStore.questions"
            :key="question.id">

            <v-card-title>
                <v-list-item class="grow">
                    <v-list-item-avatar color="grey darken-3">
                        <v-img class="elevation-6"
                            :src="getUserData(question.author).photoURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ getUserData(question.author).displayName }}</v-list-item-title>
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
        }
    }
}
</script>
