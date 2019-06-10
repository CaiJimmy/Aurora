<template>
    <div>
        <TopicStat :topic="topic" />
        <UserStat :topic="topic" />
    </div>
</template>

<script>
import TopicStat from './Widgets/TopicStat.vue';
import UserStat from './Widgets/UserStat.vue';

export default {
    name: "TopicPage-Sidebar",
    props: {
        topic: Object
    },
    components: {
        TopicStat,
        UserStat
    }
}
</script>
<style lang="scss" scoped>
.v-card:not(:last-child) {
    margin-bottom: 20px;
}
</style>
