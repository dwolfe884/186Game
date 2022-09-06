import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import deck from './components/deck'
import {store} from './store'

Vue.use(Vuex);
new Vue({
  store,
  el: '#app',
  render: h => h(App)
})

