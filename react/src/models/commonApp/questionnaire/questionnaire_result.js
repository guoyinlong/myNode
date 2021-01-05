/**
 * 作者：李杰双
 * 日期：2017/10/27
 * 邮件：282810545@qq.com
 * 文件说明：问卷统计数据
 */


import * as service from '../../../services/commonApp/questionnaire';
import {message} from 'antd';
import Cookies from 'js-cookie';

export default {
  namespace : 'questionnaire_result',
  state : {
    list:[],
    selectData:[],
    statistics_text:[],
    AnswersPeople:[],
    people_detail:[],
    select_text:{}
  },

  reducers : {
    clearAll(){

      return{
        list:[],
        selectData:[],
        statistics_text:[],
        AnswersPeople:[],
        people_detail:[],
        select_text:{}
      }
    },
    //单选数据
    saveSelect(state,{DataRows}){
      return{
        ...state,
        //selectData:DataRows
        selectData:DataRows
      };
    },
    saveSelect_text(state,{DataRows,arg_iqoid}){
      let select_text={
        ...state.select_text,
        [arg_iqoid]:DataRows
      }
      return{
        ...state,
        //selectData:DataRows
        select_text
      };
    },
    //问答题数据
    saveStatistics_text(state,{DataRows}){
      return{
        ...state,
        //selectData:DataRows
        statistics_text:DataRows
      };
    },
    //参与人数据
    saveAnswersPeople(state,{DataRows}){
      let submitDeptCount=0,notSubmitDeptCount=0;
      DataRows.forEach((i,index)=>{
        if(i.submitDeptCount){
          submitDeptCount+=parseInt(i.submitDeptCount)
        }
        if(i.notSubmitDeptCount){
          notSubmitDeptCount+=parseInt(i.notSubmitDeptCount)
        }
        DataRows[index].key=index
      })
      DataRows.push({
        submitDeptCount,
        notSubmitDeptCount,
        ou_shortname:'总计',
        key:DataRows.length
      })
      return{
        ...state,
        //selectData:DataRows
        AnswersPeople:DataRows
      };
    },
    savePeople_detail(state,{DataRows}){
      return{
        ...state,
        //selectData:DataRows
        people_detail:DataRows
      };
    },
    //问答题答案
    saveAnswers(state,{DataRows,arg_iqid}){
      let {statistics_text}=state
      for(let i=0;i<statistics_text.length;i++){
        if(statistics_text[i].iq_id===arg_iqid){
          statistics_text[i].answers=DataRows
        }
      }
      return{
        ...state,
        //selectData:DataRows
        statistics_text:[...statistics_text]
      };
    },
  },

  effects : {
    * ques_select({query}, {call, put}) {
      const{ arg_infoid }=query;
      const {DataRows} = yield call(service.statistics_select, {
        arg_infoid,
        arg_userid:Cookies.get('staff_id')
      });
      yield put({
        type:'saveSelect',
        DataRows
      })
    },
    * statistics_text({arg_infoid,arg_questype}, {call, put}) {

      const {DataRows} = yield call(service.ques_query_count, {
        arg_infoid,
        arg_questype,
        arg_userid:Cookies.get('staff_id')
      });
      yield put({
        type:'saveStatistics_text',
        DataRows
      })
    },
    * ques_getAnswers({arg_iqid, arg_infoid}, {call, put}) {
      const {DataRows} = yield call(service.statistics_text, {
        arg_infoid,
        arg_iqid,
        arg_userid:Cookies.get('staff_id')
      //   arg_pagesize:50
      // arg_pagecurrent:1
      });
      yield put({
        type:'saveAnswers',
        DataRows:DataRows,
        arg_iqid
      })
        //debugger
    },
    *statistics_answered({arg_infoid}, {call, put}) {
      const {DataRows} = yield call(service.statistics_answered, {
        arg_infoid,
        arg_userid:Cookies.get('userid'),
        arg_tenantid:Cookies.get('tenantid')
      });
      yield put({
        type:'saveAnswersPeople',
        DataRows,
      })
      //debugger
    },
    * userDetailSearch({arg_infoid,arg_deptid,arg_type,callback}, {call, put}) {
      const {DataRows} = yield call(service.statistics_answered_detail, {
        arg_infoid,
        arg_userid:Cookies.get('userid'),
        arg_tenantid:Cookies.get('tenantid'),
        arg_deptid,
        arg_type
      });
      yield put({
        type:'savePeople_detail',
        DataRows,
      })
      callback()
    },
    * getOtherAnswers({arg_iqoid,callback}, {call, put}) {
      const {DataRows} = yield call(service.statistics_select_text, {
        arg_iqoid,
        arg_userid:Cookies.get('staff_id')
      });
      yield put({
        type:'saveSelect_text',
        DataRows,
        arg_iqoid
      })
      callback()
    },
  },

  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname, query}) => {

        if (pathname === '/commonApp/questionnaire/questionnaire_result') {

          dispatch({type: 'ques_select', query});

        }
      });

    },
  },
}

