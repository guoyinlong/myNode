/**
 * 文件说明：合作伙伴相关服务
 * 作者：王超
 * 邮箱：wangc235@chinaunicom.cn
 * 创建日期：2018-06-15
 */
import request from '../../utils/request';
// 合作伙伴指标填写页服务
export function getWriteList(params) {
  return request('/microservice/purchase/p_kpi_search',params);
}

// 合作伙伴获取详title
export function getDetailTitle(params) {
  return request('/microservice/purchase/p_kpi_search_outsourcer_info',params);
}

// 合作伙伴获取详情页指标查询
export function getKPI(params) {
  return request('/microservice/purchase/p_kpi_search_details',params);
}

// 合作伙伴获取详情页指标保存 提交
export function addKPI(params) {
  return request('/microservice/purchase/p_kpi_add',params);
}

// 指标审核获取列表
export function getCheckList(params) {
  return request('/microservice/purchase/p_kpi_check_search',params);
}

// 指标审核退回
export function back(params) {
  return request('/microservice/purchase/p_kpi_check_back',params);
}

// 指标审核通过
export function pass(params) {
  return request('/microservice/purchase/p_kpi_check_pass',params);
}

// 指标评分获取列表
export function getAssessList(params) {
  return request('/microservice/purchase/p_kpi_assess_search',params);
}

// 提交评分
export function pmPass(params) {
  return request('/microservice/purchase/p_kpi_assess_score',params);
}

// 正态分布卡片列表
export function getRateList(params) {
  return request('/microservice/purchase/p_kpi_rate_search_list',params);
}

// 正态分布指标余额
export function getRateScore(params) {
  return request('/microservice/purchase/p_kpi_rate_search_month_left',params);
}

// 正态分布详情
export function getRateDetail(params) {
  return request('/microservice/purchase/p_kpi_rate_search_details',params);
}

// 正态分布提交
export function getRateSubmit(params) {
  return request('/microservice/purchase/p_kpi_rate_adjust_contribution',params);
}





