/**
 * 作者：窦阳春
 * 创建日期： 2019-9-28
 * 邮箱: douyc@itnova.com.cn
 * 功能： 印章证照管理接口服务
 */
import request from '../../utils/request';
// 用印审核查询
export function sealChecking(param) {
    return request('/microservice/management_of_seal/seal_manager_list_search',param);
}
// 申请单作废
export function SealFormCancel (param){
	return request('/microservice/allmanagementofseal/sealOfUse/SealFormCancel', param)
}
// 申请单作废
export function sealFormRecall (param){
	return request('/microservice/allmanagementofseal/sealOfUse/FormRecall', param)
}
// 确认领取
export function confirmReceive (param) {
	return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/receiveConfirm', param)
}
// 确认归还 
export function recturnConfirm (param) {
	return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/recturnConfirm', param)
}
// 领取人查询
export function receiverQuery (param) {
	return request('/microservice/management_of_seal/seal_all_user_search', param)
}
// 文件上传
export function sealFileUpload (param) {
	return request('/microservice/management_of_seal/seal_upload_add', param)
}
// 个人查询印章证照类别查询服务 （一级）
export function sealFirstCategoryQuery(param) {
    return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/sealFirstCategoryQuery', param);
}
// 个人查询印章证照名称查询服务 （二级）
export function sealSecondCategoryQuery(param) {
    return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/sealSecondCategoryQuery', param);
}
// 管理员查询页面 发送通知 
export function SendEmailInfo(param) {
	return request('/microservice/allmanagementofseal/sealOfUse/SendEmailInfo', param);
}
// 个人查询用印申请列表查询
export function sealPersonalSearch(param) {
	return request('/microservice/management_of_seal/sealPersonalSearch', param);
  }
// 特殊事项审核人员配置之查询
export function specialListSearch(param) {
	return request('/microservice/management_of_seal/seal_special_list_search', param)
}
// 特殊事项审核人员配置之删除
export function specialListDelete(param) {
	return request('/microservice/management_of_seal/seal_special_delete', param)
}
// 特殊事项审核人员配置之修改
export function specialListUpdate(param) {
	return request('/microservice/management_of_seal/seal_special_update', param)
}
// 特殊事项审核人员配置之新增(新增界面)
export function specialListAdd(param) {
	return request('/microservice/management_of_seal/seal_special_add', param)
}
// 营业执照原件外借 申请单下载
export function businessLicenseBorrowWord(param) {
	return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/ExportSealWord/businessLicenseBorrowWord', param)
}
// 领导名章外借 申请单下载
export function LeaderSealBorrowWord(param) {
	return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/ExportSealWord/LeaderSealBorrowWord', param)
}
// 公章外借 申请单下载
export function OfficialSealWord(param) {
	return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/ExportSealWord/OfficialSealWord', param)
}
// 刻章 申请单下载
export function carveWord(param) {
	return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/ExportSealWord/carveWord', param)
}
// 印章使用 申请单下载
export function UseSealWord(param) {
	return request('/microservice/allmanagementofseal/sealOfUse/UseSealWord', param)
}
// 院领导名章使用 申请单下载
export function LeaderSealWord(param) {
	return request('/microservice/allmanagementofseal/sealOfUse/LeaderSealWord', param)
}
// 营业执照复印件使用 申请单下载
export function PermitWord(param) {
	return request('/microservice/allmanagementofseal/sealOfUse/PermitWord', param)
}
// 院领导身份证 申请单下载
export function LeaderCardWord(param) {
	return request('/microservice/allmanagementofseal/sealOfUse/LeaderCardWord', param)
}