/**
 * 作者：邓广晖
 * 创建日期：2019-01-14
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：项目结项服务
 */
import request from '../../utils/request';

//查询项目列表
export async function projTmoEndQuery(params) {
    return request('/microservice/project/project_proj_end_junctions_tmo_endproject_query', params);
}
//TMO项目结项 - 验证 - 项目团队人员
export async function projTmoEndValidateProj(params) {
    return request('/microservice/project/project_proj_end_junctions_tmo_endproject_validate_proj', params);
}
//TMO项目结项 - 验证 - 考核
export async function projTmoEndValidateExamine(params) {
    return request('/microservice/examine/project_proj_end_junctions_tmo_endproject_validate_examine', params);
}

//TMO项目结项
export async function projTmoEnd(params) {
    return request('/microservice/project/project_proj_end_junctions_tmo_endproject_opt', params);
}
