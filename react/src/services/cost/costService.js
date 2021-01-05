/**
 * 文件说明：培训管理服务
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-09
 * */
import request from '../../utils/request';

//批量插入成本数据
export function insertLaborList(param){
  return request('/microservice/transinsert/labor/labor_insert_list',param);
}
//修改批量插入的数据
export function updateLaborList(param){
  return request('/microservice/cost/cost_insert_list_update',param);
}
//删除批量插入的数据
export function deleteLaborList(param){
  return request('/microservice/cost/cost_insert_list_delet',param);
}
//插入表头数据
export function insertTitleList(param){
  return request('/microservice/cost/cost_insert_title_list',param);
}
//查询各个院成绩字段
export function costTitleList(param){
  return request('/microservice/cost/cost_title_list_query',param);
}
//查询各个院成绩
export function costLaborList(param){
  return request('/microservice/cost/cost_labor_list_query',param);
}
//删除工资项
export function costTitleDelete(param){
  return request('/microservice/cost/cost_title_delete',param);
}
//新增工资项
export function costTitleAdd(param){
  return request('/microservice/cost/cost_title_add',param);
}
//修改工资项
export function costTitleUpdate(param){
  return request('/microservice/cost/cost_title_update',param);
}
//修改工资项
export function costTitleUpdateBranch(param){
  return request('/microservice/cost/cost_title_update_branch',param);
}

//--jinting
//查询ou内项目组信息
export function costProjTeamListQuery(param){
  return request('/microservice/cost/cost_proj_team_query',param);
}

//查询项人工成本明细信息
export function costProjDetaiQuery(param){
  return request('/microservice/cost/cost_proj_details_query',param);
}

//生成整个院的详细信息、项目组
export function generateCostQuery(param){
  return request('/microservice/cost/cost_create_detail_data',param);
}

//生成整个院的详细信息-全成本
export function generateCostFullQuery(param){
  return request('/microservice/cost/cost_create_full_data',param);
}

//查询整个院全成本信息
export function costFullDataQuery(param){
  return request('/microservice/cost/cost_full_data_query',param);
}

//生成财务报表数据
export function generateCostFinanceQuery(param){
  return request('/microservice/cost/cost_create_financial_data',param);
}

//查询财务报表数据
export function costFinanceDataQuery(param){
  return request('/microservice/cost/cost_financial_data_query',param);
}

//查询全部项目组信息数据
export function costAllDetaiQuery(param){
  return request('/microservice/cost/cost_proj_details_query_for_export',param);
}

//项目转资查询单个项目组数据-导出用
export function costToCapitalizationQuery(param){
  return request('/microservice/cost/cost_transfer_profit',param);
}

//项目转资查询项目组列表
export function costToCapitalizationTeamListQuery(param){
  return request('/microservice/cost/cost_transfer_profit_team_list',param);
}

//验证码申请工作流启动
export function sentVerifyCodeApplyFlowStart(param){ 
  return request('/microservice/workflownew/wfservice/begin?businessId='+param.start_type+'&tenantCode=humanwork',param);
} 

//验证码申请工作流关闭
export function sentVerifyCodeApplyApplyFlowTerminate(param){ 
  let url = "/microservice/workflownew/wfservice/terminate?procInstId="+param.procInstId+"&tenantCode=humanwork";
  return request(url,param);
} 
//验证码工作流完成第一个节点
export function sentVerifyCodeApplyApplyFlowComplete(param){
  let url = "/microservice/workflownew/wfservice/complete?taskId="+param.taskId+"&tenantCode=humanwork";
  return request(url,param);
}
//创建并返回6位验证码
export function sentVerifyCodeSave(param){
  return request('/microservice/cost/cost_rand_code_save',param);
}
//查询有效期内最新验证码
export function sentVerifyCodeQery(param){
  return request('/microservice/cost/cost_rand_code_query',param);
}


