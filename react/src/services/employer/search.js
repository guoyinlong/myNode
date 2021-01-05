/**
 * 作者：李杰双
 * 日期：2017/10/24
 * 邮件：282810545@qq.com
 * 文件说明：指标搜索服务
 */
import request from '../../utils/request';

export function ouFetch({ arg_tenantid,arg_user_id }) {
  return request('/microservice/examine/deptprincipalquery',{arg_tenantid,arg_user_id});
}
export function dmprojsearch(params) {
  return request('/microservice/examine/pdmempallperf_search_proc',params)
}
export function empkpiquery(params) {
  return request('/microservice/standardquery/examine/empkpiquery',params)
}

export function empscorequery(params) {

  return request('/microservice/standardquery/examine/empscorequery',params)
}

export function hrempkpiquery(params) {

  return request('/microservice/allexamine/examine/hrempkpiquery',params)
}
export function pmsearch({arg_cur_season,arg_cur_year,arg_mgr_id,arg_page_num,arg_start}) {

  return request('/microservice/examine/pmempkpiquery',{arg_cur_season,arg_cur_year,arg_mgr_id,arg_page_num,arg_start})
}
export function deleteKpi({arg_year,arg_season,arg_staff_id}) {

  return request('/microservice/allexamine/examine/movekpiAndscore',{arg_year,arg_season,arg_staff_id})
}
// 评分项增加修改
export function submitData(params){
  return request('/microservice/allexamine/examine/evalitemsaddandupdate',params) 
}
// 年度评分项详细查询
export function searchInfo(params){
  return request('/microservice/allexamine/examine/evalitemsandcountquery',params) 
}
// 员工互评开始
export function staffBegin(params){
  return request('/microservice/allexamine/examine/evalitemsstart',params) 
}
// 员工互评结束
export function staffEnd(params){
  return request('/microservice/allexamine/examine/evalitemsend',params) 
}
//被评论员工查询
export function staffEvaluation(params){
  return request('/microservice/allexamine/examine/evalstaffquery',params) 
}
//员工互评结果提交
export function ResultSumbit(params){
  return request('/microservice/allexamine/examine/evalresultsubmit',params) 
}
//季度时间查询
export function seasonTime() {
  return request('/microservice/examine/moduletime');
}
//BP增删改查
export function BPinfo(params) {
  return request('/microservice/allexamine/examine/principaldeptconf',params);
}
//BP指标查询
export function bpempkpiquery(params) {
  return request('/microservice/allexamine/examine/bpempkpiquery',params);
}
//BP考核结果查询
export function bpResultQuery(params) {
  return request('/microservice/allexamine/examine/empkpiresultquerybybp',params);
}
//中层三度评价信息查询
export function middleLevelInfo(params) {
  return request('/microservice/eval/queryevaledstaff',params);
}
//中层三度提交
export function middleLeveSubmit(params) {
  return request('/microservice/multitransopts/eval/staffscoresubmit',params);
}