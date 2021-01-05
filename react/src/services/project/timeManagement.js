/**
 *  作者: 张楠华
 *  创建日期: 2017-11-21
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：工时管理服务
 */
import request from '../../utils/request';
//.................................................审核......................................
//工时审核查询 新服务
export function timeManageReview(param) {
  return request('/microservice/timesheet/timesheet_check_records_query', param);
}
//工时审核通过 新服务
export function timeManagePass(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetPmWeekCheck', param);
}
//项目经理工时审核通过 新服务
export function timeManagePassPM(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetPmMakeupCheck', param);
}
//工时审核退回 新服务
export function timeManageReject(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetPmWeekCheckRecall', param);
}
//工时审核退回 新服务
export function timeManageRejectPM(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetPmMakeupCheckRecall', param);
}
//工时补录审核查询（pm） 新服务
export function timeManageMakeUp(param) {
  return request('/microservice//timesheet/timesheet_check_makeup_records_query', param);
}
//工时补录审核查询（部门经理） 新服务
export function timeManageMakeUpDeptMgr(param) {
  return request('/microservice/timesheet/timesheet_check_makeup_records_deptmgr_query', param);
}
//.................................................项目工时查询......................................
//查ou 通用服务不用改
export function queryOU(param) {
  return request('/microservice/serviceauth/ps_get_ou', param);
}
//查项目名称  新服务
export function queryProj(param) {
  return request('/microservice/timesheet/timesheet_search_proj_ouhave_query', param);
}
//查项工时  新服务
export function queryProjTimeSheet(param) {
  return request('/microservice/timesheet/timesheet_search_proj_hours', param);
}
//工时明细查询 新服务
export function queryProjTimeSheetDetail(param) {
  return request('/microservice/timesheet/timesheet_search_proj_hours_details', param);
}
//.................................................老人员工时查询服务......................................
//员工参与项目查询
export function queryParticipatedProj(param) {
  return request('/microservice/timesheet/timesheet_search_participated_proj', param);
}
//人员项目工时查询
export function queryStaffProjHours(param) {
  return request('/microservice/timesheet/timesheet_search_staff_proj_hours', param);
}
//人员项目工时详情查询
export function queryStaffProjHoursDetial(param) {
  return request('/microservice/timesheet/timesheet_search_month_hours_details', param);
}
//查询部门经理所在的部门内的项目，按照项目的归口部门
export function queryDMProj(param) {
  return request('/microservice/timesheet/timesheet_search_dm_proj', param);
}
//查询部门经理所在的部门内的项目
export function queryDMOUProj(param) {
  return request('/microservice/timesheet/timesheet_search_dm_proj_ou', param);
}
//查询部门经理所在的部门内的项目
export function queryDMProjHours(param) {
  return request('/microservice/timesheet/timesheet_search_dm_proj_hours', param);
}
//人员项目累计工时详情查询
export function queryStaffProjHoursDetial1(param) {
  return request('/microservice/timesheet/timesheet_search_total_hours_details', param);
}
//.................................................活动类型维护......................................
//查询活动类型
export function searchActivity(param) {
  return request('/microservice/timesheet/timesheet_search_t_activity', param);
}
//查询活动类型
export function addActivity(param) {
  return request('/microservice/timesheet/timesheet_search_t_avtivity_add', param);
}
//查询活动类型
export function delActivity(param) {
  return request('/microservice/timesheet/timesheet_del_t_activity', param);
}
//查询活动类型
export function modifyActivity(param) {
  return request('/microservice/timesheet/timesheet_update_t_avtivity', param);
}

//查询活动类型
export function GeneratePopulationData(param) {
  return request('/microservice/alltimesheet/timesheet/GeneratePopulationData', param);
}
//.................................................工时统计......................................
//员工项目考核，等统计是否有权限
export function isHasAuto(param) {
  return request('/microservice/timesheet/timesheet_examine_auth_query', param);
}
export function queryAnnual(param) {
  return request('/microservice/timesheet/timesheet_generate_population_month_year', param);
}
export function queryMonthRadio(param) {
  return request('/microservice/timesheet/timesheet_search_person_proj_hours_ratio', param);
}
export function genRadio(param) {
  return request('/microservice/timesheet/timesheet_staff_proj_hours_ratio_generate', param);
}
export function TimesheetPopulationMonthUndo(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetPopulationMonthUndo', param);
}
export function calRadio(param) {
  return request('/microservice/timesheet/timesheet_staff_proj_hours_ratio_undo', param);
}

//查询外协
export function queryPartner(param) {
  return request('/microservice/purchase/p_search_work_load', param);
}
//同步
export function synPartner(param) {
  return request('/microservice/allpurchase/purchase/Synchrodata', param);
}
//生成
export function generatePartner(param) {
  return request('/microservice/alltimesheet/timesheet/GeneratePurchaseHoursDetails', param);
}
//撤销
export function cancelPartner(param) {
  return request('/microservice/timesheet/purchase_back_workload_details', param);
}
//查询合作伙伴生成
export function queryPartnerGenerate(param) {
  return request('/microservice/timesheet/purchase_search_workload_details', param);
}

//季度项目考核工作量年化查询
export function queryTimeSheetScore(param) {
  return request('/microservice/timesheet/timesheet_examine_season_hours_score_query', param);
}
//季度项目考核工作量年化生成
export function generateScoreData(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetExamineStaffScoreGenerate', param);
}
//季度项目考核工作量年化撤销
export function backScoreData(param) {
  return request('/microservice/timesheet/timesheet_examine_season_hours_score_back', param);
}
//季度项目考核工作量年化生成
export function generateProjExam(param) {
  return request('/microservice/timesheet/timesheet_examine_season_workload_generate', param);
}
//季度项目考核工作量年化查询
export function queryProjExam(param) {
  return request('/microservice/timesheet/timesheet_examine_season_workload_search', param);
}
//季度项目考核工作量年化撤销
export function backProjExam(param) {
  return request('/microservice/timesheet/timesheet_examine_season_workload_back', param);
}
//季度项目考核系数查询
export function queryProjRatio(param) {
  return request('/microservice/timesheet/timesheet_examine_season_proj_ratio_query', param);
}
export function isGen(param) {
  return request('/microservice/standardquery/projexam/isprojexamfinished', param);
}
export function IsSyn(param) {
  return request('/microservice/examine/issynprojratio', param);
}
//季度项目考核系数生成
export function generateProjRatio(param) {
  return request('/microservice/alltimesheet/timesheet/TimesheetExamineRatioDateGenerate', param);
}
//季度项目考核系数撤销
export function backProjRatio(param) {
  return request('/microservice/timesheet/timesheet_examine_season_proj_ratio_undo', param);
}

//查询科技创新工时占比
export function queryTechData(param) {
  return request('/microservice/timesheet/timesheet_technological_innovation_proj_ratio_search', param);
}
export function ratio_auth(param) {
  return request('/microservice/timesheet/timesheet_technological_innovation_proj_ratio_auth', param);
}
//生成科技创新工时占比
export function generateTechData(param) {
  return request('/microservice/timesheet/timesheet_technological_innovation_proj_ratio_generate', param);
}
//撤回科技创新工时占比
export function backTechData(param) {
  return request('/microservice/timesheet/timesheet_technological_innovation_proj_ratio_recall', param);
}
//.................................................新版审核服务......................................
//工时审核查询项目
export function queryTimeManageReviewProject(param) {
  return request('/microservice//timesheet/timesheet_check_pm_proj_query', param);
}
//审核底部信息查询
export function queryReviewBottomInfo(param) {
  return request('/microservice/timesheet/timesheet_check_proj_status_query', param);
}
//审核底部信息查询 PM
export function queryReviewBottomInfoPM(param) {
  return request('/microservice//timesheet/timesheet_check_makeup_proj_status_query', param);
}
//.................................................新版项目工时查询服务......................................
//项目工时查询：PMS明细查询
export function queryPMSDetail(param) {
  return request('/microservice/timesheet/timesheet_search_proj_pms_hours_details', param);
}
//.................................................新版人员工时查询......................................
//人员工时周查询
export function weekQuery(param) {
  return request('/microservice/timesheet/timesheet_search_staff_weekhours_query', param);
}
//人员工时月查询
export function monthQuery(param) {
  return request('/microservice/timesheet/timesheet_search_staff_monthhours_query', param);
}
//人员工时季度查询
export function seasonQuery(param) {
  return request('/microservice/timesheet/timesheet_search_staff_seasonhours_query', param);
}
//人员工时自定义查询
export function selfDefinedQuery(param) {
  return request('/microservice/timesheet/timesheet_search_staff_userdefinedhours_query', param);
}
//人员工时查询项目  项目经理查项目
export function queryManHourPorj(param) {
  return request('/microservice//timesheet/timesheet_check_pm_proj_query', param);
}
//人员工时周查询（PM）
export function weekQueryPM(param) {
  return request('/microservice/timesheet/timesheet_search_projstaff_weekhours_query', param);
}
//人员工时月查询（PM）
export function monthQueryPM(param) {
  return request('/microservice/timesheet/timesheet_search_projstaff_monthhours_query', param);
}
//人员工时季度查询（PM）
export function seasonQueryPM(param) {
  return request('/microservice/timesheet/timesheet_search_projstaff_seasonhours_query', param);
}
//人员工时自定义查询（PM）
export function selfDefinedQueryPM(param) {
  return request('/microservice/timesheet/timesheet_search_projstaff_userdefinedhours_query', param);
}
//人员工时查询项目  部门经理查项目
export function queryManHourPorjDM(param) {
  return request('/microservice/timesheet/timesheet_search_deptstaff_proj_query', param);
}
//人员工时周查询（DM）
export function weekQueryDM(param) {
  return request('/microservice/timesheet/timesheet_search_deptstaff_weekhours_query', param);
}
//人员工时月查询（DM）
export function monthQueryDM(param) {
  return request('/microservice/timesheet/timesheet_search_deptstaff_monthhours_query', param);
}
//人员工时季度查询（DM）
export function seasonQueryDM(param) {
  return request('/microservice/timesheet/timesheet_search_deptstaff_seasonhours_query', param);
}
//人员工时自定义查询（DM）
export function selfDefinedQueryDM(param) {
  return request('/microservice/timesheet/timesheet_search_deptstaff_userdefinedhours_query', param);
}

//人员工时查询详情
export function queryTimeSheetDetailWeek(param) {
  return request('/microservice/timesheet/timesheet_search_details_weekhours_query', param);
}
export function queryTimeSheetDetailMonth(param) {
  return request('/microservice/timesheet/timesheet_search_details_monthhours_query', param);
}
export function queryTimeSheetDetailSeason(param) {
  return request('/microservice/timesheet/timesheet_search_details_seasonhours_query', param);
}
export function queryTimeSheetDetailSelfDefined(param) {
  return request('/microservice/timesheet/timesheet_search_details_userdefinedhours_query', param);
}
//、、、、、、、、、、、、、、、、、、、、、节假日设置、、、、、、、、、、、、、、、、、、、、、、、
// 查询节假日
export function queryHolidaydayS(param) {
  return request('/microservice/timesheet/timesheet_holiday_days_query', param);
}
// 设置节假日
export function settingHolidayS(param) {
  return request('/microservice/alltimesheet/timesheet/timesetmonthholiday', param);
}
//............................................加计扣除工时统计。。。。。。。。。。。。。。。。。。
export function pmsProjSearch(param) {
  return request('/microservice/project/projquery_pms_info', param);
}
export function technologicalSearch(param) {
  return request('/microservice/timesheet/timesheet_technological_innovation_condition_search', param);
}
