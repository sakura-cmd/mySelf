import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// axios.defaults.baseURL = '/api'
// axios.defaults.baseURL = 'https://www.fastmock.site/mock/a631aea78706aa57ccde0e1f11aac78d/demo'

import loading from '../src/components/loading/loading.vue'
Vue.use(loading)
Vue.prototype.$axios = axios

// axios请求拦截器
axios.interceptors.request.use(config => {
  console.log(123)
  return config
}, err => {
  return Promise.reject(err)
})

// 添加响应拦截器
axios.interceptors.response.use(res => {
  console.log(456)
  return res
},
err => {
  return Promise.reject(err)
})
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router: router,
  store: store,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
// # sourceMappingURL=main.js.map
