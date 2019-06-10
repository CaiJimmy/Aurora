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

        <v-layout v-if="topicStore.loading"
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
            <template v-if="questions.length">
                <QuestionCard v-for="question in questionList"
                    :key="question.id"
                    :question="question" />

                <v-banner single-line>
                    Mostrando {{ paginationRange }} resultados de {{ questions.length }}
                    <template #actions>
                        <v-pagination v-model="currentPage"
                            :length="paginationLength"
                            :total-visible="7"
                            @input="handlePagination"
                            :disabled="topicStore.loading"></v-pagination>
                    </template>
                </v-banner>
            </template>

            <v-alert v-else-if="!newQuestions.length"
                text
                prominent
                type="info"
                icon="question_answer">
                Parece ser que no hay ninguna pregunta en este tema
            </v-alert>
        </template>
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
    data () {
        return {
            currentPage: 1,
        }
    },
    components: {
        QuestionCard
    },
    created () {
        this.currentPage = this.paging.currentPage;
    },
    computed: {
        paging () {
            return {
                ...this.topicStore.paging,
                question_per_page: this.config.topic.question_per_page
            }
        },
        paginationRange () {
            let start = (this.currentPage - 1) * this.paging.question_per_page,
                end = (this.currentPage) * this.paging.question_per_page

            if (end > this.questions.length) {
                end = this.questions.length
            }

            return `${start} - ${end}`;
        },
        paginationLength () {
            return Math.ceil(this.questions.length / this.paging.question_per_page);
        },
        questionList () {
            return this.questions.slice(
                (this.currentPage - 1) * this.paging.question_per_page,
                (this.currentPage) * this.paging.question_per_page,
            )
        },
        topicStore () {
            return this.$store.state[`topic-${this.topicId}`]
        },
        newQuestions () {
            return this.topicStore.newQuestions
        },
        questions () {
            return this.topicStore.questions
        }
    },
    methods: {
        handlePagination (currentPage) {
            this.$store.dispatch(`topic-${this.topicId}/onPageChange`, {
                toPage: currentPage
            })
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
