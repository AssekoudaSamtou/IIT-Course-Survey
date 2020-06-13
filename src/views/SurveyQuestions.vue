<template>
    <v-app>
        <v-container class="grey lighten-5">

            <div class="text-center">
<!--                <v-btn dark color="red darken-2" @click="snackbar = true">Open Snackbar</v-btn>-->

                <v-snackbar color="red darken-2" v-model="error_snackbar" :multi-line="true">
                    Erruer survenue lors de la soummision. Veillez recommencer.
                    <v-btn color="white" text @click="snackbar = false">Close</v-btn>
                </v-snackbar>

                <v-snackbar color="green darken-2" v-model="success_snackbar" :multi-line="true">
                    answer submitted!!
                </v-snackbar>
            </div>

            <v-stepper v-model="stepper.e1">
                <v-stepper-header>
                    <v-stepper-step :complete="stepper.e1 > 1" step="1">Rating</v-stepper-step>

                    <v-divider/>

                    <v-stepper-step step="2">Commentaires</v-stepper-step>

                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-card class="mb-12" color="grey lighten-1">
                            <v-card-title>
                                <p class="text-center">Veuillez remplir ce formulaire: </p>
                            </v-card-title>
                            <v-form>
                                <v-row v-for="question in questions" :key="question.id" no-gutters>
                                    <v-col cols="8">
                                        <v-card class="pa-2" style="height: 100%;">
                                            {{ question.title }}
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-card class="pa-2">
                                            <v-row>
                                                <v-col cols="2">
                                                    <v-checkbox
                                                        v-model="checkboxes[question.id]"
                                                        @change="onResponseChanged(question.id, checkboxes[question.id])"
                                                        label="N/A"/>
                                                </v-col>
                                                <v-col cols="1"/>
                                                <v-col cols="9" class="mt-4">
<!--                                                    <v-btn color="success" class="mt-12" @click="overlay.overlay = !overlay.overlay">Show Overlay</v-btn>-->


                                                    <div class="text-center">
                                                        <v-rating
                                                            :id="`rating-${question.id}`"
                                                            :class="checkboxes[question.id]? `d-none`: ''"
                                                            color="red"
                                                            background-color="red lighten-3"
                                                            v-model="sliders[question.id]"
                                                            @input="onResponseChanged(question.id, sliders[question.id])"
                                                            :hover="true"/>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card>

                        <v-btn rounded color="primary" @click="stepper.e1 = 2">suivant</v-btn>

                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-card class="mb-12" color="">
                            <v-card-title>
                                <p class="text-center">Voulez-vous ajouter un commentaire ?</p>
                            </v-card-title>
                            <v-form>
                                <v-row v-for="question in questions" :key="question.id" no-gutters>
                                    <v-col cols="8">
                                        <v-card class="pa-2" style="height: 100%;">
                                            {{ question.title }}
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-card class="pa-2">
                                            <v-row>
                                                <v-col cols="2"/>
                                                <v-col cols="9">
                                                    <v-textarea
                                                        height="50"
                                                        outlined
                                                        v-model="comments[question.id]"
                                                        name="input-7-4"
                                                        label="Votre commentaire"
                                                    />
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card>

                        <v-btn rounded color="primary" @click="stepper.e1 = 1">précédant</v-btn>
                        <v-btn rounded color="success" class="ml-4" dark @click.prevent="submitSurveyAnswer">soumettre</v-btn>
                    </v-stepper-content>

                </v-stepper-items>
            </v-stepper>


        </v-container>
    </v-app>
</template>

<script>
    import {mapMutations} from "vuex";

    export default {
        name: "SurveyQuestions",
        data: function() {
            return {
                questions: Array,
                answers:{},
                sliders:{},
                checkboxes: {},
                comments: {},
                stepper: {
                    e1: 1,
                },
                error_snackbar: false,
                success_snackbar: false,

                student_survey_arr: null,

                student: null
            };
        },
        mounted() {
            this.getAllStudentSurvey();
            this.getStudentByUser();

        },
        beforeCreate() {
            if (!this.$cookies.isKey("user")) {
                this.$router.push({name: "login"});
            }else {
                this.$store.commit('setUserInfo', this.$cookies.get("user"));
            }
        },
        methods: {
            ...mapMutations([
                'setSurveyAnswerSubmitted'
            ]),

            submitSurveyAnswer: function () {
                let data = {};

                for (let answer in this.answers) {

                    if(this.$store.state.surveyAnswerSubmitted === false) {
                        break;
                    }

                    if (this.checkboxes[answer] === false && this.answers[answer] === 0){
                        continue;
                    }

                    data["type"] = "student_survey";
                    data["id_survey"] = parseInt(this.$route.params.id);
                    data["id_student"] = this.student.id;
                    data["id_question"] = parseInt(answer);
                    data["comments"] = this.comments[answer];
                    data["is_na"] = this.checkboxes[answer] ? 1 : 0;
                    data["rating"] = this.answers[answer];
                    data["modBy"] = this.$store.state.userInfo.id;
                    console.log(data);
                    this.$http.post(`${this.$store.state.backendHostName}/services/save/student_survey`, data, {
                        headers: {
                            'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                            'Content-Type': 'application/json',
                        }
                    }).then(response => {

                        console.log(response);
                        this.$router.go(0);

                    }, response => {
                        console.log("error", response);
                        this.$store.commit('setSurveyAnswerSubmitted', false);
                        this.error_snackbar = true;
                    });
                }
                this.success_snackbar = true;
                // setTimeout(function() {
                //     this.$router.push({name: "surveys"});
                // }, 1000);
                // if () {
                //
                // }
            },

            onResponseChanged(questionID, answer) {
                // console.log(this.checkboxes);
                if (answer === true) {//checked
                    this.answers[questionID] = null;
                     document.getElementById(`rating-${questionID}`).style.display = "none";
                     console.log(0);
                }
                else if (answer === false){//unchecked
                    this.answers[questionID] = this.sliders[questionID];
                    document.getElementById(`rating-${questionID}`).style.display = "block";
                    console.log(1);
                }
                else {
                    this.answers[questionID] = answer;
                    document.getElementById(`rating-${questionID}`).style.display = "block";
                    console.log(2);
                }
            },

            getAllStudentSurvey: function() {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/student_survey`, {
                        params:{},
                        headers: {
                            'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                            'Content-Type': 'application/json',
                        }
                    }).then(response => {

                    this.student_survey_arr = response.body;
                    this.getPendingSurvey();
                    console.log(this.student_survey_arr);

                }, response => {
                    console.log("error", response);
                });
            },

            getStudentByUser: function() {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/student`, {
                        params:{},
                        headers: {
                            'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                            'Content-Type': 'application/json',
                        }
                    }).then(response => {

                    this.student = response.body.filter(student => {
                        return student.id_user === this.$store.state.userInfo.id;
                    })[0];

                }, response => {
                    console.log("error", response);
                });
            },

            getPendingSurvey: function() {
                this.$http.get(`${this.$store.state.backendHostName}/services/getPendingSurveyQuestions/${this.$route.params.id}/${this.$store.state.userInfo.id}`, {
                params:{},
                headers: {
                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                    'Content-Type': 'application/json',
                }
            }).then(response => {

                    this.questions = response.body.filter(this.checkValidQuestons);
                    for (let q=0; q<this.questions.length; q++) {
                        this.sliders[this.questions[q].id] = 0;
                        this.answers[this.questions[q].id] = 0;
                        this.checkboxes[this.questions[q].id] = false;
                        this.comments[this.questions[q].id] = "";
                    }
                }, response => {
                    console.log("error", response);
                });
            },

            checkValidQuestons: function (question) {
                console.log("error", parseInt(this.student.id));
                for (let i = 0; i < this.student_survey_arr.length; i++) {
                    if (
                        (question.id === this.student_survey_arr[i].id_question) &&
                        (this.student_survey_arr[i].id_survey === parseInt(this.$route.params.id)) &&
                        (this.student_survey_arr[i].id_student === parseInt(this.student.id))
                    ) {
                        return false;
                    }
                }
                return true;
            }
        },

        watch: {

        }
    }
</script>

<style scoped>

</style>
