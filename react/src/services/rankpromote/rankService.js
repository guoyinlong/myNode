/**
 * 文件说明：职级管理服务
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-12-05
 * */
import request from '../../utils/request';

//职级信息查询
export function rankInfoList(param) {
  return request('/microservice/rankpromote/rank_info_list', param);
}
//职级信息历史查询
export function rankInfoQuery(param) {
  return request('/microservice/rankpromote/rank_info_query', param);
}
//职级信息批量导入
export function rankInfoImport(param) {
  return request('/microservice/transinsert/rankpromote/rank_info_import', param);
}
export function rankInfoImportHistory(param) {
  return request('/microservice/transinsert/rankpromote/rank_info_import_history', param);
}
//导入后信息处理
export function rankInfoImportUpdate(param) {
  return request('/microservice/rankpromote/rank_info_import_update', param);
}
//员工职级薪档信息自定义统计-权限查询
export function rankCheckRole(param) {
  return request('/microservice/rankpromote/person_rank_role_query', param);
}
//员工职级薪档信息自定义统计-查询功能
export function rankPromotionQuery(param) {
  return request('/microservice/rankpromote/rank_person_promotion_query', param);
}
//员工职级薪档信息自定义统计-查询功能
export function rankcomprehensiveDataQuery(param) {
  return request('/microservice/rankpromote/rank_comprehensive_data_query', param);
}



