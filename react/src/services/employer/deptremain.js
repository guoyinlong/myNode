/**
 * 作者：张楠华
 * 创建日期：2017-11-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：考核部门余数信息服务
 */
import request from '../../utils/request';
export function deptremain(params) {
  return request('/microservice/examine/departmentrankquery',params);
}


export function projRankUpdateS(params) {
  return request('/microservice/examine/departmentrankupdate',params);
}
