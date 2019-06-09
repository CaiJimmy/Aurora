<template>
    <v-container>
        <v-layout row
            wrap
            justify-space-between>

            <v-flex sm12
                md3
                lg3
                order-xs1
                order-sm1
                order-md2>
                <userCard :user="currentUser"
                    :withHeaderImage="true"
                    class="elevation-1"
                    :background="'#fff'">
                    <template slot="actions">
                        <v-btn text
                            color="primary"
                            v-on:click="$router.push({ path: '/user/' + currentUser.email})">Perfil</v-btn>
                        <v-btn text
                            color="secondary"
                            v-if="currentUser.isAdmin"
                            to="/a/">Panel de control</v-btn>
                        <v-btn text
                            color="warning"
                            v-on:click="signOut($route, $router)">Cerrar sesión</v-btn>
                    </template>
                </userCard>
            </v-flex>

            <v-flex sm12
                md8
                lg8
                order-xs2
                order-sm2
                order-md1>
                <taxonomy></taxonomy>
            </v-flex>

        </v-layout>
    </v-container>
</template>
<script>
import userCard from '@/components/UserCard.vue';
import taxonomy from '@/components/Taxonomy.vue';
import signOut from '@/utils/signOut';

export default {
    name: 'Home',
    metaInfo: {
        title: 'Inicio'
    },
    components: {
        userCard,
        taxonomy
    },
    methods: {
        signOut
    }
}
</script>
