/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：全局路由配置
 */
import React from 'react';
import {Router} from 'dva/router';
// import {commonRouterConfig} from './commonRouter';
import {compresensiveRouterConfig} from './compresensiveRouter';
// import {projectRouterConfig} from './projectRouter';
// import {humanRouterConfig} from './humanRouter';
// import {financeRouterConfig} from './financeRouter';

const cached = {};

function registerModel(app, model) {
  if (!cached[model.namespace]) {
    app.model(model);
    cached[model.namespace] = 1;
  }
}

function RouterConfig({history, app}) {
  /**
   * 优化生成路由
   * @param name
   * @returns {{path: *, name: *, getComponent: (function(*, *))}}
   */
  function makeRoute(name, needModel = false) {
    //正则匹配
    var url = name.replace(/\b(\w)|\s(\w)/g, first => first.toUpperCase());
    return {
      path: name,
      name: name,
      getComponent(nextState, cb) {
        require.ensure([], require => {
          if (needModel && !app._models.some(val => (val.namespace === url)))
            registerModel(app, require('./models/' + url));
          cb(null, require('./routes/' + url));
        });
      }
    }
  }

  const routes = [
    {
      path: '/',
      name: 'app',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/app'));
          cb(null, require('./routes/App'));
        });
      },
      indexRoute: {onEnter: (nextState, replace) => replace('/commonApp')},
      childRoutes: [
        {
          path: 'login',
          name: 'login'
        },
        {
          path: 'lock',
          name: 'lock'
        },
        {
          path: 'common/resetPassword/:email',
          name: 'resetPassword'
        },
        makeRoute('blackName/index', true),
      ]
    }
  ];
  // //首页路由
  // let commonRouter = commonRouterConfig({history, app,registerModel});
  // for(let i = 0; i < commonRouter.length;i++){
  //  routes[0].childRoutes.push(commonRouter[i])
  // }
  //综合路由
  let compresensiveRouter = compresensiveRouterConfig({history, app,registerModel});
  for(let i = 0; i < compresensiveRouter.length;i++){
    routes[0].childRoutes.push(compresensiveRouter[i])
  }
  // //  项目路由
  // let projectRouter = projectRouterConfig({history, app,registerModel});
  // for(let i = 0; i < projectRouter.length;i++){
  //   routes[0].childRoutes.push(projectRouter[i])
  // }
  // // // 人力路由
  // let humanR = humanRouterConfig({history, app,registerModel});
  // for(let i = 0; i < humanR.length;i++){
  // routes[0].childRoutes.push(humanR[i])
  // }
  // // // 财务路由
  // let financeRouter = financeRouterConfig({history, app,registerModel});
  // for(let i = 0; i < financeRouter.length;i++){
  //   routes[0].childRoutes.push(financeRouter[i])
  // }

  let lastRouter = {
    path: '*',
    getComponent(nextState, cb) {
      require.ensure([], require => {
        // cb(null, require('./routes/errorPage/index.js'))
      }, 'error')
    },
  }; /* 这是全局匹配路由，请保持在最底端 */

  routes[0].childRoutes.push(lastRouter)
  return <Router history={history} routes={routes}/>;
}

export default RouterConfig;
