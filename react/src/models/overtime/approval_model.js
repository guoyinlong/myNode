/**
 * 文件说明：创建新加班审批流程
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-05-15
 */
import Cookie from "js-cookie";
import {OU_HQ_NAME_CN, OU_NAME_CN} from "../../utils/config";
import * as hrService from "../../services/hr/hrService";
import {message} from "antd";
import * as overtimeService from "../../services/overtime/overtimeService";

export default {
  namespace: 'approval_model',
  state : {
    infoRecords:'',
    teamInfoRecords:'',
    deptInfoRecords:'',
    approvalDataList: [],
    personDataList: [],
    projDataList:[],
    nextDataList: [],
    proc_inst_id:'',
    proc_task_id:'',
    apply_task_id:'',
    approvalTeamList: [],
    approvalHiList: [],
    approvalNowList: [],
    nextpostname:'',
    approvalType:'',
    fileDataList: [],
    personDataListExport:[],
    personDataListExportSta:[],
  },
  reducers:{
    save(state,action) {
      return { ...state,...action.payload};
    },
  },
  effects:{
    //项目组加班审批方法
    *teamApprovalInitSearch({query},{call,put}){
      let teamInfoRecord = {};
      teamInfoRecord["task_id"]=query.task_id;
      teamInfoRecord["task_name"]=query.task_name;
      teamInfoRecord["deptName"]=query.deptName;
      teamInfoRecord["step"]=query.step;
      teamInfoRecord["user_name"]=query.user_name;
      teamInfoRecord["create_time"]=query.create_time;
      teamInfoRecord["holiday_name"]=query.holiday_name;
      teamInfoRecord["create_person_name"]=query.create_person_name;
      yield put({
        type:'save',
        payload:{
          teamInfoRecords:teamInfoRecord,
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
        }
      });
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
            personDataList :personData.DataRows
          }
        })

      }else{
        message.error("没有加班人员信息");
      }
      //查询审批信息
      let approvalType = null;
      approvalType = query.approvalType;
      projectQueryparams = {
        arg_apply_id: query.task_id,
        arg_apply_type:approvalType
      };
      let approvalData = yield call(overtimeService.approvalListQuery,projectQueryparams);
      if( approvalData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            approvalDataList :approvalData.DataRows,
            approvalType : approvalType,
          }
        })
      }
      //查询附件信息
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
      //查询下一环节处理人信息
      /* let nextData = [
         {proc_inst_id:'1111111', task_id:'111', submit_user_id:'1001', submit_user_name:'田友谊', submit_post_id:'create_person', submit_post_name:'申请人归档'}
       ];
       let nextData = yield call(overtimeService.nextPersonListQuery,projectQueryparams);
       if( nextData.RetCode === '1'){
         yield put({
           type:'save',
           payload:{
             nextDataList :nextData.DataRows,
           }
         })
       }*/

    },

    /*项目组审批界面提交*/
    *submitTeamApproval({approval_if, approval_advice, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id,approvalType},{call,put}){
      if (approval_if=="同意") {
        //console.log("orig_proc_task_id : " + orig_proc_task_id);
        //调用工作流结下一步
        let projectQueryparams = {
          taskId: orig_proc_task_id,
        }
        //console.log("orig_proc_task_id : " + orig_proc_task_id);
        let flowTerminateData = yield call(overtimeService.overtimeFlowComplete,projectQueryparams);
        //console.log(flowTerminateData);
        projectQueryparams = {
          arg_proc_id: orig_proc_inst_id,
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: approvalType,
          arg_task_id:flowTerminateData.DataRows[0].taskId,
          arg_if_end: 0,
          arg_post_id: '9ca4d30fb3b311e6b01d02429ca3c6ff',
          arg_next_person: '',
        }
        //console.log(projectQueryparams);
        let updateCompleteData = yield call(overtimeService.overtimeUpdateComplete,projectQueryparams);
        //console.log(updateCompleteData);
        if (updateCompleteData.RetCode==='1') {
          message.info('提交成功');
        }else {
          message.error('提交失败');
        }
      }else{
        //调用工作流结束
        let projectQueryparams = {
          procInstId: orig_proc_inst_id,
        }
        //console.log("驳回");
        //console.log(projectQueryparams);
        yield call(overtimeService.overtimeFlowTerminate,projectQueryparams);
        //console.log(flowTerminateData);
        //调用业务层修改申请状态
        projectQueryparams = {
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: approvalType,
          arg_comment_detail:approval_advice
        }
        //console.log(projectQueryparams);
        //驳回功能，新增待办
        let updateTerminateData = yield call(overtimeService.overtimeUpdateTerminate,projectQueryparams);
        if (updateTerminateData.RetCode==='1') {
          message.info('提交成功');
        }else {
          message.error('提交失败');
        }
      }
    },
    *submitTeamApprovalEnd({approval_if, approval_advice, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id,approvalType},{call,put}){
      //调用工作流结下一步
      console.log("submitTeamApprovalEnd orig_proc_task_id : " + orig_proc_task_id);
      let projectQueryparams = {
        taskId: orig_proc_task_id,
      }
      let flowTerminateData = yield call(overtimeService.overtimeFlowComplete,projectQueryparams);
      console.log(flowTerminateData);
      projectQueryparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_apply_id: orig_apply_task_id,
        arg_proc_type: approvalType,
        arg_task_id:flowTerminateData.DataRows[0].taskId,
        arg_if_end: 1,
        arg_post_id: '',
        arg_next_person: '',
      }
      console.log(projectQueryparams);
      let updateCompleteData = yield call(overtimeService.overtimeUpdateComplete,projectQueryparams);
      console.log(updateCompleteData);
      if (updateCompleteData.RetCode==='1') {
        message.info('归档成功');
      }else {
        message.error('归档失败');
      }
    },

    //部门加班初始化方法
    *deptApprovalInitSearch({query},{call,put}){
      let deptInfoRecord = {};
      deptInfoRecord["task_id"]=query.task_id;
      deptInfoRecord["task_name"]=query.task_name;
      deptInfoRecord["deptName"]=query.deptName;
      deptInfoRecord["step"]=query.step;
      deptInfoRecord["user_name"]=query.user_name;
      deptInfoRecord["create_time"]=query.create_time;
      deptInfoRecord["holiday_name"]=query.holiday_name;
      yield put({
        type:'save',
        payload:{
          deptInfoRecords:deptInfoRecord,
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
        }
      });

      let personDataListExportTemp = [];

      //查询项目组信息
      let projectQueryparams = {
        arg_apply_id: query.task_id,
        arg_apply_type:1
      };
      const projData = yield call(overtimeService.teamApplyProjQuery,projectQueryparams);
      //console.log(projData);
      if( projData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            projDataList :projData.DataRows
          }
        })
        //查询项目组对应的详细加班人员信息
        for(let i =0; i<projData.DataRows.length; i++){
          let projectQueryparams = {
            arg_team_apply_id: projData.DataRows[i].apply_id,
            arg_apply_type:1
          };
          const personDataExport = yield call(overtimeService.teamApplyPersonQuery,projectQueryparams);
          if( personDataExport.RetCode === '1'){
            for(let j=0; j<personDataExport.DataRows.length; j++){
              personDataListExportTemp.push(personDataExport.DataRows[j]);
            }
          }else{
            message.error("没有加班人员信息");
          }
        }
          yield put({
            type:'save',
            payload: {
              personDataListExport: personDataListExportTemp
            }
          })

      }
      else{
        message.error("没有项目组加班信息");
      }

      //查询审批信息
      projectQueryparams = {
        arg_apply_id: query.task_id,
        arg_apply_type:2
      };
      const approvalData = yield call(overtimeService.approvalListQuery,projectQueryparams);
      let getdata = approvalData.DataRows;
      //console.log(getdata);
      let teamApprovalDate = [];
      let nowApprovalDate = [];
      let hiApprovalDateList = [];
      for (let i=0; i<getdata.length;i++){
        if(getdata[i].task_type_id==='3'){
          nowApprovalDate.push(getdata[i]);
        }else if(getdata[i].task_type_id==='2'){
          hiApprovalDateList.push(getdata[i]);
        }
        else{
          teamApprovalDate.push(getdata[i]);
        }
      }
      if( approvalData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            approvalDataList :approvalData.DataRows,
            approvalTeamList: teamApprovalDate,
            approvalHiList: hiApprovalDateList,
            approvalNowList: nowApprovalDate,
          }
        })
      }

      //查询下一环节处理人信息
      /*let nextData = [
         {proc_inst_id:'1111111', task_id:'111', submit_user_id:'1001', submit_user_name:'田友谊', submit_post_id:'create_person', submit_post_name:'人力资源专员归档', post_id:'sdkjfiusdh76236'}
       ];*/
      projectQueryparams = {
        arg_proc_inst_id: query.proc_inst_id
      };
      let nextData = yield call(overtimeService.nextPersonListQuery,projectQueryparams);
      let nextname = '';
      if (nextData.length>0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }

      //console.log(nextData);
      if( nextData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            nextDataList: nextData.DataRows,
            nextpostname: nextname
          }
        })
      }else{
        message.error("查询下一环节处理人信息异常");
      }
    },

    /*部门审批界面提交*/
    *submitDeptApproval({approval_if, approval_advice, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id,nextstepPerson,nextpostid,resolve},{call,put}){
      if (approval_if=="同意") {
        console.log("同意");
        //调用工作流结下一步
        let param = {};
        param["taskId"] = orig_proc_task_id;
        let listenersrc = '{adddepartmentnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"'+ Cookie.get('OUID')+'"}}';
        param["listener"] = listenersrc;
        param["form"] = '{deptid:"'+Cookie.get('OUID')+'"}';

        //console.log(param);
        let flowTerminateData = yield call(overtimeService.overtimeFlowComplete,param);
        //console.log(flowTerminateData);
        let projectQueryparams = {
          arg_proc_id: orig_proc_inst_id,
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: 2,
          arg_task_id:flowTerminateData.DataRows[0].taskId,
          arg_if_end: 0,
          arg_post_id: nextpostid,
          arg_next_person: nextstepPerson,
        }
        //console.log(projectQueryparams);
        let updateCompleteData = yield call(overtimeService.overtimeUpdateComplete,projectQueryparams);
        //console.log(updateCompleteData);
        if (updateCompleteData.RetCode==='1') {
          message.info('提交成功');
          resolve("success");
        }else {
          message.error('提交失败');
          resolve("false");
        }
      }else{
        console.log("驳回");
        //调用工作流结束
        let projectQueryparams = {
          procInstId: orig_proc_inst_id,
        }
        yield call(overtimeService.overtimeFlowTerminate,projectQueryparams);
        //调用业务层修改申请状态
        projectQueryparams = {
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: 2,
          arg_comment_detail:approval_advice
        }
        //console.log(projectQueryparams);
        let updateTerminateData = yield call(overtimeService.overtimeUpdateTerminate,projectQueryparams);
        //console.log(updateTerminateData);
        if (updateTerminateData.RetCode==='1') {
          message.info('提交成功');
          resolve("success");
        }else {
          message.error('提交失败');
          resolve("false");
        }
      }
    },
    *submitDeptApprovalEnd({approval_if, approval_advice, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id,nextstepPerson,nextpostid,resolve},{call,put}){
      console.log("归档");
      //调用工作流结下一步
      let projectQueryparams = {
        taskId: orig_proc_task_id,
      }
      let flowTerminateData = yield call(overtimeService.overtimeFlowComplete,projectQueryparams);
      //console.log(flowTerminateData);
      projectQueryparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_apply_id: orig_apply_task_id,
        arg_proc_type: 2,
        arg_task_id:flowTerminateData.DataRows[0].taskId,
        arg_if_end: 1,
        arg_post_id: '',
        arg_next_person: nextstepPerson,
      }
      //console.log(projectQueryparams);
      let updateCompleteData = yield call(overtimeService.overtimeUpdateComplete,projectQueryparams);
      //console.log(updateCompleteData);
      if (updateCompleteData.RetCode==='1') {
        message.info('归档成功');
        resolve("success");
      }else {
        message.error('归档失败');
        resolve("false");
      }
    },

    /*查询加班部门人员*/
    *queryTeamList({orig_proc_task_id},{call,put}){
      let projectQueryparams = {
        arg_team_apply_id: orig_proc_task_id,
        arg_apply_type:1
      };
      const personData = yield call(overtimeService.teamApplyPersonQuery,projectQueryparams);
      //console.log(personData);
      if( personData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personDataList :personData.DataRows
          }
        })
      }else{
        message.error("没有加班人员信息");
      }
    },
    //部门统计初始化方法
    *deptStatsApprovalInitSearch({query},{call,put}){
      console.log("query:"+query);
      let deptInfoRecord = {};
      deptInfoRecord["task_id"]=query.task_id;
      deptInfoRecord["task_name"]=query.task_name;
      deptInfoRecord["deptName"]=query.deptName;
      deptInfoRecord["step"]=query.step;
      deptInfoRecord["user_name"]=query.user_name;
      deptInfoRecord["create_time"]=query.create_time;
      deptInfoRecord["holiday_name"]=query.holiday_name;
      //console.log("deptInfoRecord:"+deptInfoRecord);
      yield put({
        type:'save',
        payload:{
          deptInfoRecords:deptInfoRecord,
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
        }
      });

      //查询项目组信息
      let projectQueryparams = {
        arg_apply_id: query.task_id,
        arg_apply_type:2
      };
      let personDataListExportTemp = [];
      console.log(projectQueryparams);
      const projData = yield call(overtimeService.teamApplyProjQuery,projectQueryparams);
      console.log(projData);
      if( projData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            projDataList :projData.DataRows
          }
        })
        //查询项目组对应的详细加班人员信息
        for(let i =0; i<projData.DataRows.length; i++){
          let projectQueryparams = {
            arg_team_apply_id: projData.DataRows[i].apply_id,
            arg_apply_type:2
          };
          const personDataExport = yield call(overtimeService.teamApplyPersonQuery,projectQueryparams);
          if( personDataExport.RetCode === '1'){
            for(let j=0; j<personDataExport.DataRows.length; j++){
              personDataListExportTemp.push(personDataExport.DataRows[j]);
            }
          }else{
            message.error("没有加班人员信息");
          }
        }
        yield put({
          type:'save',
          payload: {
            personDataListExportSta: personDataListExportTemp
          }
        })
      }
      else{
        message.error("没有项目组加班信息");
      }

      //查询审批信息
      projectQueryparams = {
        arg_apply_id: query.task_id,
        arg_apply_type:4
      };
      const approvalData = yield call(overtimeService.approvalListQuery,projectQueryparams);
      let getdata = approvalData.DataRows;
      //console.log(getdata);
      let teamApprovalDate = [];
      let nowApprovalDate = [];
      let hiApprovalDateList = [];
      for (let i=0; i<getdata.length;i++){
        if(getdata[i].task_type_id==='3'){
          nowApprovalDate.push(getdata[i]);
        }else if(getdata[i].task_type_id==='2'){
          hiApprovalDateList.push(getdata[i]);
        }
        else{
          teamApprovalDate.push(getdata[i]);
        }
      }
      if( approvalData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            approvalDataList :approvalData.DataRows,
            approvalTeamList: teamApprovalDate,
            approvalHiList: hiApprovalDateList,
            approvalNowList: nowApprovalDate,
          }
        })
      }
      //查询下一环节处理人信息
      /*let nextData = [
         {proc_inst_id:'1111111', task_id:'111', submit_user_id:'1001', submit_user_name:'田友谊', submit_post_id:'create_person', submit_post_name:'人力资源专员归档', post_id:'sdkjfiusdh76236'}
       ];*/
      projectQueryparams = {
        arg_proc_inst_id: query.proc_inst_id
      };
      console.log(query.proc_inst_id);
      let nextData = yield call(overtimeService.nextPersonListQuery,projectQueryparams);
      let nextname = '';
      if (nextData.length>0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }
      //console.log(nextData);
      if( nextData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            nextDataList: nextData.DataRows,
            nextpostname: nextname
          }
        })
      }else{
        message.error("查询下一环节处理人信息异常");
      }
      //查询附件列表
      projectQueryparams = {
        arg_apply_id: query.task_id,
        arg_type:1
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
    },
    /*部门统计审批界面提交*/
    *submitDeptStatsApproval({approval_if, approval_advice, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id,nextstepPerson,nextpostid,resolve},{call,put}){
      if (approval_if=="同意") {
        console.log("同意");
        //调用工作流结下一步
        let param = {};
        param["taskId"] = orig_proc_task_id;
        let listenersrc = '{adddepartmentnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"'+ Cookie.get('OUID')+'"}}';
        param["listener"] = listenersrc;
        //console.log(param);
        let flowTerminateData = yield call(overtimeService.overtimeFlowComplete,param);
        //console.log(flowTerminateData);
        let projectQueryparams = {
          arg_proc_id: orig_proc_inst_id,
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: 4,
          arg_task_id:flowTerminateData.DataRows[0].taskId,
          arg_if_end: 0,
          arg_post_id: nextpostid,
          arg_next_person: nextstepPerson,
        }
        //console.log(projectQueryparams);
        let updateCompleteData = yield call(overtimeService.overtimeUpdateComplete,projectQueryparams);
        //console.log(updateCompleteData);
        if (updateCompleteData.RetCode==='1') {
          message.success('提交成功');
          resolve("success");
        }else {
          message.error('提交失败');
          resolve("false");
        }
      }else{
        console.log("驳回");
        //调用工作流结束
        let projectQueryparams = {
          procInstId: orig_proc_inst_id,
        }
        //console.log(projectQueryparams);
        yield call(overtimeService.overtimeFlowTerminate,projectQueryparams);
        //调用业务层修改申请状态
        projectQueryparams = {
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: 4,
          arg_comment_detail:approval_advice
        }
        console.log(projectQueryparams);
        let updateTerminateData = yield call(overtimeService.overtimeUpdateTerminate,projectQueryparams);
        console.log(updateTerminateData);
        if (updateTerminateData.RetCode==='1') {
          message.success('提交成功');
          resolve("success");
        }else {
          message.error('提交失败');
          resolve("false");
        }
      }
    },
    *submitDeptStatsApprovalEnd({approval_if, approval_advice, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id,nextstepPerson,nextpostid,resolve},{call,put}){
      console.log("归档");
      //调用工作流结下一步
      let projectQueryparams = {
        taskId: orig_proc_task_id,
      }
      //console.log(projectQueryparams);
      yield call(overtimeService.overtimeFlowComplete,projectQueryparams);
      //console.log(flowTerminateData);
      projectQueryparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_apply_id: orig_apply_task_id,
        arg_proc_type: 4,
        arg_task_id:'',
        arg_if_end: 1,
        arg_post_id: '',
        arg_next_person: '',
      }
      //console.log(projectQueryparams);
      let updateCompleteData = yield call(overtimeService.overtimeUpdateComplete,projectQueryparams);
      //console.log(updateCompleteData);
      if (updateCompleteData.RetCode==='1') {
        message.success('归档成功');
        resolve("success");
      }else {
        message.error('归档失败');
        resolve("false");
      }
    },
    //查询加班人员信息加班-统计
    *queryTeamStatsList({orig_proc_task_id},{call,put}){
      let projectQueryparams = {
        arg_team_apply_id: orig_proc_task_id,
        arg_apply_type:2
      };
      const personData = yield call(overtimeService.teamApplyPersonQuery,projectQueryparams);
      //console.log(personData);
      if( personData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            personDataList :personData.DataRows
          }
        })
      }else{
        message.error("没有加班人员信息");
      }
    },

    //职能线部门统计初始化方法
    *deptFuncApprovalInitSearch({query},{call,put}){
      console.log("query:"+query);
      let deptInfoRecord = {};
      deptInfoRecord["task_id"]=query.task_id;
      deptInfoRecord["task_name"]=query.task_name;
      deptInfoRecord["deptName"]=query.deptName;
      deptInfoRecord["step"]=query.step;
      deptInfoRecord["user_name"]=query.user_name;
      deptInfoRecord["create_time"]=query.create_time;
      deptInfoRecord["holiday_name"]=query.holiday_name;
      //console.log("deptInfoRecord:"+deptInfoRecord);
      yield put({
        type:'save',
        payload:{
          deptInfoRecords:deptInfoRecord,
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
        }
      });

      //查询加班人员信息
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
            personDataList :personData.DataRows
          }
        })

      }else{
        message.error("没有加班人员信息");
      }
      console.log("query.approvalType:"+query.approvalType);
      let apply_type = query.approvalType;
      if (apply_type === '5'){
        apply_type = '2';
      }else {
        apply_type = '4';
      }
      //查询审批信息
      projectQueryparams = {
        arg_apply_id: query.task_id,
        arg_apply_type:apply_type
      };
      const approvalData = yield call(overtimeService.approvalListQuery,projectQueryparams);
      let getdata = approvalData.DataRows;
      //console.log(getdata);
      let teamApprovalDate = [];
      let nowApprovalDate = [];
      let hiApprovalDateList = [];
      for (let i=0; i<getdata.length;i++){
        if(getdata[i].task_type_id==='3'){
          nowApprovalDate.push(getdata[i]);
        }else if(getdata[i].task_type_id==='2'){
          hiApprovalDateList.push(getdata[i]);
        }
        else{
          teamApprovalDate.push(getdata[i]);
        }
      }
      if( approvalData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            approvalDataList :approvalData.DataRows,
            approvalTeamList: teamApprovalDate,
            approvalHiList: hiApprovalDateList,
            approvalNowList: nowApprovalDate,
          }
        })
      }
      //查询下一环节处理人信息
      /*let nextData = [
         {proc_inst_id:'1111111', task_id:'111', submit_user_id:'1001', submit_user_name:'田友谊', submit_post_id:'create_person', submit_post_name:'人力资源专员归档', post_id:'sdkjfiusdh76236'}
       ];*/
      projectQueryparams = {
        arg_proc_inst_id: query.proc_inst_id
      };
      console.log(query.proc_inst_id);
      let nextData = yield call(overtimeService.nextPersonListQuery,projectQueryparams);
      let nextname = '';
      if (nextData.length>0) {
        nextname = nextData.DataRows[0].submit_post_name;
      }
      //console.log(nextData);
      if( nextData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            nextDataList: nextData.DataRows,
            nextpostname: nextname
          }
        })
      }else{
        message.error("查询下一环节处理人信息异常");
      }
      //查询附件列表
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
    },
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/overtime/overtime_index/teamApproval') {
          dispatch({ type: 'teamApprovalInitSearch',query });
        }else if (pathname === '/humanApp/overtime/overtime_index/deptApproval') {
          dispatch({ type: 'deptApprovalInitSearch',query });
        }else if (pathname === '/humanApp/overtime/overtime_index/deptStatsApproval') {
          dispatch({ type: 'deptStatsApprovalInitSearch',query });
        }else if (pathname === '/humanApp/overtime/overtime_index/deptFuncApproval') {
          dispatch({ type: 'deptFuncApprovalInitSearch',query });
        }
      });
    }
  }
};
