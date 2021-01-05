 /**
 * 文件说明：考勤管理审批
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-07-07 
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as overtimeService from "../../services/overtime/overtimeService";
import * as sympathyeService from "../../services/laborSympathy/laborSympathyeService"; 
import * as attendService from "../../services/attend/attendService";
export default {
  namespace: 'attend_approval_model',
  state: {
    //下一环节处理名称及处理人
    nextPersonList: [],
    nextPostName: '',
    create_person: [],
    teamDataList: [],
    //传递的参数
    approvalInfoRecord: [],
    //审批信息
    approvalList: [],
    approvalHiList: [],
    approvalNowList: [],
    personDataApprovalInfo:[],
    //参训人员查询
    applyPersonInfo: [],
    personsList: [],
    nextDataList: [],
    nextpostname: '',
    proc_inst_id: '',
    proc_task_id: '',
    apply_task_id: '',
    fileDataList: [],
  },
  reducers: {
    saveDept(state, { deptList: DataRows }) {
      return { ...state, deptList: DataRows };
    },
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },
  effects: {
    // 初始化查询 
    *attendAProjpprovalInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_id: query.apply_id,
        }
      });

      // 查询申请人基本信息
      let applyPersonParams = {
        arg_worktime_team_apply_id: query.apply_id,
      }
      let applyPersonInfo = yield call(attendService.attendProjApplyInfo, applyPersonParams);
      
      if (applyPersonInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            applyPersonInfo: applyPersonInfo.DataRows,
          }
        });
      } else {
        message.error("没有数据");
      }
 
      // 查询申请人详细考勤信息
      let param = {
        arg_worktime_team_apply_id: query.apply_id,
        arg_cycle_code:query.absenceMonth,
      }

      const personData1 = yield call(attendService.worktimeFullApplyQuery,param);
      if( personData1.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personFullDataList :personData1.DataRows
          }
        })
      }else{
        message.error("没有全勤人员信息");
      }

      const personData2 = yield call(attendService.worktimeAbsenceApplyQuery,param);
      if( personData2.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personAbsenceDataList :personData2.DataRows
          }
        })
      }else{
        message.error("没有请假人员信息");
      }

      const personData3 = yield call(attendService.worktimeTravelApplyQuery,param);
      if( personData3.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personTravelDataList :personData3.DataRows
          }
        })
      }else{
        message.error("没有出差人员信息");
      }

      const personData4 = yield call(attendService.worktimeOutApplyQuery,param);
      if( personData4.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personOutDataList :personData4.DataRows
          }
        })
      }else{
        message.error("没有外出人员信息");
      }
      //查询审批信息
      let params = {
        arg_apply_id: query.apply_id,
      }
      let approvalinfo = yield call(attendService.attendProjApprovalInfo, params);
      if (approvalinfo.RetCode === '1') {
        let approvalHiList = [];
        let approvalNowList = [];
        for (let i = 0; i < approvalinfo.DataRows.length; i++) {
          if(approvalinfo.DataRows[i].task_type_id === '2')
          {
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);

          }
            approvalinfo.DataRows[i].key = i;
            approvalNowList.push(approvalinfo.DataRows[i]);
        }
        yield put({
          type: 'save',
          payload: {
            approvalList: approvalinfo.DataRows,
            approvalHiList: approvalHiList,
            approvalNowList: approvalNowList,
          }
        })
      } else {
        message.error("没有数据");
      }

      //查询下一环节处理人信息
      let projectQueryparams = {
        arg_proc_inst_id: query.proc_inst_id
      };
      let nextData = yield call(overtimeService.nextPersonListQuery, projectQueryparams);
      let nextname = '';
      if (nextData.length > 0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextDataList: nextData.DataRows,
            nextpostname: nextname
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
    },
    *attendFuncAprovalInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_id: query.apply_id,
        }
      });

      // 查询申请人基本信息
      let applyPersonParams = {
        arg_worktime_department_apply_id: query.apply_id,
      }
      let applyPersonInfo = yield call(attendService.attendDeptApplyInfo, applyPersonParams);
      
      if (applyPersonInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            applyPersonInfo: applyPersonInfo.DataRows,
          }
        });
      } else {
        message.error("没有数据");
      }
 
      // 查询申请人详细考勤信息
      let param = {
        arg_worktime_team_apply_id: query.apply_id,
        arg_cycle_code:query.absenceMonth,
      }

      const personData1 = yield call(attendService.worktimeFullApplyQuery,param);
      if( personData1.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personFullDataList :personData1.DataRows
          }
        })
      }else{
        message.error("没有全勤人员信息");
      }

      const personData2 = yield call(attendService.worktimeAbsenceApplyQuery,param);
      if( personData2.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personAbsenceDataList :personData2.DataRows
          }
        })
      }else{
        message.error("没有请假人员信息");
      }

      const personData3 = yield call(attendService.worktimeTravelApplyQuery,param);
      if( personData3.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personTravelDataList :personData3.DataRows
          }
        })
      }else{
        message.error("没有出差人员信息");
      }

      const personData4 = yield call(attendService.worktimeOutApplyQuery,param);
      if( personData4.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personOutDataList :personData4.DataRows
          }
        })
      }else{
        message.error("没有外出人员信息");
      }

      //查询审批信息
      let params = {
        arg_department_apply_id: query.apply_id,
      }
      let approvalinfo = yield call(attendService.attendDeptApprovalInfo, params);
      if (approvalinfo.RetCode === '1') {
        let approvalHiList = [];
        let approvalNowList = [];
        for (let i = 0; i < approvalinfo.DataRows.length; i++) {
          if(approvalinfo.DataRows[i].task_type_id === '1')
          {
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);
          }
          else{
            approvalinfo.DataRows[i].key = i;
            approvalNowList.push(approvalinfo.DataRows[i]);

          }
        }
        yield put({ 
          type: 'save',
          payload: {
            approvalList: approvalinfo.DataRows,
            approvalHiList: approvalHiList,
            approvalNowList: approvalNowList,
          }
        })
      } else {
        message.error("没有数据");
      }

      //查询下一环节处理人信息
      let projectQueryparams = {
        arg_proc_inst_id: query.proc_inst_id
      };
      let nextData = yield call(overtimeService.nextPersonListQuery, projectQueryparams);
      let nextname = '';
      if (nextData.length > 0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextDataList: nextData.DataRows,
            nextpostname: nextname
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
    },
    *attendProjApprovalLookInit({ query }, { call, put }) {
       // 查询申请人基本信息
       let applyPersonParams = {
        arg_worktime_team_apply_id: query.apply_id,
      }
      let applyPersonInfo = yield call(attendService.attendProjApplyInfo, applyPersonParams);
      if (applyPersonInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            applyPersonInfo: applyPersonInfo.DataRows,
          }
        });
      } else {
        message.error("没有数据");
      }
      
      // 查询申请人详细考勤信息
      let param = {
        arg_worktime_team_apply_id: query.apply_id,
        arg_cycle_code:query.absenceMonth,
      }

      const personData1 = yield call(attendService.worktimeFullApplyQuery,param);
      if( personData1.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personFullDataList :personData1.DataRows
          }
        })
      }else{
        message.error("没有全勤人员信息");
      }

      const personData2 = yield call(attendService.worktimeAbsenceApplyQuery,param);
      if( personData2.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personAbsenceDataList :personData2.DataRows
          }
        })
      }else{
        message.error("没有请假人员信息");
      }

      const personData3 = yield call(attendService.worktimeTravelApplyQuery,param);
      if( personData3.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personTravelDataList :personData3.DataRows
          }
        })
      }else{
        message.error("没有出差人员信息");
      }

      const personData4 = yield call(attendService.worktimeOutApplyQuery,param);
      if( personData4.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personOutDataList :personData4.DataRows
          }
        })
      }else{
        message.error("没有外出人员信息");
      }
    //查询审批信息
    let params = {
      arg_apply_id: query.apply_id,
    }
    let approvalinfo = yield call(attendService.attendProjApprovalInfo, params);
    if (approvalinfo.RetCode === '1') {
      let approvalHiList = [];
      let approvalNowList = [];
      for (let i = 0; i < approvalinfo.DataRows.length; i++) {
        if(approvalinfo.DataRows[i].task_type_id === '2')
        {
          approvalinfo.DataRows[i].key = i;
          approvalHiList.push(approvalinfo.DataRows[i]);

        } 
          approvalinfo.DataRows[i].key = i;
          approvalNowList.push(approvalinfo.DataRows[i]);
      }
      yield put({
        type: 'save',
        payload: {
          approvalList: approvalinfo.DataRows,
          approvalHiList: approvalHiList,
          approvalNowList: approvalNowList,
        }
      })
    } else {
      message.error("没有数据");
    }
      //阅后即焚
      let if_reback = query.if_reback; 
      if (if_reback === '1') {
        let param = {
          arg_apply_id: query.apply_id,
          arg_apply_type: '1'

        };
        yield call(attendService.attendApprovalCancel, param);
      }
      
      yield put({
        type: 'save',
        payload: {
          fileDataList: [],
        }
      })
    },
    *attendDeptApprovalInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_id: query.apply_id,
        }
      });

      // 查询申请人基本信息
      let applyPersonParams = {
        arg_worktime_department_apply_id: query.apply_id,
      }
      let applyPersonInfo = yield call(attendService.attendDeptApplyInfo, applyPersonParams);
      if (applyPersonInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            applyPersonInfo: applyPersonInfo.DataRows,
          }
        });
      } else {
        message.error("没有数据");
      }

      let param = { 
        arg_worktime_department_apply_id:query.apply_id,
      };
      const submitBasicInfo = yield call(attendService.departmentAttendApplyRelInfo,param);
      if(submitBasicInfo.RetCode==='1'){
        // message.success('请求成功！');
        yield put({
          type: 'save',
          payload: {
            teamDataList: submitBasicInfo.DataRows,
          }
        });
      }else{
        yield put({
          type:'save',
          payload:{
            teamDataList :[],
          }
        });
        // message.error('请求失败');
      }

      //查询审批信息 
      let params = {
        arg_department_apply_id: query.apply_id,
      }
      let approvalinfo = yield call(attendService.attendDeptApprovalInfo, params);
      if (approvalinfo.RetCode === '1') {
        let approvalHiList = [];
        let approvalNowList = [];
        for (let i = 0; i < approvalinfo.DataRows.length; i++) {
          if (approvalinfo.DataRows[i].task_type_id === '1') {
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);
          } else {
            approvalinfo.DataRows[i].key = i;
            approvalNowList.push(approvalinfo.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            approvalList: approvalinfo.DataRows,
            approvalHiList: approvalHiList,
            approvalNowList: approvalNowList,
          }
        })
      } else {
        message.error("没有数据");
      }

      //查询下一环节处理人信息
      let projectQueryparams = {
        arg_proc_inst_id: query.proc_inst_id
      };
      let nextData = yield call(overtimeService.nextPersonListQuery, projectQueryparams);
      let nextname = '';
      if (nextData.length > 0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextDataList: nextData.DataRows,
            nextpostname: nextname
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
    },
    *attendDeptApprovalLookInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          apply_id: query.apply_id,
        }
      });
       // 查询申请人基本信息
       let applyPersonParams = {
        arg_worktime_department_apply_id: query.apply_id,
      }
      let applyPersonInfo = yield call(attendService.attendDeptApplyInfo, applyPersonParams);
      if (applyPersonInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            applyPersonInfo: applyPersonInfo.DataRows,
          }
        });
      } else {
        message.error("没有数据");
      }

      let param = { 
        arg_worktime_department_apply_id:query.apply_id,
      };
      const submitBasicInfo = yield call(attendService.departmentAttendApplyRelInfo,param);
      if(submitBasicInfo.RetCode==='1'){
        // message.success('请求成功！');
        yield put({
          type: 'save',
          payload: {
            teamDataList: submitBasicInfo.DataRows,
          }
        });
      }else{
        yield put({
          type:'save',
          payload:{
            teamDataList :[],
          }
        });
        // message.error('请求失败');
      }

     //查询审批信息
      let params = {
        arg_department_apply_id: query.apply_id,
      }
      let approvalinfo = yield call(attendService.attendDeptApprovalInfo, params);
      if (approvalinfo.RetCode === '1') {
        let approvalHiList = [];
        let approvalNowList = [];
        for (let i = 0; i < approvalinfo.DataRows.length; i++) {
          if (approvalinfo.DataRows[i].task_type_id === '1') {
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);
          } else {
            approvalinfo.DataRows[i].key = i;
            approvalNowList.push(approvalinfo.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            approvalList: approvalinfo.DataRows,
            approvalHiList: approvalHiList,
            approvalNowList: approvalNowList,
          }
        })
      } else {
        message.error("没有数据");
      }
     //阅后即焚
     let if_reback = query.if_reback; 
     if (if_reback === '1') {
       let param = {
         arg_apply_id: query.apply_id,
         arg_apply_type: '2'

       };
       yield call(attendService.attendApprovalCancel, param);
     }
     
     yield put({
       type: 'save',
       payload: {
         fileDataList: [],
       }
     })
    },
    *attendFuncApprovalLookInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
        }
      });
       // 查询申请人基本信息
       let applyPersonParams = {
        arg_worktime_department_apply_id: query.apply_id,
      }
      let applyPersonInfo = yield call(attendService.attendDeptApplyInfo, applyPersonParams);
      if (applyPersonInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            applyPersonInfo: applyPersonInfo.DataRows,
          }
        });
      } else {
        message.error("没有数据");
      }
      
      // 查询申请人详细考勤信息
      let param = {
        arg_worktime_team_apply_id: query.apply_id,
        arg_cycle_code:query.absenceMonth,
      }

      const personData1 = yield call(attendService.worktimeFullApplyQuery,param);
      if( personData1.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personFullDataList :personData1.DataRows
          }
        })
      }else{
        message.error("没有全勤人员信息");
      }

      const personData2 = yield call(attendService.worktimeAbsenceApplyQuery,param);
      if( personData2.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personAbsenceDataList :personData2.DataRows
          }
        })
      }else{
        message.error("没有请假人员信息");
      }

      const personData3 = yield call(attendService.worktimeTravelApplyQuery,param);
      if( personData3.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personTravelDataList :personData3.DataRows
          }
        })
      }else{
        message.error("没有出差人员信息");
      }

      const personData4 = yield call(attendService.worktimeOutApplyQuery,param);
      if( personData4.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personOutDataList :personData4.DataRows
          }
        })
      }else{
        message.error("没有外出人员信息");
      }
    //查询审批信息
    let params = {
      arg_department_apply_id: query.apply_id,
    }
    let approvalinfo = yield call(attendService.attendDeptApprovalInfo, params);
    if (approvalinfo.RetCode === '1') {
      let approvalHiList = [];
      let approvalNowList = [];
      for (let i = 0; i < approvalinfo.DataRows.length; i++) {
        if(approvalinfo.DataRows[i].task_type_id === '1')
        {
          approvalinfo.DataRows[i].key = i;
          approvalHiList.push(approvalinfo.DataRows[i]);

        } 
          approvalinfo.DataRows[i].key = i;
          approvalNowList.push(approvalinfo.DataRows[i]);
      }
      yield put({
        type: 'save',
        payload: {
          approvalList: approvalinfo.DataRows,
          approvalHiList: approvalHiList,
          approvalNowList: approvalNowList,
        }
      })
    } else {
      message.error("没有数据");
    }
      //查询下一环节处理人信息
      let projectQueryparams = {
        arg_proc_inst_id: query.proc_inst_id
      };
      let nextData = yield call(overtimeService.nextPersonListQuery, projectQueryparams);
      let nextname = '';
      if (nextData.length > 0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextDataList: nextData.DataRows,
            nextpostname: nextname
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
     //阅后即焚
     let if_reback = query.if_reback; 
     if (if_reback === '1') {
       let param = {
         arg_apply_id: query.apply_id,
         arg_apply_type: '2'

       };
       yield call(attendService.attendApprovalCancel, param);
     }
     
     yield put({
       type: 'save',
       payload: {
         fileDataList: [],
       }
     })
    },
    *queryTeamList({param},{call,put}){
      const personData1 = yield call(attendService.worktimeFullApplyQuery,param);
      if( personData1.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personFullDataList :personData1.DataRows
          }
        })
      }else{
        message.error("没有全勤人员信息");
      }

      const personData2 = yield call(attendService.worktimeAbsenceApplyQuery,param);
      if( personData2.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personAbsenceDataList :personData2.DataRows
          }
        })
      }else{
        message.error("没有请假人员信息");
      }

      const personData3 = yield call(attendService.worktimeTravelApplyQuery,param);
      if( personData3.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personTravelDataList :personData3.DataRows
          }
        })
      }else{
        message.error("没有出差人员信息");
      }

      const personData4 = yield call(attendService.worktimeOutApplyQuery,param);
      if( personData4.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personOutDataList :personData4.DataRows
          }
        })
      }else{
        message.error("没有外出人员信息");
      } 
        // 查询项目组审批信息
        let postDataDeleteDateBaseApproval = {};
        postDataDeleteDateBaseApproval["arg_apply_id"] = param.arg_worktime_team_apply_id;
        const personDataApproval = yield call(attendService.attendApprovalTeamQuery,postDataDeleteDateBaseApproval);
        if( personDataApproval.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              personDataApprovalInfo :personDataApproval.DataRows
            }
          })
        }else{
          message.error("审批信息");
        }
    },
    // 审批提交 
    *attendProjApprovalSubmit({ approval_if, approval_advice, apply_id, orig_proc_inst_id, orig_proc_task_id, nextstepPerson, nextpostid, now_post_name, resolve }, { call }) {
      if (approval_if == "同意") { 
        //调用工作流结下一步
        let param = {};
        param["taskId"] = orig_proc_task_id;
        let listenersrc = '{addattendteamnext:{arg_procInstId:"${procInstId}",arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('OUID') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;
        //param["form"] = '{deptid:"' + Cookie.get('OUID') + '"}';

        let flowTerminateData = yield call(attendService.attendProjApplyFlowComplete, param);
        let projectQueryparams = {
          arg_proc_id: orig_proc_inst_id, 
          arg_apply_id: apply_id,
          arg_proc_type: 1,
          arg_task_id: flowTerminateData.DataRows[0].taskId,
          arg_actName: flowTerminateData.DataRows[0].actName,
          arg_if_end: 0,
          arg_post_id: nextpostid,
          arg_next_person: nextstepPerson,
        }

        let updateCompleteData = yield call(attendService.attendProjUpdateComplete, projectQueryparams);
        if (updateCompleteData.RetCode === '1') {
          message.info('提交成功');
          resolve("success");
        } else {
          message.error('提交失败');
          resolve("false");
        }
      } else {
        //调用工作流结束
        let projectQueryparams = {
          procInstId: orig_proc_inst_id, 
        }
        yield call(attendService.attendProjApplyFlowTerminate, projectQueryparams);
        //调用业务层修改申请状态
        projectQueryparams = {
          arg_apply_id: apply_id,
          arg_proc_type:'1',
          arg_comment_detail: approval_advice, 
        }
        let updateTerminateData = yield call(attendService.attendProjUpdateTerminate, projectQueryparams);
        if (updateTerminateData.RetCode === '1') {
          message.info('提交成功');
          resolve("success");
        } else {
          message.error('提交失败');
          resolve("false");
        }
      }
    },
    *attendProjApprovalEnd({ orig_proc_inst_id, orig_proc_task_id, apply_id, nextstepPerson, resolve }, { call }) {
      //调用工作流结下一步
      let projectQueryparams = {
        taskId: orig_proc_task_id,
      }
      let flowTerminateData = yield call(attendService.attendProjApplyFlowComplete, projectQueryparams);
     

      projectQueryparams = {
        arg_proc_id: orig_proc_inst_id, 
        arg_apply_id: apply_id,
        arg_proc_type: 1,
        arg_task_id: flowTerminateData.DataRows[0].taskId,
        arg_if_end: 1,
        arg_post_id: '',
        arg_next_person: nextstepPerson,
      } 
     
      let updateCompleteData = yield call(attendService.attendProjUpdateComplete, projectQueryparams);
     

      if (updateCompleteData.RetCode === '1') { 
        message.info('归档成功');
        resolve("success");
      } else {
        message.error('归档失败');
        resolve("false");
      }
    },
    // 审批提交
   *attendDeptApprovalSubmit({ approval_if, approval_advice, apply_id, orig_proc_inst_id, orig_proc_task_id, nextstepPerson, nextpostid, resolve }, { call }) {

          if (approval_if == "同意") { 
            //调用工作流结下一步
            let param = {};
            param["taskId"] = orig_proc_task_id;
            let listenersrc = '{adddepartmentnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('OUID') + '", arg_companyid:"' + Cookie.get('OUID') + '"}}';
            param["listener"] = listenersrc;
            //param["form"] = '{deptid:"' + Cookie.get('OUID') + '"}';
    
            let flowTerminateData = yield call(overtimeService.overtimeFlowComplete, param);
            let projectQueryparams = {
              arg_proc_id: orig_proc_inst_id,
              arg_apply_id: apply_id,
              arg_proc_type: 2,
              arg_task_id: flowTerminateData.DataRows[0].taskId, 
              arg_actName: flowTerminateData.DataRows[0].actName,
              arg_if_end: 0,
              arg_post_id: nextpostid,
              arg_next_person: nextstepPerson,
            }
            let updateCompleteData = yield call(attendService.attendDeptUpdateComplete, projectQueryparams);
            if (updateCompleteData.RetCode === '1') {
              message.info('提交成功');
              resolve("success");
            } else {
              message.error('提交失败');
              resolve("false");
            }
          } else {
            //调用工作流结束
            let projectQueryparams = {
              procInstId: orig_proc_inst_id,
            }
            yield call(overtimeService.overtimeFlowTerminate, projectQueryparams);
            //调用业务层修改申请状态
            projectQueryparams = {
              arg_apply_id: apply_id,
              arg_proc_type: '2',
              arg_comment_detail: approval_advice,
            }
            let updateTerminateData = yield call(attendService.attendDeptUpdateTerminate, projectQueryparams);
            if (updateTerminateData.RetCode === '1') {
              message.info('提交成功');
              resolve("success");
            } else {
              message.error('提交失败');
              resolve("false");
            }
          }
    },
   *attendDeptApprovalEnd({ orig_proc_inst_id, orig_proc_task_id, apply_id,nextstepPerson, resolve }, { call }) {
      //调用工作流结下一步
      let projectQueryparams = {
        taskId: orig_proc_task_id, 
      }
      let flowTerminateData = yield call(overtimeService.overtimeFlowComplete, projectQueryparams);
      projectQueryparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_apply_id: apply_id,
        arg_proc_type: 2,
        arg_task_id: flowTerminateData.DataRows[0].taskId,
        arg_if_end: 1,
        arg_post_id: '',
        arg_next_person: nextstepPerson,
      }
      let updateCompleteData = yield call(attendService.attendDeptUpdateComplete, projectQueryparams);
      if (updateCompleteData.RetCode === '1') {
        message.info('归档成功');
        resolve("success");
      } else {
        message.error('归档失败');
        resolve("false");
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/attend/index/attend_proj_approval') {
          dispatch({ type: 'attendAProjpprovalInit', query });
        }
        if (pathname === '/humanApp/attend/index/attend_dept_approval') {
          dispatch({ type: 'attendDeptApprovalInit', query });
        }
        if (pathname === '/humanApp/attend/index/attend_func_approval') {
          dispatch({ type: 'attendFuncAprovalInit', query });
        }
        if (pathname === '/humanApp/attend/index/attend_proj_approval_look') {
          dispatch({ type: 'attendProjApprovalLookInit', query });
        }
        if (pathname === '/humanApp/attend/index/attend_dept_approval_look') {
          dispatch({ type: 'attendDeptApprovalLookInit', query });
        }
        if (pathname === '/humanApp/attend/index/attend_func_approval_look') {
          dispatch({ type: 'attendFuncApprovalLookInit', query });
        }
      });
    }
  }
};
