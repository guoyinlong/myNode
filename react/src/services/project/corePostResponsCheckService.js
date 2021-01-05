/**
 * 作者：靳沛鑫
 * 日期：2019-06-21
 * 邮箱：1677401802@qq.com
 * 文件说明：责任书审核
 */
import request from '../../utils/request';

//承诺书审核信息
export function postsCheckList(param) {
  return request('/microservice/coreposition/business/responsibilityflow', param);
}
//承诺书审核历史信息
export function postsHistoryList(param) {
  return request('/microservice/coreposition/business/responsibilityreviewrecord', param);
}

//承诺书通过
export function postsPassList(param) {
  return request('/microservice/coreposition/business/responsibilitypassflow', param);
}
//承诺书退回
export function postsRefuseList(param) {
  return request('/microservice/coreposition/business/responsibilityrefuseflow', param);
}

