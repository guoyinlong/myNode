/**
 * 文件说明：节假日加班服务
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-06-26（补）
 */
import request from '../../utils/request';

//加班审批信息查询
export function overtimeApprovalQuery(param){
  return request('/microservice/overtime/overtime_approval_query',param);
}

//项目组/运维小组信息查询
export function projectQuery(param){
  return request('/microservice/overtime/project_query',param);
}

//节假日信息
export function holidayQuery(param){
  return request('/microservice/overtime/holiday_query',param);
}


//项目组加班申请信息基本信息保存
/*export function teamOvertimeApplyBasicInfoSave(param){
  return request('/microservice/overtime/teamOvertimeApplyBasicInfo_save',param);
}

//项目组加班申请信息加班人员信息保存
export function teamOvertimeApplyPersonInfoSave(param){
  return request('/microservice/overtime/teamOvertimeApplyPersonInfo_save',param);
}*/

export function teamOvertimeApplyBasicInfoSave(param){
  return request('/microservice/overtime/teamOvertimeApplyBasicInfo_save_1',param);
}

//项目组加班申请信息加班人员信息保存
export function teamOvertimeApplyPersonInfoSave(param){
  return request('/microservice/overtime/teamOvertimeApplyPersonInfo_save_1',param);
}

export function teamOvertimeApplyApprovalInfoSave(param){
  return request('/microservice/overtime/teamOvertimeApplyApprovalInfo_save',param);
}

//团队加班申请信息提交
export function teamOvertimeApplySubmit(param){
  return request('/microservice/overtime/team_overtime_apply_submit',param);
}

//团队加班申请信息审批
export function teamOvertimeApplyApproval(param){
  return request('/microservice/overtime/team_overtime_apply_approval',param);
}

//部门加班申请信息提交
export function departmentOvertimeApplySubmit(param){
  return request('/microservice/overtime/department_overtime_apply_submit',param);
}

//部门加班申请信息审批（部门经理）
export function departmentOvertimeApplyApprovalD(param){
  return request('/microservice/overtime/department_overtime_apply_approval_d',param);
}

//部门加班申请信息审批（副院长）
export function departmentOvertimeApplyApprovalE(param){
  return request('/microservice/overtime/department_overtime_apply_approval_e',param);
}

//项目组加班申请信息删除（保存状态）
export function teamOvertimeApplyDelete(param){
  return request('/microservice/overtime/team_overtime_apply_delete',param);
}

//项目组加班申请工作流启动
export function teamOvertimeApplyFlowStart(param){
  return request('/microservice/workflownew/wfservice/begin?businessId=team_apply&tenantCode=humanwork',param);
}

//项目组加班统计工作流启动
export function teamOvertimeStatsFlowStart(param){
  return request('/microservice/workflownew/wfservice/begin?businessId=team_stats&tenantCode=humanwork',param);
}

//工作流完成第一个节点
export function overtimeFlowComplete(param){
  let url = "/microservice/workflownew/wfservice/complete?tenantCode=humanwork";
  return request(url,param);
}

//工作流流程关闭服务
export function overtimeFlowTerminate(param){
  console.log('param.procInstId : ' + param.procInstId);
  let url = "/microservice/workflownew/wfservice/terminate?procInstId=" + param.procInstId + "&tenantCode=humanwork";
  return request(url,param);
}

//部门加班申请工作流启动
export function departmentOvertimeApplyFlowStart(param){
  return request('/microservice/workflownew/wfservice/begin?businessId=department_apply&tenantCode=humanwork',param);
}

//部门加班统计工作流启动
export function departmentOvertimeStatsFlowStart(param){
  return request('/microservice/workflownew/wfservice/begin?businessId=department_stats&tenantCode=humanwork',param);
}

export function teamOvertimeStatsBasicInfoSave(param){
  return request('/microservice/overtime/teamOvertimeStatsBasicInfo_save',param);
}

//项目组加班申请信息加班人员信息保存
export function teamOvertimeStatsPersonInfoSave(param){
  return request('/microservice/overtime/teamOvertimeStatsPersonInfo_save',param);
}

export function teamOvertimeStatsApprovalInfoSave(param){
  return request('/microservice/overtime/teamOvertimeStatsApprovalInfo_save',param);
}

//项目组加班统计信息删除（保存状态）
export function teamOvertimeStatsDelete(param){
  return request('/microservice/overtime/team_overtime_stats_delete',param);
}

//项目组加班人员检查
export function teamOvertimeStatsCheckPersonInfo(param){
  return request('/microservice/overtime/teamOvertimeStatsCheckPersonInfo',param);
}
//项目组加班人员检查
export function deptOvertimeStatsCheckPersonInfo(param){
  return request('/microservice/overtime/deptOvertimeStatsCheckPersonInfo',param);
}

//项目组加班人员查询
export function teamApplyPersonQuery(param){
  return request('/microservice/overtime/apply_Person_Query',param);
}

//待办删除
export function deleteApproval(param){
  return request('/microservice/overtime/delete_Approval_Del',param);
}



//项目组加班项目组查询
export function teamApplyProjQuery(param){
  return request('/microservice/overtime/department_Teamlist_Query',param);
}

//审批信息查询
export function approvalListQuery(param){
  //return request('/microservice/overtime/approval_List_Query',param);
  return request('/microservice/overtime/approval_Detail_Query',param);
}

//查询下一环节处理人信息
export function nextPersonListQuery(param){
  return request('/microservice/overtime/submit_Next_Person_Query',param);
}
//创建时查询下一环节处理人信息
export function nextPersonListStartQuery(param){
  return request('/microservice/overtime/submit_Next_Person_Start_Query',param);
}
//驳回修改业务表
export function overtimeUpdateTerminate(param){
  return request("/microservice/overtime/terminate_Apply_Status_Update",param);
}
//提交业务表
export function overtimeUpdateComplete(param){
  return request("/microservice/overtime/complete_Apply_Status_Update",param);
}

//--新增部门申请界面，所有项目加班信息查询
export function departmentOvertimeApplyQuery(param){
  return request('/microservice/overtime/dept_overtime_apply_query',param);
}

//--新增部门项目审批意见查询，所有项目的审批意见查询
export function departmentOvertimeApprovalQuery(param){
  return request('/microservice/overtime/dept_overtime_approval_query',param);
}

//--部门加班申请基本信息填写
export function departmentOvertimeApplyBasicSave(param){
  return request('/microservice/overtime/department_overtime_apply_basic_save',param);
}

//--部门加班申请项目申请关联填写
export function departmentOvertimeApplyRelSave(param){
  return request('/microservice/overtime/department_overtime_apply_rel_save',param);
}

//--部门加班申请审批填写
export function departmentOvertimeApplyApprovalSave(param){
  return request('/microservice/overtime/department_overtime_apply_approval_save',param);
}

//--部门申请回滚
export function departmentOvertimeApplyDeleteSave(param){
  return request('/microservice/overtime/department_overtime_apply_delete',param);
}

//--部门加班统计基本信息填写
export function departmentOvertimeStatsBasicSave(param){
  return request('/microservice/overtime/department_overtime_stats_basic_save',param);
}

//--部门加班统计项目申请关联填写
export function departmentOvertimeStatsRelSave(param){
  return request('/microservice/overtime/department_overtime_stats_rel_save',param);
}

//--部门加班统计审批填写
export function departmentOvertimeStatsApprovalSave(param){
  return request('/microservice/overtime/department_overtime_stats_approval_save',param);
}

//--部门统计回滚
export function departmentOvertimeStatsDeleteSave(param){
  return request('/microservice/overtime/department_overtime_stats_delete',param);
}

//部门加班统计信息查询
export function departmentOvertimeStatsQuery(param){
  return request('/microservice/overtime/dept_overtime_stats_query',param);
}

//部门加班统计审批信息查询
export function departmentOvertimeStatsApprovalQuery(param){
  return request('/microservice/overtime/dept_overtime_stats_approval_query',param);
}

//部门加班统计审批信息查询
export function queryUserRole(param){
  return request('/microservice/overtime/overtime_user_role_query',param);
}
//部门加班统计附件列表查询
export function fileListQuery(param){
  return request('/microservice/overtime/overtime_file_list_query',param);
}
//删除文件
export function deleteFile(param){
  return request('/filemanage/filedelete ',param);
}
//删除业务文件
export function deleteTeamFile(param){
  return request('/microservice/overtime/overtime_team_file_delete',param);
}
//修改业务文件
export function updateTeamFile(param){
  return request('/microservice/overtime/overtime_team_file_update',param);
}

//查询流程语句
export function flowSearch(param){
  return request('/microservice/overtime/overtime_flow_query',param);
}

//撤销项目组加班申请，条件查询
export function teamApplyStatesInfoQuery(param){
  return request('/microservice/overtime/overtime_team_apply_states_info_query',param);
} 

//撤销项目组加班申请执行操作
export function teamApplyRevokeOperation(param){
  return request('/microservice/overtime/overtime_team_apply_revoke',param);
}
