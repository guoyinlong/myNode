/**
 * 作者：张枫
 * 创建日期：2019-09-02
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：工位申请接口
 */
import request from '../../utils/request';
//工位申请
export function applyFormCommit(param) {
  return request('/assetsmanageservice/assetsmanage/assets/applyFormCommit', param);
}
// 申请记录查询
export function queryApplyHistory(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryApplyHistory', param);
}
// 常驻人员申请人员信息查询
export function queryAssetsApplicantInfo(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryAssetsApplicantInfo', param);
}
//我的待办列表查询
export function queryAssetsToDoList(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryAssetsToDoList', param);
}
//查询用户角色
export function queryUserAssetsRole(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryUserAssetsRole', param);
}

//流动人员延期工位申请
export function queryAssetsTempUseInfo(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryAssetsTempUseInfo', param);
}

//工位审核  通过或者退回
export function reviewAssetsApply(param) {
  return request('/assetsmanageservice/assetsmanage/assets/reviewAssetsApply', param);
}
// 工位区域查询
export function assetsUseDateShow(param) {
  return request('/assetsmanageservice/assetsmanage/assets/assetsUseDateShow', param);
}
// 指定时间段内 工位使用信息查询

export function assetsUseStatistic(param) {
  return request('/assetsmanageservice/assetsmanage/assets/assetsUseStatistic', param);
}

//暂存工位查询
export function queryAssectsTempSave(param) {
  return request('/assetsmanageservice/assetsmanage/assets/aseetsTempSavedQuery', param);
}
//工位暂存服务
export function saveAssetsTemporary(param) {
  return request('/assetsmanageservice/assetsmanage/assets/assetsSaveTemporary', param);
}
// 暂存工位服务
export function queryTempSavedAssetsCount(param) {
  return request('/assetsmanageservice/assetsmanage/assets/tempSavedAssetsCount', param);
}
