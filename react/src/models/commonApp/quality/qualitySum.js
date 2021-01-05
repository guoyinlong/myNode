/**
 *  作者: 张枫
 *  创建日期: 2018-11-09
 *  邮箱：zhangf142@chinaunicom.cn
 *  文件说明：首页-质量管理-质量汇总页面。
 */
import * as service from '../../../services/commonApp/quality.js';
import moment from 'moment';
const time = moment(new Date()).add('year',0).format("YYYY-MM");
import request ,{getRequest}from '../../../utils/request';
export default {
  namespace:'qualitySummary',

  state: {
    group: [], //项目小组列表
    sumData: {},//汇总饼状图数据
    groupItem1: 'all',//汇总图项目小组名
    bugDetails: {},  // bug 数据
    vulDetails: {},
    smellDetails: {},
    dParam: {       // 详细查询初始数据
      arg_req_group: 'all',
      arg_req_month: time,
      arg_req_type_bug: 'bug',
      arg_req_type_vul: 'vulnerability',
      arg_req_type_sme: 'code smell'
    }
    },
  reducers:{
    initData(state) {
      return{
        roleList:[]
      }
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    }
  },
  effects:{
    //页面初始化
    *init({},{put}){
      yield put({
        type : 'queryGroup',
      });
      yield put({
        type : 'queryBug',
      });
      yield put({
        type : 'queryVul',
      });
      yield put({
        type : 'queryCodeSmell',
      });
    },
    //获取小组列表
    *queryGroup ({},{call,put}){
      let data =yield call(service.group_query,'');
     // let data = getRequest('http://10.0.209.126:8080/sonarQuality/quality/quality_sum/quality_sonar_group_query', '');
      if (data.RetCode === '1'){
        yield put({
          type : 'save',
          payload :{
            group : data.DataRows
          }
        });
      }
    },
    //初始化饼状图数据-汇总数据
    *sumQuery({},{call,put,select}){
      const { groupItem1 } = yield  select (state => state.qualitySummary);
      let postData = {
        arg_req_group : groupItem1,
      };
      let data = yield call (service.sum_query,postData);
      //let data = request('http://10.0.209.126:8080/sonarQuality/quality/quality_sum/quality_sonar_sum_query', postData);
      if (data.RetCode === '1'){
        yield put({
          type : 'save',
          payload :{
            sumData : data
          }
        });
      }
    },
    // 选择小组，查询汇总情况
    *sumGroupQuery({group},{call,put,select}){
      yield put({
        type : 'save',
        payload :{
          groupItem1 : group
        }
      });
      yield put({
        type: 'sumQuery'
      });
    },
    //初始化详细数据
    *queryBug({},{select,call,put}){
      const { dParam } = yield  select (state => state.qualitySummary);
      let postData = {
        arg_req_month : dParam.arg_req_month,
        arg_req_group : dParam.arg_req_group,
        arg_req_type :dParam.arg_req_type_bug
      };
      const data = yield call (service.queryDetails,postData);
      //let data = request('http://10.0.209.126:8080/sonarQuality/quality/quality_sum/quality_type_query', postData);
      if (data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            bugDetails : data
          }
        });
      }
  
    },
    //初始化详细数据
    *queryVul({},{select,call,put}){
      const { dParam } = yield  select (state => state.qualitySummary)
      let postData = {
        arg_req_month : dParam.arg_req_month,
        arg_req_group : dParam.arg_req_group,
        arg_req_type :dParam.arg_req_type_vul
      };
      const data = yield call (service.queryDetails,postData);
      //let data = request('http://10.0.209.126:8080/sonarQuality/quality/quality_sum/quality_type_query', postData);
      if (data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            vulDetails : data
          }
        });
      }
    },
    //初始化详细数据
    *queryCodeSmell({},{select,call,put}){
      const { dParam } = yield  select (state => state.qualitySummary);
      let postData = {
        arg_req_month : dParam.arg_req_month,
        arg_req_group : dParam.arg_req_group,
        arg_req_type :dParam.arg_req_type_sme
      };
      const data = yield call (service.queryDetails,postData);
      //let data = request('http://10.0.209.126:8080/sonarQuality/quality/quality_sum/quality_type_query', postData);
      if (data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            smellDetails : data
          }
        });

      }
    },
    //更改查询小组
    *setDetailsGroup({group},{select,put}){
      const { dParam } = yield  select (state => state.qualitySummary);

      dParam.arg_req_group = group;
      yield put({
        type: 'save',
        payload:{
          dParam : dParam
        }
      });
      yield put({
        type: 'queryBug',
      });
      yield put({
        type: 'queryVul',
      });
      yield put({
        type: 'queryCodeSmell',
      });
    },
    *setTime({dateString},{select,put}){
      const { dParam } = yield  select (state => state.qualitySummary);
      dParam.arg_req_month = dateString;
      yield put({
        type: 'save',
        payload:{
          dParam : dParam
        }
      });
      yield put({
        type: 'queryBug',
      });
      yield put({
        type: 'queryVul',
      });
      yield put({
        type: 'queryCodeSmell',
      });

    }

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/commonApp/qualitySum/qualitySummary') {
          dispatch({type:'init',query});
          dispatch({type:'sumQuery',query});
        }
      });
    },
  }
}
