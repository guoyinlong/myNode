/**
 * 文件说明：培训管理-首页
 * 作者：shiqingpei
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-07-08
 **/
import Cookie from "js-cookie";
import * as trainService from "../../services/train/trainService";
import * as hrService from "../../services/hr/hrService";
import * as overtimeService from "../../services/overtime/overtimeService"
import { message } from "antd";
import { routerRedux } from "dva/router";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../utils/config';
const auth_tenantid = Cookie.get('tenantid');
const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

export default {
  namespace: 'train_do_model',
  state: {
    user_id: '',
    userRoleData: [],
    tableDataList: [],
    ouList: [],
    deptList: [],
    currentPage: null,
    total: null,
    item: {},
    postData: {},
    tableDataListTotal: [],
    nextPersonList: [],
    deptInfoList: [],
    /*新增培训计划 begin*/
    userAddNewRoleData: [],
    /*新增培训计划 end */
    typeFlag: '',
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveOU(state, { ouList: DataRows }) {
      return { ...state, ouList: DataRows };
    },
    saveDept(state, { deptList: DataRows }) {
      return { ...state, deptList: DataRows };
    },
  },

  effects: {

    /**2019.7.15 新增待办首页的默认查询方法 */
    *trainApprovalQuery({ }, { call, put }) {
      /*查询用户角色 Begin*/
      // let postInfo = {};
      // postInfo["arg_user_id"] = Cookie.get('userid');
      // const userRoleData = yield call(overtimeService.queryUserRole, postInfo);
      // if (userRoleData.RetCode === '1') {
      //   yield put({
      //     type: 'save',
      //     payload: {
      //       userRoleList: userRoleData.DataRows,
      //     }
      //   });
      // } else {
      //   message.error("查询角色失败");
      // }
      /*查询用户角色 End*/

      console.log("查询待办");

      yield put({
        type: 'trainSearchDefault',
        arg_type: 1,
      });

    },
    /**2019.7.15 新增培训的待办和已办的查询 */
    *trainSearchDefault({ arg_type }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          tableDataList: [],
          infoSearch: [],
        }
      });
      //获取Cookie的值，用的时候获取即可，写在最外面容易导致获取的不是最新的。
      const auth_tenantid = Cookie.get('tenantid');
      const auth_ou = Cookie.get('OU');
      let ou_search = auth_ou;

      let auth_userid = Cookie.get('userid');
      let postData = {};
      postData["arg_page_size"] = 10;  //初始化页面显示条数为10
      postData["arg_page_current"] = 1;   //初始化当前页码为1
      postData["arg_user_id"] = auth_userid;
      postData["arg_user_pass"] = Cookie.get('loginpass');
      postData["arg_type"] = arg_type;

      let data = yield call(trainService.trainApprovalQuery, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: data.DataRows,
          }
        })
      }

      let postInfo = {};
      postInfo["arg_tenantid"] = auth_tenantid;
      postInfo["arg_all"] = auth_userid;    //只查询自己的信息
      postInfo["arg_ou_name"] = ou_search;
      postInfo["arg_allnum"] = 0;     //默认值为0
      postInfo["arg_page_size"] = 10;
      postInfo["arg_page_current"] = 1;
      const basicInfoData = yield call(hrService.basicInfoQuery, postInfo);
      /*      console.log("用户信息前+++++model");
            console.log(basicInfoData);
            console.log("用户信息前+++++model");*/

      if (basicInfoData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            infoSearch: basicInfoData.DataRows,
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },
    /**2019.7.15 新增列表查询的初始化方法 ,默认进入页面查询*/
    *trainListInit({ query }, { call, put }) {
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const { DataRows: getOuData } = yield call(hrService.getOuList, postData_getOU);
      yield put({
        type: 'saveOU',
        ouList: getOuData
      });

      //从服务获取所属OU下的部门列表
      let postData_getDept = {};
      postData_getDept["argtenantid"] = auth_tenantid;
      const { DataRows: getDeptData } = yield call(hrService.getDeptInfo, postData_getDept);
      let pureDeptData = [];//存储去除前缀后的部门数据
      for (let i = 0; i < getDeptData.length; i++) {
        if (getDeptData[i].dept_name.split('-')[0] === auth_ou_flag && getDeptData[i].dept_name.split('-')[1]) {
          if (!getDeptData[i].dept_name.split('-')[2]) { //纪委去重
            pureDeptData.push(getDeptData[i].dept_name.split('-')[1]);
          }
        }
      }
      yield put({
        type: 'saveDept',
        deptList: pureDeptData
      });

      //查询登录人员的角色
      let queryData = {};
      let flag = '';
      queryData["arg_user_id"] = Cookie.get('userid');
      const roleData = yield call(trainService.trainCheckRole, queryData);

      if (roleData.RetCode === '1') {
        flag = roleData.DataRows[0].role_level;
      } else {
        message.error(roleData.RetVal);
      }

      let tableDataList_temp = [];
      let postData_temp = {};
      let total_temp = '';
      let currentPage_temp = '';
      let permission_temp = '';

      yield put({
        type: 'save',
        payload: {
          tableDataList: [],
          postData: '',
          total: 0,
          currentPage: 1,
          permission: flag,
          tableDataListTotal: [],
          typeFlag: '1',
        }
      });

      if (flag === '1') {
        /**部门接口人只能查看自己的部门 */
        //默认查询登录人的所在院的培训计划
        /**查两遍 一遍展示，一遍导出 */
        let postData = {};
        postData["arg_ou_name"] = auth_ou;
        postData["arg_dept_name"] = Cookie.get("dept_name");
        postData["arg_type"] = '1';
        postData["arg_year"] = new Date().getFullYear();
        postData["arg_page_current"] = 1;   //初始化当前页码为1
        postData["arg_page_size"] = 10;  //初始化页面显示条数为10
        postData["arg_ou_id"] = Cookie.get("OUID");
        postData["arg_train_time"] = '';
        postData["arg_status"] = '';
        const basicInfoData = yield call(trainService.trainPlanListQuery, postData);
        console.log(basicInfoData);
        if (basicInfoData.RetCode === '1') {
          /**要展示的需要赋值 */
          tableDataList_temp = basicInfoData.DataRows;
          postData_temp = postData;
          total_temp = basicInfoData.RowCount;
          currentPage_temp = postData.arg_page_current;
          permission_temp = flag;
        } else {

          message.error(basicInfoData.RetVal);
        }

        let queryParam = {};
        queryParam["arg_ou_name"] = auth_ou;
        queryParam["arg_dept_name"] = Cookie.get("dept_name");
        queryParam["arg_type"] = '1';
        queryParam["arg_year"] = new Date().getFullYear();
        queryParam["arg_page_current"] = 1;   //初始化当前页码为1
        queryParam["arg_page_size"] = 10000;  //初始化页面显示条数为10
        queryParam["arg_ou_id"] = Cookie.get("OUID");
        queryParam["arg_train_time"] = '';
        queryParam["arg_status"] = '';
        const exportData = yield call(trainService.trainPlanListQuery, queryParam);
        if (exportData.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              tableDataList: tableDataList_temp,
              postData: postData_temp,
              total: total_temp,
              currentPage: currentPage_temp,
              permission: permission_temp,
              tableDataListTotal: exportData.DataRows,
              typeFlag: '1',
            }
          });
        } else {
          message.error(exportData.RetVal);
        }
      }
      if (flag === '2') {
        /**人力专员有最高的权限 */
        //默认查询登录人的所在院的培训计划
        let postData = {};
        postData["arg_ou_name"] = auth_ou;
        postData["arg_dept_name"] = Cookie.get("dept_name");
        postData["arg_type"] = '1';
        postData["arg_year"] = new Date().getFullYear();
        postData["arg_page_current"] = 1;   //初始化当前页码为1
        postData["arg_page_size"] = 10;  //初始化页面显示条数为10
        postData["arg_ou_id"] = Cookie.get("OUID");
        postData["arg_train_time"] = '';
        postData["arg_status"] = '';
        const basicInfoData = yield call(trainService.trainPlanListQuery, postData);
        console.log(basicInfoData);
        if (basicInfoData.RetCode === '1') {
          tableDataList_temp = basicInfoData.DataRows;
          postData_temp = postData;
          total_temp = basicInfoData.RowCount;
          currentPage_temp = postData.arg_page_current;
          permission_temp = flag;
        } else {

          message.error(basicInfoData.RetVal);
        }

        let queryParam = {};
        queryParam["arg_ou_name"] = auth_ou;
        queryParam["arg_dept_name"] = Cookie.get("dept_name");
        queryParam["arg_type"] = '1';
        queryParam["arg_year"] = new Date().getFullYear();
        queryParam["arg_page_current"] = 1;   //初始化当前页码为1
        queryParam["arg_page_size"] = 10000;  //初始化页面显示条数为10
        queryParam["arg_ou_id"] = Cookie.get("OUID");
        queryParam["arg_train_time"] = '';
        queryParam["arg_status"] = '';
        const exportData = yield call(trainService.trainPlanListQuery, queryParam);
        if (exportData.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              tableDataList: tableDataList_temp,
              postData: postData_temp,
              total: total_temp,
              currentPage: currentPage_temp,
              permission: permission_temp,
              tableDataListTotal: exportData.DataRows,
              typeFlag: '1',
            }
          });
        } else {
          message.error(exportData.RetVal);
        }
      }
    },

    /**2019.7.15 新增服务获取对应部门  */
    *getDept({ arg_param }, { call, put }) {
      let postData_getDept = {};
      postData_getDept["argtenantid"] = auth_tenantid;
      const { DataRows: getDeptData } = yield call(hrService.getDeptInfo, postData_getDept);
      let pureDeptData = [];//存储去除前缀后的部门数据
      for (let i = 0; i < getDeptData.length; i++) {
        if (arg_param === OU_HQ_NAME_CN) { //联通软件研究院本部
          arg_param = OU_NAME_CN; //联通软件研究院
        }
        if (getDeptData[i].dept_name.split('-')[0] === arg_param && getDeptData[i].dept_name.split('-')[1]) {
          if (!getDeptData[i].dept_name.split('-')[2]) { //纪委去重
            pureDeptData.push(getDeptData[i].dept_name.split('-')[1]);
          }
        }
      }
      yield put({
        type: 'saveDept',
        deptList: pureDeptData
      });
    },

    /**2019.7.15 新增培训列表条件查询 */
    *trainPlanListQuery({ query }, { call, put }) {
      let tableDataList_temp = [];
      let total_temp = '';
      let currentPage_temp = '';
      query.arg_ou_id = Cookie.get("OUID");
      const basicInfoData = yield call(trainService.trainPlanListQuery, query);
      if (basicInfoData.RetCode === '1') {
        /**要展示的需要赋值 */
        tableDataList_temp = basicInfoData.DataRows;
        total_temp = basicInfoData.RowCount;
        currentPage_temp = query.arg_page_current;
      } else {
        message.error(basicInfoData.RetVal);
      }
      query.arg_page_size = 10000;
      query.arg_page_current = 1;

      const exportData = yield call(trainService.trainPlanListQuery, query);
      if (exportData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: tableDataList_temp,
            total: total_temp,
            currentPage: currentPage_temp,
            tableDataListTotal: exportData.DataRows,
            typeFlag: query.arg_type,
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },

    /**2019.7.16 新增培训调整初始化界面*/
    *trainPlanEdit({ query }, { call, put }) {
      console.log("query===" + JSON.stringify(query));
      yield put({
        type: 'save',
        payload: {
          item: query,
        }
      });
      //2019.7.19 新增 查询院部门信息
      let deptParam = {
        arg_ou_id: Cookie.get('OUID')
      };
      let deptInfo = yield call(trainService.trainDeptInfoQuery, deptParam);
      if (deptInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            deptInfoList: deptInfo.DataRows,
          }
        });
      } else {
        message.error("查询原部门信息异常");
      }
      //2019.7.19 新增 查询登录人员的角色
      let queryData = {};
      queryData["arg_user_id"] = Cookie.get('userid');
      console.log("====");
      const roleData = yield call(trainService.trainCheckRole, queryData);

      if (roleData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            permission: roleData.DataRows[0].role_level
          }
        });
      } else {
        message.error(roleData.RetVal);
      }
      //查询下一环节处理人
      let personinfo = {
        arg_user_id: Cookie.get('userid'),
        arg_dept_id: Cookie.get('dept_id'),
        arg_ou_id: Cookie.get('OUID'),
      };
      let nextpersonData = yield call(trainService.submitPersonListQuery, personinfo);
      if (nextpersonData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextPersonList: nextpersonData.DataRows
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
      console.log('进入调整页面');
    },

    /*修改培训课程*/
    *trainPlanUpdate({ updateclassinfo, resolve }, { call, put }) {
      console.log("updateclassinfo===" + JSON.stringify(updateclassinfo));
      //查询是否为人力资源专员或者一级接口人
      let staffFlag = false;
      let userparam = {
        arg_user_id: Cookie.get('userid'),
      };
      let postlist = yield call(trainService.trainUserRoleQuery, userparam);
      if (postlist.DataRows.length > 0) {
        staffFlag = true;
      }

      //启动工作流
      let param = {
        beginbusinessId: 'train_plan_update',
      };
      let listenersrc = '{addtrainnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
      param["listener"] = listenersrc;
      param["form"] = '{if_dept_one:' + staffFlag + '}';
      const trainPlanFlowStartResult = yield call(trainService.trainPlanFlowStart, param);
      let teamApprovalFlowStartList = [];
      if (trainPlanFlowStartResult.RetCode === '1') {
        teamApprovalFlowStartList = trainPlanFlowStartResult.DataRows;
      } else {
        message.error('Service trainPlanFlowStart ' + trainPlanFlowStartResult.RetVal);
        resolve("false");
        return;
      }
      let proc_inst_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].procInstId;
      let task_id = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].taskId;
      let task_name = teamApprovalFlowStartList[0] && teamApprovalFlowStartList[0].actName;
      param.completetaskId = task_id;
      const flowCompleteResult = yield call(trainService.trainPlanFlowComplete, param);
      let flowCompleteList = [];
      if (flowCompleteResult.RetCode === '1') {
        flowCompleteList = flowCompleteResult.DataRows;
      } else {
        message.error('Service trainPlanFlowStart ' + flowCompleteResult.RetVal);
        resolve("false");
        return;
      }
      let task_id_next = flowCompleteList[0] && flowCompleteList[0].taskId;
      let task_name_next = flowCompleteList[0] && flowCompleteList[0].actName;

      let postData = {
        arg_proc_inst_id: proc_inst_id,
        arg_task_id: task_id,
        arg_task_name: task_name,
        arg_task_id_next: task_id_next,
        arg_task_name_next: task_name_next,
        arg_create_person_id: Cookie.get('userid'),
        arg_create_person_name: Cookie.get('username'),

        arg_plan_id: updateclassinfo.arg_plan_id,
        arg_train_class_id: updateclassinfo.arg_train_class_id,
        arg_nextstepPerson: updateclassinfo.arg_nextstepPerson,
        arg_class_name_update: updateclassinfo.arg_class_name_update,
        arg_train_level_update: updateclassinfo.arg_train_level_update,
        arg_class_type_update: updateclassinfo.arg_class_type_update,
        arg_train_hour_update: updateclassinfo.arg_train_hour_update,
        arg_train_time_update: updateclassinfo.arg_train_time_update,
        arg_assign_score_update: updateclassinfo.arg_assign_score_update,

        arg_train_fee_update: updateclassinfo.arg_train_fee_update,
        arg_dept_name_update: updateclassinfo.arg_dept_name_update,
        arg_budgetvalue: updateclassinfo.arg_budgetvalue,
        arg_reason: updateclassinfo.arg_reason,
        arg_class_type: updateclassinfo.arg_class_type,
        arg_offvalue: updateclassinfo.arg_offvalue,
        arg_train_group_update: updateclassinfo.arg_train_group_update,
        arg_train_person_update: updateclassinfo.arg_train_person_update,

        arg_exam_name_update: updateclassinfo.arg_exam_name_update,
        arg_exam_person_name_update: updateclassinfo.arg_exam_person_name_update,
        arg_claim_fee_update: updateclassinfo.arg_claim_fee_update,
        arg_exam_time_update: updateclassinfo.arg_exam_time_update,
        arg_exam_fee_update: updateclassinfo.arg_exam_fee_update,
      }
      try {
        //业务表添加
        let updateresult = yield call(trainService.submitTrainPlanUpdate, postData);
        if (updateresult.RetCode === '1') {
          message.info("提交成功！");
        } else {
          /!* 回滚功能:数据库 *!/
          yield call(trainService.trainPlanDelete, postData);
        }
      } catch (e) {
        /!* 回滚功能:数据库 *!/
        try {
          yield call(trainService.trainPlanDelete, postData);
          /!* 回滚功能:工作流 *!/
          param = {
            terminateprocInstId: proc_inst_id
          };
          yield call(trainService.trainPlanFlowTerminate, postData);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }
      resolve("success");
    },
    //删除待办信息
    *deleteApproval({ query }, { call, put }) {
      //项目组查询
      //console.log("query======")
      let param = {
        arg_apply_id: query.task_id,
        arg_train_type: query.train_type,
      };
      //console.log("param======"+param)
      yield call(trainService.deleteApproval, param);
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/train/train_do') {
          /**培训待办的查询 */
          dispatch({ type: 'trainApprovalQuery', query });
        } else if (pathname === '/humanApp/train/trainPlanList') {
          /**培训计划的查询列表 初始化 */
          dispatch({ type: 'trainListInit', query });
        } else if (pathname === '/humanApp/train/train_do/centerComEdit') {
          /** 总院必修培训调整*/
          dispatch({ type: 'trainPlanEdit', query });
        } else if (pathname === '/humanApp/train/train_do/centerEleEdit') {
          /** 总院选修培训调整*/

          dispatch({ type: 'trainPlanEdit', query });
        } else if (pathname === '/humanApp/train/train_do/deptPlanEdit') {
          /** 培训调整*/
          dispatch({ type: 'trainPlanEdit', query });
        } else if (pathname === '/humanApp/train/train_do/examEdit') {
          /** 考试计划调整*/
          dispatch({ type: 'trainPlanEdit', query });
        }
      });
    }
  },
};
