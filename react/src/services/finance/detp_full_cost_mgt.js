/**
 * 作者：郝锐
 * 日期：2017-11-11
 * 邮件：haor@itnova.com.cn
 * 文件说明：部门预算完成情况
 */
import request from "../../utils/request";

// 部门差旅预算完成情况查询
export function proj_budget_going_multiproj_dept_query(params) {
  return request('/microservice/cos/proj_budget_going_multiproj_dept_query',params)
}
export function proj_budget_going_multiproj_dept_detail_query(params) {
  return request('/microservice/cos/proj_budget_going_multiproj_dept_detail_query',params)
}
// 最近有数据年月查询
export function search_last_year_month_new(params) {
  return request('/microservice/cos/search_last_year_month_new',params)
}
//归属部门查询
export function project_common_get_all_pu_department(params) {
  return request('/microservice/project/project_common_get_all_pu_department',params)
}
// 用户角色查询
export function p_usergetouordeptinmodule(params) {
  return request('/microservice/serviceauth/p_usergetouordeptinmodule',params);
}
// 用户权限查询
export function p_userhasmodule(params) {
  return request('/microservice/serviceauth/p_userhasmodule',params)
}
// 部门预算完成情况总计
export function all_dept_budget(params) {
  return request('/microservice/cosservice/erpmaintain/deptTravelBudget',params)
}
