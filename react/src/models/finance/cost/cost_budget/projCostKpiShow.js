/**
 * 作者：陈红华
 * 日期：2017-10-25
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本第五部分：项目全成本管理-OU/部门项目全成本预算完成情况汇总页面所用操作
 */
import {message} from 'antd';
import * as costService from '../../../../services/finance/costService';
import {HideTextComp,TagDisplay} from '../../../../routes/finance/cost/costCommon.js';
import moment from 'moment'
// 处理0和空的值
function NullValComponent({text}) {
  if(!text||text=='0.00'||text=='0.00%'){
    return (
      <div style={{textAlign:'right',letterSpacing:1}}>-</div>
    )
  }else{
    return(
      <div style={{textAlign:'right',letterSpacing:1}}>{text}</div>
    )
  }
}
function NullValComponent100({text}) {
  if(!text||text=='0.00'||text=='0.00%'){
    return (
      <div style={{textAlign:'right',letterSpacing:1}}>-</div>
    )
  }
  else if( parseFloat(text) > 100 ){
    return (
      <div style={{textAlign:'right',letterSpacing:1,color:'red'}}>{text}</div>
    )
  }
  else{
    return(
      <div style={{textAlign:'right',letterSpacing:1}}>{text}</div>
    )
  }
}
export default {
  namespace : 'projCostKpiShow',
  state : {
    dataList:[],
    stateParam:'1',

    beginTime:null,
    endTime:null
  },
  reducers : {
    initData(state){
      return{
        ...state,
        dataList:[],
        stateParam:'1',

        beginTime:null,
        endTime:null
      }
    },
    projCostKpiShowQueryRedu(state, {DataRows,RetVal}){
      let projTypeRow={};//项目类别，rowspan的值及其合并的第一个index
      DataRows.forEach((i,index)=>{
        // debugger;
        if(!projTypeRow[i['项目类别']]){
          projTypeRow[i['项目类别']+'f']=index;
          projTypeRow[i['项目类别']]=1;
        }else{
          projTypeRow[i['项目类别']]++;
        }
      })
      // console.log(projTypeRow);
      let columns=[
        {
          title: '序号',
          width: 60,
          dataIndex: 'num',
          fixed:'left'
        },
        {
          title: '项目类别',
          width: 80,
          dataIndex: '项目类别',
          key: '项目类别',
          fixed:'left',
          render:(text ,row ,index)=>{
            return {
              children: text,
              props: {
                rowSpan:index==projTypeRow[text+'f']?projTypeRow[text]:0
              },
            };
          }
        },
        {
          title: 'OU',
          width: 100,
          dataIndex: 'ou',
          key: 'ou',
          fixed:'left'
        },
        {
          title: '项目编码',
          width: 115,
          dataIndex: '项目编码',
          key: '项目编码',
          fixed:'left'
        },
        {
          title: 'PMS编码',
          width: 115,
          dataIndex: 'pms_code',
          key: 'pms_code',
          fixed:'left'
        },
        {
          title: '项目名称',
          width: 150,
          dataIndex: '项目名称',
          key: '项目名称',
          fixed:'left',
          //render:(text)=><HideTextComp text={text}/>
        },
        {
          title: '项目状态',
          width: 80,
          dataIndex: 'proj_tag',
          key: 'proj_tag',
          fixed:'left',
          render:(text)=><TagDisplay proj_tag={text}/>

        },
        {
          title: '项目进度',
          children: [{
            title: '预计工时（小时）',
            width: 150,
            dataIndex:'预计工时（小时）',
            render:(text,record)=><NullValComponent text={text}/>
          },{
            title:"累计工时（小时）",
            width: 150,
            dataIndex:'累计工时（小时）',
            render:(text,record)=><NullValComponent text={text}/>
          },{
            title:'完成率',
            width: 150,
            dataIndex:'（项目进度）完成率',
            render:(text,record)=><NullValComponent100 text={text}/>
          }],
        },
        {
          title: '全成本预算',
          children: [{
            title: '预算（万元）',
            width: 150,
            dataIndex:'预算（万元）',
            render:(text,record)=><NullValComponent text={text}/>
          },{
            title:"完成（万元）",
            width: 150,
            dataIndex:'完成（万元）',
            render:(text,record)=><NullValComponent text={text}/>
          },{
            title:'完成率',
            width: 150,
            dataIndex:'（全成本预算）完成率',
            render:(text,record)=><NullValComponent100 text={text}/>
          }],
        },
        {
          title:'进度差异(成本高于工时为正）',
          width: 150,
          dataIndex:'进度差异(成本高于工时为正）',
          render:(text,record)=><NullValComponent text={text}/>
        },
        {
          title: '主要成本指标',
          children: [{
            title: '人均全成本（万元）',
            width: 150,
            dataIndex:'人均全成本（万元）',
            render:(text,record)=><NullValComponent text={text}/>
          },{
            title:"人均人工成本（万元）",
            width: 150,
            dataIndex:"人均人工成本（万元）",
            render:(text,record)=><NullValComponent text={text}/>
          },{
            title:'人均差旅（万元）',
            width: 150,
            dataIndex:"人均差旅（万元）",
            render:(text,record)=><NullValComponent text={text}/>
          }],
        }
      ];
      let columnsWidth=150*14-40+50+100;
      return {
        ...state,
        dataList:DataRows,
        RetVal,
        columns,
        columnsWidth
      }
    },
    projCostKpiShowLastDateRedu(state,{lastDate,beginTime,endTime}){
      return {
        ...state,
        lastDate,beginTime,endTime
      }
    },
    saveStateParam(state,action) {
      return { ...state, ...action.payload};
    },
  },
  effects : {
    *projCostKpiShowQuery({argou,beginTime,endTime},{call,put,select}){
      yield put({
        type:'saveStateParam',
        payload:{
          loading:true,
        }
      });
      let {  stateParam } = yield select(state=>state.projCostKpiShow);
      let {DataRows,RetVal,RetCode} = yield call(costService.projCostKpiShowQuery,{
        argou,
        argbegintime:beginTime.format('YYYY-MM'),
        argendtime:endTime.format('YYYY-MM'),
        argtotaltype:stateParam,
      });
      if(RetCode === '1'){
        for(let i=0;i<DataRows.length;i++){
          DataRows[i].key=i;
        }
        yield put({
          type: 'projCostKpiShowQueryRedu',
          DataRows,
          RetVal
        });
      }else{
        yield put({
          type: 'projCostKpiShowQueryRedu',
          DataRows : [],
          RetVal
        });
      }
      yield put({
        type:'saveStateParam',
        payload:{
          beginTime,endTime,loading:false,
        }
      });
    },
    *projCostKpiShowLastDate({formData},{call,put}){
      let {DataRows} = yield call(costService.projCostKpiShowLastDate,formData);
      let beginDate = moment(DataRows[0].total_year+'-'+DataRows[0].total_month,"YYYY-MM");
      let endDate = moment(DataRows[0].total_year+'-'+DataRows[0].total_month,"YYYY-MM");
      yield put({
        type: 'projCostKpiShowQuery',
        argou:formData.argou,
        beginTime:beginDate,
        endTime:endDate,
      });
      yield put({
        type:'saveStateParam',
        payload:{
          lastDate:moment(DataRows[0].total_year+'-'+DataRows[0].total_month,"YYYY-MM"),
          beginTime:beginDate,
          endTime:endDate,
        }
      })
    },

    //改变统计类型，需要改变时间，然后查询
    *changeStateParam({ stateParam,argou },{ put,select }){
      let { lastDate } = yield select(state=>state.projCostKpiShow);
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
        type: 'projCostKpiShowQuery',
        argou,
        beginTime:beginDate,
        endTime:endDate,
      });
    },
  },
  subscriptions : {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_proj_fullcost_mgt/full_cost_progress_chart') {
          dispatch({type: 'initData'});
        }
      });
    },
  }
}
