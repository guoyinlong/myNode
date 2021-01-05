/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：全局配置文件
 */
//导入logo图
import unicom_logo_new from '../assets/Images/login_logo_new.png';
import login_bg_new from '../assets/Images/login_bg_new.jpg';
import unicom_logo_bg from '../assets/Images/unicom_logo_bg.png';
import unicom_logo from '../assets/Images/unicom_logo.png';
import avatar_0 from '../assets/Images/avatar_0.png';

import icon_sider from '../assets/Images/icon_sider.png';
import icon_header from '../assets/Images/icon_header.png';
import icon_error from '../assets/Images/error.png';
import crop_bg from '../assets/Images/crop_bg.png';

import img_login_unicom from '../assets/Images/login_unicom.png';
import img_login_center from '../assets/Images/login_center.png';
import img_login_bottom from '../assets/Images/login_bottom.png';
import img_login_left from '../assets/Images/login_left.png';
import img_login_right from '../assets/Images/login_right.png';

// import img_login_left_19da from '../assets/Images/login_left_19da.png';
// import img_login_right_19da from '../assets/Images/login_right_19da.png';
// import img_login_bottom_19da from '../assets/Images/login_bottom_19da.png';
//
// import img_login_left_00 from '../assets/Images/login_00_left.png';
// import img_login_right_00 from '../assets/Images/login_00_right.png';

import img_login_sf_lt from '../assets/Images/login_sf_lt.png';
import img_login_sf_lb from '../assets/Images/login_sf_lb.png';
import img_login_sf_rt from '../assets/Images/login_sf_rt.png';
import img_login_sf_rb from '../assets/Images/login_sf_rb.png';

import img_login_sf_2019_tl from '../assets/Images/sf2019/lantern_top_left.png';
import img_login_sf_2019_tr from '../assets/Images/sf2019/lantern_top_right.png';
import img_login_sf_2019_logo from '../assets/Images/sf2019/logo.png';
import img_login_sf_2019_background from '../assets/Images/sf2019/background.jpg';
import img_login_sf_2019_bl from '../assets/Images/sf2019/figure_bottom_left.png';

module.exports = {
  name: 'China unicom',
  footerText: '版权所有 · 联通软件研究院',
  profile: avatar_0,//用户默认头像
  unicom_logo_bg: unicom_logo_bg,//联通logo灰色背景
  unicom_logo: unicom_logo,//联通logo透明背景
  logoText: 'China unicom',
  //登陆配置
  loginConfig: {
    needLogin: true, //是否需要登录模块
    needCaptcha: false, //是否需要验证码
    CaptchaAddress: "/auth/identifycode/get", //验证码地址
    logoBackground: unicom_logo_bg, //logo的背景图
    loginBackground: login_bg_new, //背景图
    unicomLogo: unicom_logo_new, //logo
  },
  defaultSelectMenu: 'commonApp',
  needBread: true,
  needFooter: true,
  img_sider:icon_sider,
  img_header:icon_header,
  img_error:icon_error,
  img_crop:crop_bg,
  login_unicom:img_login_unicom,
  login_center:img_login_center,
  login_bottom:img_login_bottom,
  login_left:img_login_left,
  login_right:img_login_right,
  // login_bottom_19da:img_login_bottom_19da,
  // login_left_19da:img_login_left_19da,
  // login_right_19da:img_login_right_19da,
  //
  // login_left_00:img_login_left_00,
  // login_right_00:img_login_right_00,

  login_sf_2019_tl: img_login_sf_2019_tl,
  login_sf_2019_tr: img_login_sf_2019_tr,
  login_sf_2019_logo: img_login_sf_2019_logo,
  login_sf_2019_bg: img_login_sf_2019_background,
  login_sf_2019_bl: img_login_sf_2019_bl,

  login_sf_lt:img_login_sf_lt,
  login_sf_lb:img_login_sf_lb,
  login_sf_rt:img_login_sf_rt,
  login_sf_rb:img_login_sf_rb,

  login_2019_logo: img_login_sf_2019_logo,

  TENANT_ID:10010,
  OU_NAME_CN:"联通软件研究院",
  OU_HQ_NAME_CN:"联通软件研究院本部",
  OU_HQ_NAME_CN_PREFIX:"联通软件研究院-",
  OU_HAERBIN_NAME_CN:"哈尔滨软件研究院",
  OU_JINAN_NAME_CN:"济南软件研究院",
  OU_XIAN_NAME_CN:'西安软件研究院',
  OU_GUANGZHOU_NAME_CN:'广州软件研究院',
  OU_HQ_ID:"e65c02c2179e11e6880d008cfa0427c4",
  OU_HAERBIN_ID:"e65c072a179e11e6880d008cfa0427c4",
  OU_JINAN_ID:"e65c067b179e11e6880d008cfa0427c4",
  INFO_TITLE:'提示信息',
  WARNIGN_TITLE:'请注意！',
  SUCCESS_TITLE:'已成功！',
  ERROR_TITLE:'出错了！',

  //人力资源管理
  //配置管理员账号staffid
  HR_ADMIN:"0864955",

  //考核管理
  EVAL_TP_ID:"e50d4c30b38311e6a01d02429ca3c6ff",
  EVAL_MIDDLE_LEADER_POST_ID: "b7229105092d11e7960202429ca3c6ff", //考核管理-个人考核-审核人虚拟职位id
  EVAL_NO_DIST_DEPT:"济南软件研究院-需求分析部,哈尔滨软件研究院-需求分析部",//没有正态分布的部门
  EVAL_PROJ_COFFI_DIST_DEPT:"济南软件研究院-项目管理部,哈尔滨软件研究院-项目管理部,联通软件研究院-公众研发事业部",//需单独对项目绩效员工群体正态分布的部门
  EVAL_NO_COMP_COFFI_DIST_DEPT:"联通软件研究院-公众研发事业部,联通软件研究院-运营保障与调度中心,联通软件研究院-计费结算中心",//不需对综合绩效员工群体正态分布的部门
  EVAL_MGR_POST:"项目经理",
  EVAL_EMP_POST:"员工",
  EVAL_GROUP_LEADER_POST:"常设机构组长",
  EVAL_ORGAN_MASTER_POST:"常设机构负责人",
  EVAL_BR_DEPT_MANAGE_POST:"分院部门经理",
  EVAL_BR_VICR_DEPT_MANAGE_POST:"分院部门副经理",
  EVAL_DEAN_POST:"院长",
  EVAL_VICE_DEAN_POST:"副院长",
  EVAL_HQ_OPER_DEPT:"联通软件研究院-运营支撑部",//需查常设机构组长和项目经理的考核成绩
  EVAL_HQ_DEMAND_DEPT:"联通软件研究院-需求分析部",//
  EVAL_JINAN_DEMAND_DEPT:"济南软件研究院-需求分析部",//
  EVAL_HAERBIN_DEMAND_DEPT:"哈尔滨软件研究院-需求分析部",//
  EVAL_KPI_SCORE_200_DEPT:"需求分析部",//考核指标总分200分的部门
  EVAL_EMP_FIXED_KPI_TYPE:"固定考核指标",//项目成员固定考核指标类型
  EVAL_MGR_FIXED_KPI_TYPE:"项目考核得分",//项目经理固定考核指标类型
  EVAL_TIMESHEET_VALUE:"工时系统",//工时系统给项目成员打分
  EVAL_TFS_VALUE:"TFS系统、ITSM、沃工单等，建议考核人保留考核证据",//TFS系统给项目成员打分
  EVAL_PROJ_DEPT_VALUE:"项目部",//项目部给项目经理打分
  EVAL_PROJ_DEPT_VALUE_OLD:"项目与质量支撑部",//原项目部名称
  EVAL_FIXED_KPI_CHECKER_ID:"0000000",//工时系统 or TFS系统审核人、项目部给项目经理打分
  EVAL_HR_MASTER_ID:"0586261",//总院人力部经理
  EVAL_COMP_EVAL_KPI:"综合考核指标",//综合考核指标
  EVAL_PROJ_EVAL_KPI:"业务考核指标",//业务考核指标
  EVAL_PROJ_EVAL_KPI_OLD:"项目考核指标",//项目考核指标
  EVAL_COMP_PERF:"综合绩效",//综合绩效
  EVAL_PROJ_PERF:"业务绩效",//业务绩效
  EVAL_PLUS_MINUS_SCORE:"加减分",//加减分
  EVAL_BP_EVAL_KPI:"BP考核指标",
  EVAL_CORE_BP_KPI:"核心岗位一级考核指标",
  EVAL_CORE_BP_KPI2:"BP主责部门考核指标",
  EVAL_CORE_BP_KPI3:"人力部/财务部考核指标",
  //题库管理
  TYPE_SINGLE_CHOICE:'1',
  TYPE_MULTIPLE_CHOICE:'2',
  TYPE_GAP_FILLING:'3',
  TYPE_SHORT_ANSWER:"('4')",


  //全成本
  COST_OU_VGTYPE: 2,//全成本选择ou
  COST_TENANT_ID: 10010,//全成本应用程序
  COST_DEPT_PC_S: "/cost_personnel_changes",  //全成本-部门分摊管理-人员变动统计
  COST_DEPT_DEPT_S: "/cost_dept_apportion_statistics",//全成本-部门分摊管理-部门分摊统计
  COST_DEPT_DEPT_M: "/cost_dept_apportion",//全成本-部门分摊管理-部门分摊查询_撤销
  COST_PROJ_TIMESHEET: "/timesheet", // 全成本-项目分摊管理-工时管理查询_撤销
  COST_PROJ_TIMESHEET_S: "/timesheetSearch", // 全成本-项目分摊管理-工时管理查询_查询
  COST_PROJ_PJSHARING: "/pjSharing", // 全成本-项目分摊管理-项目分摊查询_撤销
  COST_PROJ_PJSHARING_S: "/pjSharingSearch", // 全成本-项目分摊管理-项目分摊查询_查询
  COST_PROJ_SHARING_S_Q: "/proj_sharing_state_pub",  //全成本-项目全成本管理-项目分摊成本人均标准执行情况查询
  COST_FULL_CPBG_PROJ_Q:"/proj_budget_going_proj",//全成本-项目预算执行情况(项目经理)
  COST_FULL_CPBG_SUM_Q:"/proj_budget_proj_sum" ,//全成本汇总
  COST_CPBG_Q:"/cost_projbudgetgoing",


  COST_DEPT_DEPT_Q: "/dept_apportion_mgt",  //全成本-部门分摊管理-部门分摊查询_查询
  COST_DEPT_PC_Q: "/personnel_changes_mgt",  //全成本-部门分摊管理-人员变动查询
  COST_PROJ_PJSHARING_M: "/proj_apportion_mgt", // 全成本-项目分摊管理-项目分摊统计
  COST_PROJ_TIMESHEET_M: "/timesheet_mgt", // 全成本-项目分摊管理-工时管理统计
  COST_FULL_CPBG_Q:"/cost_projbudgetgoing_mgt" ,//全成本-项目预算执行情况_全院
  COST_FULL_CPBG_BYMONTH_Q:"/cost_projbudgetgoingbyyear_mgt" ,//全成本-项目预算执行情况_全年
  COST_PROJ_SHARING_S_S: "/proj_apportion_state_mgt",  //全成本-项目全成本管理-项目分摊成本人均标准执行情况统计



  costPersonalStatic:"/microservice/cos/persionalstatic",//人员变动查询
  personalSyn:"/microservice/cosservice/personalsyn/allcost/personalsyn",//人员同步
  deptCostStaticPublish:"cos/depcost_static_publish",//部门分摊月统计查询
  //deptCostMonthStaticPublish:"cos/depcost_month_static_publish",//部门分摊年统计查询
  generateDeptData:"/microservice/cosservice/depallocation/allcost/depcost",//生成部门分摊数据
  publicDeptData:"/microservice/cos/depcost_publish",// 发布部门分摊数据
  cancelPublicDeptData:"/microservice/cos/depcost_unpublish",// 撤销发布部门分摊数据

  deptWtQuery:"/microservice/cos/deptwtquery",// 查询工时管理数据
  sync:"/microservice/cosservice/cosdeptworktime/allcost/cosdeptwtsync",// 同步工时管理数据
  projectCostQuery:"/microservice/cos/projcostnewquery",// 查询项目分摊数据
  generateProjectData:"/microservice/cos/projcostsync",// 生成项目分摊数据
  publicProjectData:"/microservice/cos/projcostpublish",// 发布项目分摊数据
  cancelPublicProjectData:"/microservice/cos/projcostunpublish",// 撤销项目分摊数据
  publicShareState:"/microservice/transupdate/cos/indbudgetparaupdate",// 发布/撤销项目分摊成本人均标准执行情况
  editShareState:"/microservice/transinsert/cos/indbudgetparainsert",// 编辑项目分摊成本人均标准执行情况
  generateShareState:"/microservice/cos/indbudget_para_generate",// 编辑项目分摊成本人均标准执行情况




  /*项目管理*/
  //bussiness_id
  PROJ_BUSSINESS_ID_1:'00001',  //联通软件研究院本部
  PROJ_BUSSINESS_ID_2:'00002',  //哈尔滨软件研究院
  PROJ_BUSSINESS_ID_3:'00003',  //济南软件研究院
  PROJ_BUSSINESS_ID_4:'00004',  //西安软件研究院
  PROJ_BUSSINESS_ID_5:'00005',  //广州软件研究院
  NO_AUTHORITY:"没有权限",
  FILE_NAME_IS_REPEAT:"上传文件名重复，请重新上传",
  COORP_DEPT_IS_MAIN_DEPT:"配合部门不能选择为主责部门",
  COORP_NAME_IS_REPEAT:"配合部门不能重复",
  PREDICT_TIME:"1.预计工时（人月）",
  NO_PREFIX_PREDICT:"预计工时（人月）",
  DIRECT_COST:"2.直接成本（元）",
  NO_PREFIX_DIRECT_COST:"直接成本（元）",
  PURCHASE_COST:"2.1项目采购成本（元）",
  NO_PREFIX_PURCHASE_COST:"项目采购成本",
  OPERATE_COST:"2.2项目运行成本（元）",
  NO_PREFIX_OPERATE_COST:"项目运行成本",
  CARRYOUT_COST:"2.3项目实施成本（元）",
  NO_PREFIX_CARRYOUT_COST:"项目实施成本",
  HUMAN_COST:"2.4项目人工成本（元）",
  NO_PREFIX_HUMAN_COST:"   项目人工成本（元）",
  COST_ALL_TOTAL:"总计",
  NO_ADD_COST_TYPE:"没有可添加的费用项",
  FEE_IS_REPEATED:'费用项不能重复',
  SELECT_YEAR:'选择年份',
  YEAR_IS_REPEATED:'年份不能重复',
  NO_ADD_YEAR:'没有可添加的年份',
  DELETE_YEAR_TIP:'年份删除后,该年份下的预算信息将一并删除!确认删除选中年份',
  COORP_DEPT_INFO:'配合部门信息',
  PREDICT_TIME_TOTAL:'对内工作量',
  SELECT_DEPT:'选择部门',
  DEPT_BUDGET_INFO:'部门预算信息',
  ALL_BUDGET_SUM_TIP:'预算总和需要大于0',
  PROJ_IS_CHANGE:'未变更',

  PROCESSING_DATA:'处理中...',
  IS_LOADING:'加载中...',
  MODIFY_REASON:'修改原因',
  MODIFY_REASON_EMPTY:'修改原因不能为空',
  CONTENT_CHANGE:'数据发生变化，是否返回？返回将不保存编辑的数据',
  CONTENT_NOT_CHANGE_NO_SUBMIT:'没有变化的数据，不能提交',
  FULLCOST_TOTAL:140,     /*全成本小计的宽度*/
  DEPT_MODAL_WIDTH:'1000px',   //选择部门时模态框的宽度
}
