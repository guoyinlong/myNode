/**
 *  作者: 夏天
 *  日期: 2018-09-18
 *  邮箱：1348744578@qq.com
 *  文件说明：项目执行-周报月报(tmo页面)
 */
import request, { getRequest } from '../../utils/request';

//查询项目草稿
export function projQueryDraft(param) {
    return request('/microservice/project/project_projquery_draft', param);
}
//查询项目列表
export function projQueryPrimaryChild(param) {
    //return request('/microservice/project/projquery_new', param); //最原始的非主子项目
    return request('/microservice/project/projquery_primary_child', param);
}
//项目基本信息页面是否显示新建项目按钮
export function getNewAddProjArth(param) {
    return request('/microservice/allproject/project/ProjectInitiationNewProjectEstimate', param);
}
//查询项目类型
export function getProjType(param) {
    return request('/microservice/standardquery/project/t_proj_type_showall', param);
}
//三部四中心(归属部门查询)
export function departmentQuery(param) {
    return request('/microservice/project/project_common_get_all_pu_department', param);
}




// 月报详情列表查询
export function monthDetailQuery(param) {
    return request('/microservice/project/project_proj_execute_return_proj_monthly_list_query', param);
}


//月报详情页---所有月报类型查询
export function monthTypeQuery(param) {
    return request('/microservice/project/project_proj_execute_return_monthly_tag_query', param);
}

//月报详情页---月报状态编辑（退回或删除）
export function monthTagUpdateQuery(param) {
    return request('/microservice/project/project_proj_execute_return_monthly_tag_update', param);
}