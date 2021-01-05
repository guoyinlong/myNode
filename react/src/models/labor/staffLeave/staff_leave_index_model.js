/**
 * 文件说明：离职index首页model
 * 作者：shiqp3
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-05-19
 */
import Cookie from "js-cookie";
// import {OU_HQ_NAME_CN, OU_NAME_CN} from "../../utils/config";
// import * as hrService from "../../services/hr/hrService";
import * as hrService from "../../../services/hr/hrService";
import * as overtimeService from "../../../services/overtime/overtimeService"
import * as staffLeaveService from "../../../services/labor/staffLeave/staffLeaveService";
import * as contractService from "../../../services/labor/contract/contractService";
import { message } from "antd";
import { routerRedux } from "dva/router";
// import * as overtimeService from "../../services/overtime/overtimeService";
/**/
export default {
  namespace: 'staff_leave_index_model',
  state: {
    // teamDataList: [],
    // approvalHiList: [],
    // personDataList: [],
    // personDataListExport: [],
    // fileDataList:[],
    tableDataList: [],
    infoSearch: [],
    userRoleList: [],
    leaveApplyInfo: {},    //离职申请详细信息
    leaveHandInfo: {},     //离职交接详细信息
    leaveSettleInfo: {},   //离职结算详细信息
    approvalInfoDone: [],  //已经审批过的意见
    approvalInfoTodo: [],   //还没有要审批的
    settleApprovalDetail: [],  //结算审批的历史信息
    //当前人员角色：项目经理、职能线、普通员工
    roleFlag: '',
    projInfo: []
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    *postDataToCreate({ query }, { call, put }) {
      let auth_userid = Cookie.get('userid');
      /* 查询下一环节处理人信息 Begin */
      let projectQueryparams = {};
      projectQueryparams["arg_user_id"] = auth_userid;
      let userProjectData = yield call(staffLeaveService.projectQuery, projectQueryparams);
      //如果存在项目组，但是项目组的mgr_id（项目经理）不为当前用户的userid，即为普通员工
      if (userProjectData.DataRows[0] && userProjectData.DataRows[0].mgr_id !== Cookie.get('userid')) {

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
      //判断为项目经理或者职能线
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
    },



    /**查询离职的已办和待办 */
    *staffLeaveSearchDefault({ arg_type }, { call, put }) {
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
      postData["arg_page_size"] = 50;  //初始化页面显示条数为10
      postData["arg_page_current"] = 1;   //初始化当前页码为1
      postData["arg_user_id"] = auth_userid;
      postData["arg_type"] = arg_type;
      postData["arg_pass"] = Cookie.get('loginpass');

      let data = yield call(staffLeaveService.staffleaveApprovalQuery, postData);
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
      postInfo["arg_page_size"] = 50;
      postInfo["arg_page_current"] = 1;

      const basicInfoData = yield call(hrService.basicInfoQuery, postInfo);
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

    /**首页统一入口 */
    *staffLeaveQuery({ }, { call, put }) {
      /*查询用户角色 Begin*/
      let postInfo = {};
      postInfo["arg_user_id"] = Cookie.get('userid');
      const userRoleData = yield call(overtimeService.queryUserRole, postInfo);
      if (userRoleData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            userRoleList: userRoleData.DataRows,
          }
        });
      } else {
        message.error("查询角色失败");
      }
      /*查询用户角色 End*/

      yield put({
        type: 'staffLeaveSearchDefault',
        arg_type: 1,
      });

    },

    /**查询申请信息，包括离职申请和离职工作,还有*/
    *leaveApplyQuery({ query }, { call, put }) {

      yield put({
        type: 'save',
        payload: {
          leaveApplyInfo: {},
          leaveHandInfo: {},
          leaveSettleInfo: {},
          settleApprovalDetail: []
        }
      });
      let postInfo = {};
      postInfo["arg_apply_id"] = query.task_id;

      postInfo["arg_apply_type"] = query.apply_type;

      const resultData = yield call(staffLeaveService.staffleaveApplyInfoQuery, postInfo);
      /**1申请，2交接，3结算 */
      if (resultData.RetCode === '1') {
        if (query.apply_type === '1') {
          yield put({
            type: 'save',
            payload: {
              leaveApplyInfo: resultData.DataRows[0],
            }
          });
        } else if (query.apply_type === '2') {
          yield put({
            type: 'save',
            payload: {
              leaveHandInfo: resultData.DataRows[0],
            }
          });
        } else if (query.apply_type === '3') {
          yield put({
            type: 'save',
            payload: {
              leaveSettleInfo: resultData.DataRows[0],
            }
          });
        }

      } else {
        message.error("查询离职信息失败");
      }

      //DONE  组装查询的参数
      /**postInfo就是查询参数 */

      /**查询下一步 */
      if (query.apply_type === '1') {
        yield put({
          type: 'postDataToCreate',
          query: {}
        });
      }



      //未提交状态的下，不用查询审批意见
      if (query.status !== '0') {
        yield put({
          type: 'leaveApprovalInfoQuery',
          query: postInfo,
        });
      }

      /**离职结算需要查看审批信息 */
      if (query.apply_type === '3') {
        let userparam = {
          'arg_user_id': Cookie.get('userid'),
          'arg_post_id': '8hh88a9cb3b311e6a01d02429ca3c6ff'
        };
        const userData = yield call(staffLeaveService.checkUserPost, userparam);
        let ifpost = false;
        if (userData.DataRows.length > 0) {
          ifpost = true;
        }

        let param = {
          'arg_quit_settle_id': query.task_id
        };
        const resultData = yield call(staffLeaveService.quitSettleApprovalDetail, param);
        if (resultData.RetCode === '1') {
          //TODO  取dept_id进行判断，中间人只取同一部门的意见，开始人和归档人可以看到全部，处理意见不不用占行
          /**判断当前用户是不是创建用户，或者是最后的归档用户，这种情况下是可以看到所有的审批意见的 */
          if ((Cookie.get('userid') === query.create_person) || (query.status === '2' && Cookie.get('userid') === query.user_id) || ifpost === true) {
            //当前用户是创建用户，不用过滤
            yield put({
              type: 'save',
              payload: {
                settleApprovalDetail: resultData.DataRows,
              }
            });
          } else {
            //中间人只能看自己部门的意见，并做敏感处理
            let result = [];
            for (let i = 0; i < resultData.DataRows.length; i++) {

              //相同部门
              let temp = resultData.DataRows[i];
              temp.user_sign = resultData.DataRows[i].user_name;
              result.push(temp);

            }
            yield put({
              type: 'save',
              payload: {
                settleApprovalDetail: result,
              }
            });

          }


        }
      }

      /**驳回后 阅后即焚 */
      if (query.status === '3' && Cookie.get('userid') === query.create_person) {
        /**删除 */
        let postQuery = {
          'arg_apply_id': query.task_id,
          'arg_status': '9',
          'arg_type': query.apply_type,
          'arg_state': '4'
        };
        const resultData = yield call(staffLeaveService.leaveInfoDelete, postQuery);
        if (resultData.RetCode === '1') {
          message.info("删除成功");
        } else {
          console.log("删除失败");
        }
      }

      /**查看离职交接时，需要查询这个 状态为未提交*/
      if (query.apply_type === '2' && query.status === '0') {
        yield put({
          type: 'initQuery',
          query: {},
        });
      }
    },

    /*离职工作交接 begin*/
    *initQuery({ query }, { call, put }) {
      /* 查询当前申请人角色：普通员工、项目经理/职能线员工 Start */
      //普通员工为true,项目经理，职能线为false
      let roleFlag = '';
      let auth_userid = Cookie.get('userid');
      let projectQueryparams = {};
      projectQueryparams["arg_user_id"] = auth_userid;
      let userProjectData = yield call(staffLeaveService.projectQuery, projectQueryparams);
      //如果存在项目组，但是项目组的mgr_id（项目经理）不为当前用户的userid，即为普通员工
      if (userProjectData.DataRows.length > 0) {
        if (userProjectData.DataRows[0].mgr_id === Cookie.get('userid')) {
          roleFlag = '2';
        }
        else {
          roleFlag = '1';
        }
        yield put({
          type: 'save',
          payload: {
            projInfo: userProjectData.DataRows,
            roleFlag: roleFlag
          }
        })
      } else {
        roleFlag = '3';
        yield put({
          type: 'save',
          payload: {
            roleFlag: roleFlag
          }
        })
      }
      /* 查询下当前申请人角色：普通员工、项目经理/职能线员工 End */
    },


    /**保存离职申请信息 */
    *leaveApplyInfoSave({ query, resolve }, { call, put }) {
      const resultData = yield call(staffLeaveService.staffLeaveApplyInfoSave, query);
      if (resultData.RetCode === '1') {
        message.success("保存成功");
        resolve("true");
        return "true";
      } else {
        message.error("保存失败");
        resolve("false");
        return "false";
      }
    },

    /**保存离职工作信息 */
    *leaveHandInfoSave({ query, resolve }, { call, put }) {
      const resultData = yield call(staffLeaveService.staffLeaveHandInfoSave, query);
      if (resultData.RetCode === '1') {
        message.success("保存成功");
        resolve("true");
        return "true";
      } else {
        message.error("保存失败");
        return "false";
      }
    },

    /**删除离职相关信息，包括离职申请，工作交接，离职结算*/
    *leaveInfoDelete({ query }, { call, put }) {
      const resultData = yield call(staffLeaveService.leaveInfoDelete, query);
      if (resultData.RetCode === '1') {
        message.success("删除成功");
        yield put(
          routerRedux.push('/humanApp/labor/staffLeave_index')
        )

      } else {
        message.error("删除失败");
        yield put(
          routerRedux.push('/humanApp/labor/staffLeave_index')
        )
      }
    },

    /**查询离职申请，工作交接的的审批意见*/
    *leaveApprovalInfoQuery({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          approvalInfoDone: [],
          approvalInfoTodo: []
        }
      });
      const resultData = yield call(staffLeaveService.leaveApprovalInfoQuery, query);
      if (resultData.RetCode === '1') {
        let data = resultData.DataRows;
        let approvalInfoDoneTemp = [];
        let approvalInfoTodoTemp = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].task_type_id === '1') {  //已经审批的
            approvalInfoDoneTemp.push(data[i]);
          } else if (data[i].task_type_id === '2') {  //未审批的
            approvalInfoTodoTemp.push(data[i]);
          }
        }
        yield put({
          type: 'save',
          payload: {
            approvalInfoDone: approvalInfoDoneTemp,
            approvalInfoTodo: approvalInfoTodoTemp
          }
        });
      } else {
        message.error("查询审批意见失败");
      }
    },



    /**清算临时查询信息用， */
    *leaveSettlePrint({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          leaveApplyInfo: {},
          leaveHandInfo: {},
          leaveSettleInfo: {}
        }
      });
      let postInfo = {};
      postInfo["arg_apply_id"] = query.task_id;

      postInfo["arg_apply_type"] = query.apply_type;

      const resultData = yield call(staffLeaveService.staffleaveApplyInfoQuery, postInfo);
      /**1申请，2交接，3清算 */
      if (resultData.RetCode === '1') {
        if (query.apply_type === '1') {
          yield put({
            type: 'save',
            payload: {
              leaveApplyInfo: resultData.DataRows[0],
            }
          });
        } else if (query.apply_type === '2') {
          yield put({
            type: 'save',
            payload: {
              leaveHandInfo: resultData.DataRows[0],
            }
          });
        } else if (query.apply_type === '3') {
          yield put({
            type: 'save',
            payload: {
              leaveSettleInfo: resultData.DataRows[0],
            }
          });
        }

      } else {
        message.error("查询离职信息失败");
      }
    },


    /**查询结算的表格信息 */


    /**---------------------以下为6月27日加上，为了适配这个model------------------ */
    //提交离职申请信息
    *staffLeaveSubmit({ basicLeaveData, approvalData, approvalDataNext, leave_apply_id, resolve }, { call }) {
      /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
      let param = {
        //离职申请启动工作流标识
        start_type: 'leave_apply',
      };
      const staffLeaveFlowStartResult = yield call(staffLeaveService.leaveFlowStart, param);
      let staffLeaveFlowStartList = [];
      if (staffLeaveFlowStartResult.RetCode === '1') {
        staffLeaveFlowStartList = staffLeaveFlowStartResult.DataRows[0];
      }
      else {
        message.error('Service staffLeaveFlowStart ' + staffLeaveFlowStartResult.RetVal);
        resolve("false");
        return;
      }
      let proc_inst_id = staffLeaveFlowStartList.procInstId;
      let task_id = staffLeaveFlowStartList.taskId;
      let task_name = staffLeaveFlowStartList.actName;

      //基本信息表leave_apply补全
      basicLeaveData["arg_proc_inst_id"] = proc_inst_id;
      basicLeaveData["arg_ou_id"] = Cookie.get('OUID');


      //离职申请信息approval补全
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;

      //用来回滚数据库和工作流
      let postDataDeleteDateBase = {};
      let postDataDeleteFlow = {};
      postDataDeleteDateBase["arg_team_apply_id"] = leave_apply_id;
      postDataDeleteFlow["procInstId"] = proc_inst_id;
      postDataDeleteDateBase["arg_status"] = '1';

      try {
        //回滚标志
        let rollbackFlag = 0;
        /*校验离职人员是否已经申请离职，如果存在则提示不允许保存提交  begin*/
        let paramCheck = {}
        paramCheck["arg_staff_id"] = Cookie.get('userid');
        const personCheckResult = yield call(staffLeaveService.leaveApplyCheckPersonInfo, paramCheck);
        //如果已经有申请提交记录，则不允许重复提交，直接退出。
        if (personCheckResult.DataRows[0].result > 1 && personCheckResult.DataRows[0].proc_inst_id !== null) {
          //离职申请表中有一条记录，如果时流转中的，则有proc_inst_id值，无proc_inst_id值即为保存状态，先删除后插入
          message.error(Cookie.get('username') + " 的离职申请已提交，禁止重复提交！请查看离职信息");
          resolve("false");
          return;
        }
        else {
          //流程ID为空，或不存着，表示该条记录为保存记录，先删除，后提交，删除时，status为0
          let postDataDelete = {};
          postDataDelete["arg_team_apply_id"] = leave_apply_id;
          postDataDelete["arg_status"] = '0';
          yield call(staffLeaveService.leaveApplyDelete, postDataDelete);
          /* 保存humanwork.leave_apply表离职人员basic信息 Begin */
          const saveBasicInfo = yield call(staffLeaveService.leaveApplyBasicInfoSave, basicLeaveData);
          if (saveBasicInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(staffLeaveService.leaveApplyDelete, postDataDeleteDateBase);
            /* 回滚功能:工作流 */
            yield call(staffLeaveService.leaveFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /* 保存humanwork.leave_apply表离职人员basic信息 End */

          /* 保存humanwork.leave_apply_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(staffLeaveService.leaveApplyApprovalInfoSave, approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(staffLeaveService.leaveApplyDelete, postDataDeleteDateBase);
            /* 回滚功能:工作流 */
            yield call(staffLeaveService.leaveFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /* 保存humanwork.overtime_team_approval表当前节点信息 End  */
        }
        /*校验离职人员是否已经申请离职，如果存在则提示不允许保存提交  end*/

        /* 查询下当前申请人角色：普通员工、项目经理/职能线员工 Start */
        //普通员工为true,项目经理，职能线为false
        let staffFlag = true;
        let auth_userid = Cookie.get('userid');
        let projectQueryparams = {};
        projectQueryparams["arg_user_id"] = auth_userid;
        let userProjectData = yield call(staffLeaveService.projectQuery, projectQueryparams);
        //如果存在项目组，但是项目组的mgr_id（项目经理）不为当前用户的userid，即为普通员工
        if (userProjectData.DataRows.length > 0) {
          if (userProjectData.DataRows[0].mgr_id === Cookie.get('userid')) {
            staffFlag = false;
          }
        } else {
          staffFlag = false;
        }
        /* 查询下当前申请人角色：普通员工、项目经理/职能线员工 End */

        /*调用工作流节点结束服务 Begin */
        param["taskId"] = task_id;
        let listenerSrc = '{leaveapply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenerSrc;
        param["form"] = '{if_person:' + staffFlag + '}';
        let leaveApprovalFlowCompleteList = {};
        const leaveApplyFlowCompleteResult = yield call(staffLeaveService.leaveFlowComplete, param);
        if (leaveApplyFlowCompleteResult.RetCode === '1') {
          leaveApprovalFlowCompleteList = leaveApplyFlowCompleteResult.DataRows;
        } else {
          message.error('Service leaveApplyFlowComplete ' + leaveApplyFlowCompleteResult.RetVal);
          resolve("false");
          return;
        }
        let task_id_end = leaveApprovalFlowCompleteList[0] && leaveApprovalFlowCompleteList[0].taskId;
        let task_name_end = leaveApprovalFlowCompleteList[0] && leaveApprovalFlowCompleteList[0].actName;
        approvalDataNext["arg_task_id"] = task_id_end;
        approvalDataNext["arg_task_name"] = task_name_end;
        /*调用工作流节点结束服务 End */

        /*保存下一节点信息 Begin */
        const approvalDataInfoNext = yield call(staffLeaveService.leaveApplyApprovalInfoSave, approvalDataNext);
        if (approvalDataInfoNext.RetCode !== '1') {
          /* 回滚功能:数据库 */
          yield call(staffLeaveService.leaveApplyDelete, postDataDeleteDateBase);
          /* 回滚功能:工作流 */
          yield call(staffLeaveService.leaveFlowTerminate, postDataDeleteFlow);
          message.error('提交失败');
          rollbackFlag = 1;
        }
        /*保存下一节点信息 End */

        if (rollbackFlag === 1) {
          /* 回滚功能:数据库 */
          yield call(staffLeaveService.leaveApplyDelete, postDataDeleteDateBase);
          /* 回滚功能:工作流 */
          yield call(staffLeaveService.leaveFlowTerminate, postDataDeleteFlow);
          message.error('提交失败');
          resolve("false");
        } else {
          message.success('提交成功');
          resolve("success");
        }
      } catch (e) {
        /* 回滚功能:数据库 */
        try {
          yield call(staffLeaveService.leaveApplyDelete, postDataDeleteDateBase);
          /* 回滚功能:工作流 */
          yield call(staffLeaveService.leaveApplyDelete, postDataDeleteFlow);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }
    },
    /**查询人员 */
    *personInfoQuery({ query, resolve }, { call, put }) {
      let projectQueryparams = {};
      projectQueryparams["arg_user_id"] = query.nextStepPersonID;
      let personInfo = yield call(staffLeaveService.personInfoQuery, projectQueryparams);
      if (personInfo.DataRows[0]) {
        yield put({
          type: 'save',
          payload: {
            personInfoDetail: personInfo.DataRows,
          }
        })
        resolve("success");
      }
      else {
        resolve("false");
        return;
      }
    },
    //提交工作交接申请
    *leaveHandSubmit({ basicHandOverData, approvalData, approvalDataNext, leave_hand_id, resolve }, { call }) {
      /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
      let param = {
        //离职申请启动工作流标识
        start_type: 'leave_hand',
      };
      const staffHandFlowStartResult = yield call(staffLeaveService.leaveFlowStart, param);
      let staffHandFlowStartList = [];
      if (staffHandFlowStartResult.RetCode === '1') {
        staffHandFlowStartList = staffHandFlowStartResult.DataRows[0];
      }
      else {
        message.error('Service staffHandFlowStart ' + staffHandFlowStartResult.RetVal);
        resolve("false");
        return;
      }
      let proc_inst_id = staffHandFlowStartList.procInstId;
      let task_id = staffHandFlowStartList.taskId;
      let task_name = staffHandFlowStartList.actName;

      //基本信息表leave_apply补全
      basicHandOverData["arg_proc_inst_id"] = proc_inst_id;
      basicHandOverData["arg_ou_id"] = Cookie.get('OUID');


      //离职申请信息approval补全
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;

      //用来回滚数据库和工作流
      let postDataDeleteDateBase = {};
      let postDataDeleteFlow = {};
      postDataDeleteDateBase["arg_leave_hand_id"] = leave_hand_id;
      postDataDeleteFlow["procInstId"] = proc_inst_id;
      postDataDeleteDateBase["arg_status"] = '1';

      try {
        //回滚标志
        let rollbackFlag = 0;
        /*校验离职人员是否已经申请离职，如果存在则提示不允许保存提交  begin*/
        let paramCheck = {}
        paramCheck["arg_staff_id"] = Cookie.get('userid');
        const personCheckResult = yield call(staffLeaveService.leaveHandCheckPersonInfo, paramCheck);

        //如果已经有申请提交记录，则不允许重复提交，直接退出。
        if (personCheckResult.DataRows[0].result > 1 && personCheckResult.DataRows[0].proc_inst_id !== null) {
          //离职申请表中有一条记录，如果时流转中的，则有proc_inst_id值，无proc_inst_id值即为保存状态，先删除后插入
          message.error(Cookie.get('username') + " 的离职工作交接已提交，禁止重复提交！请查看离职信息");
          resolve("false");
          return;
        }
        else {
          //流程ID为空，或不存着，表示该条记录为保存记录，先删除，后提交，删除时，status为0
          let postDataDelete = {};
          postDataDelete["arg_leave_hand_id"] = leave_hand_id;
          postDataDelete["arg_status"] = '0';
          yield call(staffLeaveService.leaveHandDelete, postDataDelete);
          /* 保存humanwork.leave_apply表离职人员basic信息 Begin */
          const saveBasicInfo = yield call(staffLeaveService.leaveHandBasicInfoSave, basicHandOverData);
          if (saveBasicInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(staffLeaveService.leaveHandDelete, postDataDeleteDateBase);
            /* 回滚功能:工作流 */
            yield call(staffLeaveService.leaveFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /* 保存humanwork.leave_apply表离职人员basic信息 End */

          /* 保存humanwork.leave_apply_approval表当前节点信息 Begin  */
          const approvalDataInfo = yield call(staffLeaveService.leaveHandApprovalInfoSave, approvalData);
          if (approvalDataInfo.RetCode !== '1') {
            /* 回滚功能:数据库 */
            yield call(staffLeaveService.leaveHandDelete, postDataDeleteDateBase);
            /* 回滚功能:工作流 */
            yield call(staffLeaveService.leaveFlowTerminate, postDataDeleteFlow);
            message.error('提交失败');
            rollbackFlag = 1;
          }
          /* 保存humanwork.overtime_team_approval表当前节点信息 End  */
        }
        /*校验离职人员是否已经申请离职，如果存在则提示不允许保存提交  end*/

        /*调用工作流节点结束服务 Begin */
        param["taskId"] = task_id;
        let listenerSrc = '{leavehand:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';
        param["listener"] = listenerSrc;
        let leaveApprovalFlowCompleteList = {};
        const leaveApplyFlowCompleteResult = yield call(staffLeaveService.leaveFlowComplete, param);
        if (leaveApplyFlowCompleteResult.RetCode === '1') {
          leaveApprovalFlowCompleteList = leaveApplyFlowCompleteResult.DataRows;
        } else {
          message.error('Service leaveApplyFlowComplete ' + leaveApplyFlowCompleteResult.RetVal);
          resolve("false");
          return;
        }
        let task_id_end = leaveApprovalFlowCompleteList[0] && leaveApprovalFlowCompleteList[0].taskId;
        let task_name_end = leaveApprovalFlowCompleteList[0] && leaveApprovalFlowCompleteList[0].actName;
        approvalDataNext["arg_task_id"] = task_id_end;
        approvalDataNext["arg_task_name"] = task_name_end;
        /*调用工作流节点结束服务 End */

        /*保存下一节点信息 Begin */
        const approvalDataInfoNext = yield call(staffLeaveService.leaveHandApprovalInfoSave, approvalDataNext);
        if (approvalDataInfoNext.RetCode !== '1') {
          /* 回滚功能:数据库 */
          yield call(staffLeaveService.leaveHandDelete, postDataDeleteDateBase);
          /* 回滚功能:工作流 */
          yield call(staffLeaveService.leaveFlowTerminate, postDataDeleteFlow);
          message.error('提交失败');
          rollbackFlag = 1;
        }
        /*保存下一节点信息 End */

        if (rollbackFlag === 1) {
          /* 回滚功能:数据库 */
          yield call(staffLeaveService.leaveHandDelete, postDataDeleteDateBase);
          /* 回滚功能:工作流 */
          yield call(staffLeaveService.leaveFlowTerminate, postDataDeleteFlow);
          message.error('提交失败');
          resolve("false");
        } else {
          message.success('提交成功');
          resolve("success");
        }
      } catch (e) {
        /* 回滚功能:数据库 */
        try {
          yield call(staffLeaveService.leaveHandDelete, postDataDeleteDateBase);
          /* 回滚功能:工作流 */
          yield call(staffLeaveService.leaveApplyDelete, postDataDeleteFlow);
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      }
    },
    //提交离职清算
    *createLeaveSettle({ orig_apply_task_id, create_person, create_name, core_post, resolve }, { call }) {
      let postData = {};
      try {
        /*  调用工作流开始服务，返回proc_inst_id，post_id_next */
        let param = {};
        if (Cookie.get('OUID') === 'e65c067b179e11e6880d008cfa0427c4') {
          param["businessId"] = 'leave_settle_' + 'jinan';
        }
        if (Cookie.get('OUID') === 'e65c02c2179e11e6880d008cfa0427c4') {
          param["businessId"] = 'leave_settle';
        }
        if (Cookie.get('OUID') === '768d61845de711e89f90782bcb561704') {
          param["businessId"] = 'leave_settle_' + 'xian';
        }
        if (Cookie.get('OUID') === 'e65c072a179e11e6880d008cfa0427c4') {
          param["businessId"] = 'leave_settle_' + 'haerbin';
        }
        if (Cookie.get('OUID') === '96ff4eb55de811e89f90782bcb561704') {
          param["businessId"] = 'leave_settle_' + 'jinan';
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
        if (leaveSettleApplyFlowStartResult.RetCode === '1') {
          // 保存基本信息
          let leaveSettleApply = {
            arg_quit_settle_id: orig_apply_task_id,
            arg_proc_inst_id: proc_inst_id,
            arg_create_person: create_person,
            arg_create_name: create_name,
            arg_core_post: core_post,
            arg_status: '1',
            arg_ou_id: Cookie.get('OUID')
          };
          let saveLeaveSettleApply = yield call(staffLeaveService.saveLeaveSettleApply, leaveSettleApply);
          if (saveLeaveSettleApply.RetCode === '1') {
            // 保存approval表，自动完成第一个节点
            let leaveSettleApproval = {
              arg_proc_inst_id: proc_inst_id,
              arg_quit_settle_id: orig_apply_task_id,
              arg_task_id: task_id,
              arg_task_name: task_name,
              arg_dept_level: '-1',
              arg_state: '1',
              arg_user_id: Cookie.get('userid'),
              arg_user_name: Cookie.get('username'),
              arg_comment_detail: Cookie.get('username'),
              arg_isDeptMgr: '0'
            };
            let saveLeaveSettleApproval = yield call(staffLeaveService.saveLeaveSettleApproval, leaveSettleApproval);
            // 获取下一节点处理人，并生成第二节点的待办
            if (saveLeaveSettleApproval.RetCode === '1') {
              let param = {};
              param["taskId"] = task_id;
              param["listener"] = '{leavesettle:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"},' +
                'enddelete:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"' + Cookie.get('dept_id') + '",arg_companyid:"' + Cookie.get('OUID') + '"}}';

              param["form"] = '{if_center:' + core_post + '}';
              let flowCompleteData = yield call(overtimeService.overtimeFlowComplete, param);
              if (flowCompleteData.RetCode === '1') {
                // 遍历flowCompleteData取出taskId
                let flowCompleteDataArray = flowCompleteData.DataRows;
                for (let j = 0; j < flowCompleteDataArray.length; j++) {
                  let taskIdStr = flowCompleteDataArray[j].taskId;
                  // 获取下一环节处理人，可能是多个
                  let nextStepParams = {
                    arg_proc_inst_id: proc_inst_id,
                    arg_task_id: flowCompleteDataArray[j].actName
                  }
                  let nextData = yield call(overtimeService.nextPersonListQuery, nextStepParams);
                  if (nextData.RetCode === '1') {
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
                        arg_dept_id: nextPersonInfo.dept_id,
                        arg_dept_name: nextPersonInfo.dept_name,
                        arg_dept_level: nextPersonInfo.dept_id,
                        arg_current_task_id: task_id
                      }
                      let updateCompleteData = yield call(staffLeaveService.leaveSettleApproval, leaveSettleApproval1);
                      if (updateCompleteData.RetCode === '1') {
                        message.info('提交成功');
                        resolve("success");
                      } else {
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
                  else {
                    /* 回滚功能:数据库 */
                    yield call(staffLeaveService.leaveSettleApplyDelete, postData);
                    /* 回滚功能:工作流 */
                    yield call(overtimeService.overtimeFlowTerminate, postData);
                    message.error('工作流下一节点处理人获取失败');
                    resolve("false");
                    return;
                  }
                }
              }
              else {
                /* 回滚功能:数据库 */
                yield call(staffLeaveService.leaveSettleApplyDelete, postData);
                /* 回滚功能:工作流 */
                yield call(overtimeService.overtimeFlowTerminate, postData);
                message.error('工作流节点complete失败');
                resolve("false");
                return;
              }
            }
            else {
              /* 回滚功能:数据库 */
              yield call(staffLeaveService.leaveSettleApplyDelete, postData);
              /* 回滚功能:工作流 */
              yield call(overtimeService.overtimeFlowTerminate, postData);
              message.error('审批表数据保存失败');
              resolve("false");
              return;
            }
          }
          else {
            /* 回滚功能:数据库 */
            yield call(staffLeaveService.leaveSettleApplyDelete, postData);
            /* 回滚功能:工作流 */
            yield call(overtimeService.overtimeFlowTerminate, postData);
            message.error('申请表数据保存失败');
            resolve("false");
            return;
          }

        }
        else {
          message.error('流程启动失败');
          resolve("false");
          return;

        }
      }
      catch (e) {
        /* 回滚功能:数据库 */
        yield call(staffLeaveService.leaveSettleApplyDelete, postData);
        /* 回滚功能:工作流 */
        yield call(overtimeService.overtimeFlowTerminate, postData);
        message.error('提交异常');
        resolve("false");
        return;
      }

    },
    //删除待办的阅后即焚信息
    *deleteContractApproval({ query }, { call }) {
      let param = {
        arg_apply_id: query.task_id,
        arg_apply_type: query.apply_type,
      };
      yield call(contractService.deleteContractApproval, param);
    },

  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/labor/staffLeave_index') {
          dispatch({ type: 'staffLeaveQuery', query });
        } else if (pathname === '/humanApp/labor/index/CheckLeave') {
          dispatch({ type: 'leaveApplyQuery', query });
        } else if (pathname === "/humanApp/labor/index/CheckworkHandover") {
          dispatch({ type: 'leaveApplyQuery', query });
        } else if (pathname === "/humanApp/labor/index/CheckleaveSettle") {
          dispatch({ type: 'leaveApplyQuery', query });
        } else if (pathname === "/humanApp/labor/index/LeaveSettlePrint") {
          dispatch({ type: 'leaveSettlePrint', query });
        } else if (pathname === "/humanApp/labor/index/LeavePrint") {
          dispatch({ type: 'leaveApplyQuery', query });
        } else if (pathname === "/humanApp/labor/index/HandOverPrint") {
          dispatch({ type: 'leaveApplyQuery', query });
        }
      });

    }
  }
};
