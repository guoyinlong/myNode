/**
 * 作者：晏学义
 * 日期：2019-06-25
 * 邮箱：yanxy65@chinaunicom.cn
 * 功能：离职清算创建
 */
import Cookie from "js-cookie";
import {message} from "antd/lib/index";
import * as staffLeaveService from "../../../services/labor/staffLeave/staffLeaveService";
import * as overtimeService from "../../../services/overtime/overtimeService";

export default {
  namespace: 'createLeaveSettleModel',
  state : {
    dataSource:[],
    taskRecord:'',
    proc_inst_id:'',
    proc_task_id:'',
    apply_task_id:'',
    theEnd:'',
    leaveSettleRecord:{},
  },
  reducers:{
    save(state,action) {
      return { ...state,...action.payload};
    },
  },
  effects: {
    *initLeaveSettleCreateInfo({query}, {put}) {
      yield put({
        type: 'save',
        payload: {
          leaveSettleRecord: query
        }
      });

    },
    *createLeaveSettle({orig_apply_task_id, create_person, create_name, core_post,resolve},{call}){
      let postData = {};
      try {
        /*  调用工作流开始服务，返回proc_inst_id，post_id_next */
        let param = {};
        if(Cookie.get('OUID') === 'e65c067b179e11e6880d008cfa0427c4')
        {
          param["businessId"] = 'leave_settle_' + 'jinan';
        }
        if(Cookie.get('OUID') === 'e65c02c2179e11e6880d008cfa0427c4')
        {
          param["businessId"] = 'leave_settle';
        }
        if(Cookie.get('OUID') === '768d61845de711e89f90782bcb561704')
        {
          param["businessId"] = 'leave_settle_' + 'xian';
        }
        if(Cookie.get('OUID') === 'e65c072a179e11e6880d008cfa0427c4')
        {
          param["businessId"] = 'leave_settle_' + 'haerbin';
        }
        if(Cookie.get('OUID') === '96ff4eb55de811e89f90782bcb561704')
        {
          param["businessId"] = 'leave_settle_' + 'guangzhou';
        }
        if(Cookie.get('OUID') === 'c4fc4494d84811e9a8df0242443e3bbd')
        {
          param["businessId"] = 'leave_settle_' + 'nanjing';
        }

        let leaveSettleApplyFlowStartResult = yield call(staffLeaveService.workFlowStart, param);

        let leaveSettleApplyFlowStartList = [];
        if (leaveSettleApplyFlowStartResult.RetCode === '1') {
          leaveSettleApplyFlowStartList = leaveSettleApplyFlowStartResult.DataRows;
        } else {
          message.error('Service teamOvertimeApplyFlowStart ' + leaveSettleApplyFlowStartResult.RetVal);
          resolve("false");
          return;
        }
        let proc_inst_id = leaveSettleApplyFlowStartList[0] && leaveSettleApplyFlowStartList[0].procInstId;
        let task_id = leaveSettleApplyFlowStartList[0] && leaveSettleApplyFlowStartList[0].taskId;
        let task_name = leaveSettleApplyFlowStartList[0] && leaveSettleApplyFlowStartList[0].actName;
        postData["arg_quit_settle_id"] = orig_apply_task_id;
        postData["procInstId"] = proc_inst_id;
        postData["arg_status"] = '1';
        if( leaveSettleApplyFlowStartResult.RetCode === '1'){
          /*********log*********/
          let flowparam1 = {};
          flowparam1["arg_user_id"] = Cookie.get('userid');
          flowparam1["arg_log_detail"]=JSON.stringify(leaveSettleApplyFlowStartResult);
          yield call(staffLeaveService.flowLogAdd, flowparam1);
          /*********log*********/
          // 保存基本信息
          let leaveSettleApply = {
            arg_quit_settle_id: orig_apply_task_id,
            arg_proc_inst_id:proc_inst_id,
            arg_create_person:create_person,
            arg_create_name:create_name,
            arg_core_post:core_post, 
            arg_status:'1',
            arg_ou_id:Cookie.get('OUID')
          };
          let saveLeaveSettleApply = yield call(staffLeaveService.saveLeaveSettleApply,leaveSettleApply);
          if( saveLeaveSettleApply.RetCode === '1'){
            // 保存approval表，自动完成第一个节点
            let leaveSettleApproval = {
              arg_proc_inst_id: proc_inst_id,
              arg_quit_settle_id: orig_apply_task_id,
              arg_task_id: task_id,
              arg_task_name: task_name,
              arg_dept_level: '-1',
              arg_state:'1',
              arg_user_id: Cookie.get('userid'),
              arg_user_name: Cookie.get('username'),
              arg_comment_detail:Cookie.get('username'),
              arg_isDeptMgr: '0'
            };
            let saveLeaveSettleApproval = yield call(staffLeaveService.saveLeaveSettleApproval,leaveSettleApproval);
            // 获取下一节点处理人，并生成第二节点的待办
            if( saveLeaveSettleApproval.RetCode === '1'){
              let param = {};
              param["taskId"] = task_id;
              param["listener"] = '{leavesettle:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"},' +
                'enddelete:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';

              param["form"] =  '{if_center:'+core_post+'}';
              let flowCompleteData = yield call(overtimeService.overtimeFlowComplete,param);
              /*********log*********/
              let flowparam2 = {};
              flowparam2["arg_user_id"] = Cookie.get('userid');
              flowparam2["arg_log_detail"]=JSON.stringify(flowCompleteData);
              yield call(staffLeaveService.flowLogAdd, flowparam2);
              /*********log*********/
              let operResult = 0;
              if(flowCompleteData.RetCode === '1')
              {
                // 遍历flowCompleteData取出taskId
                let flowCompleteDataArray = flowCompleteData.DataRows;
                for(let j=0;j < flowCompleteDataArray.length;j++)
                {
                  if(operResult !== 0)
                  {
                    resolve("false");
                    break;
                  }
                  let taskIdStr = flowCompleteDataArray[j].taskId;
                  // 获取下一环节处理人，可能是多个
                  let nextStepParams = {
                    arg_proc_inst_id: proc_inst_id,
                    arg_task_id: flowCompleteDataArray[j].actName
                  }
                  let nextData = yield call(overtimeService.nextPersonListQuery,nextStepParams);
                  if( nextData.RetCode === '1'){
                    let nextDataList = nextData.DataRows;
                    for (let i = 0; i < nextDataList.length; i++) {
                      let nextPersonInfo = nextDataList[i];
                      let leaveSettleApproval1 = {
                        arg_proc_id: proc_inst_id,
                        arg_apply_id: orig_apply_task_id,
                        arg_task_id: taskIdStr,
                        arg_if_end: '0',
                        arg_next_person: nextPersonInfo.submit_user_id,
                        arg_comment_detail: Cookie.get('username'),
                        arg_isDeptMgr: nextPersonInfo.isDeptMgr,
                        arg_current_person: Cookie.get('userid'),
                        arg_dept_id:nextPersonInfo.dept_id,
                        arg_dept_name:nextPersonInfo.dept_name,
                        arg_dept_level: nextPersonInfo.dept_id,
                        arg_current_task_id:task_id
                      }
                      let updateCompleteData = yield call(staffLeaveService.leaveSettleApproval,leaveSettleApproval1);
                      if (updateCompleteData.RetCode !== '1') {
                        operResult = operResult + 1;
                        /* 回滚功能:数据库 */
                        yield call(staffLeaveService.leaveSettleApplyDelete, postData);
                        /* 回滚功能:工作流 */
                        yield call(overtimeService.overtimeFlowTerminate, postData);
                        message.error('提交失败');
                        resolve("false");
                        break;
                      }
                    } 
                  }
                  else
                  {
                    /* 回滚功能:数据库 */
                    yield call(staffLeaveService.leaveSettleApplyDelete, postData);
                    /* 回滚功能:工作流 */
                    yield call(overtimeService.overtimeFlowTerminate, postData);
                    message.error('工作流下一节点处理人获取失败');
                    resolve("false");
                    return;
                  }
                }
                if(operResult === 0)
                {
                  message.info('提交成功');
                  resolve("success");
                }
              }
              else
              {
                /* 回滚功能:数据库 */
                yield call(staffLeaveService.leaveSettleApplyDelete, postData);
                /* 回滚功能:工作流 */
                yield call(overtimeService.overtimeFlowTerminate, postData);
                message.error('工作流节点complete失败');
                resolve("false");
                return;
              }
            }
            else
            {
              /* 回滚功能:数据库 */
              yield call(staffLeaveService.leaveSettleApplyDelete, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error('审批表数据保存失败');
              resolve("false");
              return;
            }
          }
          else
          {
            /* 回滚功能:数据库 */
            yield call(staffLeaveService.leaveSettleApplyDelete, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('申请表数据保存失败');
            resolve("false");
            return;
          }

        }
        else
        {
          message.error('流程启动失败');
          resolve("false");
          return;

        }
      }
      catch(e)
      {
        console.log(" Exception : ");
        /* 回滚功能:数据库 */
        yield call(staffLeaveService.leaveSettleApplyDelete, postData);
        /* 回滚功能:工作流 */
        yield call(overtimeService.overtimeFlowTerminate, postData);
        message.error('提交异常');
        resolve("false");
        return;
      }

    },
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/labor/index/createLeaveSettle') {
          dispatch({ type: 'initLeaveSettleCreateInfo',query });
        }
      });
    }
  }
};
