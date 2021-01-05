/**
 *  作者: 任华维
 *  日期: 2017-11-09
 *  邮箱：renhw21@chinaunicom.cn
 *  文件说明：项目考核指标管理的服务
 */
import request from '../../utils/request';

//查询项目列表
export function projectListQuery(param) {
    return request('/microservice/examine/projexam/kpiquery', param);
}
//查询项目类型列表
export function projectTypeQuery(param) {
    return request('/microservice/standardquery/project/t_proj_type_showall', param);
}
//查询项目详情
export function projectDetailQuery(param) {
    return request('/microservice/project/project_t_proj_search_info', param);
}
//查询tmo
export function projectTMOQuery(param) {
    return request('/microservice/serviceauth/projtmoquery', param);
}
//查询Score
export function projectScoreQuery(param) {
    return request('/microservice/standardquery/examine/projscorequery', param);
}
//查询KpiTrans
export function projectKpiTransQuery(param) {
    return request('/microservice/standardquery/project/projkpitransquery', param);
}

//stmo模版详情
export function templetQuery(param) {
    return request('/microservice/standardquery/examine/projexam/templetquery', param);
}
//stmo列表页
export function templetStateQuery(param) {
    return request('/microservice/examine/projexam/templatestatelist', param);
}
//stmo模版更新
export function templetUpdate(param) {
    return request('/microservice/transopts/examine/projexam/templetupdate', param);
}
//考核指标kpi查询
export function projKpiQuery(param) {
    return request('/microservice/standardquery/examine/projexam/projkpiquery', param);
}
//考核指标kpi查询
export function projKpiUpdate(param) {
    return request('/microservice/transopts/examine/projexam/projkpiupdate', param);
}
//考核指标kpi查询
export function projScoreAdd(param) {
    return request('/microservice/transinsert/examine/projexam/projscoreadd', param);
}

//考核指标开始审核
export function projKpiSubmit(param) {
    return request('/microservice/allprojexam/projexam/pmfillprojkpisubmit', param);
}
//考核指标审核历史
export function checkHisquery(param) {
    return request('/microservice/standardquery/examine/projexam/checkhisquery', param);
}

//考核指标审核退回
export function dmCheckKpiNotPass(param) {
    return request('/microservice/allprojexam/projexam/dmcheckkpinotpass', param);
}
//考核指标审核通过
export function dmCheckKpiPass(param) {
    return request('/microservice/allprojexam/projexam/dmcheckkpipass', param);
}
//考核指标kpi查询
export function listProjKpiState(param) {
    return request('/microservice/examine/projexam/listprojkpistate', param);
}


//考核指标分配提交
export function projExamAlloc(param) {
    return request('/microservice/transopts/examine/projexam/projexamalloc', param);
}
//获取全部项目
export function projExamQuery(param) {
    return request('/microservice/examine/projexam/projexamquery', param);
}
//三部四中心
export function departmentQuery(param) {
    return request('/microservice/project/project_common_get_all_pu_department', param);
}

//考核指标部门经理/TMO审核未通过
export function checkkpinotpass(param) {
    return request('/microservice/allprojexam/projexam/checkkpinotpass', param);
}
//考核指标部门经理审核通过
export function dmcheckkpipass(param) {
    return request('/microservice/allprojexam/projexam/dmcheckkpipass', param);
}
//考核指标TMO审核通过
export function tmocheckkpipass(param) {
    return request('/microservice/allprojexam/projexam/tmocheckkpipass', param);
}
// 获取余数
export function getRemainder(param) {
    return request('/microservice/examine/projexam/t_proj_overplus_query', param);
}
// 结果排名
export function scoreRank(param) {
    return request('/microservice/examine/projexam/score_rank', param);
}
// 余数计算
export function computeRemainder(param) {
    return request('/microservice/examine/projexam/compute_remainder', param);
}
// 生产单元更新评级
export function updateRating(param) {
    return request('/microservice/examine/projexam/proj_update_rating', param);
}
// 生产单元评级结果查询
export function showRating(param) {
    return request('/microservice/allprojexam/projexam/RatingQuery', param);
}
//生产单元评级结果查询权限判断
export function rolePower(param) {
    return request('/microservice/examine/projexam/rolePower', param);
}
//部门经理所管理部门查询
export function getDept(param) {
  return request('/microservice/examine/projexam/get_user_dept', param);
}
//考核模板豁免里有保存
// export function reasonUpdate (param) {
//     return request ('/microservice/examine/projexam/t_proj_kpi_templet_reason_update',param)
// }
