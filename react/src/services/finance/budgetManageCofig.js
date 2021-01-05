/**
 * 作者：张楠华
 * 创建日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：预算管理服务
 */
import request from '../../utils/request';


//查询归口费用
export function returnCost(param) {
  return request('/microservice/budget/feemaintain/feemaintain_concentration_fee_list_query', param);
}
//费用用途查询
export function querySubject(params) {
  return request('/microservice/budget/feemaintain/feemaintain_fee_use_info_list_query',params);
}
//新增费用
export function addExpenseAccount(param) {
  return request('/microservice/budget/feemaintain/feemaintain_fee_add', param);
}
//编辑费用
export function editExpenseAccount(param) {
  return request('/microservice/budget/feemaintain/feemaintain_fee_update', param);
}
//删除费用
export function delExpenseAccount(param) {
  return request('/microservice/budget/feemaintain/feemaintain_fee_delete', param);
}
//查询费用科目信息
export function getCostMgtData(params) {
  return request('/budgetservice/fee_maintain/feeInfoListQueryServlet',params);
}


//项目类型查询
export function queryProject(params) {
  return request('/microservice/budget/feemaintain/feemaintain_proj_type_list_query',params);
}
//成本中心查询
export function queryCostCenter(params) {
  return request('/budgetservice/fee_maintain/deptInfoListQueryServlet',params);
}
//查询现有费用规则
export function queryFeeCost(params) {
  return request('/microservice/budget/feemaintain/feemaintain_fee_rule_list_query',params);
}
//查询现有全口径
export function queryFullAperture(params) {
  return request('/microservice/budget/feemaintain/feemaintain_all_fee_fule_list_query',params);
}
//删除费用科目
export function delFeeCost(params) {
  return request('/microservice/budget/feemaintain/feemaintain_fee_rule_delete',params);
}
//删除全口径规则
export function delFullAperture(params) {
  return request('/microservice/budget/feemaintain/feemaintain_all_fee_fule_delete',params);
}
//增加费用规则
export function addFeeCost(params) {
  return request('/budgetservice/fee_maintain/feeRuleAddServlet',params);
}
//增加全口径规则
export function addFullAperture(params) {
  return request('/budgetservice/fee_maintain/allFeeRuleAddServlet',params);
}
//DW会计科目查询
export function queryDWList(params) {
  return request('/microservice/budget/feemaintain/feemaintain_dw_fee_list_query',params);
}
//添加DW会计科目
export function addDWList(params) {
  return request('/microservice/budget/feemaintain/feemaintain_dw_fee_add',params);
}
//删除DW会计科目
export function delDWList(params) {
  return request('/microservice/budget/feemaintain/feemaintain_dw_fee_delete',params);
}
//编辑DW会计科目
export function editDWList(params) {
  return request('/microservice/budget/feemaintain/feemaintain_dw_fee_update',params);
}
//查询成本中心列表
export async function queryDeptList(params) {
  return request('/microservice//budget/costcenter/cost_center_list_query',params);
}
//添加成本中心
export async function addDeptList(params) {
  return request('/budgetservice/cost_center/CostCenterAddServlet',params);
}
//删除成本中心
export async function delDeptList(params) {
  return request('/microservice/budget/costcenter/cost_center_delete',params);
}
//编辑成本中心
export async function editDeptList(params) {
  return request('/microservice/budget/costcenter/cost_center_update', params);
}
//查ou
// 判断用户权限
export function costUserHasModule(param) {
  return request('/microservice/serviceauth/p_userhasmodule',param);
}
// 获取用户OU
export function costUserGetOU(param) {
  return request('/microservice/serviceauth/p_usergetouordeptinmodule',param);
}
//查统计类型
export function stateParamQuery(params) {
  return request('/microservice/cos/stateparam_query',params);
}
//部门自管费用
export function deptBudget(params) {
  return request('/microservice/budget/dept_travel_fee_budget_going_attribute_query',params);
}
//生成自管费用
export function deptBudgetGenerate(params) {
  return request('/microservice/budget/dept_travel_fee_budget_going_attribute_generate',params);
}
//发布自管费用
export function deptBudgetPublic(params) {
  return request('/microservice/budget/dept_travel_fee_budget_going_attribute_publish',params);
}
//撤销自管费用
export function deptBudgetCancel(params) {
  return request('/microservice/budget/dept_travel_fee_budget_going_attribute_cancel',params);
}
//全网性
export function wholeNetwork(params) {
  return request('/microservice/budget/whole_network_fee_budget_going',params);
}
//折旧分摊
export function depreciationSharing(params) {
  return request('/microservice/budget/depreciation_amortization_fee_budget_going',params);
}
//查询角色
export function queryUserRole(params) {
  return request('/microservice/serviceauth/user_role_info_query',params);
}
