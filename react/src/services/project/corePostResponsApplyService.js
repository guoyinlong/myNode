/**
 * 作者：靳沛鑫
 * 日期：2019-06-21
 * 邮箱：1677401802@qq.com
 * 文件说明：责任承诺书
 */
import request from '../../utils/request';

//查询核心岗位信息
export function postInfoList(param) {
  return request('/microservice/coreposition/business/corepositions', param);
}
//查询生产业务部门
export function getDepartmentList(param) {
  return request('/microservice/coreposition/business/departmentnames', param);
}
//责任承诺书信息
export function resCorePostsList(param) {
  return request('/microservice/coreposition/business/responsibilitycorepositions', param);
}
//保存文件信息
export function postsResUpDataList(param) {
  return request('/microservice/coreposition/business/corepositioncommitment', param);
}
//提交
export function upDataResInfo(param) {
  return request('/microservice/coreposition/business/submitcoreposition', param);
}
