/**
 * 文件说明：干部管理服务
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-11-19
 * */
import request from '../../utils/request';

//干部信息查询
export function cadreInfoList(param){
  return request('/microservice/appraise/cadre_info_list',param);
}
//干部信息新增
export function cadreInfoAdd(param){
  return request('/microservice/appraise/cadre_info_add',param);
}
//干部信息删除
export function cadreInfoDel(param){
  return request('/microservice/appraise/cadre_info_del',param);
}
//干部信息修改
export function cadreInfoUpdate(param){
  return request('/microservice/appraise/cadre_info_update',param);
}
//评议人信息查询
export function personInfoList(param){
  return request('/microservice/appraise/person_info_list',param);
}
//评议人信息新增
export function personInfoAdd(param){
  return request('/microservice/appraise/person_info_add',param);
}
//评议人信息删除
export function personInfoDel(param){
  return request('/microservice/appraise/person_info_del',param);
}
//评议人信息修改
export function personInfoUpdate(param){
  return request('/microservice/appraise/person_info_update',param);
}
//干部管理-查询评议内容
export function getCommentInfoQuery(param){
  return request('/microservice/appraise/get_comment_info_query',param);
}

//干部管理-修改评议内容
export function updateCommentInfo(param){
  return request('/microservice/appraise/appraise_update_comment_info',param);
}

//干部管理-新增评议内容
export function addCommentInfo(param){
  return request('/microservice/appraise/appraise_add_new_comment_info',param);
}

//干部管理-删除评议内容
export function deleteCommentInfo(param){
  return request('/microservice/appraise/appraise_delete_comment_info',param);
}

//干部管理-待评议列表查询
export function apprasiePersonCommentInfoQuery(param){
  return request('/microservice/appraise/appraise_comment_approval_info_query',param);
}

//干部管理-待评议列表查询
export function commentApprovalSubmit(param){
  return request('/microservice/appraise/appraise_comment_approval_submit',param);
}

//评议人信息查询
export function appraisePersonList(param){
  return request('/microservice/appraise/appraise_person_list',param);
}
//评议组织信息查询
export function appraiseOrganList(param){
  return request('/microservice/appraise/appraise_organ_list',param);
}
//发起评议
export function startPersonAppraise(param){
  return request('/microservice/appraise/start_person_appraise',param);
}
export function startOraganAppraise(param){
  return request('/microservice/appraise/start_oragan_appraise',param);
}
//个人评议信息查询
export function appraisePersonInfo(param){
  return request('/microservice/appraise/appraise_person_info',param);
}
//组织机构评议信息查询
export function appraiseOrganInfo(param){
  return request('/microservice/appraise/appraise_oragan_look_list',param);
}

export function commentListQuery(param){
  return request('/microservice/appraise/get_comment_info_query',param);
}

//组织机构评议
export function commentOraganSubmit(param){
  return request('/microservice/transinsert/appraise/oragan_comment_submit',param);
}
export function commentOraganUpdate(param){
  return request('/microservice/appraise/oragan_comment_update',param);
}

//个人评议功能-评议人类型查询
export function apprasiePersonTypeQuery(param){
  return request('/microservice/appraise/appraise_person_type_info_query',param);
}


