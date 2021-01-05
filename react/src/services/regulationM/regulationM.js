/**
 * 作者： 卢美娟
 * 创建日期： 2018-04-16
 * 邮箱: lumj14@chinaunicom.cn
 * 功能：资产管理（二维码库）接口
 */
import request from '../../utils/request';


export function regulationQuery(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/regulationQuery', param);
}
export function regulationtopdownquery(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/regulationTopDownQuery', param);
}
export function myregulationquery(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/myRegulationQuery', param);
}
export function myregulationquery2(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/myRegulationQuery', param);
}
export function myMessagequery(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/leaveMsgMyQuery', param);
}
export function globalMessagequery(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/leaveMsgQuery', param);
}
export function saveUploadFile(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/regulationSave', param);
}
export function leaveMsgDel(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/leaveMsgDel', param);
}
export function leaveMsgAdd(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/leaveMsgAdd', param);
}
export function leaveMsgReply(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/leaveMsgReply', param);
}
export function enableRegulation(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/enableRegulation', param);
}
export function regulationDel(param) { //删除规章制度草稿
  return request('/regulationmanageservice/regulationmanage/regulation/regulationDel', param);
}
export function regulationDownload(param) { //增加规章制度下载记录
  return request('/regulationmanageservice/regulationmanage/regulation/regulationDownload', param);
}
export function subRolequery(param) { //查询子管理员
  return request('/authentication/userlistforrole', param);
}
export function categoryAdd(param) { //创建类别
  return request('/regulationmanageservice/regulationmanage/regulation/categoryAdd', param);
}
export function categoryEdit(param) { //修改类别
  return request('/regulationmanageservice/regulationmanage/regulation/categoryEdit', param);
}
export function categoryDel(param) { //删除类别
  return request('/regulationmanageservice/regulationmanage/regulation/categoryDel', param);
}
export function categoryAdminQuery(param) { //平台管理员或子管理员查询类别
  return request('/regulationmanageservice/regulationmanage/regulation/categoryAdminQuery', param);
}
export function publishRegulationSendReview(param) { //平台管理员或子管理员查询类别
  return request('/regulationmanageservice/regulationmanage/regulation/publishRegulationSendReview', param);
}
export function regulationChildManagerQuery(param) { //平台管理员或子管理员查询类别
  return request('/regulationmanageservice/regulationmanage/regulation/regulationChildManagerQuery', param);
}
export function assignCategory(param) { //平台管理员或子管理员查询类别
  return request('/regulationmanageservice/regulationmanage/regulation/assignCategory', param);
}
export function regulationCategoryQuery(param) { //查询可上传的规章制度类别
  // return request('/regulationmanageservice/regulationmanage/regulation/regulationCategoryQuery', param);
  return request('/regulationmanageservice/regulationmanage/regulation/myRegulationCategoryQuery', param);
}
export function regulationCategoryAllQuery(param) { //查询所有的的规章制度类别
  return request('/regulationmanageservice/regulationmanage/regulation/regulationCategoryQuery', param);
}
export function regulationSystemsQuery(param) { //查询我可以发布的规章制度体系   一级制度  二级制度  三级制度
  return request('/microservice/regulationmanage/sys_list_query', param);
}
export function regulationLevelQuery(param) { //查询我可以发布的规章制度级别
  return request('/regulationmanageservice/regulationmanage/regulation/regulationLevelAdminQuery', param);
}
export function regulationKindQuery(param) { //查询规章制度性质
  return request('/regulationmanageservice/regulationmanage/regulation/regulationKindQuery', param);
}
export function todoReviewQuery(param) { //查询规章制度性质
  return request('/regulationmanageservice/regulationmanage/regulation/todoReviewQuery', param);
}
export function publishRegulationReview(param) { //审核是否允许发布规章制度
  return request('/regulationmanageservice/regulationmanage/regulation/publishRegulationReview', param);
}
export function todoReviewRejctQuery2(param) {
  return request('/regulationmanageservice/regulationmanage/regulation/todoReviewRejctQuery', param);
}
export function publishRegulationAbandon(param) { //作废规章制度
  return request('/regulationmanageservice/regulationmanage/regulation/publishRegulationAbandon', param);
}
export function deleteRegulationSendReview(param) { //删除规章制度送审核
  return request('/regulationmanageservice/regulationmanage/regulation/deleteRegulationSendReview', param);
}
export function delRegulationAbandon(param) { //作废删除规章制度
  return request('/regulationmanageservice/regulationmanage/regulation/delRegulationAbandon', param);
}
export function delRegulationResendReview(param) { //重新删除规章制度送审核
  return request('/regulationmanageservice/regulationmanage/regulation/delRegulationResendReview', param);
}
export function delRegulationReview(param) { //重新删除规章制度送审核
  return request('/regulationmanageservice/regulationmanage/regulation/delRegulationReview', param);
}
export function publishRegulationResendReview(param) { //重新删除规章制度送审核
  return request('/regulationmanageservice/regulationmanage/regulation/publishRegulationResendReview', param);
}
export function getRoleQuery(param) { //获取用户所属角色
  return request('/microservice/serviceauth/p_usergetroles', param);
}
export function filedownload(param) { //文件下载服务
  return request('/filemanage/filedownload', param);
}
export function filegetzippath(param) { //文件下载服务
  return request('/filemanage/filegetzippath', param);
}
