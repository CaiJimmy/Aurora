<template>
    <v-card :loading="loading">
        <v-toolbar color="primary"
            dark>
            <v-toolbar-title>Administradores</v-toolbar-title>
        </v-toolbar>
        <v-list>
            <v-list-item two-line
                v-for="admin in admins"
                :key="admin.id"
                :to="`/user/${admin.id}`">
                <v-list-item-icon>
                    <v-icon v-if="admin.id == currentUser.id"
                        color="primary">star</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title v-text="admin.displayName"></v-list-item-title>
                    <v-list-item-subtitle v-text="admin.id"></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-avatar>
                    <v-img :src="admin.photoURL"></v-img>
                </v-list-item-avatar>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
import { Firestore } from '@/firebase/firestore';

import { firestorePlugin } from 'vuefire'
import Vue from 'vue'

Vue.use(firestorePlugin)

export default {
    name: 'AdminList',
    data () {
        return {
            admins: [],
            loading: true
        }
    },
    created () {
        const adminsRef = Firestore.collection('users').where('role', '==', 'administrator');
        this.$bind('admins', adminsRef).then(() => {
            this.loading = false;
        })
    }
}
</script>

<style>
</style>