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
                <span>Liste des étudiants</span>
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
            <v-data-table id="data-table-x" v-model="selected" :headers="headers" :items="students" :search="search" @click:row="onTableRowSelected"/>

        </v-card>

        <v-spacer/>

        <div class="text-xs-center">
            <v-dialog v-model="dialog" width="500">

                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>Students form</v-card-title>

                    <v-card-text>
                        <v-form id="studentForm">

                            <v-select
                                v-model="studentForm.user"
                                chips outlined :items="items_user"
                                item-text="userName" item-value="id"
                                label="Utilisateur" dense/>

                            <v-text-field
                                v-model="studentForm.matricule"
                                label="Matrcule" outlined
                                type="text" required="true"/>

<!--                            <v-select v-model="studentForm.id_courses"-->
<!--                                      chips outlined :items="items_course"-->
<!--                                      item-text="id" item-value="id"-->
<!--                                      label="Matieres" multiple dense/>-->
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
                    { text: "Utilisateur", value: "id_user" },
                    { text: "Matricule", value: "matricule" },
                    { text: "Date d'ajout", value: "createDateTime" },
                    { text: "Date de modification", value: "modDateTime" },
                ],
                students: [
                    {
                        id: 1,
                        createDateTime: "21/08/1999",
                        modDateTime: "21/08/1999",
                        id_user: 1,
                        matricule: 159,
                        id_courses: ["159"],
                    },
                ],
                studentForm: {
                    matricule: "",
                    user:'',
                    id_courses:[],
                },

                error_snackbar: false,
                success_snackbar: false,

                items_course: Array,
                items_user: Array,
                items_teacher: Array,

                requests_counter: 0,
            };
        },

        methods: {
            onTableRowSelected: function (data) {
                this.studentForm.matricule = data.matricule;
                this.studentForm.user = data.id_user;
                this.selectedRow = data.id;
                this.dialog = true;
                this.crud_mode = 'u';
            },

            save: function () {
                let data = {
                    type: "student",
                    matricule: this.studentForm.matricule,
                    id_user:this.studentForm.user,
                    createDateTime: Math.floor(Date.now() / 1000),
                    modDateTime: Math.floor(Date.now() / 1000),
                    modBy: this.$store.state.userInfo.id,
                };

                if (this.crud_mode === "c") {
                    console.log('C');
                    this.$http.post('http://ec2-18-224-141-43.us-east-2.compute.amazonaws.com/services/save/student', data).then(response => {

                        this.students.push(response.data);
                        this.crud_mode = 'c';
                        this.clean_form();
                        this.success_snackbar = true;

                    },response => {
                        console.log(response);
                        this.error_snackbar = true;
                    });
                }
                else {
                    console.log('U');
                    for (let i = 0; i < this.students.length; i++) {
                        if(this.students[i].id === this.selectedRow) {
                            console.log('id: ', i);
                            data["id"] = this.selectedRow;
                            this.$http.post(`${this.$store.state.backendHostName}/services/save/student`, data, {
                                headers: {
                                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                                    'Content-Type': 'application/json',
                                }
                            }).then(response => {

                                console.log(response);
                                this.students[i] = response.data;
                                this.students.reverse();
                                this.students.reverse();
                                this.crud_mode = 'c';
                                this.clean_form();
                                this.success_snackbar = true;

                            }, response => {
                                console.log("error", response);
                                this.error_snackbar = true;
                            });
                        }
                    }
                    this.clean_form();
                }
            },

            clean_form: function(){
                this.dialog = false;
                this.studentForm.matricule = "";
                this.studentForm.user = "";
                this.studentForm.id_courses = [];
                this.crud_mode = 'c';
            },

            remove: function () {
                for (let i = 0; i < this.students.length; i++) {
                    if(this.students[i].id === this.selectedRow) {
                        console.log('id: ', i);

                        this.$http.get(`${this.$store.state.backendHostName}/services/delete/student/${this.selectedRow}`, {
                            params:{},
                            headers: {
                                'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                                'Content-Type': 'application/json',
                            }
                        }).then(response => {

                            this.students = this.students.slice(0, i).concat(this.students.slice(i+1, this.students.length));
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
                this.dialog = false;
                this.clean_form();
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
                    console.log(response.body);
                    this.requests_counter++;
                }, response => {
                    console.log("error", response);
                });
            },

            getAllUsers: function () {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/user`, {
                    params:{},
                    headers: {
                        'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }).then(response => {
                    this.items_user = response.body.filter(this.checkValidUser);
                    console.log(this.items_user);
                }, response => {
                    console.log("error", response);
                });
            },

            getAllTeachers: function () {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/teacher`, {
                    params:{},
                    headers: {
                        'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }).then(response => {
                    this.items_teacher = response.body;
                    this.requests_counter++;
                }, response => {
                    console.log("error", response);
                });
            },

            checkValidUser: function (user) {
                let arr = this.students.concat(this.items_teacher);
                for (let i = 0; i < arr.length; i++) {
                    if (user.id === arr[i].id_user)
                        return false;
                }
                return true;
            }
        },

        watch: {
            requests_counter: function (val) {
                if (val === 2) {
                    this.getAllUsers();
                }
            }
        },

        mounted() {
            console.log(this.$store.state);
            this.$http.get(`${this.$store.state.backendHostName}/services/getAll/student`, {
                params:{},
                headers: {
                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                this.students = response.body;
                this.success_snackbar = true;
                this.getAllCourses();
                this.getAllTeachers();
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
