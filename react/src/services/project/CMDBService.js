import request, {getRequest, getRequestHasParam}  from '../../utils/request';

export function queryCMDBData(param) {
    return request('/microservice/newproject/cmdb/getResourceDetail', param);
  }
export function initedCMDBData(){
   return getRequest('/microservice/newproject/cmdb/authToken');
}
