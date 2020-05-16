<template>
    <v-app>
        <div data-app>
            <v-container fluid>
                <v-row align="center">
                    <v-col class="d-flex" cols="3" sm="3">
                        <v-select :items="items" :label="label" dense outlined/>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-row align="center" justify="center" class="grey lighten-5" style="height: 300px;">
                            <Survey v-for="survey in surveys" :key="survey[0]" :survey="survey" class="survey"/>
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
                    [
                        1,
                        1,
                        "Evaluation du cours de Base de donnee",
                        "il s'agit d'avoir un retour sur le bon fonctionnement des cours de Base de donnee",
                        "Veuillez remplir ce formulaire ",
                        "Merci pour votre patience",
                        "2018-04-05T04:27:23.000+0000",
                        "2020-07-06T20:55:13.000+0000",
                        3,
                        "2020-07-05T22:16:51.000+0000",
                        "1970-12-31T23:01:31.000+0000",
                        0,
                        1
                    ],
                    [
                        2,
                        1,
                        "Evaluation du cours de POO",
                        "il s'agit d'avoir un retour sur le bon fonctionnement des cours de POO",
                        "Veuillez remplir ce formulaire ",
                        "Merci pour votre patience",
                        "2004-09-13T03:00:15.000+0000",
                        "2020-03-16T10:55:49.000+0000",
                        2,
                        "1970-12-31T23:01:29.000+0000",
                        "1970-12-31T23:01:49.000+0000",
                        1,
                        1
                    ],
                    [
                        3,
                        4,
                        "Evaluation du Professeur de Base de donnee",
                        "il s'agit d'avoir un retour sur le professeur charge du cours de base de donnéé",
                        "Veuillez remplir ce formulaire ",
                        "Merci pour votre patience",
                        "2002-01-24T01:57:49.000+0000",
                        "2020-03-16T10:55:49.000+0000",
                        3,
                        "2009-03-06T15:42:31.000+0000",
                        "1971-09-22T20:16:39.000+0000",
                        2,
                        2
                    ],
                    [
                        4,
                        4,
                        "Evaluation du Professeur de POO",
                        "il s'agit d'avoir un retour sur le professeur charge du cours de base de donnéé",
                        "Veuillez remplir ce formulaire ",
                        "Merci pour votre patience",
                        "2009-09-25T05:44:22.000+0000",
                        "2020-07-06T20:55:13.000+0000",
                        1,
                        "1970-12-31T23:00:54.000+0000",
                        "1970-12-31T23:00:06.000+0000",
                        3,
                        3
                    ]
                ]
            };
        },
        mounted() {
            console.log(this.$store.state.userInfo.tokenType);
            this.$http.get(`${this.$store.state.backendHostName}/services/getPendingSurvey/${this.$store.state.userInfo.id}`, {
                params:{},
                headers: {
                    'Authorization': `${this.$store.state.userInfo.tokenType} ${this.$store.state.userInfo.accessToken}`,
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
                    // 'Access-Control-Allow-Origin': 'http://localhost:8080/',
                    'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(response => {
                console.log(response.status);
                this.surveys = response.body;
                console.log(response.body);
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
