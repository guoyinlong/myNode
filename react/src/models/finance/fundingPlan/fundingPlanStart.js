/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划开启
 */
import * as costService from '../../../services/finance/fundingPlanSRS';
const dateFormat = 'YYYY-MM';
const dateFormat1 = 'YYYY-MM-DD';
import Cookies from 'js-cookie'
export default {
  namespace: 'fundingPlanStart',
  state: {
    list:[]
  },

  reducers: {
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({}, { put }) {
      yield put({
        type: 'queryTime',
      })
    },
    *queryTime({},{call,put}){
      let postDate = {};
      const data = yield call(costService.queryTime,postDate);
      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            list: data.DataRows,
          }
        })
      }
    },
    *addTime({values},{call,put}){
      let postDate = {};
      postDate['arg_report_type'] = values.fillTime;
      postDate['arg_user_id'] = localStorage.userid;
      postDate['arg_plan_year'] = values.yearMonth.format(dateFormat).split('-')[0];
      postDate['arg_plan_month'] = values.yearMonth.format(dateFormat).split('-')[1];
      postDate['arg_start_time'] = values.beginTime.format(dateFormat1)+' '+'00:00:00';
      postDate['arg_end_time'] = values.endTime.format(dateFormat1)+' '+'23:59:59';
      postDate['arg_dept_id'] = Cookies.get('dept_id');
      const data = yield call(costService.addTime,postDate);
      if(data.RetCode === "1"){
        yield put({
          type: 'queryTime',
        })
      }
    },
    *editTime({values,batchNumber}, { call, put }) {
      let postDate = {};
      postDate['arg_user_id'] = localStorage.userid;
      postDate['arg_start_time'] = values.beginTimeEdit.format(dateFormat1)+' '+'00:00:00';
      postDate['arg_end_time'] = values.endTimeEdit.format(dateFormat1)+' '+'23:59:59';
      postDate['arg_batch_number'] = batchNumber;
      postDate['arg_dept_id'] = Cookies.get('dept_id');
      const data = yield call(costService.editTime,postDate);
      if(data.RetCode === "1"){
        yield put({
          type: 'queryTime',
        })
      }
    },
    *delTime({batchNumber}, { call, put }) {
      let postDate = {};
      postDate['arg_user_id'] = localStorage.userid;
      postDate['arg_batch_number'] = batchNumber;
      const data = yield call(costService.delTime,postDate);
      if(data.RetCode === "1"){
        yield put({
          type: 'queryTime',
        })
      }
    },
    *endState({batchNumber}, { call, put }) {
      let postDate = {};
      postDate['arg_user_id'] = localStorage.userid;
      postDate['arg_batch_number'] = batchNumber;
      const data = yield call(costService.endState,postDate);
      if(data.RetCode === "1"){
        yield put({
          type: 'queryTime',
        })
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/funding_plan/funding_plan_start') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
