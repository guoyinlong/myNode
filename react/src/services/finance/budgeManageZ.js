/**
 * 作者：张楠华
 * 创建日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：预算管理服务
 */
import request from '../../utils/request';

// 全成本判断用户权限
export function costUserHasModule(param) {
  return request('/microservice/serviceauth/p_userhasmodule',param);
}
// 获取用户OU
export function costUserGetOU(param) {
  return request('/microservice/serviceauth/p_usergetouordeptinmodule',param);
}

//查ou
export function queryOU(param) {
  return request('/budgetservice/fee_maintain/deptInfoListQueryServlet', param);
}
//ou查部门
export function GetDepartProjInfo(params) {
  return request('/microservice/project/project_common_get_all_pu_department',params);
}
//查询年度预算
export function getAnnualBudget(params) {
  return request('/microservice/project/project_common_get_all_pu_department',params);
}
//查询滚动预算
export function getRollingBudget(params) {
  return request('/microservice/project/project_common_get_all_pu_department',params);
}
//查询预算完成
export function getBudgetImplement(params) {
  return request('/microservice/project/project_common_get_all_pu_department',params);
}
//查询月度预算完成
export function getMonthlyBudgetImplement(params) {
  return request('/microservice/project/project_common_get_all_pu_department',params);
}
//查询费用科目信息
export function getCostMgtData(params) {
  return request('/microservice/cuccallcost/feemaintain/costFeeNameQueryServlet',params);
}
//************
//月度预算完成情况查询
export function queryMonthlyBudgetCompletion(params) {
  return request('/microservice/budget/monthly_budget_completion_query',params);
}

//生成月度数据后审核前修改
export function updateMonthlyBudgetCompletion(params) {
  return request('/microservice/budget/monthly_budget_completion_update',params);
}
//************
//年度预算完成情况查询
export function queryYearBudget(params) {
  return request('/microservice/budget/annual_budget_query',params);
}

//年度预算完成情况查询
export function updateYearBudget(params) {
  return request('/microservice/budget/year_budget_update',params);
}

//年度预算执行情况的查询
export function queryAnnualBudgetCompletion(params) {
  return request('/microservice/budget/annual_budget_completion_query',params);
}

//年度预算表的撤销
export function cancelAnnualBudget(params) {
  return request('/microservice/budget/annual_budget_cancel_update',params);
}

//执行情况生成
export function generateMonthlyBudgetCompletion(params) {
  return request('/microservice/budget/monthly_budget_monthly_budget_cost_generate',params);
}

//执行情况生成撤销
export function cancelMonthlyBudgetCompletion(params) {
  return request('/microservice/budget/monthly_budget_completion_cancel',params);
}

//执行情况生成撤销
export function checkMonthlyBudgetCompletion(params) {
  return request('/microservice/budget/monthly_budget_completion_check',params);
}
//************
//滚动预算完成情况查询
export function queryRollingBudget(params) {
  return request('/microservice/budget/monthly_rolling_budget_query',params);
}
//撤销滚动预算的模板导入
export function cancelMonthlyRollingBudget(params) {
  return request('/microservice/budget/monthly_rolling_budget_cancel',params);
}
//滚动预算的修改
export function updateRollingBudget(params) {
  return request('/microservice/budget/monthly_rolling_budget_update',params);
}
//**************
//人力资源归口
export function queryHrBudget(params) {
  return request('/microservice/budget/human_resource_fee_budget_going',params);
}
//人力资源归口
export function queryOfficeBudget(params) {
  return request('/microservice/budget/office_concentration_fee_budget_going',params);
}

//查询角色
export function queryUserRole(params) {
  return request('/microservice/serviceauth/user_role_info_query',params);
}
