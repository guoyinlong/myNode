/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：请求管理文件
 */
import fetch from 'dva/fetch';
import {parseParam} from './func.js'
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：字符串转json
 * @param response 返回结果//修改 操作失败 错误
 */
function parseJSON(response) {
    return response.json();
}
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：检查返回状态
 * @param response 返回结果
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
// export default async function request(url, options) {
//   debugger
//   const response = await fetch(url, options);
//
//   checkStatus(response);
//
//   const data = await response.json();
//
//   const ret = {
//     data,
//     headers: {},
//   };
//
//   if (response.headers.get('x-total-count')) {
//     ret.headers['x-total-count'] = response.headers.get('x-total-count');
//   }
//
//   return ret;
// }

export default async function request(url, options,key) {

  const response = await fetch(url, {
    method:'post',
    credentials: 'include',
    headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body:parseParam(options,key)
  });

  checkStatus(response);

  const data = await response.json();
  if( url !== '/auth/relogin/logincheck' &&
      url !== "/auth/sessionLogin/isLogin" &&
      url !== "/microservice/cos/deptcostsel" &&
      url !== "/microservice/cos/depcost_static_new_publish" &&
      url !== "/microservice/cos/depcost_month_static_new_publish" &&
      url !== "/microservice/cos/depcost_static_publish" &&
      url !== "/microservice/cos/depcost_month_static_publish" &&
      url !== "/microservice/cos/persionalstatic" &&
      url !=="/microservice/cos/deptwtquery" &&
      url !=="/microservice/cos/projcostnewquery" &&
      url !=="/microservice/examine/t_proj_other2_search_proc" &&
      url !=="/microservice/cosservice/projectcost/allcost/proj_budget_going_sel" &&
      url !=="/microservice/cosservice/costcollection/allcost/collectionNewServlet" &&
      url !=="/microservice/meeting/t_meeting_room_if_useable" &&
      url !=='/microservice/funding_plan/query_team' &&
      url !=='/microservice/funds_plan/funds_budget_monthly_report_form_search'&&
      url !=='/microservice/funding_plan/monthly_funding_plan_all_ou_generate'&&
      url !=='/microservice/funding_plan/monthly_funding_plan_ou_generate'&&
      url !=='/microservice/funding_plan/undo_allOu_funding_plan' &&
      url !=='/microservice/purchase/p_service_confirm_search' &&
      url !=='/microservice/cos/get_summary_data' &&
      url !=='/microservice/cos/get_total_summary_data' &&
      url !=='/microservice/cos/get_collection_data' &&
      url !=='/microservice/cos/get_collection_data'&&
      url !=='/microservice/cos/progresschartnew' &&
      url !=='/microservice/labor/leave_undo_approval_query' &&
      url !=='/microservice/fundingplan/subjectmanage/GetProjInfo'){
      if(data.RetCode==='0'){
        const error = new Error(data.RetVal);
        throw error;
      }
  }

  if(!data.DataRows){
    data.DataRows=[]
  }
  // const ret = {
  //   data,
  //   headers: {},
  // };

  // if (response.headers.get('x-total-count')) {
  //   ret.headers['x-total-count'] = response.headers.get('x-total-count');
  // }

  return data;
}
export function reqwest(url, options) {
    return fetch(url, options)
            .then(checkStatus)
            .then(parseJSON)
            .then((data) => ({data}))
            .catch((err) => {
                throw err;
            });
}

/**
 * get请求
 * Author: 任金龙
 * Date: 2017年11月1日
 * Email: renjl33@chinaunicom.cn
 * @param url
 * @param params
 * @returns {Promise.<*>}
 */
export async function getRequest(url, params) {
  const response = await fetch(url, {
    method:'get',
    credentials: 'include',
    headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
  });

  checkStatus(response);
  const data = await response.json();
  if( url !== '/auth/relogin/logincheck' &&
    url !== "/auth/sessionLogin/isLogin" &&
    url !== "/microservice/cos/deptcostsel"){
    if(data.RetCode==='0'){
      const error = new Error(data.RetVal);
      throw error;
    }
  }
  if(!data.DataRows){
    data.DataRows=[]
  }
  return data;
}

export async function postJsonRequest(url, params) {
  const response = await fetch(url, {
    method:'post',
    credentials: 'include',
    headers:{'Content-Type': 'application/json;charset=UTF-8'},
    body: JSON.stringify(params)
  });

  checkStatus(response);
  const data = await response.json();
  if( url !== '/auth/relogin/logincheck' &&
    url !== "/auth/sessionLogin/isLogin" &&
    url !== "/microservice/cos/deptcostsel"){
    if(data.retCode==='0'){
      const error = new Error(data.RetVal);
      throw error;
    }
  }
  // if(!data.DataRows){
  //   data.DataRows=[]
  // }
  return data;
}
