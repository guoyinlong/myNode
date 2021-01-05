/**
 *  作者: 张枫
 *  创建日期: 2018-9-18
 *  邮箱：denggh6@chinaunicom.cn
 *  文件说明：项目资本化服务
 */
import request from '../../utils/request';

//查询项目信息列表-pma
export function queryProjInfoDataList(params) {
  return request('/microservice/project/project_proj_capital_proj_list_query', params);
}
//开始结束服务
export function startOrEndProjectCapital(params){
  return request('/microservice/allproject/project/ProjectCapitalNoticeStartOrEnd', params);
}
//查询项目详细信息
export function queryProjDetailDataList(params) {
    return request('/microservice/project/project_proj_capital_proj_detail', params);
}

//资本化开始服务或者结束服务as
export function capitalStartOrEnd(params) {
    return request('/microservice/allproject/project/ProjectCapitalNoticeStartOrEnd', params);
}
//状态查询
export function queryTag(params){
  return request('/microservice/project/project_proj_capital_tag_query',params);
}
