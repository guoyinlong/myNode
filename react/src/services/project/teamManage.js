/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：团队管理
 */
import request, { postJsonRequest } from '../../utils/request';

const URL_PREFIX = "/microservice/newproject";

//查询项目列表
export function projQuery(param) {
    return postJsonRequest(URL_PREFIX + '/teamManage/teamSearch/list', param);
}
//查询OU列表
export function ouQuery(param) {
    return request(URL_PREFIX+'/userauth/psGetOu', param);
}
//查询部门列表
export function deptQuery(param) {
    return request(URL_PREFIX+'/userauth/deptQuery', param);
}

//查询团队成员列表
// export function teamQuery(param) {
//     return request(URL_PREFIX + '/teamManage/allSearch/list', param);
// }
export function teamMemberQuery(param) {
  return request(URL_PREFIX +'/teamManage/teamSearch/memberlist', param);
}
export function teamMemberInCheckQuery(param) {
  return request(URL_PREFIX + '/teamManage/teamCheckSearch/list', param);
}
//查询部门id组
export function budgetDeptQuery(param) {
    return request(URL_PREFIX + '/userauth/getDeptForAddUser', param);
}
//查询添加成员列表
export function userQuery(param) {
    return request(URL_PREFIX + '/userauth/getDeptAllUsers', param);
}
//查询项目详情
// export function projectInfo(param) {
// //     return request(URL_PREFIX + '/productionunit/query_baseinfo', param);
// // }
//新增原始成员
export function addMembers(param) {
    return postJsonRequest(URL_PREFIX + '/teamManage/teamCheckAdds?projId=' + param.projId + "&createBy=" + param.createBy, {projTeamCheckList: param.projTeamCheckList});
}
//删除新成员
export function deleteMembers(param) {
    return request(URL_PREFIX + '/teamManage/teamCheckDelete', param);
}
//删除原始成员
export function deleteOldMembers(param) {
  return request(URL_PREFIX + '/teamManage/teamQuit', param);
}
//修改主责配合
export function typeUpdate(param) {
    return request(URL_PREFIX + '/teamManage/teamUpdateType', param);
}
//查询角色列表
export function roleQuery(param) {
    return request( URL_PREFIX + '/userauth/queryRolesForManage', param);
}
//添加角色
// export function roleAdd(param) {
//     return request('/microservice/project/addroleforstaff', param);
// }
// //删除角色
// export function roleDel(param) {
//     return request('/microservice/project/delroleforstaff', param);
// }

export function roleAddOrDelete(param) {
  return request(URL_PREFIX + '/teamManage/teamRole/operateRole', param);
}

//人员查询
export function projTeamInfoQuery(param) {
    return request(URL_PREFIX + '/userauth/userInfoquery', param);
}

//详情页提交
export function projTeamSubmit(param) {
    return request(URL_PREFIX + '/teamManage/teamSubmit', param);
}

//判断是否在审核中
// export function teamInCheck(param) {
//     return request(URL_PREFIX + '/teamManage/teamCheckSearch/list', param);
// }

//caihao人员查询
export function projSearchNumberOfPeople(param) {
    return request('/microservice/project/t_proj_search_number_of_people', param);
}

//caihao人员查询详情
export function projPuTeamQuery(param) {
    return request('/microservice/project/t_proj_pu_team_query', param);
}
//团队管理查询任务历史
export function projSeachList(param) {
    return request(URL_PREFIX + '/teamManage/teamHistorySearch/one',param);
}

//团队管理详情页查询任务历史
export function projSeachApprovedList(param) {
    return request(URL_PREFIX + '/teamManage/teamHistorySearch/list',param);
}

//
export function projectCommonGetAllPuDepartment(param) {
    return request(URL_PREFIX+'/userauth/puQuery',param);
}
//
export function tProjTypeShowall(param) {
    return request(URL_PREFIX+'/userauth/queryProjType',param);
}

export function loginNewProject(param) {
    return request(URL_PREFIX + '/authc/login', param);
}
