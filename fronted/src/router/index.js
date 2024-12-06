// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import ContactView from '../views/ContactView.vue';
import IndexView from '../views/IndexView.vue';
import DetailView from '../views/DetailView.vue';
import CheckList from '../views/CheckListView.vue';
import dbUtils from '../libs/util.strotage.js'
import {useSearchStore} from '@/stores/search.js'
import MainLayout from './../components/MainLayout.vue'
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '/index',
        name: 'Index',
        meta: {
          cache: true,
          title: '首页',
          icon: 'shouye',
          requiresAuth: false,
        },
        component: IndexView,
      },
      {
        path: '/detail/:id',
        name: 'Detail',
        meta: {
          cache: true,
          title: '详情页',
          icon: 'shouye',
          requiresAuth: false,
        },
        component: DetailView,
      },
      {
        path: '',
        name: 'CheckList',
        meta: {
          cache: true,
          title: '清单页',
          icon: 'shouye',
          requiresAuth: false,
        },
        component: CheckList,
      },
    ]
  },
    
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/dir-login-info.vue'),
  },    
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
  },
  // 可以在这里添加更多路由规则
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
function hasPermission(perms, route) {
  if (perms.includes('*')) return true
  if (route.meta && route.meta.perms) {
      // 如果路由对象定义了 meta 属性或者定义 meta.perms 属性，那么就根据权限值来判断是否具有权限
      return perms.some(perm => route.meta.perms.includes(perm))
  } else {
      // 如果路由对象没有定义 meta 属性或者没有定义 meta.perms 属性，那么默认认为具有权限，返回 true。
      return true
  }
}

router.beforeEach(async (to, from, next) => {
  const searchStore = useSearchStore()
  searchStore.showSearchPanel(false)
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
      const isLoggedIn = dbUtils.get('Fronttoken')
      console.log("********************************");
      console.log(isLoggedIn);
      // 检查用户是否已经登录
      if (isLoggedIn) {
          // 已经登录 访问登录页则直接跳到主页
          if (to.name === 'login') {
              return next('/');
          }
          // 已经登录 访问非登录页则需要验证权限
          const permissionList = dbUtils.get('Frontperms');
          // 如果还未找到缓存的权限数组则返回登录页
          if (!permissionList) {
              // 清空所有缓存数据
              dbUtils.clear()
              // 重定向到登录页
              return next({name: 'login'});
          }
          const hasRoles = hasPermission(permissionList, to)
          if (hasRoles) {
              // 有权限直接访问
              return next();
          }
          // 无权限则重定向到401
          return next({name: '401'});
      }
      // 未登录
      // 清空所有缓存数据
      dbUtils.clear()
      // 重定向到登录页
      return next({name: 'Login'});
  }
  // 无需登录的页面 直接访问即可
  next();
});




router.onError((error) => {
  // 在这里处理路由错误
  console.error('路由错误:', error);
});


export default router;
