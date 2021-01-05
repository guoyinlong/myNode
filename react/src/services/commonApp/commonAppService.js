/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页所用到的服务
 */
import request, {postJsonRequest} from '../../utils/request';
import Cookie from 'js-cookie';
// 待办服务：arg_mgr_id：本地存储中的userid
// export function backlogQuery({ arg_mgr_id }) {
//   return request('/microservice/timesheet/timesheet_search_t_proj_hours_mgr',{arg_mgr_id});
// }


//我的会议列表待办查询
export function myMeetingWait(param) {
  return request('/microservice/management_of_meetings/meetings_to_do_list_topic_undo_search',param);
}

//印章代办
export function mySealWait(param) {
  return request('/microservice/management_of_seal/seal_undo_list_search',param);
}

//印章已办
export function mySealComplete(param) {
  return request('/microservice/management_of_seal/seal_handled_list_search',param);
}

//印章办结
export function mySealDone(param) {
  return request('/microservice/management_of_seal/seal_completed_list_search',param);
}

//待办议题详情服务
export function waitDetailsService(param) {
  return request('/microservice/management_of_meetings/meetings_to_do_list_details_search',param);
}

//审批环节服务
export function judgeMoment(param) {
  return request('/microservice/management_of_meetings/meetings_topic_info_history_list_search',param);
}

//点击同意审批通过服务(旧的)
export function judgePassOld(param) {
  return request('/microservice/management_of_meetings/meetings_topic_approved',param);
}

//点击同意审批通过服务(旧的)
export function judgePassNew(param) {
  return request('/microservice/allmanagementofmeetings/newmeetings/NewTopicApproved',param);
}

//院长审核议题清单审核通过服务
export function pricedentAgreen(param) {
  return request('/microservice/allmanagementofmeetings/newmeetings/ManagerApproved',param);
}

//院长审核页面会议名称查询服务
export function meetingName(param) {
  return request('/microservice/management_of_meetings/meetings_note_order_search',param);
}

//院长审核议题清单查询服务
export function listSearch(param) {
  return request('/microservice/management_of_meetings/meetings_topic_office_submit_list_search',param);
}

//点击退回请求服务
export function judgeReturn(param) {
  return request('/microservice/management_of_meetings/meetings_topic_return',param);
}

//点击同意通过归档审核
export function filePass(param) {
  return request('/microservice/management_of_meetings/meetings_confirm_note_topic_file_approved',param);
}

//点击退回服务(归档)
export function fileRefuse(param) {
  return request('/microservice/management_of_meetings/meetings_confirm_note_topic_file_return', param);
}

//待办退回到申请人提交修改服务
export function submissionReset(param) {
  return request('/microservice/management_of_meetings/meetings_topic_info_update',param);
}

//通过议题查询会议名称
export function getMeetingName(param) {
  return request('/microservice/management_of_meetings/meetings_note_name_search',param);
}

//待办中界面无更改服务
export function noReset(param) {
  return request('/microservice/management_of_meetings/meetings_topic_no_change',param);
}

//申请人补充材料点击提交
export function fileSubmit(param) {
  return request('/microservice/management_of_meetings/meetings_topic_file_submit',param);
}

//我的会议列表已办查询meetings_to_do_list_handled_search
export function myMeetingDone(param) {
  return request('/microservice/management_of_meetings/meetings_to_do_list_topic_handled_search',param);
}

//我的会议列表办结查询meetings_to_do_list_completed_search
export function myMeetingFinish(param) {
  return request('/microservice/management_of_meetings/meetings_to_do_list_topic_completed_search',param);
}

// 获取工时管理模块的权限
export function fundingPlanQuery(param) {
  return request('/microservice/funding_plan/funds_budget_search_budget_count',param);
}
// 待办服务：arg_mgr_id：本地存储中的userid
export function backlogQuery({ arg_userid,arg_dept_id =  Cookie.get('dept_id')}) {
  return request('/microservice/timesheet/timesheet_search_staff_deal_with_pc',{arg_userid,arg_dept_id});
}
// 获取工时管理模块的权限
export function timeSheetList(param) {
  return request('/microservice/serviceauth/p_usermodulelist',param);
}
// 消息服务：arg_mess_staff_id_to：本地存储中的userid
export function messageQuery(param) {
  return request('/microservice/publicnotice/t_message_query',param);
}

// 资料下载：transjsonarray : {"sequence":[{"file_upload_date":"1"}]}
export function fileQuery(param) {
  // return request('/microservice/standardquery/project/t_file_mgt_query',param);
  return request('/allcommondocument/commondocument/viewFile',param);
}
// 根据文件id删除文件 lumj
export function deleteByFIleId(param) {
  return request('/allcommondocument/commondocument/deleteFile',param);
}
// 根据文件id查询文件 lumj
export function searchByFIleId(param) {
  return request('/allcommondocument/commondocument/viewOneFile',param);
}
// 更新下载数量
export function fileLoadNum(param) {
  return request('/microservice/transupdate/project/srcshare_filemgtupdate',param);
}
// 设为已读 arg_staff_id，arg_mess_id
export function messageReadFlag(param){
  return request('/microservice/publicnotice/t_message_read',param)
}
// 消息批量设为已读
export function messageReadBat(param){
  return request('/microservice/publicnotice/t_message_read_bat',param)
}
// 消息设为未读
export function messageNotRead(param){
  return request('/microservice/publicnotice/t_message_notread',param)
}
// 消息批量设为未读
export function messageNotReadBat(param){
  return request('/microservice/publicnotice/t_message_notread_bat',param)
}
// 删除消息
export function messageDelete(param){
  return request('/microservice/transupdate/publicnotice/t_message_delete',param)
}
// 公告列表查询
export function noticeInfoQuery(param){
  return request('/microservice/publicnotice/noticeinfoquery',param)
}
// 查询部门传值：argtenantid=10010
export function ouDeptQuery(param){
  return request('/microservice/userauth/deptquery',param)
}
//发布公告
export function noticeAdd(param){
  return request('/microservice/multitransopts/publicnotice/notice_all_update',param)
}
// 特定公告内容查询：包括公告信息和附件,参数为公告id
  // 公告信息查询
export function noticeCntQuery(param){
  return request('/microservice/standardquery/publicnotice/notice_info_query',param)
}
 // 公告附件查询
export function noticeFileQuery(param){
 return request('/microservice/standardquery/publicnotice/notice_info_filequery',param)
}
  // 公告可见部门查询
export function noticeDeptQuery(param){
 return request('/microservice/standardquery/publicnotice/notice_obv_query',param)
}

//公共创建服务： 查询有权限的角色id
export function getAnnounceUsersByRoleId(param){
  return request('/microservice/serviceauth/p_getusersbyroleid',param)
  //return request('/allcommondocument/commondocument/checkAdmin',param)
}

//培训资料上传服务： 查询有权限的用户id
export function getUsersByRoleId(param){
 return request('/allcommondocument/commondocument/checkAdmin',param)
}
// 添加文件新增上传文件服务
export function trainSrcAddFile(param){
 // return request('/microservice/transinsert/project/srcshare_uploadfile_add',param)
 return request('/allcommondocument/commondocument/addFile',param)
}
//获取文档分类类别 lumj14
export function getdocType(param){
 return request('/allcommondocument/commondocument/viewType',param)
}
//更改文档分类名称byname lumj14
export function editDocType(param){
 return request('/allcommondocument/commondocument/updateType2',param)
}
//更改文档名称和分类 lumj14
export function changeFileNameType(param){
 return request('/allcommondocument/commondocument/updateFile',param)
}
//下载lumj14
export function filedownload(param){
 return request('/allcommondocument/commondocument/download',param)
}
// 公告的点赞服务
export function noticeGiveThumbsup(param){
 return request('/microservice/publicnotice/notice_give_the_thumbs_up',param)
}
// 发布人查询自己发布的公告
export function noticeListByManager(param){
 return request('/microservice/publicnotice/notice_info_publisherquery_proc',param)
}
// 点赞数量查询
export function noticeThumbQuery(param){
 return request('/microservice/publicnotice/notice_query',param)
}
// 用户点击公告，进入公告详情时的阅读量的记录服务
export function readrecordInsert(param){
  return request('/microservice/publicnotice/notice_readrecord_insert',param)
}


/*
* 项目启动服务
*/
// 待办列表查询
export function taskListQuery(param){
  return request('/microservice/publicnotice/t_task_query',param)
}
// 已办列表查询
export function taskingListQuery(param){
  return request('/microservice/publicnotice/t_task_queryhandled',param)
}
// 办结列表查询
export function taskedListQuery(param){
  return request('/microservice/publicnotice/t_task_queryend',param)
}
// 待办详情查询
export function taskDetailQuery(param){
  return request('/microservice/project/project_t_proj_check_base_info_form_search',param)
}
//查询项目的基本信息
export function getProjInfoNew(param) {
  return request('/microservice/project/project_t_proj_check_base_info_form_search',param);
}
// 待办是否存在
export function taskIsChecked(param){
  return request('/microservice/publicnotice/t_task_if_ischecked',param)
}
// 待办是否全成本tab页显示
export function taskIsShowAllTab(param){
  return request('/microservice/project/project_t_proj_checked_finance_dept',param)
}
// 待办是否起草人
export function taskCheckUserRole(param){
  return request('/microservice/publicnotice/t_task_checkrole_projcreate',param)
}
// 待办是否财务
export function taskCheckUserFinance(param){
  return request('/microservice/project/project_check_common_is_finance_user',param)
}
// 审批流程判断
export function taskProcessQuery(param){
  return request('/microservice/project/project_t_proj_checked_finance_dept',param)
}
// 待办存在查询
export function taskStateQuery(param){
  return request('',param)
}
// 待办角色查询
export function taskTypeQuery(param){
  return request('',param)
}
// 待办里程碑查询
export function taskMilestoneQuery(param){
  return request('/microservice/project/project_t_proj_check_milestone_form_search',param)
}
//查询里程碑列表和总工作量
export function getMileStone(param) {
  return request('/microservice/project/project_t_proj_check_milestone_form_search',param);
}
//查询全成本PMS列表
export function getFullCostPmsData(param) {
    return request('/microservice/project/project_t_proj_add_check_cos_form_search',param);
}
// 待办全成本查询配合部门
export function taskDeptQuery(param){
  return request('/microservice/project/project_t_proj_check_dept_form_search',param)
}
// 待办全成本查询全部部门
export function taskAllDeptQuery(param){
  return request('/microservice/project/project_t_proj_check_budgetdept_search',param)
}
// 待办全成本查询成本信息
export function taskBudgetQuery(param){
  return request('/microservice/project/project_t_proj_check_budget_form_search',param)
}
// 待办附件查询
export function taskAttachmentQuery(param){
  return request('/microservice/project/project_t_proj_check_attachment_form_search',param)
}
// 待办日志查询
export function taskLogQuery(param){
  return request('/microservice/project/project_t_proj_check_log_search',param)
}
//项目启动新增时，查询已上传的附件列表
export function searchNewAddAttachment(param) {
  return request('/microservice/project/project_t_proj_check_attachment_form_search',param);
}
// 待办同意
export function taskApproval(param){
  return request('/microservice/allproject/project/ProjectInitiationProjectEstablishmentApproval',param)
}
// 待办退回
export function taskReturn(param){
  return request('/microservice/allproject/project/ProjectInitiationProjectEstablishmentReturn',param)
}
// 待办保存或者提交
export function taskSaveOrSubmit(param){
  return request('/microservice/allproject/project/ProjectInitiationProjectEstablishmentSaveOrSubmit',param)
}
//项目启动新增保存和提交服务
export function projAddSaveOrSubmit(param) {
  return request('/microservice/allproject/project/ProjectInitiationProjectEstablishmentSaveOrSubmit',param);
}
//查询主项目
export function getPrimaryProj(param) {
  return request('/microservice/project/common_get_primary_proj',param);
}
//查询项目类型
export function getProjType(param) {
  return request('/microservice/standardquery/project/t_proj_type_showall',param);
}
//查询uuid
export function getProjUuid(param) {
  return request('/microservice/project/project_t_proj_common_get_uuid',param);
}
//查询待办上一环节
export function getHeadInfo(param) {
  return request('/microservice/project/project_t_proj_check_head_info',param);
}

//团队管理审核待办
export function projSearchTeam(param) {
  return request('/microservice/newproject/teamManage/teamSearch/queryChange',param);
}
/*//团队管理审核已办
export function projSearchTeamHandle(param) {
  return request('/microservice/project/t_proj_searchteamhandle',param);
}
//团队管理审核办结
export function projSearchTeamEnd(param) {
  return request('/microservice/project/t_proj_searchteamend',param);
}*/
//团队管理查询任务详情
export function projTeamDetails(param) {
  return request('/microservice/newproject/teamManage/teamSearch/queryWorkDetail',param);
}

/*//团队管理查询任务历史
export function projTeamCheckHistory(param) {
  return request('/microservice/project/t_proj_searchteamcheckhistory',param);
}*/
//团队管理查询任务历史
export function projSeachList(param) {
  return request('/microservice/newproject/teamManage/teamHistorySearch/one',param);
}
//团队管理查询项目详情
export function projectInfo(param) {
    return postJsonRequest('/microservice/newproject/teamManage/teamSearch/list', param);
}
//团队管理审核通过
export function projTeamPass(param) {
    return request('/microservice/newproject/teamManage/teamCheckReview', param);
}
//团队管理审核退回
export function projTeamBack(param) {
    return request('/microservice/newproject/teamManage/teamCheckReview', param);
}

// 考核指标审核历史
export function checkHisquery(params) {
    return request('/microservice/standardquery/examine/projexam/checkhisquery',params);
}

// 合作伙伴待办
export function p_service_confirm_task_search(params) {
    return request('/microservice/purchase/p_service_confirm_task_search',params);
}
// 合作伙伴已办
export function p_service_confirm_task_searchhandled(params) {
    return request('/microservice/purchase/p_service_confirm_task_searchhandled',params);
}
// 合作伙伴办结
export function p_service_confirm_task_searchend(params) {
    return request('/microservice/purchase/p_service_confirm_task_searchend',params);
}
// 用户身份查询
export function p_if_isout(params) {
    return request('/microservice/serviceauth/p_if_isout',params);
}

// 合作伙伴待办详情
export function p_service_confirm_search_taskdetails(params) {
    return request('/microservice/purchase/p_service_confirm_search_taskdetails',params);
}

// 查询服务评分标准
export function p_service_standarts_search(params) {
    return request('/microservice/purchase/p_service_standarts_search',params);
}

// 合作伙伴查询审核历史
export function p_service_confirm_search_history(params) {
    return request('/microservice/purchase/p_service_confirm_search_history',params);
}

// 合作伙伴审核通过
export function p_service_confirm_pass(params) {
    return request('/microservice/purchase/p_service_confirm_pass',params);
}
// 合作伙伴审核退回
export function p_service_confirm_back(params) {
    return request('/microservice/purchase/p_service_confirm_back',params);
}
// 合作伙伴查询登录人角色
export function p_purchase_getroles(params) {
    return request('/microservice/serviceauth/p_purchase_getroles',params);
}

// 确认所有合作伙伴是否已审核
export function p_service_confirm_partnersum(params) {
    return request('/microservice/purchase/p_service_confirm_partnersum',params);
}

// 项目经理提交后待办处理
export function p_service_confirm_search_aftercommit(params) {
    return request('/microservice/purchase/p_service_confirm_search_aftercommit',params);
}

// 项目经理提交评分
export function ServiceAddBatServlet(params) {
    return request('/microservice/allpurchase/purchase/ServiceAddBatServlet',params);
}

// 加班待办查询
export function overtimeUndoTask_Query(params) {
  return request('/microservice/overtime/overtime_approval_undo_query',params);
}

//首页离职查询待办
export function leaveUndoTask_Query(param){
  return request('/microservice/labor/leave_undo_approval_query',param);
}

//首页培训查询待办
export function trainUndoTask_Query(param){
  return request('/microservice/train/train_approval_undo_query',param);
}

// 流转消息列表查询
export function circulationNoticeInfoQuery(param){
  return request('/microservice/overtime/circulation_notice_info_query',param)
}

// 流转消息已读
export function circulationNoticeRead(param){
  return request('/microservice/overtime/circulation_notice_read_operation',param)
}

//干部管理-待评议列表查询
export function apprasieUndoListQuery(param){
  return request('/microservice/appraise/appraise_comment_approval_undo_query',param);
}

//首页请假查询待办
export function absenceUndoTask_Query(param){
  return request('/microservice/absence/absence_approval_undo_query_proc',param);
}

//首页节日祝福查询
export function festivalquery(param){
  return request('/microservice/allencouragement/encouragement/service/staffdayreminder',param);
}

//首页节日不再提醒查询
export function needTips(param){
  return request('/microservice/allencouragement/encouragement/service/staffdaynoreminder',param);
}

//首页请假查询待办慰问
export function laborSympathyUndoTask_Query(param){
  return request('/microservice/sympathy/sympathy_approval_undo_query_proc',param);
}
//首页考勤管理待办
export function attendUndoTask_Query(param){
  return request('/microservice/worktime/worktime_approval_undo_query',param);
}
 //新闻宣传管理--待办列表
 export function showTodoApprovalList(param) {
  return request('/microservice/newsmanager/workflow/showTodoApprovalList', param);
}
