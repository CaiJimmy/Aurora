<template>
    <div>
        <!-- Profile header start -->
        <header class="userProfile--header elevation-1"
            :style="{'background': config.theme.primary}">
        </header>
        <userCard :user="user"
            class="userProfile--card"></userCard>
        <!-- Profile header end -->
    </div>
</template>

<script>
import userCard from '@/components/UserCard.vue';

export default {
    name: "ProfileHeader",
    props: {
        user: Object
    },
    components: {
        userCard
    }
}
</script>

<style lang="scss" scoped>
.userProfile--header {
    padding: 80px 0;
    border-radius: 5px;
}
.userProfile--card {
    margin-top: -70px;
}
</style>

