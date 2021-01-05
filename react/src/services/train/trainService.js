/**
 * 文件说明：培训管理服务
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-09
 * */
import request from '../../utils/request';

//用户角色查询：总院人力接口人、分院人力接口人、部门接口人
export function trainUserRoleQuery(param) {
  return request('/microservice/train/train_user_role_query', param);
}

//创建时查询下一环节处理人信息
export function nextPersonListStartQuery(param) {
  return request('/microservice/train/train_submit_next_person_query', param);
}

//培训计划信息查询，apply_type:全院级：1；分院级：2；外聘内训/外训：3；内训：4；认证计划：5
export function centerClassCompulsoryQuery(param) {
  return request('/microservice/train/train_center_class_apply_query', param);
}

//保存培训计划信息
export function trainPlanSave(param) {
  return request('/microservice/train/train_plan_save_info_save', param);
}

//培训计划工作流启动
export function trainClasscenterStatsFlowStart(param) {
  return request('/microservice/workflownew/wfservice/begin?businessId=' + param.start_type + '&tenantCode=humanwork', param);
}

//工作流流程关闭服务
export function trainFlowTerminate(param) {
  console.log('param.procInstId : ' + param.procInstId);
  let url = "/microservice/workflownew/wfservice/terminate?procInstId=" + param.procInstId + "&tenantCode=humanwork";
  return request(url, param);
}

//工作流完成第一个节点
export function trainFlowComplete(param) {
  let url = "/microservice/workflownew/wfservice/complete?tenantCode=humanwork";
  return request(url, param);
}

//全院培训课程信息校验
export function trainCenterClassCheck(param) {
  return request('/microservice/train/train_center_class_info_check', param);
}

//全院培训课程信息删除
export function trainClassDeleteSave(param) {
  return request('/microservice/train/train_center_class_info_delete', param);
}

//全院培训课程信息保存（必修）
export function trainCenterClassSaveCompulsory(param) {
  return request('/microservice/train/train_center_class_info_save', param);
}

//全院培训课程信息保存（选修）
export function trainCenterClassSaveElective(param) {
  return request('/microservice/train/train_center_class_info_save_elective', param);
}

//分院、部门培训课程信息保存
export function trainBranchAndDeptClassSave(param) {
  return request('/microservice/train/train_branch_dept_class_info_save', param);
}

//认证考试计划课程信息保存
export function trainCertificationClassSave(param) {
  return request('/microservice/train/train_certification_class_info_save', param);
}

//培训审批信息保存
export function trainCenterClassApprovalSave(param) {
  return request('/microservice/train/train_approval_info_save', param);
}

//培训审批附件
export function trainFileListQuery(param) {
  return request('/microservice/train/train_file_list_query', param);
}

//培训查询待办
export function trainApprovalQuery(param) {
  return request('/microservice/train/train_approval_query', param);
}

/**2019.7.15 条件查询培训计划列表 */
export function trainPlanListQuery(param) {
  return request('/microservice/train/train_planlist_query', param);
}

/**2019.7.17 晚 查询员工是否是人力专员还是部门接口人 */
export function trainCheckRole(param) {
  return request('/microservice/train/train_check_role', param);
}

//全院计划查询（必修、选修）—落地使用
export function centerClassQuery(param) {
  return request('/microservice/train/train_center_class_query', param);
}

//落地部门查询使用
export function courtDeptQuery(param) {
  return request('/microservice/train/train_court_dept_query', param);
}

//全院级、通用课程
export function trainClassResolutionSave(param) {
  return request('/microservice/train/train_class_resolution_query', param);
}

//全院级、通用课程培训费用落地
export function trainClassResolutionTrainFeeSave(param) {
  return request('/microservice/train/train_class_resolution_train_fee_save', param);
}


//培训计划信息查询，apply_type:全院级：1；分院级必修：2；分院级选修：3；通用：4；认证计划：
export function applyCenterClassQuery(param) {
  return request('/microservice/train/train_center_class_apply_query', param);
}

//培训计划查询审批信息
export function applyApprovalQuery(param) {
  return request('/microservice/train/train_apply_approval_query', param);
}

//培训计划工作流启动
export function trainPlanFlowStart(param) {
  return request('/microservice/workflownew/wfservice/begin?businessId=' + param.beginbusinessId + '&tenantCode=humanwork', param);
}
//培训计划工作流流转
export function trainPlanFlowComplete(param) {
  return request('/microservice/workflownew/wfservice/complete?taskId=' + param.completetaskId + '&tenantCode=humanwork', param);
}
//工作流流程关闭服务
export function trainPlanFlowTerminate(param) {
  return request("/microservice/workflownew/wfservice/terminate?procInstId=" + param.terminateprocInstId + "&tenantCode=humanwork", param);
}


//查询下一环节处理人信息
export function submitPersonListQuery(param) {
  return request('/microservice/train/submit_Next_Person_Query', param);
}

//修改课程状态为失效
export function updatePlanClass(param) {
  return request('/microservice/train/update_plan_class_update', param);
}
//修改课程提交
export function submitTrainPlanUpdate(param) {
  return request('/microservice/train/submit_train_plan_update', param);
}
//培训计划信息删除
export function trainPlanDelete(param) {
  return request('/microservice/train/submit_train_plan_delete', param);
}

//新增课程提交
export function trainClassPlanAdd(param) {
  return request('/microservice/train/train_class_add_plan_submit', param);
}

/**2019.7.19 新增院部门信息查询 */
export function trainDeptInfoQuery(param) {
  return request('/microservice/train/dept_info_query', param);
}

//回滚新增课程审批表信息
export function trainPlanAddDelete(param) {
  return request('/microservice/train/train_class_plan_add_delete', param);
}

//全院级通用核心课程查询
export function trainCommonClassQuery(param) {
  return request('/microservice/train/train_import_class_query', param);
}

//全院级通用核心课程查询:人员导入
export function importCommonClassPerson(param) {
  return request('/microservice/train/train_import_person', param);
}
export function trainPlanApprovalOperate(param) {
  return request('/microservice/train/train_plan_approval_operate', param);
}

//待办删除
export function deleteApproval(param) {
  return request('/microservice/train/delete_Approval_Del', param);
}
//培训课程申请工作流开始
export function trainApplyFlowStart(param) {
  return request('/microservice/workflownew/wfservice/begin?businessId=' + param.beginbusinessId + '&tenantCode=humanwork', param);
}

//培训课程申请工作流流程关闭服务
export function trainApplyFlowTerminate(param) {
  return request("/microservice/workflownew/wfservice/terminate?procInstId=" + param.terminateprocInstId + "&tenantCode=humanwork", param);
}

//培训课程申请提交(计划内)
export function submitTrainClassApply(param) {
  return request('/microservice/train/train_class_apply_submit', param);
}
//培训课程申请提交（计划外）
export function submitTrainOutPlanClassApply(param) {
  return request('/microservice/train/train_class_out_of_plan_apply_submit', param);
}

//培训课程申请提交（计划外）人员提交
export function submitTrainOutPlanClassPersonalApply(param) {
  return request('/microservice/train/train_class_out_of_plan_apply_personal_submit', param);
}

//培训课程申请删除（回滚）
export function trainClassApplyDelete(param) {
  return request('/microservice/train/train_class_apply_delete', param);
}

//培训申请审批意见查询
export function trainClassApplyApprovalListQuery(param) {
  return request('/microservice/train/train_class_apply_approval_list_query', param);
}

//培训申请审批提交
export function trainClassApplyApprovalOperate(param) {
  return request('/microservice/train/train_class_apply_approval_operate', param);
}
export function trainClassApplyApprovalOperate2(param) {
  return request('/microservice/train/train_class_apply_approval_operate2', param);
}
//查询待办是否一条
export function trainApprovalCheckQuery(param) {
  return request('/microservice/train/train_approval_check_query', param);
}

export function queryPersonList(param) {
  return request('/microservice/train/hr_person_list_query', param);
}

//培训申请查询课程
export function classInfoQuery(param) {
  return request('/microservice/train/train_class_query_for_user', param);
}

//培训新增部门查询
export function deptDataQuery(param) {
  return request('/microservice/train/train_class_add_query_dept', param);
}

//培训新增岗位查询
export function postDataQuery(param) {
  return request('/microservice/train/train_class_add_query_post', param);
}


//导入人岗，查询OU
export function getOuList(param) {
  return request('/microservice/serviceauth/ps_get_ou', param);
}

//导入人岗，查询岗位
export function getPostList(param) {
  return request('/microservice/train/train_post_query', param);
}

//查询岗位
export function getAllPostList(param) {
  return request('/microservice/train/train_staff_post_query', param);
}

//人岗信息批量写入数据库
export function trainPersonPostImportSubmit(param) {
  return request('/microservice/train/train_staff_post_submit', param);
}

//人岗信息批量写入数据库，数据库回退
export function deleteTrainPersonPostImportSubmit(param) {
  return request('/microservice/train/train_staff_post_submit_delete', param);
}

//导入培训课程成绩（计划外，人员检查）
export function importClassGradeCheckPersonInfo(param) {
  return request('/microservice/train/train_class_personal_info_check', param);
}

//提交培训课程成绩
export function importPersonClassGradeSubmit(param) {
  return request('/microservice/train/train_class_personal_grade_submit', param);
}

//培训统计sql查询列表
export function trainQuerySqlList(param) {
  return request('/microservice/train/train_query_sql_list', param);
}
//培训统计sql语句查询
export function trainQuerySqlQuery(param) {
  return request('/microservice/train/train_query_sql_query', param);
}
//培训统计表头查询
export function trainQueryTitleQuery(param) {
  return request('/microservice/train/train_query_sql_title', param);
}
//培训统计sql语句执行
export function trainQuerySqlExecute(param) {
  return request('/microservice/train/train_query_sql_execute', param);
}

//线上培训认证考试导入下一环节人员查询
export function onlineAndExamImportNextPersonQuery(param) {
  return request('/microservice/train/train_online_and_exam_import_next_person', param);
}

//线上培训认证考试提交
export function trainExamAndOnlineGradeSubmit(param) {
  return request('/microservice/train/train_exam_and_online_import_operation', param);
}

//线上培训认证考试提交
export function trainExamAndOnlineGradeDelete(param) {
  return request('/microservice/train/train_exam_and_online_import_delete_operation', param);
}

//线上培训认证考试审批提交
export function trainExamAndOnlineGradeApproval(param) {
  return request('/microservice/train/train_exam_and_online_import_approval_operation', param);
}

//线上培训认证考试成绩查询
export function trainExamAndOnlineDateQuery(param) {
  return request('/microservice/train/train_exam_and_online_import_grade_query', param);
}

//线上培训认证考试审批意见查询
export function trainExamAndOnlineApprovalDataQuery(param) {
  return request('/microservice/train/train_exam_and_online_import_approval_data_query', param);
}

//线上培训认证考试审批附件查询
export function examAndOnlineFileListQuery(param) {
  return request('/microservice/train/train_file_list_check_query', param);
}

//线上培训认证考试审批提交
export function trainExamAndOnlineGradeApprovalSubmit(param) {
  return request('/microservice/train/train_exam_and_online_import_approval_submit', param);
}

//培训申请参加人员信息查询
export function trainClassApplyPersons(param) {
  return request('/microservice/train/train_apply_persons_query', param);
}

//培训申请附件信息查询
export function trainClassFileListQuery(param) {
  return request('/microservice/train/train_apply_file_query', param);
}

//培训审批，显示人员成绩
export function trainClassApplyApprovalPersonGradeQuery(param) {
  return request('/microservice/train/train_show_apply_approval_person_grade_query', param);
}

//培训审批，显示培训老师
export function trainClassApplyApprovalTeacherQuery(param) {
  return request('/microservice/train/train_show_apply_approval_teacher_query', param);
}

//人力培训接口人查询本院人员课程完成详情
export function trainPersonalInfoQuery(param) {
  return request('/microservice/train/train_personal_info_query', param);
}

//培训申请-提交内训师名单
export function trainApplyTeacherSubmitInternal(param) {
  return request('/microservice/train/train_apply_teacher_submit_internal', param);
}

//培训申请-确认内训师是否全是本院
export function trainApplyTeacherOu(param) {
  return request('/microservice/train/train_apply_teacher_ou', param);
}

//培训申请-查询下一环节处理人（本部门）
export function trainApprovalNextPerson(param) {
  return request('/microservice/train/train_approval_next_person', param);
}
//培训申请-添加老师评估结果
export function trainTeacherGrade(param) {
  return request('/microservice/train/train_teacher_grade_update', param);
}
//培训审批-计划外课程详情
export function trainClassOutInfo(param) {
  return request('/microservice/train/train_approval_out_class_info', param);
}

//培训班基本信息提交
export function trainCourseClassApplyBasicSubmit(param) {
  return request('/microservice/train/train_course_apply_basic_submit', param);
}

//培训班子课程提交
export function trainCourseApplyClassInfoSubmit(param) {
  return request('/microservice/train/train_course_apply_class_info_submit', param);
}

//培训班子课程培训师查询
export function trainCourseClassApplyApprovalTeacherQuery(param) {
  return request('/microservice/train/train_course_class_teacher_query', param);
}

//培训执行附件上传
export function trainClassExecFileSubmit(param) {
  return request('/microservice/train/train_class_exec_file_submit', param);
}


//培训个人信息查询-年度计划
export function trainQueryYearInfo(param) {
  return request('/microservice/train/train_query_year_info', param);
}

//培训个人信息查询-个人信息
export function trainQueryPersonalInfo(param) {
  return request('/microservice/train/train_query_personal_info', param);
}

//培训个人信息查询-可以学习信息
export function trainQueryLearnInfo(param) {
  return request('/microservice/train/train_query_learn_info', param);
}

//培训-人员岗位信息更新
export function updateTrainPersonPostImportSubmit(param) {
  return request('/microservice/train/train_staff_post_update', param);
}

//培训任务设定查询
export function trainManagementQuery(param) {
  return request('/microservice/train/train_settings_query', param);
}
//培训任务设定
export function trainManagementSettings(param) {
  return request('/microservice/train/train_settings_update', param);
}
//培训班子课程信息查询-审批-查看
export function trainCourseClassInfoQuery(param) {
  return request('/microservice/train/train_course_class_info_query', param);
}
//培训特殊人群新增
export function trainSpecialPersonalSubmit(param) {
  return request('/microservice/train/train_special_personal_submit', param);
}
//培训特殊人群查询
export function trainSpecialPersonalQuery(param) {
  return request('/microservice/train/train_special_personal_query', param);
}
//培训特殊人群删除
export function trainSpecialPersonalDel(param) {
  return request('/microservice/train/train_special_personal_del', param);
}
//查询特殊人群类型
export function getGroupList(param) {
  return request('/microservice/train/train_settings_group_query', param);
}
//认证考试批量导入保存
export function certificationListSave(param) {
  return request('/microservice/train/train_certification_list_save_proc', param);
}
//认证考试查询列表
export function certificationList(param) {
  return request('/microservice/train/train_certification_list_query_proc', param);
}

//批量导入成绩信息
export function importTrainGradeList(param) {
  return request('/microservice/transinsert/train/import_train_grade_list', param);
}
//批量线上培训认证考试信息
export function importExamOnlineList(param) {
  return request('/microservice/transinsert/train/import_exam_online_list', param);
}
//批量导入成绩信息后修改
export function updateTrainGradeList(param) {
  return request('/microservice/train/update_train_grade_list_proc', param);
}
//删除批量导入成绩信息
export function deleteTrainGradeList(param) {
  return request('/microservice/train/delete_train_grade_list_proc', param);
}
// 我的小目标保存
export function goalListlInfoSave(param) {
  return request('/microservice/train/trian_my_target_save', param);
}
// 我的小目标查询
export function goalListlInfoQuery(param) {
  return request('/microservice/train/trian_my_target_query', param);
}
// 培训对象名称查询
export function trainGroupNameQuery(param) {
  return request('/microservice/train/train_import_group_name_query', param);
}
// 核心课培训对象选择
export function updateGroupInfo(param) {
  return request('/microservice/train/train_import_group_and_class', param);
}
