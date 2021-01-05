/**
 *  作者: 张建鹏
 *  创建日期: 2018-9-18
 *  文件说明：项目备案数据查询
 */
import request from '../../utils/request';

//主页数据
export function queryProjChild(params) {
  return request('/microservice/allproject/project/ProjCreateRecordProjectList', params);
}
