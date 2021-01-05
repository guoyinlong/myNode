/**
 * 作者： 张楠华
 * 创建日期： 2018-01-23
 * 邮箱: zhangnh6@chinaunicom.cn
 * 功能： 会议室系统基础配置接口
 */
import request from '../../utils/request';
export function queryMeetingType(param) {
  return request('/microservice/meeting/t_meeting_room_search_roomtype', param);
}
export function queryMeetingCategory(param) {
  return request('/microservice/meeting/t_meeting_room_search_meetinglevel', param);
}
export function queryTimeType(param) {
  return request('/microservice/meeting/t_meeting_room_search_timeset', param);
}
export function queryInterfacePersonType(param) {
  return request('/microservice/meeting/t_meeting_room_search_linkerinfo', param);
}
export function delMeetingType(param) {
  return request('/microservice/meeting/t_meeting_room_delete_roomtype', param);
}
export function delMeetingCategory(param) {
  return request('/microservice/meeting/t_meeting_room_delete_meetinglevel', param);
}
export function delInterfacePersonType(param) {
  return request('/microservice/meeting/t_meeting_room_delete_linkerinfo', param);
}
export function delConfigure(param) {
  return request('/microservice/meeting/t_meeting_room_delete_timeset', param);
}
export function addMeetingType(param) {
  return request('/microservice/meeting/t_meeting_room_add_roomtype', param);
}
export function addMeetingCategory(param) {
  return request('/microservice/meeting/t_meeting_room_add_meetinglevel', param);
}
export function addTimeType(param) {
  return request('/microservice/meeting/t_meeting_room_add_timeset', param);
}
export function addInterfacePersonType(param) {
  return request('/microservice/meeting/t_meeting_room_add_linkerinfo', param);
}

export function addOUType(param) {
  return request('/microservice/meeting/t_meeting_room_add_ouinfo', param);
}
export function delOUType(param) {
  return request('/microservice/meeting/t_meeting_room_delete_ouinfo', param);
}
export function queryOUType(param) {
  return request('/microservice/meeting/t_meeting_room_search_ouinfo', param);
}
export function uploadOUInfo(param) {
  return request('/microservice/meeting/t_meeting_room_upload_photo', param);
}
export function delMeetRoomPhoto(param) {
  return request('/microservice/meeting/t_meeting_room_delete_photo', param);
}
export function editInterfacePersonType(param) {
  return request('/microservice/meeting/t_meeting_room_update_linkerinfo', param);
}
export function editTimeType(param) {
  return request('/microservice/meeting/t_meeting_room_update_timeset', param);
}
export function editMeetingCategory(param) {
  return request('/microservice/meeting/t_meeting_room_update_meetinglevel', param);
}
export function editMeetingType(param) {
  return request('/microservice/meeting/t_meeting_room_update_roomtype', param);
}
export function editOUType(param) {
  return request('/microservice/meeting/t_meeting_room_update_ouinfo', param);
}
export function searchOU(param) {
  return request('/microservice/serviceauth/search_ou', param);
}
export function roomIfUseAble(param) {
  return request('/microservice/meeting/t_meeting_room_if_useable', param);
}



