import request from '../../utils/request';

export function tempkpiupdate(params) {
  return request('/microservice/transupdate/examine/tempkpiupdate',params);
}
// export function empkpivaluatenoaffirm(params) {
//   return request('/microservice/allexamine/examine/empkpivaluatenoaffirm',params);
// }
export function empkpivaluatenoaffirm(params) {
  return request('/microservice/allexamine/examine/empkpivaluatenoaffirmnew',params);
}
export function empkpievaluateundo(params) {
  return request('/microservice/examine/empkpievaluateundo',params);
}

