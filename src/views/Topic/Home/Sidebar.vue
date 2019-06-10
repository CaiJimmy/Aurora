<template>
    <TopicStat :topic="topic" />
</template>

<script>
import TopicStat from './Widgets/TopicStat.vue';

export default {
    name: "TopicPage-Sidebar",
    props: {
        topic: Object
    },
    components: {
        TopicStat
    }
}
</script>
