<template>
    <div>
        <QuestionFilter :questions="questions" />
    </div>
</template>

<script>
import QuestionFilter from './Widgets/Filter.vue';

export default {
    name: "Profile-Sidebar",
    props: {
        user: Object,
        questions: Array
    },
    components: {
        QuestionFilter
    }
}
</script>
<style lang="scss" scoped>
.v-card {
    margin-bottom: 20px;
}
</style>
