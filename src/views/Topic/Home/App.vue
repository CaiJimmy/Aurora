<template>
    <v-layout wrap
        v-bind="binding">
        <v-flex xs12
            md3
            class="sidebar">
            <Sidebar :topic="topic" />
        </v-flex>

        <v-flex xs12
            md9
            :class="{'pl-5': $vuetify.breakpoint.mdAndUp}">
            <FormWrapper :topicId="topicId"
                v-if="!isTopicArchived" />
            <QuestionList :topic="topic"
                :topicId="topicId" />
        </v-flex>
    </v-layout>
</template>

<script>
import QuestionList from './QuestionList.vue';
import Sidebar from './Sidebar.vue';
import FormWrapper from './FormWrapper.vue';

export default {
    name: "TopicPage-Home",
    props: {
        topic: Object,
        topicId: String
    },
    components: {
        QuestionList,
        Sidebar,
        FormWrapper
    },
    computed: {
        isTopicArchived () {
            return this.topic.status == 'archived';
        },
        binding () {
            const binding = {}

            if (this.$vuetify.breakpoint.mdAndUp) {
                binding.row = true
            }
            else {
                binding.column = true
            }

            return binding
        },
    }
}
</script>
<style lang="scss" scoped>
.sidebar {
    margin-bottom: 20px;
}
</style>
