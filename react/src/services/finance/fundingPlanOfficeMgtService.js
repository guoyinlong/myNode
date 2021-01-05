/**
 * 作者：杨青
 * 创建日期：2018-3-20
 * 邮箱：yangq41@chinaunicom.cn
 * 文件说明：资金计划办公用品管理服务
 */
import request from '../../utils/request';
//新增办公用品
export function addOfficeProduct(params) {
  return request('/microservice/funding_plan/add_office_product',params);
}
//删除办公用品
export function deleteOfficeProduct(params) {
  return request('/microservice/funding_plan/delete_office_product',params);
}
//修改办公用品
export function modifyOfficeProduct(params) {
  return request('/microservice/funding_plan/modify_office_product',params);
}
//查询办公用品
export function getOfficeProduct(params) {
  return request('/microservice/fundingplan/subjectmanage/GetOfficeProductInfo',params);
}
