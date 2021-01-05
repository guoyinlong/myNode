/**
 * 文件说明：创建离职申请、离职交接、离职清算流程
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-06-14
 */
import * as overtimeService from "../../../services/overtime/overtimeService";
import * as staffLeaveService from "../../../services/labor/staffLeave/staffLeaveService";
import {message} from "antd";
import Cookie from "js-cookie";

export default {
  namespace: 'createLeaveModels',
  state : { 
    //下一环节处理名称及处理人
    nextDataList: [],
    nextPostName:'',
    //当前人员角色：项目经理、职能线、普通员工
    roleFlag:'',
    projInfo:[],
    //人员详细信息
    personInfoDetail:[]
  },
  reducers:{
    save(state,action) {
      return { ...state,...action.payload};
    },
  },
  effects: {

    /*离职申请 begin*/
    //加班申请创建-查询下一处理人员信息
    *postDataToCreate({query}, {call, put}) {
      let auth_userid = Cookie.get('userid');
      /* 查询下一环节处理人信息 Begin */
      let projectQueryparams = {};
      projectQueryparams["arg_user_id"] = auth_userid;
      let userProjectData = yield call(staffLeaveService.projectQuery, projectQueryparams);
      //如果存在项目组，但是项目组的mgr_id（项目经理）不为当前用户的userid，即为普通员工
      if (userProjectData.DataRows[0] && userProjectData.DataRows[0].mgr_id !== Cookie.get('userid')){

        let nextName = '';
        for(let i=0; i<userProjectData.DataRows.length; i++) {
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
        let nextData = yield call(overtimeService.nextPersonListStartQuery,projectQueryparams);
        let nextname = '';
        if (nextData.DataRows.length>0) {
          nextname = nextData.DataRows[0].submit_post_name;
        }
        if( nextData.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              nextDataList: nextData.DataRows,
              nextPostName: nextname
            }
          })
        }else{
          message.error("查询下一环节处理人信息异常");
        }
      }
      /* 查询下一环节处理人信息 End */
    },
    //保存信息
    *leaveApprovalSave({basicLeaveData, leave_apply_id, resolve}, {call}) {
      basicLeaveData["arg_ou_id"] = Cookie.get('OUID') ; 

      /*校验离职人员是否已经申请离职，如果存在则提示不允许保存提交  begin*/
      let param = {};
      console.log("dasjkdaskjdaskldaskldjasjkdaskl");

      param["arg_staff_id" ] = Cookie.get('userid');
      const personCheckResult = yield call(staffLeaveService.leaveApplyCheckPersonInfo, param);
      //如果查到记录多于0条，存在一个人创建的离职申请，则不可以保存。
      if (personCheckResult.DataRows[0].result > 0) {
        /*已经进行离职申请人员，直接终止程序运行*/
        message.error(Cookie.get('username') + " 的离职申请已经保存，禁止重复保存，请查看离职信息");
        resolve("false");
        return;
      }
      else{
        /* 保存humanwork.leave_apply表离职人员basic信息 Begin */
        const saveBasicInfo = yield call(staffLeaveService.leaveApplyBasicInfoSave, basicLeaveData);
        if (saveBasicInfo.RetCode === '1') {
          message.success('保存成功');
          resolve("success");
        }
        else {
          message.success('保存失败');
          resolve("false");
          return ;
        }
        /* 保存humanwork.leave_apply表离职人员basic信息 End */
      }
     },
    //提交信息
    *staffLeaveSubmit({ basicLeaveData, approvalData, approvalDataNext, leave_apply_id, resolve }, { call }){
      /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
      console.log("staffLeaveSubmit begin");
      let param = {
        //离职申请启动工作流标识
        start_type : 'leave_apply',
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
      let task_name =  staffLeaveFlowStartList.actName;

      //基本信息表leave_apply补全
      basicLeaveData["arg_proc_inst_id"] = proc_inst_id; 
      basicLeaveData["arg_ou_id"] = Cookie.get('OUID') ; 


      //离职申请信息approval补全
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;

      //用来回滚数据库和工作流
      let postDataDeleteDateBase = {};
      let postDataDeleteFlow = {};
      postDataDeleteDateBase["arg_team_apply_id"] = leave_apply_id;
      postDataDeleteFlow["procInstId"] = proc_inst_id;
      postDataDeleteDateBase["arg_status"] = '1';
      //人力推送信息参数
      let leavePushHuman = {};
      leavePushHuman["arg_ou_id"] =  Cookie.get('OUID');
      leavePushHuman["arg_user_id"] = Cookie.get('userid');
      leavePushHuman["arg_apply_id"] = leave_apply_id;

      try { 
        //回滚标志
        let rollbackFlag = 0;
        /*校验离职人员是否已经申请离职，如果存在则提示不允许保存提交  begin*/
        let paramCheck = {}
        paramCheck["arg_staff_id" ] = Cookie.get('userid');
        const personCheckResult = yield call(staffLeaveService.leaveApplyCheckPersonInfo, paramCheck);

        if (personCheckResult.DataRows[0].result === '0' || (personCheckResult.DataRows[0].result > 0 && personCheckResult.DataRows[0].proc_inst_id === null)) {
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
        //如果已经有申请提交记录，则不允许重复提交，直接退出。
        else{
          //离职申请表中有一条记录，如果时流转中的，则有proc_inst_id值，无proc_inst_id值即为保存状态，先删除后插入
          message.error(Cookie.get('username') + " 的离职申请已提交，禁止重复提交！请查看离职信息");
          resolve("false");
          return;
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
        if(userProjectData.DataRows.length>0){
          if(userProjectData.DataRows[0].mgr_id === Cookie.get('userid')){
            staffFlag = false;
          }
        }else{
          staffFlag = false;
        }
        /* 查询下当前申请人角色：普通员工、项目经理/职能线员工 End */

        /*调用工作流节点结束服务 Begin */
        param["taskId"] = task_id;
        let listenerSrc = '{leaveapply:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"'+ Cookie.get('dept_id')+'",arg_companyid:"'+Cookie.get('OUID')+'"}}';
        param["listener"] = listenerSrc;
        param["form"] = '{if_person:'+staffFlag+'}';
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

        /*给人力推送离职申请消息 Begin */
        const leaveApplyPushHumanMessage = yield call(staffLeaveService.leaveApplyPushHuman, leavePushHuman);
        if (leaveApplyPushHumanMessage.RetCode !== '1') {
          /* 回滚功能:数据库 */
          yield call(staffLeaveService.leaveApplyDelete, postDataDeleteDateBase);
          /* 回滚功能:工作流 */
          yield call(staffLeaveService.leaveFlowTerminate, postDataDeleteFlow);
          message.error('提交失败');
          rollbackFlag = 1;
        }
        /*给人力推送离职申请消息 End */

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

    /*离职申请 end*/

    /*离职工作交接 begin*/
    *initQuery({query}, {call, put}){
      /* 查询当前申请人角色：普通员工、项目经理/职能线员工 Start */
      //普通员工为true,项目经理，职能线为false
      let roleFlag = '';
      let auth_userid = Cookie.get('userid');
      let projectQueryparams = {};
      projectQueryparams["arg_user_id"] = auth_userid;
      let userProjectData = yield call(staffLeaveService.projectQuery, projectQueryparams);
      //如果存在项目组，但是项目组的mgr_id（项目经理）不为当前用户的userid，即为普通员工
      if(userProjectData.DataRows.length>0){
        if(userProjectData.DataRows[0].mgr_id === Cookie.get('userid')){
          roleFlag = '2';
        }
        else{
          roleFlag = '1';
        }
        yield put({
          type: 'save',
          payload: {
            projInfo: userProjectData.DataRows,
            roleFlag: roleFlag
          }
        })
      }else{
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

    *personInfoQuery({query,resolve}, {call, put}){
      let projectQueryparams = {};
      projectQueryparams["arg_user_id"] = query.nextStepPersonID;
      let personInfo = yield call(staffLeaveService.personInfoQuery, projectQueryparams);
      if(personInfo.DataRows[0]){
        yield put({
          type: 'save',
          payload: {
            personInfoDetail : personInfo.DataRows,
          }
        })
        resolve("success");
      }
      else{
        resolve("false");
        return ;
      }
    },
    //提交信息
    *leaveHandSubmit({ basicHandOverData, approvalData, approvalDataNext, leave_hand_id, resolve }, {call}){
      /*调用工作流开始服务，传入 启动工作流标识 返回proc_inst_id，post_id_next*/
      let param = {
        //离职申请启动工作流标识
        start_type : 'leave_hand',
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
      let task_name =  staffHandFlowStartList.actName;

      //基本信息表leave_apply补全
      basicHandOverData["arg_proc_inst_id"] = proc_inst_id;

      //离职申请信息approval补全
      approvalData["arg_task_id"] = task_id;
      approvalData["arg_task_name"] = task_name;

      //用来回滚数据库和工作流
      let postDataDeleteDateBase = {};
      let postDataDeleteFlow = {};
      postDataDeleteDateBase["arg_leave_hand_id"] = leave_hand_id;
      postDataDeleteFlow["procInstId"] = proc_inst_id;
      postDataDeleteDateBase["arg_status"] = '1';

      basicHandOverData["arg_ou_id"] = Cookie.get('OUID') ; 


      try {
        //回滚标志
        let rollbackFlag = 0;
        /*校验离职人员是否已经申请离职，如果存在则提示不允许保存提交  begin*/
        let paramCheck = {}
        paramCheck["arg_staff_id" ] = Cookie.get('userid');
        const personCheckResult = yield call(staffLeaveService.leaveHandCheckPersonInfo, paramCheck);

        if (personCheckResult.DataRows[0].result === '0' || (personCheckResult.DataRows[0].result > 0 && personCheckResult.DataRows[0].proc_inst_id === null)) {
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


          console.log("approvalData in Models:");
          console.log(approvalData);
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
        //如果已经有申请提交记录，则不允许重复提交，直接退出。
        else{
          //离职申请表中有一条记录，如果时流转中的，则有proc_inst_id值，无proc_inst_id值即为保存状态，先删除后插入
          message.error(Cookie.get('username') + " 的离职工作交接已提交，禁止重复提交！请查看离职信息");
          resolve("false");
          return;
        }
        /*校验离职人员是否已经申请离职，如果存在则提示不允许保存提交  end*/

        /*调用工作流节点结束服务 Begin */
        param["taskId"] = task_id;
        let listenerSrc = '{leavehand:{arg_procInstId:"${procInstId}", arg_taskId:"${taskId}", arg_actId:"${actId}", arg_actName:"${actName}", arg_deptid:"'+ Cookie.get('dept_id')+'",arg_companyid:"'+Cookie.get('OUID')+'"}}';
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
    //保存信息
    *leaveHandSave({ basicHandOverData, leave_hand_id, resolve }, {call}){
      /*校验离职人员是否已经申请离职，如果存在则提示不允许保存提交  begin*/
      let param = {}
      param["arg_staff_id" ] = Cookie.get('userid');
      basicHandOverData["arg_ou_id"] = Cookie.get('OUID') ; 

      
      const personCheckResult = yield call(staffLeaveService.leaveHandCheckPersonInfo, param);
      //如果查到记录多于0条，存在一个人创建的离职申请，则不可以保存。
      if (personCheckResult.DataRows[0].result > 0) {
        /*已经进行离职申请人员，直接终止程序运行*/
        message.error(Cookie.get('username') + " 的离职工作交接申请已经提交，禁止重复保存，请查看离职信息");
        resolve("false");
        return;
      }
      else{
        /* 保存humanwork.leave_apply表离职人员basic信息 Begin */
        const saveBasicInfo = yield call(staffLeaveService.leaveHandBasicInfoSave, basicHandOverData);
        if (saveBasicInfo.RetCode === '1') {
          message.success('保存成功');
          resolve("success");
        }
        else {
          message.success('保存失败');
          resolve("false");
          return ;
        }
        /* 保存humanwork.leave_apply表离职人员basic信息 End */
      }
    },

    /*离职工作交接 end*/
  },

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/labor/index/createLeave') {
          dispatch({ type: 'postDataToCreate',query });
        }
        if (pathname === '/humanApp/labor/index/workHandover') {
          dispatch({ type: 'initQuery',query });
        }
      });
    }
  }
};
