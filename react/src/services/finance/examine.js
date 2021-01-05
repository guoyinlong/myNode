/**
 * 文件说明：组织绩效考核服务
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-9-17
 */
import request from '../../utils/request';

// 指标列表
export function getIndexs(params) {
    return request('/examineservice/index/indexservlet/getIndexs', params);
}
// 生成指标列表
export function addIndex(params) {
    return request('/examineservice/index/settingservlet/addIndex', params);
}
// 审核指标详情
export function getToDoIndexDetail(params) {
    return request('/examineservice/index/indexservlet/getToDoIndexDetail', params);
}
// 指标评价列表
export function getToDoIndex(params) {
    return request('/examineservice/index/indexservlet/getToDoIndex', params);
}
// 获取部门
export function getUnits() {
    return request('/examineservice/index/indexservlet/getUnits');
}
// 指标填报
export function fillInItem(params) {
    return request('/examineservice/index/indexservlet/fillInItem', params);
}
// 指标评分
export function markItem(params) {
    return request('/examineservice/index/indexservlet/markItem', params);
}
// 指标提交
export function submitIndex(params) {
    return request('/examineservice/index/indexservlet/submitIndex', params);
}
// 指标退回后再次提交
export function reSubmitIndex(params) {
    return request('/examineservice/index/indexservlet/reSubmitIndex', params);
}
// 指标通过
export function passIndex(params) {
    return request('/examineservice/index/indexservlet/passIndex', params);
}
// 指标退回
export function refuseIndex(params) {
    return request('/examineservice/index/indexservlet/refuseIndex', params);
}
// 获取评分记录
export function getReviewRecord(params) {
    return request('/examineservice/index/indexservlet/getReviewRecord', params);
}
// 指标类型列表
export function getIndexTypeKeys() {
    return request('/examineservice/index/indexservlet/getIndexTypeKeys');
}
// 获取审核意见
export function getOpinion(params) {
    return request('/examineservice/index/indexservlet/getOpinion', params);
}
// 是否生成指标
export function hasAddIndex(params) {
    return request('/examineservice/index/settingservlet/hasAddIndex', params);
}
// 指标类型信息
export function getIndexTypes(params) {
    return request('/examineservice/index/indexservlet/getIndexTypes', params);
}
// 指标填报详情
export function getIndexTypeDetail(params) {
    return request('/examineservice/index/indexservlet/getIndexTypeDetail', params);
}

// 支撑信息获取
export function getSupports() {
    return request('/examineservice/index/supportservlet/getSupports');
}
// 支撑项插入
export function addSupport(params) {
    return request('/examineservice/index/supportservlet/addSupport', params);
}
// 支撑项查询
export function getSupportItem(params) {
    return request('/examineservice/index/supportservlet/getSupportItems', params);
}
// 支撑评价打分
export function markScore(params) {
    return request('/examineservice/index/supportservlet/markScore', params);
}
// 支撑服务提交打分
export function submitScore(params) {
    return request('/examineservice/index/supportservlet/submitScore', params);
}
// 生成支撑服务评价人
export function addSupportExaminerUsers(params) {
    return request('/examineservice/index/settingservlet/addSupportExaminerUsers', params);
}
// 是否生成支撑服务指标评价人
export function hasAddSupportExaminerUsers(params) {
    return request('/examineservice/index/settingservlet/hasAddSupportExaminerUsers', params);
}
// 支撑协同互评查询
export const getMutual = params =>request('/examineservice/index/supportservlet/getMutual', params);
// 支撑协同互评types
export const getMutualItemIndexs = params => request('/examineservice/index/supportservlet/getMutualItemIndexs', params);
// 支撑协同互评详情
export const getMutualDetail = params => request('/examineservice/index/supportservlet/getMutualDetail', params);
// 互评打分
export const supportMarkItem = params => request('/examineservice/index/supportservlet/markItem', params);
// 互评提交
export const supportSubmitIndex = params => request('/examineservice/index/supportservlet/submitIndex', params);


// 生成申请人信息
export function addApplicants(params) {
    return request('/examineservice/index/settingservlet/addApplicants', params);
}
// 查询申请人信息
export function getApplicants(params) {
    return request('/examineservice/index/settingservlet/getApplicants', params);
}
// 修改申请人
export function modifyApplicant(params) {
    return request('/examineservice/index/settingservlet/modifyApplicant', params);
}
// 生成审核人信息
export function addExaminerUsers(params) {
    return request('/examineservice/index/settingservlet/addExaminerUsers', params);
}
// 查询审核人信息
export function getExaminerUsers(params) {
    return request('/examineservice/index/settingservlet/getExaminerUsers', params);
}
// 修改审核人
export function modifyExaminerUser(params) {
    return request('/examineservice/index/settingservlet/modifyExaminerUser', params);
}
// 查询用户信息
export function getUsers(params) {
    return request('/examineservice/index/settingservlet/getUsers', params);
}

// 获取月度或季度指标列表
export const getMonthOrQuarterIndex = params => request('/examineservice/index/indexservlet/getMonthOrQuarterIndex', params);

// 获取月度或季度指标详情
export const getMonthIndexTypeDetail = params => request('/examineservice/index/indexservlet/getMonthIndexTypeDetail', params);

// 获取月度指标类型
export const getMonthTypes = params => request('/examineservice/index/indexservlet/getMonthTypes', params);

// 月度指标填写
export const monthFillInItem = params => request('/examineservice/index/indexservlet/monthFillInItem', params);

// 月度指标第一次提交
export const submitMonthIndex = params => request('/examineservice/index/indexservlet/submitMonthIndex', params);

// 季度填报tab
export const getQuarterCompletion = params => request('/examineservice/index/indexservlet/getQuarterCompletion', params);

// 指标评价表格
export const getToDoMonthIndex = params => request('/examineservice/index/indexservlet/getToDoMonthIndex', params);

// 年度评价表格
export const getYearIndex = params => request('/examineservice/index/indexservlet/getYearIndex', params);

// 指标评价tab
export const getToDoReIndexDetail = params => request('/examineservice/index/indexservlet/getToDoReIndexDetail', params);

// 指标评价详情
export const getMonthIndexDetail = params => request('/examineservice/index/indexservlet/getMonthIndexDetail', params);

// 指标流程通过
export const passMonthIndex = params => request('/examineservice/index/indexservlet/passMonthIndex', params);

// 指标流程退回
export const refuseMonthIndex = params => request('/examineservice/index/indexservlet/refuseMonthIndex', params);

// 年度指标tabs
export const getYearCount = params => request('/examineservice/index/indexservlet/getYearCount', params);

// 年度指标详情
export const getYearDetail = params => request('/examineservice/index/indexservlet/getYearDetail', params);

// 年度分数保存
export const markITItem = params => request('/examineservice/index/indexservlet/markITItem', params);

// it专业线分数合计
export const submitITItem = params => request('/examineservice/index/indexservlet/submitITItem', params);

// 互评生成
export const addMutual = params => request('/examineservice/index/settingservlet/addMutual', params);

// 互评查询
export const getMutualUsers = (params) => request('/examineservice/index/supportservlet/getMutualUsers', params);

// 互评修改
export const supportModifyExaminerUser = params => request('/examineservice/index/supportservlet/modifyExaminerUser', params);

// it生成
export const addIt = () => request('/examineservice/index/settingservlet/addIt');

// it查询
export const getItUsers = () => request('/examineservice/index/settingservlet/getItUsers');

// it修改
export const itModifyExaminerUser = params => request('/examineservice/index/settingservlet/itModifyExaminerUser', params);

// 退回再提交
export const reSubmitMonthFlow = params => request('/examineservice/index/indexservlet/reSubmitMonthFlow', params);

// it年度填报详情tab查询
export const getCount = params => request('/examineservice/index/indexservlet/getCount', params);

// it年度填报详情查询
export const getItIndexDetail = params => request('/examineservice/index/indexservlet/getItIndexDetail', params);

// it年度填写
export const fillInYearItem = params => request('/examineservice/index/indexservlet/fillInYearItem', params);

// it保存
export const saveITItem = params => request('/examineservice/index/indexservlet/saveITItem', params);

// 审核人权限
export const getUserRights = () => request('/examineservice/index/settingservlet/getUserRights');

// 导出指标
export const exportExcel = params => request('/examineservice/index/indexservlet/exportExcel', params);

// 导入指标
export const importIndexModel = params => request('/examineservice/index/settingservlet/importIndex', params);

// 填报提示
export const getPendingIndex = params => request('/examineservice/index/indexservlet/getPendingIndex', params);
