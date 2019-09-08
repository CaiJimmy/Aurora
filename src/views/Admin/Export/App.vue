<template>
    <v-card :loading="downloading">
        <v-list subheader two-line flat>
            <v-subheader>Contenidos a exportar</v-subheader>

            <v-list-item v-for="collection in exportableCollections" :key="collection.path">
                <v-list-item-action>
                    <v-checkbox
                        v-model="collectionToExport"
                        color="primary"
                        :value="collection.path"
                    ></v-checkbox>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title>{{ collection.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ collection.description }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                text
                color="primary"
                @click="exportData()"
                :disabled="!collectionToExport.length"
                :loading="downloading"
            >Exportar</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import { Firestore } from "@/firebase/firestore";

export default {
    name: "AdminExport",
    metaInfo: {
        title: "Exportar"
    },
    data() {
        return {
            collectionToExport: [],
            exportableCollections: [
                {
                    path: "questions",
                    name: "Preguntas",
                    description: "Las preguntas publicadas por los usuarios"
                },
                {
                    path: "taxonomy",
                    name: "Taxonomias",
                    description: "Datos de niveles y categorias"
                },
                {
                    path: "users",
                    name: "Usuarios",
                    description:
                        "Datos de usuarios: nombre, E-Mail, y foto de perfil"
                }
            ],
            downloading: false
        };
    },
    methods: {
        async downloadCollection(collectionPath) {
            return Firestore.collection(collectionPath)
                .get()
                .then(documentSnapshots => {
                    let collectionData = [];
                    documentSnapshots.forEach(doc => {
                        collectionData.push({
                            ...doc.data(),
                            id: doc.id
                        });
                    });
                    return collectionData;
                });
        },
        exportData() {
            this.downloading = true;
            const collectionToExport = this.collectionToExport;

            let exportedData = {
                date: new Date(),
                config: this.config
            };

            collectionToExport.forEach(async (collectionPath, i) => {
                const collectionData = await this.downloadCollection(
                    collectionPath
                );

                exportedData[collectionPath] = collectionData;

                if (i == collectionToExport.length - 1) {
                    this.saveJSON(exportedData);

                    this.downloading = false;
                    this.collectionToExport = [];

                    this.$store.commit("message/display", {
                        content: "Se ha exportado correctamente los datos"
                    });
                }
            });
        },
        saveJSON(JSONdata) {
            let a = document.createElement("a"),
                JSONfile = new Blob([JSON.stringify(JSONdata, undefined, 4)], {
                    type: "application/json"
                });

            a.href = URL.createObjectURL(JSONfile);
            a.download = `export-aurora-${new Date().toISOString()}.json`;

            a.click();
        }
    }
};
</script>
