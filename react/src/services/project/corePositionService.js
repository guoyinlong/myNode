/**
 * 作者：靳沛鑫
 * 日期：2019-05-28
 * 邮箱：1677401802@qq.com
 * 文件说明：岗位信息
 */
import request from '../../utils/request';
//查询核心岗位信息 /microservice/allproject/project/corepositions
export function postInfoList(param) {
  return request('/microservice/coreposition/business/corepositions', param);
}
export function buttonPermission(param) {
  return request('/microservice/coreposition/business/buttonpermission', param);
}
//查询生产业务部门 /microservice/allproject/project/departmentNames
export function getDeptList(param) {
  return request('/microservice/coreposition/business/departmentnames', param);
}
//查询生产单元名称

export function getProjectList(param) {
  return request('/microservice/coreposition/business/projectnames', param);
}
//查询人员所属院
export function getOuList(param) {
  return request('/microservice/coreposition/business/affiliatedacademynames', param);
}
//新增核心岗位信息
export function addCorePosts(param) {
  return request('/microservice/coreposition/business/addcoreposition', param);
}
//编辑核心岗位
export function editCorePosts(param) {
  return request('/microservice/coreposition/business/editcoreposition', param);
}
//编辑核心岗位选定人信息
export function editCorePostsPerson(param) {
  return request('/microservice/coreposition/business/editcorepositionperson', param);
}
//查询人员和所属院
export function userAndAcademyNames(param) {
  return request('/microservice/coreposition/business/userandacademynames', param);
}
//确认聘任
export function confirmEmploy(param) {
  return request('/microservice/coreposition/business/confirmemploy', param);
}
//确认失效
export function setexpired(param) {
  return request('/microservice/coreposition/business/setexpired', param);
}
//模板下载权限
/*export function downloadMode(param) {
  return request('/microservice/coreposition/business/downloadTemplate', param);
}*/
//编辑部门接口
export function projectNameCode(param) {
  return request('/microservice/coreposition/business/projectnameandcode', param);
}


