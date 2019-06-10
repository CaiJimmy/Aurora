<template>
    <v-card flat
        outlined>
        <v-progress-linear :value="progress_bar"></v-progress-linear>

        <v-card-text>
            <span>Preparar el examen</span> <br />
            <p class="text--primary mt-3">
                Para este tema, necesitas enviar {{ topic.config.requiredQuestions }} preguntas, llevas {{ userQuestions.length }}
            </p>
        </v-card-text>
    </v-card>
</template>

<script>
import { Firestore } from '@/firebase/firestore'
import { firestorePlugin } from 'vuefire'
import Vue from 'vue'

Vue.use(firestorePlugin)

export default {
    name: "UserStat",
    props: {
        topic: Object
    },
    data () {
        return {
            userQuestions: [],
            userQuestionsRef: null,
            loading: true,
            progress_bar: 0
        }
    },
    created () {
        const topicID = this.topic.id;
        this.userQuestionsRef = Firestore.collection('questions')
            .where('topic', '==', topicID)
            .where('author', '==', this.currentUser.email);

        this.$bind('userQuestions', this.userQuestionsRef).then(() => {
            this.loading = false;
        });
    },
    watch: {
        userQuestions () {
            this.renderQuestionProgressBar();
        },
        "topic.questionCount": function () {
            this.renderQuestionProgressBar();
        },
    },
    methods: {
        renderQuestionProgressBar () {
            if (this.topic.config.requiredQuestions) {
                let current = this.userQuestions.length,
                    total = this.topic.config.requiredQuestions;
                this.progress_bar = current / total * 100
            }
        },
    }
}
</script>