/**
 * 文件说明：调休申请服务
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-04-22
 */
import request from '../../utils/request';


// 调休信息保存
export function absenceBreakOffApplyBasicInfoSave(param){
  return request('/microservice/absence/absence_apply_info_save_proc',param);
}
// 加班人员角色信息查询
export function absenceRoleInfoQuery(param){
  return request('/microservice//absence/absence_role_query_proc',param);
}

//调休申请详细信息查询
export function absenceBreakOffApplyBasicInfoquery(param){
  return request('/microservice//absence/absence_break_info_query_proc',param);
}


// 调休信息保存信息删除
export function absenceBreakOffApplyBasicInfoSaveDel(param){
  return request('/microservice//absence/absence_apply_delete_proc',param);
}

//调休详细信息保存
export function absenceBreakOffApplyDetailInfoSave(param){
  return request('/microservice/absence/absence_apply_break_info_save_proc',param);
}

//审批信息保存
export function absencApplyApprovalInfoSave(param){
  return request('/microservice/absence/absence_apply_approval_save_proc',param);
}

// 年假流转中的单子

export function absencYearJNInfoCheck(param){
  return request('/microservice/absence/absence_jh_year_apply_proc',param);
}

//检查该人员是否已经申请
export function absencApplyApprovalInfoCheck(param){
  return request('/microservice/absence/absence_personinfo_check_proc',param);
}

//检查人员列表是否已经申请
export function absencApplyApprovalInfoPersonalCheck(param){
  return request('/microservice/absence/absence_repeat_check_proc',param);
}

//查询加班申请信息 
export function absenceApplyPersonsInfo(param){
  return request('/microservice/absence/absence_apply_info_query_proc ',param);
}

//查询加班申请详细信息
export function absenceApplyPersons(param){
  return request('/microservice/absence/absence_break_info_query_proc',param);
}

//查询加班申请审批信息
export function absenceApplyApprovalListQuery(param){
  return request('/microservice//absence/absence_approval_info_query_proc',param);
}

//请假审批信息查询
export function absenceApprovalQuery(param){
  return request('/microservice/absence/absence_approval_query_proc',param);
}

//团队员工调休申请工作流启动
export function breakAbsenceInTeamApplyFlowStart(param){ 
  return request('/microservice/workflownew/wfservice/begin?businessId='+param.start_type+'&tenantCode=humanwork',param);
} 

//团队员工调休申请工作流关闭
export function breakAbsenceInTeamApplyFlowTerminate(param){ 
  let url = "/microservice/workflownew/wfservice/terminate?procInstId="+param.procInstId+"&tenantCode=humanwork";
  return request(url,param);
} 
//工作流完成第一个节点
export function breakAbsenceInTeamApplyFlowComplete(param){
  let url = "/microservice/workflownew/wfservice/complete?taskId="+param.taskId+"&tenantCode=humanwork";
  return request(url,param);
}
// 信息回滚
export function absenceInfoDel(param){
  return request('/microservice/absence/absence_apply_delete_proc',param);
}

// 审批信息保存
export function absenceInfoApprovalSave(param){
  return request('/microservice/absence/absence_apply_approval_save_proc',param);
}


//非团队员工调休申请工作流启动
export function breakAbsenceNoTeamApplyFlowStart(param){ 
  return request('/microservice/workflownew/wfservice/begin?businessId='+param.start_type+'&tenantCode=humanwork',param);
} 
//非团队员工调休申请工作流关闭
export function breakAbsenceNoTeamApplyFlowTerminate(param){ 
  let url = "/microservice/workflownew/wfservice/terminate?procInstId="+param.procInstId+"&tenantCode=humanwork";
  return request(url,param);
} 
//非团队工作流完成第一个节点
export function breakAbsencNoTeamApplyFlowComplete(param){
  let url = "/microservice/workflownew/wfservice/complete?taskId="+param.taskId+"&tenantCode=humanwork";
  return request(url,param);
}

//团队负责人调休申请工作流启动
export function breakAbsenceTeamLeaderApplyFlowStart(param){ 
  return request('/microservice/workflownew/wfservice/begin?businessId='+param.start_type+'&tenantCode=humanwork',param);
} 

//团队负责人调休申请工作流关闭
export function breakAbsenceTeamLeaderApplyFlowTerminate(param){ 
  let url = "/microservice/workflownew/wfservice/terminate?procInstId="+ param.procInstId+"&tenantCode=humanwork";
  return request(url,param);
} 
//团队负责人工作流完成第一个节点
export function breakAbsenceTeamLeaderApplyFlowComplete(param){
  let url = "/microservice/workflownew/wfservice/complete?taskId="+param.taskId+"&tenantCode=humanwork";
  return request(url,param);
}

//常设机构负责人申请工作流启动
export function breakAbsenceDepartmentLeaderApplyFlowStart(param){ 
  return request('/microservice/workflownew/wfservice/begin?businessId='+param.start_type+'&tenantCode=humanwork',param);
} 

//常设机构负责人调休申请工作流关闭
export function breakAbsenceDepartmentLeaderApplyFlowTerminate(param){ 
  let url = "/microservice/workflownew/wfservice/terminate?procInstId="+param.procInstId+"&tenantCode=humanwork";
  return request(url,param);
} 
//常设机构负责人工作流完成第一个节点
export function breakAbsenceDepartmentLeaderApplyFlowComplete(param){
  let url = "/microservice/workflownew/wfservice/complete?taskId="+param.taskId+"&tenantCode=humanwork";
  return request(url,param);
}
//员工年休假剩余天数信息查询
export function absenceYearApplyBasicInfoquery(param){
  return request('/microservice/absence/absence_person_year_break_query_proc',param);
}

// 部门负责人查询下一步环节处理人
export function absenceDepartmentLeaderQueryNest(param){
  return request('/microservice/absence/submit_next_person_leader_proc',param);
}

// 插入剩余年假天数
export function insertYearBreakUse(param){
  return request('/microservice/absence/absence_year_break_usage_plan_proc',param);
}

// 查询年休假默认保存信息
export function defaultYearBreakUse(param){
  return request('/microservice/absence/absence_year_break_usage_query_proc',param);
}


//年假申请工作流启动
export function yearAbsenceInTeamApplyFlowStart(param){ 
  return request('/microservice/workflownew/wfservice/begin?businessId='+param.start_type+'&tenantCode=humanwork',param);
}
//年假申请工作流关闭
export function yearAbsenceInTeamApplyFlowTerminate(param){ 
  let url = "/microservice/workflownew/wfservice/terminate?procInstId="+ param.procInstId+"&tenantCode=humanwork";
  return request(url,param);
} 
//年假申请工作流完成第一个节点
export function yearAbsenceInTeamApplyFlowComplete(param){
  let url = "/microservice/workflownew/wfservice/complete?taskId="+param.taskId+"&tenantCode=humanwork";
  return request(url,param);
}

//提交业务表
export function absenceUpdateComplete(param){
  return request("/microservice/absence/complete_Apply_Status_Update",param);
}
//驳回修改业务表
export function absenceUpdateTerminate(param){
  return request("/microservice/absence/terminate_Apply_Status_Update",param);
}
//提交销假
export function absenceBackDate(param){
  return request("/microservice/absence/absence_selling_off_proc",param);
}

//查询年假信息
export function yearPersonInfoSearch(param){
  return request("/microservice/absence/absence_year_break_info_query_proc",param);
}
//计算年假信息
export function yearCalculate(param){
  return request("/microservice/absence/absence_year_break_calculate_proc",param);
}
//导入年假信息
export function yearImport(param){
  return request("/microservice/absence/absence_year_break_info_save_proc",param);
}

//阅后即焚信息
export function approvalConcel(param){
  return request("/microservice/absence/absence_approval_concel_proc",param);
}

//查询请假信息，角色查询
export function absenceCheckRole(param) {
  return request("/microservice/absence/absence_check_role_proc", param);
}

//查询请假信息，信息查询查询
export function absencePersonalInfoQuery(param) {
  return request("/microservice/absence/absence_personal_info_query_proc", param);
}

