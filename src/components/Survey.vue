<template>
    <v-app>
        <v-card class="mx-auto" max-width="400">
            <v-img class="white--text align-end" height="200px" src="../assets/img/Web-Survey.jpg">
<!--            <v-img class="white&#45;&#45;text align-end" height="200px" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">-->
<!--                <v-card-title>{{ survey[2] }}</v-card-title>-->
            </v-img>

<!--            <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>-->

            <v-card-text class="text--primary">
                <div style="font-weight: bolder">{{ survey[2] }}</div>
                <v-alert colored-border elevation="2" border="left" color="indigo">{{ survey[3] }}</v-alert>
            </v-card-text>

            <v-card-actions>
                <v-btn color="orange" text>Share</v-btn>

                <v-btn color="orange"
                       :to="`/surveyQuestions/${survey[0]}`"
                       @click="$store.commit('setCurrentSurvey', survey)" text>Explore</v-btn>
            </v-card-actions>
        </v-card>
    </v-app>
</template>

<script>
    export default {
        name: "Survey",
        props: {
            survey: Array
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
