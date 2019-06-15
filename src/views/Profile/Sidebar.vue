<template>
    <div>
        <UserManager :user="user"
            v-if="isAdmin" />
        <QuestionFilter :questions="questions" />
    </div>
</template>

<script>
import QuestionFilter from './Widgets/Filter.vue';
import UserManager from './Widgets/UserManager.vue';

import userUtil from '@/utils/user';

export default {
    name: "Profile-Sidebar",
    props: {
        user: Object,
        questions: Array
    },
    components: {
        QuestionFilter,
        UserManager
    },
    computed: {
        isAdmin () {
            return userUtil(this.currentUser).isAdmin();
        }
    }
}
</script>
<style lang="scss" scoped>
.v-card {
    margin-bottom: 20px;
}
</style>
