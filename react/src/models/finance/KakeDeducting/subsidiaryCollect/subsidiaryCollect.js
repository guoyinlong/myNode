/**
 * 作者：张楠华
 * 日期：2018-6-25
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：辅助账汇总数据
 */
import * as services from '../../../../services/finance/subsidiaryCollect'
import Cookies from 'js-cookie'
import {message} from 'antd'
export default {
  namespace : 'subsidiaryCollect',
  state : {
    list:[],
    tableHeader:[],
    currState:'',
    summaryData:[],
  },
  reducers : {
    initData(state){
      return {
        ...state,
        list:[],
        tableHeader:[],
        currState:'',
        summaryData:[]
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
    saveData(state, {key,DataRows}){
      return{
        ...state,
        [key]:DataRows
      }
    },
  },
  effects : {
    *getData({query},{call,put}){
      let {arg_year,arg_state_code}=query;
      let { DataRows }=yield call(services.get_summary_data,{arg_year, arg_state_code});
      let data = yield call(services.get_summary_sum_data,{arg_year, arg_state_code});
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload :{
            currState:arg_state_code,
            list : DataRows,
            summaryData : data.DataRows,
          }
        })
      }else{
        yield put({
          type:'save',
          payload :{
            currState:'0',
            list : [],
            summaryData : [],
          }
        })
      }
    },
    *getTableHeader({},{call,put}){
      let data=yield call(services.dividedGetTableHead,{arg_proj_type:'自主研发', arg_fee_type:'资本化',});
      if(data.RetCode === '1'){
        yield put({
          type:'saveData',
          key:'tableHeader',
          DataRows:data.jsonTree[0].list
        })
      }
    },
    //生成服务
    *insert_all_summary_data({query},{call,put}){
      let {arg_year}=query;
      let {RetCode}=yield call(services.insert_all_summary_data,{arg_staffid:Cookies.get('staff_id'), arg_year});
      if(RetCode==='1'){
        message.success('生成成功');
        yield put({
          type:'getData',
          query : query
        })
      }
    },
    //发布服务
    *publishData({query},{call,put}){
      let {arg_year}=query;
      let {RetCode}=yield call(services.publish_summary_data,{arg_staffid:Cookies.get('staff_id'), arg_year});
      if(RetCode==='1'){
        message.success('发布成功');
        yield put({
          type:'getData',
          query : query
        })
      }
      yield put({
        type:'saveData',
        key:'currState',
        DataRows:'1'
      });
    },
    //撤销发布
    *revokeData({query,reason},{call,put}){
      let {arg_year}=query;
      let {RetCode}=yield call(services.revokeData,{arg_staffid:Cookies.get('staff_id'), arg_year,arg_revoke_reason:reason});
      if(RetCode==='1'){
        message.success('撤销成功');
        yield put({
          type:'getData',
          query : query
        })
      }
      yield put({
        type:'saveData',
        key:'list',
        DataRows:[]
      });
    },
    //导出
    *exportExcel({query}){
      let {arg_year}=query;
      window.open(`/microservice/cosservice/divided/ExportSummaryExcelAsMonthServlet?arg_state_code=1&arg_year=${arg_year}`)
    }
  },
  subscriptions : {
    setup({ dispatch, history }) {
      return history.listen(({ pathname,  query }) => {
        if (pathname === '/financeApp/cost_proj_divided_mgt/divided_summary_mgt') {
          dispatch({
            type:'getTableHeader',
          });
          dispatch({
            type:'getData',
            query:{arg_year:new Date().getFullYear().toString(),arg_state_code:'1'}
          });
          dispatch({
            type:'initData',
          });
        }
      });
    },
  },
}
