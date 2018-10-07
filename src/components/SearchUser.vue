<template>
    <div>
        <v-text-field v-model="keyword"
            append-icon="search"
            :loading="loading"
            solo
            clear-icon="cancel"
            clearable
            label="Search user..."
            type="text"
            @click:append="doSearch"
            v-on:keyup.enter="doSearch"
            @click:clear="clearKeyword"></v-text-field>
        <v-card v-if="results.length">
            <v-list>
                <v-list-tile v-for="user in results"
                    :key="user.email"
                    avatar
                    @click="$router.push('/user/' + user.email)">
                    <v-list-tile-content>
                        <v-list-tile-title>{{ user.displayName }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ user.email }}</v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-avatar>
                        <img :src="user.photoURL">
                    </v-list-tile-avatar>
                </v-list-tile>
            </v-list>
        </v-card>
    </div>
</template>
<script>
import firestoreSearch from '@/utils/firestoreSearch';
import { Firestore } from '@/firebase/firestore';

export default {
    name: 'SearchUser',
    data () {
        return {
            keyword: null,
            results: [],
            loading: false
        }
    },
    methods: {
        clearKeyword () {
            this.keyword = null
        },
        doSearch () {
            if (!this.keyword.length) {
                return;
            }

            this.loading = true;
            this.results = [];

            const firebaseRef = Firestore.collection('users');
            firestoreSearch(firebaseRef, 'displayName', this.keyword.toLocaleUpperCase()).get().then(snapshot => {
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
