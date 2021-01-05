/*
 * 作者：刘东旭
 * 日期：2017-10-27
 * 邮箱：liudx100@chinaunicom.cn
 * 说明：一点看全-服务层数据来源
 * 修改：刘东旭，2017-11-16，20：30
 */

import request from '../../../utils/request';

// 项目类型分布
/*export function projectTypeServices(param) {
  return request('/microservice/cost/overviewbypoint/search_project_type_distribution', param);
}*/

export function projectTypeServices(param) {
  return request('/microservice/overview/search_proj_type_distribute', param);
}

// GS任务

/*export function Gs(param) {
  return request('/microservice//examine/whole_point_gsdepinfo', param);
}*/

export function Gs(param) {
  return request('/microservice/overview/search_dept_gsdepinfo', param);
}

// KPI(企发部和信息化部)
/*export function kpi(param) {
  return request('/microservice/cos/kpiquery', param);
}*/


export function kpi(param) {
  return request('/microservice/overview/search_dept_kpi', param);
}
