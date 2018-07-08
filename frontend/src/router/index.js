import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import OrderStatus from '@/components/Body/OrderStatus/OrderStatus'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage
    }, {
      path: '/viewStatus/:userId',
      component: OrderStatus,
      props: true
    }
  ]
})
