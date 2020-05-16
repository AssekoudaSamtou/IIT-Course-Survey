<template>
  <v-card data-app class="mx-auto overflow-hidden" >
    <v-app-bar color="#fcb69f" dark src="https://picsum.photos/1920/1080?random">
      <v-app-bar-nav-icon @click="drawer = true"/>

      <v-toolbar-title>Dashboard</v-toolbar-title>

      <v-spacer/>

      <v-btn icon color="#000">
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">

          <v-btn icon color="#000" v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>

        </template>

        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" @click="1">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Etudiant</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Professeurs</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Surveys</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Matieres</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Questions</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Categories Survey</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-content>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view name="dashcontent"></router-view>
    </v-container>
  </v-content>
  </v-card>
</template>

<script>
    export default {
        name: "Index",
        data: function() {
            return {
              drawer: false,
              group: 1,
              items: [
                { title: 'logout' },
                { title: 'profile' },
              ],
            };
        }
    }
</script>

<style scoped>

</style>
