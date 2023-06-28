import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import Layout from '@/layout'

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          ///////////////////////////////////////////////////////////////////////////////////////////////////

          console.log(store.getters.roles);
          // 路由转换
          let myRoutes = [];
          const constantRoutesAdmin = [//导航栏路由
            {
              path: '/sysm',
              component: Layout,
              redirect: '/sysm/sysm',
              name: 'sysManagement',
              meta: { title: '系统管理', icon: 'el-icon-s-help' },
              children: [
                {
                  path: 'userm',
                  name: 'UserM',
                  component: () => import('@/views/sysm/UserM'),
                  meta: { title: '用户管理', icon: 'el-icon-user-solid' }
                },
                {
                  path: 'sysm',
                  name: 'SysM',
                  component: () => import('@/views/sysm/SysM'),
                  meta: { title: '系统公告', icon: 'el-icon-message-solid' }
                }
              ]
            },
            {
              path: '/house',
              component: Layout,
              redirect: '/house/housem',
              name: 'houseManagement',
              meta: { title: '房屋管理', icon: 'el-icon-office-building' },
              children: [
                {
                  path: 'houseinfo',
                  name: 'HouseInfo',
                  component: () => import('@/views/house/HouseM'),
                  meta: { title: '房屋信息管理', icon: 'el-icon-s-home' }
                },
                {
                  path: 'maintenance',
                  name: 'Maintenance',
                  component: () => import('@/views/house/Maintenance'),
                  meta: { title: '维修投诉管理', icon: 'el-icon-suitcase-1' }
                }
              ]
            },
            {
              path: '/parking',
              component: Layout,
              redirect: '/parking',
              name: 'parking',
              children: [{
                  path: 'parking',
                  name: 'parking',
                  component: () => import('@/views/parking/parking'),
                  meta: { title: '车位信息管理', icon: 'tingChe1' },
                }]
            },
            {
              path: '/charge',
              component: Layout,
              redirect: '/charge/chargem',
              name: 'chargeManagement',
              meta: { title: '收费管理', icon: 'shouFei01' },
              children: [
                {
                  path: 'chargem',
                  name: 'chargem',
                  component: () => import('@/views/charges/chargem'),
                  meta: { title: '收费信息管理', icon: 'shouFei02' }
                },
                {
                  path: 'chargepicture',
                  name: 'chargepicture',
                  component: () => import('@/views/charges/chargepicture'),
                  meta: { title: '收费信息统计图', icon: 'shouFei02' }
                }
              ]
            },
            { path: '*', redirect: '/404', hidden: true },


            // // 404 page must be placed at the end !!!
            // { path: '*', redirect: '/404', hidden: true }
          ]
          const constantRoutesOwner=[
            {
              path: '/pay',
              component: Layout,
              redirect: '/pay/ownerpay',
              name: 'pay',
              meta: { title: '业主缴费模块', icon: 'jiaoFei1' },
              children: [
                {
                  path: 'pay',
                  name: 'pay',
                  component: () => import('@/views/pay/ownerpay'),
                  meta: { title: '业主缴费', icon: 'jiaoFei2' }
                },
                {
                  path: 'paypicture',
                  name: 'paypicture',
                  component: () => import('@/views/pay/ownerpaypicture'),
                  meta: { title: '缴费信息图', icon: 'jiaoFei3' }
                }
              ]
            },
            {
              path: '/complaints',
              component: Layout,
              redirect: '/complaints/complaints',
              name: 'complaints',
              children: [{
                  path: 'ownercomplaints',
                  name: 'ownercomplaints',
                  component: () => import('@/views/complaints/complaints'),
                  meta: { title: '维修投诉模块', icon: 'jiaoFei1' },
                }]
            },
            {
              path: '/sysm',
              component: Layout,
              redirect: '/sysm/sysm',
              name: 'sysm',
              children: [{
                  path: 'sysm',
                  name: 'sysm',
                  component: () => import('@/views/sysm/SysM'),
                  meta: { title: '系统公告', icon: 'el-icon-message-solid' },
                }]
            },
            { path: '*', redirect: '/404', hidden: true },
          ]
          console.log(constantRoutesAdmin);
          if (store.getters.roles == 'admin') {
            for (let index = 0; index < constantRoutesAdmin.length; index++) {
              myRoutes.push(constantRoutesAdmin[index]);
            }
            // myRoutes.push(
            //   {
            //     path: '/sysm',
            //     component: Layout,
            //     redirect: '/sysm/sysm',
            //     name: 'sysManagement',
            //     meta: { title: '系统管理', icon: 'el-icon-s-help' },
            //     children: [
            //       {
            //         path: 'userm',
            //         name: 'UserM',
            //         component: () => import('@/views/sysm/UserM'),
            //         meta: { title: '用户管理', icon: 'el-icon-user-solid' }
            //       },
            //       {
            //         path: 'sysm',
            //         name: 'SysM',
            //         component: () => import('@/views/sysm/SysM'),
            //         meta: { title: '系统公告', icon: 'el-icon-message-solid' }
            //       }
            //     ]
            //   },
            //   {
            //     path: '/house',
            //     component: Layout,
            //     redirect: '/house/housem',
            //     name: 'houseManagement',
            //     meta: { title: '房屋管理', icon: 'el-icon-office-building' },
            //     children: [
            //       {
            //         path: 'houseinfo',
            //         name: 'HouseInfo',
            //         component: () => import('@/views/house/HouseM'),
            //         meta: { title: '房屋信息管理', icon: 'el-icon-s-home' }
            //       },
            //       {
            //         path: 'maintenance',
            //         name: 'Maintenance',
            //         component: () => import('@/views/house/Maintenance'),
            //         meta: { title: '维修管理', icon: 'el-icon-suitcase-1' }
            //       }
            //     ]
            //   },
            //   {
            //     path: '/charge',
            //     component: Layout,
            //     redirect: '/charge/chargem',
            //     name: 'chargeManagement',
            //     meta: { title: '收费管理', icon: 'shouFei01' },
            //     children: [
            //       {
            //         path: 'chargem',
            //         name: 'chargem',
            //         component: () => import('@/views/charges/chargem'),
            //         meta: { title: '收费信息管理', icon: 'shouFei02' }
            //       },
            //       {
            //         path: 'chargepicture',
            //         name: 'chargepicture',
            //         component: () => import('@/views/charges/chargepicture'),
            //         meta: { title: '收费信息统计图', icon: 'shouFei02' }
            //       }
            //     ]
            //   },
            //   { path: '*', redirect: '/404', hidden: true },
            // );
          } else if (store.getters.roles == 'owner') {
            for (let index = 0; index < constantRoutesOwner.length; index++) {
              myRoutes.push(constantRoutesOwner[index]);
            }
          }
          // 404
          // myRoutes.push(

          //     // 404 page must be placed at the end !!!
          //     { path: '*', redirect: '/404', hidden: true },

          //   {
          //   path: '*',
          //   redirect: '/404',
          //   hidden: true
          // },);
          // 动态添加路由
          router.addRoutes(myRoutes);
          // // 存至全局变量
          global.myRoutes = myRoutes;

          next({ ...to, replace: true })  // 防止刷新后页面空白

          // next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
