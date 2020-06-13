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
                <span>Liste des Surveys</span>
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
            <v-data-table id="data-table-x" v-model="selected" :headers="headers" :items="surveys" :search="search" @click:row="onTableRowSelected"/>

        </v-card>

        <v-spacer/>

        <div class="text-xs-center">
            <v-dialog v-model="dialog" width="500">

                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>Surveys form</v-card-title>

                    <v-card-text>
                        <v-form id="surveyForm">

                            <v-select
                                v-model="surveyForm.course"
                                chips filled outlined label="Course" dense
                                :items="items_course" item-text="id" item-value="id" />

                            <v-select
                                v-model="surveyForm.cat_survey"
                                chips filled outlined label="Categorie" dense
                                :items="items_cat_survey" item-text="name" item-value="id" />

                            <v-text-field
                                v-model="surveyForm.title"
                                label="Titre"
                                type="text" required="true"/>

                            <v-text-field
                                v-model="surveyForm.description"
                                label="Description"
                                type="text" required="true"/>

                            <v-text-field
                                v-model="surveyForm.beginMessage"
                                label="Message Debut"
                                type="text" required="true"/>

                            <v-text-field
                                v-model="surveyForm.endMessage"
                                label="Message Fin"
                                type="text" required="true"/>

                            <v-text-field
                                v-model="surveyForm.beginDate"
                                label="Date Debut"
                                type="text" required="true"/>

                            <v-date-picker v-model="surveyForm.beginDate"/>

                            <v-text-field
                                v-model="surveyForm.endDate"
                                label="Date Fin"
                                type="text" required="true"/>

                            <v-date-picker v-model="surveyForm.endDate"/>

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
        name: "Students",
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
                    { text: "Catégorie", value: "id_cat_survey" },
                    { text: "Cours", align: "start", sortable: false, value: "id_course"},
                    { text: "Titre", value: "title" },
                    { text: "Description", value: "description" },
                    { text: "Msg Début", value: "beginMessage" },
                    { text: "Msg Fin", value: "endMessage" },
                    { text: "Date Début", value: "beginDate" },
                    { text: "Date Fin", value: "endDate" },
                    { text: "Status", value: "status" },
                    // { text: "Date d'ajout", value: "createDateTime" },
                    // { text: "Date de modification", value: "modDateTime" },
                ],
                surveys: [
                    {
                        id: 1,
                        cat_survey: 1,
                        course: 1,
                        title: "Frozen",
                        description: "Yogurt",
                        beginMessage: 1,
                        endMessage: 1,
                        beginDate: 1,
                        endDate: 1,
                        status: false,
                        createDateTime: "21/08/1999",
                        modDateTime: "21/08/1999",
                    },
                ],
                surveyForm: {
                    cat_survey: null,
                    course: null,
                    title: null,
                    description: null,
                    beginMessage: null,
                    endMessage: null,
                    beginDate: null,
                    endDate: null,
                    status: 1,
                },
                error_snackbar: false,
                success_snackbar: false,

                items_course: Array,
                items_cat_survey: Array,

                request_counter: 0
            };
        },

        methods: {
            onTableRowSelected: function (data) {
                this.surveyForm.title = data.title;
                this.surveyForm.description = data.description;
                this.surveyForm.cat_survey = data.id_cat_survey;
                this.surveyForm.course = data.id_course;
                this.surveyForm.beginMessage = data.beginMessage;
                this.surveyForm.endMessage = data.endMessage;
                this.surveyForm.beginDate = data.beginDate;
                this.surveyForm.endDate = data.endDate;
                this.surveyForm.status = data.status;
                this.selectedRow = data.id;
                this.dialog = true;
                this.crud_mode = 'u';
            },

            save: function () {
                let data = {
                    type: "survey",
                    createDateTime: Math.floor(Date.now() / 1000),
                    modDateTime: Math.floor(Date.now() / 1000),
                    modBy: this.$store.state.userInfo.id,
                    title: this.surveyForm.title,
                    description: this.surveyForm.description,
                    id_cat_survey: this.surveyForm.cat_survey,
                    id_course: this.surveyForm.course,
                    beginMessage: this.surveyForm.beginMessage,
                    endMessage: this.surveyForm.endMessage,
                    beginDate: this.surveyForm.beginDate,
                    endDate: this.surveyForm.endDate,
                    status: 1//this.surveyForm.status,
                };

                console.log(data);

                if (this.crud_mode === "c") {
                    this.$http.post(`${this.$store.state.backendHostName}/services/save/survey`, data, {
                        headers: {
                            'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                            'Content-Type': 'application/json',
                        }
                    }).then(response => {

                        if (response.data.error === null) {
                            console.log(response);
                            this.surveys.push(response.data);
                            this.clean_form();
                            this.crud_mode = 'c';
                            this.success_snackbar = true;
                        }

                    }, response => {
                        console.log("error", response);
                        this.error_snackbar = true;
                    });
                }
                else {
                    console.log('U');
                    for (let i = 0; i < this.surveys.length; i++) {
                        if(this.surveys[i].id === this.selectedRow) {
                            console.log('id: ', i);
                            data["id"] = this.selectedRow;
                            this.$http.post(`${this.$store.state.backendHostName}/services/save/cat_survey`, data, {
                                headers: {
                                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                                    'Content-Type': 'application/json',
                                }
                            }).then(response => {

                                // if (response.data.error === null) {
                                    console.log(response);
                                    this.surveys[i] = response.data;
                                    this.clean_form();
                                    this.surveys.reverse();
                                    this.surveys.reverse();
                                    this.crud_mode = 'c';
                                    this.success_snackbar = true;
                                // }

                            }, response => {
                                console.log("error", response);
                                this.error_snackbar = true;
                            });


                        }
                    }
                }
            },

            clean_form: function(){
                this.dialog = false;
                this.surveyForm.title = null;
                this.surveyForm.description = null;
                this.surveyForm.cat_survey = null;
                this.surveyForm.cat_survey = null;
                this.surveyForm.course = null;
                this.surveyForm.beginDate = null;
                this.surveyForm.endDate = null;
                this.surveyForm.beginMessage = null;
                this.surveyForm.endMessage = null;
                this.surveyForm.status = null;
                this.crud_mode = 'c';
            },

            remove: function () {
                for (let i = 0; i < this.surveys.length; i++) {
                    if(this.surveys[i].id === this.selectedRow) {
                        console.log('id: ', i);

                        this.$http.get(`${this.$store.state.backendHostName}/services/delete/survey/${this.selectedRow}`, {
                            params:{},
                            headers: {
                                'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                                'Content-Type': 'application/json',
                            }
                        }).then(response => {

                            this.surveys = this.surveys.slice(0, i).concat(this.surveys.slice(i+1, this.surveys.length));
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

            },

            getAllCourses: function () {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/course`, {
                    params:{},
                    headers: {
                        'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }).then(response => {
                    this.items_course = response.body;
                    this.request_counter++;
                }, response => {
                    console.log("error", response);
                });
            },

            getAllCatSurveys: function () {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/cat_survey`, {
                    params:{},
                    headers: {
                        'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }).then(response => {
                    this.items_cat_survey = response.body;
                    this.request_counter++;
                }, response => {
                    console.log("error", response);
                });
            },

            // updateStudents: function () {
            //     console.log("begin", this.surveyForm.id_students);
            //     let student_survey = {
            //         type: "student_survey",
            //         createDateTime: Math.floor(Date.now() / 1000),
            //         modDateTime: Math.floor(Date.now() / 1000),
            //         modBy: this.$store.state.userInfo.id,
            //         id_survey: null,
            //         id_student: null,
            //     };
            //
            //     for (let i = 0; i < this.surveyForm.id_students.length; i++) {
            //         console.log("loop");
            //         if (!(this.surveyForm.id_students[i] in this.old_selected_students)) {
            //             console.log("new elt");
            //             student_survey.id_course = this.selectedRow;
            //             student_survey.id_student = this.surveyForm.id_students[i];
            //             this.$http.post(`${this.$store.state.backendHostName}/services/save/student_survey`, student_survey, {
            //                 headers: {
            //                     'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
            //                     'Content-Type': 'application/json',
            //                 }
            //             }).then(response => {
            //
            //                 if (response.data.error === null) {
            //                     console.log(response.data);
            //                     this.clean_form();
            //                     this.crud_mode = 'c';
            //                 }
            //
            //             }, response => {
            //                 console.log("error", response);
            //             });
            //         }
            //     }
            // }
        },

        watch: {
            request_counter: function (val) {
                if (val === 2) {
                    console.log("request_counter");
                }
            }
        },

        mounted() {
            console.log(this.$store.state);
            this.$http.get(`${this.$store.state.backendHostName}/services/getAll/survey`, {
                params:{},
                headers: {
                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                    'Content-Type': 'application/json',
                }
            }).then(response => {

                // if (response.body.error === null) {
                    this.surveys = response.body;
                    this.success_snackbar = true;
                    this.getAllCourses();
                    this.getAllCatSurveys();
                // }

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
