/**
* 作者：郭西杰
* 创建日期：2020-5-12 
* 邮箱：guoxj116@chinaunicom.cn
* 功能：实现创建事假申请界面 
*/
import Cookie from "js-cookie";
import * as overtimeService from "../../services/overtime/overtimeService";
import * as absenceService from "../../services/absence/absenceService";
import * as staffLeaveService from "../../services/labor/staffLeave/staffLeaveService";
import { message } from "antd";

export default {
  namespace: 'create_affair_absence_model',
  state: {
    circulationType: '',
    approvType: '',
    tableDataList: [],
    personDataList: [],
    userProjectDataList: [],
    personCheckResult: '',
    teamDataList: [],
    approvalDataList: [],
    absenceYearInfo: [],
    defaultDataSource1: [],
    defaultDataSource2: [],
    saveView: '',
    saveTaskId: '',
    nextpostname: '',
    nextDataList: [],
    proj_id: '',
    fileDataList: [],
    pf_url: '',
    file_relativepath: '',
    file_name: '',
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    //默认传参
    * postDatatoCreate({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          circulationType: query.circulationType,
          proj_id: query.proj_id,
          saveTaskId: ''
        }
      });
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

      /* 查询用户角色信息 Begin */
      let auth_ouid = Cookie.get('OUID');
      let auth_deptid = Cookie.get('dept_id');
      let roleQueryparams = {
        arg_ou_id: auth_ouid,
        arg_dept_id: auth_deptid,
        arg_user_id: auth_userid
      };
      let userRoleData = yield call(absenceService.absenceRoleInfoQuery, roleQueryparams);
      if (userRoleData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            userRoleData: userRoleData.DataRows,
          }
        })
      }
      /* 查询用户角色信息 End */

      /* 查询下一环节处理人信息 Begin */
      if (userRoleData.DataRows[0].absence_role == 'in_team_person') {
        let nextName = '';
        for (let i = 0; i < userProjectData.DataRows.length; i++) {
          let projectQueryParams = {
            arg_proc_inst_id: 'NA',
            arg_proj_id: userProjectData.DataRows[i].proj_id,
            arg_post_id: '9cc97a9cb3b311e6a01d02429ca3c6ff'
          };
          let nextData1 = yield call(overtimeService.nextPersonListQuery, projectQueryParams);
          if (nextData1.length > 0) {
            nextName = nextData1.DataRows[0].submit_post_name;
          }
          if (nextData1.RetCode === '1') {
            yield put({
              type: 'save',
              payload: {
                nextDataList: nextData1.DataRows,
                nextPostName: nextName
              }
            })
          } else {
            message.error("查询下一环节处理人信息异常");
          }
        }
      }
      //判断为部门经理 
      else if (userRoleData.DataRows[0].absence_role == 'department_mananger') {
        let projectQueryparams1 = {
          arg_dept_id: Cookie.get('dept_id')
        };
        let nextData2 = yield call(absenceService.absenceDepartmentLeaderQueryNest, projectQueryparams1);

        let nextname = '';
        if (nextData2.DataRows.length > 0) {
          nextname = nextData2.DataRows[0].submit_post_name;
        }
        if (nextData2.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              nextDataList: nextData2.DataRows,
              nextPostName: nextname
            }
          })
        } else {
          message.error("查询下一环节处理人信息异常");
        }
      }
      // 判断为分院副院长
      else if (userRoleData.DataRows[0].absence_role == 'vice_leader') {
        let projectQueryparams1 = {
          arg_dept_id: 'e65c0055179e11e6880d008cfa0427c4'
        };
        let nextData2 = yield call(absenceService.absenceDepartmentLeaderQueryNest, projectQueryparams1);

        let nextname = '';
        if (nextData2.DataRows.length > 0) {
          nextname = nextData2.DataRows[0].submit_post_name;
        }
        if (nextData2.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              nextDataList: nextData2.DataRows,
              nextPostName: nextname
            }
          })
        } else {
          message.error("查询下一环节处理人信息异常");
        }
      }

      else {
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
              nextPostName: nextname
            }
          })
        } else {
          message.error("查询下一环节处理人信息异常");
        }
      }
      /* 查询下一环节处理人信息 End */

      /* 查询已保存待办 End */
      if (query.saveViewControl === "none") {
        let projectQueryparams = {
          arg_absence_apply_id: query.absence_apply_id,
          arg_absence_apply_type: '1'
        };
        const personData = yield call(absenceService.absenceBreakOffApplyBasicInfoquery, projectQueryparams);
        if (personData.RetCode === '1') {
          let resultList = personData.DataRows;
          yield put({
            type: 'save',
            payload: {
              defaultDataSource1: query.circulationType === "事假申请" ? [] : resultList,
              saveViewControl: 'none',
              absence_apply_id: query.absence_apply_id,
              circulationType1: query.circulationType1,
              saveTaskId: query.task_id
            }
          })
        } else {
          message.error("没有请假人员信息");
        }
        let projectQueryparams1 = {
          arg_absence_apply_id: query.absence_apply_id,
        };
        const personData1 = yield call(absenceService.defaultYearBreakUse, projectQueryparams1);
        if (personData1.RetCode === '1') {
          let resultList1 = personData1.DataRows;
          yield put({
            type: 'save',
            payload: {
              defaultDataSource2: query.circulationType === "事假申请" ? [] : resultList1,
            }
          })
        } else {
          message.error("没有请假人员信息");
        }
      }
    },
    //保存信息
    * absenceApprovalSave({ basicInfoData, absenceDataList, absence_apply_id, resolve }, { call }) {
      let paramCheckSave = {}
      paramCheckSave["arg_staff_id"] = Cookie.get('userid');
      let postDataDeleteDateBase = {};
      postDataDeleteDateBase["arg_absence_apply_id"] = absence_apply_id;
      postDataDeleteDateBase["arg_status"] = '0';

      let paramCheck1 = {}
      paramCheck1["arg_user_id"] = Cookie.get('userid');
      paramCheck1["arg_absence_type"] = '1';

      const cycleCheckResult1 = yield call(absenceService.absencYearJNInfoCheck, paramCheck1);
      if (cycleCheckResult1.DataRows[0].jh_flag == '1') {
        yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
        message.error("有流转中或者保存状态的单子，不能再提交新的申请");
        rollbackFlag = 1;
        resolve("false");
        return;
      }
      /* 保存humanwork.absence_apply */
      let rollbackFlag = 0;
      const saveBasicInfo = yield call(absenceService.absenceBreakOffApplyBasicInfoSave, basicInfoData);
      if (saveBasicInfo.RetCode === '1') {
        const absenceDataListResult = yield call(absenceService.absenceBreakOffApplyDetailInfoSave, absenceDataList);
        if (absenceDataListResult.RetCode !== '1') {
          yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
          message.success('保存失败');
          resolve("false");
          rollbackFlag = 1;
          return;
        }
        else {
          message.success('保存成功');
          resolve("success");
        }
      } else {
        message.error('保存失败');
        yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
        resolve("false");
        return "false";
      }
    },

    //提交信息
    * absenceApprovalSubmit({ basicInfoData, absenceDataList, approvalData, approvalDataNext, absence_role_info, absence_apply_id, resolve }, { call }) {
      let if_overDate = false;
      if (absenceDataList.arg_absenct_days > 3) {
        if_overDate = true
      }
      if (absence_role_info[0].absence_role == 'in_team_person') {
        /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
        let param = {
          //离职申请启动工作流标识
          start_type: 'break_team_person',
        };
        let listenersrc = '{absence_apply:{arg_procInstId:"${procInstId}",arg_if_overDate:"' + if_overDate + '", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;
        param["form"] = '{overDate:' + if_overDate + '}';
        const absenceFlowStartResult = yield call(absenceService.yearAbsenceInTeamApplyFlowStart, param);
        let absenceFlowStartList = [];
        if (absenceFlowStartResult.RetCode === '1') {
          absenceFlowStartList = absenceFlowStartResult.DataRows[0];
        }
        else {
          message.error('Service absenceFlowStart ' + absenceFlowStartResult.RetVal);
          resolve("false");
          return;
        }
        let proc_inst_id = absenceFlowStartList.procInstId;
        let task_id = absenceFlowStartList.taskId;
        let task_name = absenceFlowStartList.actName;

        //基本信息表leave_apply补全
        basicInfoData["arg_proc_inst_id"] = proc_inst_id;
        //离职申请信息approval补全
        approvalData["arg_task_id"] = task_id;
        approvalData["arg_task_name"] = task_name;

        //用来回滚数据库和工作流
        let postDataDeleteDateBase = {};
        let postDataDeleteFlow = {};
        postDataDeleteDateBase["arg_absence_apply_id"] = absence_apply_id;
        postDataDeleteFlow["procInstId"] = proc_inst_id;
        postDataDeleteDateBase["arg_status"] = '1';

        try {
          let paramCheck1 = {}
          paramCheck1["arg_user_id"] = Cookie.get('userid');
          paramCheck1["arg_absence_type"] = '1';

          const cycleCheckResult1 = yield call(absenceService.absencYearJNInfoCheck, paramCheck1);
          if (cycleCheckResult1.DataRows[0].jh_flag == '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error("有流转中或者保存状态的单子，不能再提交新的申请");
            rollbackFlag = 1;
            resolve("false");
            return;
          }

          let paramCheck = {}
          paramCheck["arg_staff_id"] = Cookie.get('userid');
          paramCheck["arg_absenct_st"] = absenceDataList.arg_absenct_st;
          paramCheck["arg_absenct_et"] = absenceDataList.arg_absenct_et;

          const personCheckResult = yield call(absenceService.absencApplyApprovalInfoPersonalCheck, paramCheck);
          if (personCheckResult.RetVal !== '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error(personCheckResult.RetVal);
            rollbackFlag = 1;
            resolve("false");
            return;
          }
          //回滚标志
          let rollbackFlag = 0;
          let postDataDelete = {};
          postDataDelete["arg_team_apply_id"] = absence_apply_id;
          postDataDelete["arg_status"] = '0';

          const saveBasicInfo = yield call(absenceService.absenceBreakOffApplyBasicInfoSave, basicInfoData);
          if (saveBasicInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          else {
            const absenceDataListResult = yield call(absenceService.absenceBreakOffApplyDetailInfoSave, absenceDataList);
            if (absenceDataListResult.RetCode !== '1') {
              rollbackFlag = 1;
              yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
              yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
              message.error(absenceDataListResult.RetVal);
              resolve("false");
              return;
            }
          }
          /* 保存humanwork.leave_apply_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(absenceService.absencApplyApprovalInfoSave, approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }

          /*调用工作流节点结束服务 Begin */
          param["taskId"] = task_id;
          let listenerSrc = '{absence_apply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
          param["listener"] = listenerSrc;

          let absenceApprovalFlowCompleteList = {};
          const absenceApplyFlowCompleteResult = yield call(absenceService.yearAbsenceInTeamApplyFlowComplete, param);
          if (absenceApplyFlowCompleteResult.RetCode === '1') {
            absenceApprovalFlowCompleteList = absenceApplyFlowCompleteResult.DataRows;
          } else {
            message.error('Service absenceApplyFlowComplete ' + absenceApplyFlowCompleteResult.RetVal);
            resolve("false");
            return;
          }
          let task_id_end = absenceApprovalFlowCompleteList[0] && absenceApprovalFlowCompleteList[0].taskId;
          let task_name_end = absenceApprovalFlowCompleteList[0] && absenceApprovalFlowCompleteList[0].actName;
          approvalDataNext["arg_task_id"] = task_id_end;
          approvalDataNext["arg_task_name"] = task_name_end;
          /*调用工作流节点结束服务 End */

          /*保存下一节点信息 Begin */
          const approvalDataInfoNext = yield call(absenceService.absenceInfoApprovalSave, approvalDataNext);
          if (approvalDataInfoNext.RetCode !== '1') {

            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /*保存下一节点信息 End */

          if (rollbackFlag === 1) {

            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            resolve("false");
          } else {
            message.success('提交成功');
            resolve("success");
          }
        } catch (e) {
          try {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
          } catch (e1) {
            message.error('回滚失败');
            resolve("false");
          }
        }
      }
      else if (absence_role_info[0].absence_role == 'no_team_person') {
        /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
        let param = {
          //离职申请启动工作流标识
          start_type: 'break_noteam_person',
        };
        let listenersrc = '{absence_apply:{arg_procInstId:"${procInstId}",arg_if_overDate:"' + if_overDate + '", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;
        param["form"] = '{overDate:' + if_overDate + '}';
        const absenceFlowStartResult = yield call(absenceService.yearAbsenceInTeamApplyFlowStart, param);
        let absenceFlowStartList = [];
        if (absenceFlowStartResult.RetCode === '1') {
          absenceFlowStartList = absenceFlowStartResult.DataRows[0];
        }
        else {
          message.error('Service absenceFlowStart ' + absenceFlowStartResult.RetVal);
          resolve("false");
          return;
        }
        let proc_inst_id = absenceFlowStartList.procInstId;
        let task_id = absenceFlowStartList.taskId;
        let task_name = absenceFlowStartList.actName;

        //基本信息表leave_apply补全
        basicInfoData["arg_proc_inst_id"] = proc_inst_id;

        //离职申请信息approval补全
        approvalData["arg_task_id"] = task_id;
        approvalData["arg_task_name"] = task_name;

        //用来回滚数据库和工作流
        let postDataDeleteDateBase = {};
        let postDataDeleteFlow = {};
        postDataDeleteDateBase["arg_absence_apply_id"] = absence_apply_id;
        postDataDeleteFlow["procInstId"] = proc_inst_id;
        postDataDeleteDateBase["arg_status"] = '1';

        try {
          let paramCheck1 = {}
          paramCheck1["arg_user_id"] = Cookie.get('userid');
          paramCheck1["arg_absence_type"] = '1';

          const cycleCheckResult1 = yield call(absenceService.absencYearJNInfoCheck, paramCheck1);
          if (cycleCheckResult1.DataRows[0].jh_flag == '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error("有流转中或者保存状态的单子，不能再提交新的申请");
            rollbackFlag = 1;
            resolve("false");
            return;
          }
          let paramCheck = {}
          paramCheck["arg_staff_id"] = Cookie.get('userid');
          paramCheck["arg_absenct_st"] = absenceDataList.arg_absenct_st;
          paramCheck["arg_absenct_et"] = absenceDataList.arg_absenct_et;

          const personCheckResult = yield call(absenceService.absencApplyApprovalInfoPersonalCheck, paramCheck);
          if (personCheckResult.RetVal !== '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error(personCheckResult.RetVal);
            rollbackFlag = 1;
            resolve("false");
            return;
          }
          //回滚标志
          let rollbackFlag = 0;

          //流程ID为空，或不存着，表示该条记录为保存记录，先删除，后提交，删除时，status为0
          let postDataDelete = {};
          postDataDelete["arg_team_apply_id"] = absence_apply_id;
          postDataDelete["arg_status"] = '0';

          /* 保存humanwork.leave_apply表离职人员basic信息 Begin */
          const saveBasicInfo = yield call(absenceService.absenceBreakOffApplyBasicInfoSave, basicInfoData);
          if (saveBasicInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          else {
            const absenceDataListResult = yield call(absenceService.absenceBreakOffApplyDetailInfoSave, absenceDataList);
            if (absenceDataListResult.RetCode !== '1') {
              rollbackFlag = 1;
              yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
              yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
              message.error(absenceDataListResult.RetVal);
              resolve("false");
              return;
            }
          }
          /* 保存humanwork.leave_apply_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(absenceService.absencApplyApprovalInfoSave, approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /* 保存humanwork.overtime_team_approval表当前节点信息 End  */

          /* 查询下当前申请人角色：普通员工、项目经理/职能线员工 Start */
          //普通员工为true,项目经理，职能线为false
          // let staffFlag = true;

          /*调用工作流节点结束服务 Begin */
          param["taskId"] = task_id;
          let listenerSrc = '{absence_apply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
          param["listener"] = listenerSrc;

          let absenceApprovalFlowCompleteList = {};
          const absenceApplyFlowCompleteResult = yield call(absenceService.yearAbsenceInTeamApplyFlowComplete, param);
          if (absenceApplyFlowCompleteResult.RetCode === '1') {
            absenceApprovalFlowCompleteList = absenceApplyFlowCompleteResult.DataRows;
          } else {
            message.error('Service absenceApplyFlowComplete ' + absenceApplyFlowCompleteResult.RetVal);
            resolve("false");
            return;
          }
          let task_id_end = absenceApprovalFlowCompleteList[0] && absenceApprovalFlowCompleteList[0].taskId;
          let task_name_end = absenceApprovalFlowCompleteList[0] && absenceApprovalFlowCompleteList[0].actName;
          approvalDataNext["arg_task_id"] = task_id_end;
          approvalDataNext["arg_task_name"] = task_name_end;
          /*调用工作流节点结束服务 End */

          /*保存下一节点信息 Begin */
          const approvalDataInfoNext = yield call(absenceService.absenceInfoApprovalSave, approvalDataNext);
          if (approvalDataInfoNext.RetCode !== '1') {

            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /*保存下一节点信息 End */

          if (rollbackFlag === 1) {

            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            resolve("false");
          } else {
            message.success('提交成功');
            resolve("success");
          }
        } catch (e) {
          try {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
          } catch (e1) {
            message.error('回滚失败');
            resolve("false");
          }
        }
      }
      else if (absence_role_info[0].absence_role == 'team_mananger') {
        /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
        let param = {
          //离职申请启动工作流标识
          start_type: 'absence_proj_core',
        };
        const absenceFlowStartResult = yield call(absenceService.yearAbsenceInTeamApplyFlowStart, param);
        let absenceFlowStartList = [];
        if (absenceFlowStartResult.RetCode === '1') {
          absenceFlowStartList = absenceFlowStartResult.DataRows[0];
        }
        else {
          message.error('Service absenceFlowStart ' + absenceFlowStartResult.RetVal);
          resolve("false");
          return;
        }
        let proc_inst_id = absenceFlowStartList.procInstId;
        let task_id = absenceFlowStartList.taskId;
        let task_name = absenceFlowStartList.actName;

        //基本信息表leave_apply补全
        basicInfoData["arg_proc_inst_id"] = proc_inst_id;

        //离职申请信息approval补全
        approvalData["arg_task_id"] = task_id;
        approvalData["arg_task_name"] = task_name;

        //用来回滚数据库和工作流
        let postDataDeleteDateBase = {};
        let postDataDeleteFlow = {};
        postDataDeleteDateBase["arg_absence_apply_id"] = absence_apply_id;
        postDataDeleteFlow["procInstId"] = proc_inst_id;
        postDataDeleteDateBase["arg_status"] = '1';

        try {
          let paramCheck1 = {}
          paramCheck1["arg_user_id"] = Cookie.get('userid');
          paramCheck1["arg_absence_type"] = '1';

          const cycleCheckResult1 = yield call(absenceService.absencYearJNInfoCheck, paramCheck1);
          if (cycleCheckResult1.DataRows[0].jh_flag == '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error("有流转中或者保存状态的单子，不能再提交新的申请");
            rollbackFlag = 1;
            resolve("false");
            return;
          }
          let paramCheck = {}
          paramCheck["arg_staff_id"] = Cookie.get('userid');
          paramCheck["arg_absenct_st"] = absenceDataList.arg_absenct_st;
          paramCheck["arg_absenct_et"] = absenceDataList.arg_absenct_et;

          const personCheckResult = yield call(absenceService.absencApplyApprovalInfoPersonalCheck, paramCheck);
          if (personCheckResult.RetVal !== '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error(personCheckResult.RetVal);
            rollbackFlag = 1;
            resolve("false");
            return;
          }
          //回滚标志
          let rollbackFlag = 0;

          //流程ID为空，或不存着，表示该条记录为保存记录，先删除，后提交，删除时，status为0
          let postDataDelete = {};
          postDataDelete["arg_team_apply_id"] = absence_apply_id;
          postDataDelete["arg_status"] = '0';

          /* 保存humanwork.leave_apply表离职人员basic信息 Begin */
          const saveBasicInfo = yield call(absenceService.absenceBreakOffApplyBasicInfoSave, basicInfoData);
          if (saveBasicInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          else {
            const absenceDataListResult = yield call(absenceService.absenceBreakOffApplyDetailInfoSave, absenceDataList);
            if (absenceDataListResult.RetCode !== '1') {
              rollbackFlag = 1;
              yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
              yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
              message.error(absenceDataListResult.RetVal);
              resolve("false");
              return;
            }
          }
          /* 保存humanwork.leave_apply_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(absenceService.absencApplyApprovalInfoSave, approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /* 保存humanwork.overtime_team_approval表当前节点信息 End  */

          /* 查询下当前申请人角色：普通员工、项目经理/职能线员工 Start */
          //普通员工为true,项目经理，职能线为false
          // let staffFlag = true;

          /*调用工作流节点结束服务 Begin */
          param["taskId"] = task_id;
          let listenerSrc = '{absence_apply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
          param["listener"] = listenerSrc;

          let absenceApprovalFlowCompleteList = {};
          const absenceApplyFlowCompleteResult = yield call(absenceService.yearAbsenceInTeamApplyFlowComplete, param);
          if (absenceApplyFlowCompleteResult.RetCode === '1') {
            absenceApprovalFlowCompleteList = absenceApplyFlowCompleteResult.DataRows;
          } else {
            message.error('Service absenceApplyFlowComplete ' + absenceApplyFlowCompleteResult.RetVal);
            resolve("false");
            return;
          }
          let task_id_end = absenceApprovalFlowCompleteList[0] && absenceApprovalFlowCompleteList[0].taskId;
          let task_name_end = absenceApprovalFlowCompleteList[0] && absenceApprovalFlowCompleteList[0].actName;
          approvalDataNext["arg_task_id"] = task_id_end;
          approvalDataNext["arg_task_name"] = task_name_end;
          /*调用工作流节点结束服务 End */

          /*保存下一节点信息 Begin */
          const approvalDataInfoNext = yield call(absenceService.absenceInfoApprovalSave, approvalDataNext);
          if (approvalDataInfoNext.RetCode !== '1') {

            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /*保存下一节点信息 End */

          if (rollbackFlag === 1) {

            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            resolve("false");
          } else {
            message.success('提交成功');
            resolve("success");
          }
        } catch (e) {
          try {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
          } catch (e1) {
            message.error('回滚失败');
            resolve("false");
          }
        }
      }
      else if (absence_role_info[0].absence_role == 'department_mananger') {
        /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
        let param = {
          //启动工作流标识
          start_type: 'break_department_person',
        };
        const absenceFlowStartResult = yield call(absenceService.yearAbsenceInTeamApplyFlowStart, param);
        let absenceFlowStartList = [];
        if (absenceFlowStartResult.RetCode === '1') {
          absenceFlowStartList = absenceFlowStartResult.DataRows[0];
        }
        else {
          message.error('Service absenceFlowStart ' + absenceFlowStartResult.RetVal);
          resolve("false");
          return;
        }
        let proc_inst_id = absenceFlowStartList.procInstId;
        let task_id = absenceFlowStartList.taskId;
        let task_name = absenceFlowStartList.actName;

        //基本信息表leave_apply补全
        basicInfoData["arg_proc_inst_id"] = proc_inst_id;

        //离职申请信息approval补全
        approvalData["arg_task_id"] = task_id;
        approvalData["arg_task_name"] = task_name;

        //用来回滚数据库和工作流
        let postDataDeleteDateBase = {};
        let postDataDeleteFlow = {};
        postDataDeleteDateBase["arg_absence_apply_id"] = absence_apply_id;
        postDataDeleteFlow["procInstId"] = proc_inst_id;
        postDataDeleteDateBase["arg_status"] = '1';

        try {
          let paramCheck1 = {}
          paramCheck1["arg_user_id"] = Cookie.get('userid');
          paramCheck1["arg_absence_type"] = '1';

          const cycleCheckResult1 = yield call(absenceService.absencYearJNInfoCheck, paramCheck1);
          if (cycleCheckResult1.DataRows[0].jh_flag == '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error("有流转中或者保存状态的单子，不能再提交新的申请");
            rollbackFlag = 1;
            resolve("false");
            return;
          }
          let paramCheck = {}
          paramCheck["arg_staff_id"] = Cookie.get('userid');
          paramCheck["arg_absenct_st"] = absenceDataList.arg_absenct_st;
          paramCheck["arg_absenct_et"] = absenceDataList.arg_absenct_et;

          const personCheckResult = yield call(absenceService.absencApplyApprovalInfoPersonalCheck, paramCheck);
          if (personCheckResult.RetVal !== '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error(personCheckResult.RetVal);
            rollbackFlag = 1;
            resolve("false");
            return;
          }
          //回滚标志
          let rollbackFlag = 0;

          //流程ID为空，或不存着，表示该条记录为保存记录，先删除，后提交，删除时，status为0
          let postDataDelete = {};
          postDataDelete["arg_team_apply_id"] = absence_apply_id;
          postDataDelete["arg_status"] = '0';

          /* 保存humanwork.leave_apply表离职人员basic信息 Begin */
          const saveBasicInfo = yield call(absenceService.absenceBreakOffApplyBasicInfoSave, basicInfoData);
          if (saveBasicInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          else {
            const absenceDataListResult = yield call(absenceService.absenceBreakOffApplyDetailInfoSave, absenceDataList);
            if (absenceDataListResult.RetCode !== '1') {
              rollbackFlag = 1;
              yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
              yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
              message.error(absenceDataListResult.RetVal);
              resolve("false");
              return;
            }
          }
          /* 保存humanwork.leave_apply_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(absenceService.absencApplyApprovalInfoSave, approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /* 保存humanwork.overtime_team_approval表当前节点信息 End  */

          /* 查询下当前申请人角色：普通员工、项目经理/职能线员工 Start */
          //普通员工为true,项目经理，职能线为false
          // let staffFlag = true;

          /*调用工作流节点结束服务 Begin */
          param["taskId"] = task_id;
          let listenerSrc = '{absence_apply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
          param["listener"] = listenerSrc;

          let absenceApprovalFlowCompleteList = {};
          const absenceApplyFlowCompleteResult = yield call(absenceService.yearAbsenceInTeamApplyFlowComplete, param);
          if (absenceApplyFlowCompleteResult.RetCode === '1') {
            absenceApprovalFlowCompleteList = absenceApplyFlowCompleteResult.DataRows;
          } else {
            message.error('Service absenceApplyFlowComplete ' + absenceApplyFlowCompleteResult.RetVal);
            resolve("false");
            return;
          }
          let task_id_end = absenceApprovalFlowCompleteList[0] && absenceApprovalFlowCompleteList[0].taskId;
          let task_name_end = absenceApprovalFlowCompleteList[0] && absenceApprovalFlowCompleteList[0].actName;
          approvalDataNext["arg_task_id"] = task_id_end;
          approvalDataNext["arg_task_name"] = task_name_end;
          /*调用工作流节点结束服务 End */

          /*保存下一节点信息 Begin */
          const approvalDataInfoNext = yield call(absenceService.absenceInfoApprovalSave, approvalDataNext);
          if (approvalDataInfoNext.RetCode !== '1') {

            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /*保存下一节点信息 End */

          if (rollbackFlag === 1) {

            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            resolve("false");
          } else {
            message.success('提交成功');
            resolve("success");
          }
        } catch (e) {
          try {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
          } catch (e1) {
            message.error('回滚失败');
            resolve("false");
          }
        }
      }
      else if (absence_role_info[0].absence_role == 'vice_leader') {
        /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
        let param = {
          //启动工作流标识
          start_type: 'absence_vice_leader',
        };
        const absenceFlowStartResult = yield call(absenceService.yearAbsenceInTeamApplyFlowStart, param);
        let absenceFlowStartList = [];
        if (absenceFlowStartResult.RetCode === '1') {
          absenceFlowStartList = absenceFlowStartResult.DataRows[0];
        }
        else {
          message.error('Service absenceFlowStart ' + absenceFlowStartResult.RetVal);
          resolve("false");
          return;
        }
        let proc_inst_id = absenceFlowStartList.procInstId;
        let task_id = absenceFlowStartList.taskId;
        let task_name = absenceFlowStartList.actName;

        //基本信息表leave_apply补全
        basicInfoData["arg_proc_inst_id"] = proc_inst_id;

        //离职申请信息approval补全
        approvalData["arg_task_id"] = task_id;
        approvalData["arg_task_name"] = task_name;

        //用来回滚数据库和工作流
        let postDataDeleteDateBase = {};
        let postDataDeleteFlow = {};
        postDataDeleteDateBase["arg_absence_apply_id"] = absence_apply_id;
        postDataDeleteFlow["procInstId"] = proc_inst_id;
        postDataDeleteDateBase["arg_status"] = '1';

        try {
          let paramCheck1 = {}
          paramCheck1["arg_user_id"] = Cookie.get('userid');
          paramCheck1["arg_absence_type"] = '1';

          const cycleCheckResult1 = yield call(absenceService.absencYearJNInfoCheck, paramCheck1);
          if (cycleCheckResult1.DataRows[0].jh_flag == '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error("有流转中或者保存状态的单子，不能再提交新的申请");
            rollbackFlag = 1;
            resolve("false");
            return;
          }
          let paramCheck = {}
          paramCheck["arg_staff_id"] = Cookie.get('userid');
          paramCheck["arg_absenct_st"] = absenceDataList.arg_absenct_st;
          paramCheck["arg_absenct_et"] = absenceDataList.arg_absenct_et;

          const personCheckResult = yield call(absenceService.absencApplyApprovalInfoPersonalCheck, paramCheck);
          if (personCheckResult.RetVal !== '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error(personCheckResult.RetVal);
            rollbackFlag = 1;
            resolve("false");
            return;
          }
          //回滚标志
          let rollbackFlag = 0;

          //流程ID为空，或不存着，表示该条记录为保存记录，先删除，后提交，删除时，status为0
          let postDataDelete = {};
          postDataDelete["arg_team_apply_id"] = absence_apply_id;
          postDataDelete["arg_status"] = '0';

          /* 保存humanwork.leave_apply表离职人员basic信息 Begin */
          const saveBasicInfo = yield call(absenceService.absenceBreakOffApplyBasicInfoSave, basicInfoData);
          if (saveBasicInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          else {
            const absenceDataListResult = yield call(absenceService.absenceBreakOffApplyDetailInfoSave, absenceDataList);
            if (absenceDataListResult.RetCode !== '1') {
              rollbackFlag = 1;
              yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
              yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
              message.error(absenceDataListResult.RetVal);
              resolve("false");
              return;
            }
          }
          /* 保存humanwork.leave_apply_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(absenceService.absencApplyApprovalInfoSave, approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /* 保存humanwork.overtime_team_approval表当前节点信息 End  */

          /* 查询下当前申请人角色：普通员工、项目经理/职能线员工 Start */
          //普通员工为true,项目经理，职能线为false
          // let staffFlag = true;

          /*调用工作流节点结束服务 Begin */
          param["taskId"] = task_id;
          let listenerSrc = '{absence_apply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
          param["listener"] = listenerSrc;

          let absenceApprovalFlowCompleteList = {};
          const absenceApplyFlowCompleteResult = yield call(absenceService.yearAbsenceInTeamApplyFlowComplete, param);
          if (absenceApplyFlowCompleteResult.RetCode === '1') {
            absenceApprovalFlowCompleteList = absenceApplyFlowCompleteResult.DataRows;
          } else {
            message.error('Service absenceApplyFlowComplete ' + absenceApplyFlowCompleteResult.RetVal);
            resolve("false");
            return;
          }
          let task_id_end = absenceApprovalFlowCompleteList[0] && absenceApprovalFlowCompleteList[0].taskId;
          let task_name_end = absenceApprovalFlowCompleteList[0] && absenceApprovalFlowCompleteList[0].actName;
          approvalDataNext["arg_task_id"] = task_id_end;
          approvalDataNext["arg_task_name"] = task_name_end;
          /*调用工作流节点结束服务 End */

          /*保存下一节点信息 Begin */
          const approvalDataInfoNext = yield call(absenceService.absenceInfoApprovalSave, approvalDataNext);
          if (approvalDataInfoNext.RetCode !== '1') {

            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /*保存下一节点信息 End */

          if (rollbackFlag === 1) {

            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            resolve("false");
          } else {
            message.success('提交成功');
            resolve("success");
          }
        } catch (e) {
          try {
            /* 回滚功能:工作流 */
            yield call(absenceService.absenceInfoDel, postDataDeleteDateBase);
            yield call(absenceService.yearAbsenceInTeamApplyFlowTerminate, postDataDeleteFlow);
          } catch (e1) {
            message.error('回滚失败');
            resolve("false");
          }
        }
      }
      else {
        message.error('提交失败');
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/absence/absenceIndex/create_affair_absence') {
          dispatch({ type: 'postDatatoCreate', query });
        }
      });
    }
  }
};
