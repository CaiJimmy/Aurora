<template>
    <currentUserCard :user="auth.currentUser"></currentUserCard>
</template>
<script>
import currentUserCard from '@/components/CurrentUserCard.vue';
export default {
    name: 'Home',
    components:{
        currentUserCard
    }
}
</script>
