<template>
<!--    <v-app>-->
        <v-card class="mx-auto" max-width="400">
            <v-img class="white--text align-end" height="200px" src="../assets/img/Web-Survey.jpg">
            </v-img>

            <v-card-text class="text--primary">
                <div style="font-weight: bolder">{{ survey.title }}</div>
                <v-alert colored-border elevation="2" border="left" color="indigo">{{ survey.description }}</v-alert>
            </v-card-text>

            <v-card-actions>

                <v-btn color="orange" v-if="survey.status < 2"
                       :to="`/surveyQuestions/${survey.id}`"
                       @click="$store.commit('setCurrentSurvey', survey)" text>
                    répondre
                </v-btn>
            </v-card-actions>
        </v-card>
<!--    </v-app>-->
</template>

<script>
    export default {
        name: "Survey",
        props: {
            survey: Object
        },
        data: function() {
            return {

            };
        },
        methods: {
            randomImg: function () {

            }
        }
    }
</script>

<style scoped>

</style>
