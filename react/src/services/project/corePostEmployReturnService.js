/**
 * 作者：靳沛鑫
 * 日期：2019-06-19
 * 邮箱：1677401802@qq.com
 * 文件说明：竞聘退回
 */
import request from '../../utils/request';

//竞聘退回信息
export function postsReturnList(param) {
  return request('/microservice/coreposition/business/competerefusecoreposition', param);
}

//上传文件信息
export function upDataReturnUrl(param) {
  return request('/microservice/coreposition/business/corepositioninstruction', param);
}
//再次提交
export function upDataReapplied(param) {
  return request('/microservice/coreposition/business/reappliedcompetecoreposition', param);
}
//终止流程
export function upDataClose(param) {
  return request('/microservice/coreposition/business/competecloseflow', param);
}
