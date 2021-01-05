/**
  * 作者： 王均超
  * 创建日期：2019-07-02
  * 邮箱:  wangjc@itnova.com.cn
  * 功能： 查询记录数据处理层
  */
import { message } from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../../services/workStation/workStation.js';

export default {
  namespace: 'queryRecord',
  state: {

  },

  reducers: {
    saveQueryRecord(state, { queryList: DataRows, RowCount: RowCount }) {
      return { ...state, queryList: DataRows, RowCount: RowCount };
    },
  },

  effects: {

    *queryApplyHistory({ data }, { call, put }) {
      const { DataRows, RowCount, RetCode } = yield call(usersService.queryApplyHistory, { ...data });
      if (RetCode == '1') {
        yield put({
          type: 'saveQueryRecord',
          queryList: DataRows,
          RowCount: RowCount,
        });
      }
    },
  },


  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/compRes/queryRecord') {
          var data = {
          }
          dispatch({ type: 'queryApplyHistory', data });
        }
      });
    },
  },
};
