/*
 * 作者：刘东旭
 * 日期：2017-11-17
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：加计扣除-首页列表(v1.0)
 */

import request from '../../utils/request';

//加计扣除列表页获取当前用户查看项目权限
export function allProjectService(param) {
  return request('/microservice/serviceauth/p_usergetouordeptinmodule', param);
}



// 加计扣除列表页-默认内容
export function listContent(param) {
  return request('/microservice/cos/divided_get_all_proj', param);
}

// 加计扣除列表页-获取项目名称
export function projectNameService(param) {
  return request('/microservice/cos/get_all_proj_detail', param);
}

// 加计扣除列表页-按类别查询
export function listSearch(param) {
  return request('/microservice/cos/divided_get_all_proj_as_type', param);
}

// 加计扣除列表页-按月导出
export function derivedMonth(param) {
  return request('/microservice/cosservice/divided/ExportSupportExcelAsMonthServlet', param);
}

// 加计扣除列表页-按年导出
export function derivedYear(param) {
  return request('/microservice/cosservice/divided/ExportSupportExcelAsYearServlet', param);
}


// 加计扣除列表页-全部生成
export function createAll(param) {
  return request('/microservice/cos/divided_all_insert', param);
}

// 加计扣除列表页生成
export function listCreate(param) {
  return request('/microservice/cos/divided_all_insert', param);
}
