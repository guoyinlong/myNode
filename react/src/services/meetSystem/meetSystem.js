/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 会议室系统的接口
  */
import request from '../../utils/request';

// export function fetch({ arg_typeid, arg_weekday }) {  //之前的
//   return request('/microservice/meet/searchoccupy',{arg_typeid, arg_weekday});
// }
export function fetch({arg_ou, arg_time_type, arg_typeid, arg_weekday}) {
  return request('/microservice/meeting/t_meeting_room_search_all_book_meeting_info',{arg_ou, arg_time_type, arg_typeid, arg_weekday});
}

/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 查询当前用户是否被限制预定会议室接口
  *  @param arg_stuffid  员工的stuffid
  */
export function limitSearch({ arg_stuffid }) {
  return request('/microservice/meet/limitSearch',{arg_stuffid});
}
export function limitSearchNew({ arg_staff_id }) {
  return request('/allmeetingmanager/meetingManager/checkLimit',{arg_staff_id});
}
export function dolimitBooker(param) {
  return request('/allmeetingmanager/meetingManager/limitBooker',param);
}

export function viewLimit(param) {
  return request('/allmeetingmanager/meetingManager/viewLimit',param);
}
export function removeLimit(param) {
  return request('/allmeetingmanager/meetingManager/removeLimit',param);
}
export function viewForced(param) {
  return request('/allmeetingmanager/meetingManager/viewForceCancel',param);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 查询当前用户的电话号码
  */
export function telSearch(param,key) {
  return request('/microservice/standardquery/meet/telSearch', param, key);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2018-01-27
  * 功能： 查询当前配置时间段
  */
export function timeSearch({ arg_ou }) {
  return request('/microservice/meeting/t_meeting_room_search_timeset',{arg_ou});
}
export function timeSearch2({ arg_ou, arg_time_type}) {
  return request('/microservice/meeting/t_meeting_room_search_time_period_for_title',{arg_ou,arg_time_type});
}
/**
  * 作者： 卢美娟
  * 创建日期： 2018-01-29
  * 功能： 查询上午、下午、晚上
  */
export function sxwSearch({ arg_ou }) {
  return request('/microservice/meeting/t_meeting_room_search_all_time_type',{arg_ou});
}
/**
  * 作者： 卢美娟
  * 创建日期： 2018-01-29
  * 功能： 查询当前配置会议室类型
  */
export function meetroomTypeSearch({ arg_ou }) {
  return request('/microservice/meeting/t_meeting_room_search_roomtype',{arg_ou});
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 查询会议室占用情况
  */
export function timeoccupySearch(param) {
  return request('/microservice/standardquery/meet/timeoccupySearch', param);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 插入预定
  */
export function timeoccupyInsert(param) {
  return request('/microservice/transinsert/meet/timeoccupyInsert', param);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 更新预定
  */
export function timeoccupyUpdate(param) {
  return request('/microservice/transupdate/meet/timeoccupyUpdate', param);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 插入预定
  */
export function insertOrder(param) {
  return request('/microservice/transinsert/meet/insertOrder', param);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 查询我的预定
  */
export function myorderSearch(param) {
   return request('/microservice/standardquery/meet/myorderSearch', param);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 取消预定
  */
export function cancelOrder(param){
  return request('/microservice/transupdate/meet/cancelOrder', param);
}
export function cancelOrderNew(param){
  // return request('/microservice/meeting/t_meeting_room_cancel_meeting', param);
  return request('/allmeetingmanager/meetingManager/cancelMeeting', param);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 插入限制预定
  */
export function insertLimit(param){
  return request('/microservice/transinsert/meet/insertLimit', param);
}
export function limitBooker(param){
  return request('/allmeetingmanager/meetingManager/limitBooker', param);
}

/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 查询我的预定
  */
// export function searchordered(param) {   //old
//   return request('/microservice/standardquery/meet/myorderSearch', param);
// }
export function searchordered(param) {
  return request('/microservice/meeting/t_meeting_room_search_meeting_info',param);
}
export function searchEquipment(param) {
  return request('/microservice/meeting/t_meeting_room_search_room_details',param);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 更新预定
  */
export function orderUpdate(param) {
  return request('/microservice/transupdate/meet/orderUpdate', param);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 插入会议室预定
  */
export function insertroommeeting(param) {
  return request('/microservice/meet/insertroommeeting', param);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27  2018-02-03
  * 功能： 查询预定列表
  */
export function searchMeetList(param) {
  return request('/microservice/meet/searchMeetList', param);
}
export function searchMeetListNew(param) {
  return request('/microservice/meeting/t_meeting_room_view_all_meeting', param);
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 新预定服务
  */
export function bookmeetingnew_proc(param) {
  return request('/microservice/meeting/bookmeetingnew_proc', param);
}
export function bookmeetingNEW(param) {
  return request('/allmeetingmanager/meetingManager/bookMeeting', param);
}
//新取消服务
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 新取消服务
  */
export function cancelbookmeetingnew(param) {
  return request('/microservice/meeting/cancelbookmeetingnew', param);
}
//新修改预定
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 新修改预定
  */
export function changebookmeetingnew(param) {
  return request('/microservice/meeting/changebookmeetingnew', param);
}

export function rebookMeeting(param) {
  return request('/allmeetingmanager/meetingManager/rebookMeeting', param);
}

/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 查询公告
//   */
export function noticeSearch(param) {

  return request('/microservice/meet/noticeSearch', {arg_type_id:'2'});
}
/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 功能： 编辑公告
  */
export function noticeInsert(param) {

  return request('/microservice/transinsert/meet/noticeInsert', param);
}



/**
  * 作者： 卢美娟
  * 创建日期： 2018-02-02
  * 功能： 查询我的预定
  */
export function myorderSearchNew({arg_booker_id}) {
   return request('/microservice/meeting/t_meeting_room_view_my_bookinfo', {arg_booker_id});
}
/**
  * 作者： 卢美娟
  * 创建日期： 2018-02-03
  * 功能： 查询会议列表
  */
export function orderSearchNew({arg_room_id}) {
   return request('/microservice/meeting/t_meeting_room_view_all_bookinfo', {arg_room_id});
}

/**
  * 作者： 卢美娟
  * 创建日期： 2018-02-05
  * 功能： 强制取消
  */
export function forceCancel({arg_meeting_id,arg_cancel_reason}) {
   return request('/allmeetingmanager/meetingManager/forceCancel', {arg_meeting_id,arg_cancel_reason});
}
/**
  * 作者： 卢美娟
  * 创建日期： 2018-02-09
  * 功能： 获取会议类别
  */
export function meetLevelSearch({arg_ou}) {
   return request('/microservice/meeting/t_meeting_room_search_meetinglevel', {arg_ou});
}

/**
 * 作者： 石宇菁
 * 创建日期： 2018-01-25
 * 功能： 查询会议室信息
 */
export function meetRoomC(param) {
  return request('/microservice/meeting/t_meeting_room_search_roominfo', param);
}
/**
 * 作者： 石宇菁
 * 创建日期： 2018-01-25
 * 功能： 查询ou信息
 */
export function meetRoomCompany(param) {
  return request('/microservice/meeting/t_meeting_room_search_ouinfo', param);
}
/**
 * 作者： 石宇菁
 * 创建日期： 2018-01-25
 * 功能： 查询会议室类型
 */
export function meetRoomType(param) {
  return request('/microservice/meeting/t_meeting_room_search_roomtype', param);
}
/**
 * 作者： 石宇菁
 * 创建日期： 2018-01-25
 * 功能： 添加会议室
 */
export function addMeetRoomConfig(param) {
  return request('/microservice/meeting/t_meeting_room_add_roominfo', param);
}
/**
 * 作者： 石宇菁
 * 创建日期： 2018-01-25
 * 功能： 删除会议室
 */
export function deleteData(param) {
  return request('/microservice/meeting/t_meeting_room_delete_roominfo', param);
}
/**
 * 作者： 石宇菁
 * 创建日期： 2018-01-25
 * 功能： 添加会议室
 */
export function editMeetRoomConfig(param) {
  return request('/microservice/meeting/t_meeting_room_update_roominfo', param);
}

/**
 * 作者： 卢美娟
 * 创建日期： 2019-03-22
 * 功能： 添加会议室
 */
export function searchDeptId(param) {
  return request('/microservice/assetmanage/deptIdQuery', param);
}
/**
 * 作者：彭东洋
 * 创建日期： 2020-05-26
 * 功能： 重要出席者
 */
export function showVIP(param) {
  return request('/allmeetingmanager/meetingManager/showVIP', param);
}