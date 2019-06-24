import Vue from 'vue';
import VueRouter from 'vue-router';
import Favorite from '@/components/Favorite.vue';
import Index from '@/components/Index.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  // base: '/',
  routes: [
    {
      path: '/favorite',
      name: 'Favorite',
      component: Favorite,
    },
    {
      path: '/',
      name: 'index',
      component: Index,
    },
  ],
});
