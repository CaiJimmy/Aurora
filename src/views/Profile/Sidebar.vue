<template>
    <div>
        <QuestionFilter :questions="questions" />
        <UserManager :user="user" />
    </div>
</template>

<script>
import QuestionFilter from './Widgets/Filter.vue';
import UserManager from './Widgets/UserManager.vue';

export default {
    name: "Profile-Sidebar",
    props: {
        user: Object,
        questions: Array
    },
    components: {
        QuestionFilter,
        UserManager
    }
}
</script>
<style lang="scss" scoped>
.v-card {
    margin-bottom: 20px;
}
</style>
