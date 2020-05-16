import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ListCourse from '../views/ListCourse.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ListSurvey from "../views/ListSurvey";
import Index from "../views/dashboard/Index.vue";
import DashHeader  from "../components/dashboard/DashHeader.vue";
import SurveyQuestions from "../views/SurveyQuestions";

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    components: {default: Home, header: Header, footer: Footer}
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    components: {default: Index, dashcontent: DashHeader}
  },
  {
    path: '/courses',
    name: 'listCourses',
    components: {default: ListCourse, header: Header, footer: Footer}
  },
  {
    path: '/surveys',
    name: 'listSurveys',
    components: {default: ListSurvey, header: Header, footer: Footer}
  },
  {
    path: '/surveyQuestions/:id',
    name: 'surveyQuestions',
    components: {default: SurveyQuestions, header: Header, footer: Footer}
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
