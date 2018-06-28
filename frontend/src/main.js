// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import Vuex from 'vuex'
import App from './App'
import router from './router'
// import VeeValidate from 'vee-validate'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import BuyBtc from '@/components/Body/BuyBtc/BuyBtc'
import Promo1 from '@/components/Body/Promo1/Promo1'
import Promo2 from '@/components/Body/Promo2/Promo2'
import Promo3 from '@/components/Body/Promo3/Promo3'
import store from '@/store'

// Vue.use(Vuex)
// Vue.use(VeeValidate)
Vue.component('page-header', Header)
Vue.component('page-footer', Footer)
Vue.component('buy-btc', BuyBtc)
Vue.component('promo1', Promo1)
Vue.component('promo2', Promo2)
Vue.component('promo3', Promo3)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
