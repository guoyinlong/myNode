/**
 * 作者：张楠华
 * 创建日期：2019-07-15
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：折旧分摊服务
 */
import request from '../../utils/request';
// 获取ou
export function getOu(param) {
  return request('/microservice/amortize/amortize_ou_info_query',param);
}
//..............................
// 导入生成设备通用软件
export function importGenEquipmentData(param) {
  return request('/microservice/cosservice/importAmortize/itGenerate',param);
}
export function queryImportIt(param) {
  return request('/microservice/amortize/amortize_it_equipment_and_general_software_import_query',param);
}
// 查询设备通用软件
export function queryEquipmentData(param) {
  return request('/microservice/amortize/amortize_it_equipment_and_general_software_query',param);
}
// 撤销设备通用软件
export function delEquipmentData(param) {
  return request('/microservice/amortize/amortize_it_import_cancel',param);
}
//.....................................

export function queryImportOffice(param) {
  return request('/microservice/amortize/amortize_office_equipment_import_query',param);
}
// 导入后生成数据
export function importGenOfficeData(param) {
  return request('/microservice/cosservice/importAmortize/officeGenerate',param);
}
// 查询办公设备软件
export function queryOfficeData(param) {
  return request('/microservice/amortize/amortize_office_equipment_query',param);
}
// 撤销办公软件
export function delOfficeData(param) {
  return request('/microservice/amortize/amortize_office_import_cancel',param);
}
// 用户权限查询
export function p_userhasmodule(params) {
  return request('/microservice/serviceauth/p_userhasmodule',params)
}
// 用户角色查询
export function p_usergetouordeptinmodule(params) {
  return request('/microservice/serviceauth/p_usergetouordeptinmodule',params);
}
// 办公设备摊销修改
export function amortize_office_equipment_update(params) {
  return request('/microservice/amortize/amortize_office_equipment_update',params)
}
// 办公设备摊销删除
export function amortize_office_equipment_truncate(params) {
  return request('/microservice/amortize/amortize_office_equipment_truncate',params)
}
//办公设备原始数据修改（★）
export function amortize_asset_detail_report_update(params) {
  return request('/microservice/amortize/amortize_asset_detail_report_update',params)
}
