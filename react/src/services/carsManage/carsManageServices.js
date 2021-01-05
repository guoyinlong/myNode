/**
 * 作者：窦阳春
 * 创建日期： 2020-4-21
 * 邮箱: douyc@itnova.com.cn
 * 功能： 公车管理系统服务接口
 */
import request from '../../utils/request';
import Cookies from 'js-cookie';
let userid = Cookies.get("userid")
export function carsDemander(param) { // 用车需求人
    return request('/microservice/carmanager/showAllDeptUsers',{...param, userid});
}
export function submit(param) { // 保存/提交
	return request('/microservice/carmanager/saveCarDemand',{...param, userid});
}
export function editCarDemand(param) { // 修改页面保存 提交
	return request('/microservice/carmanager/editCarDemand',{...param, userid});
}
export function carsManager(param) { // 车管员名单
	return request('/microservice/carmanager/queryCarCustodian',{...param, userid});
}
// 服务1 查询 用车记录列表
export function carsHistory(param) {
    return request('/microservice/carmanager/queryCarDemandList',{...param, userid});
}
// 删除申请单
export function delApply(param) {
	return request('/microservice/carmanager/delCarDemand',{...param, userid}); 
}
// 申请单作废
export function invalidCarDemand(param) {
	return request('/microservice/carmanager/invalidCarDemand',{...param, userid}); 
}
export function applyDetail(param) { // 审批详情
	return request('/microservice/carmanager/queryDetail',{...param, userid});
}
//报告表格数据
export function reportTable(param) {
	return request('/microservice/carmanager/queryReportFormList',{...param, userid}); 
}
export function getReportNews(param) { // 展开统计报告信息
	return request('/microservice/carmanager/showReportForm',{...param, userid});
}
// 生成统计报告 
export function buildReport(param) {
	return request('/microservice/carmanager/generateReportForm',{...param, userid}); 
}
// 我的待办
export function todoList(param) {
	return request('/microservice/carmanager/querytoDoList',{...param, userid}); 
}
// 我的已办
export function doList(param) {
	return request('/microservice/carmanager/queryDoneList',{...param, userid}); 
}
// 审核页面数据
export function judgeData(param) {
	return request('/microservice/carmanager/queryDetail',{...param, userid}); 
}
//审批页面 通过/退回
export function reply(param) {
	return request('/microservice/carmanager/replyApproval',{...param, userid}); 
}
//审批数据申请单删除
export function delBathCarDemand(param) {
	return request('/microservice/carmanager/delBathCarDemand',{...param, userid}); 
}