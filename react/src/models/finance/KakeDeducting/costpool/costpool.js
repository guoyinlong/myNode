/*
 * 作者：张楠华
 * 日期：2018-6-10
 * 邮箱：zhangnh6@chinaunicom.cn
 * 说明：加计扣除-表6model层文件(v1.0)
 */
import * as subsidiaryCollectPool from '../../../../services/finance/subsidiaryCollectPool';
const dateFormat = 'YYYY-MM';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  namespace: 'costPool',
  state: {
    list:[],
    title:[]
  },

  reducers: {
    initData(state){
      return {
        ...state,
        list:[],
        title:[]
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    *init({}, { put }) {
      yield put({
        type: 'queryCollect',
        yearMonth : new Date().getFullYear().toString(),
        stateCode : '1'
      });
    },
    *queryCollect({ year,stateCode }, { call, put }) {
      let postData = {};
      postData['arg_year'] = year;
      //postData['arg_year'] = '2017';
      postData['arg_state_code'] = stateCode;
      const collectData = yield call(subsidiaryCollectPool.queryCollect, postData);
      if(collectData.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            list: collectData.DataRows,
          }
        });
        const titleData = yield call(subsidiaryCollectPool.dividedGetTableHead,{arg_proj_type:'自主研发'});
        if(titleData.RetCode === '1'){
          yield put({
            type: 'save',
            payload: {
              title: titleData.jsonTree[0].list,
            }
          });
        }
      }else{
        yield put({
          type: 'save',
          payload: {
            list: [],
            title:[]
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_proj_divided_mgt/divided_collection_mgt') {
          dispatch({ type: 'init',query });
        }
        dispatch({
          type:'initData',
        });
      });
    },
  },
};
