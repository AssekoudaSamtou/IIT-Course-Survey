<template>
  <div id="app">
    <router-view name="header"/>
    <router-view style="margin-bottom: 100px;"/>
    <router-view name="footer"/>
  </div>
</template>

<script>
  export default {
    name: "App",
    props: {

    },
    data: function() {
      return {
         
      };
   },
   methods: {
     test: function() {
       console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
     }
   }
  }
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
