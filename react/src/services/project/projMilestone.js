/**
 *  作者: 张建鹏
 *  创建日期: 20120-11-27
 *  文件说明：里程碑数据查询
 */
import request from "../../utils/request";
import { getRequest } from "../../utils/request";
import jsonrequest from "../../utils/jsonrequest";

//里程碑查询数据
export function proMilestoneLord(params) {
  let url =
    "/microservice/newproject/milest/list" +
    "?" +
    "projId" +
    "=" +
    params.projId;
  return getRequest(url, params);
}

//二级里程碑查询数据
export function proMilestoneLevel2(params2) {

  let url =
    "/microservice/newproject/milestone/list" +
    "?" +
    "milestId" +
    "=" +
    params2.milestId;
  return getRequest(url, params2);
}

//二级里程碑添加
export function proMilestoneAdd(params) {
  return jsonrequest("/microservice/newproject/milestone/create",params);
}

//天梯工程数据
export function proMilestoneTianti(params) {
  let url =
    "/microservice/newproject/ladder/list/linked/tianti" +
    "?" +
    "projId" +
    "=" +
    params.projId;
  return getRequest(url, params);
}

//查询生产单元列表
export function prodList(params) {
  return jsonrequest("/microservice/newproject/productionunit/list",params);
}

//二级里程碑修改接口
export function editSave(params) {
  return jsonrequest("/microservice/newproject/milestone/update", params);
}

//二级删除
export function proMilestoneDelete(params) {
  let url =
    "/microservice/newproject/milestone/delete" +
    "?" +
    "milestoneId" +
    "=" +
    params.milestoneId;
  return getRequest(url, params);
}
