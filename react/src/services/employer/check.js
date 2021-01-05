/**
 * 作者：李杰双
 * 日期：2017/10/24
 * 邮件：282810545@qq.com
 * 文件说明：指标审核服务用
 */
import request from '../../utils/request';

export function moduleopenquery({ arg_code,arg_time }) {
  return request('/microservice/examine/moduleopenquery',{arg_code,arg_time});
}
export function empkpiuncheckquery({arg_checker_id}) {
  return request('/microservice/examine/empkpiuncheckquery',{arg_checker_id});
}
export function empkpiunvaluequery({arg_checker_id}) {
  return request('/microservice/examine/empkpiunvaluequery',{arg_checker_id});
}
export function kpi_score_check_proc(params) {
  return request('/microservice/examine/kpi_score_check_proc',params);
}
export function checknew(params) {
  return request('/microservice/allexamine/examine/checknew',params);
}
export function bpcalculate(params) {
  return request('/microservice/allexamine/examine/syncbpempkpiscore',params);
}
//季度时间查询
export function seasonTime() {
  return request('/microservice/examine/moduletime');
}
