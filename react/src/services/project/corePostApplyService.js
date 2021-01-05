/**
 * 作者：靳沛鑫
 * 日期：2019-06-20
 * 邮箱：1677401802@qq.com
 * 文件说明：竞聘续聘申请
 */
import request from '../../utils/request';
//查询竞聘申请信息
export function postsList(param) {
  return request('/microservice/coreposition/business/appliedcompetecorepositions', param);
}
//查询续聘信息
export function postsContList(param) {
  return request('/microservice/coreposition/business/appliedcontinuecorepositions', param);
}
//提交竞聘信息appliedcontinuecoreposition
export function appCorePosition(param) {
  return request('/microservice/coreposition/business/appliedcompetecoreposition', param);
}
///续聘申请添加人 microservice/allproject/project/addcorepositionperson
export function addPersons(param) {
  return request('/microservice/coreposition/business/addcorepositionperson', param);
}
//提交续聘信息
export function appCorePositions(param) {
  return request('/microservice/coreposition/business/appliedcontinuecoreposition', param);
}
//上传文件信息
export function upDataUrl(param) {
  return request('/microservice/coreposition/business/corepositioninstruction', param);
}
