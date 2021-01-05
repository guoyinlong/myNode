/**
 * 作者：陈莲
 * 日期：2018-7-3
 * 邮箱：chenl192@chinaunicom.cn
 * 文件说明：财务应用路由配置
 */
function financeRouterConfig({history, app, registerModel}) {
  let router = [
    {
      path: 'financeApp',//全成本模块
      name: 'financeApp',
      childRoutes: [
        {
          path: 'cost_costmainten',//第一部分：费用科目维护
          name: 'cost_costmainten',
          childRoutes: [
            {
              path: 'cost_fee_mgt',//费用科目管理
              name: "cost_fee_mgt",
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/feeManager/costmainten.js'));
                  cb(null, require('./routes/finance/cost/feeManager/costmainten.js'));
                });
              }
            }
          ]
        },
        {
          path: 'cost_proj_fullcost_mgt',//第五部分：项目全成本管理
          name: 'cost_proj_fullcost_mgt',
          childRoutes: [
            {
              path: 'cost_budget_mgt',//项目全成本预算查询
              name: 'cost_budget_mgt',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/cost_budget/cost_budget_sel'));
                  cb(null, require('./routes/finance/cost/cost_budget/cost_budget_sel'));
                });
              }
            },
            {
              path: 'full_cost_total',//全成本汇总
              name: 'full_cost_total',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/cost_budget/proj_budget_proj_sum'));
                  cb(null, require('./routes/finance/cost/cost_budget/proj_budget_proj_sum'));
                });
              }
            },
            {
              path: 'full_cost_subtotal',//全成本分类汇总
              name: 'full_cost_subtotal',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/cost_budget/proj_cost_collectExcel'));
                  cb(null, require('./routes/finance/cost/cost_budget/proj_cost_collectExcel'));
                });
              }
            },
            {
              path: 'ou_full_cost_mgt',//OU/部门项目全成本预算完成情况汇总
              name: 'ou_full_cost_mgt',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/cost_budget/ouFullCost'));
                  cb(null, require('./routes/finance/cost/cost_budget/ouFullCost'));
                });
              }
            },
            /* 修改人：耿倩倩
             * 修改日期：2017-11-01
             * 邮箱：gengqq3@chinaunicom.cn
             * 修改内容：项目全成本预算执行情况管理路由配置
             */
            {
              path: 'cost_projbudgetgoing_mgt',//项目全成本预算执行情况管理
              name: 'cost_projbudgetgoing_mgt',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/cost_budget/projCostBudgetExecuteManage'));
                  cb(null, require('./routes/finance/cost/cost_budget/projCostBudgetExecuteManage'));
                });
              }
            },
            /**
             * 修改人：耿倩倩
             * 修改日期：2017-11-01
             * 邮箱：gengqq3@chinaunicom.cn
             * 修改内容：项目全成本预算执行情况汇总_全年路由配置
             */
            {
              path: 'cost_projbudgetgoingbyyear_mgt',//项目全成本预算执行情况汇总_全年
              name: 'cost_projbudgetgoingbyyear_mgt',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/cost_budget/projCostBudgetExecuteSummary'));
                  cb(null, require('./routes/finance/cost/cost_budget/projCostBudgetExecuteSummary'));
                });
              }
            },
            {
              path: 'full_cost_progress_chart',//项目全成本指标展示
              name: 'full_cost_progress_chart',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/cost_budget/projCostKpiShow'));
                  cb(null, require('./routes/finance/cost/cost_budget/projCostKpiShow'));
                });
              }
            },
            {
              path: 'proj_apportion_state_mgt',//项目分摊成本人均标准维护
              name: 'proj_apportion_state_mgt',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/cost_budget/projCostShareState'));
                  cb(null, require('./routes/finance/cost/cost_budget/projCostShareState'));
                });
              }
            },
            {
              path: 'proj_cost_detail',//项目成本明细表
              name: 'proj_cost_detail',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/cost_budget/projCostDetail'));
                  cb(null, require('./routes/finance/cost/cost_budget/projCostDetail'));
                });
              }
            },
            {
              path: 'stcp_cost_detail',//科技创新项目支出明细
              name: 'stcp_cost_detail',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/stcpDetail/stcpCostDetail'));
                  cb(null, require('./routes/finance/cost/stcpDetail/stcpCostDetail'));
                });
              }
            },
            /* 修改人：郝锐
             * 修改日期：2017-11-11
             * 邮箱：haor@itnova.com.cn
             * 修改内容：部门预算完成情况
             */
            {
              path: 'dept_full_cost_mgt',
              name: 'dept_full_cost_mgt',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/cost_budget/dept_full_cost_mgt'));
                  cb(null, require('./routes/finance/cost/cost_budget/dept_full_cost_mgt'));
                })
              }
            },
            {
              path: 'comprehensive_query',
              name: 'comprehensive_query',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/cost_budget/comprehensive_query'));
                  cb(null, require('./routes/finance/cost/cost_budget/comprehensive_query'));
                })
              }
            }
          ]
        },
        {
          path: 'cost_erp_fileupload',//第二部分：ERP成本导入
          name: 'cost_erp_fileupload',
          childRoutes: [
            {
              path: 'erp_fileupload_mgt',//直接成本间接成本上传
              name: 'erp_fileupload_mgt',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/erpImport/erpFileupload'));
                  cb(null, require('./routes/finance/cost/erpImport/erpFileupload'));
                });
              }
            },
            {
              path: 'labour_cost_maintain',//人工成本管理
              name: 'labour_cost_maintain',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/erpImport/labourCost'));
                  cb(null, require('./routes/finance/cost/erpImport/labourCost'));
                });
              }
            },
            {
              path: 'straight_cost_mgt',//直接成本管理
              name: 'straight_cost_mgt',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/erpImport/straightCost'));
                  cb(null, require('./routes/finance/cost/erpImport/straightCost'));
                });
              }
            },
            {
              path: "indirect_cost_mgt",//间接成本管理
              name: 'indirect_cost_mgt',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/erpImport/indirectCost'));
                  cb(null, require('./routes/finance/cost/erpImport/indirectCost'));
                });
              }
            },
            {
              path: 'proj_eq_amo',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/erpImport/proj_eq_amo'));
                  cb(null, require('./routes/finance/cost/erpImport/proj_eq_amo'));
                });
              }
            }
          ]
        },
        {
          path: 'cost_dept_apportion',//部门分摊
          name: 'cost_dept_apportion',
          childRoutes: [
            {
              path: 'personnel_changes_mgt',//人员变动管理
              name: "personnel_changes_mgt",
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/deptApportion/personnelChangesManage.js'));
                  cb(null, require('./routes/finance/cost/deptApportion/personnelChangesManage.js'));
                });
              }
            },
            {
              path: 'dept_apportion_mgt',//部门分摊管理
              name: "dept_apportion_mgt",
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/deptApportion/deptApportionManage.js'));
                  cb(null, require('./routes/finance/cost/deptApportion/deptApportionManage.js'));
                });
              }
            },
          ]
        },
        {
          path: 'cost_proj_apportion',//项目分摊
          name: 'cost_proj_apportion',
          childRoutes: [
            {
              path: 'timesheet_mgt',//工时管理
              name: "timesheet_mgt",
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/projectApportion/timeSheetManage.js'));
                  cb(null, require('./routes/finance/cost/projectApportion/timeSheetManage.js'));
                });
              }
            },
            {
              path: 'proj_apportion_mgt',//项目分摊管理
              name: "proj_apportion_mgt",
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/projectApportion/projectApportionManage.js'));
                  cb(null, require('./routes/finance/cost/projectApportion/projectApportionManage.js'));
                });
              }
            }
          ]
        },
        {
          path: 'dw_db',//DW 管理系统
          name: 'dw_db',
          childRoutes: [
            {
              path: 'dw_expense_system',//报账系统
              name: "dw_expense_system",
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/feeManager/dwExpense.js'));
                  cb(null, require('./routes/finance/cost/feeManager/dwExpense.js'));
                });
              }
            },
            {
              path: 'dw_erp_core',//ERP核心
              name: "dw_erp_core",
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/finance/cost/feeManager/dwErp.js'));
                  cb(null, require('./routes/finance/cost/feeManager/dwErp.js'));
                });
              }
            }
          ]
        },
      ]
    },
    {
      path: 'financeApp/cost_proj_divided_mgt',//加计扣除模块
      name: 'financeApp/cost_proj_divided_mgt',
      childRoutes: [
        {
          path: 'divided_mainpage_mgt',//研发支出辅助账列表页面
          name: 'divided_mainpage_mgt',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/KakeDeducting/subsidiary/subsidiaryList.js'));
              cb(null, require('./routes/finance/KakeDeducting/subsidiary/subsidiaryList.js'));
            });
          }
        },
        {
          path: 'divided_mainpage_mgt/divided_support_mgt',//研发支出辅助账详情页面
          name: 'divided_mainpage_mgt/divided_support_mgt',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/KakeDeducting/subsidiary/subsidiaryDetail.js'));
              cb(null, require('./routes/finance/KakeDeducting/subsidiary/subsidiaryDetail.js'));
            });
          }
        },
        {
          path: 'divided_summary_mgt',//辅助账汇总
          name: 'divided_summary_mgt',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/KakeDeducting/subsidiaryCollect/subsidiaryCollect.js'));
              cb(null, require('./routes/finance/KakeDeducting/subsidiaryCollect/subsidiaryCollect.js'));
            });
          },
        },
        {
          path: 'divided_collection_mgt',//费用归集
          name: 'divided_collection_mgt',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/KakeDeducting/costpool/costpool.js'));
              cb(null, require('./routes/finance/KakeDeducting/costpool/costpool.js'));
            });
          },
        }
      ]
    },
    // 资金计划
    {
      path: 'financeApp/funding_plan',
      name: 'financeApp/funding_plan',
      childRoutes: [
        {
          path: 'funding_plan_fill',//资金计划预填报
          name: 'funding_plan_fill',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanFillNew.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanFillNew/fundingPlanPreFill.js'));
            });
          }
        },
        {
          path: 'funding_plan_append_fill',//资金计划追加.
          name: 'funding_plan_append_fill',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanFillNew.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanFillNew/fundingPlanAppendFill.js'));
            });
          }
        },
        {
          path: 'funding_plan_start',//资金计划启动
          name: 'funding_plan_start',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanStart.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanStart.js'));
            });
          }
        },
        {
          path: 'funding_plan_review',//资金计划审核
          name: 'funding_plan_review',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanReview.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanReview.js'));
            });
          }
        },
        {
          path: 'funding_plan_person_search',//资金计划查询
          name: 'funding_plan_person_search',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanSearch/commonSearch.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanSearch/personSearch.js'));
            });
          }
        },
        {
          path: 'funding_plan_team_search',//资金计划查询
          name: 'funding_plan_team_search',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanSearch/commonSearch.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanSearch/teamSearch.js'));
            });
          }
        },
        {
          path: 'funding_plan_deptMgr_search',//资金计划查询
          name: 'funding_plan_deptMgr_search',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanSearch/commonSearch.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanSearch/deptMgrSearch.js'));
            });
          }
        },
        {
          path: 'funding_plan_finance_search',//资金计划查询
          name: 'funding_plan_finance_search',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanSearch/commonSearch.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanSearch/financeSearch.js'));
            });
          }
        },
        {
          path: 'funding_plan_branch_finance_search',//资金计划查询
          name: 'funding_plan_branch_finance_search',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanSearch/commonSearch.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanSearch/branchFinanceSearch.js'));
            });
          }
        },
        {
          path: 'funding_plan_budget_person_query',//资金计划查询
          name: 'funding_plan_budget_person_query',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanQuery/personFundingPlanQuery.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanQuery/personFundingPlanQuery/personFundingPlanQuery.js'));
            });
          }
        },
        {
          path: 'funding_plan_budget_team_query',//资金计划查询
          name: 'funding_plan_budget_team_query',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanQuery/personFundingPlanQuery.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanQuery/teamFundingPlanQuery/teamFundingPlanQuery.js'));
            });
          }
        },
        {
          path: 'funding_plan_budget_deptMgr_query',//资金计划查询
          name: 'funding_plan_budget__deptMgr_query',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanQuery/personFundingPlanQuery.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanQuery/deptMgrFundingPlanQuery/deptMgrFundingPlanQuery.js'));
            });
          }
        },

        //资金计划-科目管理
        {
          path: 'fundingPlanAccountManagement',
          name: 'fundingPlanAccountManagement',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/management/account.js'));
              cb(null, require('./routes/finance/fundingPlan/management/account.js'));
            });
          }
        },

        //资金计划-小组管理
        {
          path: 'fundingPlanTeamManagement',
          name: 'fundingPlanTeamManagement',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/management/team.js'));
              cb(null, require('./routes/finance/fundingPlan/management/team.js'));
            });
          }
        },

        //资金计划-人员管理
        {
          path: 'fundingPlanPeopleManagement',
          name: 'fundingPlanPeopleManagement',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/management/staff.js'));
              cb(null, require('./routes/finance/fundingPlan/management/staff.js'));
            });
          }
        },

        {
          path: 'funding_plan_team_report',//小组资金计划报表
          name: 'funding_plan_team_report',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanReport/teamReport.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanReport/teamReport.js'));
            });
          }
        },
        {
          path: 'funding_plan_deptMgr_report',//部门资金计划报表
          name: 'funding_plan_deptMgr_report',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanReport/deptMgrReport.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanReport/deptMgrReport.js'));
            });
          }
        },
        {
          path: 'funding_plan_deptMgr_report/funding_plan_team_report_detail',//小组资金计划报表详情
          name: 'funding_plan_deptMgr_report/funding_plan_team_report_detail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanReport/teamReportDetail.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanReport/teamReportDetail.js'));
            });
          }
        },
        {
          path: 'funding_plan_finance_report',//总院财务资金计划报表
          name: 'funding_plan_finance_report',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanReport/financeReport.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanReport/financeReport.js'));
            });
          }
        },
        {
          path: 'funding_plan_finance_report/funding_plan_finance_report_detail',//各院财务资金计划报表
          name: 'funding_plan_finance_report/funding_plan_finance_report_detail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanReport/financeReportDetail.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanReport/financeReportDetail.js'));
            });
          }
        },
        {
          path: 'funding_plan_branch_finance_report',//分院财务资金计划报表
          name: 'funding_plan_branch_finance_report',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanReport/branchFinanceReport.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanReport/branchFinanceReport.js'));
            });
          }
        },
        {
          path: 'funding_plan_finance_report/funding_plan_deptMgr_report_detail',//总院部门资金计划报表详情
          name: 'funding_plan_finance_report/funding_plan_deptMgr_report_detail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanReport/deptMgrReportDetail.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanReport/deptMgrReportDetail.js'));
            });
          }
        },
        {
          path: 'funding_plan_branch_finance_report/funding_plan_deptMgr_report_detail',//分院部门资金计划报表详情
          name: 'funding_plan_branch_finance_report/funding_plan_deptMgr_report_detail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanReport/deptMgrReportDetail.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanReport/deptMgrReportDetail.js'));
            });
          }
        },
        {
          path: 'funding_plan_branch_finance_report/funding_plan_dept_report/funding_plan_team_report_detail',//分院-部门-小组资金计划报表详情
          name: 'funding_plan_branch_finance_report/funding_plan_dept_report/funding_plan_team_report_detail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanReport/teamReportDetail.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanReport/teamReportDetail.js'));
            });
          }
        },
        {
          path: 'funding_plan_finance_report/funding_plan_dept_report/funding_plan_team_report_detail',//总院-部门-小组资金计划报表详情
          name: 'funding_plan_finance_report/funding_plan_dept_report/funding_plan_team_report_detail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/fundingPlanReport/teamReportDetail.js'));
              cb(null, require('./routes/finance/fundingPlan/fundingPlanReport/teamReportDetail.js'));
            });
          }
        },
        {
          path: 'funding_plan_office_supplies_mgt',//办公用品管理
          name: 'funding_plan_office_supplies_mgt',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/fundingPlan/officeSuppliesMgt.js'));
              cb(null, require('./routes/finance/fundingPlan/officeSuppliesMgt.js'));
            });
          }
        },

      ]
    },
    // 预算管理
    {
      path: 'financeApp/budget_management',
      name: 'financeApp/budget_management',
      childRoutes: [
        {
          path: 'annual_budget',//年度预算表
          name: 'annual_budget',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/budgetManagement/annualBudget.js'));
              cb(null, require('./routes/finance/budgetManagement/annualBudget.js'));
            });
          }
        },
        {
          path: 'budget_implementation',//年度预算执行情况表
          name: 'budget_implementation',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/budgetManagement/budgetImplementation.js'));
              cb(null, require('./routes/finance/budgetManagement/budgetImplementation.js'));
            });
          }
        },
        {
          path: 'rolling_budget',//滚动预算
          name: 'rolling_budget',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/budgetManagement/rollingBudget.js'));
              cb(null, require('./routes/finance/budgetManagement/rollingBudget.js'));
            });
          }
        },
        {
          path: 'monthly_budget_completion',//月度预算完成情况
          name: 'monthly_budget_completion',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/budgetManagement/monthlyBudgetCompletion.js'));
              cb(null, require('./routes/finance/budgetManagement/monthlyBudgetCompletion.js'));
            });
          }
        },
        {
          path: 'budget_cost_mgt',//费用编码维护
          name: 'budget_cost_mgt',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/budgetManagement/costMgt.js'));
              cb(null, require('./routes/finance/budgetManagement/costMgt.js'));
            });
          }
        },
        {
          path: 'dept_budget',//部门自管经费
          name: 'dept_budget',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/budgetManagement/lastThreeTable.js'));
              cb(null, require('./routes/finance/budgetManagement/lastThreeTable/deptBudget.js'));
            });
          }
        },
        {
          path: 'depreciation_budget',//折旧分摊
          name: 'depreciation_budget',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/budgetManagement/lastThreeTable.js'));
              cb(null, require('./routes/finance/budgetManagement/lastThreeTable/depreciationBudget.js'));
            });
          }
        },
        {
          path: 'whole_netWork',//全网性费用
          name: 'whole_netWork',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/budgetManagement/lastThreeTable.js'));
              cb(null, require('./routes/finance/budgetManagement/lastThreeTable/wholeNetwork.js'));
            });
          }
        },
        {
          path: 'office_budget_completion',//办公室归口预算完成情况
          name: 'office_budget_completion',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/budgetManagement/officeBudgetCompletion.js'));
              cb(null, require('./routes/finance/budgetManagement/officeBudgetCompletion.js'));
            });
          }
        },
        {
          path: 'hr_budget_completion',//人力资源归口预算完成情况
          name: 'hr_budget_completion',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/budgetManagement/hrBudgetCompletion.js'));
              cb(null, require('./routes/finance/budgetManagement/hrBudgetCompletion.js'));
            });
          }
        },
      ]
    },
    //折旧分摊
    {
      path: 'financeApp/amortize',
      name: 'financeApp/amortize',
      childRoutes: [
        {
          path: 'equipment_software',//设备通用软件
          name: 'equipment_software',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/depreciation/equipment.js'));
              cb(null, require('./routes/finance/depreciation/equipment.js'));
            });
          }
        },
        {
          path: 'office_software',//办公用品管理
          name: 'office_software',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/depreciation/office.js'));
              cb(null, require('./routes/finance/depreciation/office.js'));
            });
          }
        }
      ]
    },
    // 组织绩效考核开始
    {
      path: 'financeApp/examine',
      name: 'financeApp/examine',
      childRoutes: [
        {
          path: 'report', // 填报列表
          name: 'report',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/indexModel'));
              cb(null, require('./routes/finance/examine/report/report'));
            });
          }
        },
        {
          path: 'report/reportDetail', // 填报详情
          name: 'reportDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/indexModel'));
              cb(null, require('./routes/finance/examine/report/reportDetailMain'));
            })
          }
        },
        {
          path: 'query', // 指标查询
          name: 'query',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/indexModel'));
              cb(null, require('./routes/finance/examine/report/report'));
            });
          }
        },
        {
          path: 'query/queryDetail', // 查询详情
          name: 'queryDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/indexModel'));
              cb(null, require('./routes/finance/examine/report/reportDetailMain'));
            })
          }
        },
        {
          path: 'evaluate', // 评价列表
          name: 'evaluate',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/indexModel'));
              cb(null, require('./routes/finance/examine/evaluate/evaluate'));
            })
          }
        },
        {
          path: 'evaluate/evaluateDetail', // 评价详情
          name: 'evaluateDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/indexModel'));
              cb(null, require('./routes/finance/examine/evaluate/evaluateDetail'));
            })
          }
        },
        {
          path: 'support', // 服务评价
          name: 'support',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/supportModel'));
              cb(null, require('./routes/finance/examine/support/support'));
            })
          }
        },
        {
          path: 'support/supportDetail',
          name: 'supportDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/supportModel'));
              cb(null, require('./routes/finance/examine/support/supportDetail'));
            })
          }
        },
        {
          path: 'setting', // 配置
          name: 'setting',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/indexModel'));
              registerModel(app, require('./models/finance/examine/supportModel'));
              registerModel(app, require('./models/finance/examine/allocationModel'));
              cb(null, require('./routes/finance/examine/setting/setting'));
            })
          }
        },
        {
          path: 'trackReport', // 经分指标完成情况填报
          name: 'trackReport',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/trackModel'));
              cb(null, require('./routes/finance/examine/track/trackReport'));
            })
          }
        },
        {
          path: 'trackReport/monthReportDetail',
          name: 'monthReportDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/trackModel'));
              cb(null, require('./routes/finance/examine/track/monthReportDetail'));
            })
          }
        },
        {
          path: 'trackReport/quarterReportDetail',
          name: 'quarterReportDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/trackModel'));
              cb(null, require('./routes/finance/examine/track/quarterReportDetail'));
            })
          }
        },
        {
          path: 'trackEvaluate', // 经分指标完成情况评价
          name: 'trackEvaluate',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/trackModel'));
              cb(null, require('./routes/finance/examine/track/trackEvaluate'));
            })
          }
        },
        {
          path: 'trackEvaluate/monthEvaluateDetail',
          name: 'monthEvaluateDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/trackModel'));
              cb(null, require('./routes/finance/examine/track/monthEvaluateDetail'));
            })
          }
        },
        {
          path: 'trackEvaluate/quarterEvaluateDetail',
          name: 'quarterEvaluateDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/finance/examine/trackModel'));
              cb(null, require('./routes/finance/examine/track/quarterEvaluateDetail'));
            })
          }
        }
      ]
    }
    // 组织绩效考核结束
  ];
  return router;
}

module.exports = {
  name: '财务路由文件',
  financeRouterConfig
}
