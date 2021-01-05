/**
 * 作者：晏学义
 * 日期：2019-06-25
 * 邮箱：yanxy65@chinaunicom.cn
 * 功能：离职清算审批
 */
import Cookie from "js-cookie";
import { message } from "antd/lib/index";
import * as staffLeaveService from "../../../services/labor/staffLeave/staffLeaveService";
import * as overtimeService from "../../../services/overtime/overtimeService";
import * as contractService from "../../../services/labor/contract/contractService";

export default {
  namespace: 'quit_settle_approval_model',
  state: {
    dataSource: [],
    taskRecord: '',
    proc_inst_id: '',
    proc_task_id: '',
    apply_task_id: '',
    theEnd: '',
    quitTeamInfo: '',
    quitTeam: '',
    leaveTime: ''
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    * quitSettleApprovalInitSearch({ query }, { call, put }) {
      let taskRecord = {};
      let theEnd = '';
      taskRecord["step"] = query.step;
      taskRecord["user_name"] = query.user_name;
      taskRecord["create_name"] = query.create_name;
      taskRecord["create_person_id"] = query.create_person;
      taskRecord["deptName"] = query.deptName;
      taskRecord["post_name"] = query.post_name;
      taskRecord["position_title"] = query.position_title;
      taskRecord["core_post"] = query.core_post;
      taskRecord["leave_time"] = query.leave_time;
      taskRecord["create_proj"] = query.create_proj;
      if (query.step === '人力资源专员归档') {
        theEnd = '1';
        const quitSettleApproval = yield call(staffLeaveService.quitSettleApprovalDetail, query);
        let dataSource = [];
        let deptArray = [];
        //let userNameArray = [];
        let deptMgrArray = [];
        let clearArray = [];
        let i = 1;
        if (quitSettleApproval.RetCode === '1') {
          let result = quitSettleApproval.DataRows;
          result.map((item) => {
            if (clearArray.indexOf(item.dept_id) <= -1) {
              deptArray = [];
              //userNameArray = [];
              deptMgrArray = [];
              clearArray.push(item.dept_id);
            }
            let quitSettleApprovalRecord = {};
            quitSettleApprovalRecord["key"] = i;
            quitSettleApprovalRecord["quit_settle_id"] = item.quit_settle_id;
            quitSettleApprovalRecord["proc_inst_id"] = item.proc_inst_id;
            quitSettleApprovalRecord["dept_id"] = item.dept_id;
            quitSettleApprovalRecord["dept_name"] = item.dept_name;
            quitSettleApprovalRecord["task_id"] = item.task_id;
            quitSettleApprovalRecord["task_name"] = item.task_name;
            quitSettleApprovalRecord["comment_time"] = item.comment_time;
            quitSettleApprovalRecord["user_id"] = item.user_id;
            quitSettleApprovalRecord["user_name"] = item.user_name;
            quitSettleApprovalRecord["user_sign"] = item.user_sign;
            quitSettleApprovalRecord["dept_mgr_id"] = item.dept_mgr_id;
            quitSettleApprovalRecord["dept_mgr"] = item.dept_mgr;
            quitSettleApprovalRecord["dept_mgr_sign"] = item.dept_mgr_sign;
            quitSettleApprovalRecord["dept_mgr_comment_time"] = item.dept_mgr_comment_time;
            if (item.user_sign === '' || item.user_sign === null) {
              quitSettleApprovalRecord["isEdit"] = '1';
            }
            if (item.dept_mgr_sign === '' || item.dept_mgr_sign === null) {
              quitSettleApprovalRecord["isDeptEdit"] = '1';
            }
            if (deptArray.indexOf(item.dept_id) > -1) {
              quitSettleApprovalRecord["deptnameRowSpan"] = 0;
            }
            else {
              quitSettleApprovalRecord["deptnameRowSpan"] = item.deptSpanValue;
              deptArray.push(item.dept_id);
            }
            /* if(userNameArray.indexOf(item.user_id) > -1)
            {
              quitSettleApprovalRecord["usernameRowSpan"] = 0;
              quitSettleApprovalRecord["usersignRowSpan"] = 0;
            }
            else
            { */
            quitSettleApprovalRecord["usernameRowSpan"] = 1;
            quitSettleApprovalRecord["usersignRowSpan"] = 1;
            /*userNameArray.push(item.user_id);
          }*/
            if (deptMgrArray.indexOf(item.dept_mgr) > -1) {
              quitSettleApprovalRecord["deptmgrRowSpan"] = 0;
              quitSettleApprovalRecord["deptmgrsignRowSpan"] = 0;
            }
            else {
              quitSettleApprovalRecord["deptmgrRowSpan"] = item.deptMgrSpanValue;
              quitSettleApprovalRecord["deptmgrsignRowSpan"] = item.deptMgrSpanValue;
              deptMgrArray.push(item.dept_mgr);
            }
            dataSource.push(quitSettleApprovalRecord);
            i = i + 1;
          });
          yield put({
            type: 'save',
            payload: {
              dataSource: dataSource,
              taskRecord: taskRecord,
              proc_inst_id: query.proc_inst_id,
              proc_task_id: query.proc_task_id,
              apply_task_id: query.task_id,
              theEnd: theEnd
            }
          });
        } else {
          message.error("没有查询到审批记录");
        }

        //调用外围服务，查询当前日期是否已做完变动统计维护，未做完：0，已完成：1
        let queryUserParam = {
          arg_userId: query.create_person
        }
        const checkUserLeavingTeamQuery = yield call(staffLeaveService.checkUserLeavingTeam, queryUserParam);
        if (checkUserLeavingTeamQuery.RetCode === '1') {
          if (checkUserLeavingTeamQuery.RetVal === '已完成退出团队操作') {
            yield put({
              type: 'save',
              payload: {
                quitTeam: '1',
                quitTeamInfo: checkUserLeavingTeamQuery.RetVal
              }
            });
          } else {
            yield put({
              type: 'save',
              payload: {
                quitTeam: '0',
                quitTeamInfo: checkUserLeavingTeamQuery.RetVal
              }
            });
          }

        }
        //调用外围一个服务接口3，获取当前离职员工是否已完成项目团队退出流程
        let queryParam = {
          arg_ou: Cookie.get("OU"),
        }
        const quitLeaveConfirmTime = yield call(staffLeaveService.quitLeaveConfirmTimeQuery, queryParam);
        if (quitLeaveConfirmTime.RetCode === '1') {
          if (quitLeaveConfirmTime.DataRows && quitLeaveConfirmTime.DataRows[0]) {
            yield put({
              type: 'save',
              payload: {
                leaveTime: quitLeaveConfirmTime.DataRows
              }
            });
          }
        } else {
          message.error("查询失败，请联系管理员查看失败原因！");
          return;
        }
      }
      else {
        theEnd = '0';
        /*调用service查询审批信息*/
        const quitSettleApproval = yield call(staffLeaveService.quitSettleApprovalQuery, query);
        if (quitSettleApproval.RetCode === '1') {
          let dataSource = [];
          let i = 1;
          let result = quitSettleApproval.DataRows;
          let isDeptMgr = '';
          result.map((item) => {
            isDeptMgr = item.isDeptMgr;
          });
          result.map((item) => {
            let quitSettleApprovalRecord = {};
            quitSettleApprovalRecord["key"] = i;
            quitSettleApprovalRecord["quit_settle_id"] = item.quit_settle_id;
            quitSettleApprovalRecord["proc_inst_id"] = item.proc_inst_id;
            quitSettleApprovalRecord["dept_id"] = item.dept_id;
            quitSettleApprovalRecord["dept_name"] = item.dept_name;
            quitSettleApprovalRecord["task_id"] = item.task_id;
            quitSettleApprovalRecord["task_name"] = item.task_name;
            quitSettleApprovalRecord["comment_time"] = item.comment_time;
            quitSettleApprovalRecord["user_id"] = item.user_id;
            quitSettleApprovalRecord["user_name"] = item.user_name;
            quitSettleApprovalRecord["user_sign"] = item.user_sign;
            if ((item.user_sign === '' || item.user_sign === null) && Cookie.get('username') === item.user_name && query.proc_task_id === item.task_id) {
              quitSettleApprovalRecord["isEdit"] = '1';
              quitSettleApprovalRecord["user_sign"] = item.user_sign;
            }
            if (item.user_sign !== '' && item.user_sign !== null) {
              if (isDeptMgr === '1' || Cookie.get('username') === item.user_name) {
                quitSettleApprovalRecord["user_sign"] = item.user_sign;
              }
              else {
                quitSettleApprovalRecord["user_sign"] = item.user_name;
              }
            }
            dataSource.push(quitSettleApprovalRecord);
            i = i + 1;
          });
          yield put({
            type: 'save',
            payload: {
              dataSource: dataSource,
              taskRecord: taskRecord,
              proc_inst_id: query.proc_inst_id,
              proc_task_id: query.proc_task_id,
              apply_task_id: query.task_id,
              theEnd: theEnd
            }
          });
        } else {
          message.error("没有查询到审批记录");
        }
      }
    },

    *quitSettleApproval({ approval_advice, orig_proc_inst_id, orig_proc_task_id, orig_apply_task_id, theEnd, core_post, org_leave_time, create_person_id, resolve }, { call }) {
      //调用工作流结下一步
      try {
        let param = {};
        param["taskId"] = orig_proc_task_id;
        param["listener"] = '{leavesettle:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"},' +
          'enddelete:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["form"] = '{if_center:' + core_post + '}';
        let flowCompleteData = yield call(overtimeService.overtimeFlowComplete, param);
        /*********log*********/
        let flowparam1 = {};
        flowparam1["arg_user_id"] = Cookie.get('userid');
        flowparam1["arg_log_detail"] = JSON.stringify(flowCompleteData);
        yield call(staffLeaveService.flowLogAdd, flowparam1);
        /*********log*********/
        let operResult = 0;
        // 获取下一环节处理人，可能是多个
        if (flowCompleteData.RetCode === '1') {
          // 遍历flowCompleteData取出taskId
          let flowCompleteDataArray = flowCompleteData.DataRows;
          for (let j = 0; j < flowCompleteDataArray.length; j++) {
            if (operResult !== 0) {
              resolve("false");
              break;
            }
            let taskIdStr = flowCompleteDataArray[j].taskId;
            // 如果taskid为空说明没有下一环节处理人
            // 没有下一步处理人，说明多个环节并行，需要都完成后才能推到下一环节
            if (taskIdStr === '' || taskIdStr === null || taskIdStr === undefined) {
              let projectQueryparams = {
                arg_proc_id: orig_proc_inst_id,
                arg_apply_id: orig_apply_task_id,
                arg_task_id: '',
                arg_if_end: theEnd,
                arg_next_person: '',
                arg_comment_detail: approval_advice,
                arg_isDeptMgr: '',
                arg_current_person: Cookie.get('userid'),
                arg_current_task_id: orig_proc_task_id
              };
              let updateCompleteData = yield call(staffLeaveService.leaveSettleApproval, projectQueryparams);
              if (updateCompleteData.RetCode !== '1') {
                operResult = operResult + 1;
              }
            } else {
              let nextStepParams = {
                arg_proc_inst_id: orig_proc_inst_id,
                arg_task_id: flowCompleteDataArray[j].actName
              };
              let nextData = yield call(overtimeService.nextPersonListQuery, nextStepParams);
              // 下一步处理人查询逻辑：如果有下一步处理，则nextData.RetCode为1，否则为0
              if (nextData.RetCode === '1') {
                let nextDataList = nextData.DataRows;
                // nextDataList不存在情况
                for (let i = 0; i < nextDataList.length; i++) {
                  let nextPersonInfo = nextDataList[i];
                  let projectQueryparams = {
                    arg_proc_id: orig_proc_inst_id,
                    arg_apply_id: orig_apply_task_id,
                    arg_task_id: taskIdStr,
                    arg_if_end: theEnd,
                    arg_next_person: nextPersonInfo.submit_user_id,
                    arg_comment_detail: approval_advice,
                    arg_isDeptMgr: nextPersonInfo.isDeptMgr,
                    arg_current_person: Cookie.get('userid'),
                    arg_dept_id: nextPersonInfo.dept_id,
                    arg_dept_level: nextPersonInfo.dept_id,
                    arg_dept_name: nextPersonInfo.dept_name,
                    arg_current_task_id: orig_proc_task_id
                  };
                  let updateCompleteData = yield call(staffLeaveService.leaveSettleApproval, projectQueryparams);
                  if (updateCompleteData.RetCode !== '1') {
                    operResult = operResult + 1;
                  }
                }
              }
            }
          }
          if (operResult === 0) {
            if (theEnd === '1') {
              let backFlag = '0';
              //人力资源专员归档后，需要调用外围一个服务接口2，将离职人员userid与离职日期传送过去，以便人力管理模块对该员工删除账号操作。
              let deleteStaffId = {
                arg_employType: '离职',
                arg_updateby: Cookie.get('userid'),
                arg_userId: create_person_id,
                arg_leave_si_time: org_leave_time,
              };
              let deleteStaffQuery = yield call(staffLeaveService.deleteStaffId, deleteStaffId);
              if (deleteStaffQuery.RetCode === '1') {
                backFlag = '1';
                message.info("离职人员用户信息删除成功！");
              }

              //人力资源专员归档后，将该员工的劳动合同信息状态置为无效，修改contract_detail状态
              let deleteContract = {
                arg_user_id: create_person_id,
              };
              let contractPersonEffectiveQuery = yield call(contractService.contractPersonEffective, deleteContract);
              if (contractPersonEffectiveQuery.RetCode === '1') {
                backFlag = '1';
                message.info("离职人员合同信息删除成功！");
              }
              if (backFlag === '1') {
                message.info('提交成功');
                resolve("success");
              }
            } else {
              message.info('提交成功');
              resolve("success");
            }

          } else {
            // 异常回滚
            message.error('提交异常');
            resolve("false");
          }
        } else {
          // 异常回滚
          message.error('提交异常');
          resolve("false");
        }
      }
      catch (e) {
        /* 异常回滚：
        * 1.调用工作流节点回退接口
        * 2.重新生成quit_settle_approval,quit_settle_approval_done,quit_settle_approval_history表的数据：
        * if arg_if_end = '0' then
        *   a.删除quit_settle_approval，quit_settle_approval_done表数据，条件：arg_next_person，quit_settle_id，arg_task_id
        *   a.quit_settle_approval_history表数据挪到quit_settle_approval表后清空comment_detail，comment_time；条件arg_current_person,arg_current_task_id,quit_settle_id
        *   b.将quit_settle_approval表数据挪到quit_settle_approval_done表
        *   c.删除quit_settle_approval_history表
        * else
        *   a.删除quit_settle_approval，quit_settle_approval_done表数据，条件：arg_current_person，quit_settle_id
        *   a.quit_settle_approval_history表数据挪到quit_settle_approval表后清空comment_detail，comment_time；条件arg_current_person,arg_current_task_id,quit_settle_id
        *   b.将quit_settle_approval表数据挪到quit_settle_approval_done表
        *   c.删除quit_settle_approval_history表
        *   d.更新quit_settle_apply表状态为1
        *
        *
        *
        */
        message.error('提交异常');
        resolve("false");
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/labor/index/quit_settle_approval') {
          dispatch({ type: 'quitSettleApprovalInitSearch', query });
        }
      });
    }
  }
};
