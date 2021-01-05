/**
 * 作者：张楠华
 * 日期：2018-7-2
 * 邮件：zhangnh6@chinaunicom.com
 * 文件说明：辅助账汇总表服务
 */

import request from '../../utils/request';

//获取数据
export function get_summary_data(params) {
  return request('/microservice/cos/get_summary_data',params);
}
export function get_summary_sum_data(params) {
  return request('/microservice/cos/get_total_summary_data',params);
}
//暂时不用
export function get_summary_data_as_year(params) {
  return request('/microservice/cos/get_summary_data_as_year',params);
}
//获取表头
export function dividedGetTableHead(params) {
  return request('/microservice/cosservice/divided/dividedGetTableHead',params);
}
//生成
export function insert_all_summary_data(params) {
  return request('/microservice/cos/divided_insert_all_summary_data',params);
}
//发布
export function publish_summary_data(params) {
  return request('/microservice/cos/publish_summary_data',params);
}
//撤销
export function revokeData(params) {
  return request('/microservice/cos/revoke_summary_data',params);
}
//导出exl 第五张表
export function exportExcel(params) {
  return request('/microservice/cosservice/divided/ExportSummaryExcelAsMonthServlet',params);
}
