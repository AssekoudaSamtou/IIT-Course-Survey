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

                        <v-form v-show="showLoginForm" id="signinForm">
<!--                           login form-->
                          <v-text-field
                              prepend-icon="mdi-account"
                              name="username"
                              v-model="loginForm.username"
                              label="Username"
                              type="text" required="true"
                          />
                          <v-text-field
                              id="password"
                              prepend-icon="mdi-lock"
                              name="password"
                              v-model="loginForm.password"
                              label="Password"
                              type="password" required="true"
                          />
                        </v-form>

<!--                        register form-->
                        <v-form v-show="showRegisterForm" id="signupForm">
                            <v-text-field
                                prepend-icon="mdi-account"
                                name="firstName"
                                v-model="registerForm.firstName"
                                label="Nom"
                                type="text" required="true"
                            />
                            <v-text-field
                                prepend-icon="mdi-account"
                                name="lastName"
                                v-model="registerForm.lastName"
                                label="Prénom"
                                type="text" required="true"
                            />
                            <v-text-field
                                prepend-icon="mdi-account"
                                name="username"
                                v-model="registerForm.userName"
                                label="Nom d'utilisateur"
                                type="text" required="true"
                            />
                            <v-text-field
                                prepend-icon="mdi-account"
                                name="phone"
                                v-model="registerForm.phone"
                                label="Téléphone"
                                type="text" required="true"
                            />
                            <v-text-field
                                prepend-icon="mdi-account"
                                name="email"
                                v-model="registerForm.email"
                                label="Email"
                                type="email" required="true"
                            />
                            <v-text-field
                                prepend-icon="mdi-lock"
                                name="password"
                                v-model="registerForm.password"
                                label="Mot de passe"
                                type="password" required="true"
                            />
                            <v-text-field
                                id="r-password"
                                prepend-icon="mdi-lock"
                                name="password"
                                v-model="registerForm.r_password"
                                label="Repeter Mot de passe"
                                type="password" required="true"
                            />
                        </v-form>

                     </v-card-text>
                     <v-card-actions>
                         <v-spacer/>
                        <v-btn color="primary" v-show="showLoginBtn" @click.prevent="login('', '')">Se connecter</v-btn>
                        <v-btn color="primary" v-show="showRegisterBtn" @click.prevent="signup">S'inscrire</v-btn>
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

       login(username, password) {
           var data;
           if(username ==="" || password === "") {
               data = {
                    "userName":this.loginForm.username,
                    "password":this.loginForm.password
                };
           }
           else {
               data = {
                    "userName":username,
                    "password":password
                };
           }
            if (document.getElementById("signinForm").reportValidity() === true) {
                this.$http.post('http://ec2-18-224-141-43.us-east-2.compute.amazonaws.com/services/api/auth/signin', data).then(response => {
                this.$store.commit('setUserInfo', response.body);
                this.$router.push({name: "Home"});


              }, response => {
                console.log(response);
                this.loginIsFailed = true;
              });
            }
       },

       signup() {
           if (document.getElementById("signupForm").reportValidity() === true) {
                var data = {
                    "type" : "user",
                    "id" : null,
                    "createDateTime" : Math.floor(Date.now() / 1000),
                    "modDateTime" : Math.floor(Date.now() / 1000),
                    "modBy" : 1,
                    "error" : null,
                    "firstName" : this.registerForm.firstName,
                    "lastName" : this.registerForm.lastName,
                    "phone" : this.registerForm.phone,
                    "email" : this.registerForm.email,
                    "role" : ["user"],
                    "userName":this.registerForm.userName,
                    "password":this.registerForm.password
                };
                this.$http.post('http://ec2-18-224-141-43.us-east-2.compute.amazonaws.com/services/api/auth/signup', data).then(response => {

                    let student = {
                        type: "student",
                        matricule: `STU-${response.body.id}`,
                        id_user: response.body.id,
                        modBy: this.$store.state.userInfo.id,
                    };

                    this.$http.post('http://ec2-18-224-141-43.us-east-2.compute.amazonaws.com/services/save/student', student).then(response => {

                        console.log(response.body);

                    },response => {
                        console.log(response);
                    });

                    console.log(response.body);
                    this.toggleForms("login");
                    this.loginForm.username = response.body.userName;

              }, response => {
                console.log(response);
                // this.loginIsFailed = true;
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

