import App from './containers/App';
import { resetState } from './actions';

if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

function routes(store){

  //注册
  const register = {
    path: '/register',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/UserRegister').default));
    }
  };

  //绑定
  const bind = {
    path: '/bind',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/UserBinding').default));
    }
  };

  //付款
  const payment = {
    path: '/payment',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/Payment').default));
    }
  };

  //报名
  const enroll = {
    path: '/enroll',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/Enroll').default));
    }
  };

  //个人信息
  const memberInfo = {
    path: '/member',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/MemberInfo').default));
    }
  };

  //修改密码
  const password = {
    path: '/password',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/Password').default));
    }
  };

  //修改手机号
  const phone = {
    path: '/phone',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/Phone').default));
    }
  };

  //我的作业
  const taskList = {
    path: '/task/list',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/TaskList').default));
    }
  };

  //作业详情
  const taskDetail = {
    path: '/task/detail/:taskId',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/TaskDetail').default));
    }
  };

  //板书列表
  const writeonList = {
    path: '/writeon/list',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/WriteonList').default));
    }
  };

  //板书详情
  const writeonDetail = {
    path: '/writeon/detail/:writeonId',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/WriteonDetail').default));
    }
  };

  //辅导材料列表
  const stuffList = {
    path: '/stuff/list',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/StuffList').default));
    }
  };

  //辅导材料详情
  const stuffDetail = {
    path: '/stuff/detail/:stuffId',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/StuffDetail').default));
    }
  };

  //公告列表
  const noticeList = {
    path: '/notice/list',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/NoticeList').default));
    }
  };

  //公告详情
  const noticeDetail = {
    path: '/notice/detail/:noticeId',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/NoticeDetail').default));
    }
  };

  // 404
  const notFoundPage = {
    path: '*',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/NotFoundPage').default));
    }
  };

  // 路由根目录
  const rootRoute = {
    path: '/',
    component: App,
    getIndexRoute(location, callback) {
      require.ensure([], require => callback(null, {component: require('./containers/Login').default}));
    },
    childRoutes: [bind, memberInfo, password, enroll, phone, register, payment, taskList, taskDetail, writeonList, writeonDetail, stuffList, stuffDetail, noticeList, noticeDetail, notFoundPage]
  };

  return rootRoute;
}

export default routes;
