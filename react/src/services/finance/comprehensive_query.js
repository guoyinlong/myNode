/**
 * 作者：郝锐
 * 日期：2020/09/16
 * 邮件：haor@itnova.com.cn
 * 文件说明：全成本综合查询
 */
import request from '../../utils/request';
export function deptTotalCost(params) {
  return request('/microservice/cosservice/erpmaintain/deptTotalCost',params)
}
export function perPricingQuery(params) {
  return request('/microservice/cos/perPricingQuery',params)
}
export function deptTotalCostChart(params) {
  return request('/microservice/cosservice/erpmaintain/deptTotalCostChart',params)
}
export function projectTotalCost(params) {
  return request('/microservice/cosservice/erpmaintain/projectTotalCost',params)
}
// 获取项目类型列表
export function projTypeListQuery(params) {
  return request('/microservice/cosservice/erpmaintain/projectTypeQuery',params)
}
/**
 * ou预算完成情况明细查询
 * */
export function proj_total_cost_detail_query(params){
  return request('/microservice/cos/proj_total_cost_detail_query',params)
}


