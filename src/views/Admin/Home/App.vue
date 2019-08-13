<template>
    <v-row>
        <v-col md="8"
            sm="12">
            <v-alert prominent
                outlined
                type="info">
                Bienvenido al panel del control. Para comenzar, selecciona un item del menu de la izquierda.
            </v-alert>
        </v-col>
        <v-col md="4"
            sm="12">
            <AdminList />
        </v-col>
    </v-row>
</template>
<script>
import AdminList from './Widgets/AdminList.vue';

export default {
    name: 'AdminPanelHome',
    metaInfo: {
        title: 'Administrar'
    },
    components: {
        AdminList
    }
}
</script>
