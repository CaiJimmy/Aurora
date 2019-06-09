<template>
    <v-layout fill-height>
        <v-flex md3
            shrink
            class="sidebar">
            <Sidebar :topic="topic" />
        </v-flex>

        <v-flex md8>

        </v-flex>
    </v-layout>
</template>

<script>
import QuestionList from './QuestionList.vue';
import Sidebar from './Sidebar.vue';

export default {
    name: "TopicPage-Home",
    props: {
        topic: Object
    },
    components: {
        QuestionList,
        Sidebar
    }
}
</script>
