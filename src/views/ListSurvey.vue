<template>
    <v-app>
        <div data-app>
            <v-container fluid>
                <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="12">
                        <v-alert dense outlined type="error" width="100%">
                            <strong>Liste des surveys en attente!</strong>
                        </v-alert>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-row align="center" justify="center" class="grey lighten-5">
                            <Survey v-for="survey in surveys" :key="survey.id" :survey="survey" class="survey"/>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>



            <v-container fluid>
                <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="12">
                        <v-alert dense outlined type="success" width="100%">
                            <strong>Liste des surveys déja passés!</strong>
                        </v-alert>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-row align="center" justify="center" class="grey lighten-5">
                            <Survey v-for="survey in passed_surveys" :key="survey.id" :survey="survey" class="survey"/>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </v-app>
</template>

<script>
    import Survey from "../components/Survey";
    export default {
        name: "ListSurvey",
        components: {Survey},
        data: function() {
            return {
                items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
                label: "Afficher",
                surveys: [
                    {
                        "id": 1,
                        "createDateTime": "2020-07-05T22:16:51.000+0000",
                        "modDateTime": "1970-12-31T23:01:31.000+0000",
                        "modBy": 0,
                        "error": null,
                        "title": "Evaluation du cours de Base de donnee",
                        "description": "il s'agit d'avoir un retour sur le bon fonctionnement des cours de Base de donnee",
                        "beginMessage": "Veuillez remplir ce formulaire ",
                        "endMessage": "Merci pour votre patience",
                        "beginDate": "2018-04-05T04:27:23.000+0000",
                        "endDate": "2020-07-06T20:55:13.000+0000",
                        "status": 1
                    },
                ],

                passed_surveys: [
                    {
                        "id": 1,
                        "createDateTime": "2020-07-05T22:16:51.000+0000",
                        "modDateTime": "1970-12-31T23:01:31.000+0000",
                        "modBy": 0,
                        "error": null,
                        "title": "Evaluation du cours de Base de donnee",
                        "description": "il s'agit d'avoir un retour sur le bon fonctionnement des cours de Base de donnee",
                        "beginMessage": "Veuillez remplir ce formulaire ",
                        "endMessage": "Merci pour votre patience",
                        "beginDate": "2018-04-05T04:27:23.000+0000",
                        "endDate": "2020-07-06T20:55:13.000+0000",
                        "status": 1
                    },
                ],
            };
        },

        methods: {
            getPassedSurveys: function () {
                this.$http.get(`${this.$store.state.backendHostName}/services/getAll/survey`, {
                    params:{},
                    headers: {
                        'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }).then(response => {
                    this.passed_surveys = response.body.filter(survey => {

                        this.$http.get(`${this.$store.state.backendHostName}/services/getPendingSurveyQuestions/${survey.id}/${this.$store.state.userInfo.id}`, {
                            params:{},
                            headers: {
                                'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                                'Content-Type': 'application/json',
                            }
                        }).then(response => {

                            return response.body.length === 0;


                        }, response => {
                            console.log("error", response);
                            return false;
                        });

                    });
                    console.log(this.passed_surveys);
                }, response => {
                    console.log("error", response);
                });
            }
        },

        mounted() {
            console.log(this.$store.state.userInfo.tokenType);
            this.$http.get(`${this.$store.state.backendHostName}/services/getPendingSurvey/${this.$store.state.userInfo.id}`, {
                params:{},
                headers: {
                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                    'Content-Type': 'application/json',
                }
            }).then(response => {

                this.surveys = response.body;
                this.getPassedSurveys();

            }, response => {
                console.log("error", response);
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
    .survey {
        margin-left: 30px;
        margin-bottom: 60px;
    }
</style>
