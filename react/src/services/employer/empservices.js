/**
 * 文件说明：个人考核相关服务
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-15
 */
import request from '../../utils/request';
//部门负责人负责部门信息查询
export function ouFetch({ arg_tenantid,arg_user_id }) {
  return request('/microservice/examine/deptprincipalquery',{arg_tenantid,arg_user_id});
}
//员工类别信息查询
export function empclassquery(params) {
  return request('/microservice/examine/empclassquery',params);
}
//更新员工类别
export function update_persion_type(params) {
  return request('/microservice/transupdate/serviceauth/update_persion_type',params);
}
//查询员工历史考核结果
export function empScoreNotSubmitSearch({arg_cur_year,arg_cur_season,arg_staff_id}) {
  return request('/microservice/examine/empscore_query_proc',{arg_cur_year,arg_cur_season,arg_staff_id});
}
//判断员工是否可以新增指标
export function judgeKpiAdded({year,season,staff_id,time}) {
  return request('/microservice/examine/checkinfo_proc',{year,season,staff_id,time});
}
//员工类别信息查询
export function empInfoSearch({arg_ou_id,arg_dept_id,arg_staff_id,arg_staff_name,arg_emp_type,arg_tenant_id}) {
  return request('/microservice/examine/empclassquery',{arg_ou_id,arg_dept_id,arg_staff_id,arg_staff_name,arg_emp_type,arg_tenant_id});
}
//审核人信息查询
export function empLeaderCheckerSearch({arg_roleid,arg_flag,arg_deptname}) {
  return request('/microservice/serviceauth/p_getusersbyroleid',{arg_roleid,arg_flag,arg_deptname});
}
//员工参与项目信息查询
export function empProjSearch({arg_staff_id}) {
  return request('/microservice/project/tptptselproc',{arg_staff_id});
}
// 员工已填写考核指标项目查询
export function empHrProjSearch(parms) {
  return request('/microservice/examine/empkpiproj',parms);
}
//项目经理负责主责项目信息查询
export function pmProjSearch({arg_mgr_id}) {
  return request('/microservice/allexamine/examine/pmprojinfoquery',{arg_mgr_id});
}
//考核指标类别信息查询
export function empWordbookSearch(params) {
  return request('/microservice/standardquery/examine/wordbookquery',params);
}
//固定指标信息查询
export function empFixedKpiSearch(params) {
  return request('/microservice/standardquery/examine/empfixedkpiquery',params);
}
//t_emp_kpi表查询
export function empKpiSearch(params) {
  return request('/microservice/standardquery/examine/empkpiquery',params);
}
//保存指标
export function empKpiSave(params) {
  return request('/microservice/allexamine/examine/tempkpisave',params);
}
//提交新增指标
export function empKpiSubmit({flag,year,season,staff_id,proj_id,t_emp_kpi,t_emp_score}) {
  return request('/microservice/allexamine/examine/tempnew',{flag,year,season,staff_id,proj_id,t_emp_kpi,t_emp_score});
}
//t_emp_score表查询
export function empScoreSearch(params) {
  return request('/microservice/standardquery/examine/empscorequery',params);
}
//文件上传
export function fileUpload(params) {
  return request('/filemanage/fileupload',params);
}
//t_emp_kpi表更新
export function empKpiUpdate(params) {
  return request('/microservice/transupdate/examine/tempkpiupdate',params);
}
//项目绩效指标文件解析
export function projKpiFileAnalyze({xlsfilepath}) {
  return request('/microservice/allexamine/examine/LeaderProjKpiPreview',{xlsfilepath});
}
//综合绩效指标文件解析
export function compKpiFileAnalyze({xlsfilepath}) {
  return request('/microservice/allexamine/examine/LeaderSynKpiPreview',{xlsfilepath});
}
//项目经理查询项目成员考核结果
export function pmEmpScoresSearch({arg_mgr_id,arg_year,arg_season,arg_tenantid}) {
  return request('/microservice/allexamine/examine/pmteamscorequery',{arg_mgr_id,arg_year,arg_season,arg_tenantid});
}
//t_emp_score表更新
export function empScoresUpdate(params) {
  return request('/microservice/transupdate/examine/tempscoreupdatebat',params);
}
//项目经理提交项目成员正态分布结果  XXX
export function pmEmpDistSubmit({arg_year,arg_season,arg_proj_id,arg_checker_id,arg_checker_name,rank,ratio}) {
  return request('/microservice/allexamine/examine/pmempdistributenew',{arg_year,arg_season,arg_proj_id,arg_checker_id,arg_checker_name,rank,ratio});
}
//分院副院长查询项目经理考核结果
export function psPMScoreSearch({arg_year,arg_season,arg_ou}) {
  return request('/microservice/examine/oupmopeghscorequery',{arg_year,arg_season,arg_ou});
}
//部门评级比例、余数信息查询
export function deptRankRatioSearch(params) {
  return request('/microservice/standardquery/examine/distremainquery',params);
}
//分院副院长提交 项目经理+运营部小组长 正态分布结果
export function psPMDistSubmit({arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio}) {
  return request('/microservice/allexamine/examine/PdmEmpDistribute',{arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio});
}
//分院院长提交 部门负责人 正态分布结果
//部门经理提交 综合绩效员工 正态分布结果
/*export function dmCompEmpDistSubmit({arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio}) {
  return request('/microservice/allexamine/examine/dmcompdistribute',{arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio});
}*/
export function dmCompEmpDistSubmit({arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio}) {
  return request('/microservice/allexamine/examine/dmcompdistributenew',{arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio});
}
//部门经理提交 项目经理 正态分布结果  XXX
export function dmPMDistSubmit({arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio}) {
  return request('/microservice/allexamine/examine/PmNormalDistribution',{arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio});
}
//部门经理提交 全部员工 正态分布结果
/*export function dmAllEmpDistSubmit({arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio}) {
  return request('/microservice/allexamine/examine/dmempdistribute',{arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio});
}*/
export function dmAllEmpDistSubmit({arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio}) {
  return request('/microservice/allexamine/examine/annualempdistribute',{arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio});
}
//new add 全体纪委
export function allCommissionDistributeNew({arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio}) {
  return request('/microservice/allexamine/examine/allcommissiondistributenew',{arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio});
}

export function comMissionDistributeNew({arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio}) {
  return request('/microservice/allexamine/examine/commissiondistributenew',{arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio});
}
// 7
export function branchcoredistributepostbybranch({arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio}) {
  return request('/microservice/allexamine/examine/branchcoredistributepostbybranch',{arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio});
}



//事业部垂直管理的核心岗
export function dmBranchPMDistSubmit({arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio}) {
  return request('/microservice/allexamine/examine/branchcorepostdistribute',{arg_year,arg_season,arg_dept_name,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio});
}
//小组信息查询
export function groupInfoSearch(params) {
  return request('/microservice/standardquery/examine/groupquery',params);
}
//小组长查询小组成员考核结果
export function groupEmpScoreSearch({arg_year,arg_season,arg_checker_id}) {
  return request('/microservice/examine/groupempscorequery',{arg_year,arg_season,arg_checker_id});
}
//小组评价比例、余数信息查询
export function groupRankRatioSearch(params) {
  return request('/microservice/standardquery/examine/grouprankquery',params);
}
//小组长提交小组成员正态分布结果
export function groupEmpDistSubmit({arg_year,arg_season,arg_group_id,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio}) {
  return request('/microservice/allexamine/examine/GroupEmpDistribute',{arg_year,arg_season,arg_group_id,arg_type,arg_checker_id,arg_checker_name,arg_rank_count,rank,ratio});
}
//部门负责人负责部门信息查询
export function manageDeptSearch({arg_user_id,arg_tenantid}) {
  return request('/microservice/examine/deptprincipalquery',{arg_user_id,arg_tenantid});
}
//部门负责人查询部门内综合绩效员工考核结果
export function deptCompEmpScoreSearch({arg_year,arg_season,arg_checker_id,arg_dept_name}) {
  return request('/microservice/allexamine/examine/dmempcompperf',{arg_year,arg_season,arg_checker_id,arg_dept_name});
}
//部门负责人查询项目绩效员工考核结果
export function deptProjEmpScoreSearch({arg_year,arg_season,arg_dept_id,arg_dept_name,arg_tenantid,arg_emp_type}) {
  return request('/microservice/allexamine/examine/dmempdeptperf',{arg_year,arg_season,arg_dept_id,arg_dept_name,arg_tenantid,arg_emp_type});
}
//部门负责人查询部门内项目经理考核结果
export function deptPMScoreSearch({arg_year,arg_season,arg_dept_id,arg_dept_name,arg_post_name,arg_tenantid}) {
  return request('/microservice/examine/deptpmdistquery',{arg_year,arg_season,arg_dept_id,arg_dept_name,arg_post_name,arg_tenantid});
}
//部门负责人查询部门内全部员工(员工、项目经理、小组长)考核结果
export function deptAllEmpScoreSearch({arg_year,arg_season,arg_dept_name,arg_tenantid}) {
  return request('/microservice/allexamine/examine/dmempallperf',{arg_year,arg_season,arg_dept_name,arg_tenantid});
}
/*//部门负责人查询部门内全部员工(根据职位)考核结果--一次
export function deptAllEmpByTypeScoreSearch({arg_year,arg_season,arg_dept_name,arg_emp_type,arg_score_type}) {
  return request('/microservice/examine/deptbyemptypequery',{arg_year,arg_season,arg_dept_name,arg_emp_type,arg_score_type});
}*/
//部门负责人查询部门内全部员工(根据职位)考核结果--二次
export function branchDeptOnlyEmpScoreSearch({arg_year,arg_season,arg_dept_name}) {
  return request('/microservice/examine/branchopeempquery',{arg_year,arg_season,arg_dept_name});
}
//查询部门经理/副经理待分布tab项
export function deptTabSearch({arg_year,arg_season,arg_managerId}) {
  return request('/microservice/allexamine/examine/configure/distributetabget',{arg_year,arg_season,arg_managerId});
}
//查询tab项待分布员工考核成绩
export function tabEmpScoreSearch({arg_tabId,arg_flag,arg_param}) {
  return request('/microservice/allexamine/examine/configure/distributetransfer',{arg_tabId,arg_flag,arg_param});
}
//查询待分布群体
export function toDistGroupSearch(params) {
  return request('/microservice/standardquery/examine/todistgroupquery',params);
}
//查询部门分布群体
export function deptDistGroupSearch({arg_year,arg_season,arg_dept_name}) {
  return request('/microservice/examine/deptdistgroupquery',{arg_year,arg_season,arg_dept_name});
}
//部门tab页批量操作
export function deptTabTransOpts(params) {
  return request('/microservice/transopts/examine/depttabtransopts',params);
}
//查询年度考核状态
export function annualStateSearch({arg_year}) {
  return request('/microservice/examine/annualstatequery',{arg_year});
}
//开启考核
export function annualStart({arg_year}) {
  return request('/microservice/examine/initannualassessment',{arg_year});
}
//查询员工互评状态
export function mutualEvalStateSearch({arg_year,arg_evalsys_type}) {
  return request('/microservice/eval/anonymousaccountlist',{arg_year,arg_evalsys_type});
}
// //开启员工互评，生成匿名账号
// export function mutualEvalStart({arg_year,arg_evalsys_type}) {
//   return request('/microservice/eval/initaccount',{arg_year,arg_evalsys_type});
// }

//开启员工互评，生成匿名账号（2）
export function mutualEvalStart({arg_year,arg_evalsys_type}) {
  return request('/microservice/allexamine/leaderexam/leaderanonymousaccountinit',{arg_year,arg_evalsys_type});
}

//计算员工互评成绩
export function mutualEvalResultCompute({arg_year,arg_type}) {
  return request('/microservice/eval/staffevalfinalscorecalc',{arg_year,arg_type});
}
//计算中层三度评价成绩
// export function leaderMutualEvalResultCompute({arg_year}) {
//   return request('/microservice/allexamine/leaderexam/leadersysevaluation',{arg_year});
// }
//关闭中层互评
export function leaderMutualEvalResultCompute({arg_year}) {
  return request('/microservice/leader/leaderevalclose',{arg_year});
}
//项目经理查询成员年度考核成绩
export function teamAnnualResultSearch({arg_year,arg_proj_id}) {
  return request('/microservice/examine/pmqueryyearscore',{arg_year,arg_proj_id});
}
//项目经理负责主责/配合项目信息查询
export function pmAllProjSearch({arg_userid}) {
  return request('/microservice/project/project_proj_del_pm_get_proj',{arg_userid});
}
//指标未审核前撤销指标
export function empKpiRevocation({arg_year,arg_season,arg_staff_id}) {
  return request('/microservice/examine/empkpifillwithdraw',{arg_year,arg_season,arg_staff_id});
}
//查询已经填工时的项目
export function hasTimeProjSearch(params) {
  return request('/microservice/timesheet/timesheet_examine_season_project',params);
}
//查询部门员工所参与的项目
export function deptStaffProjSearch(params) {
  return request('/microservice/examine/dmqueryprojrank',params);
}
// 一键继承
export function copyLastSeasonS(params) {
  return request('/microservice/examine/deptdistgroupsearchinherit',params);
}
// 部门-项目经理-导入
export function deptImport(params) {
  return request('/microservice/allexamine/examine/inspectDistributePeople',params);
}
//季度时间查询
export function seasonTime() {
  return request('/microservice/examine/moduletime');
}
//考核人变更-页面信息
export function projectInfo(params) {
  return request('/microservice/allexamine/examine/projkpicheckerquery',params);
}
//考核人变更
export function checkerChange(params) {
  return request('/microservice/allexamine/examine/projkpicheckerupdate',params);
}
//BP增删改查
export function BPinfo(params) {
  return request('/microservice/allexamine/examine/principaldeptconf',params);
}
////BP部门查询
export function BPdept(params) {
  return request('/microservice/allexamine/examine/allpudepartmentquery',params);
}
//导入工时查询
export function hourssyncresquery(params) {
  return request('/microservice/allexamine/examine/hourssyncresquery',params);
}
//工时分数同步
export function hourssync(params) {
  return request('/microservice/allexamine/examine/hourssync',params);
}