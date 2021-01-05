/**
 * 作者：罗玉棋
 * 日期：2019-09-12
 * 邮箱：809590923@qq.com
 * 文件说明：个人信息修改页服务
 * */
import request from "../../utils/request";
//信息类别
export function indexInfo(params) {
  return request('/microservice/standardquery/encourage/categoryquery',params);
}
//字段信息查询
export function fieldInfo(params) {
  return request('/microservice/standardquery/encourage/metadataquery',params);
}
//信息查询
export function tableInfo(params) {
  return request('/microservice/allencouragement/encouragement/service/staffinfoquery',params);
}
//提交信息
export function upDateInfo(params) {
  return request('/microservice/allencouragement/encouragement/service/altersubmit',params);
}
//选项信息
export function wordbookQuery(params) {
  return request("/microservice/encourage/workbookquery", params);
}
//锁住的信息
export function lockService(params) {
  return request("/microservice/encourage/toauditlistsel", params);
}
//个人提交历史
export function personHistory(params) {
  return request("/microservice/allencouragement/encouragement/service/staffcheckhistorysel", params);
}
//修改的数据
export function editInfo(params) {
  return request("/microservice/allencouragement/encouragement/service/checkdataquery", params);
}
