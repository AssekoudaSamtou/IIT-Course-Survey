<template>
  <v-toolbar class="white">
    <div>
      <img
        src="../assets/img/ipnet.png" alt="Vuetify.js"
        @click="$router.push({name: 'Home'})"
        height="70%" width="200">
    </div>

    <v-spacer/>
    <v-toolbar-items>
      <v-btn to="/surveys" class="my_btn">Mes surveys</v-btn>
      <v-btn to="/dashboard" class="my_btn">ADMIN</v-btn>
      <v-btn @click.prevent="logout" v-if="$cookies.isKey('user')" class="my_btn">Déconnection</v-btn>
      <v-btn @click.prevent="logout" v-else class="my_btn">Connection</v-btn>

    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: "Header",

  props: {

  },

  methods: {
    logout: function () {
      this.$store.commit('setUserInfo', null);
      this.$cookies.remove('user');
      this.$router.push({name: "login"});
      console.log("logout");
    }
  },

  data: function() {
    return {
      account_list: {
        items: [
          { text: 'Real-Time', icon: 'mdi-clock' },
          { text: 'Audience', icon: 'mdi-account' },
          { text: 'Conversions', icon: 'mdi-flag' },
        ],
      }
    };
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
