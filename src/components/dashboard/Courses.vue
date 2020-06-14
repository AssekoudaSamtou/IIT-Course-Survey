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
                <span>Liste des Cours</span>
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
            <v-data-table id="data-table-x" v-model="selected" :headers="headers" :items="courses" :search="search" @click:row="onTableRowSelected"/>

        </v-card>

        <v-spacer/>

        <div class="text-xs-center">
            <v-dialog v-model="dialog" width="500">

                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>Course form</v-card-title>

                    <v-card-text>
                        <v-form id="CourseForm">

                            <v-select
                                v-model="CourseForm.id_term"
                                chips filled outlined label="Semestre" dense
                                :items="items_term" item-text="name" item-value="id" />

                            <v-select
                                v-model="CourseForm.id_class"
                                chips filled outlined label="Classe" dense
                                :items="items_class" item-text="name" item-value="id"/>

                            <v-select
                                v-model="CourseForm.id_subject"
                                chips filled outlined label="Subject" dense
                                :items="items_subject" item-text="name" item-value="id" />

                            <v-select
                                v-model="CourseForm.id_teacher"
                                chips filled outlined label="Enseignant" dense
                                :items="items_teacher" item-text="matricule" item-value="id"/>

                            <v-select @click="test"
                                v-model="CourseForm.id_students"
                                label="Etudiant" multiple dense chips outlined
                                :items="items_student" item-text="matricule" item-value="id"/>

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
        name: "Courses",
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
                    { text: "Semestre", align: "start", sortable: false, value: "id_term.name"},
                    { text: "Classe", value: "id_class.name" },
                    { text: "Subject", value: "id_subject.name" },
                    { text: "Enseignant", value: "id_teacher.matricule" },
                    { text: "Date d'ajout", value: "createDateTime" },
                    { text: "Date de modification", value: "modDateTime" },
                ],
                courses: [
                    {
                        id: 1,
                        id_term: "159",
                        id_class: "159",
                        id_subject: "159",
                        id_teacher: "159",
                        id_students: ["159"],
                        createDateTime: "21/08/1999",
                        modDateTime: "21/08/1999",
                    },
                ],

                CourseForm: {
                    id_term: Number,
                    id_class: Number,
                    id_subject: Number,
                    id_teacher: Number,
                    id_students: [],
                },

                error_snackbar: false,
                success_snackbar: false,
                items_term: Array,
                items_class: Array,
                items_subject: Array,
                items_teacher: Array,
                items_student: Array,
                items_student_course: Array,
                old_selected_students: [],
                request_counter: 0
            };
        },

        methods: {
            onTableRowSelected: function (data) {
                this.CourseForm.id_term = data.id_term;
                this.CourseForm.id_class = data.id_class;
                this.CourseForm.id_subject = data.id_subject;
                this.CourseForm.id_teacher = data.id_teacher;
                this.selectedRow = data.id;
                this.dialog = true;
                this.crud_mode = 'u';

                this.old_selected_students = [];
                this.CourseForm.id_students = [];
                console.log(this.items_student_course);
                for (let i = 0; i < this.items_student_course.length; i++) {
                    if (this.items_student_course[i].id_course === data.id) {
                        this.old_selected_students.push(this.items_student_course[i].id_student);
                        this.CourseForm.id_students.push(this.items_student_course[i].id_student);

                        // this.old_selected_students = Array.from(Set(this.old_selected_students));
                        this.CourseForm.id_students = Array.from(new Set(this.CourseForm.id_students));
                    }
                }
            },

            save: function () {
                let data = {
                    type: "course",
                    createDateTime: Math.floor(Date.now() / 1000),
                    modDateTime: Math.floor(Date.now() / 1000),
                    modBy: this.$store.state.userInfo.id,
                    id_term: this.CourseForm.id_term,
                    id_class: this.CourseForm.id_class,
                    id_subject: this.CourseForm.id_subject,
                    id_teacher: this.CourseForm.id_teacher,
                };
                if (typeof this.CourseForm.id_teacher !== "number")
                    data.id_teacher = this.CourseForm.id_teacher.id;
                if (typeof this.CourseForm.id_term !== "number")
                    data.id_term = this.CourseForm.id_term.id;
                if (typeof this.CourseForm.id_class !== "number")
                    data.id_class = this.CourseForm.id_class.id;
                if (typeof this.CourseForm.id_subject !== "number")
                    data.id_subject = this.CourseForm.id_subject.id;

                console.log(this.CourseForm.id_class, this.crud_mode);

                if (this.crud_mode === "c") {
                    this.$http.post(`${this.$store.state.backendHostName}/services/save/course`, data, {
                        headers: {
                            'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                            'Content-Type': 'application/json',
                        }
                    }).then(response => {

                        if (response.data.error === null) {
                            this.courses.push(response.data);
                            this.updateStudents();

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
                    for (let i = 0; i < this.courses.length; i++) {
                        if(this.courses[i].id === this.selectedRow) {
                            console.log('id: ', i);
                            data["id"] = this.selectedRow;
                            this.$http.post(`${this.$store.state.backendHostName}/services/save/course`, data, {
                                headers: {
                                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                                    'Content-Type': 'application/json',
                                }
                            }).then(response => {
                                console.log(response.data.error);
                                if (response.data.error === null) {
                                    console.log('IN');
                                    this.courses[i] = response.data;
                                    this.improveCourses();
                                    this.updateStudents();

                                    console.log(this.courses);
                                    this.courses.reverse();
                                    this.courses.reverse();
                                    this.crud_mode = 'c';

                                    this.success_snackbar = true;
                                }

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
                this.CourseForm.id_term = "";
                this.CourseForm.id_subject = "";
                this.CourseForm.id_teacher = "";
                this.CourseForm.id_class = "";
                this.CourseForm.id_students = [];
                this.crud_mode = 'c';
            },

            remove: function () {
                for (let i = 0; i < this.courses.length; i++) {
                    if(this.courses[i].id === this.selectedRow) {
                        console.log('id: ', i);

                        this.$http.get(`${this.$store.state.backendHostName}/services/delete/course/${this.selectedRow}`, {
                            params:{},
                            headers: {
                                'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                                'Content-Type': 'application/json',
                            }
                        }).then(response => {

                            this.courses = this.courses.slice(0, i).concat(this.courses.slice(i+1, this.courses.length));
                            console.log(response.body);
                            this.dialog = false;
                            // this.clean_form();
                            this.success_snackbar = true;

                        }, response => {
                            console.log("error", response);
                            this.error_snackbar = true;
                        });
                    }
                }

            },

            getAllTerms: function () {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/term`, {
                    params:{},
                    headers: {
                        'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }).then(response => {
                    this.items_term = response.body;
                    this.request_counter++;
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
                    this.request_counter++;
                }, response => {
                    console.log("error", response);
                });
            },

            getAllClasses: function () {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/classe`, {
                    params:{},
                    headers: {
                        'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }).then(response => {
                    this.items_class = response.body;
                    this.request_counter++;
                }, response => {
                    console.log("error", response);
                });
            },

            getAllSubjects: function () {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/subject`, {
                    params:{},
                    headers: {
                        'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }).then(response => {
                    this.items_subject = response.body;
                    this.request_counter++;
                }, response => {
                    console.log("error", response);
                });
            },

            getAllStudents: function () {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/student`, {
                    params:{},
                    headers: {
                        'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }).then(response => {
                    this.items_student = response.body;
                    this.request_counter++;
                }, response => {
                    console.log("error", response);
                });
            },

            getAllStudentCourses: function () {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/student_course`, {
                    params:{},
                    headers: {
                        'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }).then(response => {
                    this.items_student_course = response.body;
                    this.request_counter++;
                }, response => {
                    console.log("error", response);
                });
            },

            getStudentById: function (id) {
                let res = null;
                for (let i = 0; i < this.items_student.length; i++) {
                    if (id === this.items_student[i].id) {
                        res = this.items_student[i];
                    }
                }
                return res;
            },

            getTermById: function (id) {
                let res = null;
                for (let i = 0; i < this.items_term.length; i++) {
                    if (id === this.items_term[i].id) {
                        res = this.items_term[i];
                    }
                }
                return res;
            },

            getTeacherById: function (id) {
                let res = null;
                for (let i = 0; i < this.items_teacher.length; i++) {
                    if (id === this.items_teacher[i].id) {
                        res = this.items_teacher[i];
                    }
                }
                return res;
            },

            getClasseById: function (id) {
                let res = null;
                for (let i = 0; i < this.items_class.length; i++) {
                    if (id === this.items_class[i].id) {
                        res = this.items_class[i];
                    }
                }
                return res;
            },

            getSubjectById: function (id) {
                let res = null;
                for (let i = 0; i < this.items_subject.length; i++) {
                    if (id === this.items_subject[i].id) {
                        res = this.items_subject[i];
                    }
                }
                return res;
            },

            improveCourses: function () {
                for (let i = 0; i < this.courses.length; i++) {
                    if ( typeof (this.courses[i].id_term) === "number" ) this.courses[i].id_term = this.getTermById(this.courses[i].id_term);
                    if ( typeof (this.courses[i].id_class) === "number" ) this.courses[i].id_class = this.getClasseById(this.courses[i].id_class);
                    if ( typeof (this.courses[i].id_subject) === "number" ) this.courses[i].id_subject = this.getSubjectById(this.courses[i].id_subject);
                    if ( typeof (this.courses[i].id_teacher) === "number" ) this.courses[i].id_teacher = this.getTeacherById(this.courses[i].id_teacher);
                }
            },

            test: function() {

            },

            updateStudents: function () {
                console.log("begin", this.CourseForm.id_students);
                let student_course = {
                    type: "student_course",
                    createDateTime: Math.floor(Date.now() / 1000),
                    modDateTime: Math.floor(Date.now() / 1000),
                    modBy: this.$store.state.userInfo.id,
                    id_course: null,
                    id_student: null,
                };

                for (let i = 0; i < this.CourseForm.id_students.length; i++) {
                    console.log("loop");
                    if (!(this.CourseForm.id_students[i] in this.old_selected_students)) {
                        console.log("new elt");
                        student_course.id_course = this.selectedRow;
                        student_course.id_student = this.CourseForm.id_students[i];
                        this.$http.post(`${this.$store.state.backendHostName}/services/save/student_course`, student_course, {
                            headers: {
                                'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                                'Content-Type': 'application/json',
                            }
                        }).then(response => {

                            if (response.data.error === null) {
                                console.log(response.data);
                                this.clean_form();
                                this.crud_mode = 'c';
                            }

                        }, response => {
                            console.log("error", response);
                        });
                    }
                }
            }
        },

        watch: {
            request_counter: function (val) {
                if (val === 6) {
                    this.improveCourses();
                    console.log(this.courses);
                }
            }
        },

        mounted() {
            this.$http.get(`${this.$store.state.backendHostName}/services/getAll/course`, {
                params:{},
                headers: {
                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                console.log(response.body);
                this.getAllTerms();
                this.getAllClasses();
                this.getAllTeachers();
                this.getAllSubjects();
                this.getAllStudents();
                this.getAllStudentCourses();
                this.courses = response.body;
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
