/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划团队管理员查询
 */
import * as costService from '../../../../services/finance/fundingPlanSRS';
import Cookie from 'js-cookie'
export default {
  namespace: 'teamSearch',
  state: {
    list:[],
    officeSuppliesList:[],
    flag:'1',
    tag:''
  },

  reducers: {
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({}, { call, put }) {
      let postData1 = {};
      postData1['arg_staffid'] = localStorage.userid;
      const data1 = yield call(costService.searchTeam,postData1);
      if(data1.RetCode === '1'){
        let postData = {};
        postData['arg_ou'] = localStorage.ou;
        postData['arg_team_id'] = data1.DataRows[0].id;
        const data = yield call(costService.teamSearch,postData);
        if( data.RetCode === '1'){
          yield put({
            type: 'save',
            payload:{
              list: data.DataRows,
              flag:'1',
              tag:Cookie.get('dept_name')+'-'+data1.DataRows[0].team_name
            }
          });
        }
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_team_search') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
