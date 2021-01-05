/**
 * 作者：陈红华
 * 创建日期：2017-09-13
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本用到的服务
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
// 获取权限
export function userGetModule(param) {
  return request('/microservice/serviceauth/usergetmodule_grpsrv',param);
}

// 获取最近有数据的年月
export async function getMonth(param) {
  return request(' /microservice/cos/search_labour_last_year_month',param);
}

//-----------------------------------------------------TODO 费用科目维护----------------------------------------------------------------------
// 费用科目维护查询服务
export function costmaintenQuery(param) {
  return request('/microservice/cos/costmaintenquery',param);
}
// 费用科目维护获取当前OU下的上级费用项
export function queryFeeNameBat(param) {
  return request('/microservice/standardquery/cos/queryfeenamebat',param);
}
// 费用科目维护修改服务
export function feeNameUpdateBat(param) {
  return request('/microservice/transupdate/cos/feenameupdate_bat',param);
}
// 费用科目维护新增服务
export function feeNameAddBat(param) {
  return request('/microservice/transinsert/cos/feenameadd_bat',param);
}
// -----------------------------------------------------TODO erp成本导入----------------------------------------------------------------------
// 直接成本阅览服务
export function straightPreview(param){
  // return request('/microservice/cosservice/projectcost/straightpreview/kk',param);
  return request('/microservice/cosservice/projectcost/allcost/straightpreview',param);

}
// 间接成本预览服务
export function IndirectPreview(param){
  // return request('/microservice/cosservice/projectcost/Indirectview/kk',param);
  return request('/microservice/cosservice/projectcost/allcost/Indirectview',param);
}
// 直接成本生成数据服务
export function straightpersistence(param){
  // return request('/microservice/cosservice/projectcost/straightpersistence/kk',param);
  return request('/microservice/cosservice/projectcost/allcost/straightpersistence',param);

}
// 间接成本生成数据服务
export function addindirect(param){
  // return request('/microservice/cosservice/projectcost/addindirect/kk',param);
  return request('/microservice/cosservice/projectcost/allcost/addindirect',param);
}
// 直接成本、间接成本查询最近月份的服务
export function searchDateIndirectStraight(param){
  return request('/microservice/cost/search_last_date_indirect_straight',param);
}
// 直接成本查询服务
export function straightSearch(param){
  // return request('/microservice/cosservice/projectcost/straightcostsel/kk',param);
  return request('/microservice/cosservice/projectcost/allcost/straightcostsel',param);

}
// 直接成本发布服务
export function straightRelease(param){
  //return request('/microservice/transupdate/cos/straightupd_bat',param);
  return request('/microservice/cos/erpmaintain/erp_direct_cost_publish',param);
}
// 直接成本撤销发布服务
export function straightCancelRelease(param){
  // return request('/microservice/cosservice/projectcost/straightcancelrelease',param);
  return request('/microservice/cosservice/projectcost/allcost/straightcancelreleasenew',param);

}
// 间接成本查询服务
export function indirectSearch(param){
  // return request('/microservice/cosservice/projectcost/selectindirect/kk',param);
  return request('/microservice/cosservice/projectcost/allcost/selectindirect',param);
}
// 间接成本发布服务
export function indirectRelease(param){
  return request('/microservice/transupdate/cos/indirectupd_bat',param);
}
// 间接成本撤销发布服务
export function indirectCancelRelease(param){
  // return request('/microservice/cosservice/projectcost/indirectcancelrelease',param);
  return request('/microservice/cosservice/projectcost/allcost/indirectcancelreleasenew',param);
}
//BP专项同步
export function createBP(param){
  return request('/microservice/cos/dwa_to_indirect_cost_bp_byou_new',param)
}
//BP专项发布
export function publishBP(param){
  return request('/microservice/cos/indirect_cost_bp_publish',param)
}
// BP专项撤销
export function cancelBP(param){
  return request('/microservice/cos/indirect_cost_bp_unpublish',param)
}
// -----------------------------------------------------TODO 部门分摊----------------------------------------------------------------------
// 查询人员变动情况
export function persionalStatic(param){
  return request('/microservice/cos/persionalstatic',param);
}
// 同步人员变动情况
export function personalSyn(param){
  return request('/microservice/cosservice/personalsyn/allcost/personalsyn',param);
}
// 获取用户查询参数：月统计，年统计
export function stateParamQuery(param) {
  return request('/microservice/cos/stateparam_query',param);
}
// 统计类型不同对应不同服务：类型为1为月统计
export function deptCostStaticNewPublish(param) {
  return request('/microservice/cos/depcost_static_new_publish',param);
}
// 统计类型不同对应不同服务：类型为2为年统计
export function deptCostMonthStaticNewPublish(param) {
  return request('/microservice/cos/depcost_month_static_new_publish',param);
}
// 生成部门分摊数据
export function generateDeptData(param) {
  return request('/microservice/cosservice/depallocation/allcost/depcost',param);
}
// 发布部门分摊数据
export function publicDeptData(param) {
  return request('/microservice/cos/depcost_publish',param);
}
// 撤销发布部门分摊数据
export function cancelPublicDeptData(param) {
  return request('/microservice/cos/depcost_unpublish',param);
}
// 查询人员变动最近月有数据
export function SearchLastDateForPersonalStatic(param){
  return request('/microservice/cost/deptcost/search_last_date_for_persionalstatic',param);
}
// 查询部门分摊最近月有数据
export function SearchLastDateForDeptCost(param){
  return request('/microservice/cost/deptcost/search_last_date_for_deptcost',param);
}
// -----------------------------------------------------TODO 项目分摊----------------------------------------------------------------------
// 查询工时管理数据
export function deptWtQuery(param) {
  return request('/microservice/cos/deptwtquery',param);
}
// 同步工时管理数据
export function sync(param) {
  return request('/microservice/cosservice/cosdeptworktime/allcost/cosdeptwtsync',param);
}
// 查询项目分摊数据
export function projectCostQuery(param) {
  return request('/microservice/cos/projcostnewquery',param);
}
// 生成项目分摊数据
export function generateProjectData(param) {
  return request('/microservice/cos/projcostsync',param);
}
// 发布项目分摊数据
export function publicProjectData(param) {
  return request('/microservice/cos/projcostpublish',param);
}
// 撤销项目分摊数据
export function cancelPublicProjectData(param) {
  return request('/microservice/cos/projcostunpublish',param);
}
// 查询工时管理最近月有数据
export function SearchLastDateForWorkTime(param){
  return request('/microservice/cost/projcost/search_last_date_for_worktime',param);
}
// 查询项目分摊最近月有数据
export function SearchLastDateForProjectCost(param){
  return request('/microservice/cost/projcost/search_last_date_for_projcost',param);
}
//编辑项目分摊
export function editProjectCost(param) {
  return request('/microservice/transupdate/cos/pjshanringupdate',param);
}
// -----------------------------------------------------TODO 项目全成本管理----------------------------------------------------------------------
// // 获取统计类型
// export function stateParamQuery(param) {
//   return request('/microservice/cos/stateparam_query',param);
// }
// OU/部门项目全成本预算完成情况 查询
export function ouFullCostQuery(param) {
  // return request('/microservice/cos/projbudgetgoingmultiprojquery',param);
  return request('/microservice/cos/projbudgetgoingmultiprojquerynew',param);
}
// ou/部门项目全成本预算完成情况 发布
export function ouFullCostPublish(param) {
  return request('/microservice/cos/projbudgetgoingpublish',param);
}
// ou/部门项目全成本预算完成情况 撤销
export function ouFullCostUnpublish(param) {
  return request('/microservice/cos/projbudgetgoingunpublish',param);
}
// ou/部门项目全成本预算完成情况 生成
export function ouFullCostCreate(param) {
  return request('/microservice/cos/proj_budget_going_generate',param);
}
//ou预算完成情况导入年化人数
export function timesheetPopulationYearGenerate(param) {
  return request('/microservice/cosservice/importAmortize/timesheetPopulationYearGenerate',param)
}
// ou/部门项目全成本预算完成情况 查询最新有数据的年月
export function ouFullCostLastDate(param) {
  return request('/microservice/cost/pbg/search_last_date_for_pbg',param);
}
// 项目全成本指标展示 查询
export function projCostKpiShowQuery(param) {
  return request('/microservice/cos/progresschartnew',param);
}
// 项目全成本指标展示 获取最近有数据的年月
export function projCostKpiShowLastDate(param) {
  return request('/microservice/cost/searchlastyearmonthnew',param);
}
// 查询项目分摊成本人均标准执行情况
export function projCostShareStatePubQuery(param){
  return request('/microservice/cos/indbudgetparaqry',param);
}
// 发布/撤销项目分摊成本人均标准执行情况
export function projCostShareStatePubPublic(param){
  return request('/microservice/transupdate/cos/indbudgetparaupdate',param);
}
// 根据OU和年份获取项目名称列表
export function getProjList(param) {
  return request('/microservice/cos/proj_budget_going_sel_os_proc',param);
}
// 根据OU和年份获取项目名称列表 2019-8-28
export function getProjListByBE(param) {
  return request('/microservice/cos/proj_budget_going_select_os_new',param);
}
// 编辑项目分摊成本人均标准执行情况
export function projCostShareStatePubEdit(param){
  return request('/microservice/transinsert/cos/indbudgetparainsert',param);
}
//查询项目全成本预算执行情况
export function getProjBudgetGoing(param) {
  // return request('/microservice/cosservice/projectcost/proj_budget_going_sel',param);
  return request('/microservice/cosservice/projectcost/allcost/proj_budget_going_sel',param);
}
//查询项目全成本预算执行情况_全年
export function queryProjectBudgetGoingAll(param) {
  return request('/microservice/cos/budget_going_display_proc',param);
}

// 查询项目明细表
export function searchProjCostDetail(param) {
  return request('/microservice/projcostdetail/search_proj_cost_detail',param);
}
export function ProjCostDetailLastDate(param) {
  return request('/microservice/projcostdetail/search_last_year_month_for_proj_cost_detail',param);
}
// 生成项目分摊成本人均标准执行情况
export function projCostShareStatePubGenerate(param){
  return request('/microservice/cos/indbudget_para_generate',param);
}

// 同步项目明细表
export function synProjCostDetail(param){
  return request('/microservice/projcostdetail/dw_to_research_proj_cost',param);
}
// 同步间接成本
export function synIndirectCost(param){
  return request('/microservice/cos/dwa_to_indirect_cost_byou',param);
}
// 同步直接成本
export function synStraightCost(param){
  return request('/microservice/cosservice/erpmaintain/directCostGenetateServlet',param);
}
// BP专项详情查询(预算执行情况全年)
export function cost_BP_detail_query(param){
  return request('/microservice/cos/cost_BP_detail_query',param);
}
// BP专项详情查询(预算完成情况汇总)
export function cost_BP_detail_query_comp(param){
  return request('/microservice/cos/cost_BP_detail_query_comp',param)
}
//-------------科技创新项目支出明细表start
// 查询所有的科研项目
export function getAllStcpProjDetail(param){
  return request('/microservice/cos/stcp_cost_detail_get_all_proj',param);
}
// 查询某个科技创新项目的支出明细
export function searchOneStcpProjCostDetail(param){
  return request('/microservice/cos/stcp_cost_detail_search_one_proj_cost',param);
}
// 所有科技创新项目的汇总
export function searchAllStcpProjCostDetail(param){
  return request('/microservice/cos/stcp_cost_detail_search_all_proj_cost',param);
}
//-------------科技创新项目支出明细表end

// 直接成本调账
export function updateFeeDirect(param){
  return request('/microservice/cos/erpmaintain/erp_direct_cost_update_fee_value',param);
}
// 间接成本调账
export function updateFeeIndirect(param){
  return request('/microservice/cos/erpmaintain/erp_indirect_cost_update_fee_value',param);
}
//..........................................ou预算完成情况，2019.7.18.。。。。。。。。
//发送邮件
export function sendMessage(param){
  return request('/microservice/cosservice/cosoubudget/sendEmailToOuBudgetGoingServlet',param);
}
