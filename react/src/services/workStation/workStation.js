/**
 * 作者： 彭东洋
 * 创建日期： 2019-09-06
 * 邮箱: pengdy@itnova.com.cn
 * 功能：场地资源接口
 */
import request from '../../utils/request';


export function queryUserAssetsRole(param) {//1.用户角色查询
  return request('/assetsmanageservice/assetsmanage/assets/queryUserAssetsRole', param);
}
export function applyFormCommit(param) {//2.申请、延期工位（流动人员和常驻人员）
  return request('/assetsmanageservice/assetsmanage/assets/applyFormCommit', param);
}
export function queryAssetsTempUseInfo(param) {//3.查询流动人员工位使用人员信息（延期申请页面）
   return request('/assetsmanageservice/assetsmanage/assets/queryAssetsTempUseInfo', param);
}
export function queryApplyHistory(param) {//4.申请记录查询（所有角色）
  return request('/assetsmanageservice/assetsmanage/assets/queryApplyHistory', param);
}
export function queryApplyFormDetail(param) {//5.查询工位申请详情（所有角色）
  return request('/assetsmanageservice/assetsmanage/assets/queryApplyFormDetail', param);
}
export function assetsUseDetail(param) {//6.在用工位信息查询
  return request('/assetsmanageservice/assetsmanage/assets/assetsUseDetail', param);
}
export function releaseAssets(param) {//7.释放工位
  return request('/assetsmanageservice/assetsmanage/assets/releaseAssets', param);
}
export function queryToDoList(param) {//8.待办列表查询（所有角色）
  return request('/assetsmanageservice/assetsmanage/assets/queryToDoList', param);
}
export function reviewAssetsApply(param) {//9.审核通过和退回（部门经理、属地管理员）
  return request('/assetsmanageservice/assetsmanage/assets/reviewAssetsApply', param);
}
export function assetsUseStatistic(param) {//10.指定时间内工位使用信息查询
  return request('/assetsmanageservice/assetsmanage/assets/assetsUseStatistic', param);
}
export function assetsUseDateShow(param) {//11.指定时间内工位使用信息的图形化展示
  return request('/assetsmanageservice/assetsmanage/assets/assetsUseDateShow', param);
}
export function queryblacklist(param) {//12.查询黑名单信息（属地管理员权限）
  return request('/assetsmanageservice/assetsmanage/assets/queryAssetsBlackListInfo', param);
}
export function addblacklistdata(param) {//13 添加黑名单数据（属地管理员权限）
  return request('/assetsmanageservice/assetsmanage/assets/addAssetsBlackListInfo', param);
}
export function modifyblacklist(param) {//14 移除黑名单信息数据（属地管理员权限）
  return request('/assetsmanageservice/assetsmanage/assets/addAssetsBlackListInfo', param);
}
export function modifyingblacklistexceptioninformation1(param) {//15 修改黑名单异常信息（管理员权限）
  return request('/assetsmanageservice/assetsmanage/assets/changeFacilitiesBlackListInfo', param);
}
export function modifyingblacklistexceptioninformation2(param) {//16 修改黑名单异常信息（管理员权限）
  return request('/assetsmanageservice/assetsmanage/assets/changeFacilitiesBlackListInfo', param);
}
export function modifyingequipmentabnormalinformation(param) {//17 管理员修改设备异常信息
  return request('/assetsmanageservice/assetsmanage/assets/adminChangeFacilityState', param);
}
export function blacklistquery(param) {//18 黑名单查询
  return request('/assetsmanageservice/assetsmanage/assets/queryFacilitiesBlackList', param);
}
export function blacklistnewentryquery(param) {//19 黑名单新增条数查询
  return request('/assetsmanageservice/assetsmanage/assets/facilitiesUnreadBlackListInfoCount', param);
}