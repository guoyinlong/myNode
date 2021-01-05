/**
 * 文件说明：晋升管理服务
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-01-08
 */
import request from '../../utils/request';

//职级信息查询
export function promoteInfoList(param){
  return request('/microservice/rankpromote/rank_position_promote_query',param);
}
export function promotePersonListQuery(param){
  return request('/microservice/rankpromote/rank_promote_person_query',param);
}

export function rankPromoteSearch(param){
  return request('/microservice/rankpromote/rank_promote_query',param);
}
 

export function promoteInfoAllImport(param) {
  return request('/microservice/transinsert/rankpromote/rank_info_import_path', param);
}

export function promoteInfoUpdate(param){
  return request('/microservice/rankpromote/rank_promote_update',param);
}

export function promoteInfoDel(param){
  return request('/microservice/rankpromote/rank_promote_del',param);
}
//推荐路径查询
export function promotePathSearch(param){
  return request('/microservice/rankpromote/rank_promote_path_query',param);
}
//查询路径列表
export function getPathList(param){
  return request('/microservice/rankpromote/rank_path_list',param);
}

//获取推荐路径服务
export function doPromotePath(param){
  return request('/microservice/allhuman/human/hrPromotePath',param);
}
//计算剩余积分服务
export function doPromoteGrade(param){
  return request('/microservice/allhuman/human/hrPromoteGrade',param);
}
//职级信息批量导入

export function promoteInfoImportdel(param) {
  return request('/microservice/rankpromote/peomote_info_import_del', param);
}

export function promoteInfoImport1(param) {
  return request('/microservice/transinsert/rankpromote/rank_promote_info_import', param);
}

export function promoteInfoImportUpdate(param) {
  return request('/microservice/rankpromote/rank_promote_info_import_update', param);
}

//职级信息同步
export function rankPromoteSubmit(param){
  return request('/microservice/rankpromote/rank_promote_syn',param);
}

/*
export function promoteInfoImportHistory(param) {
  return request('/microservice/transinsert/rankpromote/promote_info_import_history', param);
}
*/
