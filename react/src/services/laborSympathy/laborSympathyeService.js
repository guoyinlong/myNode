/**
 * 文件说明：慰问申请服务
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2020-05-10
 */
import request from '../../utils/request';

// 慰问全部类型查询
export function sympathyTypeInfoSearch(param) {
  return request('/microservice/sympathy/sympathy_standard_info_query_proc', param);
}

// 慰问待办已办查询
export function sympathyApprovalInfoSearch(param) {
  return request('/microservice/sympathy/sympathy_approval_query_proc', param);
}

// 慰问下一环节处理人查询
export function nextPersonListQuery(param) {
  return request('/microservice/sympathy/submit_sympathy_next_person_proc', param);
}

// 查询当前申请人的工会小组信息
export function laborPersonQuery(param) {
  return request('/microservice/sympathy/sympathy_labor_of_user_proc', param);
}

// 创建提交申请信息保存
export function sympathyeInfoSave(param) {
  return request('/microservice/sympathy/sympathy_apply_info_save_proc', param);
}

// 删除提交申请审批信息
export function deleteSympathyeApprovalInfo(param) {
  return request('/microservice/sympathy/sympathy_approval_concel_proc', param);
}

// 提交申请审批信息，当前、下一环节
export function sympathyeApprovalSubmitInfo(param) {
  return request('/microservice/sympathy/sympathy_apply_approval_save_proc', param);
}
// 查询申请信息
export function sympathyeInfoSearch(param) {
  return request('/microservice/sympathy/sympathy_apply_info_query_proc', param);
}
// 查询审批信息
export function sympathyeApprovalInfoSearch(param) {
  return request('/microservice/sympathy/sympathy_approval_info_query_proc', param);
}
//工作流启动
export function sympathyeApplyFlowStart(param) {
  return request('/microservice/workflownew/wfservice/begin?businessId=' + param.start_type + '&tenantCode=humanwork', param);
}

//工作流完成第一个节点
export function sympathyApplyFlowComplete(param) {
  let url = "/microservice/workflownew/wfservice/complete?taskId=" + param.taskId + "&tenantCode=humanwork";
  return request(url, param);
}
//工作流关闭
export function sympathyApplyFlowTerminate(param) {
  let url = "/microservice/workflownew/wfservice/terminate?procInstId=" + param.procInstId + "&tenantCode=humanwork";
  return request(url, param);
}

// 查询审批信息
export function sympathyeRebackDelete(param) {
  return request('/microservice/sympathy/sympathy_apply_delete_proc', param);
}
//驳回修改业务表
export function sympathyUpdateTerminate(param) {
  return request("/microservice/sympathy/sympathy_approval_terminate_proc", param);
}
// 审批同意
export function sympathyUpdateComplete(param) {
  return request('/microservice/sympathy/sympathy_approval_save_proc', param);
}

// 附件查询
export function UploadFileListQuery(param) {
  return request('/microservice/sympathy/sympathy_apply_file_query', param);
}