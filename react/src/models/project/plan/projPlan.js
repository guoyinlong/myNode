/*
*项目计划
*Author: 任金龙
*Date: 2017年11月9日
*Email: renjl33@chinaunicom.cn
*/
import * as projService from '../../../services/project/projService.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
import {OU_NAME_CN,OU_HQ_NAME_CN} from '../../../utils/config';

const auth_tenantid = Cookie.get('tenantid');
const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if(auth_ou_flag === OU_HQ_NAME_CN){ //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

export default {
  namespace:'projPlan',
  state:{
    ouList:[],
    planProjList:[],
    postData:{},
    currentPage:null,
    total:null,
    condCollapse:true
  },
  reducers:{
    save(state,  action) {
      return { ...state, ...action.payload};
    },
    saveOU(state,{ouList: DataRows}) {
      return { ...state, ouList:DataRows};
    },
    saveProjPlan(state,{planProjList: DataRows}) {
      return { ...state, planProjList:DataRows};
     }
  },
  effects: {
    /**
     * 默认的项目计划查询
     * @param call
     * @param put
     */
    *projPlanSearchDefault({},{call,put}){
       //从服务获取OU列表
       let postData_getOU = {};
       postData_getOU["arg_tenantid"] = auth_tenantid;
       const {DataRows:getOuData} = yield call(projService.getOuList, postData_getOU);

        yield put({
          type: 'saveOU',
          ouList: getOuData
        });

         //获取项目列表
      let postData_getPlan = {};
         postData_getPlan["arg_ou_name"]="";
         postData_getPlan["arg_proj_category"]="";
         postData_getPlan["arg_pagecurrent"]=1;
         postData_getPlan["arg_pagesize"]=10;
         postData_getPlan["arg_queryflag"] = 3;
         postData_getPlan["arg_version"] = '3.0';
         postData_getPlan["arg_staff_id"]=Cookie.get('staff_id');

         const getPlanProjData = yield call(projService.projQueryPrimaryChild, postData_getPlan);

          yield put({
            type: 'save',
            payload:{
              planProjList: getPlanProjData.DataRows,
              total:getPlanProjData.RowCount,
              postData:postData_getPlan,
              currentPage:postData_getPlan.arg_pagecurrent,
              condCollapse:true,
              ou:"",
              proj_code :"",
              proj_name :"",
              dept_name:"",
              mgr_name : "",
            }
          });

    },

    *setInputShow({value,condType},{put}){
      yield put({type:'save',payload:{[condType]:value}});
    },
    /**
     * 项目计划查询
     * @param call
     * @param put
     */
    *projPlanConditionSearch({arg_param},{call,put}){
      const data = yield call(projService.projQueryPrimaryChild, arg_param);

      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            planProjList: data.DataRows,
            total:data.RowCount,
            postData:arg_param,
            currentPage:arg_param.arg_pagecurrent,
          }
        });
      }
    },

    /**
     * 项目计划查询返回
     * @param call
     * @param put
     */
    *returnProjPlanConditionSearch({arg_param},{call,put}){
      let arg_param1=JSON.parse(arg_param.postData)
      const data = yield call(projService.projQueryPrimaryChild, arg_param1);
      let condCollapse=false;
      if(arg_param.condCollapse=='true') {
        condCollapse=true;
      }

      if(data.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            planProjList: data.DataRows,
            total:data.RowCount,
            postData:arg_param1,
            currentPage:arg_param1.arg_pagecurrent,
            ou:arg_param1.arg_ou_name,
            proj_code:arg_param1.arg_proj_code,
            proj_name:arg_param1.arg_proj_name,
            dept_name:arg_param1.arg_dept_name,
            mgr_name:arg_param1.arg_mgr_name,
            condCollapse:condCollapse
          }
        });
      }
    },

    *resetCond({},{put,select}){
      yield put({
        type:'save',
        payload:{
          ou:'',
          proj_code :'',
          proj_name :'',
          dept_name:'',
          mgr_name : '',
          page:1
        }});
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query}) => {
        if (pathname === '/projectApp/projPrepare/projPlan') {
          let arg_param=query;
          if(JSON.stringify(query) === '{}'){
            dispatch({ type: 'projPlanSearchDefault',query});
          }else{
            dispatch({ type: 'returnProjPlanConditionSearch',arg_param});
          }
        }
      });

    }
  }
};
