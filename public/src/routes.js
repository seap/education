import App from './containers/App';

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

  //我的作业
  const mytask = {
    path: '/mytask',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/MyTask').default));
    }
  };

  // 404
  const notFoundPage = {
    path: '*',
    getComponent(location, callback) {
      require.ensure([], require => callback(null, require('./containers/NotFoundPage').default));
    }
  }

  // 路由根目录
  const rootRoute = {
    path: '/',
    component: App,
    getIndexRoute(location, callback) {
      require.ensure([], require => callback(null, {component: require('./containers/Login').default}));
    },
    childRoutes: [bind, register, mytask, notFoundPage]
  };

  return rootRoute;
}

export default routes;
