/**
 * 作者： 卢美娟
 * 创建日期： 2018-04-16
 * 邮箱: lumj14@chinaunicom.cn
 * 功能：资产管理（二维码库）接口
 */
import request from '../../utils/request';
export function assetsQuery(param) {
  return request('/assetsmanageservice/assetsmanage/assets/assetsQuery', param);
}

//根据资产id查询图片信息
export function assetQrcodeQuery(param) {
  return request('/assetsmanageservice/assetsmanage/assets/assetsQrcodeQuery', param);
}

//更改二维码信息
export function assetsUpdate(param) {
  return request('/assetsmanageservice/assetsmanage/assets/assetsUpdate', param);
}

//更改二维码信息-办公资产
export function assetsUpdateV2(param) {
  return request('/assetsmanageservice/assetsmanage/assets/assetsUpdateV2', param);
}

//禁用二维码信息
export function assetsDisabled(param) {
  return request('/assetsmanageservice/assetsmanage/assets/assetsUpdateState', param);
}

//添加二维码信息
export function assetsAdd(param) {
  return request('/assetsmanageservice/assetsmanage/assets/assetsAdd', param);
}

//添加二维码信息-办公资产
export function assetsAddV2(param) {
  return request('/assetsmanageservice/assetsmanage/assets/assetsAddV2', param);
}


//部门/员工信息查询
export function deptStaffSearch2({arg_deptname}) {
  return request('/microservice/serviceauth/p_getusers',{arg_deptname});
}

//固定资产类别查询
export function assetTypeSearch(param) {
  return request('/assetsmanageservice/assetsmanage/assets/assetsTypeQuery', param);
}

//查询 基础设施数据
export function infraQuery(param) {
  return request('/assetsmanageservice/assetsmanage/assets/infraQuery', param);
}

//更新 基础设施关联的固定资产
export function infraUpdateAsset(param) {
  return request('/assetsmanageservice/assetsmanage/assets/infraUpdateAsset', param);
}

//查询 指定人员使用的资产设备信息
export function usedAssetsInfoQuery(param) {
  return request('/assetsmanageservice/assetsmanage/assets/usedAssetsInfoQuery', param);
}

//统计信息查询: 查询指定基础设施容器的所有后代子基础设施中关联的工位信息
export function statisticsInfraStation(param) {
  return request('/assetsmanageservice/assetsmanage/assets/statisticsInfraStation', param);
}

//按使用人和使用部门 查询 基础设施平面图
export function infraQueryWithCriteria(param) {
  return request('/assetsmanageservice/assetsmanage/assets/infraQueryWithCriteria', param);
}

//查询厂商名单
export function vendorListQuery(param) {
  return request('/assetsmanageservice/assetsmanage/assets/vendorQuery', param);
}

//新增员工占用的工位数量的特别指定
export function addStationAllot(param) {
  return request('/assetsmanageservice/assetsmanage/assets/addStationAllot', param);
}

//查询员工特别指定情况列表
export function getStationAllotList(param) {
  return request('/assetsmanageservice/assetsmanage/assets/getStationAllotList', param);
}

//删除员工占用的工位数量的特别指定
export function deleteStationAllot(param) {
  return request('/assetsmanageservice/assetsmanage/assets/deleteStationAllot', param);
}

//修改员工占用的工位数量的特别指定
export function editStationAllot(param) {
  return request('/assetsmanageservice/assetsmanage/assets/editStationAllot', param);
}

//导入外部资源
export function importExternalResource(param) {
  return request('/assetsmanageservice/assetsmanage/assets/addExternalResource', param);
}

//查询外部人员
export function getExternalResource(param) {
  return request('/assetsmanageservice/assetsmanage/assets/getExternalResource', param);
}

//获取当前用户的权限列表
export function userpermission(param) {
  return request('/authentication/myAuth/userpermission', param);
}
//  获取登录账号权限
export function rolepermission(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryUserAssetsRole', param);
}

export function assetsRestart(param) {
  return request('/microservice/assetmanage/updateState', param);
}
//查询外部人员信息
export function queryExternalResource(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryExternalResource', param);
}
//移除外部人员信息
export function removeExternalResource(param) {
  return request('/assetsmanageservice/assetsmanage/assets/removeExternalResource', param);
}
//修改外部人员信息
export function reviseExternalResource(param) {
  return request('/assetsmanageservice/assetsmanage/assets/reviseExternalResource', param);
}
//用户查询
export function queryUserAssetsRole(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryUserAssetsRole', param);
}
//查询黑名单信息（属地管理员权限）
export function queryblacklist(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryAssetsBlackListInfo', param);
}
//添加黑名单数据（属地管理员权限）
export function addblacklistdata(param) {
  return request('/assetsmanageservice/assetsmanage/assets/addAssetsBlackListInfo', param);
}
//移除黑名单信息数据（属地管理员权限）
export function modifyblacklist(param) {
  return request('/assetsmanageservice/assetsmanage/assets/removeAssetsBlackListInfo', param);
}
//申请人员信息查询
export function informationinquiryapplicants(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryAssetsApplicantInfo', param);
}
//部门列表查询
export function departmentlistquery(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryDeptInfoUnderOu', param);
}
//查询部门属地管理员信息
export function queryadminformation(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryAssetsDeptAdminInfo', param);
}
//资产借还信息查询
export function assetinformationquery(param) {
  return request('/assetsmanageservice/assetsmanage/assets/queryFlowAssets', param);
}
//借还信息查询（设备设施）
export function detailsloaninformation (param) {
  return request('/assetsmanageservice/assetsmanage/assets/facilitiesUseHistory', param);
}
//流动工位统计
export function flowAssetsStatistic(param) {
  return request('/assetsmanageservice/assetsmanage/assets/flowAssetsStatistic', param);
}
