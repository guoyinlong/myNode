/**
 * 作者：张楠华
 * 日期：2017-8-1
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：科技创新工时占比
 */
import * as timeManageService from '../../../services/project/timeManagement';
import * as costService from  '../../../services/finance/costService';
const dateFormat = 'YYYY-MM';
import { message } from 'antd';
import cookies from 'js-cookie';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
function parseParam (param, key){
  let paramStr = "";
  if (typeof param==="string" || typeof param==="number" || typeof param==='boolean') {
    paramStr += "&" + key + "=" + encodeURIComponent(param);
  } else {
    for (var v in param) {
      let k = key==null ? v : key + (param instanceof Array ? "[" + v + "]" : "." + v);
      paramStr += '&' + parseParam(param[v], k);
    }
  }
  return paramStr.substr(1);
}
async function request(url, options,key) {

  const response = await fetch(url, {
    method:'post',
    credentials: 'include',
    headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body:parseParam(options,key)
  });
  const data = await response.json();
  if(!data.DataRows){
    data.DataRows=[]
  }
  return data;
}
function getuserModule(postData) {
  return request('/microservice/serviceauth/p_userhasmodule', postData);
}
export default {
  namespace: 'techInnovateTimeSheet',
  state: {
    list:[],
    ouList:[],
    stateCode:'',
    noRule:true,
    //查询需要
    yearMonth:moment(),
    ou:localStorage.ou,
    //生成需要
    beginTime:moment(),
    endTime:moment(),
    //撤销需要
    yearMonthBack:moment(),
    generateModule:false,
    cancelModule:false,
  },

  reducers: {
    initData(state){
      return {
        ...state,
        list:[],
        ouList:[],
        stateCode:'',
        noRule:true,
        //查询需要
        yearMonth:moment(),
        ou:localStorage.ou,
        //生成需要
        beginTime:moment(),
        endTime:moment(),
        //撤销需要
        yearMonthBack:moment(),
        generateModule:false,
        cancelModule:false,
      }
    },
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects: {
    *changeStateS({ arg }, { put }) {
      let temp={};
      if(arg.length%2 !==0) return message.info('参数传递错误');
      for(let i=0;i<arg.length;i=i+2){
        temp[arg[i+1]] = arg[i]
      }
      yield put({
        type:'save',
        payload :temp
      });
      yield put({
        type:'queryTechData',
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
      });
    },
    *init({}, { call, put }) {
      let postData = {};
      postData["argtenantid"] = cookies.get('tenantid');
      postData["arguserid"] = cookies.get('userid');
      postData["argrouterurl"] = '/timesheetManage/technologyDataStatistics';
      const moduleIdData = yield call(getuserModule,postData);
      if(moduleIdData.RetCode === '1'){
        const { HasAuth }= yield call(timeManageService.ratio_auth,{'arg_staff_id':cookies.get('userid')});
        const data= yield call(costService.costUserGetOU, {
          argtenantid:cookies.get('tenantid'),
          arguserid:cookies.get('userid'),
          argmoduleid:moduleIdData.moduleid,
          argvgtype:'2'
        });
        yield put({
          type:'save',
          payload:{
            ouList:data.DataRows,
            HasAuth,
          }
        });
        yield put({
          type:'queryTechData',
        })
      }else{
        message.info('用户没有权限');
        yield put({
          type:'save',
          payload:{
            noRule:false
          }
        })
      }
    },
    *queryTechData({}, { call, put,select }) {
      const { yearMonth,ou } = yield select(state=>state.techInnovateTimeSheet);
      let postData = {};
      postData['arg_this_year'] = yearMonth.format(dateFormat).split('-')[0];
      postData['arg_this_month'] = yearMonth.format(dateFormat).split('-')[1];
      postData['arg_staff_ou'] = ou;
      yield put({
        type:"save",
        payload:{
          loading:true,
        }
      });
      const techData = yield call(timeManageService.queryTechData,postData);
      if(techData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            list:techData.DataRows,
            beginTime : moment(techData.default_begin_time),
            endTime : moment(techData.default_end_time),
            loading:false,
          }
        })
      }
    },
    *generateTechData({}, { call, put,select }) {
      const { beginTime,endTime } = yield select(state=>state.techInnovateTimeSheet);
      let postData = {};
      postData['arg_begin_time'] = beginTime.format('YYYY-MM-DD');
      postData['arg_end_time'] = endTime.format('YYYY-MM-DD');
      postData['arg_staff_id'] = cookies.get('userid');
      const data = yield call(timeManageService.generateTechData,postData);
      if(data.RetCode === '1'){
        message.info('生成成功');
        yield put({
          type:'queryTechData',
        })
      }
    },
    *backTechData({}, { call, put,select }) {
      const { yearMonthBack } = yield select(state=>state.techInnovateTimeSheet);
      let postData = {};
      postData['arg_this_year'] = yearMonthBack.format(dateFormat).split('-')[0];
      postData['arg_this_month'] = yearMonthBack.format(dateFormat).split('-')[1];
      postData['arg_staff_id'] = cookies.get('userid');
      const data = yield call(timeManageService.backTechData,postData);
      if(data.RetCode === '1'){
        message.info('撤销成功');
        yield put({
          type:'queryTechData',
        })
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/timesheetManage/technologyDataStatistics') {
          dispatch({type: 'initData'});
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
