import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import Toasted from 'vue-toasted'
import VueClipboard from 'vue-clipboard2'
import VueRouter from 'vue-router'
import Cors from 'cors'
import Routes from './routes'
import request from 'request-promise'

const ToastedOptions = {
  position: 'bottom-center',
  duration: 4000,
  theme: 'bubble'
}

const router = new VueRouter({
  routes: Routes,
  mode: 'history'
})

Vue.config.productionTip = false

Vue.use(request)
Vue.use(VueRouter);
Vue.use(Cors)
Vue.use(VueResource)
Vue.use(Toasted, ToastedOptions)
Vue.use(VueClipboard)

new Vue({
  render: h => h(App),
  router: router,
  request: request,
}).$mount('#app')
