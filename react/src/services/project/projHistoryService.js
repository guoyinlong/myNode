/**
 *  作者: 夏天
 *  日期: 2018-09-18
 *  邮箱：1348744578@qq.com
 *  文件说明：项目历史-详细
 */
import request from '../../utils/request';

// 项目基本信息查询，不可更改
export function getprojectInfo(param) {
    return request('/microservice/project/project_t_proj_search_info', param);
}
// 项目对已立项的项目查询静态的里程碑信息，里面含有交付物
export function queryProjMilestoneInfo(param) {
    return request('/microservice/project/project_t_proj_search_milestone_all', param);
}

// 项目启动已立项全成本 查询配合部门
export function projApproveCoorDeptQuery(param) {
    return request('/microservice/project/projquerydept', param);
}
//项目启动已立项全成本 查询配合部门-新
export function projApproveCoorDeptQueryNew(param) {
    return request('/microservice/project/project_proj_start_cos_dept_query',param);
}
// 项目启动已立项全成本 查询所有部门
export function projApproveAllDeptQuery(param) {
    return request('/microservice/project/budgetquerydept', param);
}
//项目启动已立项全成本 TMO 修改时 查询所有部门
export function projApproveEditFullCostAllDeptQuery(param){
    return request('/microservice/project/project_proj_start_cos_budget_query_all_dept',param);
  }
// 项目启动已立项全成本 查询部门预算
export function projApproveBudgetQuery(param) {
    // return request('/microservice/standardquery/project/budgetquery',param);  //该服务的费用没有排序
    return request('/microservice/project/project_proj_start_cos_budget_query', param);
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
// 项目启动新增以及已立项项目时，查询已上传的附件列表
export function searchNewAddAttachment(param) {
    return request('/microservice/project/project_t_proj_search_attachment', param);
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

// 团队查询
export function teamQuery(param) {
    return request('/microservice/project/project_proj_history_team_query', param);
}
// 项目计划
export function projPlanQuery(param) {
    return request('/microservice/project/project_proj_history_plan_query', param);
}
// 项目计划--文档类型查询
export function projPlanDocQuery(param) {
    return request('/microservice/project/project_proj_history_plan_doc_type_query', param);
}
// ------------------周报月报------
// 获取服务器当前时间
export async function getServerCurrentTime(param) {
    return request('/microservice/project/return_time_proc', param)
}

// 周报情况查询
export async function queryWeekReportState(param) {
    return request('/microservice/standardquery/project/weeklyreportfilequery', param);
}
// 查询工作计划和偏差分析，同时也是判断是否有周报的服务
export async function queryWorkPlanAndDeviation(param) {
    return request('/microservice/standardquery/project/mrquery', param);
}
// 挣值数据统计
export async function earnDataStatistic(param) {
    return request('/microservice/standardquery/project/monthevdataquery', param);
}
// 查询本期人员数量
export async function queryMemberNum(param) {
    return request('/microservice/standardquery/project/memberquery', param);
}
// 里程碑历史查询
export async function queryMileStoneHistory(param) {
    return request('/microservice/standardquery/project/monthly_mile_history_query', param);
}
// 新增月报时的里程碑数据查询
export async function queryAddReportMileStone(param) {
    return request('/microservice/project/monthly_mile_query_or_write', param);
}
// 所有pv值查询
export async function allPvDataQuery(param) {
    return request('/microservice/standardquery/project/monthevdataquery', param);
}
// 直接成本管理数据查询-查看月报时
export async function queryDirectCostManageView(param) {
    return request('/microservice/standardquery/project/monthstraightcostquery', param);
}

// 风险跟踪
export async function queryRiskTrack(param) {
    return request('/microservice/project/project_proj_history_risk_query', param);
}
// 风险跟踪-详情
export async function riskDetailQuery(param) {
    return request('/microservice/project/project_proj_history_risk_detail_query', param);
}

// 问题跟踪
export async function queryProblemTrack(param) {
    return request('/microservice/project/project_proj_history_issue_query', param);
}
// 问题跟踪-详情
export async function queryProblemDetail(param) {
    return request('/microservice/project/project_proj_history_issue_detail_query', param);
}

// 项目结项：项目列表页权限查询
export function projPermissionsQuery(param) {
    return request('/microservice/serviceauth/t_proj_Permissions_query', param);
}
// 项目结项项目列表页查询
export function projDeliveryListQuery(param) {
    return request('/microservice/project/project_proj_history_junctions_query', param);
}
