/**
 * 作者：邓广晖
 * 日期：2018-03-29
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：资金计划填报服务
 */

import request from '../../utils/request';

// 资金计划填报类别查询
export function getFundingUserType(params) {
  return request('/microservice/funding_plan/get_funding_type', params);
}
// 小组管理员填写他购时获取小组成员名单
export function getTeamMembers(params) {
  return request('/microservice/funding_plan/get_team_member_userid', params);
}
// 科目名称查询
export function getFeeList(params) {
  return request('/microservice/funding_plan/get_fee_name',params);
}
// 办公用品商品查询
export function getOfficeSuppliesList(params) {
  return request('/microservice/funding_plan/get_office_supplies', params);
}

//获取填报的数据
export function getFillData(params) {
  return request('/microservice/fundingplan/fundsBudget/fundsBudgetListServlet',params);
}

// 获取当前资金计划填报阶段
export function getBatchType(params) {
  //return request('/microservice/funding_plan/get_batch_type', params);
  return request('/microservice/funding_plan/get_batch_type_query',params);
}

//保存或者提交
export function saveOrSubmitFillData(params) {
  //return request('/microservice/funds_budget/FundsBudgetInsert',params);
  //return request('/microservice/fundingplan/fundsBudget/Funds_budget_insert',params);
  return request('/microservice/fundingplan/fundsBudget/fundsBudgetInsertNewServlet',params);
}
export function saveOrSubmitFillAdjustData(params) {
  //return request('/microservice/funds_budget/FundsBudgetInsert',params);
  //return request('/microservice/fundingplan/fundsBudget/Funds_budget_insert',params);
  return request('/microservice/fundingplan/fundsBudget/fundsBudgetAdjustServlet',params);
}

//获取填报的数据
export function copyCurrentMonthFillData(params) {
  return request('/microservice/funding_plan/funds_budget_fee_name_template_copy',params);
}
//获取项目列表
export function getProjList(params) {
  return request('/microservice/cos/proj_budget_going_sel_os_proc',params);
}
