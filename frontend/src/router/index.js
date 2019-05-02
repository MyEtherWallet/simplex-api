import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import LandingPage from '@/components/LandingPage'
import OrderStatus from '@/components/Body/OrderStatus/OrderStatus'
import xss from 'xss'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage
    }, {
      path: '/status/:userId',
      name: 'OrderStatus',
      component: OrderStatus,
      props: true
    }
  ]
})

router.beforeResolve((to, ___, next) => {
  const queryKeys = Object.keys(to.query)
  if (queryKeys.length > 0) {
    const blankObj = {}
    for (const key in to.query) {
      blankObj[key] = xss(to.query[key])
    }
    store.dispatch('saveQueryVal', blankObj)
    next()
  } else {
    next()
  }
})

export default router
