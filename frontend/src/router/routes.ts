import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        redirect: '/map'
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/Login.vue')
      },
      {
        path: 'form',
        name: 'form',
        component: () => import('pages/Form.vue')
      },
      {
        path: 'users',
        name: 'users',
        meta: {
          roles: ['admin']
        },
        component: () => import('pages/Users.vue')
      },
      {
        path: 'comments',
        name: 'comments',
        meta: {
          roles: ['admin']
        },
        component: () => import('pages/Comments.vue')
      },
      {
        path: 'points',
        name: 'points',
        meta: {
          roles: ['admin']
        },
        component: () => import('pages/Points.vue')
      },
      {
        path: 'map_municipal',
        name: 'map_municipal',
        meta: {
          roles: ['admin']
        },
        component: () => import('pages/Map_municipal.vue')
      },
      {
        path: 'map',
        name: 'map',
        meta: {
          roles: ['admin']
        },
        component: () => import('pages/Map.vue')
      }
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
