/**
 * 作者： 贾茹
 * 创建日期： 2017-05-30
 * 邮箱: m18311475903@163.com
 * 功能： 会议管理平台接口服务
 */
import request from '../../utils/request';

//三重一大原因查询
export function importantReason(param) {
  return request('/microservice/management_of_meetings/meetings_topic_important_search',param);
}

//会议类型查询服务
export function meetingTypeSearch(param) {
  return request('/microservice/management_of_meetings/meetings_type_search',param);
}

//状态查询下拉框
export function stateSearch(param) {
  return request('/microservice/management_of_meetings/meetings_topic_type_search',param);
}

//议题列表查询服务
export function topicList(param) {
  return request('/microservice/management_of_meetings/meetings_topic_info_list_searchs',param);
}
//汇报部门申请单位查询
export function reportDeptSearch(param) {
  return request('/microservice/management_of_meetings/meetings_dept_list_search',param);
}

//汇报部门汇报人查询服务
export function applyPerson(param) {
  return request('/microservice/management_of_meetings/meetings_dept_user_search',param);
}

//汇报人搜索查询服务
export function searchApplyPerson(param) {
  return request('/microservice/management_of_meetings/meetings_all_user_search',param);
}

//查询前置议题列表/management_of_meetings/meetings_topic_study_search
export function topicStudyList(param) {
  return request('/microservice/management_of_meetings/meetings_topic_study_search',param);
}

//议题详情查询服务
export function topicDetails(param) {
  return request('/microservice/management_of_meetings/meetings_to_do_list_details_search',param);
}

//点击保存议题
export function saveTopic(param) {
  return request('/microservice/management_of_meetings/meetings_topic_info_save',param);
}

//议题修改服务
export function resetTopic(param) {
  return request('/microservice/management_of_meetings/meetings_topic_info_update',param);
}

//议题删除服务
export function deleteTopic(param) {
  return request('/microservice/management_of_meetings/meetings_topic_info_delete',param);
}

//未审核议题撤回服务
export function regretTopic(param) {
  return request('/microservice/allmanagementofmeetings/newmeetings/TopicInfoRecall',param);
}
//议题终止的服务
export function endTopic(param) {
  return request('/microservice/management_of_meetings/meetings_topic_info_end',param);
}

//点击列表中提交按钮
export function listSubmit(param) {
  return request('/microservice/management_of_meetings/meetings_topic_return_submit',param);
}

//审批环节服务meetings_topic_info_history_list_search
export function judgeMoment(param) {
  return request('/microservice/management_of_meetings/meetings_topic_info_history_list_search',param);
}

//附件上传的服务
export function fileUpload(param) {
  return request('/microservice/management_of_meetings/meetings_topic_upload_add',param);
}

//附件查询
export function searchFileUpload(param) {
  return request('/microservice/management_of_meetings/meetings_topic_upload_search',param);
}



//点击议题提交
export function submissionTopic(param) {
  return request('/microservice/management_of_meetings/meetings_topic_submit',param);
}

//议题申请单下载
export function downPage(param) {
  return request('/microservice/allmanagementofmeetings/ExportTopicWord/ExportTopicWord',param);
}

//附件删除
export function deleteUpload(param) {
  return request('/microservice/management_of_meetings/meetings_topic_upload_delete',param);
}

//填报界面附件删除
export function  writedeleteUpload(param) {
  return request('/filemanage/filedelete',param);
}

//发送审核通知
export function  sendMessage(param) {
  return request('/microservice/allmanagementofmeetings/sendTopicCheckMessage/sendTopicCheckMessageServlet',param);
}
