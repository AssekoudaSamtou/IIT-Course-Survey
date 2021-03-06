import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: null,
    backendHostName: "http://ec2-18-224-141-43.us-east-2.compute.amazonaws.com",
    currentSurvey: {},
    surveyAnswerSubmitted: true
  },
  mutations: {
    setUserInfo(state, info) {
      state.userInfo = info;
      Vue.$cookies.set('user', info);
      if(info === null)
        Vue.$cookies.remove('user');

      // Vue.http.headers.common['Content-Type'] = "application/json";
      // Vue.http.headers.common['Authorization'] = `${info.tokenType} ${info.accessToken}`;
      // Vue.http.headers.common['Access-Control-Allow-Origin'] = true;
    },
    setCurrentSurvey(state, survey) {
      console.log("set!!!!!!!!!");
      state.currentSurvey = survey;
    },

    setSurveyAnswerSubmitted(state, value) {
      state.currentSurvey = value;
    }
  },
  actions: {
  },
  modules: {
  }
})
