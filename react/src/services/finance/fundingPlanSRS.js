/**
 * 作者：张楠华
 * 创建日期：2018-3-1
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划审核，查询，启动服务
 */
import request from '../../utils/request';
//个人/团队/部门/财务查询
export function getBusName(params) {
  return request('/microservice/funding_plan/query_bus_id_and_name',params);
}
//个人查询
export function personSearch(params) {
  return request('/microservice/funds_plan/dw_syn_receive_search_for_person',params);
}
//团队查询
export function teamSearch(params) {
  return request('/microservice/funds_plan/dw_syn_receive_search_for_team',params);
}
//部门查询
export function deptSearch(params) {
  return request('/microservice/funds_plan/dw_syn_receive_search_for_dept',params);
}
//财务查询
export function financeSearch(params) {
  return request('/microservice/funds_plan/dw_syn_receive_search_for_ou',params);
}
//审核查询
export function reviewSearch(params) {
  return request('/microservice/funding_plan/funds_budget_search_budget_record',params);
}
//通过
export function pass(params) {
  return request('/microservice/funding_plan/funds_budget_check_data',params);
}
//退回
export function returnCrl(params) {
  return request('/microservice/funding_plan/funds_budget_return_data',params);
}
//资金计划开启查询
export function queryTime(params) {
  return request('/microservice/funding_plan/funds_plan_start_search',params);
}
//资金计划添加开放时间
export function addTime(params) {
  return request('/microservice/funding_plan/funds_plan_start_insert',params);
}
//资金计划修改开放时间
export function editTime(params) {
  return request('/microservice/funding_plan/funds_plan_start_update_time',params);
}
//资金计划删除时间
export function delTime(params) {
  return request('/microservice/funding_plan/funds_plan_start_delete',params);
}
//立即结束
export function endState(params) {
  return request('/microservice/funding_plan/funds_plan_start_finish',params);
}
//查询某个人属于某个团队
export function searchTeam(params) {
  return request('/microservice/funding_plan/query_team_by_staffid',params);
}
//查询科目名称
export function GetSubjectName(params) {
  return request('/microservice/fundingplan/subjectmanage/GetSubjectName',params);
}
//ou查部门
export function GetDepartProjInfo(params) {
  return request('/microservice/funding_plan/query_department_by_ou',params);
}
//部门查团队
export function GetDepartInfo(params) {
  return request('/microservice/funding_plan/query_team',params);
}
//调账
export function adjustAccount(params) {
  return request('/microservice/funds_plan/dw_syn_receive_adjust',params);
}
//部门管理员生成报表
export function generateData(params) {
  return request('/microservice/funds_plan/funding_budget_form_dept_generate',params);
}
//部门管理员撤销报表
export function deleteData(params) {
  return request('/microservice/funds_plan/funding_budget_form_dept_delete',params);
}
//部门管理员查询完成比
export function completeRatio(params) {
  return request('/microservice/funds_plan/monthly_funding_dept_complete_ratio',params);
}

//部门以前年度应付款支出明细表的查询
export function getOldMonthDetails(params) {
  return request('/microservice/funds_plan/pre_year_additional_detailed_form_dept_search',params);
}
//部门capex支出明细表的查询
export function getCAPEXDetails(params) {
  return request('/microservice/funds_plan/capex_detailed_form_dept_search',params);
}
//部门中所有小组的完成比的查询
export function allTeamCompleteRatio(params) {
  return request('/microservice/funds_plan/monthly_funding_all_team_complete_ratio',params);
}
//部门管理员 某个小组的追加明细表
export function teamAdditional(params) {
  return request('/microservice/funds_plan/monthly_funding_additional_detailed_form_team_search',params);
}
//部门管理员 某个小组的以前年度应付款明细表
export function getOldMonthTeamDetails(params) {
  return request('/microservice/funds_plan/pre_year_additional_detailed_form_team_search',params);
}
//部门管理员 某个小组的capex的支出明细表
export function getTeamCAPEXDetails(params) {
  return request('/microservice/funds_plan/capex_detailed_form_team_search',params);
}
//资金计划部门追加明细表
export function getDeptMonthlyDetails(params) {
  return request('/microservice/funds_plan/monthly_funding_additional_detailed_form_dept_search',params);
}
//小组管理员 查完成比
export function teamAdditionalCompleteRatio(params) {
  return request('/microservice/funds_plan/monthly_funding_team_complete_ratio',params);
}
//小组计划部门追加明细表
export function getTeamMonthly(params) {
  return request('/microservice/funds_plan/monthly_funding_additional_detailed_form_one_team_search',params);
}
//小组管理员 某个小组的以前年度应付款明细表
export function getOldMonthTeam(params) {
  return request('/microservice/funds_plan/pre_year_additional_detailed_form_one_team_search',params);
}
//小组管理员 某个小组的capex的支出明细表
export function getTeamCAPEX(params) {
  return request('/microservice/funds_plan/capex_detailed_form_one_team_search',params);
}
export function getBatchType(params) {
  return request('/microservice/funding_plan/get_batch_type_query',params);
}
//全成本  人工成本管理查询
export function queryLabourData(params) {
  return request('/microservice/cos/erpmaintain/labour_cost_list_query',params);
}
//全成本  人工成本生成数据
export function generateLabourCost(params) {
  return request('/microservice/cosservice/erpmaintain/labourCostGenerateServlet',params);
}
//全成本  人工成本撤销数据
export function cancelData(params) {
  return request('/microservice/cos/erpmaintain/labour_cost_list_delete',params);
}
export function queryFundsBudgetRecordDetailList(params) {
  return request('/microservice/fundingplan/fundsBudget/fundsBudgetRecordDetailListServlet',params);
}

export function getOu(params) {
  return request('/microservice/funding_plan/query_all_ou',params);
}

// 财务报销图表生成
export const funding_expense_generate = params => request('/microservice/funding_plan/funding_expense_generate', params);
