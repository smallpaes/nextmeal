import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import ImageKit from 'imagekitio-vue'

import moment from 'moment-timezone'
import 'moment/locale/zh-tw'

moment.tz.setDefault(process.env.VUE_APP_TIMEZONE || 'Asia/Taipei')
moment.locale('zh-tw')

Vue.config.productionTip = false

Vue.use(Vuelidate)

Vue.use(ImageKit, {
  urlEndpoint: process.env.VUE_APP_IMAGEKIT_URL_ENDPOINT
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
