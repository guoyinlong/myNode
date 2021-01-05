/**
 * 文件说明：考勤管理服务
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-06-28
 */
import request from '../../utils/request';

// 加班人员角色信息查询
export function attendTypeInfoSearch(param){
    return request('/microservice/absence/absence_role_query_proc',param);
  }
// 保存全勤信息
export function attendFullInfoSave(param){
  return request('/microservice/worktime/worktime_full_person_info_save',param);
}
// 删除全勤信息
export function attendFullInfoDel(param){
  return request('/microservice/worktime/worktime_full_delete_proc',param);
}
// 保存出差信息
export function attendBusinessTripInfoSave(param){
  return request('/microservice/worktime/worktime_travel_person_info_save',param);
}
// 删除出差信息
export function attendBusinessTripInfoDel(param){
  return request('/microservice/worktime/worktime_travel_delete_proc',param);
}
// 保存外出信息
export function outTripInfoSave(param){
  return request('/microservice/worktime/worktime_away_person_info_save',param);
}
// 删除外出信息
export function outTripInfoDel(param){
  return request('/microservice/worktime/worktime_away_delete_proc',param);
}
//创建基本基本信息保存
export function attendProjInfoSave(param){
  return request('/microservice/worktime/worktime_team_apply_info_save',param);
}

// 提交申请审批信息，当前、下一环节
export function attendProjeApprovalSubmitInfo(param){
  return request('/microservice/worktime/worktime_team_apply_approval_save',param);
}

// 删除申请信息
export function deleteAttendProjApprovalInfo(param){
  return request('/microservice/worktime/worktime_team_apply_delete',param);
}
 
// 查询项目组加班信息
export function projectAbsenceInfo(param){
  return request('/microservice/worktime/worktime_absence_info_extract',param);
}

// 请假人员信息保存
export function absencelInfoSave(param){
  return request('/microservice/worktime/worktime_absence_person_info_save',param);
}

// 请假人员信息删除
export function absencelInfoDel(param){
  return request('/microservice/worktime/worktime_absence_person_info_delete',param);
}

// 部门查询项目组信息
export function departmentAttendApplyQuery(param){
  return request('/microservice/worktime/worktime_department_completed_team_list',param);
}
// 全勤信息查询
export function worktimeFullApplyQuery(param){
  return request('/microservice/worktime/worktime_full_person_info_query',param);
}

// 请假信息查询
export function worktimeAbsenceApplyQuery(param){
  return request('/microservice/worktime/worktime_absence_person_info_query',param);
}

// 出差查询
export function worktimeTravelApplyQuery(param){
  return request('/microservice/worktime/worktime_travel_person_info_query',param);
}

// 外出查询
export function worktimeOutApplyQuery(param){
  return request('/microservice/worktime/worktime_away_person_info_query',param);
}
//创建业务部门基本基本信息保存
export function attendDeptInfoSave(param){
  return request('/microservice/worktime/worktime_department_apply_save',param);
}

// 提交业务部门申请审批信息，当前、下一环节
export function attendDeptApprovalSubmitInfo(param){
  return request('/microservice/worktime/worktime_department_apply_approval_save',param); 
}
// 删除业务部门申请信息
export function deleteAttenDeptApprovalInfo(param){
  return request('/microservice/worktime/worktime_department_apply_delete',param);
}
// 查询项目组申请信息
export function attendProjApplyInfo(param){
  return request('/microservice/worktime/worktime_team_apply_info_query',param);
}
// 查询项目组审批信息
export function attendProjApprovalInfo(param){
  return request('/microservice/worktime/worktime_team_approval_info_query',param);
}
// 查询部门申请信息
export function attendDeptApplyInfo(param){
  return request('/microservice/worktime/worktime_department_apply_query',param);
}
// 查询业务部门审批信息
export function attendDeptApprovalInfo(param){
  return request('/microservice/worktime/worktime_department_approval_info_query',param);
}
// 首页查询审批列表
export function attendIndexApprovalInfo(param){
  return request('/microservice/worktime/worktime_approval_query',param);
}

//项目工作流启动
export function attendProjApplyFlowStart(param) {
  return request('/microservice/workflownew/wfservice/begin?businessId=' + param.start_type + '&tenantCode=humanwork', param);
}
//项目工作流完成第一个节点
export function attendProjApplyFlowComplete(param) {
  let url = "/microservice/workflownew/wfservice/complete?taskId=" + param.taskId + "&tenantCode=humanwork";
  return request(url, param);
}
//项目工作流关闭
export function attendProjApplyFlowTerminate(param) {
  let url = "/microservice/workflownew/wfservice/terminate?procInstId=" + param.procInstId + "&tenantCode=humanwork";
  return request(url, param);
}
//驳回修改业务表
export function attendProjUpdateTerminate(param) {
  return request("/microservice/worktime/worktime_approval_terminate", param);
}
// 审批同意 
export function attendProjUpdateComplete(param) {
  return request('/microservice/worktime/worktime_approval_save', param);
}
 
//驳回部門修改业务表
export function attendDeptUpdateTerminate(param) {
  return request("/microservice/worktime/worktime_approval_terminate", param);
}
// 驳回部門修改业务表
export function attendDeptUpdateComplete(param) {
  return request('/microservice/worktime/worktime_approval_save', param);
}
// 部门申请插入项目组列表信息
export function departmentAttendApplyRelSave(param) {
  return request('/microservice/worktime/worktime_department_team_save', param);
}

// 部门申请查询项目组列表信息
export function departmentAttendApplyRelInfo(param) {
  return request('/microservice/worktime/worktime_department_team_query', param);
}
// 阅后即焚
export function attendApprovalCancel(param) {
  return request('/microservice/worktime/worktime_approval_concel', param);
}

// 部门申请查看项目组审批信息
export function attendApprovalTeamQuery(param) {
  return request('/microservice/worktime/worktime_team_approval_info_query', param);
}