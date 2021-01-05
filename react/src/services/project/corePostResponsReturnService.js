/**
 * 作者：靳沛鑫
 * 日期：2019-06-21
 * 邮箱：1677401802@qq.com
 * 文件说明：责任书退回
 */
import request from '../../utils/request';

//承诺书退回信息
export function postsReturnList(param) {
  return request('/microservice/coreposition/business/responsibilityrefusecoreposition', param);
}
//再次提交
export function upDataReapplied(param) {
  return request('/microservice/coreposition/business/resubmitcoreposition', param);
}
//上传文件信息
export function upDataReturnUrl(param) {
  return request('/microservice/coreposition/business/corepositioncommitment', param);
}
//终止流程
export function upDataClose(param) {
  return request('/microservice/coreposition/business/responsibilitycloseflow', param);
}
