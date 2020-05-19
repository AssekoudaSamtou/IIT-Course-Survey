<template>
  <v-toolbar class="white">
    <div>
      <img
        src="../assets/img/ipnet.png"
        alt="Vuetify.js"
        @click="$router.push({name: 'Home'})"
        height="70%"
        width="200"
      >
    </div>
    <!--      <v-toolbar-title class="mx-0" v-text="title"></v-toolbar-title>-->
    <!--      <p>Beta</p>-->
    <v-spacer/>
    <v-toolbar-items>
      <v-btn to="/surveys" class="my_btn">Mes surveys</v-btn>
      <v-btn to="/courses" class="my_btn">Mes cours</v-btn>
      <v-btn to="/login" class="my_btn">Connexion</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: "Header",

  props: {
    logo: String,
    title: String
  },

  data: function() {
    return {};
  },
  mounted() {
    this.$emit("connected");
  }
};
</script>

<style scoped>
.my_btn {
  background-color: #1976d2 !important;
  color: white;
}
</style>
