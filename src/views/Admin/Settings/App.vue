<template>
    <v-card>
        <v-tabs background-color="white">

            <template v-for="section in configurableItemsMapped">
                <v-tab :key="section.name">{{ section.name }}</v-tab>
                <v-tab-item :key="section.id">
                    <v-container>
                        <v-layout>
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

                            </template>
                        </v-layout>
                    </v-container>
                </v-tab-item>
            </template>

        </v-tabs>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text
                color="primary"
                v-on:click="saveConfig()" :loading="loading">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import { CONFIG_DOC } from '@/store/modules/config'

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
                            type: "text",
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
                            type: "text",
                            id: "background",
                            name: "Fondo de inicio de sesión"
                        }
                    ]
                },
                {
                    name: "Tema",
                    id: 'theme',
                    inputs: [
                        {
                            type: "color",
                            id: "primary",
                            name: "Color primario"
                        },
                        {
                            type: "color",
                            id: "secondary",
                            name: "Color secundario"
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
        saveConfig () {
            this.loading = true;
            CONFIG_DOC.update(this.newConfig).then(() => {
                this.loading = false;
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
