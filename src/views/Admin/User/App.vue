<template>
    <div>
        <v-text-field v-model="keyword"
            append-icon="search"
            :loading="loading"
            solo
            clear-icon="cancel"
            clearable
            label="Buscar a usuario..."
            type="text"
            @click:append="searchEvent"
            v-on:keyup.enter="searchEvent"
            @click:clear="clearKeyword"></v-text-field>

        <v-card v-if="results.length">
            <v-alert type="info">
                Se ha encontrado {{ results.length }} usuarios relacionados con <code>{{ lastKeyword }}</code>
            </v-alert>
            <v-list>
                <v-list-item v-for="user in results"
                    :key="user.email"
                    @click="$router.push('/user/' + user.email)">
                    <v-list-item-content>
                        <v-list-item-title>{{ user.displayName }}</v-list-item-title>
                        <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar>
                        <img :src="user.photoURL">
                    </v-list-item-avatar>
                </v-list-item>
            </v-list>
        </v-card>

        <v-alert v-if="!loading && searched && !results.length"
            type="info">
            No se ha encontrado ningún usuario relacionado con <code>{{ lastKeyword }}</code>
        </v-alert>
    </div>
</template>
<script>
import firestoreSearch from '@/utils/firestoreSearch';
import { Firestore } from '@/firebase/firestore';

export default {
    name: 'AdminUser',
    metaInfo: {
        title: 'Usuarios'
    },
    data () {
        return {
            keyword: null,
            results: [],
            loading: false,
            searched: false,
            lastKeyword: null
        }
    },
    created () {
        this.handleRouteChange();
    },
    watch: {
        "$route.query.keyword" () {
            this.handleRouteChange();
        }
    },
    methods: {
        handleRouteChange () {
            this.keyword = this.$route.query.keyword;
            if (this.isKeywordValid()) {
                this.doSearch();
            }
        },
        clearKeyword () {
            this.keyword = null
        },
        isKeywordValid () {
            return this.keyword && this.keyword.length;
        },
        searchEvent () {
            if (this.isKeywordValid()) {
                this.$router.push({
                    query: {
                        keyword: this.keyword
                    }
                })
            }
        },
        doSearch () {
            this.loading = true;
            this.results = [];
            this.lastKeyword = this.keyword;

            const firebaseRef = Firestore.collection('users');
            firestoreSearch(firebaseRef, 'displayName', this.keyword.toLocaleUpperCase()).get().then(snapshot => {
                this.searched = true;

                if (snapshot.empty) {
                    this.loading = false;
                    return;
                }

                snapshot.forEach(user => {
                    const userData = {
                        'email': user.id,
                        ...user.data()
                    };
                    this.results.push(userData);
                    this.$store.commit('users/addUser', userData);
                });

                this.loading = false;
            })
        }
    }
}
</script>

