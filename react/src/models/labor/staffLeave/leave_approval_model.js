/**
 *  作者: 王福江
 *  创建日期: 2019-06-17
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：员工离职审批功能
 */
import Cookie from "js-cookie";
import { message } from "antd";
import * as laborService from "../../../services/labor/staffLeave/staffLeaveService";
import * as overtimeService from "../../../services/overtime/overtimeService";
import * as contractService from "../../../services/labor/contract/contractService";
import * as staffLeaveService from "../../../services/labor/staffLeave/staffLeaveService";

export default {
  namespace: 'leave_approval_model',
  state: {
    approvalApplyInfo: [],
    approvalHandInfo: [],
    approvalList: [],
    approvalHiList: [],
    approvalNowList: [],
    nextPersonList: [],
    create_person: [],
    proc_inst_id: '',
    proc_task_id: '',
    apply_task_id: '',
    create_person_id: '',
    dataInfoList: [],
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },
  effects: {
    *leaveApplyApprovalInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
          create_person_id: query.create_person,
        }
      });
      let params = {
        arg_apply_id: query.task_id,
        arg_apply_type: query.approvalType
      }
      //查询申请信息
      let queryinfo = yield call(laborService.leaveApplyInfoQuery, params);
      if (queryinfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            approvalApplyInfo: queryinfo.DataRows,
          }
        })
      } else {
        message.error("没有数据");
      }
      //查询审批信息
      let approvalinfo = yield call(laborService.leaveApprovalInfoQuery, params);
      if (approvalinfo.RetCode === '1') {
        let approvalHiList = [];
        let approvalNowList = [];
        for (let i = 0; i < approvalinfo.DataRows.length; i++) {
          if (approvalinfo.DataRows[i].task_type_id === '1') {
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);
          } else {
            approvalinfo.DataRows[i].key = i;
            approvalNowList.push(approvalinfo.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            approvalList: approvalinfo.DataRows,
            approvalHiList: approvalHiList,
            approvalNowList: approvalNowList,
          }
        })
      } else {
        message.error("没有数据");
      }
      //查询下一环节处理人
      let personinfo = {
        arg_proc_inst_id: query.proc_inst_id
      };
      let nextData = yield call(overtimeService.nextPersonListQuery, personinfo);
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextPersonList: nextData.DataRows,
            create_person: [{ create_person_id: query.create_person_name, create_person_name: query.create_person_name }],
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
    },
    *ContractRenewApprovalInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
          create_person_id: query.create_person,
        }
      });
      //查询合同信息
      let postData = {};
      postData["arg_contract_apply_id"] = query.task_id;
      const basicInfoData = yield call(contractService.contractApprovalListQuery, postData);
      if (basicInfoData.RetCode === '1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
          basicInfoData.DataRows[i].key = i + 1;
          basicInfoData.DataRows[i].rowKey = i + 1;
          basicInfoData.DataRows[i].major = 10;
          basicInfoData.DataRows[i].attitude = 10;
          basicInfoData.DataRows[i].quality = 10;
          basicInfoData.DataRows[i].attendence = 10;
          basicInfoData.DataRows[i].description = '';
        }
        yield put({
          type: 'save',
          payload: {
            dataInfoList: basicInfoData.DataRows,
          }
        })
      } else {
        message.error("没有合同数据");
      }
      let params = {
        arg_apply_id: query.task_id,
        arg_apply_type: query.approvalType
      }
      //查询审批信息
      let approvalinfo = yield call(laborService.leaveApprovalInfoQuery, params);
      if (approvalinfo.RetCode === '1') {
        let approvalHiList = [];
        let approvalNowList = [];
        for (let i = 0; i < approvalinfo.DataRows.length; i++) {
          if (approvalinfo.DataRows[i].task_type_id === '1') {
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);
          } else {
            approvalinfo.DataRows[i].key = i;
            approvalNowList.push(approvalinfo.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            approvalList: approvalinfo.DataRows,
            approvalHiList: approvalHiList,
            approvalNowList: approvalNowList,
          }
        })
      } else {
        message.error("没有数据");
      }
      //查询下一环节处理人
      let personinfo = {
        arg_proc_inst_id: query.proc_inst_id
      };
      let nextData = yield call(overtimeService.nextPersonListQuery, personinfo);
      if (nextData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nextPersonList: nextData.DataRows,
            create_person: [{ create_person_id: query.create_person_name, create_person_name: query.create_person_name }],
          }
        })
      } else {
        message.error("查询下一环节处理人信息异常");
      }
    },
    *ContractApprovalLookInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
          create_person_id: query.create_person,
        }
      });
      //查询合同信息
      let postData = {};
      postData["arg_contract_apply_id"] = query.task_id;
      const basicInfoData = yield call(contractService.contractApprovalListQuery, postData);
      if (basicInfoData.RetCode === '1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
          basicInfoData.DataRows[i].key = i + 1;
          basicInfoData.DataRows[i].rowKey = i + 1;
          basicInfoData.DataRows[i].major = 10;
          basicInfoData.DataRows[i].attitude = 10;
          basicInfoData.DataRows[i].quality = 10;
          basicInfoData.DataRows[i].attendence = 10;
          basicInfoData.DataRows[i].description = '';
        }
        yield put({
          type: 'save',
          payload: {
            dataInfoList: basicInfoData.DataRows,
          }
        })
      } else {
        message.error("没有合同数据");
      }
      let params = {
        arg_apply_id: query.task_id,
        arg_apply_type: query.approvalType
      }
      //查询审批信息
      let approvalinfo = yield call(laborService.leaveApprovalInfoQuery, params);
      if (approvalinfo.RetCode === '1') {
        let approvalHiList = [];
        let approvalNowList = [];
        for (let i = 0; i < approvalinfo.DataRows.length; i++) {
          if (approvalinfo.DataRows[i].task_type_id === '1') {
            approvalinfo.DataRows[i].key = i;
            approvalHiList.push(approvalinfo.DataRows[i]);
          } else {
            approvalinfo.DataRows[i].key = i;
            approvalNowList.push(approvalinfo.DataRows[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            approvalList: approvalinfo.DataRows,
            approvalHiList: approvalHiList,
            approvalNowList: approvalNowList,
          }
        })
      } else {
        message.error("没有数据");
      }
    },
    *submitApproval({ approval_if, approval_advice, nextstepPerson, nextstep, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id, approval_type, create_person_id, resolve }, { call, put }) {
      let submitparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_apply_id: orig_apply_task_id,
        arg_approval_type: approval_type,
        arg_approval_if: approval_if,
        arg_approval_advice: approval_advice,
        arg_task_id: '',
        arg_if_end: '',
        arg_post_id: '',
        arg_next_person: nextstepPerson,
        arg_nextstep: nextstep
      }
      //最后一步
      if (nextstepPerson === '结束' || nextstepPerson === 'end' || nextstepPerson === '' || nextstepPerson === null) {
        submitparams.arg_if_end = '1';
        let procparams = {
          taskId: orig_proc_task_id,
        }
        yield call(overtimeService.overtimeFlowComplete, procparams);

        let updateCompleteData = yield call(laborService.leaveApprovalOperate, submitparams);
        if (updateCompleteData.RetCode === '1') {
          resolve("success");
          message.info('归档成功');
        } else {
          resolve("false");
          message.error('归档失败');
        }

      } else if (approval_if == "同意") {
        //普通员工为true,项目经理，职能线为false
        let staffFlag = true;
        let projectQueryparams = {};

        if (!(create_person_id === null || create_person_id === '' || create_person_id === undefined)) {
          projectQueryparams["arg_user_id"] = create_person_id;
          let userProjectData = yield call(laborService.projectQuery, projectQueryparams);
          /*日志-start*/
          let flowparam1 = {};
          flowparam1["arg_user_id"] = Cookie.get('userid');
          flowparam1["arg_log_detail"] = JSON.stringify(userProjectData);
          yield call(staffLeaveService.flowLogAdd, flowparam1);
          /*日志-end*/
          //如果存在项目组，但是项目组的mgr_id（项目经理）不为当前用户的userid，即为普通员工
          if (userProjectData.DataRows.length > 0) {
            if (userProjectData.DataRows[0].mgr_id === create_person_id) {
              staffFlag = false;
            }
          } else {
            staffFlag = false;
          }
        }

        //判断是否工作流已经通过
        let checkparam = {};
        checkparam['arg_proc_inst_id'] = orig_proc_inst_id;
        checkparam['arg_nextstep'] = nextstep;
        const checkResultData = yield call(staffLeaveService.checkFlowComplete, checkparam);
        submitparams.arg_if_end = '0';
        let flowTerminateData;
        if (checkResultData.RetVal === '0') {
          let param = {};
          param["taskId"] = orig_proc_task_id;
          let listenersrc = '{leaveapply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"},' +
            'leavehand:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"},' +
            'contractapply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';

          param["listener"] = listenersrc;
          param["form"] = '{deptid:"' + Cookie.get('OUID') + '",if_person:' + staffFlag + '}';

          flowTerminateData = yield call(overtimeService.overtimeFlowComplete, param);
          /*日志-start*/
          let flowparam2 = {};
          flowparam2["arg_user_id"] = Cookie.get('userid');
          flowparam2["arg_log_detail"] = JSON.stringify(flowTerminateData);
          yield call(staffLeaveService.flowLogAdd, flowparam2);
          /*日志-end*/
          submitparams.arg_task_id = flowTerminateData.DataRows[0].taskId;
        } else {
          submitparams.arg_task_id = checkResultData.RetVal;
        }
        //业务层
        try {
          let updateCompleteData = yield call(laborService.leaveApprovalOperate, submitparams);
          /*日志-start*/
          let flowparam3 = {};
          flowparam3["arg_user_id"] = Cookie.get('userid');
          flowparam3["arg_log_detail"] = JSON.stringify(updateCompleteData);
          yield call(staffLeaveService.flowLogAdd, flowparam3);
          /*日志-end*/
          if (updateCompleteData.RetCode === '1') {
            resolve("success");
            message.info('提交成功');
          } else {
            let updateCompleteData2 = yield call(laborService.leaveApprovalOperate, submitparams);
            if (updateCompleteData2.RetCode === '1') {
              resolve("success");
              message.info('提交成功');
            } else {
              resolve("false");
              message.error('提交失败');
            }
          }
        } catch (e) {
          /*日志-start*/
          let flowparam3 = {};
          flowparam3["arg_user_id"] = Cookie.get('userid');
          flowparam3["arg_log_detail"] = e;
          yield call(staffLeaveService.flowLogAdd, flowparam3);
          /*日志-end*/
        }
      } else {//驳回
        submitparams.arg_if_end = '0';
        let projectparams = {
          procInstId: orig_proc_inst_id,
        }
        yield call(overtimeService.overtimeFlowTerminate, projectparams);
        //驳回功能，新增待办
        //yield call(overtimeService.leaveUpdateTerminate,submitparams);

        let updateTerminateData = yield call(laborService.leaveApprovalOperate, submitparams);
        if (updateTerminateData.RetCode === '1') {
          resolve("success");
          message.info('提交成功');
        } else {
          let updateTerminateData2 = yield call(laborService.leaveApprovalOperate, submitparams);
          if (updateTerminateData2.RetCode === '1') {
            resolve("success");
            message.info('提交成功');
          } else {
            resolve("false");
            message.error('提交失败');
          }
        }
      }
    },
    *submitApprovalContract({ approval_if, approval_advice, nextstepPerson, nextstep, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id, approval_type, create_person_id, resolve, contractlist, if_score }, { call, put }) {
      let submitparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_apply_id: orig_apply_task_id,
        arg_approval_type: approval_type,
        arg_approval_if: approval_if,
        arg_approval_advice: approval_advice,
        arg_task_id: '',
        arg_if_end: '',
        arg_post_id: '',
        arg_next_person: nextstepPerson,
        arg_nextstep: nextstep
      }
      //最后一步
      if (nextstepPerson === '结束' || nextstepPerson === 'end' || nextstepPerson === '' || nextstepPerson === null) {
        submitparams.arg_if_end = '1';
        let procparams = {
          taskId: orig_proc_task_id,
        }
        yield call(overtimeService.overtimeFlowComplete, procparams);

        let updateCompleteData = yield call(laborService.leaveApprovalOperate, submitparams);
        if (updateCompleteData.RetCode === '1') {
          resolve("success");
          message.info('归档成功');
        } else {
          resolve("false");
          message.error('归档失败');
        }
      } else if (approval_if == "同意") {
        //普通员工为true,项目经理，职能线为false
        let staffFlag = true;
        let projectQueryparams = {};

        if (!(create_person_id === null || create_person_id === '' || create_person_id === undefined)) {
          projectQueryparams["arg_user_id"] = create_person_id;
          let userProjectData = yield call(laborService.projectQuery, projectQueryparams);
          /*日志-start*/
          let flowparam1 = {};
          flowparam1["arg_user_id"] = Cookie.get('userid');
          flowparam1["arg_log_detail"] = JSON.stringify(userProjectData);
          yield call(staffLeaveService.flowLogAdd, flowparam1);
          /*日志-end*/
          //如果存在项目组，但是项目组的mgr_id（项目经理）不为当前用户的userid，即为普通员工
          if (userProjectData.DataRows.length > 0) {
            if (userProjectData.DataRows[0].mgr_id === create_person_id) {
              staffFlag = false;
            }
          } else {
            staffFlag = false;
          }
        }

        //判断是否工作流已经通过
        let checkparam = {};
        checkparam['arg_proc_inst_id'] = orig_proc_inst_id;
        checkparam['arg_nextstep'] = nextstep;
        const checkResultData = yield call(staffLeaveService.checkFlowComplete, checkparam);
        submitparams.arg_if_end = '0';
        let flowTerminateData;
        if (checkResultData.RetVal === '0') {
          let param = {};
          param["taskId"] = orig_proc_task_id;
          let listenersrc = '{leaveapply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"},' +
            'leavehand:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"},' +
            'contractapply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';

          param["listener"] = listenersrc;
          param["form"] = '{deptid:"' + Cookie.get('OUID') + '",if_person:' + staffFlag + '}';

          flowTerminateData = yield call(overtimeService.overtimeFlowComplete, param);
          /*日志-start*/
          let flowparam2 = {};
          flowparam2["arg_user_id"] = Cookie.get('userid');
          flowparam2["arg_log_detail"] = JSON.stringify(flowTerminateData);
          yield call(staffLeaveService.flowLogAdd, flowparam2);
          /*日志-end*/
          submitparams.arg_task_id = flowTerminateData.DataRows[0].taskId;
        } else {
          submitparams.arg_task_id = checkResultData.RetVal;
        }
        //业务层
        try {
          //工作评议
          if (if_score === true) {
            for (let i = 0; i < contractlist.length; i++) {
              let scoreparam = {
                arg_user_id: contractlist[i].user_id,
                arg_attendence: contractlist[i].attendence,
                arg_major: contractlist[i].major,
                arg_attitude: contractlist[i].attitude,
                arg_quality: contractlist[i].quality,
                arg_description: contractlist[i].description,
                arg_if_pass: contractlist[i].if_pass
              };
              let updateContractScore = yield call(contractService.contractPersonScore, scoreparam);
              if (updateContractScore.RetCode !== '1') {
                resolve("false");
                message.error('提交失败');
                return;
              }
            }
          }

          let updateCompleteData = yield call(laborService.leaveApprovalOperate, submitparams);
          /*日志-start*/
          let flowparam3 = {};
          flowparam3["arg_user_id"] = Cookie.get('userid');
          flowparam3["arg_log_detail"] = JSON.stringify(updateCompleteData);
          yield call(staffLeaveService.flowLogAdd, flowparam3);
          /*日志-end*/
          if (updateCompleteData.RetCode === '1') {
            resolve("success");
            message.info('提交成功');
          } else {
            let updateCompleteData2 = yield call(laborService.leaveApprovalOperate, submitparams);
            if (updateCompleteData2.RetCode === '1') {
              resolve("success");
              message.info('提交成功');
            } else {
              resolve("false");
              message.error('提交失败');
              return;
            }
          }

        } catch (e) {
          /*日志-start*/
          let flowparam3 = {};
          flowparam3["arg_user_id"] = Cookie.get('userid');
          flowparam3["arg_log_detail"] = e;
          yield call(staffLeaveService.flowLogAdd, flowparam3);
          /*日志-end*/
        }
      } else {//驳回
        submitparams.arg_if_end = '0';
        let projectparams = {
          procInstId: orig_proc_inst_id,
        }
        yield call(overtimeService.overtimeFlowTerminate, projectparams);
        //驳回功能，新增待办
        //yield call(overtimeService.leaveUpdateTerminate,submitparams);

        let updateTerminateData = yield call(laborService.leaveApprovalOperate, submitparams);
        if (updateTerminateData.RetCode === '1') {
          resolve("success");
          message.info('提交成功');
        } else {
          let updateTerminateData2 = yield call(laborService.leaveApprovalOperate, submitparams);
          if (updateTerminateData2.RetCode === '1') {
            resolve("success");
            message.info('提交成功');
          } else {
            resolve("false");
            message.error('提交失败');
          }
        }
      }
    },

  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/labor/index/leaveApplyApproval') {
          dispatch({ type: 'leaveApplyApprovalInit', query });
        }
        if (pathname === '/humanApp/labor/index/leaveHandApproval') {
          dispatch({ type: 'leaveApplyApprovalInit', query });
        }
        if (pathname === '/humanApp/labor/staffLeave_index/contractRenewApproval') {
          dispatch({ type: 'ContractRenewApprovalInit', query });
        }
        if (pathname === '/humanApp/labor/staffLeave_index/contract_approval_look') {
          dispatch({ type: 'ContractApprovalLookInit', query });
        }
      });
    }
  }
};
