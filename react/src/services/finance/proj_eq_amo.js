/**
 * 作者：郝锐
 * 日期：2020-03-05
 * 邮件：haor@itnova.com.cn
 * 文件说明：erp成本导入-项目设备摊销
 */
import request from "../../utils/request";

// 同步
export function proj_amo_generate(params) {
  return request('/microservice/cos/proj_amo_generate',params)
}
// 发布
export function proj_amo_publish(params) {
  return request('/microservice/cos/proj_amo_publish',params)
}
// 撤销
export function proj_amo_cancel(params) {
  return request('/microservice/cos/proj_amo_cancel',params)
}
// 查询
export function proj_amo_query(params) {
  return request('/microservice/cos/proj_amo_query',params)
}
// 获取ou列表
export function get_ou_list(params) {
  return request('')
}
// 用户角色查询
export function p_usergetouordeptinmodule(params) {
  return request('/microservice/serviceauth/p_usergetouordeptinmodule',params);
}
// 用户权限查询
export function p_userhasmodule(params) {
  return request('/microservice/serviceauth/p_userhasmodule',params)
}

// 最近有数据年月查询
export function search_amo_last_year_month(params) {
  return request('/microservice/cos/search_amo_last_year_month',params)
}
