/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：dva默认启动入口
 */
import dva from 'dva';
import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';
import createLoading from 'dva-loading';
import { message } from 'antd';
import './utils/func';
import './index.html';
import './index.css';
import 'babel-polyfill'

const ERROR_MSG_DURATION = 3; // 3 秒
// const logout = r => (state, action) => {
//   const newState = r(state, action);
//   if (action.type == 'app/logoutSuccess') {
//     return {
//       routing: newState.routing,
//       app: newState.app,
//       loading:newState.loading,
//     }
//   }
//   else {
//     return newState
//   }
// };
// 1. Initialize
const app = dva({
  history: useRouterHistory(createHashHistory)({ queryKey: false }),
  onError(e) {
    message.error(e.message, ERROR_MSG_DURATION);
  },
  // onReducer: r => (state, action) => {
  //   const newState = r(state, action);
  //   if (action.payload && action.payload.actionType === 'app/logout') {
  //     return { app: newState.app, loading: newState.loading, routing: newState.routing };
  //   }
  //   return newState;
  // }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
// Moved to router.js

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
