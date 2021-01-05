/**
 * 作者： 杨青
 * 创建日期： 2019-07-10
 * 邮箱: yangq41@chinaunicom.cn
 * 功能： 会议管理-会议生成
 */
import request from '../../utils/request';
//办公室审核通过的议题列表查询(判断会议能否生成)
export function queryPassedMeetingTopic(param) {
  return request('/microservice/management_of_meetings/meetings_topic_passed_list_search', param);
}
//会议类型列表查询
export function queryMeetingType(param) {
  return request('/microservice/management_of_meetings/meetings_type_search', param);
}
//办公室议题撤回
export function returnTopicByOffice(param) {
  return request('/microservice/management_of_meetings/meetings_topic_office_back', param);
}

//会议室列表查询
export function queryMeetingRoomList(param) {
  return request('/microservice/management_of_meetings/meetings_room_search', param);
}
//会议标题（次数）查询
export function queryMeetingOrder(param) {
    return request('/microservice/management_of_meetings/meetings_note_order_search', param);
}

//查询会议议题列表-会后增加议题页面
export function queryMeetingTopicList(param) {
  return request('/microservice/management_of_meetings/meetings_note_topic_list_search', param);
}
//查询会议列表服务-会后增加议题页面
export function queryMeetingInfo(param) {
  return request('/microservice/management_of_meetings/meetings_note_info_hasconfirm_search', param);
}
//确认补充议题服务-会后增加议题页面
export function addTopic(param) {
  return request('/microservice/management_of_meetings/meetings_note_confirmed_topic_add', param);
}
//会议生成
//发送上会议题清单
export function sendTopics(param) {
  return request('/microservice/allmanagementofmeetings/newmeetings/SendToManager',param);
}
//确认生成会议通知
export function confirmAddMeeting(param) {
  return request('/microservice/management_of_meetings/meetings_note_info_add', param);
}
//拟上会会议清单议题列表查询   （院长审核通过的清单）
export function searchMeetingList(param) {
  return request('/microservice/management_of_meetings/meetings_topic_office_submit_list_search', param);
}
//拟上会会议清单议题列表查询   （院长审核通过的清单）
export function deptquery(param) {
  return request('/microservice/userauth/deptquery', param);
}
