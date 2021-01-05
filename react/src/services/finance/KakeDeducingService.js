/**
 * 作者：陈红华
 * 创建日期：2017-09-29
 * 邮箱：1045825949@qq.com
 * 文件说明：财务加计扣除用到的服务
 */
import request from '../../utils/request';
// 表头查询服务
export function dividedGetTableHead(param) {
  return request('/microservice/cosservice/divided/dividedGetTableHead',param);
}
// 表一到四获取单个项目数据
export function getSubsidiayDetail(param) {
  return request('/microservice/cos/divided_getSingleProj',param);
}
// 单个项目生成
export function singleCreate(param){
  return request('/microservice/cos/divided_single_insert',param);
}
// 单个项目的发布
export function publishData(param){
  return request('/microservice/cos/publish_data',param);
}
// 单个项目的撤销
export function revocation(param){
  return request('/microservice/cos/divided_revoke_data',param);
}
