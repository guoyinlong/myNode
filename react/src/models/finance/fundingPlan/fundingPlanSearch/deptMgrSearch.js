/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划部门管理员查询
 */
import * as costService from '../../../../services/finance/fundingPlanSRS';
import Cookie from 'js-cookie'
export default {
  namespace: 'deptMgrSearch',
  state: {
    list:[],
    flag:'2',
    tag:''
  },

  reducers: {
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({}, { call, put }) {
      let postData = {};
      postData['arg_ou'] = localStorage.ou;
      postData['arg_dept_name'] =Cookie.get('deptname');
      const data = yield call(costService.deptSearch,postData);
      if( data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            list: data.DataRows,
            flag:'2',
            tag:Cookie.get('dept_name')
          }
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_deptMgr_search') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
