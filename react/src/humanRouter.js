/**
 * 作者：陈莲
 * 日期：2018-7-3
 * 邮箱：chenl192@chinaunicom.cn
 * 文件说明：人力应用路由配置
 */
function humanRouterConfig({ history, app, registerModel }) {
  let router = [
    {
      path: 'humanApp/employer',
      name: 'humanApp/employer',
      childRoutes: [
        {
          path: 'kindDist',
          name: 'kindDist',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/empKind/kindDist'));
              cb(null, require('./routes/employer/empKind/kindDist'));
            });
          },
        },
        {
          path: 'kindWatch',
          name: 'kindWatch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/empKind/kindWatch'));
              cb(null, require('./routes/employer/empKind/kindWatch'));
            });
          },
        },
        {
          path: 'hrsearch',
          name: 'hrsearch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/search/hrSearch'));
              cb(null, require('./routes/employer/search/hrsearch'));
            });
          },
        },
        {
          path: 'dmsearch',
          name: 'dmsearch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/search/search'));
              cb(null, require('./routes/employer/search/dmsearch'));
            });
          },
        },
        {
          path: 'dmprojsearch',
          name: 'dmprojsearch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/search/search'));
              cb(null, require('./routes/employer/search/dmprojsearch'));
            });
          },
        },
        {
          path: 'pmsearch',
          name: 'pmsearch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/search/pmsearch'));
              cb(null, require('./routes/employer/search/pmsearch'));
            });
          },
        },
        {
          path: 'hrsearch/searchDetail',
          name: 'hrsearch/searchDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/search/searchDetail'));//之前注了，因需求解开
              cb(null, require('./routes/employer/search/searchDetailNew'));
            });
          },
        },
        {
          path: 'pmsearch/searchDetail',
          name: 'pmsearch/searchDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              //registerModel(app, require('./models/employer/search/searchDetail'));
              cb(null, require('./routes/employer/search/searchDetailNew'));
            });
          },
        },
        {
          path: 'dmprojsearch/searchDetail',
          name: 'dmprojsearch/searchDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              //registerModel(app, require('./models/employer/search/searchDetail'));
              cb(null, require('./routes/employer/search/searchDetailNew'));
            });
          },
        },
        {
          path: 'dmsearch/searchDetail',
          name: 'dmsearch/searchDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              //registerModel(app, require('./models/employer/search/searchDetail'));
              cb(null, require('./routes/employer/search/searchDetailNew'));
            });
          },
        },
        {
          path: 'manage/searchDetail',
          name: 'manage/searchDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              //registerModel(app, require('./models/employer/search/searchDetail'));
              cb(null, require('./routes/employer/search/searchDetailNew'));
            });
          },
        },
        // {
        //   path: 'searchDetailNew',
        //   name: 'searchDetailNew',
        //   getComponent(nextState, cb) {
        //     require.ensure([], require => {
        //       //registerModel(app, require('./models/employer/search/searchDetail'));
        //       cb(null, require('./routes/employer/search/searchDetailNew'));
        //     });
        //   },
        // },
        {
          path: 'pmdistribute',
          name: 'pmdistribute',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/distribute/pmdistModels'));
              cb(null, require('./routes/employer/distribute/pmdist'));
            });
          },
        },
        {
          path: 'dmdistribute',
          name: 'dmdistribute',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/distribute/dmdistModelsNew'));
              cb(null, require('./routes/employer/distribute/dmdistNew'));
            });
          },
        },
        {
          path: 'psdistribute',
          name: 'psdistribute',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/distribute/psdistModels'));
              cb(null, require('./routes/employer/distribute/psdist'));
            });
          },
        },
        {
          path: 'masterdistribute',
          name: 'masterdistribute',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/distribute/psdistModels'));
              cb(null, require('./routes/employer/distribute/masterdist'));
            });
          },
        },
        {
          path: 'groupdistribute',
          name: 'groupdistribute',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/distribute/groupdistModels'));
              cb(null, require('./routes/employer/distribute/groupdist'));
            });
          },
        },
        /* 个人考核--考核结果，考核状态，模块开放时间修改-----------------开始*/
        {
          path: 'state',
          name: 'state',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/statistic/state'));
              cb(null, require('./routes/employer/statistic/state'));
            });
          },
        },
        {
          path: 'result',
          name: 'result',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/statistic/result'));
              cb(null, require('./routes/employer/statistic/result'));
            });
          },
        },
        {
          path: 'open',
          name: 'open',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/module/moduleOpen'));
              cb(null, require('./routes/employer/module/moduleOpen'));
            });
          },
        },

        {
          path: 'staffEvaluation',
          name: 'staffEvaluation',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/evaluation/evaluation'));
              cb(null, require('./routes/employer/evaluation/evaluation'));
            });
          },
        },
        {
          path: 'staffManage',
          name: 'staffManage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/saffManage/staffManage'));
              cb(null, require('./routes/employer/staffManage/staffManage'));
            });
          },
        },

        /**员工互评结果 */
        {
          path: 'globalInfo',
          name: 'globalInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/globalInfo/globalInfoModel'));
              cb(null, require('./routes/employer/globalInfo/globalInfo'));
            });
          },
        },

        /* 个人考核--考核结果，考核状态，模块开放时间修---------------结束*/
        /* 部门余数信息---------------开始*/
        {
          path: 'deptremain',
          name: 'deptremain',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/deptremain/deptremain'));
              cb(null, require('./routes/employer/deptremain/deptremain'));
            });
          },
        },
        /* 部门余数信息---------------结束*/
        /* 部门项目余数信息---------------开始*/
        {
          path: 'deptprojrank',
          name: 'deptprojrank',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/deptremain/projremain'));
              cb(null, require('./routes/employer/deptremain/projremain'));
            });
          },
        },
        /* 部门项目余数信息---------------结束*/

        {
          path: 'modifyRemainder',
          name: 'modifyRemainder',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/modifyProjRemainder/modifyRemainder'));
              cb(null, require('./routes/employer/modifyProjRemainder/modifyRemainder'));
            });
          },
        },

        {
          path: 'manage',
          name: 'manage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/manage/manageModels'));
              cb(null, require('./routes/employer/manage/kpiManage'));
            });
          },
        },
        {
          path: 'manage/kpiAdd',
          name: 'manage/kpiAdd',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/manage/manageModels'));
              cb(null, require('./routes/employer/manage/kpiAdd'));
            });
          },
        },
        {
          path: 'manage/kpiModify',
          name: 'manage/kpiModify',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/manage/manageModels'));
              cb(null, require('./routes/employer/manage/kpiAdd'));
            });
          },
        },
        {
          path: 'manage/kpiFinish',
          name: 'manage/kpiFinish',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/manage/manageModels'));
              cb(null, require('./routes/employer/manage/kpiAdd'));
            });
          },
        },
        {
          path: 'manage/kpiAdditional',
          name: 'manage/kpiAdditional',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/manage/additionalModels'));
              cb(null, require('./routes/employer/manage/kpiModify'));
            });
          },
        },
        {
          path: 'check',
          name: 'check',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/check/check'));
              cb(null, require('./routes/employer/check/check'));
            });
          },
        },
        {
          path: 'check/checkDetail',
          name: 'check/checkDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              //registerModel(app, require('./models/employer/search/searchDetail'));
              cb(null, require('./routes/employer/check/checkDetailNew'));
            });
          },
        },
        {
          path: 'value',
          name: 'value',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/check/check'));
              cb(null, require('./routes/employer/check/check'));
            });
          },
        },
        {
          path: 'value/valueDetail',
          name: 'value/valueDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              //registerModel(app, require('./models/employer/search/searchDetail'));
              cb(null, require('./routes/employer/value/valueDetailNew'));
            });
          },
        },
        {
          path: 'employerAdmin',
          name: 'employerAdmin',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/setting/settingModels'));
              cb(null, require('./routes/employer/setting/employerAdmin'));
            });
          },
        },
        {
          path: 'support',
          name: 'support',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/support/supportModels'));
              cb(null, require('./routes/employer/support/support'));
            });
          },
        },
        {
          path: 'support/supportDetail',
          name: 'support/supportDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/support/supportModels'));
              cb(null, require('./routes/employer/support/supportDetail'));
            });
          },
        },
        {
          path: 'progress',
          name: 'progress',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/statistic/progress'));
              cb(null, require('./routes/employer/statistic/progress'));
            });
          },
        },
        {
          path: 'annual',
          name: 'annual',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/annual/annualModels'));
              cb(null, require('./routes/employer/annual/annual'));
            });
          },
        },
        {
          path: 'pmannual',
          name: 'pmannual',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/annual/pmAnnualModels'));
              cb(null, require('./routes/employer/annual/pmannual'));
            });
          },
        },
        {
          path: 'distGroup',
          name: 'distGroup',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/setting/distGroupModels'));
              cb(null, require('./routes/employer/setting/distGroup'));
            });
          },
        },
         /**BP配置页面*/
          {
            path: 'BPpage',
            name: 'BPpage',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/employer/BPpage/BPpage'));
                cb(null, require('./routes/employer/BPpage/BPpage'));
              });
            },
          },
          /**分院院长-分管部门设置*/
          {
            path: 'otherDeptSet',
            name: 'otherDeptSet',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                //registerModel(app, require('./models/employer/BPpage/BPpage'));
                cb(null, require('./routes/employer/otherDeptSet/otherDeptSet'));
              });
            },
          },
         /** BP结果查询*/
         {
          path: 'bpresult',
          name: 'bpresult',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/statistic/result'));
              cb(null, require('./routes/employer/statistic/bpresult'));
            });
          },
        },
        /**bp指标查询 */
        {
          path: 'bpsearch',
          name: 'bpsearch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/search/hrSearch')); //bp连接hr的model
              cb(null, require('./routes/employer/search/bpsearch'));
            });
          },
        },
        {
          path: 'bpsearch/searchDetail',
          name: 'bpsearch/searchDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
             // registerModel(app, require('./models/employer/search/searchDetail'));
              cb(null, require('./routes/employer/search/searchDetailNew'));
            });
          },
        },
      ]
    },
    {
      path: 'humanApp/leader',
      name: 'humanApp/leader',
      childRoutes: [
        {
          path: 'manage',
          name: 'manage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/leader/search/search'));
              cb(null, require('./routes/leader/manage/search'));
            });
          },
        },
        {
          path: 'manage/detail',
          name: 'manage/detail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/leader/search/search'));
              cb(null, require('./routes/leader/search/detail'));
            });
          },
        },
        {
          path: 'search',
          name: 'search',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/leader/search/search'));
              cb(null, require('./routes/leader/search/search'));
            });
          },
        },
        {
          path: 'search/detail',
          name: 'search/detail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/leader/search/search'));
              cb(null, require('./routes/leader/search/detail'));
            });
          },
        },
        {
          path: 'value',
          name: 'value',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/leader/value/value'));
              cb(null, require('./routes/leader/value/value'));
            });
          },
        },
        {
          path: 'value/valueDetail',
          name: 'value/valueDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/leader/value/value'));
              cb(null, require('./routes/leader/value/valueDetail'));
            });
          },
        },
        {
          path: 'manage/kpiFinish',
          name: 'manage/kpiFinish',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/leader/search/search'));
              cb(null, require('./routes/leader/manage/kpiFinish'));
            });
          },
        },
        {
          path: 'resultInfo',
          name: 'resultInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/leader/search/resultInfoModel'));
              cb(null, require('./routes/leader/search/resultInfo'));
            });
          },
        },

        /**中层考核--个人三度和年度 */
        {
          path: 'performance',
          name: 'performance',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/leader/search/performanceModel'));
              cb(null, require('./routes/leader/search/performance'));
            });
          },
        },
        /**三度和年度的全部信息 */
        {
          path: 'yearInfo',
          name: 'yearInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/leader/search/yearInfoModel'));
              cb(null, require('./routes/leader/search/yearInfo'));
            });
          },
        },
        {
          path: 'middleEvaluation',
          name: 'middleEvaluation',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/leader/search/middleEvalModel'));
              cb(null, require('./routes/leader/search/middleEvaluation'));
            });
          },
        },
      ]
    },
    {
      path: 'humanApp/questions',
      name: 'humanApp/questions',
      childRoutes: [
        {
          path: 'import',
          name: 'import',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/questions/import/importModels'));
              cb(null, require('./routes/questions/import/search'));
            });
          },
        },
        {
          path: 'select',
          name: 'select',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/questions/select/selectModels'));
              cb(null, require('./routes/questions/select/select'));
            });
          },
        },
        {
          path: 'position',
          name: 'position',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/questions/position/settingModels'));
              cb(null, require('./routes/questions/position/setting'));
            });
          },
        },
      ]
    },
    /* 人力资源管理路由开始 */
    {
      path: 'humanApp/hr',
      name: 'humanApp/hr',
      childRoutes: [
        /* 员工信息导入 */
        {
          path: 'staffImport',
          name: 'staffImport',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/hr/basicInfo/staffImport'));
              cb(null, require('./routes/hr/basicInfo/staffImport'));
            });
          },
        },
        /* 员工信息查询 */
        {
          path: 'staffInfoSearch',
          name: 'staffInfoSearch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/hr/basicInfo/staffInfoSearch'));
              cb(null, require('./routes/hr/basicInfo/staffInfoSearch'));
            });
          },
        },
        /* 个人信息维护 */
        {
          path: 'staffInfoEdit',
          name: 'staffInfoEdit',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/hr/basicInfo/staffInfoEdit'));
              cb(null, require('./routes/hr/basicInfo/staffInfoEdit'));
            });
          },
        },
        /* 员工职务信息维护 */
        {
          path: 'staffPostEdit',
          name: 'staffPostEdit',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/hr/basicInfo/staffPostEdit'));
              cb(null, require('./routes/hr/basicInfo/staffPostEdit'));
            });
          },
        },
        /*员工部门信息维护 */
        {
          path: 'staffDeptEdit',
          name: 'staffDeptEdit',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/hr/basicInfo/staffDeptEdit'));
              cb(null, require('./routes/hr/basicInfo/staffDeptEdit'));
            });
          },
        },
        /* 员工离职 */
        {
          path: 'staffLeave',
          name: 'staffLeave',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/hr/basicInfo/staffLeave'));
              cb(null, require('./routes/hr/basicInfo/staffLeave'));
            });
          },
        },
        /* 部门信息管理 */
        {
          path: 'deptInfo',
          name: 'deptInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/hr/deptInfo/deptInfo'));
              cb(null, require('./routes/hr/deptInfo/deptInfo'));
            });
          },
        },
        /* 职务信息管理 */
        {
          path: 'postInfo',
          name: 'postInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/hr/postInfo/postInfo'));
              cb(null, require('./routes/hr/postInfo/postInfo'));
            });
          },
        },
        /* 人员变动管理 */
        {
          path: 'personnelInfo',
          name: 'personnelInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/hr/personnelInfo/personnelInfo'));
              cb(null, require('./routes/hr/personnelInfo/personnelInfo'));
            });
          }
        },
        /* 人员变动管理 */
        {
          path: 'import',
          name: 'import',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/hr/encouragementInfo/importModels'));
              cb(null, require('./routes/hr/encouragementInfo/import'));
            });
          }
        },
        // 激励信息导入权限设置
        {
          path: 'encoAuthSetting',
          name: 'encoAuthSetting',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/hr/encouragementInfo/encoAuthSetting'));
              cb(null, require('./routes/hr/encouragementInfo/encoAuthSetting'));
            });
          }
        },
        // 考核ABCDE人数剩余设置
        {
          path: 'modifyRemainder',
          name: 'modifyRemainder',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/employer/modifyProjRemainder/modifyRemainder'));
              cb(null, require('./routes/employer/modifyProjRemainder/modifyRemainder'));
            });
          }
        },
      ]
    },
    /* 人力资源管理路由结束 */
    /* 全面激励路由开始 */
    {
      path: 'humanApp/encouragement',
      name: 'humanApp/encouragement',
      childRoutes: [
        /* 首页 */
        {
          path: 'index',
          name: 'index',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/indexModels'));
              cb(null, require('./routes/encouragement/index/index'));
            });
          },
        },
        /* 基本信息 */
        {
          path: 'basicinfo',
          name: 'basicinfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/basicinfoModels'));
              cb(null, require('./routes/encouragement/basicinfo/basicinfo'));
            });
          },
        },
        /* 晋升激励报告 */
        {
          path: 'promotion',
          name: 'promotion',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/promotionModels'));
              cb(null, require('./routes/encouragement/promotion/promotion'));
            });
          },
        },
        /* 绩效激励报告 */
        {
          path: 'performance',
          name: 'performance',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/performanceModels'));
              cb(null, require('./routes/encouragement/performance/performance'));
            });
          },
        },
        /*培训激励报告 */
        {
          path: 'training',
          name: 'training',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/trainingModels'));
              cb(null, require('./routes/encouragement/training/training'));
            });
          },
        },
        /* 认可激励报告 */
        {
          path: 'recognized',
          name: 'recognized',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/recognizedModels'));
              cb(null, require('./routes/encouragement/recognized/recognized'));
            });
          },
        },
        /* 荣誉激励报告 */
        {
          path: 'honor',
          name: 'honor',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/honorModels'));
              cb(null, require('./routes/encouragement/honor/honor'));
            });
          },
        },
        /* 长期激励报告 */
        {
          path: 'longterm',
          name: 'longterm',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/longtermModels'));
              cb(null, require('./routes/encouragement/longterm/longterm'));
            });
          },
        },
        /* 福利激励报告 */
        {
          path: 'welfare',
          name: 'welfare',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/welfareModels'));
              cb(null, require('./routes/encouragement/welfare/welfare'));
            });
          },
        },
        /* 整体激励报告 */
        {
          path: 'wage',
          name: 'wage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/wageModels'));
              cb(null, require('./routes/encouragement/wage/wage'));
            });
          },
        },
        /*变更权限配置*/
        {
          path: 'authChange',
          name: 'authChange',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/authchangeModels'));
              cb(null, require('./routes/encouragement/authchange/authchange'));
            });
          },
        },
        /*审核界面*/
        {
          path: 'auditPage',
          name: 'auditPage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/auditPageModel.js'));
              cb(null, require('./routes/encouragement/auditPage/auditPage.js'));
            });
          }
        },
        /*修改个人信息页面*/
        {
          path: 'personalInfo',
          name: 'personalInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/encouragement/personalInfoModel.js'));
              cb(null, require('./routes/encouragement/personalInfo/personalInfo.js'));
            });
          }
        },
      ]
    },
    /* 全面激励路由结束 */
    /* 劳动用工路由开始 */
    {
      path: 'humanApp/labor',
      name: 'humanApp/labor',
      childRoutes: [
        /* 离职审批模块首页 */
        {
          path: 'index',
          name: 'index',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/indexModels'));
              cb(null, require('./routes/labor/staffLeave/index'));
            });
          },
        },
        /* 离职流程查询 */
        {
          path: 'leave_search',
          name: 'leave_search',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/leaveSearchModel'));
              cb(null, require('./routes/labor/staffLeave/leave_search'));
            });
          },
        },
        /* 离职申请 */
        {
          path: 'index/createLeave',
          name: 'index/createLeave',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/createLeaveModels'));
              cb(null, require('./routes/labor/staffLeave/createLeave'));
            });
          },
        },
        /** 离职工作交接查看*/
        {
          path: 'index/CheckworkHandover',
          name: 'index/CheckworkHandover',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/staff_leave_index_model'));
              cb(null, require('./routes/labor/staffLeave/CheckworkHandover'));
            });
          },
        },
        /* 离职待办查询 */
        {
          path: 'staffLeave_index',
          name: 'staffLeave_index',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/staff_leave_index_model'));
              cb(null, require('./routes/labor/staffLeave/staffLeave_index'));
            });
          },
        },
        /* 工作交接 */
        {
          path: 'index/workHandover',
          name: 'index/workHandover',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/createLeaveModels'));
              cb(null, require('./routes/labor/staffLeave/workHandover'));
            });
          },
        },
        /* 离职申请审批 */
        {
          path: 'index/leaveApplyApproval',
          name: 'index/leaveApplyApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/leave_approval_model'));
              cb(null, require('./routes/labor/staffLeave/leave_apply_approval'));
            });
          },
        },
        /* 离职交接审批 */
        {
          path: 'index/leaveHandApproval',
          name: 'index/leaveHandApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/leave_approval_model'));
              cb(null, require('./routes/labor/staffLeave/leave_hand_approval'));
            });
          },
        },
        /* 离职清算创建 */
        {
          path: 'index/createLeaveSettle',
          name: 'index/createLeaveSettle',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/createLeaveSettleModel'));
              cb(null, require('./routes/labor/staffLeave/createLeaveSettle'));
            });
          },
        },
        /* 离职清算审批 */
        {
          path: 'index/quit_settle_approval',
          name: 'index/quit_settle_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/quit_settle_approval_model'));
              cb(null, require('./routes/labor/staffLeave/quit_settle_approval'));
            });
          },
        },
        /**------------------- */
        /**离职清算查看 */
        {
          path: 'index/CheckleaveSettle',
          name: 'index/CheckleaveSettle',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/staff_leave_index_model'));
              cb(null, require('./routes/labor/staffLeave/CheckleaveSettle'));
            });
          },
        },
        /**离职清算打印 */
        {
          path: 'index/LeaveSettlePrint',
          name: 'index/LeaveSettlePrint',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/staff_leave_index_model'));
              cb(null, require('./routes/labor/staffLeave/LeaveSettlePrint'));
            });
          },
        },
        /* 离职申请查看*/
        {
          path: 'index/CheckLeave',
          name: 'index/CheckLeave',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/staff_leave_index_model'));
              cb(null, require('./routes/labor/staffLeave/CheckLeave'));
            });
          },
        },
        /**离职申请打印 */
        {
          path: 'index/LeavePrint',
          name: 'index/LeavePrint',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/staff_leave_index_model'));
              cb(null, require('./routes/labor/staffLeave/LeavePrint'));
            });
          },
        },
        /**交接工作打印 */
        {
          path: 'index/HandOverPrint',
          name: 'index/HandOverPrint',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/staff_leave_index_model'));
              cb(null, require('./routes/labor/staffLeave/HandOverPrint'));
            });
          },
        },
        /*员工劳动合同信息查询 */
        {
          path: 'contractListSearch',
          name: 'contractListSearch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/contract/contract_list_model'));
              cb(null, require('./routes/labor/contract/contract_list'));
            });
          },
        },
        /*个人劳动合同列表 */
        {
          path: 'contractPersonSearch',
          name: 'contractPersonSearch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/contract/contract_person_model'));
              cb(null, require('./routes/labor/contract/contract_person'));
            });
          },
        },
        /* 劳动合同审批 */
        {
          path: 'staffLeave_index/contractRenewApproval',
          name: 'staffLeave_index/contractRenewApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/leave_approval_model'));
              cb(null, require('./routes/labor/contract/contract_approval'));
            });
          },
        },
        /* 劳动合同审批查看 */
        {
          path: 'staffLeave_index/contractApproveInform',
          name: 'staffLeave_index/contractApproveInform',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/contract/contractApproveInfo'));
              cb(null, require('./routes/labor/contract/contractPrint'));
            });
          },
        },
        /* 劳动合同批量导入 */
        {
          path: 'importContract',
          name: 'importContract',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/contract/importModel'));
              cb(null, require('./routes/labor/contract/importContract'));
            });
          },
        },
        /* 员工劳动合同查询 */
        {
          path: 'contractSearch',
          name: 'contractSearch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/contract/contract_list_model'));
              cb(null, require('./routes/labor/contract/contract_search'));
            });
          },
        },
        /* 员工劳动合同审批驳回阅后即焚 */
        {
          path: 'staffLeave_index/contract_approval_look',
          name: 'staffLeave_index/contract_approval_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/labor/staffLeave/leave_approval_model'));
              cb(null, require('./routes/labor/contract/contract_approval_look'));
            });
          },
        },
      ]
    },
    /* 劳动用工路由结束 */
    /* 节假日加班路由开始 */
    {
      path: 'humanApp/overtime',
      name: 'humanApp/overtime',
      childRoutes: [
        /* 加班管理模块首页 */
        {
          path: 'overtime_index',
          name: 'overtime_index',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/overtime_index_model'));
              cb(null, require('./routes/overtime/overtime_index'));
            });
          },
        },
        /* 加班管理流程查询 */
        {
          path: 'overtime_search',
          name: 'overtime_search',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/overtime_index_model'));
              cb(null, require('./routes/overtime/overtime_search'));
            });
          },
        },
        /* 创建部门加班申请审批流程类型 */
        {
          path: 'overtime_index/createDeptApproval',
          name: 'overtime_index/createDeptApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/create_approval_model'));
              cb(null, require('./routes/overtime/createDeptApproval'));
            });
          },
        },
        /* 创建项目组加班申请审批流程类型 */
        {
          path: 'overtime_index/createTeamApproval',
          name: 'overtime_index/createTeamApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/create_approval_model'));
              cb(null, require('./routes/overtime/createTeamApproval'));
            });
          },
        },
        /* 创建职能线加班申请统计审批流程类型 */
        {
          path: 'overtime_index/createFunctionalDeptApproval',
          name: 'overtime_index/createFunctionalDeptApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/create_approval_model'));
              cb(null, require('./routes/overtime/createFunctionalDeptApproval'));
            });
          },
        },
        /*加班信息详情*/
        {
          path: 'overtime_index/showApprovalDetails',
          name: 'overtime_index/showApprovalDetails',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/show_approval_details_model'));
              cb(null, require('./routes/overtime/showApprovalDetails'));
            });
          },
        },
        /*项目组加班信息详情展示*/
        {
          path: 'overtime_index/showTeamDetails',
          name: 'overtime_index/showTeamDetails',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/show_team_details_model'));
              cb(null, require('./routes/overtime/showTeamDetails'));
            });
          },
        },
        /*部门加班申请审批界面*/
        {
          path: 'overtime_index/deptApproval',
          name: 'overtime_index/deptApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/approval_model'));
              cb(null, require('./routes/overtime/deptApproval'));
            });
          },
        },
        /*项目组加班申请审批界面*/
        {
          path: 'overtime_index/teamApproval',
          name: 'overtime_index/teamApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/approval_model'));
              cb(null, require('./routes/overtime/teamApproval'));
            });
          },
        },
        /*部门加班统计审批界面*/
        {
          path: 'overtime_index/deptStatsApproval',
          name: 'overtime_index/deptStatsApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/approval_model'));
              cb(null, require('./routes/overtime/deptStatsApproval'));
            });
          },
        },
        /*职能线部门加班申请审批界面*/
        {
          path: 'overtime_index/deptFuncApproval',
          name: 'overtime_index/deptFuncApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/approval_model'));
              cb(null, require('./routes/overtime/deptFuncApproval'));
            });
          },
        },
        /*部门加班申请/统计审批中，项目组人员及审批信息查看-打印*/
        {
          path: 'overtime_index/showTeamDetailsAndApproval',
          name: 'overtime_index/showTeamDetailsAndApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/overtime/show_team_details_model'));
              cb(null, require('./routes/overtime/showTeamDetailsAndApproval'));
            });
          },
        },
      ]
    },
    /* 节假日加班路由结束 */

    /* 培训管理路由开始 */
    {
      path: 'humanApp/train',
      name: 'humanApp/train',
      childRoutes: [
        /* 培训管理模块首页--- */
        {
          path: 'train_index',
          name: 'train_index',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_index_model'));
              cb(null, require('./routes/train/train_index'));
            });
          },
        },
        /* 创建全院培训课程(必修课)计划页面 */
        {
          path: 'trainPlanAndImport/create_general_compulsory',
          name: 'trainPlanAndImport/create_general_compulsory',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_model'));
              cb(null, require('./routes/train/create_general_compulsory'));
            });
          },
        },
        /* 创建全院培训课程（选修课）计划页面 */
        {
          path: 'trainPlanAndImport/create_general_elective',
          name: 'trainPlanAndImport/create_general_elective',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_model'));
              cb(null, require('./routes/train/create_general_elective'));
            });
          },
        },
        /* 分院-部门通用 */
        {
          path: 'trainPlanAndImport/create_branch_department',
          name: 'trainPlanAndImport/create_branch_department',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_model'));
              cb(null, require('./routes/train/create_branch_department'));
            });
          },
        },
        /* 认证考试计划 */
        {
          path: 'trainPlanAndImport/create_certification',
          name: 'trainPlanAndImport/create_certification',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_model'));
              cb(null, require('./routes/train/create_certification'));
            });
          },
        },
        /**2019.7.15 新增查询待办--- */
        {
          path: 'train_do',
          name: 'train_do',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_do_model'));
              cb(null, require('./routes/train/train_do'));
            });
          },
        },
        /**2019.7.15 培训计划列表查询--- */
        {
          path: 'trainPlanList',
          name: 'trainPlanList',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_do_model'));
              cb(null, require('./routes/train/trainPlanList'));
            });
          },
        },
        /**2019.7.16 总院必修课程调整 */
        {
          path: 'train_do/centerComEdit',
          name: 'train_do/centerComEdit',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_do_model'));
              cb(null, require('./routes/train/centerComEdit'));
            });
          },
        },
        /**2019.7.16 总院选修课程调整 */
        {
          path: 'train_do/centerEleEdit',
          name: 'train_do/centerEleEdit',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_do_model'));
              cb(null, require('./routes/train/centerEleEdit'));
            });
          },
        },
        /**2019.7.16 培训课程调整 */
        {
          path: 'train_do/deptPlanEdit',
          name: 'train_do/deptPlanEdit',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_do_model'));
              cb(null, require('./routes/train/deptPlanEdit'));
            });
          },
        },
        /**2019.7.16 认证考试调整 */
        {
          path: 'train_do/examEdit',
          name: 'train_do/examEdit',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_do_model'));
              cb(null, require('./routes/train/examEdit'));
            });
          },
        },
        /* 培训计划审批页面 */
        {
          path: 'train_do/train_plan_approval',
          name: 'train_do/train_plan_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_plan_approval_model'));
              cb(null, require('./routes/train/train_plan_approval'));
            });
          },
        },
        /* 内训-计划内-培训申请审批 */
        {
          path: 'train_do/train_in_planin_approval',
          name: 'train_do/train_in_planin_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_in_approval_model'));
              cb(null, require('./routes/train/train_in_planin_approval'));
            });
          },
        },
        /* 内训-计划外-培训申请审批 */
        {
          path: 'train_do/train_in_planout_approval',
          name: 'train_do/train_in_planout_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_in_approval_model'));
              cb(null, require('./routes/train/train_in_planout_approval'));
            });
          },
        },
        /* 内训-计划外-培训申请查询*/
        {
          path: 'train_do/train_in_planout_look',
          name: 'train_do/train_in_planout_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_in_approval_model'));
              cb(null, require('./routes/train/train_in_planout_look'));
            });
          },
        },
        /* 内训-计划内-培训申请查询*/
        {
          path: 'train_do/train_in_planin_look',
          name: 'train_do/train_in_planin_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_in_approval_model'));
              cb(null, require('./routes/train/train_in_planin_look'));
            });
          },
        },
        /* 培训班申请审批 */
        {
          path: 'train_do/create_train_course_approval',
          name: 'train_do/create_train_course_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_approval_model'));
              cb(null, require('./routes/train/create_train_course_approval'));
            });
          },
        },
        /* 培训班申请审批-查看 */
        {
          path: 'train_do/create_train_course_look',
          name: 'train_do/create_train_course_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_approval_model'));
              cb(null, require('./routes/train/create_train_course_look'));
            });
          },
        },

        /* 培训计划落地分院 */
        {
          path: 'trainPlanAndImport/claim_class',
          name: 'trainPlanAndImport/claim_class',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_model'));
              cb(null, require('./routes/train/claim_class'));
            });
          },
        },
        /* 考试清单导入 */
        {
          path: 'trainPlanAndImport/exam_checklist',
          name: 'trainPlanAndImport/exam_checklist',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/exam_checklist_model'));
              cb(null, require('./routes/train/exam_checklist'));
            });
          },
        },
        /* 全院级、通用培训计划、认证考试新增申请提交 */
        {
          path: 'trainPlanList/DynAddClass',
          name: 'trainPlanList/DynAddClass',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_model'));
              cb(null, require('./routes/train/DynAddClass'));
            });
          },
        },
        /* 培训计划总院必修审批页面 */
        {
          path: 'train_do/train_plan_approval_com',
          name: 'train_do/train_plan_approval_com',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_plan_approval_model'));
              cb(null, require('./routes/train/train_plan_approval_com'));
            });
          },
        },
        /* 培训计划总院选修审批页面 */
        {
          path: 'train_do/train_plan_approval_ele',
          name: 'train_do/train_plan_approval_ele',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_plan_approval_model'));
              cb(null, require('./routes/train/train_plan_approval_ele'));
            });
          },
        },
        /* 通用审批页面 */
        {
          path: 'train_do/train_plan_approval_dept',
          name: 'train_do/train_plan_approval_dept',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_plan_approval_model'));
              cb(null, require('./routes/train/train_plan_approval_dept'));
            });
          },
        },
        /* 认证考试审批页面 */
        {
          path: 'train_do/train_plan_approval_exam',
          name: 'train_do/train_plan_approval_exam',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_plan_approval_model'));
              cb(null, require('./routes/train/train_plan_approval_exam'));
            });
          },
        },
        /* 培训计划新增审批页面 */
        {
          path: 'train_do/train_plan_look',
          name: 'train_do/train_plan_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_plan_approval_model'));
              cb(null, require('./routes/train/train_plan_look'));
            });
          },
        },
        /* 培训计划总院必修审批页面 */
        {
          path: 'train_do/train_plan_look_com',
          name: 'train_do/train_plan_look_com',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_plan_approval_model'));
              cb(null, require('./routes/train/train_plan_look_com'));
            });
          },
        },
        /* 培训计划总院选修审批页面 */
        {
          path: 'train_do/train_plan_look_ele',
          name: 'train_do/train_plan_look_ele',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_plan_approval_model'));
              cb(null, require('./routes/train/train_plan_look_ele'));
            });
          },
        },
        /* 认证考试审批页面 */
        {
          path: 'train_do/train_plan_look_exam',
          name: 'train_do/train_plan_look_exam',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_plan_approval_model'));
              cb(null, require('./routes/train/train_plan_look_exam'));
            });
          },
        },
        /* 审批页面 */
        {
          path: 'train_do/train_plan_look_dept',
          name: 'train_do/train_plan_look_dept',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_plan_approval_model'));
              cb(null, require('./routes/train/train_plan_look_dept'));
            });
          },
        },
        /* 通用培训计划人员导入--- */
        {
          path: 'importClassPerson',
          name: 'importClassPerson',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_model'));
              cb(null, require('./routes/train/importClassPerson'));
            });
          },
        },
        /* 外训--外派培训 培训申请 */
        {
          path: 'train_index/create_train_apply',
          name: 'train_index/create_train_apply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_apply_model'));
              cb(null, require('./routes/train/create_train_apply'));
            });
          },
        },
        /* 内训-自有内训师 培训申请 */
        {
          path: 'train_index/create_internal_own_teacher',
          name: 'train_index/create_internal_own_teacher',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_apply_model'));
              cb(null, require('./routes/train/create_internal_own_teacher'));
            });
          },
        },
        /* 内训-参加集团及系统内培训 培训申请 */
        {
          path: 'train_index/create_internal_ingroup_insystem_apply',
          name: 'train_index/create_internal_ingroup_insystem_apply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_apply_model'));
              cb(null, require('./routes/train/create_internal_ingroup_insystem_apply'));
            });
          },
        },
        /* 内训-外请讲师 培训申请 */
        {
          path: 'train_index/create_internal_external_teacher',
          name: 'train_index/create_internal_external_teacher',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_apply_model'));
              cb(null, require('./routes/train/create_internal_external_teacher'));
            });
          },
        },
        /* 培训班申请 */
        {
          path: 'train_index/create_train_course_apply',
          name: 'train_index/create_train_course_apply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_apply_model'));
              cb(null, require('./routes/train/create_train_course_apply'));
            });
          },
        },
        /* 培训申请查看 */
        {
          path: 'train_do/train_apply_look',
          name: 'train_do/train_apply_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_apply_model'));
              cb(null, require('./routes/train/train_apply_look'));
            });
          },
        },
        /* 培训申请审批 */
        {
          path: 'train_do/train_apply_approval',
          name: 'train_do/train_apply_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/create_approval_model'));
              cb(null, require('./routes/train/train_apply_approval'));
            });
          },
        },
        /* 人岗信息导入 ---*/
        {
          path: 'trainManage/importPersonPost',
          name: 'trainManage/importPersonPost',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/import_person_post_model'));
              cb(null, require('./routes/train/importPersonPost'));
            });
          },
        },
        /* 培训计划信息统计查询 */
        {
          path: 'trainStatistic/statistic_search',
          name: 'trainStatistic/statistic_search',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/statistic/statistic_do_model'));
              cb(null, require('./routes/train/statistic/trainStatisticSearch'));
            });
          },
        },
        /* 培训统计自定义查询--- */
        {
          path: 'trainStatistic/train_config_query',
          name: 'trainStatistic/train_config_query',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_query_model'));
              cb(null, require('./routes/train/statistic/train_config_query'));
            });
          },
        },
        /* 培训统计个人查询 ---*/
        {
          path: 'personalClassQueryIndex/personalClassQuery',
          name: 'personalClassQueryIndex/personalClassQuery',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_query_model'));
              cb(null, require('./routes/train/statistic/train_person_query'));
            });
          },
        },
        /* 培训统计个人查询 ---*/
        {
          path: 'personalClassQueryIndex',
          name: 'personalClassQueryIndex',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_query_model'));
              cb(null, require('./routes/train/statistic/train_person_query_index'));
            });
          },
        },
        /* 线上培训认证考试导入下一环节人员查询--- */
        {
          path: 'train_index/train_online_exam_import',
          name: 'train_index/train_online_exam_import',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/import_online_and_exam_grade_model'));
              cb(null, require('./routes/train/train_online_exam_import'));
            });
          },
        },
        /* 线上培训*/
        {
          path: 'train_index/train_online_exam_import/train_online_import',
          name: 'train_index/train_online_exam_import/train_online_import',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/import_online_and_exam_grade_model'));
              cb(null, require('./routes/train/train_online_import'));
            });
          },
        },
        /* 认证考试*/
        {
          path: 'train_index/train_online_exam_import/train_exam_import',
          name: 'train_index/train_online_exam_import/train_exam_import',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/import_online_and_exam_grade_model'));
              cb(null, require('./routes/train/train_exam_import'));
            });
          },
        },
        /* 线上培训认证考试查看 */
        {
          path: 'train_do/train_online_exam_import_look',
          name: 'train_do/train_online_exam_import_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/import_online_and_exam_grade_model'));
              cb(null, require('./routes/train/train_online_exam_import_look'));
            });
          },
        },
        /* 线上培训认证考试审批 */
        {
          path: 'train_do/train_online_exam_import_approval',
          name: 'train_do/train_online_exam_import_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/import_online_and_exam_grade_approval_model'));
              cb(null, require('./routes/train/train_online_exam_import_approval'));
            });
          },
        },
        /* 培训信息查询 */
        {
          path: 'trainStatistic/train_class_info',
          name: 'trainStatistic/train_class_info',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_class_info_model'));
              cb(null, require('./routes/train/train_class_info'));
            });
          },
        },
        /* 培训计划导入及落地 */
        {
          path: 'trainPlanAndImport',
          name: 'trainPlanAndImport',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_index_model'));
              cb(null, require('./routes/train/train_plan_and_import_index'));
            });
          },
        },
        /* 培训统计 */
        {
          path: 'trainStatistic',
          name: 'trainStatistic',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_index_model'));
              cb(null, require('./routes/train/train_statistic_index'));
            });
          },
        },
        /* 培训任务及人员岗位 */
        {
          path: 'trainManage',
          name: 'trainManage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_index_model'));
              cb(null, require('./routes/train/train_manage_index'));
            });
          },
        },
        /* 任务设定 */
        {
          path: 'trainManage/trainManagementSettings',
          name: 'trainManagetrainManagementSettings',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_management_settings_model'));
              cb(null, require('./routes/train/train_management_settings'));
            });
          },
        },
        /* 特殊人群设置 */
        {
          path: 'trainManage/trainSpecialPersonInfo',
          name: 'trainManage/trainSpecialPersonInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/train_special_person_model'));
              cb(null, require('./routes/train/train_special_person_info'));
            });
          },
        },
        /* 认证考试查询 ---*/
        {
          path: 'personalClassQueryIndex/certificationList',
          name: 'personalClassQueryIndex/certificationList',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/statistic/certification_list_model'));
              cb(null, require('./routes/train/statistic/certificationList'));
            });
          },
        },
		 /* 我的小目标 ---*/
         {
          path: 'myTrainGoal',
          name: 'myTrainGoal',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/train/my_train_goal_model'));
              cb(null, require('./routes/train/my_train_goal'));
            });
          },
        },
      ]
    },
    /* 培训管理路由结束 */
        /* 人才管理路由开始 */
    {
      path: 'humanApp/talent',
      name: 'humanApp/talent',
      childRoutes: [
        /* 人才信息录入 */
        {
          path: 'importTalentInfo',
          name: 'importTalentInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/talent/talentInfoImportModel'));
              cb(null, require('./routes/talent/importTalentInfo'));
            });
          },
        },
      ]
    },
    /* 人才管理路由结束 */
    /* 成本管理路由开始 */
    {
      path: 'humanApp/costlabor',
      name: 'humanApp/costlabor',
      childRoutes: [
        /* 工资信息录入 */
        {
          path: 'costVerify/costVerifyIndex/importLaborInfo',
          name: 'costVerify/costVerifyIndex/importLaborInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/cost/importLaborModel'));
              cb(null, require('./routes/cost/importLaborInfo'));
            });
          },
        },
        /* 工资项信息管理-总院 */
        {
          path: 'manageCenter',
          name: 'manageCenter',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/cost/manageCenterModel'));
              cb(null, require('./routes/cost/manageCenter'));
            });
          },
        },
        /* 工资项信息管理-分院 */
        {
          path: 'manageBranch',
          name: 'manageBranch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/cost/manageCenterModel'));
              cb(null, require('./routes/cost/manageBranch'));
            });
          },
        },
        /* 工资项进入验证 */
        {
          path: 'costVerify',
          name: 'costVerify',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/cost/costVerifyModel'));
              cb(null, require('./routes/cost/costVerify'));
            });
          },
        },
         /* 工资项进入验证首页 */
        {
          path: 'costVerify/costVerifyIndex',
          name: 'costVerify/costVerifyIndex',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/cost/costVerifyModel'));
              cb(null, require('./routes/cost/costVerifyIndex'));
            });
          },
        },
        /* 研发项目成本导出-人力-详细 */
        {
          path: 'costVerify/costVerifyIndex/exportCostForHrDetail',
          name: 'costVerify/costVerifyIndex/exportCostForHrDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/cost/exportCostDataModel'));
              cb(null, require('./routes/cost/exportCostForHrDetail'));
            });
          },
        },
        /* 研发项目成本导出-人力-汇总 */
        {
          path: 'costVerify/costVerifyIndex/exportCostForHrFull',
          name: 'costVerify/costVerifyIndex/exportCostForHrFull',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/cost/exportCostDataModel'));
              cb(null, require('./routes/cost/exportCostForHrFull'));
            });
          },
        },
        /* 研发项目成本导出-财务 */
        {
          path: 'exportCostForFinance',
          name: 'exportCostForFinance',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/cost/exportCostDataModel'));
              cb(null, require('./routes/cost/exportCostForFinance'));
            });
          },
        },
        /* 研发转资本化 */
        {
          path: 'exportCostToCapitalization',
          name: 'exportCostToCapitalization',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/cost/exportCostDataModel'));
              cb(null, require('./routes/cost/exportCostToCapitalization'));
            });
          },
        },
      ]
    },
    /* 成本管理路由结束 */
	/* 干部管理路由开始 */
    {
      path: 'humanApp/appraise',
      name: 'humanApp/appraise',
      childRoutes: [
        /* 干部信息查询 */
        {
          path: 'cadreInfo',
          name: 'cadreInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/appraise/manageInfoModel'));
              cb(null, require('./routes/appraise/cadreInfo'));
            });
          },
        },
        /* 评议人信息查询 */
        {
          path: 'personInfo',
          name: 'personInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/appraise/manageInfoModel'));
              cb(null, require('./routes/appraise/personInfo'));
            });
          },
        },
        /* 评议内容配置 */
        {
          path: 'commentInfo',
          name: 'commentInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/appraise/manageAppraiseModel'));
              cb(null, require('./routes/appraise/commentInfo'));
            });
          },
        },
        /* 新增评议内容 */
        {
          path: 'commentInfo/newCommentInfoAdd',
          name: 'commentInfo/newCommentInfoAdd',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/appraise/manageAppraiseModel'));
              cb(null, require('./routes/appraise/newCommentInfoAdd'));
            });
          },
        },
        /* 评议待办界面：个人/组织评议 */
        {
          path: 'approvalInfo',
          name: 'approvalInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/appraise/manageAppraiseModel'));
              cb(null, require('./routes/appraise/approvalInfo'));
            });
          },
        },
        /* 个人评议 */
        {
          path: 'approvalInfo/commentApproval',
          name: 'approvalInfo/commentApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/appraise/manageAppraiseModel'));
              cb(null, require('./routes/appraise/commentApproval'));
            });
          },
        },
        /* 发起评议 */
        {
          path: 'startAppraise',
          name: 'startAppraise',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/appraise/startAppraiseModel'));
              cb(null, require('./routes/appraise/startAppraise'));
            });
          },
        },
        /* 组织机构评议 */
        {
          path: 'approvalInfo/oraganApproval',
          name: 'approvalInfo/oraganApproval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/appraise/oraganApprovalModel'));
              cb(null, require('./routes/appraise/oraganApproval'));
            });
          },
        }
      ]
    },
    /* 干部管理路由结束 */
    /* 职级晋升管理路由开始 */
    {
      path: 'humanApp/rankpromote',
      name: 'humanApp/rankpromote',
      childRoutes: [
        /* 职级信息导入查询 */
        {
          path: 'rankImport',
          name: 'rankImport',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rankpromote/rank/rankImportModel'));
              cb(null, require('./routes/rankpromote/rank/rankImport'));
            });
          },
        },
        /* 职级信息个人查询 */
        {
          path: 'rankInfo',
          name: 'rankInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rankpromote/rank/rankImportModel'));
              cb(null, require('./routes/rankpromote/rank/rankInfo'));
            });
          },
        },
        /* 晋升查询 */
        {
          path: 'promoteInfo',
          name: 'promoteInfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rankpromote/promote/promoteListModel'));
              cb(null, require('./routes/rankpromote/promote/promoteInfo'));
            });
          },
        },

        /*员工晋升晋档信息导入维护*/
        {
          path: 'promoteimport',
          name: 'promoteimport',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rankpromote/promote/promoteImportModel'));
              cb(null, require('./routes/rankpromote/promote/promoteImport'));
            });
          },
        },
        /* 晋升信息导入 */
        {
          path: 'promoteimport/promoteImportData',
          name: 'promoteimport/promoteImportData',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rankpromote/promote/promoteImportModel'));
              cb(null, require('./routes/rankpromote/promote/promoteImportData'));
            });
          },
        },
        /* 职级信息导入 */
        {
          path: 'rankImport/rankImportData',
          name: 'rankImport/rankImportData',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rankpromote/rank/rankImportModel'));
              cb(null, require('./routes/rankpromote/rank/rankImportData'));
            });
          },
        },
        /* 员工职级薪档信息自定义统计查询功能 */
        {
          path: 'personRankPromotionQuery',
          name: 'personRankPromotionQuery',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rankpromote/rank/personRankPromotionQueryModel'));
              cb(null, require('./routes/rankpromote/rank/personRankPromotionQuery'));
            });
          },
        },
        /* 员工职级薪档信息对应全面激励报告 */
        {
          path: 'comprehensiveDataQuery',
          name: 'comprehensiveDataQuery',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rankpromote/rank/comprehensiveDataQueryModel'));
              cb(null, require('./routes/rankpromote/rank/comprehensiveDataQuery'));
            });
          },
        },

        /* 职级信息导入 */
        {
          path: 'rankImport/rankImportData',
          name: 'rankImport/rankImportData',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rankpromote/rank/rankImportModel'));
              cb(null, require('./routes/rankpromote/rank/rankImportData'));
            });
          },
        },

        /* 推荐路径导出 */
        {
          path: 'promoteexport',
          name: 'promoteexport',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rankpromote/promote/promoteExportModel'));
              cb(null, require('./routes/rankpromote/promote/promoteExport'));
            });
          },
        },
      ]
    },
    /* 职级晋升管理路由结束 */

    {
      path: 'humanApp/absence',
      name: 'humanApp/absence',
      childRoutes: [
        /* 请假管理模块首页 */
        {
          path: 'absenceIndex',
          name: 'absenceIndex',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/absence_index_model'));
              cb(null, require('./routes/absence/absence_index'));
            });
          },
        },
        /* 新增调休 */
        {
          path: 'absenceIndex/create_break_off',
          name: 'absenceIndex/create_break_off',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/create_break_off_model'));
              cb(null, require('./routes/absence/create_break_off'));
            });
          },
        },
        /* 新增年休假申请 */
        {
          path: 'absenceIndex/create_year_absence',
          name: 'absenceIndex/create_year_absence',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/create_year_absence_model'));
              cb(null, require('./routes/absence/create_year_absence'));
            });
          },
        },
        /* 新增事假申请 */
        {
          path: 'absenceIndex/create_affair_absence',
          name: 'absenceIndex/create_affair_absence',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/create_affair_absence_model'));
              cb(null, require('./routes/absence/create_affair_absence'));
            });
          },
        },
        /* 已办页面 */
        {
          path: 'absenceIndex/absence_approve_look',
          name: 'absenceIndex/absence_approve_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/absence_approve_look_model'));
              cb(null, require('./routes/absence/absence_approve_look'));
            });
          },
        },
        /* 事假审批页面 */
        {
          path: 'absenceIndex/affair_approval',
          name: 'absenceIndex/affair_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/absence_approval_model'));
              cb(null, require('./routes/absence/affair_approval'));
            });
          },
        },
        /* 事假已办页面 */
        {
          path: 'absenceIndex/affair_approval_look',
          name: 'absenceIndex/affair_approval_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/absence_approve_look_model'));
              cb(null, require('./routes/absence/affair_approval_look'));
            });
          },
        },
        /* 审批页面 */
        {
          path: 'absenceIndex/absence_approval',
          name: 'absenceIndex/absence_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/absence_approval_model'));
              cb(null, require('./routes/absence/absence_approval'));
            });
          },
        },
        /* 年假审批页面 */
        {
          path: 'absenceIndex/year_approval',
          name: 'absenceIndex/year_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/absence_approval_model'));
              cb(null, require('./routes/absence/year_approval'));
            });
          },
        },
        /* 年假审批查看页面 */
        {
          path: 'absenceIndex/year_approval_look',
          name: 'absenceIndex/year_approval_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/absence_approval_model'));
              cb(null, require('./routes/absence/year_approval_look'));
            });
          },
        },
        /* 年假管理页面 */
        {
          path: 'yearpersoninfo',
          name: 'yearpersoninfo',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/year_person_info_model'));
              cb(null, require('./routes/absence/year_person_info'));
            });
          },
        },
        /* 年假导入页面 */
        {
          path: 'yearpersoninfo/yearimport',
          name: 'yearpersoninfo/yearimport',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/year_person_info_model'));
              cb(null, require('./routes/absence/year_import'));
            });
          },
        },
        /* 员工请假记录查询 */
        {
          path: 'personalSearch',
          name: 'personalSearch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/absence/person_info_search_model'));
              cb(null, require('./routes/absence/person_info_search'));
            });
          },
        },
      ]
    },
    /* 请假管理路由结束 */

    /* 工会慰问管理路由开始 */
    {
      path: 'humanApp/laborSympathy',
      name: 'humanApp/laborSympathy',
      childRoutes: [
        /* 工会慰问管理模块首页 -待办已办页面*/
        {
          path: 'index',
          name: 'index',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/laborSympathy/labor_sympathy_index_model'));
              cb(null, require('./routes/laborSympathy/labor_sympathy_index'));
            });
          },
        },
        /* 工会慰问申请 */
        {
          path: 'index/apply',
          name: 'index/apply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/laborSympathy/labor_sympathy_apply_model'));
              cb(null, require('./routes/laborSympathy/labor_sympathy_apply'));
            });
          },
        },
        /* 工会慰问审批页面 */
        {
          path: 'index/affair_approval',
          name: 'index/affair_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/laborSympathy/labor_sympathy_approval_model'));
              cb(null, require('./routes/laborSympathy/labor_sympathy_approval'));
            });
          },
        },
        /* 工会慰问审批页面 */
        {
          path: 'index/labor_sympathy_approval',
          name: 'index/labor_sympathy_approval',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/laborSympathy/labor_sympathy_approval_model'));
              cb(null, require('./routes/laborSympathy/labor_sympathy_approval'));
            });
          },
        },
        /* 工会慰问审批查看页面 */
        {
          path: 'index/labor_sympathy_approval_look',
          name: 'index/labor_sympathy_approval_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/laborSympathy/labor_sympathy_approval_model'));
              cb(null, require('./routes/laborSympathy/labor_sympathy_approval_look'));
            });
          },
        },
        /* 工会慰问审批查看页面 */
        {
          path: 'index/labor_sympathy_apply_look',
          name: 'index/labor_sympathy_apply_look',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/laborSympathy/labor_sympathy_apply_model'));
              cb(null, require('./routes/laborSympathy/labor_sympathy_apply_look'));
            });
          },
        },
      ]
    },
    /* 工会慰问管理路由结束 */
    /* 考勤管理路由开始 */
    {
      path: 'humanApp/attend',
      name: 'humanApp/attend',
      childRoutes: [
        /* 考勤管理模块首页 -待办已办页面*/
        {
          path: 'index',
          name: 'index',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/attend/attend_index_model'));
              cb(null, require('./routes/attend/attend_index'));
            });
          },
        },
        /* 项目组考勤申请 */
        {
          path: 'index/proj_apply',
          name: 'index/proj_apply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/attend/attend_apply_model'));
              cb(null, require('./routes/attend/attend_proj_apply'));
            });
          },
        },
        /* 部门考勤申请 */
        {
          path: 'index/dept_apply',
          name: 'index/dept_apply',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/attend/attend_apply_model'));
              cb(null, require('./routes/attend/attend_dept_apply'));
            });
          },
        },
          /* 职能部门考勤申请 */
          {
            path: 'index/func_apply',
            name: 'index/func_apply',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/attend/attend_apply_model'));
                cb(null, require('./routes/attend/attend_func_apply'));
              });
            },
          },
           /* 项目组审批考勤 */
           {
            path: 'index/attend_proj_approval',
            name: 'index/attend_proj_approval',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/attend/attend_approval_model'));
                cb(null, require('./routes/attend/attend_proj_approval'));
              });
            },
          },
            /* 项目组审批考勤查看 */
           {
            path: 'index/attend_proj_approval_look',
            name: 'index/attend_proj_approval_look',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/attend/attend_approval_model'));
                cb(null, require('./routes/attend/attend_proj_approval_look'));
              });
            },
          },
            /* 部门审批考勤 */
           {
            path: 'index/attend_dept_approval',
            name: 'index/attend_dept_approval',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/attend/attend_approval_model'));
                cb(null, require('./routes/attend/attend_dept_approval'));
              });
            },
          },
            /* 部门审批考勤查看 */
           {
            path: 'index/attend_dept_approval_look',
            name: 'index/attend_dept_approval_look',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/attend/attend_approval_model'));
                cb(null, require('./routes/attend/attend_dept_approval_look'));
              });
            },
          },
          /* 业务部门审批考勤 */
          {
            path: 'index/attend_func_approval',
            name: 'index/attend_func_approval',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/attend/attend_approval_model'));
                cb(null, require('./routes/attend/attend_func_approval'));
              });
            },
          },
            /* 业务部门审批考勤查看 */
           {
            path: 'index/attend_func_approval_look',
            name: 'index/attend_func_approval_look',
            getComponent(nextState, cb) {
              require.ensure([], require => {
                registerModel(app, require('./models/attend/attend_approval_model'));
                cb(null, require('./routes/attend/attend_func_approval_look'));
              });
            },
          },

      ]
    },
    /* 考勤管理路由结束 */

  ];
  return router;
}

module.exports = {
  name: '人力路由文件',
  humanRouterConfig
}
