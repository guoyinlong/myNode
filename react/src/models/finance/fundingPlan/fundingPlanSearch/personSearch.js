/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划个人查询
 */
import * as costService from '../../../../services/finance/fundingPlanSRS';
import Cookie from 'js-cookie'
export default {
  namespace: 'personSearch',
  state: {
    list:[],
    flag:'0',
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
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_ou'] = localStorage.ou;
      const data = yield call(costService.personSearch,postData);
      if( data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            list: data.DataRows,
            flag:'0',
            tag:Cookie.get('dept_name')+'-'+localStorage.fullName
          }
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_person_search') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
