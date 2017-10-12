import Vue from 'vue'
import Router from 'vue-router'
import PlayList from '@/components/PlayList.vue'
import 'font-awesome/css/font-awesome.css'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PlayList',
      component: PlayList
    }
  ]
})
