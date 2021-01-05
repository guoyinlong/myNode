/**
 * 作者：靳沛鑫
 * 日期：2019-06-19
 * 邮箱：1677401802@qq.com
 * 文件说明：竞聘审核
 */
import request from '../../utils/request';
//竞聘审核信息
export function postsCheckList(param) {
  return request('/microservice/coreposition/business/competeflow', param);
}
//竞聘审核历史信息
export function postsHistoryList(param) {
  return request('/microservice/coreposition/business/competereviewrecord', param);
}

//竞聘通过
export function postsPassList(param) {
  return request('/microservice/coreposition/business/competepassflow', param);
}
//竞聘退回
export function postsRefuseList(param) {
  return request('/microservice/coreposition/business/competerefuseflow', param);
}

