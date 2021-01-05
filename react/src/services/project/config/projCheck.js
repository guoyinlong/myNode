/**
 * 作者：金冠超
 * 创建日期：2019-17-18
 * 邮件：jingc@itnova.com.cn
 * 文件说明：项目配置-审核设置 所有server数据
 */
import request from '../../../utils/request';
//获取业务标识内容
export function ldentityList(param) {
    return request('/microservice/project/business_logo_query', param);
  }
//新增业务标识内容
export function addLdentity(param) {
    return request('/microservice/project/business_logo_increase', param);
  }
//修改业务标识内容
export function updateLdentity(param) {
    return request('/microservice/project/business_logo_update', param);
  }
//删除业务标识内容
export function delLdentity(param){
    return request('/microservice/project/business_logo_delete',param)
}
//获取审核环节内容
export function tacheList(param) {
    return request('/microservice/project/check_link_query', param);
  }
//新增审核环节内容
export function addTache(param) {
    return request('/microservice/project/check_link_increase', param);
  }
//修改审核环节内容
export function updateTache(param) {
    return request('/microservice/project/check_link_update', param);
  }
//删除审核环节内容
export function delTache(param){
    return request('/microservice/project/check_link_delete',param)
}
//获取角色列表内容
export function roleList(param) {
    return request('/microservice/project/check_role_query', param);
  }
//新增角色列表内容
export function addRole(param) {
    return request('/microservice/project/check_role_increase', param);
  }
//修改角色列表内容
export function updateRole(param) {
    return request('/microservice/project/check_role_update', param);
  }
//删除角色列表内容
export function delRole(param){
    return request('/microservice/project/check_role_delete',param)
}
//获取关联表内容
export function assignUserList(param) {
    return request('/microservice/project/check_role_user_query', param);
  }
//添加分配用户数据
export function increaseUser(param) {
    return request('/microservice/project/check_role_user_increase', param);
  }
//删除分配用户数据
export function delUser(param) {
    return request('/microservice/project/check_role_user_delete', param);
  }
//基础查询数组
export function getMessageList(param) {
    return request('/microservice/project/common_get_user_dept', param);
  }
/**
 * 作者：彭东洋
 * 创建日期：2020-02-18
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：项目配置-审核设置 所有server数据
*/
//邮件通知列表查询服务
export function getcapitalList(param) {
  return request('/microservice/project/email_notice_proj_capital_user_list_query', param);
}
//邮件通知新增人员
export function userInsert(param) {
  return request('/microservice/project/email_notice_proj_capital_user_insert', param);
}
//邮件通知删除服务
export function userDelete(param) {
  return request('/microservice/project/email_notice_proj_capital_user_delete', param);
}
//团建列表查询
export function projnamechangeUserListQuery(param) {
  return request('/microservice/project/email_notice_projcreate_projnamechange_user_list_query', param);
}
//团建新增人员
export function projnamechangeUserListInsert(param) {
  return request('/microservice/project/email_notice_projcreate_projnamechange_user_insert', param);
}
//团建删除服务
export function projnamechangeUserListDelete(param) {
  return request('/microservice/project/email_notice_projcreate_projnamechange_user_delete', param);
}
//归属部门列表查询
export function settingPuAllListQuery(param) {
  return request('/microservice/project/setting_pu_all_list_query', param);
}
//归属部门添加服务
export function settingPuAllInsert(param) {
  return request('/microservice/project/setting_pu_all_insert', param);
}
//归属部门状态修改服务
export function settingPuAllStateUpdate(param) {
  return request('/microservice/project/setting_pu_all_state_update', param);
}
//其他设置列表查询
export function settingTmoEditUserListQuery(param) {
  return request('/microservice/project/setting_tmo_edit_user_list_query', param);
}
//其他设置新增服务
export function settingTmoEditUserInsert(param) {
  return request('/microservice/project/setting_tmo_edit_user_insert', param);
}
//其他设置删除服务
export function settingTmoEditUserDelete(param) {
  return request('/microservice/project/setting_tmo_edit_user_delete', param);
}
//查询部门服务
export function deptquery(param) {
  return request('/microservice/userauth/deptquery', param);
}
/**
 * 作者：彭东洋
 * 创建日期：2020-04-14
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：项目配置-全成本标准
*/
//Ou	budget新增服务
export function autocalcu_cost_budget_sort_oubudget_add(param) {
  return request('/microservice/project/autocalcu_cost_budget_sort_oubudget_add', param);
}
//删除oubudget数据
export function autocalcu_cost_budget_sort_oubudget_delete(param) {
  return request('/microservice/project/autocalcu_cost_budget_sort_oubudget_delete', param);
}
//查询oubudget数据
export function autocalcu_cost_budget_sort_oubudget_query(param) {
  return request('/microservice/project/autocalcu_cost_budget_sort_oubudget_query', param);
}
//备注新增
export function autocalcu_cost_budget_sort_oubudget_remake_add(param) {
  return request('/microservice/project/autocalcu_cost_budget_sort_oubudget_remake_add', param);
}
//备注修改
export function autocalcu_cost_budget_sort_oubudget_remake_update(param) {
  return request('/microservice/project/autocalcu_cost_budget_sort_oubudget_remake_update', param);
}
//修改ou budget数据
export function autocalcu_cost_budget_sort_oubudget_update(param) {
  return request('/microservice/project/autocalcu_cost_budget_sort_oubudget_update', param);
}
//类别参数查询
export function autocalcu_cost_budget_sort_params_query(param) {
  return request('/microservice/project/autocalcu_cost_budget_sort_params_query', param);
}
//保存状态修改
export function autocalcu_cost_budget_sort_oubudget_submit(param) {
  return request('/microservice/project/autocalcu_cost_budget_sort_oubudget_submit', param);
}

  
  