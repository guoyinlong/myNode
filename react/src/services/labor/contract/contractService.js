/**
 * 作者：王福江
 * 日期：2019-09-03
 * 邮箱：wangfj80@chinaunicom.cn
 * 功能：
 */
import request from '../../../utils/request';

//查询续签合同
export function contractListQuery(param) {
  return request('/microservice/contract/contract_list_query', param);
}
//查询合同
export function contractQuery(param) {
  return request('/microservice/contract/contract_query', param);
}
//个人查询合同
export function contractPersonListQuery(param) {
  return request('/microservice/contract/contract_person_query', param);
}
//查询部门
export function deptListQuery(param) {
  return request('/microservice/contract/dept_list_query', param);
}
//查询提交人员
export function personListQuery(param) {
  return request('/microservice/contract/contract_person_list_query', param);
}
//业务提交，添加待办
export function contractApplySubmit(param) {
  return request('/microservice/contract/contract_renew_submit', param);
}
//业务提交，修改合同
export function contractPersonUpdate(param) {
  return request('/microservice/contract/contract_person_update', param);
}

//待办查询合同
export function contractApprovalListQuery(param) {
  return request('/microservice/contract/contract_approval_list_query', param);
}

//劳动合同导入
export function importContractDataSubmit(param) {
  return request('/microservice/contract/contract_import', param);
}

//劳动合同批量导入查验
export function checkPersonInfo(param) {
  return request('/microservice/contract/contract_personinfo_check', param);
}

//劳动合同批量导入回退
export function checkPersonInfoDelete(param) {
  return request('/microservice/contract/contract_person_check_delete', param);
}


//查询是否人力专员
export function checkIfHumanSpecial(param) {
  return request('/microservice/contract/check_human_special_query', param);
}
//合同解除
export function contractPersonEffective(param) {
  return request('/microservice/contract/contract_person_effective_update', param);
}

//合同续签打分
export function contractPersonScore(param) {
  return request('/microservice/contract/contract_person_score', param);
}

//合同审批驳回阅后即焚
export function deleteContractApproval(param) {
  return request('/microservice/contract/contract_approval_delete', param);
}












