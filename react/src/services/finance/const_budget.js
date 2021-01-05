/**
 * 作者：李杰双
 * 日期：2017/10/24
 * 邮件：282810545@qq.com
 * 文件说明：全成本预算查询服务
 */
import request from '../../utils/request';

export function p_userhasmodule(param) {
  return request('/microservice/serviceauth/p_userhasmodule',param);
}
export function p_usergetouordeptinmodule(param) {
  return request('/microservice/serviceauth/p_usergetouordeptinmodule',param);

}
export function projname(param) {
  return request('/microservice/cos/projbudgetqueryallprojname',param);
}
export function projbudgetquery(param) {
  return request('/microservice/cos/projbudgetquery',param);
}
export function sync(param) {
  return request('/microservice/cosservice/cosprojbudget/allcost/cosprojbudgetsync',param);

}
export function collect_search_proc(param) {
  return request('/microservice/cos/collect_search_proc',param);
}
export function searchlastyearmonth(param) {
  return request('/microservice/cost/searchlastyearmonthnew',param);
}
export function collectionServlet(param) {
  return request('/microservice/cosservice/costcollection/allcost/collectionNewServlet',param);
}
export function usergetmodule_grpsrv(param) {
  return request('/microservice/serviceauth/usergetmodule_grpsrv',param);
}
