/**
 * 作者：晏学义
 * 日期：2019-06-25
 * 邮箱：yanxy65@chinaunicom.cn
 * 功能：离职服务类
 */
import request from '../../../utils/request';

//离职工作流启动
export function leaveFlowStart(param){
  return request('/microservice/workflownew/wfservice/begin?businessId='+param.start_type+'&tenantCode=humanwork',param);
}

//离职人员申请信息检查
export function leaveApplyCheckPersonInfo(param){
  return request('/microservice/labor/leaveStatsCheckPersonInfo',param);
}

//离职人员申请信息保存入表leave_apply
export function leaveApplyBasicInfoSave(param){
  return request('/microservice/labor/leaveApplyBasicInfoSave',param);
}

//离职人员申请初始审批信息保存入表leave_apply_approval
export function leaveApplyApprovalInfoSave(param){
  return request('/microservice/labor/leaveApplyApprovalInfo_save',param);
}

//离职申请信息删除（保存状态）
export function leaveApplyDelete(param){
  return request('/microservice/labor/leave_apply_delete',param);
}

//离职申请信息查询
export function leaveApplyQuery(param){
  return request('/microservice/labor/leave_apply_info_query',param);
}


//工作流完成第一个节点
export function leaveFlowComplete(param){
  let url = "/microservice/workflownew/wfservice/complete?tenantCode=humanwork";
  return request(url,param);
}

//工作流流程关闭服务
export function leaveFlowTerminate(param){
  console.log('param.procInstId : ' + param.procInstId);
  let url = "/microservice/workflownew/wfservice/terminate?procInstId=" + param.procInstId + "&tenantCode=humanwork";
  return request(url,param);
}

//项目组/运维小组信息查询
export function projectQuery(param){
  return request('/microservice/labor/project_query',param);
}

//离职申请创建信息提交
export function leaveCreate(param){
  return request('/microservice/labor/leave_create',param);
}

//人员信息查询
export function personInfoQuery(param){
  return request('/microservice/labor/person_info_query',param);
}

//离职人员工作交接申请信息查询leave_hand表
export function leaveHandCheckPersonInfo(param){
  return request('/microservice/labor/leaveHandStatsCheckPersonInfo',param);
}

//离职人员工作交接申请信息保存入表leave_hand
export function leaveHandBasicInfoSave(param){
  return request('/microservice/labor/leaveHandBasicInfoSave',param);
}

//离职工作交接申请信息删除（保存状态）
export function leaveHandDelete(param){
  return request('/microservice/labor/leave_hand_delete',param);
}

//离职人员工作交接申请初始审批信息保存入表leave_hand_approval
export function leaveHandApprovalInfoSave(param){
  return request('/microservice/labor/leaveHandApprovalInfo_save',param);
}

//离职人员离职进度查询
export function queryLeaveStepInfo(param){
  return request('/microservice/labor/leaveStepInfo',param);
}




//加班审批历史信息查询（查看，人力专员归档打印）
export function quitSettleApprovalDetail(param){
  return request('/microservice/quit/quitSettleApprovalDetail',param);
}

//加班审批信息查询
export function quitSettleApprovalQuery(param){
  return request('/microservice/quit/quitSettleApprovalDetailQuery',param);
}

//首页页面查询待办和已办
export function staffleaveApprovalQuery(param){
  return request('/microservice/labor/leave_approval_query',param);
}

//查询离职申请信息
export function staffleaveApplyInfoQuery(param){
  return request('/microservice/labor/leave_apply_info_query',param);
}

//查询离职申请信息
export function leaveApplyInfoQuery(param){
  return request('/microservice/labor/leave_apply_info_query',param);
}
//查询离职申请信息
export function leaveApprovalInfoQuery(param){
  return request('/microservice/labor/leave_approval_info_query',param);
}
//离职审批信息
export function leaveApprovalOperate(param){
  return request('/microservice/labor/leave_approval_operate',param);
}

//离职结算审批
export function leaveSettleApproval(param){
  return request('/microservice/quit/leave_settle_complete_apply_status_update',param);
}

//离职交接查询
export function queryLeaveHandleInfo(param){
  return request('/microservice/labor/leave_handle_info_query',param);
}

//离职结算基本信息创建
export function saveLeaveSettleApply(param){
  return request('/microservice/labor/leave_settle_apply_submit',param);
}

//离职结算审批保存
export function saveLeaveSettleApproval(param){
  return request('/microservice/labor/leave_settle_approval_submit',param);
}

//离职结算审批保存
export function leaveSettleApplyDelete(param){
  return request('/microservice/labor/leave_settle_apply_delete',param);
}

// 工作流启动
export function workFlowStart(param){
  let url = "/microservice/workflownew/wfservice/begin?tenantCode=humanwork";
  return request(url,param);
}



/**---------------------------------------- 6月26日晚新增 */
//删除离职申请，工作交接和离职结算的信息
export function leaveInfoDelete(param){
  return request('/microservice/labor/leave_info_delete',param);
}

//保存离职申请信息（只保存，不提交）
export function staffLeaveApplyInfoSave(param){
  return request('/microservice/labor/leaveInfoSave',param);
}

//保存离职工作交接信息（只保存，不提交）
export function staffLeaveHandInfoSave(param){
  return request('/microservice/labor/handInfoSave',param);
}
//添加日志
export function flowLogAdd(param){
  return request('/microservice/flow/flow_log_add',param);
}
//查询工作流是否已经通过
export function checkFlowComplete(param){
  return request('/microservice/flow/flow_check_complete',param);
}

//查询流程语句
export function flowSearch(param){
  return request('/microservice/labor/leave_flow_query',param);
}

//查询用户是否人力资源专员
export function checkUserPost(param){
  return request('/microservice/labor/leave_check_user_post',param);
}

//离职申请推送人力资源专员信息
export function leaveApplyPushHuman(param){
  return request('/microservice/labor/leave_apply_message_save',param);
}

//查询人员变动统计已完成月份
export function quitLeaveConfirmTimeQuery(param) {
  return request('/microservice/hr/leavpersonnelchanges', param);
}

//员工离职
export function deleteStaffId(param) {
  return request('/microservice/hrmanage/hr/hrPersonLeavingNew', param);
}

//查询员工是否在团队
export function checkUserLeavingTeam(param) {
  return request('/microservice/hrmanage/hr/hrLeavingTeam', param);
}
