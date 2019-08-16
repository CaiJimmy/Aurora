<template>
    <v-card>
        <v-tabs background-color="white">

            <template v-for="section in configurableItemsMapped">
                <v-tab :key="section.name">{{ section.name }}</v-tab>
                <v-tab-item :key="section.id">
                    <v-container>
                        <v-layout column>
                            <template v-for="input in section.inputs">
                                <template v-if="input.type == 'text'">
                                    <v-text-field v-model="section.reference[input.id]"
                                        :label="input.name"
                                        :required="input.required"
                                        :key="input.id"></v-text-field>
                                </template>

                                <template v-else-if="input.type == 'color'">
                                    <v-flex class="colorPickerWrapper"
                                        xs12
                                        md6
                                        :key="input.id">
                                        <h6 class="title">{{ input.name }}</h6>
                                        <v-color-picker show-swatches
                                            v-model="section.reference[input.id]"
                                            :hide-inputs="false"></v-color-picker>
                                    </v-flex>
                                </template>

                                <template v-else-if="input.type == 'number'">
                                    <v-flex :key="input.id">
                                        <v-subheader class="pl-0">{{ input.name }}</v-subheader>
                                        <v-slider v-model="section.reference[input.id]"
                                            thumb-label
                                            :max="input.max"
                                            :min="input.min"
                                            :step="input.step"
                                            ticks>
                                            <template #append>
                                                <v-text-field v-model="section.reference[input.id]"
                                                    class="mt-0 pt-0"
                                                    hide-details
                                                    single-line
                                                    type="number"
                                                    :max="input.max"
                                                    :min="input.min"
                                                    style="width: 60px"></v-text-field>
                                            </template>
                                        </v-slider>
                                    </v-flex>
                                </template>

                                <template v-else-if="input.type == 'boolean'">
                                    <v-flex :key="input.id">
                                        <v-checkbox color="primary"
                                            v-model="section.reference[input.id]"
                                            :label="input.name"></v-checkbox>
                                    </v-flex>
                                </template>

                                <template v-else-if="input.type == 'image'">
                                    <v-flex :key="input.id">
                                        <v-img :src="section.reference[input.id]"
                                            max-height="300"
                                            contain></v-img>
                                        <v-text-field v-model="section.reference[input.id]"
                                            :label="input.name"
                                            append-icon="cloud_upload"
                                            @click:append="$refs[input.id][0].click();"></v-text-field>

                                        <input :ref="input.id"
                                            type="file"
                                            @change="inputUploadFile($event.target.files[0], section.reference, input.id);"
                                            accept="image/*"
                                            style="display:none;" />
                                    </v-flex>
                                </template>

                            </template>
                        </v-layout>
                    </v-container>
                </v-tab-item>
            </template>

        </v-tabs>

        <v-card-actions>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn text
                        v-on="on"
                        color="warning"
                        @click="resetConfig()">Resetear</v-btn>
                </template>
                <span>Resetear a la configuración original</span>
            </v-tooltip>

            <v-spacer></v-spacer>
            <v-btn text
                color="primary"
                v-on:click="saveConfig()"
                :loading="loading">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import { CONFIG_DOC } from '@/store/modules/config'
import uploadFile from '@/utils/uploadFile';

export default {
    name: 'AdminSetting',
    metaInfo: {
        title: 'Ajustes'
    },
    data () {
        return {
            valid: false,
            loading: false,
            newConfig: {},
            configurableItems: [
                {
                    name: "General",
                    id: '',
                    inputs: [
                        {
                            type: "text",
                            id: "siteName",
                            name: "Nombre de la página",
                            required: true
                        },
                        {
                            type: "image",
                            id: "logo",
                            name: "Logo de la página",
                            required: true
                        }
                    ]
                },
                {
                    name: "Inicio de sesión",
                    id: 'login',
                    inputs: [
                        {
                            type: "image",
                            id: "background",
                            name: "Fondo de inicio de sesión"
                        }
                    ]
                },
                {
                    name: "Tema",
                    id: 'topic',
                    inputs: [
                        {
                            type: "number",
                            id: "question_per_page",
                            name: "Número de preguntas por página",
                            min: 1,
                            max: 30
                        },
                        {
                            type: "boolean",
                            id: "displayAuthorData",
                            name: "Mostrar datos del autor de la pregunta para todos los usuarios"
                        },
                        {
                            type: "boolean",
                            id: "questionEditable",
                            name: "Los usuarios pueden editar sus preguntas"
                        },
                        {
                            type: "boolean",
                            id: "questionRemovable",
                            name: "Los usuarios pueden eliminar sus preguntas"
                        },
                        {
                            type: "text",
                            id: "defaultHeaderImage",
                            name: "URL de la imagen del tema por defecto (Se recomienda que sea un fuente que permite obtener imágenes aleatorias)"
                        },
                        {
                            type: "number",
                            id: "headerImageMaxWidth",
                            name: "Ancho máximo de la imagen del tema (Se recorta automáticamente)",
                            min: 500,
                            max: 2000,
                            step: 50
                        }
                    ]
                }
            ]
        }
    },
    created () {
        /// Clone current site settings
        this.newConfig = JSON.parse(JSON.stringify(this.config));
    },
    computed: {
        configurableItemsMapped () {
            let configurableItems = this.configurableItems;

            configurableItems.forEach(element => {
                if (element.id.length) {
                    element.reference = this.newConfig[element.id];
                }
                else {
                    element.reference = this.newConfig;
                }
            });

            return configurableItems;
        }
    },
    methods: {
        inputUploadFile (file, sectionReference, inputId) {
            const randomFileName = Math.random().toString(36).substring(10);

            uploadFile(file, `settings/${randomFileName}`).then(fileURL => {
                this.$set(sectionReference, inputId, fileURL);

                this.$store.commit('message/display', {
                    content: 'Se ha subido el archivo correctamente.'
                })
            }).catch(() => {
                this.$store.commit('message/display', {
                    content: 'Se ha producido un error en subir archivo.'
                })
            })
        },
        resetConfig () {
            CONFIG_DOC.set({}).then(() => {
                this.loading = false;
                this.$store.commit('message/display', {
                    content: 'Se ha reseteado a la configuración original'
                });

                /// Clone current site settings
                this.newConfig = JSON.parse(JSON.stringify(this.config));
            })
        },
        saveConfig () {
            this.loading = true;
            CONFIG_DOC.set(this.newConfig, { merge: true }).then(() => {
                this.loading = false;
                this.$store.commit('message/display', {
                    content: 'Se ha guardado correctamente la configuración'
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.colorPickerWrapper {
    margin: 20px auto;
}
</style>
