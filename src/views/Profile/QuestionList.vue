<template>
    <div class="questionList">

        <v-layout v-if="loading"
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
                    :profilePage="true"
                    :editCallback="editCallback" />

                <div class="elevation-1">
                    <v-banner>
                        Mostrando {{ paginationInterval }} resultados de {{ filteredQuestions.length }}
                    </v-banner>
                    <v-toolbar flat>
                        <v-pagination v-model="paging.currentPage"
                            :length="paginationLength"
                            :total-visible="6"></v-pagination>
                    </v-toolbar>
                </div>
            </template>

            <!-- If there's no questions, then display an alert -->
            <v-alert v-else
                text
                prominent
                type="info"
                icon="question_answer">
                El usuario no ha publicado ninguna pregunta
            </v-alert>
        </template>

    </div>
</template>
<script>
import QuestionCard from '@/components/QuestionCard.vue';

export default {
    name: "QuestionList",
    props: {
        user: Object,
        questions: Array,
        loading: Boolean
    },
    components: {
        QuestionCard
    },
    data () {
        return {
            paging: {
                loaded: []   /* Loaded pages, to avoid querying data again */,
                currentPage: 1,
            }
        }
    },
    watch: {
        selectedTopic () {
            /// Reset pagination when a topic is selected
            this.paging.currentPage = 1;
        }
    },
    computed: {
        filteredQuestions () {
            /*
                Build filtered question array
            */
            if (this.selectedTopic) {
                return this.questions.filter((question) => {
                    return question.topic == this.selectedTopic
                })
            } else {
                return this.questions;
            }
        },
        selectedTopic () {
            return this.$route.query.topic;
        },
        question_per_page () {
            return this.config.topic.question_per_page;
        },
        paginationInterval () {
            /*
                Calculate the interval of questions displayed
            */

            let start = (this.paging.currentPage - 1) * this.question_per_page,
                end = (this.paging.currentPage) * this.question_per_page

            if (end > this.filteredQuestions.length) {
                end = this.filteredQuestions.length
            }

            return `${start} - ${end}`;
        },
        paginationLength () {
            /*
                Calculate number of pages available.
                The Math.ceil() function method always **rounds a number up** to the next largest whole number or integer.
            */

            return Math.ceil(this.filteredQuestions.length / this.question_per_page);
        },
        questionList () {
            /*
                Slice question list into different pages.
            */

            return this.filteredQuestions.slice(
                (this.paging.currentPage - 1) * this.question_per_page,
                (this.paging.currentPage) * this.question_per_page,
            )
        }
    },
    methods: {
        editCallback () {
            return true;
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
