/**
 *  作者: 夏天
 *  日期: 2018-09-05
 *  邮箱：1348744578@qq.com
 *  文件说明：项目信息导出服务
 */
import request from '../../utils/request';

//查询项目列表
export function projInfoListQuery(param) {
    return request('/microservice/project/project_proj_start_export_proj_list_query', param);
}


//获取全部归口部门名称
export function allDepartmentQuery(param) {
    return request('/microservice/project/project_common_get_all_pu_department', param);
}
//获取所有项目分类
export function allSearchProjTypeQuery(param) {
    return request('/microservice/project/t_proj_search_projtype', param);
}
//查询当前在用的项目类型
export function allCommonProjTypeQuery(param) {
    return request('/microservice/project/project_common_get_all_projtype', param);
}
//查询主建单位
export function allOuQuery(param) {
    return request('/microservice/project/project_common_get_ou', param);
}
// //查询主建部门
// export function allProjQuery(param) {
//     return request('/microservice/project/project_proj_start_export_proj_list_query', param);
// }
//查询项目状态
export function allProjTagQuery(param) {
    return request('/microservice/project/project_common_proj_tag', param);
}
//查询项目启动年份区间和结束年份区间
export function startAndEndYearQuery(param) {
    return request('/microservice/project/project_common_get_proj_start_end_year', param);
}


//可导出字段查询
export function exportFieldQuery(param) {
    return request('/microservice/project/project_proj_start_export_proj_field_query', param);
}

