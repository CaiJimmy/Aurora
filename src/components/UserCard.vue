<template>
    <div class="userCard"
        :class="{'withHeaderImage': withHeaderImage}"
        :style="{'background': background}">
        <div class="userCard--headerImage"
            :style="headerImage"></div>
        <figure>
            <img :src="user.photoURL"
                :alt="user.displayName">
        </figure>
        <div class="userCard--meta">
            <h1>{{ user.displayName }}</h1>
            <h2>{{ user.email }} |
                <strong>{{ userRole }}</strong>
            </h2>
            <h3 v-if="user.lastLogin"
                class="caption">Last Login: <strong>{{ user.lastLogin.toDate() }}</strong></h3>
        </div>
        <div class="userCard--actions"
            v-if="$slots.actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        user: Object,
        withHeaderImage: Boolean,
        background: String
    },
    computed: {
        headerImage () {
            return {
                "background-image": `url(${this.config.userCard.background})`
            }
        },
        userRole () {
            if (this.user.isAdmin) {
                return 'Admin'
            }
            else {
                return 'Alumno'
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.userCard {
  &.withHeaderImage {
    figure {
      margin: 1em auto;
      margin-top: -60px;
      position: relative;
    }

    .userCard--headerImage {
      display: block;
    }
  }

  header {
    position: relative;
    margin-bottom: 50px;
  }

  .userCard--headerImage {
    display: none;
    width: 100%;
    height: 150px;
    position: relative;
    overflow: hidden;
    background-size: cover !important;
    background-position: top center !important;
    background-repeat: no-repeat !important;
  }

  figure {
    margin: 1em auto;
    height: 120px;
    width: 120px;

    img {
      border-radius: 100%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      border: 2px solid #fff;
      width: 100%;
    }
  }

  .userCard--meta {
    padding: 5px 15px;
    text-align: center;

    h1 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    h2 {
      color: #999;
      font-size: 15px;
      font-weight: normal;
      margin-bottom: 10px;
    }
  }
  .userCard--actions {
    padding: 1em 0;
    text-align: center;
  }
}
</style>