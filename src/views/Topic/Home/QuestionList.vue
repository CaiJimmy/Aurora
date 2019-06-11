<template>
    <div class="questionList">

        <!-- New Questions Section -->
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

        <!-- Display loader while topic data is initializing -->
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

            <!-- Loop though questionList and display -->
            <template v-if="questions.length">
                <QuestionCard v-for="question in questionList"
                    :key="question.id"
                    :question="question"
                    :editCallback="handleQuestionChange" />

                <v-banner single-line>
                    Mostrando {{ paginationInterval }} resultados de {{ questions.length }}
                    <template #actions>
                        <v-pagination v-model="currentPage"
                            :length="paginationLength"
                            :total-visible="7"
                            @input="handlePagination"
                            :disabled="topicStore.loading"></v-pagination>
                    </template>
                </v-banner>
            </template>

            <!-- If there's no questions, neither new questions, then display an alert -->
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
        /*
            Change currentPage to topicStore's currentPage
            This doesn't make sense now, as `this.paging.currentPage` is always 1.
            It might be necessary to store current page to store in the future.
        */

        this.currentPage = this.paging.currentPage;
    },
    computed: {
        paging () {
            /*
                Merge topicStore.paging with config.topic.question_per_page
            */

            return {
                ...this.topicStore.paging,
                question_per_page: this.config.topic.question_per_page
            }
        },
        paginationInterval () {
            /*
                Calculate the interval of questions displayed
            */

            let start = (this.currentPage - 1) * this.paging.question_per_page,
                end = (this.currentPage) * this.paging.question_per_page

            if (end > this.questions.length) {
                end = this.questions.length
            }

            return `${start} - ${end}`;
        },
        paginationLength () {
            /*
                Calculate number of pages available.
                The Math.ceil() function method always **rounds a number up** to the next largest whole number or integer.
            */

            return Math.ceil(this.questions.length / this.paging.question_per_page);
        },
        questionList () {
            /*
                Slice question list into different pages.
            */

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
        handleQuestionChange (data) {
            /*
                Due to the fact that I loaded old questions using .get(), 
                they will not be updated automatically as they are not subscribed to realtime update.
                So I came up with this method that modify question data locally.
                It is passed as a callback to QuestionCard, 
                and run after doing modifications to question, like editing, moving or deleting.
            */

            let type = data.type,   /* Indicates which type of action has done to the question: 'delete', 'move' or 'edit */
                index = -1;

            if (!type) {
                return;
            }

            if (data.question) {
                index = this.questions.findIndex((question) => question.id == data.question.id);
            }

            switch (type) {
                case 'edit':
                    /* Replace old question data with new one, passed as parameter `data.question` */

                    if (index > -1) {
                        this.$store.commit(`topic-${this.topicId}/editQuestion`, {
                            index: index,
                            questionData: data.question
                        })
                    };

                    break;
                case 'delete':
                case 'move':
                    /* Remove question from `questions` array if it has been moved or deleted */
                    if (index > -1) {
                        this.$store.commit(`topic-${this.topicId}/deleteQuestion`, {
                            index: index
                        })
                    }
            }
        },
        handlePagination (currentPage) {
            /*
                When pagination is clicked, request new page
            */

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
