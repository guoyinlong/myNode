/**
 *  作者: 胡月
 *  创建日期: 2017-9-19
 *  邮箱：huy61@chinaunicom.cn
 *  文件说明：项目制所用到的服务
 */
import request,{getRequest, reqwest}from '../../utils/request';
import jsonrequest from '../../utils/jsonrequest';

// 关联项目（is_limit_key）查询
export function projuidCalculateRelation(param){
  return request('/microservice/project/project_proj_start_calculate_relation_by_projuid',param);
}

// export function projuidCalculateRelation(param){
//   return request('/microservice/newproject/productionunit/is_need_relation',param);
// }

//项目分类  项目类型 
export function classification(param){
  let url="/microservice/newproject/projtypekind/getallprojkindlist";
  return getRequest(url,param);
}

export function typesof(param){
  let url="/microservice/newproject/projtypekind/getallprojtypelist";
  return getRequest(url,param);
}

// export function typesof(param){
//   let url="microservice/newproject/projtypekind/getallprojtypelist";
//   return getRequest(url,param);
// }

//查询关联项目
export function projQuery(param) {
  return request('/microservice/project/project_proj_start_proj_relation_query', param);
}

//查询项目列表
export function projQueryPrimaryChild(param) {
  //return request('/microservice/project/projquery_new', param); //最原始的非主子项目
  return request('/microservice/project//projquery_primary_child', param);
}
//查询项目草稿
export function projQueryDraft(param) {
  return request('/microservice/project/project_projquery_draft', param);
}
//查询风险问题列表
export function riskRssueQuery(param) {
  return request('/microservice/project/riskissuequery', param);
}
//根据proj_id查询一个项目的风险列表
export function riskTransQuery(param) {
  return request('/microservice/standardquery/project/risktransquery', param);
}
/**
 * 作者：刘洪若
 * 项目监控》风险跟踪》导出
 * 日期：2020-4-27
 */
//根据主建单位导出风险的表信息
export function riskTransExport(param) {
  return request('/microservice/project/t_proj_risk_export',param);
}
//根据项目id查询一个项目的详细信息
export function projCodeQuery(param) {
  return request('/microservice/standardquery/project/projcodequery', param);
}
//插入一条风险
export function riskAdd(param) {
  return request('/microservice/transinsert/project/riskadd', param);
}
//风险更新
export function riskUpdate(param) {
  //return request('/microservice/transupdate/project/riskupdate', param);
    return request('/microservice/project/project_proj_risk_update', param);
}
//根据风险id查询单个风险
export function riskTrackSearch(param) {
  return request('/microservice/standardquery/project/risktracksearch', param);
}

/**
 * 作者：毕禹盟
 * 项目监控》天梯关联
 * 日期：2020-11-27
 */

//查询生产单元列表
export function tiantiQueryPrimaryChild(param) {
  //return request('/microservice/project/projquery_new', param); //最原始的非主子项目
  return jsonrequest('/microservice/newproject/productionunit/list_all', param);
}

//关联已存在天梯工程
export function tiantiExistence(param) {
  return request('/microservice/newproject/ladder/list/linked/tianti',param);
}

//查询已存在天梯工程
export function noTiantiRelation(param) {
  return request('/microservice/newproject/ladder/list/tianti',param);
}

//新建天梯工程
export function newTiantiRelation(param) {
  return jsonrequest('/microservice/newproject/ladder/link/new/tianti',param);
}

//取消关联天梯工程
export function cancelTiantiRelation(param) {
  return jsonrequest('/microservice/newproject/ladder/unlink/tianti',param);
}

//关联已存在天梯工程
export function relationExistRelation(param) {
  return jsonrequest('/microservice/newproject/ladder/link/exist/tianti',param);
}

//已关联天梯工程
export function tiantiRelation(param) {
  return request('/microservice/newproject/ladder/list/linked/tianti',param);
}

/**
 *Author: 仝飞
 *Date: 2017-11-6 11:23
 *Email: tongf5@chinaunicom.cn
 *功能：项目管理》项目监控》问题跟踪》2、根据【问题跟踪】id查询一条【问题跟踪】的详细信息
 */
export function issueTrackQuery(param) {
  return request('/microservice/standardquery/project/issuequery', param);
}
/**
 * 作者：刘洪若
 * 项目监控》问题跟踪》导出
 * 日期：2020-4-27
 */
//根据主建单位导出问题的表信息
export function issueTrackExport(param) {
  return request('/microservice/project/t_proj_issue_export',param);
}
/**
 *Author: 仝飞
 *Date: 2017-11-6 11:38
 *Email: tongf5@chinaunicom.cn
 *功能：项目管理》项目监控》问题跟踪》3、插入一条【问题跟踪】
 */
export function issueTrackAdd(param) {
  return request('/microservice/transinsert/project/issueadd', param);
}

/**
 *Author: 仝飞
 *Date: 2017-11-6 11:39
 *Email: tongf5@chinaunicom.cn
 *功能：项目管理》项目监控》问题跟踪》4、修改一条【问题跟踪】
 */
export function issueTrackUpdate(param) {
  //return request('/microservice/transupdate/project/issueupdate', param);
    return request('/microservice/project/project_proj_issue_update', param);

}

/**
 *Author: 仝飞
 *Date: 2017-11-8 10:23
 *Email: tongf5@chinaunicom.cn
 *功能：项目管理》项目监控》问题跟踪》5、根据风险id查询单个风险，和上面issueTrackQuery是同一个服务
 */
export function issueTrackSearch(param) {
  return request('/microservice/standardquery/project/issuequery', param);
}

/**
 *Author: 仝飞
 *Date: 2017-11-22 16:40
 *Email: tongf5@chinaunicom.cn
 *功能：项目管理》项目收尾》历史项目》TMO负责人权限
 */
export function projTMOQuery(param) {
  return request('/microservice/serviceauth/projtmoquery', param);
}

/**
 *Author: 仝飞
 *Date: 2017-11-25 14:38
 *Email: tongf5@chinaunicom.cn
 *功能：项目管理》项目收尾》历史项目》附件上传-旧服务
 */
export function projFileUpdate(param) {
  return request('/microservice/transopts/project/projfileupdate', param);
}

// 项目收尾：项目结项项目列表页查询
export function projDeliveryListQuery(param) {
  return request('/microservice/project/t_proj_query_primary_child', param);
}
// 项目收尾：查询modulId
export function pUserhasmodule(param) {
  return request('/microservice/serviceauth/p_userhasmodule', param);
}
// 项目收尾：根据modulId查按钮权限
export function usergetmoduleGrpsrv(param) {
  return request('/microservice/serviceauth/usergetmodule_grpsrv', param);
}

// 项目收尾：项目结项=》项目文档列表查询
export function projDeliveryFileQuery(param) {
  return request('/microservice/allproject/project/ProjectDeliverablesQueryServlet', param);
}
// 项目结项：项目列表页权限查询
export function projPermissionsQuery(param) {
  return request('/microservice/serviceauth/t_proj_Permissions_query', param);
}

// 项目收尾：查看文档状态
export function projDocumentPass(param) {
  return request('/microservice/project/t_proj_PM_view_document_pass', param);
}
// 项目结项：TOM审核项目文档是否通过
export function projClosingDocumentAudit(param) {
  return request('/microservice/project/t_proj_closing_document_audit', param);
}
// 项目结项：项目经理提交或者保存文档
export function ProjWebReturnBackAnalysis(param) {
  return request('/microservice/allproject/project/ProjectWebReturnBackAnalysisServlet', param);
}
// 项目结项：查询项目类型
export function projCommonGetProjtype(param) {
  return request('/microservice/project/project_common_get_all_projtype', param);
}



//查询主项目
export function getPrimaryProj(param) {
  return request('/microservice/project/common_get_primary_proj',param);
}

// //查询主项目
// export function getPrimaryProj(param) {
//   return request('/microservice/newproject/productionunit/list/project',param);
// }

//查询项目类型
export function getProjType(param) {
  return request('/microservice/standardquery/project/t_proj_type_showall',param);
}
//查询项目的基本信息
export function getProjInfoNew(param) {
  return request('/microservice/project/project_t_proj_search_info',param);
}
//从待办进入，项目经理点击修改按钮，查询项目的基本信息
export function getProjInfoNew4Task(param) {
  return request('/microservice/project/project_t_proj_check_base_info_form_search',param);
}
//查询uuid
export function getProjUuid(param) {
  return request('/microservice/project/project_t_proj_common_get_uuid',param);
}
//查询里程碑列表和总工作量
export function getMileStone(param) {
  return request('/microservice/project/project_t_proj_search_milestone_all',param);
}
//查询里程碑列表和总工作量
export function getMileStone4Task(param) {
  return request('/microservice/project/project_t_proj_check_milestone_form_search',param);
}
//项目启动新增保存和提交服务
export function projAddSaveOrSubmit(param) {
  return request('/microservice/allproject/project/ProjectInitiationProjectEstablishmentSaveOrSubmit',param);
}
//项目启动，删除草稿
export function delDraftModalOk(param){
  return request('/microservice/project/delete_proj_start_draft_new',param);
}
//全成本公用服务---start
//项目启动查询--部门查询
export function projStartBudgetDeptSearch(param) {
  return request('/microservice/project/budgetquerydept',param);
}
//全成本公用服务---end

//项目启动TMO修改项目基本信息----------------start
//项目基本信息查询，不可更改
export function getprojectInfo(param) {
  return request('/microservice/project/project_t_proj_search_info',param);
}
//项目基本信息底下的预估投资替代额列表查询，不可更改
export function getReplaceMoney(param) {
  return request('/microservice/project/proj_get_replacemoney',param);
}
export function projectInitiationUpdateProjInfo(param) {
  return request('/microservice/project/project_proj_start_info_query_update_proc',param);
}

//修改基本信息时，提交基本修改数据
export function projApproveEditProjInfoSubmit(param) {
  return request('/microservice/allproject/project/ProjectInitiationUpdateProjInfo',param);
}
//项目启动TMO修改项目基本信息----------------end

//里程碑查询不可更改
export function getMileInfo(param) {
  return request('/microservice/project/project_t_proj_search_milestone_all',param);
}
//项目判断是不是项目经理角色
export function getPMRole(param) {
  // return request('/microservice/project/common_if_ispm',param);
  return request('/microservice/serviceauth/project_common_virtual_pm',param);
}

//项目基本信息页面是否显示新建项目按钮
export function getNewAddProjArth(param) {
    return request('/microservice/allproject/project/ProjectInitiationNewProjectEstimate',param);
}

//项目启动TMO修改项目里程碑（包含交付物）----------------start
//项目对已立项的项目查询静态的里程碑信息，里面含有交付物
export function queryProjMilestoneInfo(param) {
  return request('/microservice/project/project_t_proj_search_milestone_all',param);
}
//查询里程碑交付物类别
export function queryMilestoneDeliverableCategory(param) {
  return request('/microservice/standardquery/project/get_deliverable_name',param);
}

//修改里程碑，提交
export function projApproveEditMilestoneSubmit(param) {
  return request('/microservice/allproject/project/ProjectInitiationUpdateProjMilestone',param);
}

//项目启动TMO修改项目里程碑（包含交付物）----------------end

//项目启动 一 全成本（新）----------- start
//项目启动未立项全成本 查询PMS列表
export function projStartPmsDataQuery(param) {
    return request('/microservice/project/project_proj_start_add_cos_query_tab',param);
}

//项目启动未立项全成本 查询配合部门和所有部门
export function projStartCoorDeptQuery(param) {
  return request('/microservice/project/project_t_proj_search_cos_dept',param);
}

/*//项目启动未立项全成本 查询配合部门和所有部门-新-有PMS
export function projStartCoorDeptQueryNew(param) {
    return request('/microservice/project/project_t_proj_add_search_cos_dept_query',param);
}*/

//项目启动未立项全成本 查询部门预算
export function projStartBudgetQuery(param){
  return request('/microservice/project/project_t_proj_search_cos_budget',param);
}

/*//项目启动未立项全成本 查询部门预算-新-有PMS
export function projStartBudgetQueryNew(param){
    return request('/microservice/project/project_t_proj_add_search_cos_budget_query',param);
}*/

//项目启动已立项全成本  查询PMS编码列表
export function projApproveFullcostPmsListQuery(param) {
    return request('/microservice/project/project_proj_start_cos_tab_query',param);
}

//项目启动已立项全成本 查询配合部门-旧
export function projApproveCoorDeptQuery(param) {
  return request('/microservice/project/projquerydept',param);
}

//项目启动已立项全成本 查询配合部门-新
export function projApproveCoorDeptQueryNew(param) {
    return request('/microservice/project/project_proj_start_cos_dept_query',param);
}

//项目启动已立项全成本 查询所有部门
export function projApproveAllDeptQuery(param) {
  return request('/microservice/project/budgetquerydept',param);
}

//项目启动已立项全成本 查询部门预算
export function projApproveBudgetQuery(param){
  //return request('/microservice/standardquery/project/budgetquery',param);  //该服务的费用没有排序
  return request('/microservice/project/project_proj_start_cos_budget_query',param);
}

//项目启动已立项全成本 TMO 修改时，选择审核人
export function getVerifierData(param) {
  return request('/microservice/allproject/project/ProjectInitiationUpdateProjCosSubmit',param);
}

//项目启动已立项全成本 TMO 修改时 查询所有部门
export function projApproveEditFullCostAllDeptQuery(param){
  return request('/microservice/project/project_proj_start_cos_budget_query_all_dept',param);
}

//项目启动已立项全成本 TMO 修改时 提交配合部门联系人修改数据
export function projApproveEditFullCostAllSubmitDept(param){
  return request('/microservice/allproject/project/ProjectInitiationUpdateProjCos',param);
}

//项目启动已立项全成本 TMO 修改时 提交预算数据发生改变
export function projApproveFullCostSubmitBudget(param){
  return request('/microservice/allproject/project/ProjectInitiationUpdateProjCosConfirm',param);
}

//项目启动 一 全成本（新）----------- end

//项目启动附件-------start
//项目启动新增以及已立项项目时，查询已上传的附件列表
export function searchNewAddAttachment(param) {
  return request('/microservice/project/project_t_proj_search_attachment',param);
}
//项目启动新增时，查询已上传的附件列表
export function searchNewAddAttachment4Task(param) {
  return request('/microservice/project/project_t_proj_check_attachment_form_search',param);
}
// 待办是否全成本tab页显示
export function taskIsShowAllTab(param){
  return request('/microservice/project/project_t_proj_checked_finance_dept',param)
}
// 项目启动已立项项目，TMO修改附件，提交修改数据
export function projectInitiationUpdateProjAttachment(param){
  return request('/microservice/allproject/project/ProjectInitiationUpdateProjAttachment',param)
}
//项目启动附件-------end

//审核日志
export function searchCheckLogList(param){
  return request('/microservice/project/project_t_proj_check_log_search',param)
}

//项目启动  历史记录 ---------------start
//模块中点击全部时的表格查询
export function searchAllModuleTableData(param){
  return request('/microservice/allproject/projectAuditlogs/projectallauditlog',param)
}

//模块中点击基本信息时的修改项列表查询
export function searchBasicModuleChangeItemList(param){
  return request('/microservice/auditmsg/proj_audit_info_byproj_change_tbfield',param)
}

//模块中点击基本信息时的表格查询
export function searchBasicModuleTableData(param){
  return request('/microservice/auditmsg/proj_audit_info_byproj',param)
}

//模块中点击里程碑时的修改项列表查询
export function searchMileModuleChangeItemList(param){
  return request('/microservice/auditmsg/proj_audit_milestone_byproj_change_field',param)
}

//模块中点击里程碑时的表格查询
export function searchMileModuleTableData(param){
  return request('/microservice/auditmsg/proj_audit_milestone_byproj',param)
}

//模块中点击‘全成本/配合部门’时的修改项列表查询
export function searchCoorpModuleChangeItemList(param){
  return request('/microservice/auditmsg/proj_audit_dept_byproj_change_field',param)
}

//模块中点击‘全成本/配合部门’时的表格查询
export function searchCoorpModuleTableData(param){
  return request('/microservice/auditmsg/proj_audit_dept_byproj',param)
}

//模块中点击‘全成本/预算’时的修改部门列表查询
export function searchBudgetModuleDeptList(param){
  return request('/microservice/auditmsg/proj_audit_budget_byproj_change_deptname',param)
}

//模块中点击‘全成本/预算’时的修改项列表查询
export function searchBudgetModuleChangeItemList(param){
  return request('/microservice/auditmsg/proj_audit_budget_byproj_change_feename',param)
}

//模块中点击‘全成本/预算’时的表格查询
export function searchBudgetModuleTableData(param){
  return request('/microservice/auditmsg/proj_audit_budget_byproj',param)
}

//模块中点击‘附件’时的修改项列表查询
export function searchAttachModuleChangeItemList(param){
  return request('/microservice/auditmsg/proj_audit_attachment_byproj_change_field',param)
}

//模块中点击‘附件’时的表格查询
export function searchAttachModuleTableData(param){
  return request('/microservice/auditmsg/proj_audit_attachment_byproj',param)
}

//项目启动  历史记录 ---------------end


//项目执行---------------start
//报告管理（月报）列表
export async function projQueryReportList(param) {
  //return request('/microservice/project/reportprojquery',param);
  return request('/microservice/project/weekmonthquery_new',param)
}

//获取服务器当前时间
export async function getServerCurrentTime(param) {
  return request('/microservice/project/return_time_proc',param)
}

//周报情况查询
export async function queryWeekReportState(param) {
  //return request('/microservice/standardquery/project/weeklyreportfilequery',param);
  return request('/microservice/project/projet_proj_execute_report_week_report_query',param);

}

//上传周报
export async function addWeekReport(param) {
  return request('/microservice/transinsert/project/weeklyreportfileadd',param);
}

//更新周报
export async function updateWeekReport(param) {
  return request('/microservice/transupdate/project/weeklyreportfileupdate',param);
}

//删除旧周报
export async function deleteOldWeekReport(param) {
  return request('/filemanage/filedelete',param);
}

//查询工作计划和偏差分析，同时也是判断是否有周报的服务
export async function queryWorkPlanAndDeviation(param) {
  return request('/microservice/standardquery/project/mrquery',param);
}

//挣值数据统计
export async function earnDataStatistic(param) {
  return request('/microservice/standardquery/project/monthevdataquery',param);
}

//里程碑历史查询
export async function queryMileStoneHistory(param) {
  return request('/microservice/standardquery/project/monthly_mile_history_query',param);
}

//里程碑变更状态查询
export async function queryMileStoneState(param) {
  //return request('/microservice/project/proj_gettag',param);   //旧系统使用
  return request('/microservice/project/project_proj_execute_report_validate_proj_change_tag',param);   //新系统使用
}

//新增月报时的里程碑数据查询
export async function queryAddReportMileStone(param) {
  return request('/microservice/project/monthly_mile_query_or_write',param);
}

//所有pv值查询
export async function allPvDataQuery(param){
  return request('/microservice/standardquery/project/monthevdataquery',param);
}

//直接成本管理数据查询-查看月报时
export async function queryDirectCostManageView(param){
  return request('/microservice/standardquery/project/monthstraightcostquery',param);
}

//直接成本管理数据查询-新增月报时
export async function queryDirectCostManageNewAdd(param){
  return request('/microservice/cos/search_straight_or_proj_cost',param);
}

//查询本期人员数量
export async function queryMemberNum(param){
  return request('/microservice/standardquery/project/memberquery',param);
}

//月报提交或者保存服务
export async function reportSaveOrSubmit(param){
  //return request('/microservice/multitransopts/project/monthlyreportalldataadd',param);  //旧版的保存和提交
  return request('/microservice/allproject/project/ProjectExecuteMonthlyReportSaveOrSubmit',param); //新版
}

//项目执行---------------end


//项目变更---------------start
//项目变更列表
export async function queryProjChgList(param) {
  return request('/microservice/project/proj_change_pm_proj_list',param);
}
//项目变更——标题查询
export async function getProjChangeTitle(param) {
  return request('/microservice/project/project_proj_change_query_title',param);
}
//项目变更——基本信息查询
export async function getProjChangeInfo(param) {
  return request('/microservice/project/project_proj_change_query_info',param);
}
//项目变更——保存或者提交服务
export async function projChangeSaveOrSubmit(param) {
  return request('/microservice/allproject/project/ProjectMonitorProjectChangeSaveOrSubmit',param);
}

//项目变更——删除草稿
export async function deleteChangeApplyDraft(param) {
    return request('/microservice/project/project_proj_change_draft_delete',param);
}

//项目变更里程碑查询
export async function queryProjChgMileStone(param) {
  return request('/microservice/project/project_proj_change_query_milestone',param);
}

//项目变更全成本配合部门查询
export async function queryCoorpDept(param) {
  return request('/microservice/project/project_proj_change_query_cos_dept',param);
}

//项目变更全成本所有部门查询
export async function queryAllDept(param) {
  return request('/microservice/project/project_proj_change_query_cos_all_dept',param);
}

//项目变更全成本预算查询
export async function querydeptBudgetData(param) {
  return request('/microservice/project/project_proj_change_query_cos_budget',param);
}

//该项目是否已产生成本
export async function queryCostData(param) {
  return request('/microservice/cos/cos_check_isdeldept',param);
}

//项目中是否尚有启用成员
export async function queryMemberData(param) {
  return request('/microservice/project/depthasprojteam',param);
}

//项目变更费用类型查询
export async function queryCostList(param) {
  return request('/microservice/standardquery/project/feequery',param);
}

//项目变更审核人查看基本信息服务
export async function projChangeCheckInfo(param) {
  return request('/microservice/project/project_proj_change_check_query_info',param);
}

//项目变更审核人查看无变化的基本信息服务
export async function notChangeBasicInfo(param) {
  return request('/microservice/project/project_proj_change_check_query_info',param);
}

//项目变更审核人查看审批环节
export async function projChangeCheckLog(param) {
  return request('/microservice/project/project_t_proj_check_log_search',param);
}

//项目变更审核人查看标题服务
export async function projChangeCheckTitle(param) {
  return request('/microservice/project/project_proj_change_check_query_title',param);
}
// 项目变更审核人查看待办是否被审核
export async function projChangeIsCheck(param){
  return request('/microservice/publicnotice/t_task_if_ischecked',param)
}
//项目变更审核人查看里程碑对比
export async function queryCheckMilestone(param) {
  return request('/microservice/project/project_proj_change_check_query_milestone',param);
}

//项目变更审核人查看全成本配合部门对比
export async function queryCheckFullCostDept(param) {
  return request('/microservice/project/project_proj_change_check_query_cos_dept',param);
}

//项目变更审核人查看全成本所有部门对比
export async function queryCheckFullCostAllDept(param) {
  return request('/microservice/project/project_proj_change_check_query_cos_all_dept',param);
}

//项目变更审核人查看全成本预算对比
export async function queryCheckFullCostBudget(param) {
  return request('/microservice/project/project_proj_change_check_query_cos_budget',param);
}

//项目变更审核人审核通过服务
export async function projChangeApproval(param) {
  return request('/microservice/allproject/project/ProjectMonitorProjectChangeApproval',param);
}

//项目变更审核人退回服务
export async function projChangeReturn(param) {
  return request('/microservice/allproject/project/ProjectMonitorProjectChangeReturn',param);
}

//项目变更申请人终止流程
export async function projTerminate(param) {
  return request('/microservice/allproject/project/ProjectMonitorProjectChangeTerminate',param);
}

// 项目变更全成本-子tab  tabListUrlS
export async function tabListUrlS(param) {
  return request('/microservice/project/project_proj_change_query_cos_tab',param);
}

// 项目变更审核退回的tab列表 messageTablistUrlS
export async function messageTablistUrlS(param) {
  return request('/microservice/project/project_proj_change_check_query_cos_tab',param);
}

// 获取配合部门联系人
export async function getDeptPersonListS(param) {
  return request('/microservice/project/project_proj_change_query_cos_coopdept',param);
}

// 项目变更审核人的全成本子tab
export async function queryCheckFullCostTab(param) {
  return request('/microservice/project/project_proj_change_check_query_cos_tab',param);
}

//项目变更---------------end

//TMO修改已立项，审核阶段 全成本  ------------- start
//TMO修改已立项 全成本 标题查询
export async function queryTmoModifyFullcostTitle(param) {
  return request('/microservice/project/project_proj_start_check_query_title',param);
}

//TMO修改已立项 全成本 配合部门查询
export async function queryTmoModifyFullcostCoorDept(param) {
  return request('/microservice/project/project_proj_start_check_query_cos_dept',param);
}

//TMO修改已立项 全成本 所有部门查询
export async function queryTmoModifyFullcostAllDept(param) {
  return request('/microservice/project/project_proj_start_check_query_cos_all_dept',param);
}

//TMO修改已立项 全成本 预算查询
export async function queryTmoModifyFullcostBudget(param) {
  return request('/microservice/project/project_proj_start_check_query_cos_budget',param);
}

//TMO修改已立项 全成本 审批历史查询
export async function queryTmoModifyFullcostCheck(param) {
  return request('/microservice/project/project_t_proj_check_log_search',param);
}

//审核人审核TMO修改全成本，退回功能
export async function verifierReturnFullcost(param) {
  return request('/microservice/allproject/project/ProjectInitiationUpdateProjCosReturn',param);
}

//审核人审核TMO修改全成本，通过功能
export async function verifierApproveFullcost(param) {
  return request('/microservice/allproject/project/ProjectInitiationUpdateProjCosApproval',param);
}

//申请人，待办处理退回时，终止流程
export async function applierTerminate(param) {
  return request('/microservice/allproject/project/ProjectInitiationUpdateProjCosTerminate',param);
}

//申请人，待办处理退回时，重新提交
export async function applierReSubmit(param) {
  return request('/microservice/allproject/project/ProjectInitiationUpdateProjCosTaskConfirm',param);
}

//申请人，已办处理撤回
export async function applierRetreatFullcost(param) {
  return request('/microservice/allproject/project/ProjectInitiationUpdateProjCosWithdraw',param);
}

//TMO修改已立项 全成本  ------------- end

//交付物管理---------start

//申请人根据登录用户id获取立项的项目
export async function pmGetAllProject(param) {
  return request('/microservice/project/project_proj_del_pm_get_proj',param);
}
//获取里程碑绑定的交付物类别(申请人第一次申请以及退回之后的操作都用该服务，分为交付物类别可选择和不可选择两种)
export async function getMilesStoneDelType(param) {
  return request('/microservice/project/project_proj_del_get_milestone_deltype_bymileuid',param);
}
//里程碑进行绑定交付物类别(申请人第一次申请以及退回之后的操作都用该服务)
export async function mileBindDelType(param) {
  return request('/microservice/project/project_proj_del_mile_bind_deltype',param);
}
//某一里程碑解绑交付物类别以及删除该类别下的所有文件(申请人第一次申请以及退回之后的操作都用该服务)
export async function mileUnBindDelType(param) {
  return request('/microservice/project/project_proj_del_mile_unbind_deltype',param);
}
//查询一个项目所包含的里程碑、交付物类别、交付物所有文件
export async function getAllMilesFiles(param) {
  return request('/microservice/project/project_proj_del_query_all_mile_file',param);
}
//上传交付物文件(申请人第一次申请以及退回之后的操作都用该服务)
export async function deliverableFileUpload(param) {
  return request('/microservice/allproject/project/ProjectMonitorDelMgtFilesUpload',param);
}
//删除单个交付物文件(申请人第一次申请以及退回之后的操作都用该服务)
export async function deliverableFileDelete(param) {
  return request('/microservice/project/project_proj_del_mile_del_file_delete_single',param);
}
//交付物文件别名修改，不能重复(申请人第一次申请以及退回之后的操作都用该服务)
export async function deliverableFileNameUpdate(param) {
  return request('/microservice/project/project_proj_del_mile_del_file_update_single',param);
}
//项目经理提交交付物管理(申请人第一次申请以及退回之后的操作都用该服务)
export async function deliverableManageSubmit(param) {
  return request('/microservice/allproject/project/ProjectMonitorDelMgtSubmit',param);
}
//待办中交付物管理的标题查询（审核人和申请人）
export async function deliverableCheckTitle(param) {
  return request('/microservice/project/project_proj_del_check_query_title',param);
}
//待办中交付物管理的所有文件查询（审核人和申请人）
export async function deliverableCheckAllFile(param) {
  return request('/microservice/project/project_proj_del_check_query_all_mile_file',param);
}
//待办中交付物管理的审核环节查询（审核人和申请人）
export async function deliverableCheckLogSearch(param) {
  return request('/microservice/project/project_t_proj_check_log_search',param);
}
//进入待办中的交付物变更，审核人退回交付物变更
export async function deliverableManageReturn(param) {
  return request('/microservice/allproject/project/ProjectMonitorDelMgtReturn',param);
}

//进入待办中的交付物变更，审核人通过交付物变更
export async function deliverableManageApprove(param) {
  return request('/microservice/allproject/project/ProjectMonitorDelMgtApprove',param);
}

//进入待办中的交付物变更，申请人终止流程
export async function deliverableTerminate(param) {
  //return request('/microservice/allproject/project/ProjectMonitorProjectChangeTerminate',param);
    return request('/microservice/allproject/project/ProjectMonitorDelMgtTerminate',param);
}

//交付物管理-----------end

//项目人员查询-------start
//项目人员总数汇总
export function projMembersCountQueryService(){
  return request('/microservice/project/projmemberscountquery')
}
// 组织人数汇总
export function ouMembersCountQueryService(param){
  let url="/microservice/project/oumemberscountquery?arg_tenantid="+param["arg_tenantid"];
  return getRequest(url,param);
}
//查询人员的信息
export function projMembersInfoQueryService(params) {
  let url = "/microservice/project/projmembersinfoquery";
  if (params) {
    for (let key in params) {

      if (params[key] != "") {
        if (url.search(/\?/) === -1) {//拼接url
          url += '?' + key + "=" + params[key];
        } else {
          url += "&" + key + "=" + params[key];
        }
      }
    }
    return getRequest(url, params);
    //return request('/microservice/project/projmembersinfoquery',param)
  }
  return "";
}
// 查询项目
export function deptProjQueryService(param){
  return request('/microservice/project/deptprojquery',param)
}
// 组织部门查询
export function ouDeptQueryService(param){
  return request('/microservice/project/oudeptquery',param)
}
//获取组织单元列表
export function getOuList(param){
  return request('/microservice/serviceauth/ps_get_ou',param);
}

// 部门项目人员汇总
export function getAllProjPersonalStatistics(param){
    return request('/microservice/project/t_proj_team_search_pu_dept_staff_number',param);
}

//项目人员查询结束----------end

//项目计划---------------start

// 获取项目计划单个项目的附件信息
export function getProjPlanOneDocService(param){
  let url="/microservice/standardquery/project/docuSearch";
  return request(url,param);
}
//获取人员Pro信息
export function projPlanService2(param){
  let url="/microservice/project/empinprojcount?arg_staff_id="+param["arg_staff_id"];
  return getRequest(url,param);
}
// 获取人员Tmo信息
export function projManagerSearchService(param){
  let url="/microservice/serviceauth/projtmoquery?arg_vr_name="+param["arg_vr_name"];
  return getRequest(url,param);
}
//判断isou
export function searchOubumgrId(param){
  return request("/microservice/standardquery/project/searchOubumgrId",param);
}
 //查找mgr_id对应的proj_id,判断项目经理的项目id是否和此projId一致
export function projSearchbymrgId(param){
  return request("/microservice/standardquery/project/projSearchbymrgId",param);
}
 //删除某个文档
export function docuDelete(param){
  return request("/microservice/transopts/project/docuDelete",param);
}
 //上传文档
export function projDocSubmitService(param){
  return request("/microservice/project/docuInsert",param);
}
//权限
export function projIsPromise(param){
  let url="/microservice/project/project_proj_prepare_plan_is_upload?arg_staff_id="+param["arg_staff_id"]+"&arg_proj_id="+param["arg_proj_id"];
  return getRequest(url,param);
}

//项目计划-------------------end
//三部四中心
export function departmentQuery(param) {
  return request('/microservice/project/project_common_get_all_pu_department', param);
}

// 查询差旅费预算信息服务
export function travelBudgetQuery(param) {
  return request('/microservice/project/proj_change_travel_query_budget', param);
}

// 差旅预算变更信息展示
export function travelBudgetChangeInfo(param) {
  return request('/microservice/project/proj_change_travel_check_query_budget', param);
}

// 差旅预算保存或提交
export function travelBudgetSaveOrSubmit(param) {
  return request('/microservice/allproject/project/ProjectMonitorTravelChangeSaveOrSubmit', param);
}

// 差旅预算审核通过
export function travelBudgetApproval(param) {
  return request('/microservice/allproject/project/ProjectMonitorTravelChangeApproval', param);
}

// 差旅预算退回修改
export function travelBudgetReturn(param) {
  return request('/microservice/allproject/project/ProjectMonitorTravelChangeReturn', param);
}

// 差旅预算终止流程
export function travelBudgetTerminate(param) {
  return request('/microservice/allproject/project/ProjectMonitorTravelChangeTerminate', param);
}

// 差旅预算部门限制
export function travelBudgetDeptRestrict(param) {
  return request('/microservice/project/proj_change_travel_restrict_query', param);
}



//项目结项-查询项目详情
export function queryProjectDeliver(param) {
  return request('/microservice/completedproject/deliverable/projectdelivers', param);
}
//项目结项-结项判断按钮权限
export function queryButtonPermission(param) {
  return request('/microservice/completedproject/deliverable/roleandbuttonpermission', param);
}
//项目结项-显示所有项目类项目列表
export function queryProjectList(param) {
  return request('/microservice/completedproject/deliverable/projecttypeprojects', param);
}
//项目结项-项目经理点击提交交付物清单按钮
export function queryProjectSubmit(param) {
  return request('/microservice/completedproject/deliverable/projectsubmit', param);
}
//项目结项-添加同时结项项目
export function addTogetherProject(param) {
  return request('/microservice/completedproject/deliverable/addtogethercompletedproject', param);
}
//项目结项-删除同时结项项目
export function deleteTogetherProject(param) {
  return request('/microservice/completedproject/deliverable/deltogethercompletedproject', param);
}
//项目结项-TMO退回
export function tmoReturn(param) {
  return request('/microservice/completedproject/deliverable/tmorefuseflow', param);
}
//项目结项-TMO通过流程
export function tmoPass(param) {
  return request('/microservice/completedproject/deliverable/tmopassflow', param);
}
//项目结项-交付物清单页面点击确认
export function submitConfirm(param) {
  return request('/microservice/completedproject/deliverable/projectconfirmsubmit', param);
}
//项目结项-上传文件后调用接口保存文件
export function uploadProjectFile(param) {
  return reqwest('/microservice/completedproject/deliverable/projectsavefile', param);
}
//项目结项-项目结项项目列表页查询(new)
export function queryDeliverListNew(param) {
  return request('/microservice/completedproject/deliverable/projects', param);
}
//项目结项-删除文件
export function deleteProjectFile(param) {
  return request('/microservice/completedproject/deliverable/projectdelfile', param);
}
/**
 *  作者: 彭东洋
 *  创建日期: 2020-4-16
 *  邮箱：pengdy@itnova.com.cn
 *  文件说明：全成本标准
 */
//查询oubudget数据
export function autocalcu_cost_budget_sort_oubudget_query(param) {
  return request('/microservice/project/autocalcu_cost_budget_sort_oubudget_query', param);
} 

