import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';


Vue.config.productionTip = false;

Vue.use(VueResource);
Vue.use(VueCookies);
Vue.use(Donut);

Vue.$cookies.config('7d');

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
