/**
 * 作者：张枫
 * 创建日期：2019-07-01
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：会议管理服务
 */
import request from '../../utils/request';

//会议类型列表查询服务 (查询打开状态的)
export function queryType(param) {
  return request('/microservice/management_of_meetings/meetings_type_search',param);
}

// 会议类型类别查询      (查询打开状态的)
export function queryTypeSearch(param) {
  return request('/microservice/management_of_meetings/meetings_type_search',param);
}

// 会议类型类别查询      (查看)
export function queryAllType(param) {
  return request('/microservice/management_of_meetings/meetings_type_list_search',param);
}
//会议类型-新增
export function addType(param) {
  return request('/microservice/management_of_meetings/meetings_type_add',param);
}
//删除会议配置类型
export function delMeetingConfig(param) {
  return request('/microservice/management_of_meetings/meetings_type_delete',param);
}
//修改会议配置类型
export function modifyMeetingConfig(param) {
  return request('/microservice/management_of_meetings/meetings_type_update',param);
}

//办公室管理员配置新增
export function addMeetingType(param) {
  return request('/microservice/management_of_meetings/meetings_type_add',param);
}
//某部门人员查询
export function searchStaffList(param) {
  return request('/microservice/management_of_meetings/meetings_dept_user_search',param);
}
//部门查询
export function searchDeptList(param) {
  return request('/microservice/management_of_meetings/meetings_dept_list_search',param);
}
//办公室管理员配置查询
export function queryManager(param) {
  return request('/microservice/management_of_meetings/office_administrator_configure_search',param);
}

//办公室管理员配置新增
export function addManager(param) {
  return request('/microservice/management_of_meetings/office_administrator_configure_add',param);
}
//办公室管理员配置删除
export function deleteManager(param) {
  return request('/microservice/management_of_meetings/office_administrator_configure_delete',param);
}
//办公室管理员配置修改
export function modifyManager(param) {
  return request('/microservice/management_of_meetings/office_administrator_configure_update',param);
}

//办公室管理员-公告内容配置
export function bulletinChange(param) {
  return request('/microservice/management_of_meetings/meetings_proclamation_update',param);
}
//办公室管理员-公告内容配置-查询
export function bulletinoChange(param) {
  return request('/microservice/management_of_meetings/meetings_proclamation_search',param);
}
//办公室管理员-三重一大原因查询
export function causeInquiry(param) {
  return request('/microservice/management_of_meetings/meetings_topic_important_search',param);
}
//办公室管理员-三重一大原因导入
// export function causeImport(param) {
//  return request('/microservice/allmanagementofmeetings/newmeetings/ImportImportantReason',param);
//  //  return request('/microservice/allmanagementofmeetings/newmeetings/ImportImportantReason?arg_ouid=e65c02c2179e11e6880d008cfa0427c4&arg_user_id=0886977&arg_user_name=范付纸');
// }
//办公室管理员-三重一大原因删除
export function causeDelete(param) {
  return request('/microservice/management_of_meetings/meetings_topic_important_delete',param);
}
//办公室管理员-三重一大原因修改
export function causeModify(param) {
  return request('/microservice/management_of_meetings/meetings_topic_important_update',param);
}
// 议题统计
//议题列表查询
export function queryTopic(param) {
  return request('/microservice/management_of_meetings/meetings_topic_tatistics',param);
}

//汇报部门查询
export function queryReportDept(param) {
  return request('/microservice/management_of_meetings/meetings_dept_list_search',param);
}

//会议确认页面
//未上会会议列表查询
export function queryMeeting(param) {
  return request('/microservice/management_of_meetings/meetings_note_info_search',param);

}
// 未上会会议中议题列表查询
export function queryTopicList(param) {
  return request('/microservice/management_of_meetings/meetings_note_topic_list_search',param);
}
// 未上会会议 文件列表查询
export function queryFileList(param) {
  return request('/microservice/management_of_meetings/meetings_list_of_files_search',param);
}
// 未上会、已上会 三重一大审签单列表查询
export function queryImportantFileList(param) {
  return request('/microservice/management_of_meetings/meetings_topic_name_search_for_note_id',param);
}
// 未上会会议 办公室会议取消
export function cancelMeeting(param) {
  return request('/microservice/management_of_meetings/meetings_note_cancel',param);
}
// 未上会会议 通知钉钉消息
export function confrimInform(param) {
  //return request('/microservice/management_of_meetings/meetings_note_inform',param);
  return request('/microservice/allmanagementofmeetings/sendConferenceNotifications/noteDingDingNoticeServlet',param);
}
// 未上会会议 办公室管理员会后确认
export function confirmMeeting(param) {
  return request('/microservice/management_of_meetings/meetings_note_confirm',param);
}
// 已上会会议列表查询
export function queryConfirmedMeeing(param) {
  return request('/microservice/management_of_meetings/meetings_note_info_hasconfirm_search',param);
}
// 已上会会议附件查询
export function queryUpload(param) {
  return request('/microservice/management_of_meetings/meetings_topic_upload_search',param);
}
//已上会会议议题退回
export function returnTopic(param) {
  return request('/microservice/management_of_meetings/meetings_note_topic_return',param);
}
//已上会会议议题取消
export function cancelTopic(param) {
  return request('/microservice/management_of_meetings/meetings_note_topic_cancel',param);
}

//已上会会议议题开启归档流程
export function BeginTopicFile(param) {
  return request('/microservice/management_of_meetings/meetings_note_topic_file',param);
}
//2020/3/27
//已上会会议归档时发送邮件
export function SendEmailFile(param) {
  return request('/microservice/allmanagementofmeetings/newmeetings/SendEmailFile',param);
}
//已上会会议一键归档
export function TopicFile(param) {
  return request('/microservice/allmanagementofmeetings/newmeetings/TopicFile',param);
}
//已上会议题 -归档前修改
export function TopicManagerChange(param) {
  return request('/microservice/allmanagementofmeetings/newmeetings/TopicManagerChange',param);
}
//2020/4/7
//倒计时配置
export function CountDownDeploy(param) {
  return request('/microservice/allmanagementofmeetings/newmeetings/CountDownDeploy',param);
}
//倒计时查询服务
export function CountDownSearch(param) {
  return request('/microservice/allmanagementofmeetings/newmeetings/CountDownSearch',param);
}
//倒计时结束
export function CountDownEnd(param) {
  return request('/microservice/allmanagementofmeetings/newmeetings/CountDownEnd',param);
}



//可以生成会议的议题列表查询
export function queryAddTopicList(param) {
  return request('/microservice/management_of_meetings/meetings_topic_passed_list_search',param);
}
//已上会议题确认补充议题
export function confirmAddTopic(param) {
  return request('/microservice/management_of_meetings/meetings_note_confirmed_topic_add',param);
}
