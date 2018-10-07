<template>
    <v-container>
        <currentUserCard :user="auth.currentUser"></currentUserCard>
        <searchUser></searchUser>
    </v-container>
</template>
<script>
import currentUserCard from '@/components/CurrentUserCard.vue';
import searchUser from '@/components/SearchUser.vue';

export default {
    name: 'Home',
    components: {
        currentUserCard,
        searchUser
    }
}
</script>
