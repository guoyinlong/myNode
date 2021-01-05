/**
 * 作者：李杰双
 * 日期：2017/10/15
 * 邮件：282810545@qq.com
 * 文件说明：全成本分类汇总数据
 */
import * as service from '../../../../services/finance/const_budget';
import ConstData from '../../../../utils/config'
import {message} from 'antd'
import moment from 'moment'
export default {
  namespace : 'proj_cost_collectExcel',
  state : {
    list: [],
    v_remarks:'',
    v_remarks_month:'',
    //months:[{}],
    argou:'',

    beginTime:null,
    endTime:null,
    stateParam:'1'
  },
  reducers : {
    initData(state){
      return{
        ...state,
        list: [],
        v_remarks:'',
        v_remarks_month:'',
        //months:[{}],
        argou:'',

        beginTime:null,
        endTime:null,
        stateParam:'1'
      }
    },
    saveList(state, {DataRows,v_remarks,v_remarks_month,beginTime,endTime,ouName}){
      //debugger
      return {
        ...state,
        list:DataRows,
        v_remarks,
        v_remarks_month,
        beginTime,endTime,
        ouName
      };
    },
    saveMonths(state, {beginTime,endTime,argou,ouName,lastDate}){
      //debugger
      return {
        ...state,
        beginTime,
        endTime,
        argou,
        ouName,
        lastDate
      };
    },
    saveStateParam(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects : {
    *collectionServlet({argou, beginTime,endTime},{call,put,select}){
      let {  stateParam } = yield select(state=>state.proj_cost_collectExcel);
      let postData = {
        argou,
        argbegintime:beginTime.format('YYYY-MM'),
        argendtime:endTime.format('YYYY-MM'),
        argtotaltype:stateParam,
      };
      yield put ({
        type:'saveStateParam',
        payload:{
          loading:true
        }
      })
      let {RetCode, DataRows, RetVal:v_remarks} = yield call(service.collectionServlet,postData);
      if(RetCode==='1'){
        yield put ({
          type:'saveStateParam',
          payload:{
            list:DataRows,
            v_remarks,
            //months:[{total_month:argmonth,total_year:argyear}]
            beginTime,
            endTime,
            ouName:argou,
            loading:false
          }
        })
      }else{
        yield put ({
          type:'saveStateParam',
          payload:{
            list:[],
            v_remarks,
            //months:[{total_month:argmonth,total_year:argyear}]
            beginTime,
            endTime,
            ouName:argou,
            loading:false
          }
        })
      }
    },
    //初始化查询，最近有数据的年月,并且根据这个年月查询
    *search_month({argou},{call,put}){
      let { RetCode, DataRows } = yield call(service.searchlastyearmonth,{argou});
      let beginDate = DataRows.length?moment(DataRows[0].total_year+'-'+DataRows[0].total_month,'YYYY-MM'):moment();
      let endDate = DataRows.length?moment(DataRows[0].total_year+'-'+DataRows[0].total_month,'YYYY-MM'):moment();
      let lastDate = DataRows.length?moment(DataRows[0].total_year+'-'+DataRows[0].total_month,'YYYY-MM'):moment();
      if(RetCode==='1'){
        yield put ({
          type:'saveStateParam',
          payload:{
            beginTime:beginDate,
            endTime:endDate,
            lastDate,
            //months:DataRows.length?DataRows:[{total_month:new Date().getFullYear(),total_year:new Date().getMonth()+1}],
            argou,
            ouName:argou
          }
        });
        yield put ({
          type:'collectionServlet',
          beginTime:beginDate,
          endTime:endDate,
          argou
        });
      }else{
        message.error('获取月份失败！')
      }
    },

    //改变统计类型，需要改变时间，然后查询
    *changeStateParam({ stateParam,ou },{ put,select }){
      let { lastDate } = yield select(state=>state.proj_cost_collectExcel);
      let beginDate = null;
      let endDate = null;
      //月统计开始时间，结束时间都是最近有数据的时间
      if(stateParam === '1' || stateParam === '4'){
        beginDate = lastDate;
        endDate = lastDate;
      }
      //年统计，开始时间是最近有数据的年的一月；结束时间是最近有数据的时间
      else if( stateParam === '2'){
        beginDate = moment(lastDate.format("YYYY")+'-01');
        endDate = lastDate;
      }
      //项目至今统计，结束时间为最近有数据的时间，开始时间为2016年1月
      else if( stateParam === '3'){
        beginDate = moment('2016-01');
        endDate = lastDate;
      }
      //自定义，开始时间结束时间默认有数据的月份
      // else if( stateParam === '4'){
      //   beginDate = lastDate;
      //   endDate = lastDate;
      // }
      yield put({
        type: 'saveStateParam',
        payload:{
          beginTime:beginDate,
          endTime:endDate,
          stateParam,
        }
      });
      yield put({
        type: 'collectionServlet',
        argou:ou,
        beginTime:beginDate,
        endTime:endDate,
      });
    },

  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname}) => {
        if (pathname === '/financeApp/cost_proj_fullcost_mgt/full_cost_subtotal') {
          dispatch({type: 'initData'});
          // dispatch({
          //   type:'fetch',
          //   // pageCondition:{arg_page_num:400, arg_start:0},
          // });
        }
      });

    },
  },
};
