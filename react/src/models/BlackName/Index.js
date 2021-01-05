/**
 * 作者：任华维
 * 日期：2017-07-31 
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：黑名单查询
 */
import * as blackNameServices from '../../services/BlackName/Index';
import config from '../../utils/config';
export default {
  namespace: 'blackName',
  state: {
    formData:{
      ACT_TAG:0,
      X_RESULTCODE:0,
      id:0,
      error:false,
    },
    chartData:{
      reqTimes:0,
      hitTimes:0,
      noHitTimes:0,
      drdsTimes:0,
      error:false
    }
  },
  reducers: {
    querySuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    queryFail (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    reportSuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    reportFail (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    clearSuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
  },
  effects: {
      /**
       * 作者：任华维
       * 创建日期：2017-8-11
       * 功能：黑名单查询列表
       * @param userID 用户id
       */
    *query ({ payload: userID }, { call, put }) {
        try {
               const res = yield call(blackNameServices.query, userID);
               const data = res.data;
               data.id = userID.userID;
               if (!data.errcode && data.X_RESULTCODE===0) {
                  yield put({
                    type: 'querySuccess',
                    payload: {formData:data}
                  })
               }
        } catch (e) {
                yield put({
                  type: 'queryFail',
                  payload: {formData:{error:true}}
                });
        }

    },
    /**
     * 作者：任华维
     * 创建日期：2017-8-11
     * 功能：服务器节点查询
     */
    *report ({}, { call, put }) {
        try {
             const res = yield call(blackNameServices.report);
             const data = res.data;
             if (!data.errcode) {
                yield put({
                  type: 'reportSuccess',
                  payload: {chartData:data}
                })
             } else {
               notification.error({ message: 'error', description: res.data.errmsg });
             }
        } catch (e) {
              yield put({
                type: 'reportFail',
                payload: {chartData:{error:true}}
              });
        }

    },
    /**
     * 作者：任华维
     * 创建日期：2017-8-11
     * 功能：清空表单数据
     */
    *clear ({}, { call, put }) {
        yield put({
          type: 'clearSuccess',
          payload: {formData:{}}
        })
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/blackName/index') {
          dispatch({ type: 'report', payload: query });
        }
      });
    },
  },
};
