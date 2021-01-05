/**
 * 作者：窦阳春
 * 日期：2019-9-3
 * 邮箱：douyc@itnova.com.cn
 * 功能：印章证照申请
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';

export default {
  namespace: 'sealIndexApply',
  loading: false,
  state: {

  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({}, {call, put}) {


    },



  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/sealManage/sealLeaderApply') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
