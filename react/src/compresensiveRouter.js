/**
 * 作者：陈莲
 * 日期：2018-7-3
 * 邮箱：chenl192@chinaunicom.cn
 * 文件说明：综合应用路由配置
 */

function compresensiveRouterConfig({history, app,registerModel}) {
  let router = [
    {
      path: 'adminApp/meetSystem',
      name: 'adminApp/meetSystem',
      // Redirect:{
      //   from:'/meetSystem',
      //   to:'/meetSystem/order'},
      childRoutes: [
        {
          path: 'order',
          name: 'order',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetSystem/roomOrder.js'));
              cb(null, require('./routes/meetSystem/roomOrder.js'));
            });
          },
        },
        {
          path: 'myOrder',
          name: 'myOrder',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetSystem/myOrder/myOrder.js'));
              cb(null, require('./routes/meetSystem/myOrder/myOrder.js'));
            });
          },
        },
        {
          path: 'orderSearch',
          name: 'orderSearch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetSystem/orderSearch/orderSearch.js'));
              cb(null, require('./routes/meetSystem/orderSearch/orderSearch.js'));
            });
          },
        },
        {
          path: 'meetList',
          name: 'meetList',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetSystem/meetList/meetList.js'));
              cb(null, require('./routes/meetSystem/meetList/meetList.js'));
            });
          },
        },
        {
          path: 'meeting_setting',
          name: 'meeting_setting',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetSystem/config/meetC.js'));
              cb(null, require('./routes/meetSystem/config/meetC.js'));
            });
          },
        },
        {
          path: 'basic_setting',
          name: 'basic_setting',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetSystem/config/baseConfig.js'));
              cb(null, require('./routes/meetSystem/config/baseConfig.js'));
            });
          },
        },
        {
          path: 'ou_setting',
          name: 'ou_setting',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetSystem/config/baseConfig.js'));
              cb(null, require('./routes/meetSystem/config/ouConfig.js'));
            });
          },
        },
        {
          path: 'meeting_setting/meetroomConfig',
          name: 'meeting_setting/meetroomConfig',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetSystem/config/meetroomConfig.js'));
              cb(null, require('./routes/meetSystem/config/meetroomConfig.js'));
            });
          },
        },
        {
          path: 'meetroomDetail',
          name: 'meetroomDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              //registerModel(app, require('./models/meetSystem/config/meetroomDetail.js'));
              cb(null, require('./routes/meetSystem/config/meetroomDetail.js'));
            });
          },
        },
        {
          path: 'meet_statistical',
          name: 'meet_statistical',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetSystem/meetStatistical/statistical.js'));
              cb(null, require('./routes/meetSystem/meetStatistical/statistical.js'));
            });
          },
        },
        {
          path: 'limited',
          name: 'limited',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetSystem/meetStatistical/limited.js'));
              cb(null, require('./routes/meetSystem/meetStatistical/limited.js'));
            });
          },
        },
        {
          path: 'forced',
          name: 'forced',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetSystem/meetStatistical/forcedCancel.js'));
              cb(null, require('./routes/meetSystem/meetStatistical/forcedCancel.js'));
            });
          },
        },
      ]
    },

    {
      path: 'adminApp/compRes/qrcode_locationres',
      name: 'adminApp/compRes/qrcode_locationres',
      indexRoute: {
        getComponent(nextState, cb) {
          require.ensure([], require => {
            registerModel(app, require('./models/QRSystem/QRCode.js'));
            cb(null, require('./routes/QRSystem/QRCode.js'));
          });
        }
      },

      childRoutes: [
        {
          path: 'qrbulkImport',
          name: 'qrbulkImport',
          indexRoute: {
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/QRSystem/QRbulkImport.js'));
                cb(null, require('./routes/QRSystem/QRbulkImport.js'));
              });
            }
          },
        },
        {
          path: 'qrAbandon',
          name: 'qrAbandon',
          indexRoute: {
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/QRSystem/qrAbandon.js'));
                cb(null, require('./routes/QRSystem/qrAbandon.js'));
              });
            }
          },
        },
      ]
    },
    {
      path: 'adminApp/compRes/qrcode_office_equipment',
      name: 'adminApp/compRes/qrcode_office_equipment',
      indexRoute: {
        getComponent(nextState, cb) {
          require.ensure([], require => {
            registerModel(app, require('./models/QRSystem/QRCode.js'));
            cb(null, require('./routes/QRSystem/QRCode.js'));
          });
        }
      },
      childRoutes: [
        {
          path: 'qrbulkImport',
          name: 'qrbulkImport',
          indexRoute: {
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/QRSystem/QRbulkImport.js'));
                cb(null, require('./routes/QRSystem/QRbulkImport.js'));
              });
            }
          },
        },
        {
          path: 'qrAbandon',
          name: 'qrAbandon',
          indexRoute: {
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/QRSystem/qrAbandon.js'));
                cb(null, require('./routes/QRSystem/qrAbandon.js'));
              });
            }
          },
        },
        //资产借还信息
        {
          path: 'assetLendingInformation',
          name: 'assetLendingInformation',
          indexRoute: {
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/QRSystem/QRCode.js'));
                cb(null, require('./routes/QRSystem/officeRes/assetLendingInformation.js'));
              });
            }
          },
        },
        //借还信息查询
        {
          path: 'assetLendingInformation/assetLendingDetail',
          name: 'assetLendingInformation/assetLendingDetail',
          indexRoute: {
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/QRSystem/QRCode.js'));
                cb(null, require('./routes/QRSystem/officeRes/assetLendingDetail.js'));
              });
            }
          },
        },
      ]
    },

    {
      path: 'adminApp/compRes/qrcode_living_facilities',
      name: 'adminApp/compRes/qrcode_living_facilities',
      indexRoute: {
        getComponent(nextState, cb) {
          require.ensure([], require => {
            registerModel(app, require('./models/QRSystem/QRCode.js'));
            cb(null, require('./routes/QRSystem/QRCode.js'));
          });
        }
      },
      childRoutes: [
        {
          path: 'qrbulkImport',
          name: 'qrbulkImport',
          indexRoute: {
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/QRSystem/QRbulkImport.js'));
                cb(null, require('./routes/QRSystem/QRbulkImport.js'));
              });
            }
          },
        },
        {
          path: 'qrAbandon',
          name: 'qrAbandon',
          indexRoute: {
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/QRSystem/qrAbandon.js'));
                cb(null, require('./routes/QRSystem/qrAbandon.js'));
              });
            }
          },
        },
      ]
    },

    {
      path: 'adminApp/compRes',
      name: 'adminApp/compRes',
      childRoutes: [
        {
          path: 'officeResMain',
          name: 'officeResMain',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/officeResMain.js'));
              cb(null, require('./routes/QRSystem/officeRes/officeResMain.js'));
            });
          },
        },
        {
          path: 'officeResMain/officeRes',
          name: 'officeResMain/officeRes',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/officeRes.js'));
              cb(null, require('./routes/QRSystem/officeRes/officeRes.js'));
            });
          },
        },
        {
          path: 'officeResMain/commonPage',
          name: 'officeResMain/commonPage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/commonPage.js'));
              cb(null, require('./routes/QRSystem/officeRes/commonPage.js'));
            });
          },
        },
        {
          path: 'officeResMain/commonPageOne',
          name: 'officeResMain/commonPageOne',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/commonPageOne.js'));
              cb(null, require('./routes/QRSystem/officeRes/commonPageOne.js'));
            });
          },
        },
        {
          path: 'officeResMain/officeConfig',
          name: 'officeResMain/officeConfig',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/officeConfig.js'));
              cb(null, require('./routes/QRSystem/officeRes/config/officeConfig.js'));
            });
          },
        },
        {
          path: 'officeResMain/officeConfig/blackList',
          name: 'officeResMain/officeConfig/blackList',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/officeConfig.js'));
              cb(null, require('./routes/QRSystem/officeRes/config/blackList.js'));
            });
          },
        },
        {
          path: 'applyWorkstation',
          name: 'applyWorkstation',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/applyWorkstation.js'));
              cb(null, require('./routes/QRSystem/officeRes/config/applyWorkstation.js'));
            });
          },
        },
        //延期工位
        {
          path: 'officeResMain/delayWorkstation',
          name: 'officeResMain/delayWorkstation',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/delayWorkstation.js'));
              cb(null, require('./routes/QRSystem/officeRes/delayWorkstation.js'));
            });
          },
        },
        //释放工位
        {
          path: 'officeResMain/releaseWorkstation',
          name: 'officeResMain/releaseWorkstation',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/releaseWorkstation.js'));
              cb(null, require('./routes/QRSystem/officeRes/releaseWorkstation.js'));
            });
          },
        },
        {
          path: 'queryRecord',
          name: 'queryRecord',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/queryRecord.js'));
              cb(null, require('./routes/QRSystem/officeRes/config/queryRecord.js'));
            });
          },
        },
        //首次工位申请
        {
          path: 'officeResMain/apply',
          name: 'officeResMain/apply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/apply.js'));
              cb(null, require('./routes/QRSystem/officeRes/apply.js'));
            });
          },
        },
        //申请记录查询
        {
          path: 'officeResMain/apply/applyRecord',
          name: 'officeResMain/apply/applyRecord',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/applyRecord.js'));
              cb(null, require('./routes/QRSystem/officeRes/applyRecord.js'));
            });
          },
        },
        //申请记录查询状态页面-peng
        {
          path: 'officeResMain/apply/applyRecord/Details',
          name: 'officeResMain/apply/applyRecord/Details',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/managerApplyRecord.js'));
              cb(null, require('./routes/QRSystem/officeRes/applyDetail.js'));
            });
          },
        },
        //我的待办
        {
          path: 'todoList',
          name: 'todoList',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/toDoList.js'));
              cb(null, require('./routes/QRSystem/officeRes/toDoList.js'));
            });
          },
        },
        //审批-部门经理
        {
          path: 'todoList/examine',
          name: 'todoList/examine',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/examine.js'));
              cb(null, require('./routes/QRSystem/officeRes/examine.js'));
            });
          },
        },
        //审批-属地管理员
        {
          path: 'todoList/adminExamine',
          name: 'todoList/adminExamine',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/adminExamine.js'));
              cb(null, require('./routes/QRSystem/officeRes/adminExamine.js'));
            });
          },
        },
        // 分配页面
        {
          path: 'todoList/adminExamine/assignPage',
          name: 'todoList/adminExamine/assignPage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/adminExamine.js'));
              cb(null, require('./routes/QRSystem/officeRes/assignPage.js'));
            });
          },
        },
        // 本部七层工位暂存页面
        {
          path: 'todoList/adminExamine/assignPageSeven',
          name: 'todoList/adminExamine/assignPageSeven',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/adminExamine.js'));
              cb(null, require('./routes/QRSystem/officeRes/assignPageSeven.js'));
            });
          },
        },
        {
          path: 'todoList/adminExamine/assignPageSevenDetails',
          name: 'todoList/adminExamine/assignPageSevenDetails',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/adminExamine.js'));
              cb(null, require('./routes/QRSystem/officeRes/assignPageSevenDetails.js'));
            });
          },
        },
        //部门经理申请记录查询
        {
          path: 'todoList/managerApplyRecord',
          name: 'todoList/managerApplyRecord',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/managerApplyRecord.js'));
              cb(null, require('./routes/QRSystem/officeRes/managerApplyRecord.js'))
            })
          }
        },
        //部门经理审批结果
        {
          path: 'todoList/managerApplyRecord/managerDetail',
          name: 'todoList/managerApplyRecord/managerDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/managerApplyRecord.js'));
              cb(null, require('./routes/QRSystem/officeRes/managerDetail.js'));
            });
          },
        },
        //管理员申请记录查询
        {
          path: 'todoList/adminApplicationRecord',
          name: 'todoList/adminApplicationRecord',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/managerApplyRecord.js'));
              cb(null, require('./routes/QRSystem/officeRes/adminApplicationRecord.js'))
            })
          }
        },
        //管理员审批结果
        {
          path: 'todoList/adminApplicationRecord/adminDetail',
          name: 'todoList/adminApplicationRecord/adminDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/QRSystem/officeRes/managerApplyRecord.js'));
              cb(null, require('./routes/QRSystem/officeRes/adminDetail.js'));
            });
          },
        },
      ]
    },
    {
      path: 'adminApp/regulationM',
      name: 'adminApp/regulationM',
      childRoutes: [
        {
          path: 'ruleRegulation',
          name: 'ruleRegulation',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/regulationM/ruleRegulation/ruleRegulation.js'));
              cb(null, require('./routes/regulationM/ruleRegulation/ruleRegulation.js'));
            });
          },
        },
        {
          path: 'ruleRegulation/ruleDetail',
          name: 'ruleRegulation/ruleDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/regulationM/ruleRegulation/ruleDetail.js'));
              cb(null, require('./routes/regulationM/ruleRegulation/ruleDetail.js'));
            });
          },
        },
        {
          path: 'globalMessage',
          name: 'globalMessage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/regulationM/ruleRegulation/globalMessage.js'));
              cb(null, require('./routes/regulationM/ruleRegulation/globalMessage.js'));
            });
          },
        },
        {
          path: 'myUpload',
          name: 'myUpload',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/regulationM/myUpload/myUpload.js'));
              cb(null, require('./routes/regulationM/myUpload/myUpload.js'));
            });
          },
        },
        {
          path: 'myUpload/upload',
          name: 'myUpload/upload',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/regulationM/myUpload/upload.js'));
              cb(null, require('./routes/regulationM/myUpload/upload.js'));
            });
          },
        },
        {
          path: 'myApproval',
          name: 'myApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/regulationM/myApproval/myApproval.js'));
              cb(null, require('./routes/regulationM/myApproval/myApproval.js'));
            });
          },
        },
        {
          path: 'myBack',
          name: 'myBack',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/regulationM/myBack.js'));
              cb(null, require('./routes/regulationM/myBack.js'));
            });
          },
        },
        {
          path: 'myMessage',
          name: 'myMessage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/regulationM/myMessage.js'));
              cb(null, require('./routes/regulationM/myMessage.js'));
            });
          },
        },
        {
          path: 'editType',
          name: 'editType',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/regulationM/editType.js'));
              cb(null, require('./routes/regulationM/editType.js'));
            });
          },
        },
        {
          path: 'subEditType',
          name: 'subEditType',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/regulationM/subEditType.js'));
              cb(null, require('./routes/regulationM/subEditType.js'));
            });
          },
        },
        {
          path: 'downloadReport',
          name: 'downloadReport',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/regulationM/downloadReport.js'));
              cb(null, require('./routes/regulationM/downloadReport.js'));
            });
          },
        },
      ]
    },
    {
      path: 'adminApp/meetManage',
      name: 'adminApp/meetManage',
      childRoutes:[
        // 贾茹路由文件 议题申请
        //议题申请
        {
          path: 'topicApply',
          name: 'topicApply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/topicApply.js'));
              cb(null, require('./routes/meetingManagement/topicApply.js'));
            });
          },

        },
        //议题填报
        {
          path: 'topicApply/topicWrite',
          name: 'topicApply/topicWrite',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/topicWrite.js'));
              cb(null, require('./routes/meetingManagement/topicWrite.js'));
            });
          },

        },
        //议题详情
        {
          path: 'topicApply/topicDetails',
          name: 'topicApply/topicDetails',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/topicApply.js'));
              cb(null, require('./routes/meetingManagement/topicDetails.js'));
            });
          },

        },

        //议题修改
        {
          path: 'topicApply/topicReset',
          name: 'topicApply/topicReset',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/topicReset.js'));
              cb(null, require('./routes/meetingManagement/topicReset.js'));
            });
          },

        },
        //我的审核（之前工作台修改）
        {
          path: 'myJudge',
          name: 'myJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/myJudge/judgeList.js'));
              cb(null, require('./routes/meetingManagement/myJudge/judgeList.js'));
            });
          },

        },
        //已办办结详情
        {
          path: 'myJudge/myComplete',
          name: 'myJudge/myComplete',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/myJudge/myComplete.js'));
              cb(null, require('./routes/meetingManagement/myJudge/myComplete.js'));
            });
          },

        },


        //普通领导审核路由
        {
          path: 'myJudge/topicJudge',
          name: 'myJudge/topicJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/myJudge/topicJudge.js'));
              cb(null, require('./routes/meetingManagement/myJudge/topicJudge.js'));
            });
          },

        },
        //办公室管理员审核路由
        {
          path: 'myJudge/officeJudge',
          name: 'myJudge/officeJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/myJudge/officeJudge.js'));
              cb(null, require('./routes/meetingManagement/myJudge/officeJudge.js'));
            });
          },

        },
        //院长审核路由
        {
          path: 'myJudge/pricedentJudge',
          name: 'myJudge/pricedentJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/myJudge/pricedentJudge.js'));
              cb(null, require('./routes/meetingManagement/myJudge/pricedentJudge.js'));
            });
          },

        },
        //申请人补充材料
        {
          path: 'myJudge/addFile',
          name: 'myJudge/addFile',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/myJudge/addFile.js'));
              cb(null, require('./routes/meetingManagement/myJudge/addFile.js'));
            });
          },
        },

        //归档审核
        {
          path: 'myJudge/dataJudge',
          name: 'myJudge/dataJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/myJudge/dataJudge.js'));
              cb(null, require('./routes/meetingManagement/myJudge/dataJudge.js'));
            });
          },
        },

        {
          path: 'addMeeting',
          name: 'addMeeting',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/addMeeting/addMeeting.js'));
              cb(null, require('./routes/meetingManagement/addMeeting/addMeeting.js'));
            });
          },
        },
        {
          path: 'addMeeting/addMeetingNote',
          name: 'addMeeting/addMeetingNote',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/addMeeting/addMeetingNote.js'));
              cb(null, require('./routes/meetingManagement/addMeeting/addMeetingNote.js'));
            });
          },
        },
        {
          path: 'meetingConfirm/addTopicToMeeting',
          name: 'meetingConfirm/addTopicToMeeting',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/addMeeting/addMeetingNote.js'));
              cb(null, require('./routes/meetingManagement/addMeeting/addMeetingNote.js'));
            });
          },
        },
        // 韩爱爱 会议确认-归档前修改填报议题
        {
          path: 'meetingConfirm/meetingReset',
          name: 'meetingConfirm/meetingReset',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/meetingReset.js'));
              cb(null, require('./routes/meetingManagement/meetingReset.js'));
            });
          },
        },
        //倒计时
        {
          path: 'countdown',
          name: 'countdown',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/countdown.js'));
              cb(null, require('./routes/meetingManagement/countdown'));
            });
          },
        },
        // 张枫路由文件 会议室配置
        {
          path: 'config',
          name: 'config',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/meetingConf.js'));
              cb(null, require('./routes/meetingManagement/meetingConf.js'));
            });
          },

        },
        //议题统计
        {
          path: 'topicStatistics',
          name: 'topicStatistics',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/topicStatistics.js'));
              cb(null, require('./routes/meetingManagement/topicStatistics.js'));
            });
          },

        },
        //会议生成
        {
          path: 'addMeeting',
          name: 'addMeeting',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/addMeeting/addMeeting.js'));
              cb(null, require('./routes/meetingManagement/addMeeting/addMeeting.js'));
            });
          },
        },
        {
          path: 'addMeeting/addMeetingNote',
          name: 'addMeeting/addMeetingNote',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/addMeeting/addMeetingNote.js'));
              cb(null, require('./routes/meetingManagement/addMeeting/addMeetingNote.js'));
            });
          },
        },
        //院长已通过上会清单
        {
          path: 'addMeeting/passMeetingNote',
          name: 'addMeeting/passMeetingNote',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/addMeeting/passMeetingNote.js'));
              cb(null, require('./routes/meetingManagement/addMeeting/passMeetingNote.js'));
            });
          },
        },

        //会议确认
        {
          path: 'meetingConfirm',
          name: 'meetingConfirm',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/meetingConfirm.js'));
              cb(null, require('./routes/meetingManagement/meetingConfirm.js'));
            });
          },
        },
        //会议查询
        {
          path: 'meetingQuery',
          name: 'meetingQuery',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/meetingManagement/meetingQuery.js'));
              cb(null, require('./routes/meetingManagement/meetingQuery.js'));
            });
          },
        },
      ]
    },

    //贾茹路由文件
    //印章证照管理系统
    {
      path: 'adminApp/sealManage',
      name: 'adminApp/sealManage',

      childRoutes:[
        //印章证照申请
        // 印章证照申请
        {
          path: 'sealIndexApply',
          name: 'sealIndexApply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealApply/sealIndexApply.js'));
              cb(null, require('./routes/sealManage/sealApply/sealIndexApply.js'));
            });
          },
        },
        // 印章个人查询页面
        {
          path: 'sealPersonalQuery',
          name: 'sealPersonalQuery',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealQuery/sealPersonalQuery.js'));
              cb(null, require('./routes/sealManage/sealQuery/sealPersonalQuery.js'));
            });
          },
        },
        // 印章个人查询详情页面
        {
          path: 'sealQuery/applyDetail',
          name: 'sealQuery/applyDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealQuery/applyDetail.js'));
              cb(null, require('./routes/sealManage/sealQuery/applyDetail.js'));
            });
          },
        },
        //印章使用申请
        {
          path: 'sealIndexApply/sealComApply',
          name: 'sealIndexApply/sealComApply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealApply/sealComApply.js'));
              cb(null, require('./routes/sealManage/sealApply/sealComApply.js'));
            });
          },

        },

        //院领导名章使用申请页面
        {
          path: 'sealIndexApply/sealLeaderApply',
          name: 'sealIndexApply/sealLeaderApply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealApply/sealLeaderApply.js'));
              cb(null, require('./routes/sealManage/sealApply/sealLeaderApply.js'));
            });
          },

        },

        //营业执照使用申请页面
        {
          path: 'sealIndexApply/businessLicenseApply',
          name: 'sealIndexApply/businessLicenseApply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealApply/businessLicenseApply.js'));
              cb(null, require('./routes/sealManage/sealApply/businessLicenseApply.js'));
            });
          },

        },

        //院领导身份证使用申请页面
        {
          path: 'sealIndexApply/sealLeaderIDApply',
          name: 'sealIndexApply/sealLeaderIDApply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealApply/sealLeaderIDApply.js'));
              cb(null, require('./routes/sealManage/sealApply/sealLeaderIDApply.js'));
            });
          },

        },

        //营业执照原件外借申请
        {
          path: 'sealIndexApply/borrowBusiness',
          name: 'sealIndexApply/borrowBusiness',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealApply/borrowBusiness.js'));
              cb(null, require('./routes/sealManage/sealApply/borrowBusiness.js'));
            });
          },

        },

        // 院领导名章外借申请
        {
          path: 'sealIndexApply/borrowLeader',
          name: 'sealIndexApply/borrowLeader',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealApply/borrowLeader.js'));
              cb(null, require('./routes/sealManage/sealApply/borrowLeader.js'));
            });
          },

        },

        //印章外借申请
        {
          path: 'sealIndexApply/borrowSeal',
          name: 'sealIndexApply/borrowSeal',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealApply/borrowSeal.js'));
              cb(null, require('./routes/sealManage/sealApply/borrowSeal.js'));
            });
          },

        },

        //刻章申请
        {
          path: 'markSeal',
          name: 'markSeal',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealApply/markSeal.js'));
              cb(null, require('./routes/sealManage/sealApply/markSeal.js'));
            });
          },

        },

        //我的审核
        {
          path: 'myJudge',
          name: 'myJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myJudge/judgeList.js'));
              cb(null, require('./routes/sealManage/myJudge/judgeList.js'));
            });
          },

        },
        //我的审核
        {
          path: 'myComplete',
          name: 'myComplete',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myJudge/judgeList.js'));
              cb(null, require('./routes/sealManage/myJudge/judgeList.js'));
            });
          },

        },
        //营业执照外借申请审核页面
        {
          path: 'myJudge/borrowBusinessJudge',
          name: 'myJudge/borrowBusinessJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myJudge/borrowBusinessJudge.js'));
              cb(null, require('./routes/sealManage/myJudge/borrowBusinessJudge.js'));
            });
          },

        },

        //营业执照外借申请修改页面
        {
          path: 'sealPersonalQuery/borrowBusinessReset',
          name: 'sealPersonalQuery/borrowBusinessReset',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myReset/borrowBusinessReset.js'));
              cb(null, require('./routes/sealManage/myReset/borrowBusinessReset.js'));
            });
          },

        },

        //领导名章外借申请审核页面
        {
          path: 'myJudge/borrowLeaderJudge',
          name: 'myJudge/borrowLeaderJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myJudge/borrowLeaderJudge.js'));
              cb(null, require('./routes/sealManage/myJudge/borrowLeaderJudge.js'));
            });
          },

        },

        //领导名章外借申请修改页面
        {
          path: 'sealPersonalQuery/borrowLeaderReset',
          name: 'sealPersonalQuery/borrowLeaderReset',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myReset/borrowLeaderReset.js'));
              cb(null, require('./routes/sealManage/myReset/borrowLeaderReset.js'));
            });
          },

        },

        //印章外借申请审核页面
        {
          path: 'myJudge/borrowSealJudge',
          name: 'myJudge/borrowSealJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myJudge/borrowSealJudge.js'));
              cb(null, require('./routes/sealManage/myJudge/borrowSealJudge.js'));
            });
          },

        },

        //印章外借申请修改页面
        {
          path: 'sealPersonalQuery/borrowSealReset',
          name: 'sealPersonalQuery/borrowSealReset',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myReset/borrowSealReset.js'));
              cb(null, require('./routes/sealManage/myReset/borrowSealReset.js'));
            });
          },

        },

        //刻章申请审核页面
        {
          path: 'myJudge/markSealJudge',
          name: 'myJudge/markSealJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myJudge/markSealJudge.js'));
              cb(null, require('./routes/sealManage/myJudge/markSealJudge.js'));
            });
          },

        },

        //刻章申请修改页面
        {
          path: 'sealPersonalQuery/markSealReset',
          name: 'sealPersonalQuery/markSealReset',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myReset/markSealReset.js'));
              cb(null, require('./routes/sealManage/myReset/markSealReset.js'));
            });
          },

        },

        //印章使用审核页面
        {
          path: 'myJudge/sealComJudge',
          name: 'myJudge/sealComJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myJudge/sealComJudge.js'));
              cb(null, require('./routes/sealManage/myJudge/sealComJudge.js'));
            });
          },

        },

        //印章使用修改页面
        {
          path: 'sealPersonalQuery/sealComReset',
          name: 'sealPersonalQuery/sealComReset',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myReset/sealComReset.js'));
              cb(null, require('./routes/sealManage/myReset/sealComReset.js'));
            });
          },

        },

        //院领导名章使用审核页面
        {
          path: 'myJudge/sealLeaderJudge',
          name: 'myJudge/sealLeaderJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myJudge/sealLeaderJudge.js'));
              cb(null, require('./routes/sealManage/myJudge/sealLeaderJudge.js'));
            });
          },

        },

        //院领导名章使用修改页面
        {
          path: 'sealPersonalQuery/sealLeaderReset',
          name: 'sealPersonalQuery/sealLeaderReset',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myReset/sealLeaderReset.js'));
              cb(null, require('./routes/sealManage/myReset/sealLeaderReset.js'));
            });
          },

        },

        //营业执照使用审核页面
        {
          path: 'myJudge/businessLicenseJudge',
          name: 'myJudge/businessLicenseJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myJudge/businessLicenseJudge.js'));
              cb(null, require('./routes/sealManage/myJudge/businessLicenseJudge.js'));
            });
          },

        },

        //营业执照使用审核修改
        {
          path: 'sealPersonalQuery/businessLicenseReset',
          name: 'sealPersonalQuery/businessLicenseReset',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myReset/businessLicenseReset.js'));
              cb(null, require('./routes/sealManage/myReset/businessLicenseReset.js'));
            });
          },

        },

        //院领导身份证复印件使用审核页面
        {
          path: 'myJudge/leaderIDJudge',
          name: 'myJudge/leaderIDJudge',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myJudge/leaderIDJudge.js'));
              cb(null, require('./routes/sealManage/myJudge/leaderIDJudge.js'));
            });
          },

        },

        //院领导身份证复印件使用修改页面
        {
          path: 'sealPersonalQuery/leaderIDReset',
          name: 'sealPersonalQuery/leaderIDReset',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myReset/leaderIDReset.js'));
              cb(null, require('./routes/sealManage/myReset/leaderIDReset.js'));
            });
          },

        },

        //营业执照外借审核详情页面
        {
          path: 'myJudge/borrowBusinessDetail',
          name: 'myJudge/borrowBusinessDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/borrowBusinessDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/borrowBusinessDetail.js'));
            });
          },
        },

        //营业执照外借审核详情页面（个人查询）
        {
          path: 'sealPersonalQuery/borrowBusinessDetail',
          name: 'sealPersonalQuery/borrowBusinessDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/borrowBusinessDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/borrowBusinessDetail.js'));
            });
          },
        },
        //营业执照外借审核详情页面（用印查询）
        {
          path: 'managerSealQuery/borrowBusinessDetail',
          name: 'managerSealQuery/borrowBusinessDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/borrowBusinessDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/borrowBusinessDetail.js'));
            });
          },
        },
        //院领导名章外借审核详情页面
        {
          path: 'myJudge/borrowLeaderDetail',
          name: 'myJudge/borrowLeaderDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/borrowLeaderDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/borrowLeaderDetail.js'));
            });
          },

        },
        //院领导名章外借审核详情页面(个人查询)
        {
          path: 'sealPersonalQuery/borrowLeaderDetail',
          name: 'sealPersonalQuery/borrowLeaderDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/borrowLeaderDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/borrowLeaderDetail.js'));
            });
          },

        },
        //院领导名章外借审核详情页面(用印查询)
        {
          path: 'managerSealQuery/borrowLeaderDetail',
          name: 'managerSealQuery/borrowLeaderDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/borrowLeaderDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/borrowLeaderDetail.js'));
            });
          },

        },
        //印章使用审核详情页面
        {
          path: 'myJudge/sealComDetail',
          name: 'myJudge/sealComDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/sealComDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/sealComDetail.js'));
            });
          },

        },
        //印章使用审核详情页面（个人查询）
        {
          path: 'sealPersonalQuery/sealComDetail',
          name: 'sealPersonalQuery/sealComDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/sealComDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/sealComDetail.js'));
            });
          },

        },
        //印章使用审核详情页面（用印查询）
        {
          path: 'managerSealQuery/sealComDetail',
          name: 'managerSealQuery/sealComDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/sealComDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/sealComDetail.js'));
            });
          },

        },
        //印章外借审核详情页面(我的审批)
        {
          path: 'myJudge/borrowSealDetail',
          name: 'myJudge/borrowSealDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/borrowSealDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/borrowSealDetail.js'));
            });
          },

        },
        //印章外借审核详情页面(个人查询)
        {
          path: 'sealPersonalQuery/borrowSealDetail',
          name: 'sealPersonalQuery/borrowSealDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/borrowSealDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/borrowSealDetail.js'));
            });
          },

        },
        //印章外借审核详情页面(用印查询)
        {
          path: 'managerSealQuery/borrowSealDetail',
          name: 'managerSealQuery/borrowSealDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/borrowSealDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/borrowSealDetail.js'));
            });
          },

        },
        //印章使用审核详情页面
        {
          path: 'myJudge/sealComDetail',
          name: 'myJudge/sealComDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/sealComDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/sealComDetail.js'));
            });
          },

        },
        //印章使用审核详情页面（个人查询）
        {
          path: 'sealPersonalQuery/sealComDetail',
          name: 'sealPersonalQuery/sealComDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/sealComDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/sealComDetail.js'));
            });
          },

        },
        //印章使用审核详情页面（用印查询）
        {
          path: 'managerSealQuery/sealComDetail',
          name: 'managerSealQuery/sealComDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/sealComDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/sealComDetail.js'));
            });
          },

        },
        //营业执照复印件使用审核详情页面
        {
          path: 'myJudge/businessLicenseDetail',
          name: 'myJudge/businessLicenseDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/businessLicenseDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/businessLicenseDetail.js'));
            });
          },

        },
        //营业执照复印件使用审核详情页面（个人查询）
        {
          path: 'sealPersonalQuery/businessLicenseDetail',
          name: 'sealPersonalQuery/businessLicenseDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/businessLicenseDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/businessLicenseDetail.js'));
            });
          },

        },
        //营业执照复印件使用审核详情页面（用印查询）
        {
          path: 'managerSealQuery/businessLicenseDetail',
          name: 'managerSealQuery/businessLicenseDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/businessLicenseDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/businessLicenseDetail.js'));
            });
          },

        },
        //院领导身份证复印件使用审核详情页面
        {
          path: 'myJudge/leaderIDDetail',
          name: 'myJudge/leaderIDDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/leaderIDDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/leaderIDDetail.js'));
            });
          },

        },
        //院领导身份证复印件使用审核详情页面（个人查询）
        {
          path: 'sealPersonalQuery/leaderIDDetail',
          name: 'sealPersonalQuery/leaderIDDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/leaderIDDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/leaderIDDetail.js'));
            });
          },

        },
        //院领导身份证复印件使用审核详情页面（用印查询）
        {
          path: 'managerSealQuery/leaderIDDetail',
          name: 'managerSealQuery/leaderIDDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/leaderIDDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/leaderIDDetail.js'));
            });
          },

        },
        //院领导名章使用审核详情页面
        {
          path: 'myJudge/sealLeaderDetail',
          name: 'myJudge/sealLeaderDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/sealLeaderDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/sealLeaderDetail.js'));
            });
          },

        },
        //院领导名章使用审核详情页面（个人查询）
        {
          path: 'sealPersonalQuery/sealLeaderDetail',
          name: 'sealPersonalQuery/sealLeaderDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/sealLeaderDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/sealLeaderDetail.js'));
            });
          },

        },
        //院领导名章使用审核详情页面（用印查询）
        {
          path: 'managerSealQuery/sealLeaderDetail',
          name: 'managerSealQuery/sealLeaderDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/sealLeaderDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/sealLeaderDetail.js'));
            });
          },

        },
        //刻章审核详情页面
        {
          path: 'myJudge/markSealDetail',
          name: 'myJudge/markSealDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/markSealDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/markSealDetail.js'));
            });
          },

        },

        //刻章审核详情页面（个人查询）
        {
          path: 'sealPersonalQuery/markSealDetail',
          name: 'sealPersonalQuery/markSealDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/markSealDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/markSealDetail.js'));
            });
          },

        },
        //刻章审核详情页面（用印查询）
        {
          path: 'managerSealQuery/markSealDetail',
          name: 'managerSealQuery/markSealDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/myComplete/markSealDetail.js'));
              cb(null, require('./routes/sealManage/myComplete/markSealDetail.js'));
            });
          },

        },
        // 用印类型配置页面
        {
          path: 'sealTypeConfig',
          name: 'sealTypeConfig',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealTypeConfig/sealTypeConfig.js'));
              cb(null, require('./routes/sealManage/sealTypeConfig/sealTypeConfig.js'));
            });
          },
        },
        // 印章个人查询页面
        {
          path: 'managerSealQuery',
          name: 'managerSealQuery',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sealManage/sealQuery/managerSealQuery.js'));
              cb(null, require('./routes/sealManage/sealQuery/managerSealQuery.js'));
            });
          },
        },
      ]
    },
    //常用资料
    {
      path: 'adminApp/commonDataSystem',
      name: 'adminApp/commonDataSystem',
      childRoutes: [
        //配置管理
        {
          path: 'managerConfig',
          name: 'managerConfig',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/commonDataSystem/mangerConfig/managerConfig.js'));
              cb(null, require('./routes/commonDataSystem/mangerConfig/managerConfig.js'));
            });
          },
        },
        //常用资料
        {
          path: 'commonData',
          name: 'commonData',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/commonDataSystem/mangerConfig/managerConfig.js'));
              cb(null, require('./routes/commonDataSystem/commonData/commonData.js'));
            });
          },
        },
        //////////////////////////////////////////




        ////////////////////////////////////////////////////
        // 目录配置
        {
          path: 'directoryConfig',
          name: 'directoryConfig',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/commonDataSystem/directoryConfig.js'));
              cb(null, require('./routes/commonDataSystem/directoryConfig.js'));
            });
          },
        },
        //我的已传
        {
          path: 'myBiography',
          name: 'myBiography',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/commonDataSystem/mangerConfig/managerConfig.js'));
              cb(null, require('./routes/commonDataSystem/commonData/myBiography.js'));
            });
          },
        },
        //上传文件
        {
          path: 'commonData/UploadFiles',
          name: 'commonData/UploadFiles',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/commonDataSystem/mangerConfig/managerConfig.js'));
              cb(null, require('./routes/commonDataSystem/commonData/uploadFiles.js'));
            });
          },
        },
        //目录配置
        {
          path: 'commonData/directoryConfiguration',
          name: 'commonData/directoryConfiguration',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/commonDataSystem/mangerConfig/managerConfig.js'));
              cb(null, require('./routes/commonDataSystem/directoryConfig.js'));
            });
          },
        },
        //我的待办
        // {
        //   path: 'toDoList',
        //   name: 'toDoList',
        //   getComponent(nextState, cb) {
        //     require.ensure([], require => {
        //       registerModel(app, require('./models/commonDataSystem/mangerConfig/managerConfig.js'));
        //       cb(null, require('./routes/commonDataSystem/toDoList/toDoList.js'));
        //     });
        //   },
        // },
        //统计信息
        {
          path: 'statisticalInformation',
          name: 'statisticalInformation',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/commonDataSystem/mangerConfig/managerConfig.js'));
              cb(null, require('./routes/commonDataSystem/mangerConfig/managerConfig.js'));
            });
          },
        },
      ]
    },
    // 窦阳春路由文件
      //安全检查系统
      {
        path: 'adminApp/securityCheck',
        name: 'adminApp/securityCheck',
        childRoutes: [
          //安委办检查首页
          {
            path: 'safeCheck',
            name: 'safeCheck',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/securityOfficeIndex.js'));
                cb(null, require('./routes/securityCheck/securityOffice/securityOfficeIndex.js'));
              });
            },
          },
          //部门自查模块首页
          {
            path: 'deptCheck',
            name: 'deptCheck',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/securityOfficeIndex.js'));
                cb(null, require('./routes/securityCheck/securityOffice/securityOfficeIndex.js'));
              });
            },
          },
          //分院检查模块首页
          {
            path: 'branchCheck',
            name: 'branchCheck',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/securityOfficeIndex.js'));
                cb(null, require('./routes/securityCheck/securityOffice/securityOfficeIndex.js'));
              });
            },
          },
          //部门安全员-新建任务
          {
            path: 'deptCheck/setNewTask',
            name: 'deptCheck/setNewTask',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/setNewTask.js'));
                cb(null, require('./routes/securityCheck/securityOffice/setNewTask.js'));
              });
            },
          },
          //安委办-新建任务
          //新建任务
          {
            path: 'safeCheck/setNewTask',
            name: 'safeCheck/setNewTask',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/setNewTask.js'));
                cb(null, require('./routes/securityCheck/securityOffice/setNewTask.js'));
              });
            },
          },
          //分院-新建任务
          {
            path: 'branchCheck/setNewTask',
            name: 'branchCheck/setNewTask',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/setNewTask.js'));
                cb(null, require('./routes/securityCheck/securityOffice/setNewTask.js'));
              });
            },
          },
          // 安委办-修改任务
          {
            path: 'safeCheck/modifyTask',
            name: 'safeCheck/modifyTask',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/setNewTask.js'));
                cb(null, require('./routes/securityCheck/securityOffice/modifyTask.js'));
              });
            },
          },
          // 分院-修改任务
          {
            path: 'branchCheck/modifyTask',
            name: 'branchCheck/modifyTask',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/setNewTask.js'));
                cb(null, require('./routes/securityCheck/securityOffice/modifyTask.js'));
              });
            },
          },
          // 部门安全员-修改任务
          {
            path: 'deptCheck/modifyTask',
            name: 'deptCheck/modifyTask',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/setNewTask.js'));
                cb(null, require('./routes/securityCheck/securityOffice/modifyTask.js'));
              });
            },
          },
          // 部门安全员 -- 检查中
          {
            path: 'deptCheck/checkDetailing',
            name: 'deptCheck/checkDetailing',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/checkDetailing.js'));
                cb(null, require('./routes/securityCheck/securityOffice/checkDetailing.js'));
              });
            },
          },
          // 安委办 -- 检查中
          {
            path: 'safeCheck/checkDetailing',
            name: 'safeCheck/checkDetailing',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/checkDetailing.js'));
                cb(null, require('./routes/securityCheck/securityOffice/checkDetailing.js'));
              });
            },
          },
          // 分院 -- 检查中
          {
            path: 'branchCheck/checkDetailing',
            name: 'branchCheck/checkDetailing',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/checkDetailing.js'));
                cb(null, require('./routes/securityCheck/securityOffice/checkDetailing.js'));
              });
            },
          },
          // 安委办 -- 检查完成
          {
            path: 'safeCheck/checkFinish',
            name: 'safeCheck/checkFinish',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/checkFinish.js'));
                cb(null, require('./routes/securityCheck/securityOffice/checkFinish.js'));
              });
            },
          },
          // 分院 -- 检查完成
          {
            path: 'branchCheck/checkFinish',
            name: 'branchCheck/checkFinish',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/checkDetailing.js'));
                cb(null, require('./routes/securityCheck/securityOffice/checkDetailing.js'));
              });
            },
          },
          // 部门安全员 -- 检查完成
          {
            path: 'deptCheck/checkFinish',
            name: 'deptCheck/checkFinish',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityOffice/checkFinish.js'));
                cb(null, require('./routes/securityCheck/securityOffice/checkFinish.js'));
              });
            },
          },
          // 配置
          {
            path: 'checkConfig',
            name: 'checkConfig',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/checkConfig/checkConfig.js'));
                cb(null, require('./routes/securityCheck/checkConfig/checkConfig.js'));
              });
            },
          },
          //安控系统
          {
            path: 'SecurityControlSystem',
            name: 'SecurityControlSystem',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityControlSystem/securityControl.js'));
                cb(null, require('./routes/securityCheck/securityControlSystem/securityControl.js'));
              });
            },
          },
          //安控系统
          {
            path: 'SecurityControlSystem/updateDetails',
            name: 'SecurityControlSystem/updateDetails',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/securityControlSystem/updateDetails.js'));
                cb(null, require('./routes/securityCheck/securityControlSystem/updateDetails.js'));
              });
            },
          },
          //我的消息首页
          {
            path: 'myNews',
            name: 'myNews',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/myNews/myNewsIndex.js'));
                cb(null, require('./routes/securityCheck/myNews/myNewsIndex.js'));
              });
            },
          },
                    {
                      //派发检查任务
                      path: 'myNews/modifyTask',
                      name: 'myNews/modifyTask',
                      getComponent(nextState, cb) {
                        require.ensure([], require => {
                          registerModel(app, require('./models/securityCheck/myNews/setNewTask.js'));
                          cb(null, require('./routes/securityCheck/myNews/modifyTask.js'));
                        });
                      },
                    },
                    {
                      //整改通知
                      path: 'myNews/safetyTask',
                      name: 'myNews/safetyTask',
                      getComponent(nextState, cb) {
                        require.ensure([], require => {
                          registerModel(app, require('./models/securityCheck/myNews/safetyTask.js'));
                          cb(null, require('./routes/securityCheck/myNews/safetyTask.js'));
                        });
                      },
                    },
                    {
                      //员工自查任务
                      path: 'myNews/rectificationNotice',
                      name: 'myNews/rectificationNotice',
                      getComponent(nextState, cb) {
                        require.ensure([], require => {
                          registerModel(app, require('./models/securityCheck/myNews/rectificationNotice.js'));
                          cb(null, require('./routes/securityCheck/myNews/rectificationNotice.js'));
                        });
                      },
                    },
                    {
                      //整改反馈消息页面
                      path: 'myNews/rectificationFeedback',
                      name: 'myNews/rectificationFeedback',
                      getComponent(nextState, cb) {
                        require.ensure([], require => {
                          registerModel(app, require('./models/securityCheck/myNews/rectificationFeedback.js'));
                          cb(null, require('./routes/securityCheck/myNews/rectificationFeedback.js'));
                        });
                      },
                    },
                    {
                      //员工督查反馈消息页面
                      path: 'myNews/staffSupervision',
                      name: 'myNews/staffSupervision',
                      getComponent(nextState, cb) {
                        require.ensure([], require => {
                          registerModel(app, require('./models/securityCheck/myNews/staffSupervision.js'));
                          cb(null, require('./routes/securityCheck/myNews/staffSupervision.js'));
                        });
                      },
                    },
                    {
                    //对不合格的反馈消息页面
                      path: 'myNews/unqualifiedFeedback',
                      name: 'myNews/unqualifiedFeedback',
                      getComponent(nextState, cb) {
                        require.ensure([], require => {
                          registerModel(app, require('./models/securityCheck/myNews/unqualifiedFeedback.js'));
                          cb(null, require('./routes/securityCheck/myNews/unqualifiedFeedback.js'));
                        });
                      },
                    },
                    {
                      //通报意见征求反馈页面
                        path: 'myNews/requestForNotification',
                        name: 'myNews/requestForNotification',
                        getComponent(nextState, cb) {
                          require.ensure([], require => {
                            registerModel(app, require('./models/securityCheck/myNews/requestForNotification.js'));
                            cb(null, require('./routes/securityCheck/myNews/requestForNotification.js'));
                          });
                        },
                      },
                      {
                        //审批统计报告
                          path: 'myNews/approvalStatistics',
                          name: 'myNews/approvalStatistics',
                          getComponent(nextState, cb) {
                            require.ensure([], require => {
                              registerModel(app, require('./models/securityCheck/myNews/approvalStatistics.js'));
                              cb(null, require('./routes/securityCheck/myNews/approvalStatistics.js'));
                            });
                          },
                        },
                      //

          //通知通报
          {
            path: 'Notification',
            name: 'Notification',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/Notification/NotificationIndex.js'));
                cb(null, require('./routes/securityCheck/Notification/NotificationIndex.js'));
              });
            },
          },
           //督查建议反馈
              {
                path: 'Notification/lnspectionRecommendations',
                name: 'Notification/lnspectionRecommendations',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/securityCheck/Notification/lnspectionRecommendations.js'));
                    cb(null, require('./routes/securityCheck/Notification/lnspectionRecommendations.js'));
                  });
                },
              },
              //抄送页面（员工督查）
              {
                path: 'Notification/employeeInspection',
                name: 'Notification/employeeInspection',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/securityCheck/Notification/employeeInspection.js'));
                    cb(null, require('./routes/securityCheck/Notification/employeeInspection.js'));
                  });
                },
              },
              //安全检查通知详情
              {
                path: 'Notification/checkNotice',
                name: 'Notification/checkNotice',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/securityCheck/Notification/checkNotice.js'));
                    cb(null, require('./routes/securityCheck/Notification/checkNotice.js'));
                  });
                },
              },

              //通报意见
              {
                path: 'Notification/tongBaoYiJian',
                name: 'Notification/tongBaoYiJian',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/securityCheck/Notification/tongBaoYiJian.js'));
                    cb(null, require('./routes/securityCheck/Notification/tongBaoYiJian.js'));
                  });
                },
              },
               //统计通报
               {
                path: 'Notification/statisticalBulletin',
                name: 'Notification/statisticalBulletin',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/securityCheck/Notification/statisticalBulletin.js'));
                    cb(null, require('./routes/securityCheck/Notification/statisticalBulletin.js'));
                  });
                },
              },
               //领导审批意见
               {
                path: 'Notification/leaderApproval',
                name: 'Notification/leaderApproval',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/securityCheck/Notification/leaderApproval.js'));
                    cb(null, require('./routes/securityCheck/Notification/leaderApproval.js'));
                  });
                },
              },
              //通报
              {
                path: 'Notification/bulletin',
                name: 'Notification/bulletin',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/securityCheck/Notification/bulletin.js'));
                    cb(null, require('./routes/securityCheck/Notification/bulletin.js'));
                  });
                },
              },
              //表扬
              {
                path: 'Notification/praise',
                name: 'Notification/praise',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/securityCheck/Notification/praise.js'));
                    cb(null, require('./routes/securityCheck/Notification/praise.js'));
                  });
                },
              },
              //整改结果
              {
                path: 'Notification/rectificationResults',
                name: 'Notification/rectificationResults',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/securityCheck/Notification/praise.js'));
                    cb(null, require('./routes/securityCheck/Notification/rectificationResults.js'));
                  });
                },
              },

               //接口人上报的安全检查情况
               {
                path: 'Notification/lnterfaceReport',
                name: 'Notification/lnterfaceReport',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/securityCheck/Notification/lnterfaceReport.js'));
                    cb(null, require('./routes/securityCheck/Notification/lnterfaceReport.js'));
                  });
                },
              },
               //分院统计报告上报页面
               {
                path: 'Notification/branchStatisticsReport',
                name: 'Notification/branchStatisticsReport',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/securityCheck/Notification/branchStatisticsReport.js'));
                    cb(null, require('./routes/securityCheck/Notification/branchStatisticsReport.js'));
                  });
                },
              },



          //情况统计
          {
            path: 'checkStatistics',
            name: 'checkStatistics',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/checkStatistics/checkStatisticsIndex.js'));
                cb(null, require('./routes/securityCheck/checkStatistics/checkStatisticsIndex.js'));
              });
            },
          },
          //创建报告
          {
            path: 'checkStatistics/createReport',
            name: 'checkStatistics/createReport',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/checkStatistics/createReport.js'));
                cb(null, require('./routes/securityCheck/checkStatistics/createReport.js'));
              });
            },
          },

           //查看详情
           {
            path: 'checkStatistics/reportInFor',
            name: 'checkStatistics/reportInFor',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/checkStatistics/reportInFor.js'));
                cb(null, require('./routes/securityCheck/checkStatistics/reportInFor.js'));
              });
            },
          },
           //创建报告详情
           {
            path: 'checkStatistics/createdReportInfor',
            name: 'checkStatistics/createdReportInfor',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/securityCheck/checkStatistics/createdReportInfor.js'));
                cb(null, require('./routes/securityCheck/checkStatistics/createdReportInfor.js'));
              });
            },
          },
        ]
      }, 
      //贾茹路由文件
      //新闻宣传共享平台
      {
        path: 'adminApp/newsOne',
        name: 'adminApp/newsOne',
        childRoutes: [
            //稿件管理
           {
              path: 'manuscriptManagement',
              name: 'manuscriptManagement',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/manuscriptManagement/manuscriptManagementIndex.js'));
                  cb(null, require('./routes/newsOne/manuscriptManagement/manuscriptManagementIndex.js'));
                });
              },
            },
             //稿件填报
                  {
                    path: 'manuscriptManagement/setNewManuscript',
                    name: 'manuscriptManagement/setNewManuscript',
                    getComponent(nextState, cb) {
                      require.ensure([], require => {
                        registerModel(app, require('./models/newsOne/manuscriptManagement/setNewManuscriptIndex.js'));
                        cb(null, require('./routes/newsOne/manuscriptManagement/setNewManuscriptIndex.js'));
                      });
                    },
                  },
                 // 稿件修改
                  {
                    path: 'manuscriptManagement/manuscriptRevision',
                    name: 'manuscriptManagement/manuscriptRevision',
                    getComponent(nextState, cb) {
                      require.ensure([], require => {
                        registerModel(app, require('./models/newsOne/manuscriptManagement/manuscriptRevisionIndex.js'));
                        cb(null, require('./routes/newsOne/manuscriptManagement/manuscriptRevisionIndex.js'));
                      });
                    },
                  },
                 // 稿件详情
                  {
                    path: 'manuscriptManagement/manuscriptDetails',
                    name: 'manuscriptManagement/manuscriptDetails',
                    getComponent(nextState, cb) {
                      require.ensure([], require => {
                        registerModel(app, require('./models/newsOne/manuscriptManagement/manuscriptDetailsIndex.js'));
                        cb(null, require('./routes/newsOne/manuscriptManagement/manuscriptDetailsIndex.js'));
                      });
                    },
                  },
            //稿件发布情况
            {
              path: 'releaseOfManuscripts',
              name: 'releaseOfManuscripts',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/releaseOfManuscripts/releaseOfManuscriptsIndex.js'));
                  cb(null, require('./routes/newsOne/releaseOfManuscripts/releaseOfManuscriptsIndex.js'));
                });
              },
            },
              // 素材反馈已发布详情
              {
                path: 'releaseOfManuscripts/releaseOfManuscriptsDetails',
                name: 'releaseOfManuscripts/releaseOfManuscriptsDetails',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/releaseOfManuscripts/releaseOfManuscriptsDetails.js'));
                    cb(null, require('./routes/newsOne/releaseOfManuscripts/releaseOfManuscriptsDetails.js'));
                  });
                },
              },
                // 素材反馈填报
                {
                path: 'releaseOfManuscripts/feedbackFilling',
                name: 'releaseOfManuscripts/feedbackFilling',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/releaseOfManuscripts/feedbackFilling.js'));
                    cb(null, require('./routes/newsOne/releaseOfManuscripts/feedbackFilling.js'));
                  });
                },
              },
             //统计报表
             {
              path: 'statisticalReport',
              name: 'statisticalReport',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/statisticalReport/statisticalReportIndex.js'));
                  cb(null, require('./routes/newsOne/statisticalReport/statisticalReportIndex.js'));
                });
              },
            },
            //统计列表展开二级列表的跳转页面-稿件名称的发布情况详情
            {
              path: 'statisticalReport/manuscriptDetail',
              name: 'statisticalReport/manuscriptDetail',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/statisticalReport/manuscriptDetail.js'));
                  cb(null, require('./routes/newsOne/statisticalReport/manuscriptDetail.js'));
                });
              },
            },
              //宣传组织新增
              {
                path: 'statisticalReport/newPublicity',
                name: 'statisticalReport/newPublicity',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/statisticalReport/newPublicity.js'));
                    cb(null, require('./routes/newsOne/statisticalReport/newPublicity.js'));
                  });
                },
              },
              //宣传组织修改
              {
                path: 'statisticalReport/newSetPublicity',
                name: 'statisticalReport/newSetPublicity',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/statisticalReport/newSetPublicity.js'));
                    cb(null, require('./routes/newsOne/statisticalReport/newSetPublicity.js'));
                  });
                },
              },
              //宣传组织详情
              {
                path: 'statisticalReport/publicityDetail',
                name: 'statisticalReport/publicityDetail',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/statisticalReport/publicityDetail.js'));
                    cb(null, require('./routes/newsOne/statisticalReport/publicityDetail.js'));
                  });
                },
              },
               //稿件复核新增
               {
                path: 'statisticalReport/newManuscriptReview',
                name: 'statisticalReport/newManuscriptReview',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/statisticalReport/newManuscriptReview.js'));
                    cb(null, require('./routes/newsOne/statisticalReport/newManuscriptReview.js'));
                  });
                },
              },
              //稿件复核修改
              {
                path: 'statisticalReport/newSetManuscriptReview',
                name: 'statisticalReport/newSetManuscriptReview',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/statisticalReport/newSetManuscriptReview.js'));
                    cb(null, require('./routes/newsOne/statisticalReport/newSetManuscriptReview.js'));
                  });
                },
              },
              //稿件复核详情
              {
                path: 'statisticalReport/manuscriptReviewDetail',
                name: 'statisticalReport/manuscriptReviewDetail',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/statisticalReport/manuscriptReviewDetail.js'));
                    cb(null, require('./routes/newsOne/statisticalReport/manuscriptReviewDetail.js'));
                  });
                },
              },
                //加分项新增
                {
                path: 'statisticalReport/newBonus',
                name: 'statisticalReport/newBonus',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/statisticalReport/newBonus.js'));
                    cb(null, require('./routes/newsOne/statisticalReport/newBonus.js'));
                  });
                },
              },
              //加分项修改
              {
                path: 'statisticalReport/newSetBonus',
                name: 'statisticalReport/newSetBonus',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/statisticalReport/newSetBonus.js'));
                    cb(null, require('./routes/newsOne/statisticalReport/newSetBonus.js'));
                  });
                },
              },
              //加分项详情
              {
                path: 'statisticalReport/bonusDetail',
                name: 'statisticalReport/bonusDetail',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/statisticalReport/bonusDetail.js'));
                    cb(null, require('./routes/newsOne/statisticalReport/bonusDetail.js'));
                  });
                },
              },



             //争先创优 新闻报告新增
             {
              path: 'creatExcellence/newsReportAdd',
              name: 'creatExcellence/newsReportAdd',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/creatExcellence/newsReportAdd.js'));
                  cb(null, require('./routes/newsOne/creatExcellence/newsReportAdd.js'));
                });
              },
            },
            //争先创优
            {
              path: 'creatExcellence',
              name: 'creatExcellence',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/creatExcellence/creatExcellenceIndex.js'));
                  cb(null, require('./routes/newsOne/creatExcellence/creatExcellenceIndex.js'));
                });
              },
            },
            //争先创优 先进集体 单位 上传
            {
             path: 'creatExcellence/advancedUpload',
             name: 'creatExcellence/advancedUpload',
             getComponent(nextState, cb) {
               require.ensure([], require => {
                 registerModel(app, require('./models/newsOne/creatExcellence/advancedUpload.js'));
                 cb(null, require('./routes/newsOne/creatExcellence/advancedUpload.js'));
               });
             },
           },
          //争先创优 个人 组织者 上传
          {
            path: 'creatExcellence/eachUpload',
            name: 'creatExcellence/eachUpload',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/creatExcellence/eachUpload.js'));
                cb(null, require('./routes/newsOne/creatExcellence/eachUpload.js'));
              });
            },
          },
          //争先创优 新闻工作报告详情
          {
            path: 'creatExcellence/newsReportDetail',
            name: 'creatExcellence/newsReportDetail',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/creatExcellence/newsReportDetail.js'));
                cb(null, require('./routes/newsOne/creatExcellence/newsReportDetail.js'));
              });
            },
          },

          //新闻宣传贡献清单-培训备案首页
          {
            path: 'contributionList/trainingRecordIndex',
            name: 'contributionList/trainingRecordIndex',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/traininFiles/trainingRecordIndex.js'));
                cb(null, require('./routes/newsOne/contributionList/traininFiles/trainingRecordIndex.js'));
              });
            },
          },
          //新闻宣传贡献清单-培训备案首页 -培训备案上传
          {
            path: 'contributionList/trainingRecordIndex/trainRecordUpload',
            name: 'contributionList/trainingRecordIndex/trainRecordUpload',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/traininFiles/trainRecordUpload.js'));
                cb(null, require('./routes/newsOne/contributionList/traininFiles/trainRecordUpload.js'));
              });
            },
          },

              //我的审核
              {
                path: 'myReview',
                name: 'myReview',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/myReview/myReviewIndex.js'));
                    cb(null, require('./routes/newsOne/myReview/myReviewIndex.js'));
                  });
                },
              },

            //宣传渠道备案首页
            {
              path: 'publicityChannelsIndex',
              name: 'publicityChannelsIndex',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/publicityChannels/publicityChannelsIndex.js'));
                  cb(null, require('./routes/newsOne/publicityChannels/publicityChannelsIndex.js'));
                });
              },
            },
               //宣传渠道填报页面
               {
                path: 'publicityChannelsIndex/publicityChannelsWrite',
                name: 'publicityChannelsIndex/publicityChannelsWrite',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/publicityChannels/publicityChannelsWrite.js'));
                    cb(null, require('./routes/newsOne/publicityChannels/publicityChannelsWrite.js'));
                  });
                },
              },
               //宣传渠道修改页面
               {
                path: 'publicityChannelsIndex/publicityChannelsReset',
                name: 'publicityChannelsIndex/publicityChannelsReset',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/publicityChannels/publicityChannelsReset.js'));
                    cb(null, require('./routes/newsOne/publicityChannels/publicityChannelsReset.js'));
                  });
                },
              },
                   //宣传渠道详情页面
                   {
                    path: 'publicityChannelsIndex/publicityChannelsDetails',
                    name: 'publicityChannelsIndex/publicityChannelsDetails',
                    getComponent(nextState, cb) {
                      require.ensure([], require => {
                        registerModel(app, require('./models/newsOne/publicityChannels/publicityChannelsDetails.js'));
                        cb(null, require('./routes/newsOne/publicityChannels/publicityChannelsDetails.js'));
                      });
                    },
                  },
             //案例与经验分享首页
             {
              path: 'experienceSharingIndex',
              name: 'experienceSharingIndex',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/experienceSharing/experienceSharingIndex.js'));
                  cb(null, require('./routes/newsOne/experienceSharing/experienceSharingIndex.js'));
                });
              },
            },
              //案例与经验分享填报页
              {
                path: 'experienceSharingIndex/experienceSharingWrite',
                name: 'experienceSharingIndex/experienceSharingWrite',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/experienceSharing/experienceSharingWrite.js'));
                    cb(null, require('./routes/newsOne/experienceSharing/experienceSharingWrite.js'));
                  });
                },
              },
               //案例与经验分享详情/审核页
               {
                path: 'experienceSharingIndex/experienceSharingDetails',
                name: 'experienceSharingIndex/experienceSharingDetails',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/experienceSharing/experienceSharingDetails.js'));
                    cb(null, require('./routes/newsOne/experienceSharing/experienceSharingDetails.js'));
                  });
                },
              },
               //案例与经验分享修改页
               {
                path: 'experienceSharingIndex/experienceSharingReset',
                name: 'experienceSharingIndex/experienceSharingReset',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/experienceSharing/experienceSharingReset.js'));
                    cb(null, require('./routes/newsOne/experienceSharing/experienceSharingReset.js'));
                  });
                },
              },
            //舆情管理模块首页 opinion management
            {
              path: 'opinionManagementIndex',
              name: 'opinionManagementIndex',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/opinionManagement/opinionManagementIndex.js'));
                  cb(null, require('./routes/newsOne/opinionManagement/opinionManagementIndex.js'));
                });
              },
            },
            //舆情管理详情
            {
              path: 'opinionManagementIndex/opinionReport',
              name: 'opinionManagementIndex/opinionReport',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/opinionManagement/opinionReport.js'));
                  cb(null, require('./routes/newsOne/opinionManagement/opinionReport.js'));
                });
              },
            },
            //舆情管理新增填报
            {
              path: 'opinionManagementIndex/opinionAdd',
              name: 'opinionManagementIndex/opinionAdd',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/opinionManagement/opinionAdd.js'));
                  cb(null, require('./routes/newsOne/opinionManagement/opinionAdd.js'));
                });
              },
            },
              //舆情管理修改
              {
                path: 'opinionManagementIndex/opinionModify',
                name: 'opinionManagementIndex/opinionModify',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/opinionManagement/opinionAdd.js'));
                    cb(null, require('./routes/newsOne/opinionManagement/opinionAdd.js'));
                  });
                },
              },
            //新闻配置模块首页News configuration
            {
              path: 'newsConfigurationIndex',
              name: 'newsConfigurationIndex',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/newsConfigurationIndex.js'));
                  cb(null, require('./routes/newsOne/newsConfigurationIndex.js'));
                });
              },
            },
             //新闻资源宣传池模块首页News configuration
             {
              path: 'newsPoolIndex',
              name: 'newsPoolIndex',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  registerModel(app, require('./models/newsOne/newsPool/newsPoolIndex.js'));
                  cb(null, require('./routes/newsOne/newsPool/newsPoolIndex.js'));
                });
              },
            },
               // 稿件详情
               {
                path: 'newsPoolIndex/manuscriptDetails',
                name: 'newsPoolIndex/manuscriptDetails',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/manuscriptManagement/manuscriptDetailsIndex.js'));
                    cb(null, require('./routes/newsOne/manuscriptManagement/manuscriptDetailsIndex.js'));
                  });
                },
              },
                //新闻宣传贡献清单-培训备案首页 -培训备案详情页
          {
            path: 'contributionList/trainingRecordIndex/trainRecordDetail',
            name: 'contributionList/trainingRecordIndex/trainRecordDetail',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/traininFiles/trainRecordDetail.js'));
                cb(null, require('./routes/newsOne/contributionList/traininFiles/trainRecordDetail.js'));
              });
            },
          },
          //新闻宣传贡献清单
          {
            path: 'contributionList',
            name: 'contributionList',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/contributionList.js'));
                cb(null, require('./routes/newsOne/contributionList/contributionList.js'));
              });
            },
          },


          //新闻宣传贡献清单-培训备案首页 -培训备案详情
          {
            path: 'contributionList/trainingRecordIndex/trainRecordUpload',
            name: 'contributionList/trainingRecordIndex/trainRecordUpload',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/traininFiles/trainRecordDetail.js'));
                cb(null, require('./routes/newsOne/contributionList/traininFiles/trainRecordDetail.js'));
              });
            },
          },
          //新闻宣传贡献清单-培训备案首页 -培训备案修改
          {
            path: 'contributionList/trainingRecordIndex/trainRecordModify',
            name: 'contributionList/trainingRecordIndex/trainRecordModify',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/traininFiles/trainRecordModify.js'));
                cb(null, require('./routes/newsOne/contributionList/traininFiles/trainRecordModify.js'));
              });
            },
          },

          //新闻宣传贡献清单-培训申请
          {
            path: 'contributionList/trainAppIndex',
            name: 'contributionList/trainAppIndex',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/traininFiles/trainAppIndex.js'));
                cb(null, require('./routes/newsOne/contributionList/traininFiles/trainAppIndex.js'));
              });
            },
          },
          //新闻宣传贡献清单-培训申请 -修改
          {
            path: 'contributionList/trainAppIndex/trainAppModify',
            name: 'contributionList/trainAppIndex/trainAppModify',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/traininFiles/trainAppModify.js'));
                cb(null, require('./routes/newsOne/contributionList/traininFiles/trainAppModify.js'));
              });
            },
          },
          //新闻宣传贡献清单-培训申请 -详情
          {
            path: 'contributionList/trainAppIndex/trainAppDetail',
            name: 'contributionList/trainAppIndex/trainAppDetail',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/traininFiles/trainAppDetail.js'));
                cb(null, require('./routes/newsOne/contributionList/traininFiles/trainAppDetail.js'));
              });
            },
          },
           //新闻宣传贡献清单-培训申请 -填报
           {
            path: 'contributionList/trainAppIndex/trainAppWrite',
            name: 'contributionList/trainAppIndex/trainAppWrite',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/traininFiles/trainAppWrite.js'));
                cb(null, require('./routes/newsOne/contributionList/traininFiles/trainAppWrite.js'));
              });
            },
          },
           //新闻宣传贡献清单-软件研究院重大活动支撑 -首页
           {
            path: 'contributionList/majorSupportIndex',
            name: 'contributionList/majorSupportIndex',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/majorSupport/majorSupportIndex.js'));
                cb(null, require('./routes/newsOne/contributionList/majorSupport/majorSupportIndex.js'));
              });
            },
          },
          //新闻宣传贡献清单-软件研究院重大活动支撑 -填报
          {
            path: 'contributionList/majorSupportIndex/majorSupportWrite',
            name: 'contributionList/majorSupportIndex/majorSupportWrite',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/majorSupport/majorSupportWrite.js'));
                cb(null, require('./routes/newsOne/contributionList/majorSupport/majorSupportWrite.js'));
              });
            },
          },
          //新闻宣传贡献清单-软件研究院重大活动支撑 -详情
          {
            path: 'contributionList/majorSupportIndex/majorSupportDetail',
            name: 'contributionList/majorSupportIndex/majorSupportDetail',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/majorSupport/majorSupportDetail.js'));
                cb(null, require('./routes/newsOne/contributionList/majorSupport/majorSupportDetail.js'));
              });
            },
          },
           //新闻宣传贡献清单-软件研究院重大活动支撑 -修改
           {
            path: 'contributionList/majorSupportIndex/majorSupportModify',
            name: 'contributionList/majorSupportIndex/majorSupportModify',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/majorSupport/majorSupportModify.js'));
                cb(null, require('./routes/newsOne/contributionList/majorSupport/majorSupportModify.js'));
              });
            },
          },
          
              //争先创优 新闻报告修改页面
              {
                path: 'creatExcellence/newsReportModify',
                name: 'creatExcellence/newsReportModify',
                getComponent(nextState, cb) {
                  require.ensure([], require => {
                    registerModel(app, require('./models/newsOne/creatExcellence/newsReportAdd.js'));
                    cb(null, require('./routes/newsOne/creatExcellence/newsReportAdd.js'));
                  });
                },
              },

          //培训申请批量上传
          {
            path: 'contributionList/TrainBulkUpload',
            name: 'contributionList/TrainBulkUpload',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/newsOne/contributionList/traininFiles/trainBulkUpload.js'));
                cb(null, require('./routes/newsOne/contributionList/traininFiles/trainBulkUpload.js'));
              });
            },
          },
        ]

      },
      //公车管理系统
      {
        path: 'adminApp/carsManage',
        name: 'adminApp/carsManage',
        childRoutes: [
          //用车申请首页
          {
            path: 'carsApply',
            name: 'carsApply',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/carsManage/carsApply/applyIndex.js'));
                cb(null, require('./routes/carsManage/carsApply/applyIndex.js'));
              });
            },
          },
          {
            path: 'carsApply/carsApplyInput',
            name: 'carsApply/carsApplyInput',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/carsManage/carsApply/carsApplyInput.js'));
                cb(null, require('./routes/carsManage/carsApply/carsApplyInput.js'));
              });
            },
          },
          {
            path: 'carsApply/carsApplyModify',
            name: 'carsApply/carsApplyModify',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/carsManage/carsApply/carsApplyInput.js'));
                cb(null, require('./routes/carsManage/carsApply/carsApplyInput.js'));
              });
            },
          },
          {
            path: 'carsQuery',
            name: 'carsQuery',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/carsManage/carsQuery/queryIndex.js'));
                cb(null, require('./routes/carsManage/carsQuery/queryIndex.js'));
              });
            },
          },
          {
            path: 'carsQuery/applyDetails',
            name: 'carsQuery/applyDetails',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/carsManage/carsQuery/applyDetails.js'));
                cb(null, require('./routes/carsManage/carsQuery/applyDetails.js'));
              });
            },
          },
          {
            path: 'carsStatistics',
            name: 'carsStatistics',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/carsManage/carsStatistics/statisticIndex.js'));
                cb(null, require('./routes/carsManage/carsStatistics/statisticIndex.js'));
              });
            },
          },
          {
            path: 'carsStatistics/buildReport',
            name: 'carsStatistics/buildReport',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/carsManage/carsStatistics/buildReport.js'));
                cb(null, require('./routes/carsManage/carsStatistics/buildReport.js'));
              });
            },
          },
          {
            path: 'carsStatistics/showReport',
            name: 'carsStatistics/showReport',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/carsManage/carsStatistics/buildReport.js'));
                cb(null, require('./routes/carsManage/carsStatistics/buildReport.js'));
              });
            },
          },
          {
            path: 'myJudge',
            name: 'myJudge',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/carsManage/myJudge/judgeIndex.js'));
                cb(null, require('./routes/carsManage/myJudge/judgeIndex.js'));
              });
            },
          },
          {
            path: 'myJudge/judgePage',
            name: 'myJudge/judgePage',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/carsManage/myJudge/judgePage.js'));
                cb(null, require('./routes/carsManage/myJudge/judgePage.js'));
              });
            },
          },
        ]
      }

  ];
  return router;

}

module.exports = {
  name:'综合路由文件',
  compresensiveRouterConfig
}
