import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
Vue.use(VueRouter)

const Foo = { template: '<div>foo</div>' }

const Foo2 = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ template: '<div>foo2</div>' })
    }, 2000)
  })
}

const Bar = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ template: '<div>bar<router-view></router-view></div>' })
    }, 2000)
  })
}

const BarChildRoutes = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res([{ path: 'foo', component: Foo }, { path: 'foo2', component: Foo2 }])
    }, 2000)
  })
}


const routes = [
  { path: '/', component: App },
  { path: '/404', component: { template: '<div>404</div>'} },
  { path: '/bar', component: Bar , children: []}
]

const router = new VueRouter({
  routes
})

let tryTime = 0
router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.matched.length) {
    console.log('matched')
    tryTime = 0
    next()
  } else {
    BarChildRoutes()
    .then(childRoutes => {
      if (tryTime > 0) {
        next('/404')
        return
      } 
      tryTime ++
      let routeParent = routes.find(item => item.path === '/bar')
      routeParent.children = childRoutes
      router.addRoutes([routeParent])
      next(to.path)
    })
  }
})

router.beforeResolve((to, from, next) => {
  console.log(to, from)
  next()
})

router.afterEach((to, from) => {
  console.log('3')
})

new Vue({
  router,
  el: '#app'
})
