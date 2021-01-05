/*
    @author:zhulei
    @date:2017/11/13
    @email:xiangzl3@chinaunicom.cn
    @description:开源社区服务
*/

import request from '../../utils/request';

//Gitlab根据项目的owner查询
export function gitlab_query_own_proj(param) {
  return request('/microservice/serviceauth/gitlab_query_own_proj',param);
}

//Gitlab查询人员参与的项目
export function gitlabprojuserjoin(param) {
  return request('/microservice/gitlabencapsrv/gitlabApiSrv/gitlabprojuserjoin/get',param);
}

//GitLab查询项目类别
export function gitlabclassquery() {
  return request('/microservice/serviceauth/gitlabclassquery');
}

//Gitlab集成项目增加
export function gitlabprojectadd(param) {
  return request("/microservice/gitlabencapsrv/gitlabApiSrv/gitlabprojectadd",param);
}

//Gitlab集成项目星级统计
export function starsstatistics() {
  return request("/microservice/gitlabencapsrv/gitlabApiSrv/starsstatistics/get");
}

//Gitlab集成项目提交统计
export function commitsstatistics() {
  return request("/microservice/gitlabencapsrv/gitlabApiSrv/commitsstatistics/get");
}


//Gitlab项目字典查询
export function gitlab_query_proj() {
  return request("/microservice/serviceauth/gitlab_query_proj");
}

//Gitlab项目分类统计查询
export function gitlab_projclass_statistics() {
  return request("/microservice/serviceauth/gitlab_projclass_statistics");
}

//Gitlab项目语言分类查询
export function gitlab_projlang_statistics() {
  return request("/microservice/serviceauth/gitlab_projlang_statistics");
}

//Gitlab项目语言分类查询
export function gitlabpassreset(param) {
  return request("/microservice/gitlabencapsrv/gitlabApiSrv/gitlabpassreset/reset",param);
}

//Gitlab集成项目登录认证
export function signin(param) {
  return request("/microservice/gitlabencapsrv/gitlablogin/sigin/get",param);
}
