/**
 * 文件说明：工会慰问审批
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-06-16
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as overtimeService from "../../services/overtime/overtimeService";
import * as sympathyeService from "../../services/laborSympathy/laborSympathyeService";
export default {
  namespace: 'labor_sympathy_approval_model',
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
    fileDataList: [],
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
    *laborSympathyApprovalInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
        }
      });
      // 查询申请人基本信息
      let applyPersonParams = {
        arg_sympathy_apply_id: query.sympathy_apply_id,
        arg_sympathy_type: query.sympathy_type,
      }
      let applyPersonInfo = yield call(sympathyeService.sympathyeInfoSearch, applyPersonParams);
      if (applyPersonInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            applyPersonInfo: applyPersonInfo.DataRows,
          }
        });
      } else {
        message.error("没有数据");
      }
      //查询审批信息
      let params = {
        arg_sympathy_apply_id: query.sympathy_apply_id,
      }
      let approvalinfo = yield call(sympathyeService.sympathyeApprovalInfoSearch, params);
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

      yield put({
        type: 'save',
        payload: {
          fileDataList: [],
        }
      })
      //查询附件列表
      let fileQueryParams = {
        arg_query_id: query.proc_inst_id ? query.proc_inst_id : (query.sympathy_apply_id ? query.sympathy_apply_id : 'temp'),
      };
      let fileData = yield call(sympathyeService.UploadFileListQuery, fileQueryParams);
      if (fileData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            fileDataList: fileData.DataRows,
          }
        })
      }

    },
    *laborSympathyApprovalLookInit({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          proc_inst_id: query.proc_inst_id,
          proc_task_id: query.proc_task_id,
          apply_task_id: query.task_id,
        }
      });
      // 查询申请人基本信息
      let applyPersonParams = {
        arg_sympathy_apply_id: query.sympathy_apply_id,
        arg_sympathy_type: query.sympathy_type,
      }
      let applyPersonInfo = yield call(sympathyeService.sympathyeInfoSearch, applyPersonParams);
      if (applyPersonInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            applyPersonInfo: applyPersonInfo.DataRows,
          }
        });
      } else {
        message.error("没有数据");
      }

      //查询审批信息
      let params = {
        arg_sympathy_apply_id: query.sympathy_apply_id,
      }
      //查询审批信息
      let approvalinfo = yield call(sympathyeService.sympathyeApprovalInfoSearch, params);
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

      //阅后即焚
      let if_reback = query.if_reback;
      if (if_reback === '1') {
        let param = {
          arg_sympathy_apply_id: query.sympathy_apply_id
        };
        yield call(sympathyeService.deleteSympathyeApprovalInfo, param);
      }

      yield put({
        type: 'save',
        payload: {
          fileDataList: [],
        }
      })
      //查询附件列表
      let fileQueryParams = {
        arg_query_id: query.proc_inst_id ? query.proc_inst_id : (query.sympathy_apply_id ? query.sympathy_apply_id : 'temp'),
      };
      let fileData = yield call(sympathyeService.UploadFileListQuery, fileQueryParams);
      if (fileData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            fileDataList: fileData.DataRows,
          }
        })
      }
    },
    // 审批提交
    *laborSympathyApprovalSubmit({ approval_if, approval_advice, apply_id, orig_proc_inst_id, committee_type1, orig_proc_task_id, orig_apply_task_id, nextstepPerson, nextpostid, now_post_name, resolve }, { call }) {
      let committee_type = '';
      if (committee_type1 === '会员生育慰问') {
        committee_type = '0'
      }
      else {
        committee_type = '1'
      }
      if (approval_if == "同意") {
        //调用工作流结下一步
        let param = {};
        param["taskId"] = orig_proc_task_id;
        let listenersrc = '{sympathy_apply:{arg_procInstId:"${procInstId}",  arg_committee_type:"' + committee_type + '",arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '", arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenersrc;
        param["form"] = '{deptid:"' + Cookie.get('OUID') + '"}';

        let flowTerminateData = yield call(sympathyeService.sympathyApplyFlowComplete, param);
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
        let updateCompleteData = yield call(sympathyeService.sympathyUpdateComplete, projectQueryparams);
        if (updateCompleteData.RetCode === '1') {
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
        yield call(sympathyeService.sympathyApplyFlowTerminate, projectQueryparams);
        //调用业务层修改申请状态
        projectQueryparams = {
          arg_apply_id: apply_id,
          arg_comment_detail: approval_advice,
        }
        let updateTerminateData = yield call(sympathyeService.sympathyUpdateTerminate, projectQueryparams);
        if (updateTerminateData.RetCode === '1') {
          message.info('提交成功');
          resolve("success");
        } else {
          message.error('提交失败');
          resolve("false");
        }
      }
    },
    *laborSympathyApprovalEnd({ orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id, nextstepPerson, resolve }, { call }) {
      //调用工作流结下一步
      let projectQueryparams = {
        taskId: orig_proc_task_id,
      }
      let flowTerminateData = yield call(sympathyeService.sympathyApplyFlowComplete, projectQueryparams);
      projectQueryparams = {
        arg_proc_id: orig_proc_inst_id,
        arg_apply_id: orig_apply_task_id,
        arg_proc_type: 3,
        arg_task_id: flowTerminateData.DataRows[0].taskId,
        arg_if_end: 1,
        arg_post_id: '',
        arg_next_person: nextstepPerson,
      }
      let updateCompleteData = yield call(sympathyeService.sympathyUpdateComplete, projectQueryparams);
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
        if (pathname === '/humanApp/laborSympathy/index/labor_sympathy_approval') {
          dispatch({ type: 'laborSympathyApprovalInit', query });
        }
        if (pathname === '/humanApp/laborSympathy/index/labor_sympathy_approval_look') {
          dispatch({ type: 'laborSympathyApprovalLookInit', query });
        }
      });
    }
  }
};
