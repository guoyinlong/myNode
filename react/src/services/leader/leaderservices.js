/**
 * 文件说明：中层考核相关服务
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-15
 */
import request from '../../utils/request';
//中层领导考核指标信息查询
export function leaderScoreSearch(params) {
  return request('/microservice/standardquery/examine/leaderscorequery',params);
}
//中层领导考核指标详情查询
export function leaderKpiSearch(params) {
  return request('/microservice/standardquery/examine/leaderkpiquery',params);
}
//待评价中层领导考核指标查询
export function leaderToValueSearch({arg_checker_id,arg_year}) {
  return request('/microservice/examine/leaderkpiunvaluequery',{arg_checker_id,arg_year});
}
//待评价中层领导考核指标查询
export function leaderKpiStageSearch({arg_checker_id,arg_year}) {
  return request('/microservice/examine/leaderkpiprogressquery',{arg_checker_id,arg_year});
}
//待评价中层领导支撑服务满意度评价进度查询
export function empSupportProgressSearch({arg_year}) {
  return request('/microservice/examine/leaderkpitosupportprogressquery',{arg_year});
}
//待评价中层领导支撑服务满意度评价状态查询
export function empSupportStateSearch({arg_staff_id}) {
  return request('/microservice/examine/empsupportscorequery',{arg_staff_id});
}
//待评价中层领导支撑服务满意度指标详情查询
export function empSupportDetailsSearch({arg_staff_id,arg_year}) {
  return request('/microservice/examine/empsupportdetailsquery',{arg_staff_id,arg_year});
}
//待评价中层领导支撑服务满意度指标更新
export function empSupportDetailsUpdate(params) {
  return request('/microservice/transupdate/examine/supportscoreupdate',params);
}
//待评价中层领导支撑服务满意度指标评价
export function empSupportDetailsValue({kpis,arg_year,arg_staff_id}) {
  return request('/microservice/allexamine/leaderexam/leadersupportevaluation',{kpis,arg_year,arg_staff_id});
}
//中层领导考核指标评价
export function leaderKpiValue({kpis,arg_year,arg_staff_id}) {
  return request('/microservice/allexamine/leaderexam/leaderevaluation',{kpis,arg_year,arg_staff_id});
}
//中层领导考核指标评价审核通过
export function leaderKpiValueCheckPass({kpis,arg_year,arg_staff_id}) {
  return request('/microservice/allexamine/leaderexam/leaderevaluationcheckpass',{kpis,arg_year,arg_staff_id});
}
//中层领导考核指标评价审核不通过
export function leaderKpiValueCheckUnPass({kpis,arg_year,arg_staff_id}) {
  return request('/microservice/allexamine/leaderexam/leaderevaluationchecknotpass',{kpis,arg_year,arg_staff_id});
}
//t_leader_kpi表更新
export function leaderKpiUpdate(params) {
  return request('/microservice/transupdate/examine/leaderkpiupdate',params);
}
//t_leader_score表更新
export function leaderScoreUpdate(params) {
  return request('/microservice/transupdate/examine/leaderscoreupdate',params);
}
//公告-（中层考核）述职报告查询
export function leaderReportQuery(params) {
  return request('/microservice/leader/leader_report_query',params);
}
//个人年度考核_述职报告更新
export function reporturlupdate(params) {
  return request('/microservice/transupdate/leader/reporturlupt',params);
}