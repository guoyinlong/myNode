/**
 *  作者: 崔晓林
 *  创建日期: 2020-4-30
 *  邮箱：cuixl@itnovacom.cn
 *  文件说明：项目备案中详情页面所用到的服务
 */
import request from '../../utils/request';

//一键推送
export function projDetailPush(param){
  return request('/microservice/allproject/project/projImportToRD',param);               
}
//基本信息
export function projDetailBasic(param){
    return request('/microservice/project/project_t_proj_search_info',param);
  }

//里程碑
export function projDetailMiles(param) {
  return request('/microservice/project/project_t_proj_search_milestone_all', param);
}
//附件
export function projDetailAttach(param) {
  return request('/microservice/project/project_t_proj_search_attachment', param);
}



