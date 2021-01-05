/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划分院财务查询
 */
import * as costService from '../../../../services/finance/fundingPlanSRS';
export default {
  namespace: 'branchFinanceSearch',
  state: {
    list:[],
    flag:'3',
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
      const data = yield call(costService.financeSearch,postData);
      if( data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            list: data.DataRows,
            flag:'3',
            tag:localStorage.ou
          }
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_branch_finance_search') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
