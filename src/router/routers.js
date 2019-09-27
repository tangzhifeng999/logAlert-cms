import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'home',
    redirect: '/',
    component: Main,
    meta: {
      // hideInMenu: true,
      notCache: true,
      title: '首页'
    },
    children: [
      {
        path: '/',
        name: 'home',
        meta: {
          // hideInMenu: true,
          title: '首页',
          notCache: true,
          // icon: 'md-home'
        },
        component: () => import('@/view/home/home')
      },
    ]
  },
  {
    path: '/project',
    name: 'project',
    component: Main,
    meta: {
      // hideInMenu: true,
      notCache: true,
      title: '项目管理'
    },
    children: [
      {
        path: '/project',
        name: 'project',
        meta: {
          // hideInMenu: true,
          title: '项目管理',
          notCache: true,
          hideInBread: true
          // icon: 'md-home'
        },
        component: () => import('@/view/project/projectManager')
      },
      {
        path: 'projectDetail',
        name: 'projectDetail',
        meta: {
          title: '项目详情',
          hideInMenu: true,
          hideInBread: false
        },
        component: () => import('@/view/project/projectDetail')
      }
    ]
  },
  // {
  //   path: '/project',
  //   name: 'project',
  //   component: Main,
  //   meta: {
  //     title: '项目管理'
  //   },
  //   children: [
  //     {
  //       path: 'projectManager',
  //       name: 'projectManager',
  //       meta: {
  //         title: '项目管理'
  //       },
  //       component: () => import('@/view/project/projectManager')
  //     },
  //     {
  //       path: 'projectDetail',
  //       name: 'projectDetail',
  //       meta: {
  //         title: '项目详情',
  //         hideInMenu: true,
  //         hideInBread: false
  //       },
  //       component: () => import('@/view/project/projectDetail')
  //     }
  //   ]
  // },
  {
    path: '/notification',
    name: 'notification',
    component: Main,
    meta: {
      title: '告警管理'
    },
    children: [
      {
        path: 'notificationManager',
        name: 'notificationManager',
        meta: {
          title: '告警管理',
          hideInBread: true
        },
        component: () => import('@/view/notification/notificationManager')
      },
      {
        path: 'dealRecord',
        name: 'dealRecord',
        meta: {
          title: '处理记录',
          hideInMenu: true,
          hideInBread: false
        },
        component: () => import('@/view/notification/dealRecord')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    component: Main,
    meta: {
      title: '帐号管理'
    },
    children: [
      {
        path: 'accountManager',
        name: 'accountManager',
        meta: {
          title: '帐号管理',
          hideInBread: true
        },
        component: () => import('@/view/account/accountManager')
      }
    ]
  },
  // {
  //   path: '/report',
  //   name: 'report',
  //   component: Main,
  //   meta: {
  //     title: '日志管理'
  //   },
  //   children: [
  //     {
  //       path: 'reportManager',
  //       name: 'reportManager',
  //       meta: {
  //         title: '日志管理'
  //       },
  //       component: () => import('@/view/report/reportManager')
  //     },
  //     {
  //       path: 'addReport',
  //       name: 'addReport',
  //       meta: {
  //         title: '新建日志',
  //         hideInMenu: true
  //       },
  //       component: () => import('@/view/report/addReport')
  //     }
  //   ]
  // },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
