<template>
    <v-app>
        <v-snackbar color="red darken-2" :timeout="500" v-model="error_snackbar">
            Erreur !!!!
        </v-snackbar>

        <v-snackbar color="green darken-2" :timeout="500" v-model="success_snackbar" >
            succes!!!
        </v-snackbar>

        <v-card>
            <v-card-title>
                <span>Liste des Categories</span>
                <v-btn color="red lighten-2" dark style="margin-left: 20px;" @click="dialog = true">Ajouter</v-btn>
                <v-spacer/>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                />
            </v-card-title>
            <v-data-table id="data-table-x" v-model="selected" :headers="headers" :items="categories" :search="search" @click:row="onTableRowSelected"/>

        </v-card>

        <v-spacer/>

        <div class="text-xs-center">
            <v-dialog v-model="dialog" width="500">

                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>Categories form</v-card-title>

                    <v-card-text>
                        <v-form id="categoryForm">

                            <v-text-field
                                v-model="categoryForm.name"
                                label="Nom"
                                type="text" required="true"/>

                            <v-text-field
                                v-model="categoryForm.description"
                                label="Description"
                                type="text" required="true"/>

                        </v-form>
                    </v-card-text>

                    <v-divider/>

                    <v-card-actions>
                        <v-spacer/>
                        <v-btn small color="primary" style="margin-right: 20px;" dark @click="save">Save</v-btn>
                        <v-btn small color="red lighten-2" dark @click="remove" v-show="crud_mode === 'u'"
                               style="background-color: #f66f81;">
                            Delete
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </v-app>
</template>

<script>
    export default {
        name: "Surveys",
        data: function() {
            return {
                selected: null,
                drawer: false,
                search: "",
                dialog: false,
                crud_mode: "c",
                selectedRow: null,
                headers: [
                    { text: "ID", align: "start", sortable: true, value: "id"},
                    { text: "Nom", value: "name" },
                    { text: "Description", align: "start", sortable: false, value: "description"},
                    { text: "Date d'ajout", value: "createDateTime" },
                    { text: "Date de modification", value: "modDateTime" },
                ],
                categories: [
                    {
                        id: 1,
                        description: "Frozen Yogurt",
                        name: "159",
                        createDateTime: "21/08/1999",
                        modDateTime: "21/08/1999",
                    },
                ],
                categoryForm: {
                    description: "",
                    name:'',
                },
                error_snackbar: false,
                success_snackbar: false,
            };
        },

        methods: {
            onTableRowSelected: function (data) {
                this.categoryForm.description = data.description;
                this.categoryForm.name = data.name;
                this.selectedRow = data.id;
                this.dialog = true;
                this.crud_mode = 'u';
            },

            save: function () {
                let data = {
                    type: "cat_survey",
                    createDateTime: Math.floor(Date.now() / 1000),
                    modDateTime: Math.floor(Date.now() / 1000),
                    modBy: this.$store.state.userInfo.id,
                    description: this.categoryForm.description,
                    name: this.categoryForm.name,
                };

                if (this.crud_mode === "c") {
                    this.$http.post(`${this.$store.state.backendHostName}/services/save/cat_survey`, data, {
                        headers: {
                            'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                            'Content-Type': 'application/json',
                        }
                    }).then(response => {

                        if (response.data.error === null) {
                            console.log(response);
                            this.categories.push(response.data);
                            this.crud_mode = 'c';
                            this.clean_form();
                            this.success_snackbar = true;
                        }


                    }, response => {
                        console.log("error", response);
                        this.error_snackbar = true;
                    });
                }
                else {
                    console.log('U');
                    for (let i = 0; i < this.categories.length; i++) {
                        if(this.categories[i].id === this.selectedRow) {
                            console.log('id: ', i);
                            data["id"] = this.selectedRow;
                            this.$http.post(`${this.$store.state.backendHostName}/services/save/cat_survey`, data, {
                                headers: {
                                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                                    'Content-Type': 'application/json',
                                }
                            }).then(response => {

                                if (response.data.error === null) {
                                    console.log(response);
                                    this.categories[i] = response.data;
                                    this.categories.reverse();
                                    this.categories.reverse();
                                    this.crud_mode = 'c';
                                    this.clean_form();
                                    this.success_snackbar = true;
                                }


                            }, response => {
                                console.log("error", response);
                                this.error_snackbar = true;
                            });


                        }
                    }
                    this.clean_form();
                }

                this.clean_form();
            },

            clean_form: function(){
                this.dialog = false;
                this.categoryForm.description = "";
                this.categoryForm.name = "";
                this.crud_mode = 'c';
            },

            remove: function () {
                for (let i = 0; i < this.categories.length; i++) {
                    if(this.categories[i].id === this.selectedRow) {
                        console.log('id: ', i);

                        this.$http.get(`${this.$store.state.backendHostName}/services/delete/cat_survey/${this.selectedRow}`, {
                            params:{},
                            headers: {
                                'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                                'Content-Type': 'application/json',
                            }
                        }).then(response => {

                            this.categories = this.categories.slice(0, i).concat(this.categories.slice(i+1, this.categories.length));
                            // this.categories.reverse();
                            console.log(response.body);
                            this.dialog = false;
                            this.clean_form();
                            this.success_snackbar = true;

                        }, response => {
                            console.log("error", response);
                            this.error_snackbar = true;
                        });
                    }
                }

            }
        },

        mounted() {
            console.log(this.$store.state);
            this.$http.get(`${this.$store.state.backendHostName}/services/getAll/cat_survey`, {
                params:{},
                headers: {
                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                console.log(response.status);
                this.categories = response.body;
                console.log(response.body);
                this.success_snackbar = true;
            }, response => {
                console.log("error", response);
                this.error_snackbar = true;
            })
        },

        beforeCreate() {
            if (!this.$cookies.isKey("user")) {
                this.$router.push({name: "login"});
            }else {
                this.$store.commit('setUserInfo', this.$cookies.get("user"));
            }
        }
    }
</script>

<style scoped>

</style>
