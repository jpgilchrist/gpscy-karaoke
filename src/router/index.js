import Vue from 'vue'
import Router from 'vue-router'
import PlayList from '@/components/PlayList.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PlayList',
      component: PlayList
    }
  ]
})
