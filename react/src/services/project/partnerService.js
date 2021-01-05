/**
 *  作者: 张枫
 *  日期: 2019-02-14
 *  邮箱：zhangf142@chinaunicom.cn
 *  文件说明：合作伙伴服务
 */
import request from '../../utils/request';
//查询项目列表
export function infoFillQuery(params) {
  return request('/microservice/purchase/purchase_search_filled_workload_info', params);
}
export function saveOrSubmitWorkLoad(params) {
  return request('/microservice/purchase/purchase_filled_workload_save_or_submit', params);
}
export function queryPartner(params) {
  return request('/microservice/purchase/purchase_search_all_partner', params);
}
export function searckForCheck(params) {
  return request('/microservice/purchase/purchase_filled_workload_search_for_check', params);
}
export function searchDept(params) {
  return request('/microservice/purchase/purchase_search_dept_all_proj', params);
}
//服务评价审核接口服务
export function checkWorkloadService (params) {
  return request('/microservice/purchase/purchase_filled_workload_check', params);
}
// 删除卡片服务
export function deleteFilledWorkload (params) {
  return request('/microservice/purchase/purchase_filled_workload_delete', params);
}
// 合作伙伴信息查询
export function searchWorkloadService(params) {
  return request('/microservice/purchase/purchase_filled_workload_search', params);
}
// 合作伙伴工作量信息查询
export function searchWorkloadSumService(params) {
  return request('/microservice/purchase/purchase_filled_workload_sum_search', params);
}
// 合作伙伴工作量可以撤回信息查询
export function workloadCanRecallService(params) {
  return request('/microservice/allpurchase/purchase/PurchaseFilledWorkloadSearchForRevoke', params);
}
// 合作伙伴工作量撤回信息
export function workloadRecallService(params) {
  return request('/microservice/purchase/purchase_filled_workload_check', params);
}
