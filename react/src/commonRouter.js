/**
 * 作者：陈莲
 * 日期：2018-7-3
 * 邮箱：chenl192@chinaunicom.cn
 * 文件说明：首页路由配置
 */
function commonRouterConfig({history, app,registerModel}) {
  let router = [
    {
      path: 'adminApp',
      name: 'adminApp',
    }, /* 综合管理tab路由结束 */
    {
      path: 'humanApp',
      name: 'humanApp',
    }, /* 人力管理tab路由结束 */
    {
      path: 'projectApp',
      name: 'projectApp',
    }, /* 项目管理tab路由结束 */
    {
      path: 'financeApp',
      name: 'financeApp',
    }, /* 财务管理tab路由结束 */
    {
      path: 'commonApp',
      name: 'commonApp',

      // getComponent(nextState, cb) {
      //     require.ensure([], require => {
      //         registerModel(app, require('./models/commonApp/commonApp.js'));
      //         cb(null, require('./routes/commonApp/commonAppInfo.js'));
      //     });
      // },
      indexRoute: {
        getComponent(nextState, cb) {
          require.ensure([], require => {
            registerModel(app, require('./models/commonApp/commonApp.js'));
            cb(null, require('./routes/commonApp/commonAppInfo.js'));
          });
        },
      },
      childRoutes: [
        {
          path: 'questionnaire',
          name: 'questionnaire',
          indexRoute: {
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/commonApp/questionnaire/questionnaire'));
                cb(null, require('./routes/commonApp/questionnaire/questionnaire_list'));
              });
            }
          },
          childRoutes: [
            {
              path: 'questionnaire_detail',
              name: 'questionnaire_detail',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/commonApp/questionnaire/questionnaire'));
                  cb(null, require('./routes/commonApp/questionnaire/questionnaire_main_new'));
                });
              }
            },
            {
              path: 'questionnaire_result',
              name: 'questionnaire_result',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/commonApp/questionnaire/questionnaire_result'));
                  cb(null, require('./routes/commonApp/questionnaire/questionnaire_result'));
                });
              }
            },
          ]
        },
        {
          path: 'opensource',
          name: 'opensource',
          childRoutes: [
            {
              path: 'passReset',
              name: 'passReset',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/commonApp/opensource/passReset'));
                  cb(null, require('./routes/commonApp/opensource/passReset'));
                });
              }
            },
            {
              path: 'projectList',
              name: 'projectList',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/commonApp/opensource/projectList'));
                  cb(null, require('./routes/commonApp/opensource/projectList'));
                });
              }
            },
            {
              path: 'projectBuild',
              name: 'projectBuild',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/commonApp/opensource/projectBuild'));
                  cb(null, require('./routes/commonApp/opensource/projectBuild'));
                });
              }
            },
            {
              path: 'myProject',
              name: 'myProject',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/commonApp/opensource/myProject'));
                  cb(null, require('./routes/commonApp/opensource/myProject'));
                });
              }
            },
          ]
        },

        //作者：刘东旭；日期：2017-11-14；说明：一点看全路由配置;邮箱：liudx100@chinaunicom.cn
        {
          path: 'overviewbypoint',
          name: 'overviewbypoint',
          childRoutes: [
            {
              path: 'searchallouinfo',
              name: 'searchallouinfo',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/commonApp/onePoint/onePoint'));
                  cb(null, require('./routes/commonApp/onePoint/onePoint'));
                });
              }
            },
          ]
        },
        /*
         * 作者：张枫
         * 邮箱：zhangf142@chinaunicom.cn
         * 日期：2018-11-2
         * 说明：代码质量审查汇总页面
         */
        {
          path: 'qualitySum',
          name: 'qualitySum',
          childRoutes: [
            {
              path: 'qualitySummary',
              name: 'qualitySummary',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/commonApp/quality/qualitySum'));
                cb(null, require('./routes/commonApp/quality/qualitySum'));
              });
              }
            },
          ]
        },
      ]
    },


    {
      path: 'taskAS',
      name: 'taskAS',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/project/standard/projAssessmentStandardDetail/projAssessmentStandardDetail'));
          cb(null, require('./routes/commonApp/message/taskAS.js'));
        });
      }
    },
    {
      path: 'tasProkKpiTMO',
      name: 'tasProkKpiTMO',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          //registerModel(app, require('./models/commonApp/message/taskProKpi.js'));
          //cb(null, require('./routes/commonApp/message/proKpi/taskProKpiDetail.js'));
          registerModel(app, require('./models/projectKpi/projectKpiTMO'));
          cb(null, require('./routes/projectKpi/TMONew/taskProKpiDetail.js'));
        });
      }
    },
    {
      path: 'tasProkKpiDM',
      name: 'tasProkKpiDM',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/projectKpi/projectKpiTMO'));
          cb(null, require('./routes/projectKpi/DM/taskProKpiDetail.js'));
        });
      }
    },
    {
      path: 'taskList',
      name: 'taskList',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/task.js'));
          cb(null, require('./routes/commonApp/message/taskList.js'));
        });
      }
    },
	 //待办会议详情
    {
      path: 'waitMeetingDetails',
      name: 'waitMeetingDetails',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/waitMeetingDetails.js'));
          cb(null, require('./routes/commonApp/message/waitMeetingDetails.js'));
        });
      }
    },
    //申请人修改待办会议详情
    {
      path: 'applyPersonReset',
      name: 'applyPersonReset',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/applyPersonReset.js'));
          cb(null, require('./routes/commonApp/message/applyPersonReset.js'));
        });
      }
    },

    //待归档时申请人修改资料页面
    {
      path: 'addFile',
      name: 'addFile',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/addFile.js'));
          cb(null, require('./routes/commonApp/message/addFile.js'));
        });
      }
    },

    //归档材料审核
    {
      path: 'dataJudge',
      name: 'dataJudge',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/dataJudge.js'));
          cb(null, require('./routes/commonApp/message/dataJudge.js'));
        });
      }
    },

    //已办议题详情
    {
      path: 'myComplete',
      name: 'myComplete',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/myComplete.js'));
          cb(null, require('./routes/commonApp/message/myComplete.js'));
        });
      }
    },

//办结议题详情
    {
      path: 'myDone',
      name: 'myDone',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/myDone.js'));
          cb(null, require('./routes/commonApp/message/myDone.js'));
        });
      }
    },
    {
      path: 'taskDetail',
      name: 'taskDetail',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/task.js'));
          cb(null, require('./routes/commonApp/message/taskDetail.js'));
        });
      }
    },{
      path: 'return',
      name: 'return',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/project/corePost/employ/return'));
          cb(null, require('./routes/project/corePost/employ/return'));
        });
      },
    },
    {
      path: 'check',
      name: 'check',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/project/corePost/employ/check'));
          cb(null, require('./routes/project/corePost/employ/check'));
        });
      },
    },
    {
      path: 'appReturn',
      name: 'appReturn',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/project/corePost/applied/return'));
          cb(null, require('./routes/project/corePost/applied/return'));
        });
      },
    },
    {
      path: 'appCheck',
      name: 'appCheck',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/project/corePost/applied/check'));
          cb(null, require('./routes/project/corePost/applied/check'));
        });
      },
    },
    {
      path: 'responsReturn',
      name: 'responsReturn',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/project/corePost/responsibility/return'));
          cb(null, require('./routes/project/corePost/responsibility/return'));
        });
      },
    },
    {
      path: 'responsCheck',
      name: 'responsCheck',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/project/corePost/responsibility/check'));
          cb(null, require('./routes/project/corePost/responsibility/check'));
        });
      },
    },
    {
      path: 'taskTeamManage',
      name: 'taskTeamManage',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/taskTeamManage.js'));
          cb(null, require('./routes/commonApp/message/taskTeamManage.js'));
        });
      }
    },

    {
      path: 'taskPartner',
      name: 'taskPartner',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/taskPartner.js'));
          cb(null, require('./routes/commonApp/message/taskPartner.js'));
        });
      }
    },
    /* 项目变更审核*/
    {
      path: 'projChangeCheck',
      name: 'projChangeCheck',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/projChange/projChangeCheck.js'));
          cb(null, require('./routes/commonApp/message/projChangeCheck/projCheckMainPage.js'));
        });
      },
    },
    /* 差旅费预算变更审核*/
    {
      path: 'travelBudgetChangeReview',
      name: 'travelBudgetChangeReview',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/travelBudgetChangeReview/travelBudgetChangeReview.js'));
          cb(null, require('./routes/commonApp/message/travelBudgetChangeReview/travelBudgetChangeReview.js'));
        });
      },
    },
    /* 差旅费预算变更已办和办结*/
    {
      path: 'travelBudgetChangeEnd',
      name: 'travelBudgetChangeEnd',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/travelBudgetChangeReview/travelBudgetChangeReview.js'));
          cb(null, require('./routes/commonApp/message/travelBudgetChangeReview/travelBudgetChangeEnd.js'));
        });
      },
    },
    /* 差旅费预算变更退回*/
    {
      path: 'travelBudgetChangeReturn',
      name: 'travelBudgetChangeReturn',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/travelBudgetChangeReview/travelBudgetChangeReview.js'));
          cb(null, require('./routes/commonApp/message/travelBudgetChangeReview/travelBudgetChangeReturn.js'));
        });
      },
    },
    /* 差旅费预算变更退回修改*/
    {
      path: 'travelBudgetChangeReturnModify',
      name: 'travelBudgetChangeReturnModify',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/project/monitor/change/budgetChangeApply'));
          cb(null, require('./routes/commonApp/message/travelBudgetChangeReview/budgetChangeModify.js'));
        });
      },
    },
    /* 差旅费预算变更审核历史*/
    {
      path: 'travelBudgetChangeReview/travelBudgetHistory',
      name: 'travelBudgetChangeReview/travelBudgetHistory',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/project/monitor/change/budgetChangeApply'));
          cb(null, require('./routes/commonApp/message/travelBudgetChangeReview/budgetChangeHistory.js'));
        });
      },
    },
    /* 项目变更修改, 和 项目监控>项目变更申请  一个界面*/
    {
      path: 'projChangeModify',
      name: 'projChangeModify',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          //registerModel(app, require('./models/commonApp/message/projChange/projChangeModify.js'));
          //cb(null, require('./routes/commonApp/message/projChangeModify/modifyMainPage.js'));
          registerModel(app, require('./models/project/monitor/change/projChangeApply'));
          cb(null, require('./routes/commonApp/message/projChangeModify/modifyMainPage.js'));
        });
      },
    },
    /* 交付物审核*/
    {
      path: 'deliverableManage',
      name: 'deliverableManage',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/deliverableManage/deliverableManage.js'));
          cb(null, require('./routes/commonApp/message/deliverableManage/deliverableManage.js'));
        });
      },
    },
    /*TMO修改已立项全成本，待办查看页面*/
    {
      path: 'projFullcostView',
      name: 'projFullcostView',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/projModifyFullcostTMO/projFullcostView.js'));
          cb(null, require('./routes/commonApp/message/projModifyFullcostTMO/projFullcostView.js'));
        });
      },
    },
    /*TMO修改已立项全成本，待办退回修改页面*/
    {
      path: 'projFullcostReModify',
      name: 'projFullcostReModify',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/projModifyFullcostTMO/projFullcostReModify.js'));
          cb(null, require('./routes/commonApp/message/projModifyFullcostTMO/projFullcostReModify.js'));
        });
      },
    },
    {
      path: 'taskUpdate',
      name: 'taskUpdate',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          // if(app._models.some(val=>(val.namespace ===  'projectInfo'))) {
          //     app.unmodel('projectInfo');
          //     delete cached.projectInfo;
          // }
          // if (app._models.filter(m => m.namespace === 'projectInfo').length === 1) {
          //     app.unmodel('projectInfo');
          //     delete cached.projectInfo;
          // }
          //registerModel(app, require('./models/commonApp/message/projectInfo.js'));
          registerModel(app, require('./models/project/startup/projAdd/projectInfo'));
          cb(null, require('./routes/commonApp/message/projAdd/projMainPage.js'));
        });
      }
    },
    // 消息列表页面
    {
      path: 'noticeList',
      name: 'noticeList',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/messageMore.js'));
          cb(null, require('./routes/commonApp/message/messageMore.js'));
        });
      }
    },
    // 草稿列表页面
    {
      path: 'draftList',
      name: 'draftList',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/draftList.js'));
          cb(null, require('./routes/commonApp/message/draftList.js'));
        });
      }
    },
    {
      path: 'backlogMore',
      name: 'backlogMore',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/message/backlogMore.js'));
          cb(null, require('./routes/commonApp/message/backlogMore.js'));
        });
      }
    },
    {
      path: 'noticeMoreUser',
      name: 'noticeMoreUser',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/notice/noticeMore.js'));
          cb(null, require('./routes/commonApp/notice/noticeMore.js'));
        });
      }
    },
    {
      path: 'noticeDetail',
      name: 'noticeDetail',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/notice/noticeDetail.js'));
          cb(null, require('./routes/commonApp/notice/noticeDetail.js'));
        });
      }
    },
    {
      path: 'noticeMoreManager',
      name: 'noticeMoreManager',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/notice/noticeMoreManager.js'));
          cb(null, require('./routes/commonApp/notice/noticeMoreManager.js'));
        });
      }
    },
    {
      path: 'noticeModify',
      name: 'noticeModify',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/notice/noticeModify.js'));
          cb(null, require('./routes/commonApp/notice/noticeModify.js'));
        });
      }
    },
    {
      path: 'noticeCreate',
      name: 'noticeCreate',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/notice/createNotice.js'));
          cb(null, require('./routes/commonApp/notice/noticeCreate.js'));
        });
      }
    },
    {
      path: 'trainingMore',
      name: 'trainingMore',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/train/trainingMore.js'));
          cb(null, require('./routes/commonApp/train/trainingMore.js'));
        });
      }
    },
    {
      path: 'trainUpload',
      name: 'trainUpload',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/train/trainUpload.js'));
          cb(null, require('./routes/commonApp/train/trainUpload.js'));
        });
      }
    },
    {
      path: 'docType',
      name: 'docType',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/train/docType.js'));
          cb(null, require('./routes/commonApp/train/docType.js'));
        });
      }
    },
    {
      path: 'srcMore',
      name: 'srcMore',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/src/srcMore.js'));
          cb(null, require('./routes/commonApp/src/srcMore.js'));
        });
      }
    },
    {
      path: 'downloadorder',
      name: 'downloadorder',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/forms/order.js'));
          cb(null, require('./routes/commonApp/forms/orderTabs.js'));
        });
      }
    },
    {
      path: 'downloadleave',
      name: 'downloadleave',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/commonApp/forms/leave.js'));
          cb(null, require('./routes/commonApp/forms/leaveTabs.js'));
        });
      }
    },
    // 组织绩效考核填报修改跳转
    {
      path: 'reReportDetail',
      name: 'reReportDetail',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/finance/examine/indexModel.js'));
          cb(null, require('./routes/finance/examine/report/reportDetail.js'));
        })
      }
    },
    {
      path: 'todoEvaluateDetail',
      name: 'todoEvaluateDetail',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/finance/examine/indexModel.js'));
          cb(null, require('./routes/finance/examine/evaluate/evaluateDetail.js'));
        })
      }
    },
    {
      path: 'reMonthReportDetail',
      name: 'reMonthReportDetail',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/finance/examine/trackModel.js'));
          cb(null, require('./routes/finance/examine/track/monthReportDetail.js'));
        })
      }
    },
    {
      path: 'reQuarterReportDetail',
      name: 'reQuarterReportDetail',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/finance/examine/trackModel.js'));
          cb(null, require('./routes/finance/examine/track/quarterReportDetail.js'));
        })
      }
    },
  ];
  return router;
}

module.exports = {
  name:'首页路由文件',
  commonRouterConfig
}
