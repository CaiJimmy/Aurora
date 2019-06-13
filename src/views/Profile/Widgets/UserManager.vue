<template>
    <v-card :loading="loading">
        <v-card-title>Control del usuario</v-card-title>
        <v-card-text>
            <v-select :items="availableRoles"
                v-model="userRole"
                label="Role del usuario"></v-select>
        </v-card-text>
        <v-card-actions>
            <v-btn text
                :loading="loading"
                :disabled="loading"
                v-on:click="saveRole()">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { Firestore } from '@/firebase/firestore';

export default {
    name: "UserManager",
    props: {
        user: Object
    },
    data () {
        return {
            loading: false,
            userRole: 1,
            availableRoles: [
                {
                    text: "Alumno",
                    value: 'student'
                },
                {
                    text: "Administrador",
                    value: 'administrator'
                }
            ]
        }
    },
    created () {
        this.userRole = this.user.role;
    },
    methods: {
        saveRole () {
            if (this.userRole == null) return;

            this.loading = true;

            Firestore.collection('users').doc(this.user.id).set({
                role: this.userRole
            }, { merge: true }).then(() => {
                this.loading = false;
            })
        }
    }
}
</script>

<style>
</style>
