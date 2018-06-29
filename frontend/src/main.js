// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import BuyCrypto from '@/components/Body/BuyCrypto/BuyCrypto'
import CheckoutForm from '@/components/Body/CheckoutForm/CheckoutForm'
import Promo1 from '@/components/Body/Promo1/Promo1'
import Promo2 from '@/components/Body/Promo2/Promo2'
import store from '@/store'

Vue.component('page-header', Header)
Vue.component('page-footer', Footer)
Vue.component('buy-crypto', BuyCrypto)
Vue.component('checkout-form', CheckoutForm)
Vue.component('promo1', Promo1)
Vue.component('promo2', Promo2)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
