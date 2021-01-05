/**
 * 作者：薛刚
 * 创建日期：2018-10-29
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：实现差旅费预算变更审核model
 */
import {
    travelBudgetChangeInfo, travelBudgetApproval, travelBudgetReturn,
    travelBudgetTerminate, searchCheckLogList
  } from '../../../../services/project/projService.js';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'travelBudgetChangeReview',

  state:{
    projTravelBudgetList: {},
    projTravelBudgetHistoryList: [],
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
    };
  },
},

effects: {
  *projTravelBudgetQuery({ payload }, { call, put }) {
    const travelBudgetList = yield call(travelBudgetChangeInfo, payload);
    if(travelBudgetList.RetCode === '1'){
      yield put({
        type: 'save',
        payload: {
          projTravelBudgetList: travelBudgetList,
        }
      });

      yield put({
        type: 'projReviewHistory',
        params: {
          arg_check_id: payload.arg_check_id,
        }
      })
    }
  },

  *projReviewHistory({ params }, { call, put }) {
    const res = yield call(searchCheckLogList, params);
    if(res.RetCode === '1') {
      yield put({
        type: 'save',
        payload: {
          projTravelBudgetHistoryList: res.DataRows,
        }
      });
    }
  },

  *projTravelBudgetApproval({ payload }, { call, put }) {
    const res = yield call(travelBudgetApproval, payload);
    if(res.RetCode === '1') {
      message.success('审核完毕');
      yield put(routerRedux.push({pathname:'/taskList'}));
    } else {
      message.error('审核失败！请联系管理员');
    }
  },

  *projTravelBudgetReturn({ payload }, { call, put }) {
    const res = yield call(travelBudgetReturn, payload);
    if(res.RetCode === '1') {
      message.success('退回成功');
      yield put(routerRedux.push({pathname:'/taskList'}));
    } else {
      message.error('退回失败！请联系管理员');
    }
  },

  *projTravelBudgetTerminate({ payload }, { call, put }) {
    const res = yield call(travelBudgetTerminate, payload);
    if(res.RetCode === '1') {
      message.success('终止流程成功');
      yield put(routerRedux.push({pathname:'/taskList'}));
    } else {
      message.error('终止流程失败！请联系管理员');
    }
  },
},

subscriptions: {
  setup({ dispatch, history }){
    return history.listen(({ pathname, query }) => {
      if (pathname === '/travelBudgetChangeReview' || pathname === '/travelBudgetChangeReturn' || pathname === '/travelBudgetChangeEnd') {
        dispatch({
          type: 'projTravelBudgetQuery',
          payload: query
        });
      }
    });
  },
},
}
