/**
 * 作者：刘东旭
 * 创建日期：2018-3-12
 * 邮箱：liudx100@chinaunicom.cn
 * 文件说明：资金计划各种管理模块的服务
 */
import request from '../../utils/request';

/* == 科目管理 START == */

//科目查询
export function accountSearch() {
  return request('/microservice/fundingplan/subjectmanage/GetSubjectName');
}

//增加科目
export function accountAddFeeName(params) {
  return request('/microservice/funding_plan/add_fee_name', params);
}

//删除科目
export function accountDeleteFeeName(params) {
  return request('/microservice/funding_plan/delete_fee_name', params);
}

//编辑科目
export function accountEditName(params) {
  return request('/microservice/funding_plan/modify_fee_name', params);
}

/* == 科目管理 END == */


/* == 小组管理 START == */

//小组查询
export function teamCheck(params) {
  return request('/microservice/funding_plan/query_team', params);
}

//创建小组
export function teamAdd(params) {
  return request('/microservice/fundingplan/teammanage/AddTeam ', params);
}

//备选查询
export function teamAddCheck(params) {
  return request('/microservice/fundingplan/subjectmanage/GetDepartInfo', params);
}

//删除小组
export function teamDelete(params) {
  return request('/microservice/fundingplan/teammanage/DeleteTeam', params);
}

//编辑小组
export function teamEdit(params) {
  return request('/microservice/fundingplan/teammanage/ModifyTeam ', params);
}

/* == 小组管理 END == */


/* == 人员管理 START == */

//查询小组名称
export function memberTeamSearch(params) {
  return request('/microservice/funding_plan/query_team_by_staffid', params);
}

//人员查询
export function memberSearch(params) {
  return request('/microservice/funding_plan/query_team_members',params);
}

//已加入小组人员查询
export function teamMemberSearch() {
  return request('/microservice/funding_plan/query_team_members_in_team?arg_param=1');
}

//新增人员
export function memberAdd(params) {
  return request('/microservice/fundingplan/teammembersmanage/AddTeamMembers', params);
}

//新增时按部门-团队查询
export function memberAddDepartProj(params) {
  return request('/microservice/fundingplan/subjectmanage/GetDepartProjInfo', params);
}

//新增时按部门查询
export function memberAddDepart(params) {
  return request('/microservice/fundingplan/subjectmanage/GetDepartInfo', params);
}

//新增时按团队查询
export function memberAddProj(params) {
  return request('/microservice/fundingplan/subjectmanage/GetProjInfo', params);
}

//删除人员
export function memberDelete(params) {
  return request('/microservice/fundingplan/teammembersmanage/DeleteTeamMembers', params);
}

/* == 人员管理 END == */
