import Vue from 'vue'
import VueRouter from 'vue-router'
// import * as Vue from "vue"
import App from './App.vue'
import AudioVisual from 'vue-audio-visual'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(AudioVisual)

Vue.use(VueRouter)

Vue.config.productionTip = false


const router = new VueRouter({routes : []})
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
