<template>
    <router-link :to="`/t/${topic.id}`"
        class="taxonomyList--item elevation-1"
        v-bind:class="topicClass">
        <div class="taxonomyList--item-background"
            v-if="topic.config.background.url"
            :style="{ background: `url(${topic.config.background.url})`}"></div>

        <div class="taxonomyList--item-color"
            v-if="topic.config.background.url"
            :style="{ background: `linear-gradient(0deg, ${topic.config.background.color.Vibrant} 0%, ${topic.config.background.color.Muted} 100%)`}"></div>

        <div class="taxonomyList--item-meta">
            <h1 class="font-weight-thin">{{ topic.name }}</h1>
        </div>
    </router-link>
</template>

<script>
export default {
    name: "TaxonomyTopic",
    props: {
        topic: {
            type: Object,
            required: true
        }
    },
    computed: {
        topicClass () {
            if (this.topic.status == 'archived') {
                return {
                    archived: true
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.taxonomyList--item {
    min-height: 200px;
    position: relative;
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    margin: 10px;
    flex-grow: 1;

    @media (max-width: 600px) {
        min-height: 100px;
    }

    @media (min-width: 600px) and (max-width: 960px) {
        min-height: 150px;
    }

    &:hover {
        .taxonomyList--item-color {
            opacity: 0.7;
        }
    }

    &.archived:before {
        content: "";
        background-image: -webkit-repeating-linear-gradient(
            -135deg,
            transparent,
            transparent 0.5625rem,
            rgba(255, 255, 255, 0.3) 0.5625rem,
            rgba(255, 255, 255, 0.3) 0.625rem
        );
        background-image: repeating-linear-gradient(
            -135deg,
            transparent,
            transparent 0.5625rem,
            rgba(255, 255, 255, 0.3) 0.5625rem,
            rgba(255, 255, 255, 0.3) 0.625rem
        );
        background-size: 0.88388348rem 0.88388348rem;
        bottom: -50%;
        left: -50%;
        pointer-events: none;
        position: absolute;
        right: -50%;
        top: -50%;
        transform: rotateZ(15deg);
        z-index: 1;
    }

    .taxonomyList--item-background,
    .taxonomyList--item-color {
        height: 100%;
        width: 100%;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
    }
    .taxonomyList--item-background {
        background-position: center center !important;
        background-size: cover !important;
        transition: all 0.5s ease;
    }

    .taxonomyList--item-color {
        opacity: 0.9;
        transition: opacity 0.5s ease;
    }

    .taxonomyList--item-meta {
        position: absolute;
        bottom: 0;
        padding: 20px;
        color: #fff;
        font-weight: lighter;

        @media (max-width: 600px) {
            padding: 15px;
        }

        h1 {
            font-size: 1.5em;

            @media (min-width: 600px) and (max-width: 960px) {
                font-size: 1.25em;
            }

            @media (max-width: 600px) {
                font-size: 1em;
            }
        }
    }
}
</style>
