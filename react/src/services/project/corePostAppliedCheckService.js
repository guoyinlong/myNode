/**
 * 作者：靳沛鑫
 * 日期：2019-06-20
 * 邮箱：1677401802@qq.com
 * 文件说明：续聘审核
 */
import request from '../../utils/request';

//续聘审核信息
export function postsCheckList(param) {
  return request('/microservice/coreposition/business/continueflow', param);
}
//承诺书审核历史信息
export function postsHistoryList(param) {
  return request('/microservice/coreposition/business/continuereviewrecord', param);
}

//承诺书通过
export function postsPassList(param) {
  return request('/microservice/coreposition/business/continuepassflow', param);
}
//承诺书退回
export function postsRefuseList(param) {
  return request('/microservice/coreposition/business/continuerefuseflow', param);
}

