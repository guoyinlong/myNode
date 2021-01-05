/**
 * 文件说明：查询项目组加班详细信息
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-05-21
 * 入参：项目组加班申请ID
 **/

import {message} from "antd";
import * as overtimeService from "../../services/overtime/overtimeService";
import Cookie from "js-cookie";

export default {
  namespace: 'show_team_details_model',
  state : {
    team_apply_id:'',
    personDataList:[],
    //审批意见信息类型
    approvalType:'',
    //审批意见列表
    approvalDataList:[],
    approvalHiList:[],
    fileDataList: [],
    userProjectDataList: [],
    return_type:'1',

    //项目组人员查看以及审批信息查询
    holiday_name: '',
    create_time : '',
    deptName : '',
    projectName : '',
    apply_type : '',
    approvType : '',
    approvalHiListDetails:[],
    fileDataListDetails: [],
    personDataListDetails:[],

  },
  reducers:{
    save(state,action) {
      return { ...state,...action.payload};
    },
  },
  effects:{
    //查看-接收项目组加班申请ID
    *searchTeamDetails({query},{call,put}) {
      yield put({
        type:'save',
        payload:{
          holiday_name:query.holiday_name,
          create_time : query.create_time,
          step : query.step,
          deptName : query.deptName,
          proj_id : query.proj_id,
          apply_type : query.apply_type,
        }
      });

      if(query.return_type==='2'){
        yield put({
          type:'save',
          payload:{
            return_type:'2',
          }
        });
      }

      let auth_userid = Cookie.get('userid');
      /* 查询用户项目信息 Begin */
      let queryParams = {};
      queryParams["arg_user_id"] = auth_userid;
      let userProjectData = yield call(overtimeService.projectQuery, queryParams);
      if (userProjectData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            userProjectDataList: userProjectData.DataRows,
          }
        })

      }
      /* 查询用户项目信息 End */

      //项目组、职能线人员申请信息查看
      let applyTypeForPerson = null;
      applyTypeForPerson = query.applyTypeForPerson;
      let projectQueryparams = {
        arg_team_apply_id: query.task_id,
        arg_apply_type:applyTypeForPerson
      };
      const personData = yield call(overtimeService.teamApplyPersonQuery,projectQueryparams);
      if( personData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personDataList :personData.DataRows,
          }
        })
      }else{
        message.error("没有加班人员信息");
      }
      //项目组、职能线查询审批信息
      let approvalType = null;
      approvalType = query.approvalType;
      projectQueryparams = {
        arg_apply_id: query.task_id,
        arg_apply_type:approvalType
      };
      let approvalData = yield call(overtimeService.approvalListQuery,projectQueryparams);
      if( approvalData.RetCode === '1'){
        let getdata = approvalData.DataRows;
        let teamApprovalDate = [];
        let hiApprovalDateList = [];
        for (let i=0; i<getdata.length;i++){
          if(getdata[i].task_type_id === '2'){
            hiApprovalDateList.push(getdata[i]);
          }
          else{
            teamApprovalDate.push(getdata[i]);
          }
        }
        yield put({
          type:'save',
          payload:{
            approvalHiList: hiApprovalDateList,
            approvalDataList :approvalData.DataRows,
            approvalType : approvalType,
          }
        })
      }
      //查询附件信息
      console.log("query====="+JSON.stringify(query));
      if (query.approvType==="项目组加班统计") {
        let param = {
          arg_apply_id: query.task_id,
          arg_type:2
        };
        let fileData = yield call(overtimeService.fileListQuery, param);
        if( fileData.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              fileDataList: fileData.DataRows,
            }
          })
        }
      }
      if (query.approvType==="部门加班统计") {
        projectQueryparams = {
          arg_apply_id: query.task_id,
          arg_type:3
        };
        let fileData = yield call(overtimeService.fileListQuery,projectQueryparams);
        //console.log(fileData);
        if( fileData.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              fileDataList: fileData.DataRows,
            }
          })
        }
      }
    },
    //查看-打印部门加班申请审批过程中项目组的加班及审批信息
    *searchTeamDetailsAndApproval({query},{call,put}) {
      yield put({
        type:'save',
        payload:{
          holiday_name:query.holiday_name,
          create_time : query.create_time,
          deptName : query.deptName,
          projectName : query.projectName,
          apply_type : query.arg_apply_type,
          approvType : query.approvType,
        }
      });

      //人员信息
      let projectQueryparams = {
        arg_team_apply_id: query.arg_apply_id,
        arg_apply_type:query.arg_apply_type
      };
      const personData = yield call(overtimeService.teamApplyPersonQuery,projectQueryparams);
      if( personData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personDataListDetails :personData.DataRows
          }
        })
      }else{
        message.error("没有加班人员信息");
      }

      //审批信息
      projectQueryparams = {
        arg_apply_id: query.arg_apply_id,
        arg_apply_type:query.arg_apply_approval_type
      };
      let approvalData = yield call(overtimeService.approvalListQuery,projectQueryparams);
      if( approvalData.RetCode === '1'){
        let getdata = approvalData.DataRows;
        let teamApprovalDate = [];
        let hiApprovalDateList = [];
        for (let i=0; i<getdata.length;i++){
          if(getdata[i].task_type_id === '2'){
            hiApprovalDateList.push(getdata[i]);
          }
          else{
            teamApprovalDate.push(getdata[i]);
          }
        }
        yield put({
          type:'save',
          payload:{
            approvalHiListDetails: hiApprovalDateList,
          }
        })
      }

      //查询附件信息
      if (query.approvType==="加班统计") {
        let param = {
          arg_apply_id: query.arg_apply_id,
          arg_type:2
        };
        let fileData = yield call(overtimeService.fileListQuery, param);
        if( fileData.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              fileDataListDetails: fileData.DataRows,
            }
          })
        }
      }
    },
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/overtime/overtime_index/showTeamDetails') {
          dispatch({ type: 'searchTeamDetails',query });
        }
        if (pathname === '/humanApp/overtime/overtime_index/showTeamDetailsAndApproval') {
          dispatch({ type: 'searchTeamDetailsAndApproval',query });
        }
      });
    }
  }
};
