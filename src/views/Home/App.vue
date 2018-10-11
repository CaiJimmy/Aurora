<template>
    <v-container>
        <currentUserCard :user="currentUser"></currentUserCard>
        <searchUser></searchUser>
        <taxonomy></taxonomy>
    </v-container>
</template>
<script>
import currentUserCard from '@/components/CurrentUserCard.vue';
import searchUser from '@/components/SearchUser.vue';
import taxonomy from '@/components/Taxonomy.vue';

export default {
    name: 'Home',
    components: {
        currentUserCard,
        searchUser,
        taxonomy
    }
}
</script>
