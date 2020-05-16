<template>
    <v-app>
        <v-app-bar color="deep-purple" dark>
          <v-app-bar-nav-icon @click="drawer = true"/>

          <v-toolbar-title>Title</v-toolbar-title>
        </v-app-bar>
    </v-app>
</template>

<script>
    export default {
        name: "DashHeader",
        props: {
            drawer: Boolean
        },
        data: function() {
            return {

            };
        }
    }
</script>

<style scoped>

</style>
