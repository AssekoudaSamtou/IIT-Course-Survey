import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ListCourse from '../views/ListCourse.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ListSurvey from "../views/ListSurvey";
import Dashboard from "../views/dashboard/Dashboard.vue";
import Index  from "../components/dashboard/Index.vue";
import SurveyQuestions from "../views/SurveyQuestions";
import Students from "../components/dashboard/Students";
import Teachers from "../components/dashboard/Teachers";
import Terms from "../components/dashboard/Terms";
import Classes from "../components/dashboard/Classes";
import Subjects from "../components/dashboard/Subjects";
import Courses from "../components/dashboard/Courses";
import Questions from "../components/dashboard/Questions";
import CategorySurveys from "../components/dashboard/CategorySurveys";
import Surveys from "../components/dashboard/Surveys";
import Users from "../components/dashboard/Users";

Vue.use(VueRouter);

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
    components: {default: Dashboard},
    children: [
      {
        name: 'dashboard',
        path: '',
        component: Index
      },
      {
        name: 'students',
        path: 'students',
        component: Students
      },
      {
        name: 'teachers',
        path: 'teachers',
        component: Teachers
      },
      {
        name: 'terms',
        path: 'terms',
        component: Terms
      },
      {
        name: 'classes',
        path: 'classes',
        component: Classes
      },
      {
        name: 'subjects',
        path: 'subjects',
        component: Subjects
      },
      {
        name: 'courses',
        path: 'courses',
        component: Courses
      },
      {
        name: 'questions',
        path: 'questions',
        component: Questions
      },
      {
        name: 'cat_surveys',
        path: 'cat_surveys',
        component: CategorySurveys
      },
      {
        name: 'surveys',
        path: 'surveys',
        component: Surveys
      },
      {
        name: 'users',
        path: 'users',
        component: Users
      }
    ]
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
];

const router = new VueRouter({
  routes
});

export default router
