/**
 * 文件说明：请假管理审批
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2020-04-20
 */
import Cookie from 'js-cookie';
import * as absenceService from "../../services/absence/absenceService";
import { routerRedux } from "dva/router";
import { message } from "antd";
import * as overtimeService from "../../services/overtime/overtimeService";
export default {
  namespace: 'absence_approval_model',
  state: {
    //下一环节处理名称及处理人
    nextPersonList: [],
    nextPostName: '',
    create_person: [],
    //传递的参数
    approvalInfoRecord: [],
    //审批信息
    approvalList: [],
    approvalHiList: [],
    approvalNowList: [],
    //参训人员查询
    applyPersonInfo: [],
    personsList: [],
    nextDataList: [],
    nextpostname: '',
    proc_inst_id: '',
    proc_task_id: '',
    apply_task_id: '',
    absenceYearInfo: [],
  },
  reducers: {
    saveDept(state, { deptList: DataRows }) {
      return { ...state, deptList: DataRows };
    },
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },
  effects: {
    // 初始化查询
    *absenceApprovalInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
        }
      });
      // 查询申请人基本信息
      let absence_apply_type1 = '';
      if (query.absence_apply_type === '调休申请') {
        absence_apply_type1 = '0'
      }
      else if (query.absence_apply_type === '年假申请') {
        absence_apply_type1 = '2'
      }
      else if (query.absence_apply_type === '事假申请') {
        absence_apply_type1 = '1'
      }
      let applyPersonParams = {
        arg_absence_apply_id: query.absence_apply_id,
        arg_absence_apply_type: absence_apply_type1,
      }
      let applyPersonInfo = yield call(absenceService.absenceApplyPersonsInfo, applyPersonParams);
      if (applyPersonInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            applyPersonInfo: applyPersonInfo.DataRows,
          }
        });
        /* 查询请假人员信息剩余 Begin */
        yield put({
          type: 'save',
          payload: {
            absenceYearInfo: [],
          }
        })
        let projectQuerApplyyparams = {
          arg_user_id: applyPersonInfo.DataRows[0].create_person_id,
        };
        const personData = yield call(absenceService.absenceYearApplyBasicInfoquery, projectQuerApplyyparams);
        if (personData.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              absenceYearInfo: personData.DataRows,
            }
          })
        } else {
          message.error("没有历史年休假信息");
        }
        /* 查询请假人员信息剩余 End */
      } else {
        message.error("没有数据");
      }

      //查询审批信息
      let params = {
        arg_absence_apply_id: query.absence_apply_id,
      }
      //查询审批信息
      let approvalinfo = yield call(absenceService.absenceApplyApprovalListQuery, params);
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

      //查询请假人员信息
      let personParams = {
        arg_absence_apply_id: query.absence_apply_id,
        arg_absence_apply_type: absence_apply_type1,
      }
      let personInfo = yield call(absenceService.absenceApplyPersons, personParams);
      if (personInfo.RetCode === '1') {
        for (let i = 0; i < personInfo.DataRows.length; i++) {
          personInfo.DataRows[i]['indexID'] = i + 1;
        }
        yield put({
          type: 'save',
          payload: {
            personsList: personInfo.DataRows,
          }
        })
      } else {
        message.error("没有数据");
      };

      //查询下一环节处理人信息
      let projectQueryparams = {
        arg_proc_inst_id: query.proc_inst_id
      };
      let nextData = yield call(overtimeService.nextPersonListQuery, projectQueryparams);
      let nextname = '';
      if (nextData.length > 0) {
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
    },
    *absenceApprovalLookInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
          editAble: query.editAble,
        }
      });
      // 查询申请人基本信息
      let absence_apply_type1 = '';
      if (query.absence_apply_type === '调休申请') {
        absence_apply_type1 = '0'
      }
      else if (query.absence_apply_type === '年假申请') {
        absence_apply_type1 = '2'
      }
      else if (query.absence_apply_type === '事假申请') {
        absence_apply_type1 = '1'
      }
      let applyPersonParams = {
        arg_absence_apply_id: query.absence_apply_id,
        arg_absence_apply_type: absence_apply_type1,
      }
      let applyPersonInfo = yield call(absenceService.absenceApplyPersonsInfo, applyPersonParams);
      if (applyPersonInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            applyPersonInfo: applyPersonInfo.DataRows,
          }
        });
        /* 查询请假人员信息剩余 Begin */
        yield put({
          type: 'save',
          payload: {
            absenceYearInfo: [],
          }
        })
        let projectQuerApplyyparams = {
          arg_user_id: applyPersonInfo.DataRows[0].create_person_id,
        };
        const personData = yield call(absenceService.absenceYearApplyBasicInfoquery, projectQuerApplyyparams);
        if (personData.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              absenceYearInfo: personData.DataRows,
            }
          })
        } else {
          message.error("没有历史年休假信息");
        }
        /* 查询请假人员信息剩余 End */
      } else {
        message.error("没有数据");
      }

      //查询审批信息
      let params = {
        arg_absence_apply_id: query.absence_apply_id,
      }
      //查询审批信息
      let approvalinfo = yield call(absenceService.absenceApplyApprovalListQuery, params);
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

      //查询请假人员信息
      let personParams = {
        arg_absence_apply_id: query.absence_apply_id,
        arg_absence_apply_type: absence_apply_type1,
      }
      let personInfo = yield call(absenceService.absenceApplyPersons, personParams);
      if (personInfo.RetCode === '1') {
        for (let i = 0; i < personInfo.DataRows.length; i++) {
          personInfo.DataRows[i]['indexID'] = i + 1;
        }
        yield put({
          type: 'save',
          payload: {
            personsList: personInfo.DataRows,
          }
        })
      } else {
        message.error("没有数据");
      };

      //阅后即焚
      let if_reback = query.if_reback;
      if (if_reback === '1') {
        let param = {
          arg_absence_apply_id: query.absence_apply_id
        };
        yield call(absenceService.approvalConcel, param);
      }
    },
    // 审批提交
    *absenceApprovalSubmit({ approval_if, approval_advice, orig_proc_inst_id, orig_if_overDate, orig_proc_task_id, orig_apply_task_id, nextstepPerson, nextpostid, rel_absence_days, rel_start_date, rel_end_date, now_post_name, resolve }, { call, put }) {
      let if_overDate = false;

      if (approval_if == "同意") {

        for (let i = 0; i < orig_if_overDate.length; i++) {
          if (orig_if_overDate[i].absence_days > 3) {
            if_overDate = true
            break;
          }
        }
        //调用工作流结下一步
        let param = {};
        param["taskId"] = orig_proc_task_id;
        let listenersrc = '{absence_apply:{arg_procInstId:"${procInstId}", arg_if_overDate:"' + if_overDate + '", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '", arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;
        param["form"] = '{deptid:"' + Cookie.get('OUID') + '",overDate:"' + if_overDate + '"}';
        let flowTerminateData = yield call(overtimeService.overtimeFlowComplete, param);
        let projectQueryparams = {
          arg_proc_id: orig_proc_inst_id,
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: 1,
          arg_task_id: flowTerminateData.DataRows[0].taskId,
          arg_actName: flowTerminateData.DataRows[0].actName,
          arg_if_end: 0,
          arg_post_id: nextpostid,
          arg_next_person: nextstepPerson,
        }
        let updateCompleteData = yield call(absenceService.absenceUpdateComplete, projectQueryparams);
        if (updateCompleteData.RetCode === '1') {
          if (now_post_name == '申请人销假') {
            let backparam = {
              arg_absence_apply_id: orig_apply_task_id,
              arg_absence_type: '0',
              arg_user_id: Cookie.get('userid'),
              arg_absence_real_days: rel_absence_days,
              arg_absence_real_st: rel_start_date,
              arg_absence_real_et: rel_end_date
            }
            yield call(absenceService.absenceBackDate, backparam);
          }
          message.info('提交成功');
          resolve("success");
        } else {
          message.error('提交失败');
          resolve("false");
        }
      } else {
        //调用工作流结束
        let projectQueryparams = {
          procInstId: orig_proc_inst_id,
        }
        yield call(overtimeService.overtimeFlowTerminate, projectQueryparams);
        //调用业务层修改申请状态
        projectQueryparams = {
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: 1,
          arg_comment_detail: approval_advice
        }
        let updateTerminateData = yield call(absenceService.absenceUpdateTerminate, projectQueryparams);
        if (updateTerminateData.RetCode === '1') {
          message.info('提交成功');
          resolve("success");
        } else {
          message.error('提交失败');
          resolve("false");
        }
      }
    },
    *absenceApprovalEnd({ approval_if, approval_advice, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id, nextstepPerson, nextpostid, resolve }, { call, put }) {
      //调用工作流结下一步
      let projectQueryparams = {
        taskId: orig_proc_task_id,
      }
      let flowTerminateData = yield call(overtimeService.overtimeFlowComplete, projectQueryparams);
      projectQueryparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_apply_id: orig_apply_task_id,
        arg_proc_type: 1,
        arg_task_id: flowTerminateData.DataRows[0].taskId,
        arg_if_end: 1,
        arg_post_id: '',
        arg_next_person: nextstepPerson,
      }
      let updateCompleteData = yield call(absenceService.absenceUpdateComplete, projectQueryparams);
      if (updateCompleteData.RetCode === '1') {
        message.info('归档成功');
        resolve("success");
      } else {
        message.error('归档失败');
        resolve("false");
      }
    },
    // 审批提交
    *affairApprovalSubmit({ approval_if, approval_advice, orig_proc_inst_id, orig_if_overDate, orig_proc_task_id, orig_apply_task_id, nextstepPerson, nextpostid, rel_absence_days, rel_start_date, rel_end_date, now_post_name, resolve }, { call }) {
      let if_overDate = false;
      if (approval_if == "同意") {
        if (orig_if_overDate[0].absence_days > 3) {
          if_overDate = true
        }
        //调用工作流结下一步
        let param = {};
        param["taskId"] = orig_proc_task_id;
        let listenersrc = '{absence_apply:{arg_procInstId:"${procInstId}", arg_if_overDate:"' + if_overDate + '", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '", arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;
        param["form"] = '{deptid:"' + Cookie.get('OUID') + '",overDate:"' + if_overDate + '"}';
        let flowTerminateData = yield call(overtimeService.overtimeFlowComplete, param);
        let projectQueryparams = {
          arg_proc_id: orig_proc_inst_id,
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: 1,
          arg_task_id: flowTerminateData.DataRows[0].taskId,
          arg_actName: flowTerminateData.DataRows[0].actName,
          arg_if_end: 0,
          arg_post_id: nextpostid,
          arg_next_person: nextstepPerson,
        }
        let updateCompleteData = yield call(absenceService.absenceUpdateComplete, projectQueryparams);
        if (updateCompleteData.RetCode === '1') {
          if (now_post_name == '申请人销假') {
            let backparam = {
              arg_absence_apply_id: orig_apply_task_id,
              arg_absence_type: '1',
              arg_user_id: Cookie.get('userid'),
              arg_absence_real_days: rel_absence_days,
              arg_absence_real_st: rel_start_date,
              arg_absence_real_et: rel_end_date
            }
            yield call(absenceService.absenceBackDate, backparam);
          }
          message.info('提交成功');
          resolve("success");
        } else {
          message.error('提交失败');
          resolve("false");
        }
      } else {
        //调用工作流结束
        let projectQueryparams = {
          procInstId: orig_proc_inst_id,
        }
        yield call(overtimeService.overtimeFlowTerminate, projectQueryparams);
        //调用业务层修改申请状态
        projectQueryparams = {
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: 1,
          arg_comment_detail: approval_advice
        }
        let updateTerminateData = yield call(absenceService.absenceUpdateTerminate, projectQueryparams);
        if (updateTerminateData.RetCode === '1') {
          message.info('提交成功');
          resolve("success");
        } else {
          message.error('提交失败');
          resolve("false");
        }
      }
    },
    *affairApprovalEnd({ orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id, nextstepPerson, resolve }, { call }) {
      //调用工作流结下一步
      let projectQueryparams = {
        taskId: orig_proc_task_id,
      }
      let flowTerminateData = yield call(overtimeService.overtimeFlowComplete, projectQueryparams);
      projectQueryparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_apply_id: orig_apply_task_id,
        arg_proc_type: 3,
        arg_task_id: flowTerminateData.DataRows[0].taskId,
        arg_if_end: 1,
        arg_post_id: '',
        arg_next_person: nextstepPerson,
      }
      let updateCompleteData = yield call(absenceService.absenceUpdateComplete, projectQueryparams);
      if (updateCompleteData.RetCode === '1') {
        message.info('归档成功');
        resolve("success");
      } else {
        message.error('归档失败');
        resolve("false");
      }
    },
    // 审批提交
    *yearApprovalSubmit({ approval_if, approval_advice, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id, nextstepPerson, nextpostid, rel_absence_days, rel_start_date, rel_end_date, now_post_name, resolve }, { call, put }) {
      if (approval_if == "同意") {
        //调用工作流结下一步
        let param = {};
        param["taskId"] = orig_proc_task_id;
        let listenersrc = '{absence_apply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '", arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;
        param["form"] = '{deptid:"' + Cookie.get('OUID') + '"}';

        let flowTerminateData = yield call(overtimeService.overtimeFlowComplete, param);
        let projectQueryparams = {
          arg_proc_id: orig_proc_inst_id,
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: 1,
          arg_task_id: flowTerminateData.DataRows[0].taskId,
          arg_actName: flowTerminateData.DataRows[0].actName,
          arg_if_end: 0,
          arg_post_id: nextpostid,
          arg_next_person: nextstepPerson,
        }
        let updateCompleteData = yield call(absenceService.absenceUpdateComplete, projectQueryparams);
        if (updateCompleteData.RetCode === '1') {
          if (now_post_name == '申请人销假') {
            let backparam = {
              arg_absence_apply_id: orig_apply_task_id,
              arg_absence_type: '2',
              arg_user_id: Cookie.get('userid'),
              arg_absence_real_days: rel_absence_days,
              arg_absence_real_st: rel_start_date,
              arg_absence_real_et: rel_end_date
            }
            yield call(absenceService.absenceBackDate, backparam);
          }
          message.info('提交成功');
          resolve("success");
        } else {
          message.error('提交失败');
          resolve("false");
        }
      } else {
        //调用工作流结束
        let projectQueryparams = {
          procInstId: orig_proc_inst_id,
        }
        yield call(overtimeService.overtimeFlowTerminate, projectQueryparams);
        //调用业务层修改申请状态
        projectQueryparams = {
          arg_apply_id: orig_apply_task_id,
          arg_proc_type: 1,
          arg_comment_detail: approval_advice
        }
        let updateTerminateData = yield call(absenceService.absenceUpdateTerminate, projectQueryparams);
        if (updateTerminateData.RetCode === '1') {
          message.info('提交成功');
          resolve("success");
        } else {
          message.error('提交失败');
          resolve("false");
        }
      }
    },
    *yearApprovalEnd({ approval_if, approval_advice, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id, nextstepPerson, nextpostid, resolve }, { call, put }) {
      //调用工作流结下一步
      let projectQueryparams = {
        taskId: orig_proc_task_id,
      }
      let flowTerminateData = yield call(overtimeService.overtimeFlowComplete, projectQueryparams);
      projectQueryparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_apply_id: orig_apply_task_id,
        arg_proc_type: 1,
        arg_task_id: flowTerminateData.DataRows[0].taskId,
        arg_if_end: 1,
        arg_post_id: '',
        arg_next_person: nextstepPerson,
      }
      let updateCompleteData = yield call(absenceService.absenceUpdateComplete, projectQueryparams);
      if (updateCompleteData.RetCode === '1') {
        message.info('归档成功');
        resolve("success");
      } else {
        message.error('归档失败');
        resolve("false");
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/absence/absenceIndex/absence_approval') {
          dispatch({ type: 'absenceApprovalInit', query });
        }
        if (pathname === '/humanApp/absence/absenceIndex/affair_approval') {
          dispatch({ type: 'absenceApprovalInit', query });
        }
        if (pathname === '/humanApp/absence/absenceIndex/year_approval') {
          dispatch({ type: 'absenceApprovalInit', query });
        }
        if (pathname === '/humanApp/absence/absenceIndex/year_approval_look') {
          dispatch({ type: 'absenceApprovalLookInit', query });
        }
      });
    }
  }
};
