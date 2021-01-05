/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目考核接口定义
 */
import request from '../../utils/request';
// 项目列表查询
export function selectproject(params) {
    return request('/microservice/allprojexam/projexam/selectproject',params);
}

// 是否开启考核
export function isStart() {
    return request('/microservice/examine/examine_season_search_proc');
}

// 项目经理填写表头信息
export function getManagerTitle(params) {
    return request('/microservice/examine/examine_proj_search_by_mgr_id_proc',params);
}

// 项目经理填写详情信息
export function getManagerDetail(params) {
    return request('/microservice/allprojexam/projexam/kpidetailquery',params);
}

// 指标填写主页面—文件更新
export function updateKpiFile(params) {
    return request('/microservice/transupdate/examine/kpipjupdate',params);
}

// 指标填写主页面—文件删除
export function deleteKpiFile(params) {
    return request('/filemanage/filedelete',params);
}

// 部门经理提交
export function pmUpdateKpi(params) {
    return request('/microservice/allprojexam/projexam/pmfeedbacksubmitwf',params);
}

// 指标填写主页面—撤回
export function pmRetract(params) {
    return request(' /microservice/allprojexam/projexam/pmfeedbackwithdrawwf',params);
}

// 指标填写主页面—保存
export function pmUpdateScore(params) {
    return request('/microservice/transupdate/examine/pjstateupdate',params);
}

// 指标查询-TMO
export function getTMOlist(params) {
    return request('/microservice/allprojexam/projexam/selectproject',params);
}

// 指标查询-TMO 获取考核季度信息
export function getInfor(params) {
    return request('/microservice/examine/examine_season_search_proc',params);
}

// 指标查询-TMO 开启考核
export function startKpi(params) {
    return request('/microservice/examine/examine_season_open_proc',params);
}

// 年化人数(人年)
export function getProjectNumber(params) {
    return request('/microservice/examine/t_proj_other_search_proc',params);
}

// 工时数据
export function getProjectHour(params) {
    return request('/microservice//timesheet/timesheet_search_proj_checked_hours',params);
}

// 财务报表
export function getFinance(params) {
    return request('/microservice/cos/search_implementation_cost_for_examine',params);
}

// 全成本
export function getAllFeeSum(params) {
    return request('/microservice/cos/cos_all_fee_sum',params);
}

// 获取OU
export function getOU(params) {
    return request('/microservice/project/common_getoubyproj',params);
}

// TMO保存
export function isUpDateByTmo(params) {
    return request('/microservice/examine/t_proj_other2_search_proc',params);
}

// TMO保存
export function saveByTmo(params) {
    return request('/microservice/multitransopts/examine/kpi_score_other_opt',params);
}

// TMO提交
export function submintByTmo(params) {
    return request('/microservice/allprojexam/projexam/kpiconfirm',params);
}

// 部门查询
export function selectDept(params) {
    return request('/microservice/project/project_common_get_all_pu_department',params);
}

// 生成年度考核数据
export function buildYearData(params) {
    return request('/microservice/examine/projexam/generannualscore',params);
}

// 判断是否是STMO
export function isSTMO(params) {
    return request('/microservice/serviceauth/userifexistinrole',params);
}

// 考核指标审核历史
export function checkHisquery(params) {
    return request('/microservice/standardquery/examine/projexam/checkhisquery',params);
}

// 获取流程信息
export function getTaskParam(params) {
    return request('/microservice/standardquery/projexam/taskquery',params);
}

// 部门经理退回
export function taskReturnDM(params) {
    return request('/microservice/allprojexam/projexam/checkfeedbacknotpass',params);
}

// 部门经理提交
export function dmUpdateKpi(params) {
    return request('/microservice/allprojexam/projexam/dmcheckpassandevaluate',params);
}

// TMO提交
export function TMOUpdateKpi(params) {
    return request('/microservice/allprojexam/projexam/tmocheckpassandevaluate',params);
}

//接口人提交
export function ContactpdateKpi(params) {
  return request('/microservice/allprojexam/projexam/contactCheckPassAndEvaluate',params);
}

// 计算通用指标分数
export function getComScore(params) {
    return request('/microservice/allprojexam/projexam/commonkpiautocalculate',params);
}
// 计算自主研发运维指标
export function getOwnComScore(params) {
    return request('/microservice/allprojexam/projexam/commonSumKpiAutoCalculateService',params)
}
// 保存计算的结果
export function saveComScore(params) {
  return request('/microservice/examine/projexamdatasave',params);
}
