/**
 * 作者：张楠华
 * 日期：2019-6-5
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：加计扣除工时统计
 */
import moment from 'moment';
import { message } from 'antd';
import * as timeManageService from '../../../services/project/timeManagement';
export default {
  namespace: 'additionalStatistics',
  state: {
    list:[],
    queryStyle:'0',
    pmsProj:[],
    statisticType:'本月',
    staffName:'',
    projCode:'',
    projName:'',
    beginTime:moment(),
    endTime:moment(),

    page:1,
    RowCount:1,

    queryStyleExp:'0',
    staffNameExp:'',
    projCodeExp:'',
    projNameExp:'',
    beginTimeExp:moment().format("YYYY-MM"),
    endTimeExp:moment().format("YYYY-MM"),

  },

  reducers: {
    initData(state){
      return {
        ...state,
        list:[],
        queryStyle:'0',
        pmsProj:[],
        statisticType:'本月',
        staffName:'',
        projCode:'',
        projName:'',
        beginTime:moment(),
        endTime:moment(),

        page:1,
        RowCount:1,

        queryStyleExp:'0',
        staffNameExp:'',
        projCodeExp:'',
        projNameExp:'',
        beginTimeExp:moment().format("YYYY-MM"),
        endTimeExp:moment().format("YYYY-MM"),
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    *init({}, { call, put }) {
      const data = yield call(timeManageService.pmsProjSearch);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload :{
            pmsProj:data.DataRows
          }
        });
        yield put({
          type:'technologicalSearch',
          page:1
        })
      }
    },
    *technologicalSearch({ page }, { put,call,select }) {
      const { queryStyle,staffName,projCode,projName,beginTime,endTime,statisticType } = yield select(state=>state.additionalStatistics);
      let beginMonth = beginTime !==null && beginTime.format('YYYY-MM') ;
      if(statisticType === '项目至今'){
          beginMonth = '2016-01';
      }
      if( statisticType === '自定义' && (beginTime === null || endTime === null)){
        message.info('时间不能为空');
        return;
      }
      let postData={
        arg_type:queryStyle,
        arg_pms_name:projName,
        arg_pms_code:projCode,
        arg_staff_info:staffName,
        arg_begin_month:beginMonth,
        arg_end_month:endTime.format('YYYY-MM'),
        arg_page_num:page,
        arg_page_count:10,
      };
      const data = yield call(timeManageService.technologicalSearch,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload :{
            list:data.DataRows,
            RowCount:data.RowCount,
            page,

            queryStyleExp:queryStyle,
            staffNameExp:staffName,
            projCodeExp:projCode,
            projNameExp:projName,
            beginTimeExp:beginMonth,
            endTimeExp:endTime.format('YYYY-MM'),
          }
        });
      }
    },
    *clearTechnologicalSearch({ page }, { put,call,select }) {
      let postData={
        arg_type:'0',
        arg_pms_name:'',
        arg_pms_code:'',
        arg_staff_info:'',
        arg_begin_month:moment().format('YYYY-MM'),
        arg_end_month:moment().format('YYYY-MM'),
        arg_page_num:page,
        arg_page_count:10,
      };
      const data = yield call(timeManageService.technologicalSearch,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload :{
            list:data.DataRows,
            RowCount:data.RowCount,
            page,

            queryStyle:'0',
            projName:'',
            projCode:'',
            staffName:'',
            statisticType:'本月',
            beginTime:moment(),
            endTime:moment(),

            queryStyleExp:'0',
            staffNameExp:'',
            projCodeExp:'',
            projNameExp:'',
            beginTimeExp:moment().format("YYYY-MM"),
            endTimeExp:moment().format("YYYY-MM"),
          }
        });
      }
    },
    *exportExl({}, { select }) {
      const { queryStyleExp,staffNameExp,projCodeExp,projNameExp,beginTimeExp,endTimeExp } = yield select(state=>state.additionalStatistics);
      window.open('/microservice/alltimesheet/timesheet/ExportTimesheeTechnologicalInnovationCondition?'
        +'arg_type='+queryStyleExp
        +'&arg_staff_info='+staffNameExp
        +'&arg_pms_code='+projCodeExp
        +'&arg_pms_name='+projNameExp
        +'&arg_begin_month='+beginTimeExp
        +'&arg_end_month='+endTimeExp)
    },
    *changeStatisticType({ value }, { put }){
      if(value ==='本月'){
        yield put({
          type:'save',
          payload :{
            beginTime:moment(),
            endTime:moment(),
            statisticType:value,
          }
        })
      }
      if( value === '年度'){
        yield put({
          type:'save',
          payload :{
            beginTime:moment(new Date().getFullYear()+'-01'),
            endTime:moment(),
            statisticType:value,
          }
        })
      }
      if(value === '项目至今'){
        yield put({
          type:'save',
          payload :{
            beginTime:moment('2016-01'),
            endTime:moment(),
            statisticType:value,
          }
        })
      }
      if(value === '自定义'){
        yield put({
          type:'save',
          payload :{
            beginTime:null,
            endTime:null,
            statisticType:value,
          }
        })
      }
    },
    *changeCode({ value }, { put,select }) {
      const { pmsProj } = yield select(state=>state.additionalStatistics);
      yield put({
        type:'save',
        payload :{
          projCode:value,
          projName:pmsProj.find(i=>i.pms_code === value).pms_name,
        }
      })
    },
    *changeProj({ value }, { put,select }) {
      const { pmsProj } = yield select(state=>state.additionalStatistics);
      yield put({
        type:'save',
        payload :{
          projCode:pmsProj.find(i=>i.pms_name === value).pms_code,
          projName: value,
        }
      })
    },
    *changeState({ arg }, { put }) {
      let temp={};
      if(arg.length%2 !==0) return message.info('参数传递错误');
      for(let i=0;i<arg.length;i=i+2){
        temp[arg[i+1]] = arg[i]
      }
      yield put({
        type:'save',
        payload :temp
      })
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/timesheetManage/additionalStatistics') {
          dispatch({type: 'initData'});
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
