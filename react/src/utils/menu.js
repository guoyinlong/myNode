/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：系统菜单配置（已停用）
 */
import {seeorderSerach} from '../components/meetSystem/meetConst.js'
module.exports = [

  // 首页应用
  {
    key: 'commonApp',
    name: '首页',
    child: [
      {
        key: 'questionnaire',
        name: '问卷调查'
      },
      {
        key: 'opensource',
        name: '开源社区',
        clickable: false,
        child: [
          {
            key: 'passReset',
            name: 'gitlab密码重置'
          },
          {
            key: 'projectList',
            name: '项目门户'
          },
          {
            key: 'projectBuild',
            name: '项目创建'
          },
          {
            key: 'myProject',
            name: '我的项目'
          }
        ]
      },
      {
        key: 'overviewbypoint',
        name: '一点看全',
        clickable: false,
        child: [
          {
            key: 'searchallouinfo',
            name: '总览'
          }
        ]
      }
    ]
  },
  // 人力应用
  {
    key: 'humanApp',
    name: '人力应用',
    clickable: false,
    child: [
      {
        key: 'hr',
        name: '人力管理',
        clickable: false,
        child: [
          {
            key: 'staffImport',
            name: '员工信息导入'
          },
          {
            key: 'staffInfoSearch',
            name: '员工信息查询'
          },
          {
            key: 'staffInfoEdit',
            name: '个人信息维护'
          },
          {
            key: 'staffPostEdit',
            name: '员工职务信息维护'
          },
          {
            key: 'staffDeptEdit',
            name: '员工部门信息维护'
          },
          {
            key: 'staffLeave',
            name: '员工离职'
          },
          {
            key: 'deptInfo',
            name: '部门负责人维护'
          },
          {
            key: 'postInfo',
            name: '组织单元职务维护'
          },
          {
            key: 'personnelInfo',
            name: '人员变动统计维护'
          },
          {
            key: 'import',
            name: '全面激励信息'
          },
            {
                key: 'encoAuthSetting',
                name: '激励信息权限设置'
            }
        ]
      },
      {
        key: 'employer',
        name: '个人考核',
        clickable: false,
        child: [
          {
            key: 'manage',
            name: '指标管理',
            child: [
              {
                key: 'searchDetail',
                name: '指标详情'
              },
              {
                key: 'kpiAdd',
                name: '新增指标'
              },
              {
                key: 'kpiModify',
                name: '修改指标'
              },
              {
                key: 'kpiFinish',
                name: '填写指标完成情况'
              },
              {
                key: 'kpiAdditional',
                name: '补录指标'
              }
            ]
          },
          {
            key: 'kindDist',
            name: '员工类别分配'
          },
          {
            key: 'kindWatch',
            name: '员工类别'
          },
          {
            key: 'hrsearch',
            name: 'HR指标查询',
            child: [
              {
                key: 'searchDetail',
                name: '指标详情'
              }
            ]
          },
          {
            key: 'pmsearch',
            name: '指标查询',
            child: [
              {
                key: 'searchDetail',
                name: '指标详情'
              }
            ]
          },
          {
            key: 'dmsearch',
            name: '指标查询',
            child: [
              {
                key: 'searchDetail',
                name: '指标详情'
              }
            ]
          },
          {
            key: 'dmprojsearch',
            name: '指标查询',
            child: [
              {
                key: 'searchDetail',
                name: '指标详情'
              }
            ]
          },
          {
            key: 'bpsearch',
            name: 'BP指标查询',
            child: [
              {
                key: 'searchDetail',
                name: '指标详情'
              }
            ]
          },
          {
            key: 'check',
            name: '指标审核',
            child: [
              {
                key: 'checkDetail',
                name: '指标审核详情'
              }
            ]
          },
          {
            key: 'value',
            name: '指标评价',
            child: [
              {
                key: 'valueDetail',
                name: '指标评价详情'
              }
            ]
          },
          {
            key: 'pmdistribute',
            name: '正态分布'
          },
          {
            key: 'dmdistribute',
            name: '正态分布'
          },
          {
            key: 'psdistribute',
            name: '正态分布'
          },
          {
            key: 'masterdistribute',
            name: '正态分布'
          },
          {
            key: 'groupdistribute',
            name: '正态分布'
          },
          {
            key: 'open',
            name: '模块开放时间修改'
          },
          {
            key: 'state',
            name: '指标状态'
          },
          {
            key: 'result',
            name: '考核结果'
          },
          {
            key: 'bpresult',
            name: 'BP考核结果'
          },
            {
                key: 'modifyRemainder',
                name: '项目余数变更'
            },
          {
            key: 'deptremain',
            name: '部门余数信息'
          },
          {
            key: 'support',
            name: '支撑评价',
            child: [
              {
                key: 'supportDetail',
                name: '支撑评价详情'
              }
            ]
           },
          {
            key: 'employerAdmin',
            name: '后台管理'
          },
          {
            key: 'distGroup',
            name: '分布群体配置'
          },
          {
            key: 'progress',
            name: '支撑评价进度'
          },
          {
            key: 'annual',
            name: '年度考核'
          },
          {
            key: 'pmannual',
            name: '年度考核'
          },
          {
            key: 'BPpage',
            name: 'BP配置'
          },
          {
            key: 'otherDeptSet',
            name: '分管部门配置'
          },
        ]
      },
      {
        key: 'leader',
        name: '中层考核',
        clickable: false,
        child: [
          {
            key: 'manage',
            name: '指标管理',
            child: [
              {
                key: 'detail',
                name: '指标详情'
              },
              {
                key: 'kpiFinish',
                name: '填写指标完成情况'
              }
            ]
          },
          {
            key: 'search',
            name: '指标查询',
            child: [
              {
                key: 'detail',
                name: '指标详情'
              }
            ]
          },
          {
            key: 'value',
            name: '指标评价',
            child: [
              {
                key: 'detail',
                name: '指标评价详情'
              }
            ]
          },
          {
            key: 'resultInfo',
            name: '结果录入',
          },
          {
            key: 'performance',
            name: '个人年度考核',
          },
          {
            key: 'yearInfo',
            name: '年度考核',
          },
          {
            key: 'middleEvaluation',
            name: '360度评价管理'
          },
        ]
      },
      {
        key: 'encouragement',
        name: '全面激励',
        clickable: false,
        child: [
          {
            key: 'index',
            name: '首页',
          },
          {
            key: 'basicinfo',
            name: '基本信息',
          },
          {
            key: 'promotion',
            name: '晋升激励报告',
          },
          {
            key: 'performance',
            name: '绩效激励报告',
          },
          {
            key: 'training',
            name: '培训激励报告',
          },
          {
            key: 'recognized',
            name: '认可激励报告',
          },
          {
            key: 'honor',
            name: '荣誉激励报告',
          },
          {
            key: 'longterm',
            name: '长期激励报告',
          },
          {
            key: 'welfare',
            name: '福利激励报告',
          },
          {
            key: 'wage',
            name: '整体激励报告',
          }
        ]
      },
      //add labor zhaijt
      //劳动用工管理
      {
        key: 'labor',
        name: '劳动用工',
        clickable: false,
        child: [
          {
            key: 'index',
            name: '离职管理'
          },
          {
            key: 'index/CreateLeave',
            name: '离职申请'
          },
          {
            key: 'leave_search',
            name: '离职流程查询'
          },
          {
            key: 'index/CheckLeave',
            name: '离职申请'
          },
          {
            key: 'index/CheckLeaveSettle',
            name: '离职清算'
          },
          {
            key: 'index/createLeaveSettle',
            name: '离职清算'
          },
          {
            key: 'index/HandOverPrint',
            name: '离职交接查看'
          },
          {
            key: 'index/CheckWorkHandover',
            name: '离职交接'
          },
          {
            key: 'index/leave_apply_approval',
            name: '离职申请审批'
          },
          {
            key: 'index/leave_hand_approval',
            name: '离职工作交接审批'
          },
          {
            key: 'index/LeavePrint',
            name: '离职申请打印'
          },
          {
            key: 'index/LeaveSettlePrint',
            name: '离职清算打印'
          },
          {
            key: 'index/quit_settle_approval',
            name: '离职清算审批'
          },
          {
            key: 'staffLeave_index',
            name: '查询待办/已办审批'
          },
          {
            key: 'index/workHandover',
            name: '离职工作交接'
          },
          {
            key: 'contractListSearch',
            name: '劳动合同续签查询'
          },
          {
            key: 'contractPersonSearch',
            name: '个人劳动合同信息查询'
          },
          {
            key: 'staffLeave_index/contractRenewApproval',
            name: '劳动合同续签审批'
          },
          {
            key: 'staffLeave_index/contractApproveInform',
            name: '劳动合同续签查看'
          },
          {
            key: 'importContract',
            name: '劳动合同录入'
          },
          {
            key: 'contractSearch',
            name: '员工劳动合同查询'
          },
          {
            key: 'staffLeave_index/contract_approval_look',
            name: '合同续签驳回信息'
          },
        ]
      },
      //加班管理
      {
        key: 'overtime',
        name: '管理加班',
        clickable: false,
        child: [
          {
            key: 'overtime_index',
            name: '节假日加班管理'
          },
          {
            key: 'overtime_index/createApproval',
            name: '创建加班审批流程'
          },
          {
            key: 'overtime_index/showApprovalDetails',
            name: '加班申请详细信息'
          },
          {
            key: 'overtime_index/teamApproval',
            name: '加班申请审批'
          },
          {
            key: 'overtime_index/showTeamDetails',
            name: '项目组加班申请详情信息'
          },
          {
            key: 'overtime_search',
            name: '节假日加班流程查询'
          },
          {
            key: 'overtime_index/createDeptApproval',
            name: '节假日加班'
          },
          {
            key: 'overtime_index/createTeamApproval',
            name: '节假日加班'
          },
          {
            key: 'overtime_index/createFunctionalDeptApproval',
            name: '节假日加班'
          },
        ]
      },
      //职级晋升管理
      {
        key: 'rankpromote',
        name: '职级晋升',
        clickable: false,
        child: [
          {
            key: 'rankpromote',
            name: '职级晋升'
          },
          {
            key: 'promoteInfo',
            name: '员工职级薪档查询'
          },
          {
            key: 'personRankPromotionQuery',
            name: '职级专员查询'
          },
          {
            key: 'promoteexport',
            name: '员工晋升路径导出'
          },
          {
            key: 'promoteimport',
            name: '员工职级薪档维护'
          },
          {
            key: 'promoteimport/promoteImportData',
            name: '员工职级薪档导入'
          },
          {
            key: 'comprehensiveDataQuery',
            name: '全面激励晋升接口'
          },
        ]
      },
      //培训管理
      {
        key: 'train',
        name: '培训管理',
        clickable: false,
        child: [
          {
            key: 'train_index',
            name: '培训执行'
          },
          {
            key: 'train_do/train_apply_look',
            name: '培训申请详情'
          },
          {
            key: 'train_do/train_apply_approval',
            name: '培训申请审批'
          },
          {
            key: 'train_index/create_train_apply',
            name: '培训申请'
          },
          {
            key: 'train_index/create_internal_own_teacher',
            name: '内训-自有内训师培训申请'
          },
          {
            key: 'train_index/create_internal_ingroup_insystem_apply',
            name: '内训-参加集团及系统内培训申请'
          },
          {
            key: 'train_index/create_internal_external_teacher',
            name: '内训-外请讲师培训申请'
          },
          {
            key: 'train_index/create_train_course_apply',
            name: '培训班申请'
          },
          {
            key: 'trainPlanList/DynaddClass',
            name: '动态新增课程'
          },
          {
            key: 'trainPlanAndImport/create_branch_department',
            name: '导入通用课程'
          },
          {
            key: 'trainPlanAndImport/create_certification',
            name: '导入认证考试计划课程'
          },
          {
            key: 'trainPlanAndImport/create_general_compulsory',
            name: '导入全院级必修课程'
          },
          {
            key: 'trainPlanAndImport/create_general_elective',
            name: '导入全院级选修课程'
          },
          {
            key: 'train_do/centerComEdit',
            name: '必修课程调整界面'
          },
          {
            key: 'train_do/deptPlanEdit',
            name: '课程调整'
          },
          {
            key: 'train_do/examEdit',
            name: '课程调整'
          },
          {
            key: 'train_do/centerEleEdit',
            name: '选修课程调整界面'
          },
          {
            key: 'trainPlanAndImport/claim_class',
            name: '全院计划落地'
          },
          {
            key: 'trainPlanAndImport/DynAddClass',
            name: '新增申请'
          },
          {
            key: 'train_do',
            name: '待办查询/已办审批'
          },
          {
            key: 'train_do/train_plan_approval_com',
            name: '培训计划审批'
          },
          {
            key: 'train_do/train_plan_approval_ele',
            name: '培训计划审批'
          },
          {
            key: 'train_do/train_plan_approval_dept',
            name: '培训计划审批'
          },
          {
            key: 'train_do/train_plan_approval_exam',
            name: '培训计划审批'
          },
          {
            key: 'train_do/train_plan_approval',
            name: '培训计划审批'
          },
          {
            key: 'train_do/train_in_planin_approval',
            name: '培训计划审批'
          },
          {
            key: 'train_do/create_train_course_approval',
            name: '培训班申请审批'
          },
          {
            key: 'train_do/train_in_planout_approval',
            name: '培训计划审批'
          },
          {
            key: 'train_do/train_in_planout_look',
            name: '培训计划查看'
          },
          {
            key: 'train_do/create_train_course_look',
            name: '培训班申请审批查看'
          },
          {
            key: 'train_do/train_in_planin_look',
            name: '培训计划查看'
          },
          {
            key: 'train_do/train_plan_look',
            name: '培训计划查看'
          },
          {
            key: 'train_do/train_plan_look_com',
            name: '培训计划查看'
          },
          {
            key: 'train_do/train_plan_look_dept',
            name: '培训计划查看'
          },
          {
            key: 'train_do/train_plan_look_ele',
            name: '培训计划查看'
          },
          {
            key: 'train_do/train_plan_look_exam',
            name: '培训计划查看'
          },
          {
            key: 'trainPlanList',
            name: '培训计划查询'
          },
          {
            key: 'trainStatistic/train_config_query',
            name: '培训统计自定义查询'
          },
          {
            key: 'trainStatistic',
            name: '培训统计'
          },
          {
            key: 'personalClassQueryIndex',
            name: '个人培训统计概览'
          },
          {
            key: 'myTrainGoal',
            name: '我的小目标'
          },
          {
            key: 'personalClassQueryIndex/personalClassQuery',
            name: '个人培训统计查询'
          },
          {
            key: 'trainStatistic/train_class_info',
            name: '培训信息查询'
          },
          {
            key: 'trainManage/importPersonPost',
            name: '人员岗位信息录入'
          },
          {
            key: 'trainManage/trainManagementSettings',
            name: '任务设定'
          },
          {
            key: 'trainManage/trainSpecialPersonInfo',
            name: '特殊人群设置'
          },
          {
            key: 'trainManage',
            name: '培训任务及人员岗位'
          },
          {
            key: 'trainStatistic/statistic_search',
            name: '培训计划执行统计查询'
          },
          {
            key: 'ttrain_index/rain_online_exam_import',
            name: '线上&认证考试导入'
          },
          {
            key: 'importClassPerson',
            name: '核心班名单导入'
          },
          {
            key: 'train_index/train_online_exam_import',
            name: '线上培训认证考试导入'
          },
          {
            key: 'train_index/train_online_exam_import_look',
            name: '线上培训认证考试查看'
          },
          {
            key: 'train_do/train_online_exam_import_approval',
            name: '线上培训认证考试审批'
          },
          {
            key: 'trainPlanQuery',
            name: '培训计划'
          },
          {
            key: 'trainPlanAndImport',
            name: '培训计划导入及落地'
          },
          {
            key: 'trainPlanAndImport/exam_checklist',
            name: '考试清单导入'
          },
          {
            key: 'personalClassQueryIndex/certificationList',
            name: '认证考试查询'
          },
          {
            key: 'personalClassQueryIndex/certificationList',
            name: '认证考试查询'
          },
          {
            key: 'trainPlanList/DynAddClass',
            name: '全院级、通用培训计划、认证考试新增申请提交'
          },
        ]
      },
      //人才管理
      {
        key: 'talent',
        name: '人才管理',
        clickable: false,
        child: [
          {
            key: 'importTalentInfo',
            name: '人才信息录入'
          },
        ]
      },
      //干部管理
      {
        key: 'appraise',
        name: '干部管理',
        clickable: false,
        child: [
          {
            key: 'approvalInfo/oraganApproval',
            name: '组织机构评议'
          },
          {
            key: 'startAppraise',
            name: '发起评议'
          },
          {
            key: 'approvalInfo/commentApproval',
            name: '个人评议'
          },
          {
            key: 'approvalInfo',
            name: '评议待办'
          },
          {
            key: 'commentInfo/newCommentInfoAdd',
            name: '新增评议内容'
          },
          {
            key: 'commentInfo',
            name: '评议单内容配置'
          },
          {
            key: 'personInfo',
            name: '评议人员信息维护'
          },
          {
            key: 'cadreInfo',
            name: '被评议人员信息维护'
          },
        ]
      },
      //人工成本
      {
        key: 'costlabor',
        name: '人工成本管理',
        clickable: false,
        child: [
          {
            key: 'costVerify/costVerifyIndex/importLaborInfo',
            name: '工资单录入'
          },
          {
            key: 'manageCenter',
            name: '标准工资项维护'
          },
          {
            key: 'manageBranch',
            name: '工资项映射配置'
          },
          {
            key: 'costVerify',
            name: '人工成本验证'
          },
          {
            key: 'costVerify/costVerifyIndex',
            name: '人工成本验证首页'
          },
          {
            key: 'costVerify/costVerifyIndex/exportCostForHrDetail',
            name: '研发项目人工成本导出'
          },
          {
            key: 'costVerify/costVerifyIndex/exportCostForHrFull',
            name: '全成本项目研发人工成本导出'
          },
          {
            key: 'exportCostForFinance',
            name: 'PA系统研发项目人工成本导出'
          },
          {
            key: 'exportCostToCapitalization',
            name: '研发转资本化'
          },
        ]
      },
      //请假管理
      {
        key: 'absence',
        name: '请假管理',
        clickable: false,
        child: [
          {
            key: 'absenceIndex',
            name: '新建待办'
          },
          {
            key: 'absenceIndex/create_break_off',
            name: '新增调休'
          },
          {
            key: 'absenceIndex/create_year_absence',
            name: '新增年假'
          },
          {
            key: 'absenceIndex/create_affair_absence',
            name: '新增事假'
          },
          {
            key: 'absenceIndex/absence_approve_look',
            name: '调休查看'
          },
          {
            key: 'absenceIndex/affair_approval_look',
            name: '事假查看'
          },
          {
            key: 'absenceIndex/absence_approval',
            name: '调休审批'
          },
          {
            key: 'absenceIndex/year_approval',
            name: '年假审批'
          },
          {
            key: 'absenceIndex/affair_approval',
            name: '事假审批'
          },
          {
            key: 'absenceIndex/year_approval_look',
            name: '年假查看'
          },
          {
            key: 'yearpersoninfo',
            name: '年假管理'
          },
          {
            key: 'yearpersoninfo/yearimport',
            name: '年假导入'
          },
          {
            key: 'personalSearch',
            name: '请假记录查询'
          },
        ]
      },
      //工会慰问
      {
        key: 'laborSympathy',
        name: '工会慰问',
        clickable: false,
        child: [
          {
            key: 'index',
            name: '新建待办'
          },
          {
            key: 'index/apply',
            name: '新增慰问申请'
          },
          {
            key: 'index/create_year_absence',
            name: '新增年假'
          },
          {
            key: 'index/labor_sympathy_approval',
            name: '工会慰问审批'
          },
          {
            key: 'index/labor_sympathy_approval_look',
            name: '审批查看'
          },
        ]
      },
      //考勤管理
      {
        key: 'attend',
        name: '考勤管理',
        clickable: false,
        child: [
          {
            key: 'index',
            name: '新建待办'
          },
          {
            key: 'index/proj_apply',
            name: '新增项目组考勤申请'
          },
          {
            key: 'index/dept_apply',
            name: '新增业务部门考勤申请'
          },
          {
            key: 'index/func_apply',
            name: '新增职能部门考勤申请'
          },
          {
            key: 'index/attend_proj_approval',
            name: '项目组考勤审批'
          },
          {
            key: 'index/attend_dept_approval',
            name: '业务部门考勤审批'
          },
          {
            key: 'index/attend_func_approval',
            name: '职能部门考勤审批'
          },
          {
            key: 'index/attend_proj_approval_look',
            name: '审批查看'
          },
          {
            key: 'index/attend_dept_approval_look',
            name: '审批查看'
          },
          {
            key: 'index/attend_func_approval_look',
            name: '审批查看'
          }
        ]
      }
    ]
  },
  //项目制应用
  {
    key: 'projectApp',
    name: '项目制应用',
    clickable: false,
    child: [
      {
        key: 'projStartUp',
        name: '项目启动',
        clickable: false,
        child: [
          {
            key: 'projList',
            name: '项目信息管理',
            child: [
              {
                key: 'projStartEdit',
                name: '项目详情'
              },
              {
                key: 'projMainPage',
                name: '新增项目'
              },
            ]
          },
          {
            key: 'projPmsCapital',
            name: '资本化项目'
          }
        ]
      },
      {
        key: 'projPrepare',
        name: '项目筹划',
        clickable: false,
        child: [
          {
            key: 'teamManage',
            name: '团队管理',
            child: [
              {
                key: 'projTeamInfo',
                name: '团队搜索结果'
              },
              {
                key: 'teamManageDetail',
                name: '团队详情'
              },
              {
                key: 'teamManageSearch',
                name: '归口部门项目列表',
                child: [
                  {
                    key: 'teamManageSearchDetail',
                    name: '归口部门人员详情'
                  }
                ]
              }
            ]
          },
          {
            key: 'memberQuery',
            name: '人员查询'
          },
          {
            key: 'projPlan',
            name: '项目计划',
            child: [
              {
                key: 'projPlanDocDownload',
                name: '项目计划详情'
              }
            ]
          }
        ]
      },
      {
        key: 'projExecute',
        name: '项目执行',
        clickable: false,
        child: [
          {
            key: 'report',
            name: '项目报告列表',
            child: [
              {
                key: 'projReportInfo',
                name: '月报周报列表'
              },
              {
                key: 'projReportAdd',
                name: '新增月报'
              }
            ]
          },
          {
              key: 'weekAndMonth',
              name: '项目信息列表',
              child: [
                    {
                        key: 'monthDetail',
                        name: '月报详细页面'
                   },
              ]
          }
        ]
      },
      {
        key: 'projMonitor',
        name: '项目监控',
        clickable: false,
        child: [
          {
            key: 'deliverable',
            name: '交付物管理'
          },
          {
            key: 'change',
            name: '变更项目列表',
            child: [
              {
                key: 'projChangeApply',
                name: '项目变更'
              },
              {
                key: 'budgetChangeApply',
                name: '差旅费预算变更'
              }
            ]
          },
          {
            key: 'risk',
            name: '风险跟踪',
            child: [
              {
                key: 'projRiskList',
                name: '风险列表'
              },
              {
                key: 'addRiskDetial',
                name: '新增风险'
              },
              {
                key: 'editRiskDetial',
                name: '编辑风险'
              }
            ]
          },
          {
            key: 'issueTrack',
            name: '问题跟踪',
            child:[
              {
                key: 'projIssueTrackList',
                name: '问题列表'
              },
              {
                key: 'editIssueTrackDetial',
                name: '编辑问题'
              },
              {
                key: 'addIssueTrackDetial',
                name: '新增问题'
              }
            ]
          }
        ]
      },
      {
        key: 'projClosure',
        name: '项目收尾',
        clickable: false,
        child: [
          {
            key: 'projDeliveryList',
            name: '项目结项列表',
            child: [
              {
                key: 'projDeliveryFile',
                name: '交付物清单'
              }
            ]
          },
          {
            key: 'historyProject',
            name: '历史项目列表',
            child: [
              {
                key: 'projHistoryEdit',
                name: '历史项目详情'
              }
            ]
          },
            {
                key: 'projTmoEnd',
                name: 'TMO结项项目列表',
            }
        ]
      },
      {
        key: 'projexam',
        name: '考核管理',
        clickable: false,
        child: [
          {
            key: 'examsetting',
            name: '考核设定',
            child: [
              {
                key: 'projAssessmentStandardInfo',
                name: '考核设定列表'
              },
              {
                key: 'projAssessmentStandardDetail',
                name: '考核设定详情'
              }
            ]
          },
          {
            key: 'tmp_setting',
            name: '模板设定',
            child: [
              {
                key: 'projAssessmentStandardTempletInfo',
                name: '模板指标'
              },
              {
                key: 'projAssessmentStandardTempletDetail',
                name: '模板详情'
              }
            ]
          },
          {
            key: 'examallocation',
            name: '考核分配'
          },
          {
            key: 'examquery',
            name: '结果查询',
            child: [
              {
                key: 'proList',
                name: '项目列表',
              },
              {
                key: 'detailKpi',
                name: '项目指标详情'
              }
            ]
          },
          {
            key: 'examevaluate',
            name: '考核评价',
            child: [
              {
                key: 'projectList',
                name: '项目列表',
                child: [
                  {
                    key: 'detailKpiTMO',
                    name: '指标详情'
                  },
                  {
                    key: 'detailKpiTMOLook',
                    name: '指标详情'
                  }
                ]
              }
            ]
          },
          {
            key: 'kpifeedback',
            name: '指标反馈'
          }
        ]
      },
      {
        key: 'timesheetManage',
        name: '工时管理',
        clickable: false,
        child: [
          {
            key: 'timesheetFillin',
            name: '工时填报'
          },
          {
            key: 'fillSendBack',
            name: '工时退回'
          },
          {
            key: 'timesheetMakeup',
            name: '工时补录'
          },
          {
            key: 'timesheetCheck',
            name: '工时审核'
          },
          {
            key: 'timesheetMakeupCheckPm',
            name: '工时补录审核'
          },
          {
            key: 'timesheetMakeupCheckDm',
            name: '工时补录审核'
          },
          {
            key: 'projectTimesheetSearch',
            name: '项目工时查询'
          },
          {
            key: 'staffTimesheetSearchCommon',
            name: '个人工时查询'
          },
          {
            key: 'staffTimesheetSearchPm',
            name: '个人工时查询'
          },
          {
            key: 'staffTimesheetSearchDm',
            name: '个人工时查询'
          },
          {
            key: 'activityTypeMaintenance',
            name: '活动类型维护'
          },
          {
            key: 'worktimeDataStatistics',
            name: '工时年化数据统计'
          },
          {
            key: 'worktimeMonthRatio',
            name: '工时占比数据统计'
          },
          {
            key: 'staffSeasonProjExamine',
            name: '员工项目考核系数'
          },
          {
            key: 'staffSeasonProjScore',
            name: '员工工时考核得分'
          },
          {
            key: 'seasonExamineWorkload',
            name: '季度考核项目工作量'
          },
          {
            key: 'technologyDataStatistics',
            name: '科技创新工时统计'
          },
          {
            key: 'purchaseDataStatistics',
            name: '合作伙伴工时统计'
          },
          {
            key:'additionalStatistics',
            name:'科技创新工时查询'
          },
          {
            key: 'workdayManage',
            name: '工作日管理'
          },
          {
            key: 'timesheetConfiguration',
            name: '工时配置'
          }
        ]
      },{
        key: 'corePost',
        name: '核心岗位',
        clickable: false,
        child: [
          {
            key: 'postInfo',
            name: '岗位信息'
          },
          {
            key: 'apply',
            name: '竞聘续聘申请'
          },
          {
            key: 'responsApply',
            name: '责任承诺书'
          }
        ]
      },
	  {
        key: "projRecord",
        name: "项目推送",
        clickable: false,
        child: [
          {
            key: "projChild",
            name: "RD推送",
            child: [
              {
                key: "projDetail",
                name: "详情页面",
              },
            ],
          },
        ],
      },
      {
        key:'projConfig',
        name:'项目配置',
        clickable:false,
        child:[
          {
            key:'projCheck',
            name:'审核设置'
          },
          {
            key:'projTravel',
            name:'部门差旅设置'
          },
          {
            key:'mailNotice',
            name:'邮件通知人员设置'
          },
          {
            key:'departmentSetting',
            name:'归属部门设置'
          },
          {
            key:'others',
            name:'其他设置'
          },
          {
            key:'fullCostStandard',
            name:'全成本配置'
          },
        ]
      },
      {
        key: 'purchase',
        name: '合作伙伴管理',
        clickable: false,
        child: [
          {
            key: 'infoFill',
            name: '服务评价填报'
          },
          {
            key: 'infoCheck',
            name: '服务评价审核'
          },
          {
            key: 'infoQuery',
            name: '服务评价导出'
          },
          {
            key: 'infoRecall',
            name: '服务评价撤回'
          },
          {
            key: 'infoQuery2',
            name: '服务评价查询'
          }
        ]
      }
    ]
  },
  // 财务应用
  {
    key: 'financeApp',
    name: '财务应用',
    clickable: false,
    child: [
      {
        key: 'cost_costmainten',
        name: '费用科目维护',
        clickable: false,
        child: [
          {
            key: 'cost_fee_mgt',
            name: '费用科目管理'
          }
        ]
      },
      {
        key: 'cost_erp_fileupload',
        name: 'ERP成本导入',
        clickable: false,
        child: [
          {
            key: 'straight_cost_mgt',
            name: '直接成本管理'
          },
          {
            key: 'indirect_cost_mgt',
            name: '间接成本管理'
          },
          {
            key: 'labour_cost_maintain',
            name: '人工成本管理'
          },
          {
            key: 'proj_eq_amo',
            name: '项目设备摊销'
          },
          {
            // 废弃
            key: 'erp_fileupload_mgt',
            name: '成本导入管理'
          }
        ]
      },
      {
        key: 'cost_dept_apportion',
        name: '部门分摊',
        clickable: false,
        child: [
          {
            key: 'personnel_changes_mgt',
            name: '人员变动管理'
          },
          {
            key: 'dept_apportion_mgt',
            name: '部门分摊管理'
          }
        ]
      },
      {
        key: 'cost_proj_apportion',
        name: '项目分摊',
        clickable: false,
        child: [
          {
            key: 'timesheet_mgt',
            name: '工时管理'
          },
          {
            key: 'proj_apportion_mgt',
            name: '项目分摊管理'
          }
        ]
      },
      {
        key: 'cost_proj_fullcost_mgt',
        name: '项目全成本管理',
        clickable: false,
        child: [
          {
            key: 'cost_budget_mgt',
            name: '预算管理'
          },
          {
            key: 'ou_full_cost_mgt',
            name: 'OU预算完成情况'
          },
          {
            key: 'cost_projbudgetgoing_mgt',
            name: '预算完成情况汇总'
          },
          {
            key: 'cost_projbudgetgoingbyyear_mgt',
            name: '预算执行情况全年'
          },
          {
            key: 'full_cost_total',
            name: '全成本汇总'
          },
          {
            key: 'full_cost_subtotal',
            name: '全成本分类汇总'
          },
          {
            key: 'full_cost_progress_chart',
            name: '全成本指标展示'
          },
          {
            key: 'proj_apportion_state_mgt',
            name: '人均标准管理'
          },
          {
            key: 'proj_cost_detail',
            name: '项目成本明细'
          },
          {
            key: 'stcp_cost_detail',
            name: '科技创新项目支出明细'
          }
        ]
      },
      {
        key: 'cost_proj_divided_mgt',
        name: '加计扣除',
        clickable: false,
        child: [
          {
            key: 'divided_mainpage_mgt',
            name: '研发支出辅助账列表',
            child: [
              {
                key: 'divided_support_mgt',
                name: '研发支出辅助账详情'
              }
            ]
          },
          {
            key: 'divided_summary_mgt',
            name: '辅助账汇总'
          },
          {
            key: 'divided_collection_mgt',
            name: '费用归集'
          }
        ]
      },
      {
        key: 'funding_plan',
        name: '资金计划',
        clickable: false,
        child: [
          {
            key: 'funding_plan_start',
            name: '资金计划启动'
          },
          {
            key: 'funding_plan_person_search',
            name: '个人报销查询'
          },
          {
            key: 'funding_plan_finance_search',
            name: '总院财务报销查询'
          },
          {
            key: 'funding_plan_fill',
            name: '资金计划填报'
          },
          {
            key: 'funding_plan_append_fill',
            name: '资金计划调整'
          },
          {
            key: 'funding_plan_review',
            name: '资金计划审核'
          },
          {
            key: 'funding_plan_team_search',
            name: '组管理员报销查询'
          },
          {
            key: 'funding_plan_deptMgr_search',
            name: '部门管理员报销查询'
          },
          {
            key: 'funding_plan_branch_finance_search',
            name: '资金计划查询'
          },
          {
            key: 'funding_plan_budget_person_query',
            name: '个人查询'
          },
          {
            key: 'funding_plan_budget_team_query',
            name: '组管理查询'
          },
          {
            key: 'funding_plan_budget_deptMgr_query',
            name: '部门管理查询'
          },
          {
            key: 'fundingPlanAccountManagement',
            name: '科目管理'
          },
          {
            key: 'fundingPlanTeamManagement',
            name: '小组管理'
          },
          {
            key: 'fundingPlanPeopleManagement',
            name: '人员管理'
          },
          {
            key: 'funding_plan_team_report',
            name: '小组资金计划报表'
          },
          {
            key: 'funding_plan_deptMgr_report',
            name: '部门资金计划报表',
            child: [
              {
                key: 'funding_plan_team_report_detail',
                name: '小组资金计划报表详情'
              }
            ]
          },
          {
            key: 'funding_plan_finance_report',
            name: '总院财务资金计划报表',
            child: [
              {
                key: 'funding_plan_deptMgr_report_detail',
                name: '部门资金计划报表详情'
              }
            ]
          },
          {
            key: 'funding_plan_branch_finance_report',
            name: '分院财务资金计划报表',
            child: [
              {
                key: 'funding_plan_deptMgr_report_detail',
                name: '部门资金计划报表详情'
              }
            ]
          },
          {
            key: 'funding_plan_office_supplies_mgt',
            name: '办公用品管理'
          }
        ]
      },
      {
        key: 'budget_management',
        name: '预算管理',
        clickable: false,
        child: [
          {
            key: 'annual_budget',
            name: '年度预算'
          },
          {
            key: 'budget_implementation',
            name: '年度预算执行情况'
          },
          {
            key: 'rolling_budget',
            name: '滚动预算'
          },
          {
            key: 'monthly_budget_completion',
            name: '月度预算执行情况'
          },
          {
            key: 'budget_cost_mgt',
            name: '费用科目维护'
          },
          {
            key: 'dept_budget',
            name: '部门自管经费'
          },
          {
            key: 'depreciation_budget',
            name: '折旧摊销'
          },
          {
            key: 'whole_netWork',
            name: '全网性成本费用'
          },
          {
            key: 'office_budget_completion',
            name: '办公室归口'
          },
          {
            key: 'hr_budget_completion',
            name: '人力资源归口'
          },
        ]
      },
      {
        key: 'dw_db',
        name: 'DW管理系统',
        clickable: false,
        child:[
          {
            key: 'dw_erp_core',
            name: 'ERP核心'
          },
          {
            key: 'dw_expense_system',
            name: '报账系统'
          },
        ]
      },
      {
        key: 'amortize',
        name: '折旧分摊',
        clickable: false,
        child:[
          {
            key: 'equipment_software',
            name: 'IT设备及通用软件摊销'
          },
          {
            key: 'office_software',
            name: '办公设备摊销'
          },
        ]
      }
    ]
  },
  // 综合应用
  {
    key: 'adminApp',
    name: '综合应用',
    clickable: false,
    child: [
      {
        key: 'meetSystem',
        name: '会议室管理',
        clickable: false,
        child: [
          {
            key: 'order',
            name: '会议预定'
          },
          {
            key: 'myOrder',
            name: '我的预定'
          },
          {
            key: 'orderSearch',
            name: '预定查询'
          },
          {
            key: 'meetList',
            name: '会议列表'
          },
          {
            key: 'meeting_setting',
            name: '会议室列表',
            child: [
              {
                key: 'meetroomConfig',
                name: '会议室配置'
              }
            ]
          },
          {
            key: 'basic_setting',
            name: '基础配置'
          },
          {
            key: 'ou_setting',
            name: '组织单元配置'
          },
          {
            key: 'meet_statistical',
            name: '会议统计'
          },
          {
            key: 'limited',
            name: '会议室限制'
          },
          {
            key: 'forced',
            name: '强制取消'
          }
        ]
      },
      {
        key: 'meetManage',
        name: '会议管理系统',
        clickable: false,
        child: [{
          key: 'topicApply',
          name: '议题申请'
        }, {
          key: 'topicApply/topicWrite',
          name: '议题填报'
        }, {
          key: 'topicApply/topicReset',
          name: '议题修改'
        }, {
          key: 'topicApply/topicDetails',
          name: '议题详情'
        }, {
          key: 'myJudge',
          name: '我的审核'
        }, {
          key: 'myJudge/topicJudge',
          name: '议题审核'
        }, {
          key: 'myJudge/officeJudge',
          name: '管理员审核'
        }, {
          key: 'myJudge/pricedentJudge',
          name: '议题清单审核'
        }, {
          key: 'myJudge/myComplete',
          name: '已办/办结详情'
        }, {
          key: 'myJudge/dataJudge',
          name: '归档审核'
        }, {
          key: 'config',
          name: '会议配置'
        }, {
          key: 'topicStatistics',
          name: '议题统计'
        }, {
          key: 'meetingConfirm',
          name: '会议确认',
          child: [{
            key: 'meetingReset',
            name: '修改填报议题'
          }]
        }, {
          key: 'meetingQuery',
          name: '会议查询'
        }, {
          key: 'addMeeting',
          name: '会议生成',
          child: [{
            key: 'passMeetingNote',
            name: '上会会议生成通知'
          }, {
            key: 'addMeetingNote',
            name: '会议生成通知'
          }]
        }, {
          key: 'countdown',
          name: '倒计时',
        },]
      },
      {
        key: 'sealManage',
        name: '印章证照管理系统',
        clickable: false,
        child: [
          {
            key: 'sealIndexApply',
            name: '用印申请'
          },
          {
            key: 'sealPersonalQuery',
            name: '个人查询'
          },
          {
            key: 'sealPersonalQuery/borrowBusinessDetail',
            name: '营业执照外借申请详情'
          },
          {
            key: 'sealPersonalQuery/leaderIDDetail',
            name: '院领导身份证复印件使用申请详情'
          },
          {
            key: 'sealPersonalQuery/sealLeaderDetail',
            name: '院领导名章使用申请详情'
          },
          {
            key: 'sealPersonalQuery/sealComDetail',
            name: '印章使用申请详情'
          },
          {
            key: 'sealPersonalQuery/businessLicenseDetail',
            name: '营业执照使用申请详情'
          },
          {
            key: 'sealPersonalQuery/borrowSealDetail',
            name: '印章外借申请详情'
          },
          {
            key: 'sealPersonalQuery/borrowLeaderDetail',
            name: '院领导名章外借申请详情'
          },
          {
            key: 'sealPersonalQuery/markSealDetail',
            name: '刻章申请审批详情'
          },
          {
            key: 'managerSealQuery',
            name: '用印查询'
          },
          {
            key: 'managerSealQuery/borrowBusinessDetail',
            name: '营业执照外借申请详情'
          },
          {
            key: 'managerSealQuery/leaderIDDetail',
            name: '院领导身份证复印件使用申请详情'
          },
          {
            key: 'managerSealQuery/sealLeaderDetail',
            name: '院领导名章使用申请详情'
          },
          {
            key: 'managerSealQuery/sealComDetail',
            name: '印章使用申请详情'
          },
          {
            key: 'managerSealQuery/businessLicenseDetail',
            name: '营业执照使用申请详情'
          },
          {
            key: 'managerSealQuery/borrowSealDetail',
            name: '印章外借申请详情'
          },
          {
            key: 'managerSealQuery/borrowLeaderDetail',
            name: '院领导名章外借申请详情'
          },
          {
            key: 'managerSealQuery/markSealDetail',
            name: '刻章申请审批详情'
          },
          {
            key: 'sealTypeConfig',
            name: '用印配置'
          },
          {
            key: 'sealIndexApply/sealComApply',
            name: '印章使用申请'
          },
          {
            key: 'sealIndexApply/businessLicenseApply',
            name: '营业执照使用申请'
          },
          {
            key: 'sealIndexApply/sealLeaderApply',
            name: '院领导名章使用申请'
          },
          {
            key: 'sealIndexApply/sealLeaderIDApply',
            name: '院领导身份证复印件申请'
          },
          {
            key: 'sealIndexApply/borrowSeal',
            name: '印章外借申请'
          },
          {
            key: 'sealIndexApply/borrowBusiness',
            name: '营业执照外借申请'
          },
          {
            key: 'sealIndexApply/borrowLeader',
            name: '院领导名章外借申请'
          },
          {
            key: 'markSeal',
            name: '刻章申请'
          },
          {
            key: 'myJudge',
            name: '我的审核'
          },
          {
            key: 'sealPersonalQuery/sealComReset',
            name: '印章使用申请修改'
          },
          {
            key: 'myJudge/sealComJudge',
            name: '印章使用申请审批'
          },
          {
            key: 'sealPersonalQuery/sealLeaderReset',
            name: '院领导名章使用申请修改'
          },
          {
            key: 'myJudge/sealLeaderJudge',
            name: '院领导名章使用申请审批'
          },
          {
            key: 'sealPersonalQuery/businessLicenseReset',
            name: '营业执照使用申请修改'
          },
          {
            key: 'myJudge/businessLicenseJudge',
            name: '营业执照使用申请审批'
          },
          {
            key: 'sealPersonalQuery/leaderIDReset',
            name: '院领导身份证复印件使用申请修改'
          },
          {
            key: 'myJudge/leaderIDJudge',
            name: '院领导身份证复印件使用申请审批'
          },
          {
            key: 'sealPersonalQuery/borrowSealReset',
            name: '印章外借申请修改'
          },
          {
            key: 'myJudge/borrowSealJudge',
            name: '印章外借申请审批'
          },
          {
            key: 'sealPersonalQuery/borrowBusinessReset',
            name: '营业执照外借申请修改'
          },
          {
            key: 'myJudge/borrowBusinessJudge',
            name: '营业执照外借申请审批'
          },
          {
            key: 'sealPersonalQuery/borrowLeaderReset',
            name: '院领导名章外借申请修改'
          },
          {
            key: 'myJudge/borrowLeaderJudge',
            name: '院领导名章外借申请审批'
          },
          {
            key: 'sealPersonalQuery/markSealReset',
            name: '刻章申请修改'
          },
          {
            key: 'myJudge/markSealJudge',
            name: '刻章申请审批'
          },

          {
            key: 'myComplete',
            name: '我的审核'
          },
          {
            key: 'myJudge/leaderIDDetail',
            name: '院领导身份证复印件使用申请审批详情'
          },
          {
            key: 'myJudge/sealLeaderDetail',
            name: '院领导名章使用申请审批详情'
          },
          {
            key: 'myJudge/sealComDetail',
            name: '印章使用申请审批详情'
          },
          {
            key: 'myJudge/businessLicenseDetail',
            name: '营业执照使用申请审批详情'
          },
          {
            key: 'myJudge/borrowSealDetail',
            name: '印章外借申请审批详情'
          },
          {
            key: 'myJudge/borrowLeaderDetail',
            name: '院领导名章外借申请审批详情'
          },
          {
            key: 'myJudge/borrowBusinessDetail',
            name: '营业执照外借申请审批详情'
          },
          {
            key: 'myJudge/markSealDetail',
            name: '刻章申请审批详情'
          },
        ]
      },
      {
        key: 'compRes',
        name: '综合资源管理',
        clickable: false,
        child: [
          {
            key: 'qrcode_locationres',
            name: '场地资源',
            child: [
              {
                key: 'qrbulkImport',
                name: '批量导入'
              },
              {
                key: 'qrAbandon',
                name: '我的废弃'
              }
            ]
          },
          {
            key: 'qrcode_office_equipment',
            name: '办公设备',
            child: [
              {
                key: 'qrbulkImport',
                name: '批量导入'
              },
              {
                key: 'qrAbandon',
                name: '我的废弃'
              },
              {
                key: 'assetLendingInformation',
                name: '资产借还信息查询',
                child: [
                  {
                    key: 'assetLendingDetail',
                    name: '借还信息查询'
                  }
                ]
              }
            ]
          },
          {
            key: 'qrcode_living_facilities',
            name: '生活设施',
            child: [
              {
                key: 'qrbulkImport',
                name: '批量导入'
              },
              {
                key: 'qrAbandon',
                name: '我的废弃'
              }
            ]
          },
          {
            key: 'officeResMain',
            name: '办公资源',
            child: [
              {
                key: 'commonPageOne',
                name: '工位图'
              },
              {
                key: 'commonPage',
                name: '工位图'
              },
              {
                key: 'officeRes',
                name: '二号楼7层工位图'
              },
              {
                key: 'officeConfig',
                name: '配置',
                child: [
                  {
                    key: "blackList",
                    name: '黑名单'
                  }
                ]
              },
              {
                key: 'apply',
                name: '申请工位',
                child: [
                  {
                    key: "applyRecord",
                    name: "申请记录查询",
                    child: [
                      {
                        key: "Details",
                        name: '查询详情'
                      }
                    ]
                  }
                ]
              },
              {
                key: 'delayWorkstation',
                name: '延期工位'
              },
              {
                key: 'releaseWorkstation',
                name: '释放工位'
              },
            ]
          },
          {
            key: 'todoList',
            name: '我的待办',
            child: [
              {
                key: 'adminApplicationRecord',
                name: '审批记录',
                child: [
                  {
                    key: 'adminDetail',
                    name: '申请记录查询',
                  }
                ]
              }, {
                key: 'adminExamine',
                name: '工位审批',
                child: [
                  {
                    key: 'assignPage',
                    name: '工位暂存',
                  },
                  {
                    key: 'assignPageSeven',
                    name: '工位暂存',
                  },
                  {
                    key: 'assignPageSevenDetails',
                    name: '工位暂存',
                  },
                ]
              }, {
                key: 'managerApplyRecord',
                name: '审批记录',
                child: [
                  {
                    key: 'managerDetail',
                    name: '申请记录查询',
                  }
                ]
              }
            ]
          },
        ]
      },
      {
        key: 'regulationM',
        name: '规章制度管理',
        clickable: false,
        child: [
          {
            key: 'ruleRegulation',
            name: '规章制度列表',
            child: [
              {
                key: 'ruleDetail',
                name: '规章制度详情'
              }
            ]
          },
          {
            key: 'globalMessage',
            name: '全部留言'
          },
          {
            key: 'myUpload',
            name: '我的上传列表',
            child: [
              {
                key: 'upload',
                name: '我的上传详情'
              }
            ]
          },
          {
            key: 'myApproval',
            name: '我的审批'
          },
          {
            key: 'myBack',
            name: '我的退回'
          },
          {
            key: 'myMessage',
            name: '我的留言'
          },
          {
            key: 'editType',
            name: '类别管理'
          },
          {
            key: 'downloadReport',
            name: '下载统计'
          },
          {
            key: 'subEditType',
            name: '平台子管理员管理'
          }
        ]
      },
      {
        key: 'commonDataSystem',
        name: '常用资料系统',
        clickable: false,
        child: [
          {
            key: 'commonData',
            name: '常用资料',
            child: [
              {
                key: 'UploadFiles',
                name: '上传文件'
              }
            ]
          }, {
            key: 'managerConfig',
            name: '管理配置',
          }, {
            key: 'directoryConfig',
            name: '目录配置'
          },
          {
            key: 'myBiography',
            name: '我的已传'
          },
        ],
      },
      {
        key: 'securityCheck',
        name: '安全管理系统',
        clickable: false,
        child: [
          {
            key: 'safeCheck',
            name: '安委办检查',
            child: [  
              {
                key: 'setNewTask',
                name: '新建任务'
              },
              {
                key: 'modifyTask',
                name: '修改任务'
              },
              {
                key: 'checkDetailing',
                name: '检查任务详情'
              },
              {
                key: 'checkFinish',
                name: '检查任务详情'
              },
            ]
          },
          {
            key: 'branchCheck',
            name: '分院检查',
            child: [  
              {
                key: 'setNewTask',
                name: '新建任务'
              },
              {
                key: 'modifyTask',
                name: '修改任务'
              },
              {
                key: 'checkDetailing',
                name: '检查任务详情'
              },
              {
                key: 'checkFinish',
                name: '检查任务详情'
              },
            ]
          },
          {
            key: 'deptCheck',
            name: '部门自查',
            child: [
              {
                key: 'setNewTask',
                name: '新建任务'
              },
              {
                key: 'modifyTask',
                name: '修改任务'
              },
              {
                key: 'checkDetailing',
                name: '检查任务详情'
              },
              {
                key: 'checkFinish',
                name: '检查任务详情'
              },
            ]
          },
          {
            key: 'SecurityControlSystem',
            name: '安控体系',
            child: [
              {
                key: 'updateDetails',
                name: '更新状态',
              }
            ]
          },
          {
            key: 'checkConfig',
            name: '检查配置',
          },
          {
            key: 'checkStatistics',
            name: '情况统计',
            child: [
              {
                key: 'createReport',
                name: '创建报告',
              },
              {
                key: 'reportInFor',
                name: '查看详情',
              },
              {
                key: 'createdReportInfor',
                name: '创建报告详情',
              },
            ]
          },
          {
            key: 'myNews',
            name: '我的消息',
            child: [
              {
                key: 'modifyTask',
                name: '派发检查任务',
              },
              {
                key: 'safetyTask',
                name: '整改通知',
              },
              {
                key: 'rectificationNotice',
                name: '员工自查任务',
              },
              {
                key: 'rectificationFeedback',
                name: '整改反馈消息',
              },
              {
                key: 'staffSupervision',
                name: '员工督查反馈',
              },
              {
                key: 'unqualifiedFeedback',
                name: '对不合格的反馈',
              },
              {
                key: 'requestForNotification',
                name: '通报意见征求反馈',
              },
              {
                key: 'approvalStatistics',
                name: '审批统计报告',
              }
            ]
          },
          {
            key: 'Notification',
            name: '通知通报',
            child: [
              {
                key: 'lnspectionRecommendations',
                name: '督查建议反馈',
              },
              {
                key: 'employeeInspection',
                name: '抄送页面（督查反馈）',
              },
              {
                key: 'checkNotice',
                name: '安全检查通知详情',
              },
              {
                key: 'tongBaoYiJian',
                name: '通报意见',
              },
              {
                key: 'statisticalBulletin',
                name: '统计通报',
              },
              {
                key: 'leaderApproval',
                name: '领导审批意见',
              },
              {
                key: 'bulletin',
                name: '通报',
              },
              {
                key: 'praise',
                name: '表扬 ',
              },
              {
                key: 'rectificationResults',
                name: '检查结果 ',
              },
              {
                key: 'lnterfaceReport',
                name: '安全检查情况',
              },
              {
                key: 'branchStatisticsReport',
                name: '分院统计报告上报 ',
              }
            ]
          },
        ],
      },
    {
      key: 'carsManage',
      name: '车辆管理系统',
      clickable: false,
      child: [
        {
          key: 'carsApply',
          name: '用车申请',
          child: [
            {
              key: 'applyIndex',
              name: '申请首页',
            },{
              key: 'carsApplyInput',
              name: '用车申请填报',
            },{
              key: 'carsApplyModify',
              name: '用车申请修改',
            }
          ]
        },{
          key: 'carsQuery',
          name: '用车查询',
          clickable: false,
          child: [
            {
              key: 'applyDetails',
              name: '审批详情',
            }
          ]
        },{
          key: 'carsStatistics',
          name: '用车统计',
          clickable: false,
          child: [
            {
              key: 'buildReport',
              name: '生成用车统计报告',
            },
            {
              key: 'showReport',
              name: '统计报告详情',
            },
          ]
        },{
          key: 'myJudge',
          name: '我的审核',
          clickable: false,
          child: [
            {
              key: 'judgePage',
              name: '审批页面',
            }
          ]
        },
      ]
    },
    {
      key: 'newsOne',
      name: '新闻管理平台',
      clickable: false,
      child: [
        {
          key: 'publicityChannelsIndex',
          name: '自有宣传渠道',
          child: [{
            key: 'publicityChannelsWrite',
            name: '渠道填报'
          }, {
            key: 'publicityChannelsDetails',
            name: '填报详情'
          }, {
            key: 'publicityChannelsReset',
            name: '渠道修改'
          }]
        },
        {
          key: 'experienceSharingIndex',
          name: '案例与经验分享',
          child: [{
            key: 'experienceSharingWrite',
            name: '案例与经验申请填报'
          }, {
            key: 'experienceSharingDetails',
            name: '案例与经验填报详情'
          }, {
            key: 'experienceSharingReset',
            name: '案例与经验申请修改'
          }]
        },
        {
          key: 'newsPoolIndex',
          name: '新闻宣传资源池',
          child: [
            {
              key: 'manuscriptDetails',
              name: '稿件详情' 
            },
          ]
        },
        {
          key: 'manuscriptManagement',
          name: '稿件管理',
          child: [
            {
              key: 'setNewManuscript',
              name: '稿件填报'
            },
            {
              key: 'manuscriptRevision',
              name: '稿件修改'
            },
            {
              key: 'manuscriptDetails',
              name: '稿件详情'
            },

          ]
        },
        {
          key: 'releaseOfManuscripts',
          name: '稿件发布情况',
          clickable: false,
          child: [
            {
              key: 'releaseOfManuscriptsDetails',
              name: '稿件发布详情'
            }
          ]
        },
        {
          key: 'statisticalReport',
          name: '统计报表',
          clickable: false,
          child: [

          ]
        },
        {
          key: 'creatExcellence',
          name: '争先创优',
          clickable: false,
          child: [
            {
              key: 'advancedUpload',
              name: '评优评选结果上传',
            },
            {
              key: 'eachUpload',
              name: '评优评选结果上传',
            },
            {
              key: 'newsReportDetail',
              name: '新闻工作报告详情',
            },
            {
              key: 'newsReportModify',
              name: '新闻工作报告修改',
            },
            {
              key: 'newsReportAdd',
              name: '新闻工作报告填报',
            }
          ]
        },
        {
          key: 'opinionManagementIndex',
          name: '舆情管理',
          clickable: false,
          child: [
            {
              key: 'opinionReport',
              name: '舆情报告',
            },
            {
              key: 'opinionAdd',
              name: '舆情报告填报',
            },
            {
              key: 'opinionModify',
              name: '舆情报告修改',
            },
          ]
        },
        {
          key: 'newsConfigurationIndex',
          name: '新闻配置',
          clickable: false,
        },
        {
          key: 'contributionList',
          name: '新闻宣传贡献清单',
          clickable: false,
          child: [
            {
              key: 'TrainBulkUpload',
              name: '培训批量上传',
            },
            {
              key: 'trainAppIndex',
              name: '培训申请',
            },
            {
              key: 'trainAppIndex/trainAppWrite',
              name: '培训填报',
            },
            {
              key: 'trainAppIndex/trainAppModify',
              name: '培训修改',
            },
            {
              key: 'trainAppIndex/trainAppDetail',
              name: '培训详情',
            },
            {
              key: 'majorSupportIndex',
              name: '重大活动支撑',
            },
            {
              key: 'majorSupportIndex/majorSupportWrite',
              name: '重大活动支撑填报',
            },
            {
              key: 'majorSupportIndex/majorSupportDetail',
              name: '重大活动支撑详情',
            },
            {
              key: 'majorSupportIndex/majorSupportModify',
              name: '重大活动支撑数据修改',
            },
          ]
        },
        {
          key: 'myReview',
          name: '我的审核',
          clickable: false,
          child: [

          ]
        },

      ]
    }


  ]
}
]



