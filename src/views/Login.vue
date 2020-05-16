<template>
   <v-app id="inspire">
      <v-content>
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                    <v-alert type="error" v-show="loginIsFailed">
                        Username ou Password invalide
                    </v-alert>
                     <v-toolbar dark color="primary">
                        <v-toolbar-items>
                          <v-btn class="auth_btn" @click="toggleForms('login')">Connection</v-btn>
                          <v-btn class="auth_btn" @click="toggleForms('register')">Inscription</v-btn>
                        </v-toolbar-items>
                     </v-toolbar>
                     <v-card-text>

                        <v-form v-show="showLoginForm">
<!--                           login form-->
                          <v-text-field
                              prepend-icon="mdi-account"
                              name="username"
                              v-model="loginForm.username"
                              label="Username"
                              type="text"
                          />
                          <v-text-field
                              id="password"
                              prepend-icon="mdi-lock"
                              name="password"
                              v-model="loginForm.password"
                              label="Password"
                              type="password"
                          />
                        </v-form>

<!--                        register form-->
                        <v-form v-show="showRegisterForm">
                            <v-text-field
                                prepend-icon="mdi-account"
                                name="firstName"
                                v-model="registerForm.firstName"
                                label="Nom"
                                type="text"
                            />
                            <v-text-field
                                prepend-icon="mdi-account"
                                name="lastName"
                                v-model="registerForm.lastName"
                                label="Prénom"
                                type="text"
                            />
                            <v-text-field
                                prepend-icon="mdi-account"
                                name="username"
                                v-model="registerForm.userName"
                                label="Nom d'utilisateur"
                                type="text"
                            />
                            <v-text-field
                                prepend-icon="mdi-account"
                                name="phone"
                                v-model="registerForm.phone"
                                label="Téléphone"
                                type="text"
                            />
                            <v-text-field
                                prepend-icon="mdi-account"
                                name="email"
                                v-model="registerForm.email"
                                label="Email"
                                type="email"
                            />
                            <v-text-field
                                prepend-icon="mdi-lock"
                                name="password"
                                v-model="registerForm.password"
                                label="Mot de passe"
                                type="password"
                            />
                            <v-text-field
                                id="r-password"
                                prepend-icon="mdi-lock"
                                name="password"
                                v-model="registerForm.r_password"
                                label="Repeter Mot de passe"
                                type="password"
                            />
                        </v-form>

                     </v-card-text>
                     <v-card-actions>
                         <v-spacer/>
                        <v-btn color="primary" v-show="showLoginBtn" @click.prevent="login">Se connecter</v-btn>
                        <v-btn color="primary" v-show="showRegisterBtn" to="/">S'inscrire</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
      </v-content>
   </v-app>
</template>

<script>
import {mapMutations} from "vuex";

export default {
   name: 'Login',
   props: {
      source: String,
   },

   data: function() {
      return {
         showLoginForm: true,
         showLoginBtn: true,
         showRegisterForm: false,
         showRegisterBtn: false,
         loginForm: {
             username: "",
             password: ""
         },
          registerForm: {
             type: "",
             firstName: "",
             lastName: "",
             userName: "",
             phone: "",
             email: "",
             password: "",
             r_password: "",
             role: []
          },
          loginIsFailed: false
      };
   },

   methods: {

       ...mapMutations([
           'setUserInfo'
       ]),

      toggleForms(form) {
         if ((form === "login" && !this.showLoginForm) || (form === "register" && !this.showRegisterForm)) {
            this.showLoginForm = !this.showLoginForm;
            this.showLoginBtn = !this.showLoginBtn;
            this.showRegisterForm = !this.showRegisterForm;
            this.showRegisterBtn = !this.showRegisterBtn;
         }
      },

       login() {
            if (this.loginForm.username !== "" && this.loginForm.password !== "") {
                var data = {
                    "username":this.loginForm.username,
                    "password":this.loginForm.password
                };
                this.$http.post('http://ec2-18-224-141-43.us-east-2.compute.amazonaws.com/services/api/auth/signin', data).then(response => {
                console.log(response.status);

                // get status text
                console.log(response.statusText);

                // get 'Expires' header
                console.log(response.headers.get('Expires'));

                // get body data
                console.log(response.body);

                // this.$store.dispatch('activateLink', { index });
                this.$store.commit('setUserInfo', response.body);
                this.$router.push({name: "Home"});

              }, response => {
                console.log(response);
                this.loginIsFailed = true;
              });
            }
       }
   },
};
</script>

<style scoped>
   .auth_btn{
      width: 74%;
   }
</style>

