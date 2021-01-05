/**
 * 作者：杨青
 * 创建日期：2018-3-20
 * 邮箱：yangq41@chinaunicom.cn
 * 文件说明：资金计划报表服务
 */
import request from '../../utils/request';
//资金计划报表-月度资金计划查询
export function searchMonthlyReportForm(params) {
  return request('/microservice/funds_plan/funds_budget_monthly_report_form_search',params);
}
//资金计划生成阶段查询
export function searchBatchType(params) {
  return request('/microservice/funding_plan/search_report_batch_query',params);
}
//资金计划ou生成情况
export function queryOUFundingPlan(params) {
  return request('/microservice/funding_plan/query_ou_funding_plan_money',params);
}
//资金计划分院生成
export function generateOU(params) {
  return request('/microservice/funding_plan/monthly_funding_plan_ou_generate',params);
}
//资金计划三院生成
export function generateAllOU(params) {
  return request('/microservice/funding_plan/monthly_funding_plan_all_ou_generate',params);
}
//资金计划撤销
export function undoAllOU(params) {
  return request('/microservice/funding_plan/undo_allOu_funding_plan',params);
}
//资金计划ou追加计划明细表查询
export function queryAddJect(params) {
  return request('/microservice/funding_plan/get_query_fuding_plan_addJect',params);
}
//月度资金计划审批表
export function queryMonthlyApprovalForm(params) {
  return request('/microservice/funding_plan/get_query_monthly_approval_form',params);
}
//资金计划以前年度应付费查询
export function queryPreviousYears(params) {
  return request('/microservice/funding_plan/get_query_payable_expenses_in_previous_years',params);
}
//资金计划capex查询
export function queryOUCAPEX(params) {
  return request('/microservice/funding_plan/get_query_ou_capex_money',params);
}
//资金计划部门生成情况查询
export function queryDept(params) {
  return request('/microservice/funding_plan/monthly_funding_plan_ou_dept_generate',params);
}


//部门以前年度应付款支出明细表的查询
export function getOldMonthDetails(params) {
  return request('/microservice/funds_plan/pre_year_additional_detailed_form_dept_search',params);
}
//部门capex支出明细表的查询
export function getCAPEXDetails(params) {
  return request('/microservice/funds_plan/capex_detailed_form_dept_search',params);
}
//部门追加明细表
export function getAddDetailForm(params) {
  return request('/microservice/funds_plan/monthly_funding_additional_detailed_form_dept_search', params);
}
