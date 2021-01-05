/* eslint-disable global-require */
/**
 * 作者：陈莲
 * 日期：2018-7-3
 * 邮箱：chenl192@chinaunicom.cn
 * 文件说明：项目应用路由配置
 */
function projectRouterConfig({ history, app, registerModel }) {
  let router = [
    /* 项目考核路由开始 */
    {
      path: "projectApp/projexam",
      name: "projectApp/projexam",
      childRoutes: [
        /* 结果查询列表 */
        {
          path: "examquery/proList",
          name: "examquery/proList",
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(
                app,
                require("./models/projectKpi/projectKpiModels")
              );
              cb(null, require("./routes/projectKpi/projectKpi"));
            });
          },
        },
        /* 卡片页 */
        {
          path: "examquery",
          name: "examquery",
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(
                app,
                require("./models/projectKpi/projectKpiModels")
              );
              cb(null, require("./routes/projectKpi/listCard"));
            });
          },
        },
        /* 结果查询详情 */
        {
          path: "examquery/detailKpi",
          name: "examquery/detailKpi",
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              //registerModel(app, require('./models/projectKpi/projectKpiModels'));
              //cb(null, require('./routes/projectKpi/projectDetail/projectKpiDetail'));
              registerModel(
                app,
                require("./models/projectKpi/projectKpiDetailModels")
              );
              cb(
                null,
                require("./routes/projectKpi/searchDetail/taskProKpiDetail")
              );
            });
          },
        },

        /* 考核设定-PM */
        {
          path: "kpifeedback",
          name: "kpifeedback",
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              //registerModel(app, require('./models/projectKpi/detailKpiModelsM'));
              //cb(null, require('./routes/projectKpi/manager/projectKpiDetailM'));
              registerModel(app, require("./models/projectKpi/projectKpiPM"));
              cb(null, require("./routes/projectKpi/PM/detail"));
            });
          },
        },

        /* 考核评价-TMO 开启考核 */
        {
          path: "examevaluate",
          name: "examevaluate",
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(
                app,
                require("./models/projectKpi/projectKpiModelsT")
              );
              cb(null, require("./routes/projectKpi/TMO/startProject"));
            });
          },
        },
        /* 考核评价-TMO 列表 */
        {
          path: "examevaluate/projectList",
          name: "examevaluate/projectList",
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(
                app,
                require("./models/projectKpi/projectKpiModelsT")
              );
              cb(null, require("./routes/projectKpi/TMO/TMOlist"));
            });
          },
        },

        /* 考核评价-TMO 详情 */
        {
          path: "examevaluate/projectList/detailKpiTMO",
          name: "examevaluate/projectList/detailKpiTMO",
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(
                app,
                require("./models/projectKpi/projectKpiModelsT")
              );
              cb(null, require("./routes/projectKpi/TMO/detail"));
            });
          },
        },

        /* 考核评价-TMO 详情 */
        {
          path: "examevaluate/projectList/detailKpiTMOLook",
          name: "examevaluate/projectList/detailKpiTMOLook",
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require("./models/projectKpi/projectKpiTMO"));
              cb(
                null,
                require("./routes/projectKpi/projectDetail/taskProKpiDetail")
              );
            });
          },
        },
        // 余数
        {
          path: "remainder",
          name: "remainder",
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require("./models/project/selectRemainder/selectRemainder"));
              cb(
                null,
                require("./routes/project/selectRemainder/selectRemainder")
              );
            });
          },
        },
        // 查询
        {
          path: "productunitquery",
          name: "productunitquery",
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require("./models/project/resultQuery/resultQuery"));
              cb(
                null,
                require("./routes/project/resultQuery/resultQuery")
              );
            });
          },
        },
        // 评级
        {
          path: "rating",
          name: "rating",
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require("./models/project/resultRate/resultRate"));
              cb(
                null,
                require("./routes/project/resultRate/resultRate")
              );
            });
          },
        },
      ],
    } /* 项目考核路由结束 */,
    /*项目制路由开始*/
    {
      path: "projectApp",
      name: "projectApp",
      childRoutes: [
        {
          path: "projexam",
          name: "projexam",
          childRoutes: [
            {
              path: "tmp_setting",
              name: "tmp_setting",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/standard/projAssessmentStandardTemplet/standardList")
                  );
                  cb(
                    null,
                    require("./routes/project/standard/projAssessmentStandardTemplet/standardList")
                  );
                });
              },
            },
            {
              path: "tmp_setting/projAssessmentStandardTempletInfo",
              name: "tmp_setting/projAssessmentStandardTempletInfo",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/standard/projAssessmentStandardTemplet/standardInfo")
                  );
                  cb(
                    null,
                    require("./routes/project/standard/projAssessmentStandardTemplet/standardInfo")
                  );
                });
              },
            },
            {
              path: "tmp_setting/projAssessmentStandardTempletDetail",
              name: "tmp_setting/projAssessmentStandardTempletDetail",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/standard/projAssessmentStandardTemplet/standardInfo")
                  );
                  cb(
                    null,
                    require("./routes/project/standard/projAssessmentStandardTemplet/standardDetail")
                  );
                });
              },
            },
            {
              path: "examsetting",
              name: "examsetting",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/standard/projAssessmentStandard/projAssessmentStandard")
                  );
                  cb(
                    null,
                    require("./routes/project/standard/projAssessmentStandard/projAssessmentStandard")
                  );
                });
              },
            },
            {
              path: "examsetting/projAssessmentStandardInfo",
              name: "examsetting/projAssessmentStandardInfo",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/standard/projAssessmentStandardInfo/projAssessmentStandardInfo")
                  );
                  cb(
                    null,
                    require("./routes/project/standard/projAssessmentStandardInfo/projAssessmentStandardInfo")
                  );
                });
              },
            },
            {
              path: "examsetting/projAssessmentStandardDetail",
              name: "examsetting/projAssessmentStandardDetail",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/standard/projAssessmentStandardDetail/projAssessmentStandardDetail")
                  );
                  cb(
                    null,
                    require("./routes/project/standard/projAssessmentStandardDetail/projAssessmentStandardDetail")
                  );
                });
              },
            },
            {
              path: "examallocation",
              name: "examallocation",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/standard/projAssessmentStandardSet/projAssessmentStandardSet")
                  );
                  cb(
                    null,
                    require("./routes/project/standard/projAssessmentStandardSet/projAssessmentStandardSet")
                  );
                });
              },
            },
          ],
        },
        /* 项目启动 */
        {
          path: "projStartUp",
          name: "projStartUp",
          childRoutes: [
            /* 项目信息管理 */
            {
              path: "projList",
              name: "projList",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/startup/projList")
                  );
                  cb(null, require("./routes/project/startup/projList"));
                });
              },
            },
            /**夏天   项目信息导出 */
            {
              path: "projInfoExport",
              name: "projInfoExport",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/startup/projInfoExport.js")
                  );
                  cb(
                    null,
                    require("./routes/project/startup/projInfoExport.js")
                  );
                });
              },
            },
            /* 项目PMS资本化 */
            {
              path: "projPmsCapital",
              name: "projPmsCapital",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/startup/projPmsCapital")
                  );
                  cb(null, require("./routes/project/startup/projPmsCapital"));
                });
              },
            },
            /*添加一个项目的所有信息*/
            {
              path: "projList/projMainPage",
              name: "projList/projMainPage",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  // if(app._models.some(val=>(val.namespace ===  'projectInfo'))) {
                  //     app.unmodel('projectInfo');
                  //     delete cached.projectInfo;
                  // }
                  registerModel(
                    app,
                    require("./models/project/startup/projAdd/projectInfo")
                  );
                  cb(
                    null,
                    require("./routes/project/startup/projAdd/projMainPage")
                  );
                });
              },
            },
            /*项目启动立项修改*/
            {
              path: "projList/projStartEdit",
              name: "projList/projStartEdit",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/startup/projStartMain/projMainPage.js")
                  );
                  cb(
                    null,
                    require("./routes/project/startup/projStartMain/projMainPage.js")
                  );
                });
              },
            },
          ],
        },
        /* 项目监控 */
        {
          path: "projMonitor",
          name: "projMonitor",
          childRoutes: [
            {
              /* 变更项目列表 */
              path: "change",
              name: "change",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/change/projChangeList")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/change/projChangeList")
                  );
                });
              },
            },

            /* 变更项目申请 */
            {
              path: "change/projChangeApply",
              name: "change/projChangeApply",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/change/projChangeApply")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/change/projChangeApply/applyMainPage")
                  );
                });
              },
            },
            /* 差旅费预算变更申请 */
            {
              path: "change/budgetChangeApply",
              name: "change/budgetChangeApply",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/change/budgetChangeApply")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/change/budgetChangeApply")
                  );
                });
              },
            },

            /* 交付物管理*/
            {
              path: "deliverable",
              name: "deliverable",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/deliverable/deliverable")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/deliverable/deliverable")
                  );
                });
              },
            },

            /* 风险跟踪 */
            {
              path: "risk",
              name: "risk",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/risk/projRiskManage")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/risk/projRiskManage")
                  );
                });
              },
            },
            /*一个项目的风险列表*/
            {
              path: "risk/projRiskList",
              name: "risk/projRiskList",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/risk/projRiskList")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/risk/projRiskList")
                  );
                });
              },
            },
            /* 编辑一条风险的信息*/
            {
              path: "risk/editRiskDetial",
              name: "risk/editRiskDetial",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/risk/projRiskList")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/risk/editRiskDetial")
                  );
                });
              },
            },
            /*新增一条风险的信息*/
            {
              path: "risk/addRiskDetial",
              name: "risk/addRiskDetial",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/risk/projRiskList")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/risk/addRiskDetial")
                  );
                });
              },
            },

            /**
             *Author: 仝飞
             *Date: 2017-11-9 14:49
             *Email: tongf5@chinaunicom.cn
             *功能：项目管理》项目监控》问题跟踪》
             */
            {
              path: "issueTrack",
              name: "issueTrack",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/issueTrack/projIssueTrackManage")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/issueTrack/projIssueTrackManage")
                  );
                });
              },
            },
            /*一个项目的问题列表*/
            {
              path: "issueTrack/projIssueTrackList",
              name: "issueTrack/projIssueTrackList",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/issueTrack/projIssueTrackList")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/issueTrack/projIssueTrackList")
                  );
                });
              },
            },
            /* 编辑一条问题的信息*/
            {
              path: "issueTrack/editIssueTrackDetial",
              name: "issueTrack/editIssueTrackDetial",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/issueTrack/projIssueTrackList")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/issueTrack/editIssueTrackDetial")
                  );
                });
              },
            },
            /*新增一条问题的信息*/
            {
              path: "issueTrack/addIssueTrackDetial",
              name: "issueTrack/addIssueTrackDetial",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/issueTrack/projIssueTrackList")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/issueTrack/addIssueTrackDetial")
                  );
                });
              },
            },
            /* ./问题跟踪  */

            /**
             *Author: 毕禹盟
             *Date: 2020-11-19 14:49
             *Email: tongf5@chinaunicom.cn
             *功能：项目管理》项目监控》关联天梯》
             */
            {
              path: "linkedLadder",
              name: "linkedLadder",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/linkedLadder/projlinkedLadderManage")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/linkedLadder/projlinkedLadderManage")
                  );
                });
              },
            },
            {
              path: "linkedLadder/linkedStartEdit",
              name: "linkedLadder/linkedStartEdit",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/monitor/linkedLadder/linkedStartEdit")
                  );
                  cb(
                    null,
                    require("./routes/project/monitor/linkedLadder/linkedStartEdit")
                  );
                });
              },
            },
          ],
        },
        /**
         *Author: 仝飞
         *Date: 2017-11-20 20:21
         *Email: tongf5@chinaunicom.cn
         *功能：项目管理》项目收尾》历史项目》
         */
        /*项目收尾*/
        {
          path: "projClosure",
          name: "projClosure",
          childRoutes: [
            /* 项目信息管理 */
            {
              path: "historyProject",
              name: "historyProject",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/closure/projHistoryList")
                  );
                  cb(null, require("./routes/project/closure/projHistoryList"));
                });
              },
            },
            /*项目启动立项修改*/
            {
              path: "historyProject/projHistoryEdit",
              name: "historyProject/projHistoryEdit",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/closure/projHistory/projHistoryDetail.js")
                  );
                  cb(
                    null,
                    require("./routes/project/closure/projHistory/projHistoryDetail.js")
                  );
                });
              },
            },
            // 项目结项：项目列表页
            {
              path: "projDeliveryList",
              name: "projDeliveryList",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/closure/projDeliveryList")
                  );
                  cb(
                    null,
                    require("./routes/project/closure/projDeliveryList")
                  );
                });
              },
            },
            // 项目结项：交付物清单
            {
              path: "projDeliveryList/projDeliveryFile",
              name: "projDeliveryList/projDeliveryFile",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/closure/projDeliveryFile")
                  );
                  cb(
                    null,
                    require("./routes/project/closure/projDeliveryFile")
                  );
                });
              },
            },
            // 项目结项：交付物清单-xin
            {
              path: "projDeliveryList/projDeliveryFileNew",
              name: "projDeliveryList/projDeliveryFileNew",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/closure/projDeliveryFileNew")
                  );
                  cb(
                    null,
                    require("./routes/project/closure/projDeliveryFileNew")
                  );
                });
              },
            },
            // 项目结项，TMO结项
            {
              path: "projTmoEnd",
              name: "projTmoEnd",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/closure/promTmoEnd")
                  );
                  cb(null, require("./routes/project/closure/projTmoEnd"));
                });
              },
            },
          ],
        },
        /*项目执行*/
        {
          path: "projExecute",
          name: "projExecute",
          childRoutes: [
            /*项目报告列表*/
            {
              path: "report",
              name: "report",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/execute/report/projReportList")
                  );
                  cb(
                    null,
                    require("./routes/project/execute/report/projReportList")
                  );
                });
              },
            },
            /*项目月报周报列表页面*/
            {
              path: "report/projReportInfo",
              name: "report/projReportInfo",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/execute/report/projReportInfo")
                  );
                  cb(
                    null,
                    require("./routes/project/execute/report/projReportInfo")
                  );
                });
              },
            },
            /*新增月报页面*/
            {
              path: "report/projReportAdd",
              name: "report/projReportAdd",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/execute/report/projReportAdd")
                  );
                  cb(
                    null,
                    require("./routes/project/execute/report/projReportAdd")
                  );
                });
              },
            },
            /*周报月报--夏天*/
            {
              path: "weekAndMonth",
              name: "weekAndMonth",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/execute/monthReturn/weekAndMonth")
                  );
                  cb(
                    null,
                    require("./routes/project/execute/monthReturn/weekAndMonth")
                  );
                });
              },
            },
            /*周报月报/月报详情--夏天*/
            {
              path: "weekAndMonth/monthDetail",
              name: "weekAndMonth/monthDetail",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/execute/monthReturn/monthDetail")
                  );
                  cb(
                    null,
                    require("./routes/project/execute/monthReturn/monthDetail")
                  );
                });
              },
            },
          ],
        },
        /* 项目筹划 */
        {
          path: "projPrepare",
          name: "projPrepare",
          childRoutes: [
            /* 人员查询 */
            {
              path: "memberQuery",
              name: "memberQuery",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/member/memberQuery")
                  );
                  cb(null, require("./routes/project/memberQuery/memberQuery"));
                });
              },
            },
            /*项目计划*/
            {
              path: "projPlan",
              name: "projPlan",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require("./models/project/plan/projPlan"));
                  cb(null, require("./routes/project/plan/projPlan"));
                });
              },
            },
            /*项目计划文件下载*/
            {
              path: "projPlan/projPlanDocDownload",
              name: "projPlan/projPlanDocDownload",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/plan/projPlanDocDownload")
                  );
                  cb(
                    null,
                    require("./routes/project/plan/projPlanDocDownload")
                  );
                });
              },
            },
            {
              path: "teamManage",
              name: "teamManage",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/plan/teamManage/teamManage")
                  );
                  cb(
                    null,
                    require("./routes/project/plan/teamManage/teamManage")
                  );
                });
              },
            },
            {
              path: "teamManage/teamManageDetail",
              name: "teamManage/teamManageDetail",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/plan/teamManage/teamManageDetail")
                  );
                  cb(
                    null,
                    require("./routes/project/plan/teamManage/teamManageDetail")
                  );
                });
              },
            },
            {
              path: "teamManage/projTeamInfo",
              name: "teamManage/projTeamInfo",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/plan/teamManage/projTeamInfo")
                  );
                  cb(
                    null,
                    require("./routes/project/plan/teamManage/projTeamInfo")
                  );
                });
              },
            },
            {
              path: "teamManage/teamManageSearch",
              name: "teamManage/teamManageSearch",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/plan/teamManage/caiHaoSearch")
                  );
                  cb(
                    null,
                    require("./routes/project/plan/teamManage/caiHaoSearch")
                  );
                });
              },
            },
            {
              path: "teamManage/teamManageSearch/teamManageSearchDetail",
              name: "teamManage/teamManageSearch/teamManageSearchDetail",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/plan/teamManage/caiHaoSearchDetail")
                  );
                  cb(
                    null,
                    require("./routes/project/plan/teamManage/caiHaoSearchDetail")
                  );
                });
              },
            },
          ],
        },
        {
          path: "purchase",
          name: "purchase",
          childRoutes: [
            {
              path: "infoFill",
              name: "infoFill",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/partner/fill/fillIn")
                  );
                  cb(null, require("./routes/project/partner/fill/fillIn"));
                });
              },
            },
            {
              path: "infoCheck",
              name: "infoCheck",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require("./models/project/partner/check"));
                  cb(null, require("./routes/project/partner/check"));
                });
              },
            },
            {
              path: "infoQuery",
              name: "infoQuery",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require("./models/project/partner/query"));
                  cb(null, require("./routes/project/partner/query"));
                });
              },
            },
            {
              path: "infoQuery2",
              name: "infoQuery2",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require("./models/project/partner/query2"));
                  cb(null, require("./routes/project/partner/query2"));
                });
              },
            },
            {
              path: "infoRecall",
              name: "infoRecall",
              getComponent(nextState, cb ) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/partner/recall")
                  );
                  cb(null, require("./routes/project/partner/recall"));
                });
              },
            },

            /**
             ,
             {
                            path: 'serviceConfirmQuery',
                            name: 'serviceConfirmQuery',
                            getComponent(nextState, cb) {
                                require.ensure([], require => {
                                    registerModel(app, require('./models/project/purchase/serviceConfirmQuery/serviceConfirmQuery'));
                                    cb(null, require('./routes/project/purchase/serviceConfirmQuery/serviceConfirmQuery'));
                                });
                            },
                        },
             {
                            path: 'serviceConfirm',
                            name: 'serviceConfirm',
                            getComponent(nextState, cb) {
                                require.ensure([], require => {
                                    registerModel(app, require('./models/project/purchase/serviceConfirm/serviceConfirm'));
                                    cb(null, require('./routes/project/purchase/serviceConfirm/serviceConfirm'));
                                });
                            },
                        },
             {
                            path: 'kpiAdd',
                            name: 'kpiAdd',
                            getComponent(nextState, cb) {
                                require.ensure([], require => {
                                    registerModel(app, require('./models/partner/manage/manageModels'));
                                    cb(null, require('./routes/partner/manage/index'));
                                });
                            },
                        },
             {
                            path: 'detail',
                            name: 'detail',
                            getComponent(nextState, cb) {
                                require.ensure([], require => {
                                    registerModel(app, require('./models/partner/detail/detailModels'));
                                    cb(null, require('./routes/partner/detail/partnerIndex'));
                                });
                            },
                        }
             **/
          ],
        },
        /* 工时管理 START*/
        // 作者：刘东旭；日期：2017-11-17；说明：工时管理路由配置
        {
          /*工时管理*/
          path: "timesheetManage",
          name: "timesheetManage",
          childRoutes: [
            /*工时填报 作者：刘东旭；日期：2017-12-05*/
            {
              path: 'timesheetFillin',
              name: 'timesheetFillin',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/addTime'));
                  cb(null, require('./routes/project/timeManagement/addTime'));
                });
              },
            },
            /*工时补录 作者：刘东旭；日期：2017-12-05*/
            {
              path: 'timesheetMakeup',
              name: 'timesheetMakeup',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/afterAddTime'));
                  cb(null, require('./routes/project/timeManagement/afterAddTime'));
                });
              },
            },
            /*工时退回处理 作者：刘东旭；日期：2017-12-06*/
            {
              path: 'fillSendBack',
              name: 'fillSendBack',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/addReturnTime'));
                  cb(null, require('./routes/project/timeManagement/addReturnTime'));
                });
              },
            },
            //作者：张楠华；日期：2017-11-21
            {
              path: 'timesheetMakeupCheckPm', //工时补录审核（项目经理）
              name: 'timesheetMakeupCheckPm',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/review'));
                  cb(null, require('./routes/project/timeManagement/review/makeUpReview'));
                });
              },
            },
            //作者：张楠华；日期：2017-11-21
            {
              path: 'timesheetMakeupCheckDm', //工时补录审核（部门经理）
              name: 'timesheetMakeupCheckDm',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/review'));
                  cb(null, require('./routes/project/timeManagement/review/makeUpReviewDeptMgr'));
                });
              },
            },
            //作者：张楠华；日期：2017-11-24
            {
              path: 'timesheetCheck', //工时审核
              name: 'timesheetCheck',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/review'));
                  cb(null, require('./routes/project/timeManagement/review/timeManageReview'));
                });
              },
            },
            // //作者：张楠华；日期：2017-11-24
            {
              path: 'projectTimesheetSearch',
              name: 'projectTimesheetSearch',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/timeSheetQuery'));
                  cb(null, require('./routes/project/timeManagement/projTimeSheetQuery/timeSheetQuery'));
                });
              },
            },
            // //作者：张楠华；日期：2017-11-24
            {
              path: 'staffTimesheetSearchCommon',
              name: 'staffTimesheetSearchCommon',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/manHourQuery'));
                  cb(null, require('./routes/project/timeManagement/humanQuery/commonManHourQuery'));
                });
              },
            },
            // //作者：张楠华；日期：2017-11-24
            {
              path: 'staffTimesheetSearchPm',
              name: 'staffTimesheetSearchPm',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/manHourQuery'));
                  cb(null, require('./routes/project/timeManagement/humanQuery/PMmanHourQuery'));
                });
              },
            },
            // //作者：张楠华；日期：2017-11-24
            {
              path: 'staffTimesheetSearchDm',
              name: 'staffTimesheetSearchDm',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/manHourQuery'));
                  cb(null, require('./routes/project/timeManagement/humanQuery/DMmanHourQuery'));
                });
              },
            },
            {
              path: 'activityTypeMaintenance',
              name: 'activityTypeMaintenance',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/activityTypeMaintenance'));
                  cb(null, require('./routes/project/timeManagement/activityTypeMaintenance'));
                });
              },
            },
            {
              path: 'worktimeDataStatistics',
              name: 'worktimeDataStatistics',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/worktimeDataStatistics'));
                  cb(null, require('./routes/project/timeManagement/statistics/worktimeYear'));
                });
              },
            },
            {
              path: 'worktimeMonthRatio',
              name: 'worktimeMonthRatio',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/worktimeDataStatistics'));
                  cb(null, require('./routes/project/timeManagement/statistics/worktimeDataStatistics'));
                });
              },
            },
            {
              path: 'staffSeasonProjExamine',//项目考核系数
              name: 'staffSeasonProjExamine',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/worktimeDataStatistics'));
                  cb(null, require('./routes/project/timeManagement/statistics/projExam'));
                });
              },
            },
            {
              path: 'staffSeasonProjScore',//工时考核得分
              name: 'staffSeasonProjScore',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/worktimeDataStatistics'));
                  cb(null, require('./routes/project/timeManagement/statistics/worktimeExamStatistics'));
                });
              },
            },
            {
              path: 'seasonExamineWorkload',//季度考核工作量
              name: 'seasonExamineWorkload',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/worktimeDataStatistics'));
                  cb(null, require('./routes/project/timeManagement/statistics/seasonProjwork'));
                });
              },
            },
            {
              path: 'technologyDataStatistics',
              name: 'technologyDataStatistics',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/techInnovateTimeSheet'));
                  cb(null, require('./routes/project/timeManagement/statistics/techInnovateTimeSheet'));
                });
              },
            },
            {
              path: 'purchaseDataStatistics',
              name: 'purchaseDataStatistics',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/worktimeDataStatistics'));
                  cb(null, require('./routes/project/timeManagement/statistics/purchaseDataStatistics'));
                });
              },
            },
            {
              path: 'additionalStatistics',
              name: 'additionalStatistics',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/additionalStatistics'));
                  cb(null, require('./routes/project/timeManagement/statistics/additionalStatistics'));
                });
              },
            },
            {
              path: 'workdayManage',
              name: 'workdayManage',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/workdayManage'));
                  cb(null, require('./routes/project/timeManagement/workdayManage'));
                });
              },
            },
            {
              path: 'timesheetConfiguration',
              name: 'timesheetConfiguration',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/timeManagement/workTimeConfig'));
                  cb(null, require('./routes/project/timeManagement/workTimeConfig'));
                });
              },
            }
          ],
        },
        /* 工时管理 END */
        {
          path: "corePost",
          name: "corePost",
          childRoutes: [
            {
              path: 'postInfo',
              name: 'postInfo',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/corePost/postInfo'));
                  cb(null, require('./routes/project/corePost/postInfo'));
                });
              },
            },
            {
              path: 'apply',
              name: 'apply',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/corePost/apply'));
                  cb(null, require('./routes/project/corePost/apply'));
                });
              },
            },
            {
              path: 'responsApply',
              name: 'responsApply',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/project/corePost/responsibility/responsApply'));
                  cb(null, require('./routes/project/corePost/responsibility/responsApply'));
                });
              },
            },
          ],
        },
        /*项目配置 Start*/
        {
          path: "projConfig",
          name: "projConfig",
          childRoutes: [
            {
              path: "projCheck",
              name: "projCheck",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/config/audit/projCheck")
                  );
                  cb(null, require("./routes/project/config/audit/projCheck"));
                });
              },
            },
            {
              path: "projTravel",
              name: "projTravel",
              getComponent(nextState, cb) {
                registerModel(
                  app,
                  require("./models/project/config/audit/projTravel")
                );
                cb(null, require("./routes/project/config/audit/projTravel"));
              },
            },
            {
              path: "mailNotice",
              name: "mailNotice",
              getComponent(nextState, cb) {
                registerModel(
                  app,
                  require("./models/project/config/audit/mailNotice")
                );
                cb(
                  null,
                  require("./routes/project/config/audit/mailNotification/mailNotice")
                );
              },
            },
            {
              path: "departmentSetting",
              name: "departmentSetting",
              getComponent(nextState, cb) {
                registerModel(
                  app,
                  require("./models/project/config/audit/departmentSetting")
                );
                cb(
                  null,
                  require("./routes/project/config/audit/attributionDepartment/departmentSetting")
                );
              },
            },
            {
              path: "others",
              name: "others",
              getComponent(nextState, cb) {
                registerModel(
                  app,
                  require("./models/project/config/audit/others")
                );
                cb(
                  null,
                  require("./routes/project/config/audit/othersSet/others")
                );
              },
            },
            {
              path:'fullCostStandard',
              name:'fullCostStandard',
              getComponent(nextState,cb){
                  registerModel(app,require('./models/project/config/audit/fullCostStandard'));
                  cb(null,require('./routes/project/config/audit/fullCostStandard'))
              }
            },

          ],
        },
        // 项目备案
        {
          path: "projRecord",
          name: "projRecord",
          childRoutes: [
            {
              path: "projChild",
              name: "projChild",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/record/verify/projChild")
                  );
                  cb(null, require("./routes/project/record/verify/projChild"));
                });
              },
            },
            {
              path: "projChild/projDetail",
              name: "projChild/projDetail",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/record/verify/projDetail")
                  );
                  cb(null, require("./routes/project/record/verify/projDetail"));
                });
              },
            },
          ],
        },
        /**
         * @author wangyt951 cbdb路由
         */
        {
          path: "cmdb",
          name: "cmdb",
          childRoutes: [
            {
              path: "cmdbChild",
              name: "cmdbChild",
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(
                    app,
                    require("./models/project/cmdb/cmdbChild")
                  );
                  cb(null, require("./routes/project/cmdb/cmdbChild"));
                });
              },
            },
          ],
        },
      ],
    } /* 项目管理路由结束 */,
  ];
  return router;
}

module.exports = {
  name: "项目路由文件",
  projectRouterConfig,
};
