import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () =>
        import('../views/Home.vue')
    },
    {
      path: '/ContactEach/:id',
      name: 'ContactEach',
      component: () =>
        import('../views/ContactEach.vue')
    },
    {
      path: '/test',
      name: 'Test',
      component: () =>
        import('../views/Test.vue')
    }
  ]
})

export default router
