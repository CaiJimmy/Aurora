<template>
    <div>
        <TopicStat :topic="topic"
            v-if="isAdmin" />
        <UserStat :topic="topic" />
    </div>
</template>

<script>
import TopicStat from './Widgets/TopicStat.vue';
import UserStat from './Widgets/UserStat.vue';

import userUtil from '@/utils/user';

export default {
    name: "TopicPage-Sidebar",
    props: {
        topic: Object
    },
    components: {
        TopicStat,
        UserStat
    },
    computed: {
        isAdmin () {
            return userUtil(this.currentUser).isAdmin();
        }
    }
}
</script>
<style lang="scss" scoped>
.v-card:not(:last-child) {
    margin-bottom: 20px;
}
</style>
