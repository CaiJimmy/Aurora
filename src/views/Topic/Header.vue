<template>
    <header class="topicHeader elevation-1">
        <div class="topicHeader--background"
            v-if="topic.config.background.url"
            :style="{ background: `url(${topic.config.background.url})`}"></div>

        <div class="topicHeader--color"
            v-if="topic.config.background.url"
            :style="{ background: `linear-gradient(0deg, ${topic.config.background.color.Vibrant} 0%, ${topic.config.background.color.Muted} 100%)`}"></div>
        <div class="topicHeader--meta">
            <span class="overline mb-3">{{ categoryName }}</span>
            <h1 class="font-weight-lighter">{{ topic.name }}</h1>
            <h2 class="font-weight-thin">{{ topic.description }}</h2>
        </div>

        <template v-if="isAdmin">
            <template v-if="$route.path == `/t/${topic.id}`">
                <v-btn class="settingsButton"
                    text
                    dark
                    outlined
                    :to="`/t/${topic.id}/settings`">Editar</v-btn>
            </template>

            <template v-else-if="$route.path == `/t/${topic.id}/settings`">
                <v-btn class="settingsButton"
                    text
                    dark
                    outlined
                    :to="`/t/${topic.id}`">Volver</v-btn>
            </template>
        </template>
    </header>
</template>
<script>
import userUtil from '@/utils/user';
import { getCategoryById } from '@/utils/taxonomy';

export default {
    name: "TopicHeader",
    props: {
        topic: Object
    },
    computed: {
        isAdmin () {
            return userUtil(this.currentUser).isAdmin();
        },
        categoryName () {
            return getCategoryById(this.topic.parent, this.$store.state.taxonomy.taxonomies).name;
        }
    }
}
</script>
<style lang="scss" scoped>
.topicHeader {
    min-height: 300px;
    position: relative;
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 30px;

    @media (max-width: 960px) {
        min-height: 150px;
        .topicHeader--meta {
            h1 {
                font-size: 1.25em;
            }
        }
    }

    .topicHeader--background,
    .topicHeader--color {
        height: 100%;
        width: 100%;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
    }
    .topicHeader--background {
        background-position: center center !important;
        background-size: cover !important;
        transition: all 0.5s ease;
    }

    .topicHeader--color {
        opacity: 0.9;
        transition: opacity 0.5s ease;
    }

    .topicHeader--meta {
        z-index: 1;
        padding: 100px 30px 80px 30px;
        color: #fff;
        font-weight: lighter;
        h1 {
            font-size: 2em;
        }
    }

    .settingsButton {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 1;
    }
}
</style>
