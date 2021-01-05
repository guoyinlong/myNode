/**
 * 作者：张楠华
 * 创建日期：2017-11-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：考核结果状态服务
 */
import request from '../../utils/request';
export function searchCkeckList(params) {
  return request('/microservice/examine/ex_Personal_assessment',params);
}
export function searchValueList(params) {
  return request('/microservice/examine/ex_Personal_assessment_all',params);
}

export function resultQueryService(params) {
  return request('/microservice/examine/ouresultsearch',params);
}
export function searchDeptList(params) {
  return request('/microservice/project/oudeptquery',params);
}
export function initOuSearch(params) {
  return request('/microservice/serviceauth/ps_get_ou',params);
}
export function updateRatioS(params) {
  return request('/microservice/examine/synprojratio',params);
}

export function cancelRatioS(params) {
  return request('/microservice/examine/withdrawprojratio',params);
}
//根据角色id去获取用户列表
export function getusersByroleid(params) {
  return request('/microservice/serviceauth/p_getusersbyroleid',params);
}

//查部门负责人
export function departmentQuery(params) {
  return request('/microservice/serviceauth/hr_head_department_query',params);
}


