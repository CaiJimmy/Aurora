<template>
    <v-container>
        <v-layout row
            wrap
            justify-space-around>

            <v-flex sm12
                md4
                order-xs1
                order-sm1
                order-md2>
                <currentUserCard :user="currentUser"></currentUserCard>
                <searchUser></searchUser>
            </v-flex>

            <v-flex sm12
                md7
                order-xs2
                order-sm2
                order-md1>
                <taxonomy></taxonomy>
            </v-flex>

        </v-layout>
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
