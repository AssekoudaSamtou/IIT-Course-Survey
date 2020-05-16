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
    <!--                        <v-card v-for="n in 3" :key="n" class="ma-3 pa-6" outlined tile>Column</v-card>-->
                            <course v-for="n in 3" :key="n" class="course"/>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </v-app>
</template>

<script>
    import Course from "../components/Course";


    export default {
        name: "ListCourse",
        components: {Course},
        data: function() {
            return {
                items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
                label: "Afficher",
            };
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
    .course {
        margin-left: 30px;
    }
</style>
