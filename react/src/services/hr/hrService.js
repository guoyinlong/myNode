/**
 *  作者: 耿倩倩
 *  创建日期: 2017-08-07
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：人力管理模块的服务
 */
import request from '../../utils/request';

//基本信息查询
export function basicInfoQuery(param){
  return request('/microservice/hr/infoquery',param);
}
//基本信息获取部门信息
export function getDeptInfo(param) {
  return request('/microservice/userauth/deptquery',param);
}
//基本信息修改
export function basicInfoModify(param){
  return request('/microservice/hrmanage/hr/hrUserUpdate',param);
}

//员工职务信息维护中的修改职务
export function changePost(param){
  return request('/microservice/serviceauth/hr_change_duty',param);
}

//员工职务信息维护中的新增兼职
export function addPost(param){
  return request('/microservice/serviceauth/hr_addin_deptpost',param);
}

//员工职务信息维护中的删除兼职
export function deleteInfo(param){
  return request('/microservice/serviceauth/hr_deletein_deptpost',param);
}

//基本信息管理中的导入
export function basicImport(param){
  //return request('/microservice/hrmanage/hr/hrPersistenceNew',param);
  return request('/microservice/hrmanage/hr/hrInspectExcel',param);
}
//基本信息管理中的导出
export function basicExportExl(params) {
  return request(
    '/microservice/allencouragement/encouragement/service/infoexport',
    params
  )
}
//基本信息管理中的excel预览数据的核对
export function checkImport(param){
  return request('/microservice/serviceauth/hr_department_position_detection',param);
}

//基本信息管理中的excel预览数据提交
export function commitData(param){
  return request('/microservice/hrmanage/hr/hrPersonnelImport',param);
}

//个人信息修改
export function staffInfoModify(param){
  return request('/microservice/hrmanage/hr/HrPersonUpdateServlet',param);
}

//员工离职
export function staffLeave(param){
  return request('/microservice/hrmanage/hr/hrPersonLeaving',param);
}

//员工部门变更
export function staffDeptChange(param){
  return request('/microservice/hrmanage/hr/hrTransformationDepartment',param);
}

//职务信息管理中的删除职务
export function postDele(param){
  return request('/microservice/hr/post_delete',param);
}


//职务信息模块查询，包括模块ID等
export function moduleQuery(param){
  return request('/microservice/serviceauth/p_userhasmodule',param);
}

//根据职务职务信息模块ID查询 组织单元 列表,分院的只能获取分院的
export function seeOU(param){
  return request('/microservice/serviceauth/p_usergetouordeptinmodule',param);
}

//获取组织单元列表
export function getOuList(param){
  return request('/microservice/serviceauth/ps_get_ou',param);
}

//根据当前用户ID查询用户当前所属部门信息
export function userOU(param){
  return request('/microservice/serviceauth/p_usergetdepartments',param);
}

//职务信息查询
export function postInfoQuery(param){
  return request('/microservice/hr/post_query',param);
}

//获取可新增职务列表
export function postListQuery(param){
  return request('/microservice/hr/all_post_query',param);
}

//发送新增职务
export function newPostSend(param){
  return request('/microservice/hr/post_add',param);
}

/*部门信息管理相关服务开始******************************/
//查询部门和部门负责人信息
export function deptInfoQuery(param){
  return request('/microservice/serviceauth/hr_head_department_query',param);
}

//删除部门和部门负责人信息
export function deptInfoDelete(param){
  return request('/microservice/serviceauth/hr_delete_auth_deptmaster',param);
}

//获取部门下的所有人
export function getAllUsers(param){
  return request('/microservice/userauth/deptorstaffquery',param);
}

//插入更新部门负责人
export function saveDeptMaster(param){
  return request('/microservice/serviceauth/hr_add_dept_master_proc',param);
}
//插入更新部门分管领导
export function saveDeptManager(param){
  return request('/microservice/serviceauth/deptmanageralter',param);
}
/*部门信息管理相关服务结束*********************************/

/***************************人员变动管理相关服务开始******************************/
//生成数据
export function personnelInfoCreate(param){
  return request('/microservice/hr/personnel_alter_init_query',param);
}

//查询数据
export function personnelInfoSearch(param){
  return request('/microservice/hr/personnel_alter_query',param);
}

//确认数据
export function personnelInfoCommit(param){
  return request('/microservice/hr/personnel_alter_add',param);
}

//撤消确认:将state_code状态码从0置为1（标记为历史数据,update 操作）
export function personnelInfoCancel(param){
  return request('/microservice/hr/personnel_alter_update',param);
}

//判断是否可以撤消确认（财务有没有使用该数据）
export function judge(param){
  return request('/microservice/cos/deptcostsel',param);
}
/**********************人员变动管理相关服务结束*********************************/


//分类信息
export function mycategoryquery(param){
    return request('/microservice/encourage/mycategoryquery',param);
}
//员工信息维护查询
export function selfinfoquery(param){
  return request('/microservice/hr/selfinfoquery',param);
}

// 全部人员信息查询
export function allbasicInfoQuery(param){
  return request('/microservice/hr/allinfoquery',param);
}

// 全面激励导入删除
export function admindeleterow (params) {
  return request('/microservice/allencouragement/encouragement/service/admindeleterow', params);
}

//发送验证码
export function sendCode(params) {
  return request('/microservice/allencouragement/encouragement/login/checksendcode', params);
}

//验证码提交
export function submitCode(params) {
  return request('/microservice/allencouragement/encouragement/login/checkreceivecode', params);
}

// 员工部门变动日期获取
export function staffDeptChangeDate (params) {
  return request('/microservice/hr/leavpersonnelchanges', params);
}
