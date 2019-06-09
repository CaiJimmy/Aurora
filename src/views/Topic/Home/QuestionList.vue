<template>
    <div class="questionList">
        <v-card v-for="question in topicStore.questions"
            :key="question.id">

            <v-card-title>{{ question.title }}</v-card-title>

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
    }
}
</script>
