<template>
    <div class="questionList">
        <section class="newQuestionsList"
            v-if="newQuestions.length">
            <QuestionCard v-for="question in newQuestions"
                :key="question.id"
                :question="question" />
            <div v-if="newQuestions.length && questions.length"
                class="separator">
                <span class="elevation-1">Preguntas Antiguas</span>
            </div>
        </section>

        <QuestionCard v-for="question in questions"
            :key="question.id"
            :question="question" />
    </div>
</template>
<script>
import QuestionCard from './QuestionCard.vue';
export default {
    name: "QuestionList",
    props: {
        topicId: String,
        topic: Object
    },
    components: {
        QuestionCard
    },
    computed: {
        topicStore () {
            return this.$store.state[`topic-${this.topicId}`]
        },
        newQuestions () {
            return this.topicStore.newQuestions
        },
        questions () {
            return this.topicStore.questions
        }
    }
}
</script>
<style lang="scss" scoped>
.questionList {
    .v-list-item {
        user-select: text !important; /// Overite Vuetify's default style, which doesn't allow text to be selected
    }

    .questionCard {
        margin-bottom: 20px;
    }
}

.separator {
    text-align: center;
    margin: 20px auto;
    position: relative;
    span {
        background-color: #fff;
        padding: 10px 15px;
        font-weight: bold;
        color: #999;
    }
    &:before {
        content: "";
        width: 100%;
        height: 1px;
        background: #e1e1e1;
        display: block;
        position: absolute;
        top: 50%;
        z-index: -1;
        transform: translateY(-50%);
    }
}
</style>
