<template>
    <v-layout justify-space-between
        v-bind="binding">
        <v-flex xs12
            md3
            class="sidebar">
            <Sidebar :topic="topic" />
        </v-flex>

        <v-flex xs12 md9>
            <FormWrapper :topicId="topicId" />
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
.row {
    .sidebar {
        margin-right: 20px;
    }
}
.sidebar {
    margin-bottom: 20px;
}
</style>
