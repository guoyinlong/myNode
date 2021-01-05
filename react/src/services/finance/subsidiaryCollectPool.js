/**
 * 作者：张楠华
 * 创建日期：2018-6-25
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：加计扣除表5，表6服务
 */
import request from '../../utils/request';
//表6查询
export function queryCollect(params) {
  return request('/microservice/cos/get_collection_data',params);
}
//查表头
export function dividedGetTableHead(params) {
  return request('/microservice/cosservice/divided/dividedGetTableHead',params);
}
