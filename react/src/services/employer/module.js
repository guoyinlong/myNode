/**
 * 作者：张楠华
 * 创建日期：2017-11-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：考核开放时间服务
 */
import request from '../../utils/request';

export function moduleOpenModify(params) {
  return request('/microservice/examine/moduleperiodModify',params);
}
export function moduleOpenQuery(params) {
  return request('/microservice/examine/moduleperiodQuery',params);
}
export function moduleOpenAdd(params) {
  return request('/microservice/examine/moduleperiodAdd',params);
}
//中层考核录入查询
export function staffInfo(params) {
  return request('/microservice/allexamine/examine/leaderscoreentersel',params);
}
//中层考核录入更新
export function updateInfo(params) {
  return request('/microservice/allexamine/examine/leaderscoreenter',params);
}
//中层考核信息title查询
export function columnInfo(params) {
  return request('/microservice/allexamine/examine/leaderscoretitlesel',params);
}
//中层考核部门查询
export function deptlist(params) {
  return request('/microservice/leader/deptlistquery',params);
}
//中层考核信息查询
export function leaderInfo(params) {
  return request('/microservice/allexamine/examine/leaderinfoquery',params);
}
//员工互评结果页查询
 export function staffResult(params) {
  return request('/microservice/examin/evalstaffinfoquery',params);
}
//员工互评结果页单位查询
export function staffDeptList(params) {
  return request('/microservice/serviceauth/ps_get_ou',params);
}
//中层互评-三度聘任意见查询
export function middleInfo(params) {
  return request('/microservice/leader/engage_statistics_query',params);
}
//中层互评-互评开启查询
export function seachInfo(params) {
  return request('/microservice/leader/leaderevalstatequery',params);
}
//查询员工互评状态
export function mutualEvalStateSearch({arg_year,arg_evalsys_type}) {
  return request('/microservice/eval/anonymousaccountlist',{arg_year,arg_evalsys_type});
}
//季度时间查询
export function seasonTime() {
  return request('/microservice/examine/moduletime');
}