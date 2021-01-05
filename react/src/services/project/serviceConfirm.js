/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：
 */
import request from '../../utils/request';

//查询服务评分标准
export function p_service_standarts_search() {
    return request('/microservice/purchase/p_service_standarts_search');
}
//查询服务确认单
export function p_service_confirm_search(param) {
    return request('/microservice/purchase/p_service_confirm_search', param);
}
//查询合作方信息
export function p_partner_search(param) {
    return request('/microservice/purchase/p_partner_search', param);
}
//查询项目组信息
export function p_proj_search(param) {
    return request('/microservice/purchase/p_proj_search', param);
}
//查询归属部门
export function project_common_get_all_pu_department(param) {
    return request('/microservice/project/project_common_get_all_pu_department', param);
}

//查询角色
export function p_purchase_getroles(param) {
    return request('/microservice/serviceauth/p_purchase_getroles', param);
}
//项目经理提交评分
export function ServiceAddBatServlet(param) {
    return request('/microservice/allpurchase/purchase/ServiceAddBatServlet', param);
}
//项目经理提交评分
export function p_if_isout(param) {
    return request('/microservice/serviceauth/p_if_isout', param);
}
// 项目经理提交后待办处理
export function p_service_confirm_search_aftercommit(params) {
    return request('/microservice/purchase/p_service_confirm_search_aftercommit',params);
}
