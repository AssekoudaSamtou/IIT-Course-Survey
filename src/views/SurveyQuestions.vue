<template>
    <v-app>
        <v-container class="grey lighten-5">

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
                                <v-row v-for="question in questions" :key="question[0]" no-gutters>
                                    <v-col cols="8">
                                        <v-card class="pa-2" style="height: 100%;">
                                            {{ question[1] }}
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-card class="pa-2">
                                            <v-row>
                                                <v-col cols="2">
                                                    <v-checkbox
                                                        v-model="checkboxes[question[0]]"
                                                        @change="onResponseChanged(question[0], checkboxes[question[0]])"
                                                        label="N/A"/>
                                                </v-col>
                                                <v-col cols="1"/>
                                                <v-col cols="9" class="mt-4">
                                                    <v-slider
                                                        color="red" :min="1" :max="5"
                                                        :disabled="checkboxes[question[0]]"
                                                        @change="onResponseChanged(question[0], sliders[question[0]])"
                                                        v-model="sliders[question[0]]"
                                                        thumb-label="always"/>
                                                </v-col>
                                            </v-row>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card>

                        <v-btn rounded color="primary" @click="stepper.e1 = 2">continuerr</v-btn>

                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-card class="mb-12" color="" height="200px">
                            <v-card-title>
                                <p class="text-center">Voulez-vous ajouter un commentaire ?</p>
                            </v-card-title>
                            <v-textarea
                                outlined
                                class="mt-3"
                                name="input-7-4"
                                label="Votre commentaire"
                                value=""/>
                        </v-card>

                        <v-btn rounded color="primary" @click="stepper.e1 = 1">retour</v-btn>
                        <v-btn rounded color="primary" dark @click.prevent="submitSurveyAnswer">soumettre</v-btn>
                    </v-stepper-content>

                </v-stepper-items>
            </v-stepper>


        </v-container>
    </v-app>
</template>

<script>
    export default {
        name: "SurveyQuestions",
        data: function() {
            return {
                questions: [
                    [
                        1,
                        "Le plan de la leçon a été présenté au début de chaque cours",
                        "1982-10-29T06:05:50.000+0000",
                        "1983-11-02T01:47:48.000+0000",
                        52
                    ],
                    [
                        2,
                        "L’horaire prévu pour les cours a été respecté.",
                        "1970-12-31T23:09:30.000+0000",
                        "1996-11-12T04:57:00.000+0000",
                        52
                    ],
                    [
                        3,
                        "De bonnes relations ont été entretenues avec nous.",
                        "1990-01-28T13:08:24.000+0000",
                        "1979-08-26T18:00:38.000+0000",
                        52
                    ],
                    [
                        4,
                        "De l’enthousiasme a été démontré en classe par l’enseignante ou l’enseignant.",
                        "1976-08-09T20:39:09.000+0000",
                        "2001-10-03T23:43:25.000+0000",
                        52
                    ],
                    [
                        5,
                        "Généralement, l’enseignante ou l’enseignant a utilisé un vocabulaire que nous comprenions bien.",
                        "1971-01-01T00:27:28.000+0000",
                        "1998-05-18T16:06:19.000+0000",
                        52
                    ]
                ],
                answers:{},
                sliders:{},
                checkboxes: {},
                test: {},
                stepper: {
                    e1: 1,
                },
            };
        },
        mounted() {
            this.$http.get(`${this.$store.state.backendHostName}/services/getPendingSurveyQuestions/${this.$route.params.id}/${this.$store.state.userInfo.id}`, {
                params:{},
                headers: {
                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(response => {
                console.log(response.status);
                this.questions = response.body;
                console.log(response.body);
            }, response => {
                console.log("error", response);
            });

            for (let q=0; q<this.questions.length; q++) {
                // console.log(this.questions[q]);
                this.sliders[this.questions[q][0]] = 1;
                this.answers[this.questions[q][0]] = 1;
                this.checkboxes[this.questions[q][0]] = false;
            }
            // console.log(this.checkboxes);
        },
        beforeCreate() {
            if (!this.$cookies.isKey("user")) {
                this.$router.push({name: "login"});
            }else {
                this.$store.commit('setUserInfo', this.$cookies.get("user"));
            }
        },
        methods: {
            submitSurveyAnswer: function () {
                for (let answer in this.answers){

                    let data = {};
                    data["id_survey"] = this.$route.params.id;
                    data["id_student"] = this.$store.state.userInfo.id;
                    data["id_question"] = answer;
                    data["comments"] = "";
                    data["is_na"] = false;
                    data["rating"] = 2;
                    data["mod_by"] = 52;
                    this.$http.post(`${this.$store.state.backendHostName}/services/save/StudentSurvey`, data)
                        .then(response => {
                        console.log(response.status);
                        console.log(response.body);
                        }, response => {
                            console.log("error", response);
                        });
                }
            },
            onResponseChanged(questionID, answer) {
                console.log(this.checkboxes);
                if (answer === true) {//checked
                    this.answers[questionID] = null;
                }
                else if (answer === false){//unchecked
                    this.answers[questionID] = this.sliders[questionID];
                }
                else {
                    this.answers[questionID] = answer;
                }
                console.log(this.answers)
            }
        },
        watch: {

        }
    }
</script>

<style scoped>

</style>
