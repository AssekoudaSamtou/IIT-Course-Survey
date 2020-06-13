<template>
  <v-app>

<!--    <Header :logo="imageLink.logo" :title="title"/>-->

    <v-content>
      <section>
<!--        <v-alert dismissible type="success">-->
<!--           <strong>connected successfuly</strong>-->
<!--        </v-alert>-->
        <v-parallax src="../assets/img/landing.jpg" height="600">
          <v-layout column align-center justify-center class="white--text">
            <h1 class="white--text mb-2 display-1 text-xs-center" style="font-weight: 900; text-shadow: 3px 2px #000000">La plate-forme des enquetes à IPNET University</h1>
            <div class="white--text subheading mb-3 text-xs-center" style="font-weight: 900; text-shadow: 2px 2px #000000">Dites-nous ce que vous penser vraiment des cours</div>
            <v-btn class="blue lighten-2 mt-5" dark large to="/surveys">
              parcourir
            </v-btn>
          </v-layout>
        </v-parallax>
      </section>


      <section>
        <v-container grid-list-xl>
          <v-layout row wrap justify-center class="my-5">
            <v-flex xs12 sm4>
              <v-card class="elevation-0 transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Company info</div>
                </v-card-title>
                <v-card-text>
                  We are not a company. We hate companies. Just imagine us like the guys from the Silicon Valley series.
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1>
              <v-card class="elevation-0 transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">We are hiring</div>
                </v-card-title>
                <v-card-text>
                  Are you a creative person? Do you like techy stuff? Complete the email form by writing your skills and interests
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </section>

      <section>
        <v-container>
          <v-layout>
            <v-flex xs12 class="text-xs-center">
                <img height="200px" src="../assets/img/wordpress-survey-plugins-featured-image.jpg">
            </v-flex>
          </v-layout>
        </v-container>
     </section>


<!--      <Footer/>-->

    </v-content>
</v-app>
</template>

<script>
export default {
  name: "App",
    data: function() {
    return {
      title: "Endorfine",
      imageLink: {
        main:
          "https://firebasestorage.googleapis.com/v0/b/endorfinevue.appspot.com/o/assets%2Fb13f0434-b228-11e6-8e5d-5252025056ab_web_scale_0.4666667_0.4666667__.jpg?alt=media&token=660df23e-599e-434b-9313-ba69c973eeea",
        sub_main:
          "../assets/landing.jpg",
        logo:
          "../assets/ipnet.png",
        social_cover:
          "https://firebasestorage.googleapis.com/v0/b/endorfinevue.appspot.com/o/assets%2Fo-NIGHTCLUB-facebook.jpg?alt=media&token=cefc5c4c-9714-41da-9c22-f63caf5e89a4"
      },
      email: "",
      emailRules: [
        v => {
          return !!v || "E-mail is required";
        },
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      subscribed: false
    };
  },
  methods: {
    subscribe: function() {
      this.subscribed = !this.subscribed;
    }
  },

  computed: {},

  mounted: function() {
    
  },
  beforeCreate() {
      // if (!this.$cookies.isKey("user")) {
      //     this.$router.push({name: "login"});
      // }else {
      //     this.$store.commit('setUserInfo', this.$cookies.get("user"));
      // }
  }
};
</script>

<style scoped>
.finedTitle {
  font-weight: 900;
  text-shadow: 2px 2px #000000;
}

.social-icon {
  font-size: 21px;
  color: white;
}
</style>
