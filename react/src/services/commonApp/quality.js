/**
 *  作者: 张枫
 *  创建日期: 2018-11-09
 *  邮箱：zhangf142@chinaunicom.cn
 *  文件说明：质量管理服务。
 */
import request ,{getRequest}from '../../utils/request';


export function group_query(param) {
  return getRequest('/microservice_sonar/sonarQuality/quality/quality_sum/quality_sonar_group_query');
}
//代码质量汇总服务
export function sum_query(param) {
  return request('/microservice_sonar/sonarQuality/quality/quality_sum/quality_sonar_sum_query', param);
}
// 代码详细服务

export function queryDetails(param) {
  return request('/microservice_sonar/sonarQuality/quality/quality_sum/quality_type_query', param);
}
