<template>
    <div>
        <v-layout align-center
            row
            class="questionFormWrapper elevation-1"
            v-if="!formExpanded"
            v-on:click="formExpanded = true">
            <v-flex shrink>
                <v-avatar size="36px">
                    <img :src="currentUser.photoURL">
                </v-avatar>
            </v-flex>
            <v-flex class="grey--text ml-4"
                ellipsis>
                Añadir una pregunta...
            </v-flex>
        </v-layout>
        <QuestionForm v-else
            :topicId="topicId"
            class="questionForm" />
    </div>
</template>

<script>
import QuestionForm from './Form.vue';

export default {
    name: "QuestionFormWrapper",
    props: {
        topicId: String
    },
    components: {
        QuestionForm
    },
    data () {
        return {
            formExpanded: false
        }
    }
}
</script>
<style lang="scss" scoped>
.questionFormWrapper {
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    margin-bottom: 20px;
    cursor: pointer;
}

.questionForm {
    margin-bottom: 20px;
}
</style>

