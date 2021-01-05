/**
  * 作者： 彭东洋
  * 创建日期： 2019-10-12
  * 邮箱: pengdy@itnova.com.cn
  * 功能： 常用资料
  */
import request from '../../utils/request';
//查询文件夹
export function queryFilePath(param) {
    return request('/allcommondocument/commondocument/queryFilePath',param);
}
//创建文件夹
export function createFilePath(param) {
	return request('/allcommondocument/commondocument/createFilePath',param);
}
//删除文件夹
export function delFilePath(param) {
  	return request('/allcommondocument/commondocument/delFilePath',param);
}
//修改文件夹服务（仅能修改文件夹名称）
export function updateFilePath(param) {
  	return request('/allcommondocument/commondocument/updateFilePath',param);
}
//初始化文件	夹层级服务
export function initializeFilePath(param) {
  	return request('/allcommondocument/commondocument/initializeFilePath',param);
}
//创建用户角色服务
export function createRole(param) {
	return request('/allcommondocument/commondocument/createRole',param);
}
//查询文件服务（根据文件路径）
export function queryFile(param) {
	  return request('/allcommondocument/commondocument/queryFile',param);
}
//查询文件服务（按条件）
export function queryFileByTerm(param) {
	  return request('/allcommondocument/commondocument/queryFileByTerm',param);
}
//查询用户角色服务
export function queryManageRole(param) {
	  return request('/allcommondocument/commondocument/queryManageRole',param);
}
//查询申请列表服务
export function queryApply(param) {
  	return request('/allcommondocument/commondocument/queryApply',param);
}
//查询申请单详情服务
export function queryApplyDetal(param) {
  	return request('/allcommondocument/commondocument/queryApplyDetal',param);
}
//上传文件服务
export function uploadServlet(param) {
  	return request('/allcommondocument/commondocument/queryFileByTerm',param);
}
//上传服务（上传成功后调用）
export function uploadApply(param) {
	return request('/allcommondocument/commondocument/uploadApply',param);
}
//查询闻文件的可见范围及所属分类
export function queryFileVisibleAndPath(param) {
	return request('/allcommondocument/commondocument/queryFileVisibleAndPath',param);
}
//修改文件服务
export function updateFileServlet(param) {
	return request('/allcommondocument/commondocument/updateFileServlet',param);
}
//删除文件服务
export function delFile(param) {
	return request('/allcommondocument/commondocument/delFile',param);
}
//查询文件夹所在的目录路径服务（修改、新增文件夹时使用）
export function queryPathUrl(param) {
	return request('/allcommondocument/commondocument/queryPathUrl',param);
}
//查询管理员列表
export function queryManageList(param) {
	return request('/allcommondocument/commondocument/queryManageList',param);
}
//管理管理员服务（包含开、关、删除、修改）
export function updateManage(param) {
	return request('/allcommondocument/commondocument/updateManage',param);
}
//查询组织目录
export function queryDirectory(param) {
	return request('/microservice/management_of_meetings/meetings_dept_list_search',param);
}
//人员查询
export function queryStaff(param) {
	return request('/microservice/management_of_meetings/meetings_dept_user_search',param);
}
//下载服务
export function downFile(param) {
	return request('/allcommondocument/commondocument/downFile',param);
}
//根据部门查询人员
export function queryUserInfoByDeptId(param) {
	return request('/allcommondocument/commondocument/queryUserInfoByDeptId',param);
}
//查询文件上传至ceph时的状态
export function queryFileState(param) {
	return request('/allcommondocument/commondocument/queryFileState',param);
}