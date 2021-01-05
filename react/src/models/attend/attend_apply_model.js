/**
* 文件说明：创建年休假申请
* 作者：郭西杰
* 邮箱：guoxj116@chinaunicom.cn  
* 创建日期：2020-04-28
*/
import Cookie from "js-cookie";
import { OU_HQ_NAME_CN, OU_NAME_CN } from "../../utils/config";
import * as overtimeService from "../../services/overtime/overtimeService";
import * as absenceService from "../../services/absence/absenceService";
import * as staffLeaveService from "../../services/labor/staffLeave/staffLeaveService";
import * as attendService from "../../services/attend/attendService";
import { message } from "antd";
import moment from 'moment'

function dataFrontDataFullAttendImport(data) {
  let frontDataList = [];
  var number = '0';
  for (let item in data) {
    let newData = {
      //序号
      indexID: data[item].序号,
      user_id: data[item].员工编号,
      user_name: data[item].员工姓名,
    };
    frontDataList.push(newData);
  }
  return frontDataList;
}
function dataFrontDataBusinessTripImport(data) {
  let frontDataList = [];
  var number = '0';
  for (let item in data) {
    number++;
    let newData = {
      //序号
      indexID: data[item].序号,
      user_id: data[item].员工编号,
      user_name: data[item].员工姓名,
      travel_days: data[item].出差天数,
      travel_details: data[item].出差详情,

    };
    frontDataList.push(newData);

  }
  return frontDataList;
}
function dataFrontDataOutTripImport(data) {
  let frontDataList = [];
  var number = '0';
  for (let item in data) {
    number++;
    let newData = {
      //序号
      indexID: data[item].序号,
      user_id: data[item].员工编号,
      user_name: data[item].员工姓名,
      away_days: data[item].因公外出天数,
      away_details: data[item].因公外出详情,
    };
    frontDataList.push(newData);
  }
  return frontDataList;
}
export default {
  namespace: 'attend_apply_model',
  state: {

    fullAttendImportDataList: [],
    businessTripImportDataList: [],
    personDataApprovalInfo: [],
    outTripImportDataList: [],
    projectAbsenceQueryDataList: [],
    circulationType: '',
    approvType: '',
    tableDataList: [],
    personDataList: [],
    userProjectDataList: [],
    personCheckResult: '',
    teamDataList: [],
    approvalDataList: [],
    saveView: '',
    saveTaskId: '',
    nextpostname: '',
    nextDataList: [],
    proj_id: '',
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    //默认传参
    *postDatatoCreate({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          circulationType: query.circulationType,
          proj_id: query.proj_id,
          saveTaskId: '',
          fullAttendImportDataList: [],
          businessTripImportDataList: [],
          outTripImportDataList: [],
          projectAbsenceQueryDataList: [],
        }
      });

      let attendTypeInfo = '';
      if (query.attendType === null || query.attendType === undefined || query.attendType === '') {
        attendTypeInfo = query.attendType
      }
      else {
        attendTypeInfo = query.attendType
      }
      // 回传信息 保存状态信息
      if (query.statusFlag === '1') {
        yield put({
          type: 'save',
          payload: {
            //申请的类型
            attendType: query.attendType,
          }
        });
      }
      //回传创建时候的申请类型信息
      else {
        yield put({
          type: 'save',
          payload: {
            //申请的类型
            attendType: query.attendType,
          }
        });
      }

      /* 查询用户项目信息 Begin */
      let auth_userid = Cookie.get('userid');
      let projectQueryparams = {};
      projectQueryparams["arg_user_id"] = auth_userid;
      let userProjectData = yield call(staffLeaveService.projectQuery, projectQueryparams);
      if (userProjectData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            userProjectDataList: userProjectData.DataRows,
            saveViewControl: query.saveViewControl,
          }
        })
      }
      /* 查询用户项目信息 End */

      //查询下一环节处理人信息begin
      let userProjectDataList = userProjectData.DataRows;
      const projectList1 = userProjectDataList.map(item => item.proj_id);
      const projectList = (projectList1 == null || projectList1 == '' || projectList1 == undefined) ? Cookie.get('dept_id') : projectList1[0];


      if (attendTypeInfo === "dept" || attendTypeInfo === "func") {
        projectQueryparams = {
          arg_deptid: Cookie.get('dept_id')
        };
        let nextData = yield call(overtimeService.nextPersonListStartQuery, projectQueryparams);
        let nextname = '';
        if (nextData.DataRows.length > 0) {
          nextname = nextData.DataRows[0].submit_post_name;
        }
        if (nextData.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              nextDataList: nextData.DataRows,
              nextpostname: nextname
            }
          })
        } else {
          message.error("查询下一环节处理人信息异常");
        }
      }

      /*查询项目组下一环节处理人信息 Begin*/
      if (attendTypeInfo === "proj") {
        let projectQueryparams1 = {
          arg_proc_inst_id: 'NA',
          arg_proj_id: projectList,
          arg_post_id: '9cc97a9cb3b311e6a01d02429ca3c6ff'
        };
        let nextData1 = yield call(overtimeService.nextPersonListQuery, projectQueryparams1);
        let nextname1 = '';
        if (nextData1.length > 0) {
          nextname1 = nextData1.DataRows[0].submit_post_name;
        }
        if (nextData1.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              nextDataList: nextData1.DataRows,
              nextpostname: nextname1
            }
          })
        } else {
          message.error("查询下一环节处理人信息异常");
        }

      }
      /*查询项目组下一环节处理人信息 End*/
    },
    // 查询项目组请假信息 
    *queryProjAbsenceInfo({ cycle_code, proj_name }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          projectAbsenceQueryDataList: [],
        }
      })
      let projectAbsenceQueryparams = {};
      projectAbsenceQueryparams["arg_cycle_code"] = cycle_code;
      projectAbsenceQueryparams["arg_proj_name"] = proj_name;
      projectAbsenceQueryparams["arg_ou_id"] = Cookie.get("OUID");
      projectAbsenceQueryparams["arg_dept_id"] = Cookie.get('dept_id');

      let projectAbsenceQuery = yield call(attendService.projectAbsenceInfo, projectAbsenceQueryparams);
      if (projectAbsenceQuery.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            projectAbsenceQueryDataList: projectAbsenceQuery.DataRows,
          }
        })
      }
    },
    *fullAttendImport({ param }, { put }) {
      yield put({
        type: 'save',
        payload: {
          fullAttendImportDataList: [],
        }
      });
      yield put({
        type: 'save',
        payload: {
          fullAttendImportDataList: dataFrontDataFullAttendImport(param),
          haveData: true
        }
      });
    },
    *businessTripImport({ param }, { put }) {
      yield put({
        type: 'save',
        payload: {
          businessTripImportDataList: [],
        }
      });
      yield put({
        type: 'save',
        payload: {
          businessTripImportDataList: dataFrontDataBusinessTripImport(param),
          haveData: true
        }
      });
    },
    *outTripImport({ param }, { put }) {
      yield put({
        type: 'save',
        payload: {
          outTripImportDataList: [],
        }
      });
      yield put({
        type: 'save',
        payload: {
          outTripImportDataList: dataFrontDataOutTripImport(param),
          haveData: true
        }
      });
    },
    // 全勤保存
    *fullAttendSave({ transferAttendList, worktime_team_apply_id, resolve }, { call }) {
      /* 保存全勤 */
      let rollbackFlag = 0;
      let postDataDeleteDateBase = {};
      postDataDeleteDateBase["arg_worktime_team_apply_id"] = worktime_team_apply_id;
      let j = 0;
      for (let i = 0; i < transferAttendList.length; i++) {
        const transferAttendListResult = yield call(attendService.attendFullInfoSave, transferAttendList[i]);
        if (transferAttendListResult.RetVal !== '1') {
          rollbackFlag = 1;
          yield call(attendService.attendFullInfoDel, postDataDeleteDateBase);
          message.error(transferAttendListResult.RetVal);
          j = 1
          resolve("false");
          return;
        }
      }
      if (j === 0) {
        message.success('保存成功');
        resolve("success");
      }
      else {
        message.success('保存失败');
        resolve("false");
      }
      return;
    },
    // 保存
    *absenceSave({ transferAttendList, worktime_team_apply_id, resolve }, { call }) {
      /* 保存全勤 */
      let rollbackFlag = 0;
      let postDataDeleteDateBase = {};
      postDataDeleteDateBase["arg_worktime_team_apply_id"] = worktime_team_apply_id;
      let j = 0;
      for (let i = 0; i < transferAttendList.length; i++) {
        const transferAttendListResult = yield call(attendService.absencelInfoSave, transferAttendList[i]);
        if (transferAttendListResult.RetVal !== '1') {
          rollbackFlag = 1;
          yield call(attendService.absencelInfoDel, postDataDeleteDateBase);
          message.error(transferAttendListResult.RetVal);
          j = 1
          break;
        }
      }
      if (j === 0) {
        message.success('保存成功');
        resolve("success");
      } else {
        message.success('保存失败');
        resolve("false");
      }
      return;
    },
    // 出差保存 
    *travelAttendSave({ transferAttendList, worktime_team_apply_id, resolve }, { call }) {
      /* 保存全勤 */
      let rollbackFlag = 0;
      let postDataDeleteDateBase = {};
      postDataDeleteDateBase["arg_worktime_team_apply_id"] = worktime_team_apply_id;
      let j = 0;
      for (let i = 0; i < transferAttendList.length; i++) {
        const transferAttendListResult = yield call(attendService.attendBusinessTripInfoSave, transferAttendList[i]);
        if (transferAttendListResult.RetVal !== '1') {
          rollbackFlag = 1;
          yield call(attendService.attendBusinessTripInfoDel, postDataDeleteDateBase);
          message.error(transferAttendListResult.RetVal);
          j = 1
          resolve("false");
          return;
        }
      }
      if (j === 0) {
        message.success('保存成功');
        resolve("success");
      }
      else {
        message.success('保存失败');
        resolve("false");
      }
      return;
    },
    // 外出保存
    *awayAttendSave({ transferAttendList, worktime_team_apply_id, resolve }, { call }) {
      /* 保存全勤 */
      let rollbackFlag = 0;
      let postDataDeleteDateBase = {};
      postDataDeleteDateBase["arg_worktime_team_apply_id"] = worktime_team_apply_id;
      let j = 0;
      for (let i = 0; i < transferAttendList.length; i++) {
        const transferAttendListResult = yield call(attendService.outTripInfoSave, transferAttendList[i]);
        if (transferAttendListResult.RetVal !== '1') {
          rollbackFlag = 1;
          yield call(attendService.outTripInfoDel, postDataDeleteDateBase);
          message.error(transferAttendListResult.RetVal);
          j = 1
          resolve("false");
          return;
        }
      }
      if (j === 0) {
        message.success('保存成功');
        resolve("success");
      }
      else {
        message.success('保存失败');
        resolve("false");
      }
      return;
    },
    //提交申请信息 
    * attendProjApplySubmit({ basicInfoData, approvalData, approvalDataNext, worktime_team_apply_id, committee_type, resolve }, { call }) {
      /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
      let param = {
        //离职申请启动工作流标识
        start_type: 'worktime_team_flow',
      };
      let listenersrc = '{addattendteamnext:{arg_procInstId:"${procInstId}",arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';

      param["listener"] = listenersrc;

      const attendProjFlowStartResult = yield call(attendService.attendProjApplyFlowStart, param);
      let attendProjFlowStartList = [];
      if (attendProjFlowStartResult.RetCode === '1') {
        attendProjFlowStartList = attendProjFlowStartResult.DataRows[0];
      }
      else {
        message.error('Service  attendProjFlowStart ' + attendProjFlowStartResult.RetVal);
        resolve("false");
        return;
      }

      let proc_inst_id = attendProjFlowStartList.procInstId;
      let post_id_next = '9cc97a9cb3b311e6a01d02429ca3c6ff';
      let task_id = attendProjFlowStartList.taskId;
      let task_name = attendProjFlowStartList.actName;

      //基本信息表apply补全
      basicInfoData["arg_proc_inst_id"] = proc_inst_id;
      basicInfoData["arg_post_id_next"] = post_id_next;
      //审批信息approval补全
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;

      //用来回滚数据库和工作流
      let postDataDeleteDateBase = {};
      let postDataDeleteFlow = {};
      let deleteFlag = {};

      postDataDeleteDateBase["arg_worktime_team_apply_id"] = worktime_team_apply_id;
      postDataDeleteDateBase["arg_status"] = '1';
      postDataDeleteFlow["procInstId"] = proc_inst_id;
      deleteFlag["arg_worktime_team_apply_id"] = worktime_team_apply_id;
      deleteFlag["arg_status"] = '1';

      let postData = {};
      postData["procInstId"] = proc_inst_id;
      postData["arg_status"] = '1';
      try {
        //回滚标志
        let rollbackFlag = 0;
        let postDataDelete = {};
        postDataDelete["arg_worktime_team_apply_id"] = worktime_team_apply_id;
        postDataDelete["arg_status"] = '0';

        //提交基本申请信息
        let saveBasicInfo = yield call(attendService.attendProjInfoSave, basicInfoData);
        if (saveBasicInfo.RetCode !== '1') {
          /* 回滚功能:数据库 */
          yield call(attendService.deleteAttendProjApprovalInfo, deleteFlag);
          // 结束工作流
          yield call(attendService.attendProjApplyFlowTerminate, postData);
          message.error('提交失败');
          rollbackFlag = 1;
        }
        /* 提交审批信息  */
        const approvalDataInfo = yield call(attendService.attendProjeApprovalSubmitInfo, approvalData);
        if (approvalDataInfo.RetCode !== '1') {
          /* 回滚功能:数据库 */
          yield call(attendService.deleteAttendProjApprovalInfo, deleteFlag);
          // 结束工作流
          yield call(attendService.attendProjApplyFlowTerminate, postData);
          message.error('提交失败');
          rollbackFlag = 1;
        }

        /*调用工作流节点结束服务 Begin */
        let param1 = {};
        param1["taskId"] = task_id;
        let listenerSrc = '{addattendteamnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param1["listener"] = listenerSrc;

        let attendProjApplyFlowCompleteList = {};
        const attendProjFlowCompleteResult = yield call(attendService.attendProjApplyFlowComplete, param1);
        if (attendProjFlowCompleteResult.RetCode === '1') {
          attendProjApplyFlowCompleteList = attendProjFlowCompleteResult.DataRows;
        } else {
          message.error('Service attendProjApplyFlowComplete ' + attendProjFlowCompleteResult.RetVal);
          resolve("false");
          return;
        }
        let task_id_end = attendProjApplyFlowCompleteList[0] && attendProjApplyFlowCompleteList[0].taskId;
        let task_name_end = attendProjApplyFlowCompleteList[0] && attendProjApplyFlowCompleteList[0].actName;
        /*调用工作流节点结束服务 End */
        /*保存下一节点信息 Begin */
        approvalDataNext["arg_task_id"] = task_id_end;
        approvalDataNext["arg_task_name"] = task_name_end;
        const approvalDataInfoNext = yield call(attendService.attendProjeApprovalSubmitInfo, approvalDataNext);
        if (approvalDataInfoNext.RetCode !== '1') {
          /* 回滚功能:数据库 */
          yield call(attendService.deleteAttendProjApprovalInfo, deleteFlag);
          // 结束工作流
          yield call(attendService.attendProjApplyFlowTerminate, postData);
          message.error('提交失败');
          rollbackFlag = 1;
        }
        /*保存下一节点信息 End */

        if (rollbackFlag === 1) {
          /* 回滚功能:数据库 */
          yield call(attendService.deleteAttendProjApprovalInfo, deleteFlag);
          // 结束工作流
          yield call(attendService.attendProjApplyFlowTerminate, postData);
          message.error('提交失败');
          resolve("false");
        } else {
          message.success('提交成功');
          resolve("success");
        }
      } catch (e) {
        try {
          /* 回滚功能:数据库 */
          yield call(attendService.deleteAttendProjApprovalInfo, deleteFlag);
          // 结束工作流
          yield call(attendService.attendProjApplyFlowTerminate, postData);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }

    },
    // 业务部门申请-查询
    *deptQuery({ param }, { call, put }) {
      const submitBasicInfo = yield call(attendService.departmentAttendApplyQuery, param);

      if (submitBasicInfo.RetCode === '1') {
        // message.success('请求成功！');
        yield put({
          type: 'save',
          payload: {
            teamDataList: submitBasicInfo.DataRows,
          }
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            teamDataList: [],
          }
        });
        // message.error('请求失败');
      }
    },
    // 查询项目组详细信息
    *queryTeamList({ param }, { call, put }) {
      const personData1 = yield call(attendService.worktimeFullApplyQuery, param);
      if (personData1.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            personFullDataList: personData1.DataRows
          }
        })
      } else {
        message.error("没有全勤人员信息");
      }

      const personData2 = yield call(attendService.worktimeAbsenceApplyQuery, param);
      if (personData2.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            personAbsenceDataList: personData2.DataRows
          }
        })
      } else {
        message.error("没有请假人员信息");
      }

      const personData3 = yield call(attendService.worktimeTravelApplyQuery, param);
      if (personData3.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            personTravelDataList: personData3.DataRows
          }
        })
      } else {
        message.error("没有出差人员信息");
      }

      const personData4 = yield call(attendService.worktimeOutApplyQuery, param);
      if (personData4.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            personOutDataList: personData4.DataRows
          }
        })
      } else {
        message.error("没有外出人员信息");
      }
      // 查询项目组审批信息
      let postDataDeleteDateBaseApproval = {};
      postDataDeleteDateBaseApproval["arg_apply_id"] = param.arg_worktime_team_apply_id;
      const personDataApproval = yield call(attendService.attendApprovalTeamQuery, postDataDeleteDateBaseApproval);
      if (personDataApproval.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            personDataApprovalInfo: personDataApproval.DataRows
          }
        })
      } else {
        message.error("审批信息");
      }
    },
    //提交申请信息 
    *attendDeptApplySubmit({ basicInfoData, approvalData, approvalDataNext, transforTeamDataList, worktime_dept_apply_id, committee_type, resolve }, { call }) {
      /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
      let param = {};
      //let listenersrc = '{adddepartmentnext:{arg_procInstId:"${procInstId}",arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
      // param["listener"] = listenersrc;
      const attendDeptFlowStartResult = yield call(overtimeService.departmentOvertimeStatsFlowStart, param);
      let attendDeptFlowStartList = [];
      if (attendDeptFlowStartResult.RetCode === '1') {
        attendDeptFlowStartList = attendDeptFlowStartResult.DataRows[0];
      }
      else {
        message.error('Service  attendDeptFlowStart ' + attendDeptFlowStartResult.RetVal);
        resolve("false");
        return;
      }
      let proc_inst_id = attendDeptFlowStartList.procInstId;
      let task_id = attendDeptFlowStartList.taskId;
      let task_name = attendDeptFlowStartList.actName;

      //基本信息表apply补全
      basicInfoData["arg_proc_inst_id"] = proc_inst_id;
      //审批信息approval补全
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;

      //用来回滚数据库和工作流
      let postDataDeleteDateBase = {};
      let postDataDeleteFlow = {};
      postDataDeleteDateBase["arg_worktime_department_apply_id"] = worktime_dept_apply_id;
      let deleteFlag = {};
      deleteFlag["arg_worktime_department_apply_id"] = worktime_dept_apply_id;
      postDataDeleteFlow["procInstId"] = proc_inst_id;
      postDataDeleteDateBase["arg_status"] = '1';

      try {
        //回滚标志
        let rollbackFlag = 0;
        let postDataDelete = {};
        postDataDelete["arg_worktime_department_apply_id"] = worktime_dept_apply_id;
        postDataDelete["arg_status"] = '0';

        //提交基本申请信息
        let saveBasicInfo = yield call(attendService.attendDeptInfoSave, basicInfoData);
        if (saveBasicInfo.RetCode !== '1') {
          rollbackFlag = 1;
        }

        if (committee_type === 'dept') {
          let j = 0;
          /* 保存humanwork.overtime_department_team表项目组信息 Begin */
          for (let i = 0; i < transforTeamDataList.length; i++) {
            const saveTeamInfo = yield call(attendService.departmentAttendApplyRelSave, transforTeamDataList[i]);
            if (saveTeamInfo.RetCode !== '1') {
              /* 回滚功能:数据库 */
              yield call(attendService.deleteAttenDeptApprovalInfo, deleteFlag);
              // 结束工作流
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error('提交失败');
              j = 1;
              break;
            }
          }
        }

        /* 提交审批信息  */
        const approvalDataInfo = yield call(attendService.attendDeptApprovalSubmitInfo, approvalData);
        if (approvalDataInfo.RetCode !== '1') {
          rollbackFlag = 1;
        }

        /*调用工作流节点结束服务 Begin */
        param["taskId"] = task_id;
        let listenerSrc = '{adddepartmentnext:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('OUID') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenerSrc;

        let attendDeptApplyFlowCompleteList = {};
        const attendDeptFlowCompleteResult = yield call(overtimeService.overtimeFlowComplete, param);

        if (attendDeptFlowCompleteResult.RetCode === '1') {
          attendDeptApplyFlowCompleteList = attendDeptFlowCompleteResult.DataRows;
        } else {
          message.error('Service attendDeptApplyFlowComplete ' + attendDeptFlowCompleteResult.RetVal);
          resolve("false");
          return;
        }
        let task_id_end = attendDeptApplyFlowCompleteList[0] && attendDeptApplyFlowCompleteList[0].taskId;
        let task_name_end = attendDeptApplyFlowCompleteList[0] && attendDeptApplyFlowCompleteList[0].actName;
        // 补全下一环节审批信息
        approvalDataNext["arg_task_id"] = task_id_end;
        approvalDataNext["arg_task_name"] = task_name_end;
        /*调用工作流节点结束服 务 End */

        /*保存下一节点信息 Begin */
        const approvalDataInfoNext = yield call(attendService.attendDeptApprovalSubmitInfo, approvalDataNext);
        if (approvalDataInfoNext.RetCode !== '1') {
          rollbackFlag = 1;
        }
        /*保存下一节点信息 End */

        if (rollbackFlag === 1) {
          /* 回滚功能:数据库 */
          yield call(attendService.deleteAttenDeptApprovalInfo, deleteFlag);
          // 结束工作流
          yield call(overtimeService.overtimeFlowTerminate, postData);
          message.error('提交失败');
          resolve("false");
        } else {
          message.success('提交成功');
          resolve("success");
        }
      } catch (e) {
        try {

          /* 回滚功能:数据库 */
          yield call(attendService.deleteAttenDeptApprovalInfo, deleteFlag);
          // 结束工作流
          yield call(overtimeService.overtimeFlowTerminate, postData);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/attend/index/proj_apply') {
          dispatch({ type: 'postDatatoCreate', query });
        } else if (pathname === '/humanApp/attend/index/dept_apply') {
          dispatch({ type: 'postDatatoCreate', query });
        } else if (pathname === '/humanApp/attend/index/func_apply') {
          dispatch({ type: 'postDatatoCreate', query });
        }
      });
    }
  }
};
