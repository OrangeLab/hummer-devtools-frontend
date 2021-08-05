import './../../assets/qrcode.js'

import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../../assets/highlight'
import '../../assets/highlight.css'

Vue.config.productionTip = false

Vue.use(window.hljs.vuePlugin)
Vue.use(ElementUI)

new Vue({
  render: h => h(App)
}).$mount('#app')
