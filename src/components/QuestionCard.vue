<template>
    <div class="questionCard"
        :style="cardStyle">
        <QuestionForm v-if="editing"
            :questionData="question"
            :callback="formCallback"
            mode="edit" />
        <v-card :loading="question.loading"
            v-else>
            <template v-if="!question.loading">

                <v-card-title v-if="shouldDisplayAuthorData || profilePage">
                    <v-list-item class="grow">
                        <template v-if="profilePage">

                            <v-list-item-icon v-if="topicData.status === 'deleted'">
                                <v-icon>error</v-icon>
                            </v-list-item-icon>

                            <v-list-item-avatar v-else>
                                <v-img :src="topicData.config.background.url"></v-img>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ topicData.name }}
                                    <strong v-if="isTopicArchived">
                                        (Archivado)
                                    </strong>
                                </v-list-item-title>

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
                        </template>

                        <template v-else-if="shouldDisplayAuthorData">
                            <v-list-item-avatar color="grey darken-3">
                                <v-img :src="getUserData(question.author).photoURL"></v-img>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>
                                    <router-link v-if="profileLink"
                                        :to="`/user/${question.author}?topic=${question.topic}`"
                                        target="_blank">
                                        {{ getUserData(question.author).displayName }}
                                    </router-link>

                                    <template v-else>
                                        {{ getUserData(question.author).displayName }}
                                    </template>
                                </v-list-item-title>

                                <v-list-item-subtitle v-if="question.date">
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
                        </template>

                        <v-layout align-center
                            justify-end
                            v-if="question.status == 0">
                            <v-icon class="mr-1">visibility_off</v-icon>
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
                <v-card-actions v-if="shouldDisplayActions">
                    <v-spacer></v-spacer>
                    <v-btn text
                        v-on:click="startEdit()">Editar</v-btn>
                </v-card-actions>
            </template>
        </v-card>
    </div>
</template>
<script>
import Vue from 'vue'
import VueTimeago from 'vue-timeago'
import getUserData from '@/utils/getUserData/'
import { getTopicById } from '@/utils/taxonomy/'

import userUtil from '@/utils/user';

Vue.use(VueTimeago, {
    name: 'Timeago'
})

import QuestionForm from './Form.vue';

export default {
    name: "QuestionCard",
    props: {
        question: Object,
        editCallback: Function,
        profilePage: Boolean,
        profileLink: Boolean,
        editable: {
            type: Boolean,
            default: true
        }
    },
    components: {
        QuestionForm
    },
    data () {
        return {
            editing: false
        }
    },
    computed: {
        isTopicArchived () {
            if (!this.topicData) return;
            return this.topicData.status == 'archived';
        },
        topicData () {
            const topicId = this.question.topic,
                topicData = getTopicById(topicId, this.$store.state.taxonomy.taxonomies);

            if (!topicData) {
                return {
                    status: 'deleted',
                    name: 'Tema eliminado'
                }
            }

            return topicData;
        },
        cardStyle () {
            const style = {};

            if (this.question.status == 0) {
                style.opacity = '0.6';
            }

            return style;
        },
        shouldDisplayAuthorData () {
            const displayAuthorData = this.config.topic.displayAuthorData,
                isAdmin = userUtil(this.currentUser).isAdmin();

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
        shouldDisplayActions () {
            if (!this.editCallback || !this.editable) {
                return;
            }

            const questionEditable = this.config.topic.questionEditable,
                isAdmin = userUtil(this.currentUser).isAdmin();

            if (this.isTopicArchived) {
                /// If topic is archived, don't display edit option
                return false;
            }

            if (!isAdmin) {
                /*
                    If current user is not admin, it depends on site config
                    If config.topic.questionEditable == true, and current user is the author, then show the edit button
                */
                return questionEditable && this.question.author == this.currentUser.email;
            }
            else {
                /*
                    If current user is admin, display always the edit button
                */
                return true;
            }
        }
    },
    methods: {
        getUserData,
        formCallback (data) {
            this.editing = false;
            this.editCallback(data);
        },
        startEdit () {
            this.editing = true;
        }
    }
}
</script>

<style lang="scss" scoped>
.v-list-item {
    user-select: text !important;
}
</style>
