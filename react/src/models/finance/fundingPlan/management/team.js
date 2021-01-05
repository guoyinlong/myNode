/**
 * 作者：刘东旭
 * 日期：2018-03-16
 * 邮箱：liudx1006@chinaunicom.cn
 * 文件说明：资金计划-小组管理
 */
import * as accountService from '../../../../services/finance/fundingPlanManagement';
import { message } from 'antd';
import Cookie from 'js-cookie'
export default {
  namespace: 'teamManagement',
  state: {
    list: [], //默认展示数据
    memberList: [], //备选人员
    teamMember:[], //已加入小组的人员
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
  },

  effects: {
    * init({}, {call, put}) {
      const ou = localStorage.ou; //获取当前用户ou
      const department = localStorage.deptname; //获取当前用户ou
      let postData = {};
      postData['arg_ou'] = ou;
      postData['arg_department'] = department;
      const data = yield call(accountService.teamCheck, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            list: data.DataRows //将查询到的数据存进状态机
          }
        });
      }else {
        yield put({
          type: 'save',
          payload: {
            list: [] //将查询到的数据存进状态机
          }
        });
      }
    },

    * memberCheck({}, {call, put}) {
      const ou = localStorage.ou; //获取当前用户ou
      let postData = {};
      postData['arg_ou'] = ou;
      if(ou === '联通软件研究院本部'){
        postData['arg_dept_id'] = Cookie.get('dept_id'); //获取当前用户部门id
      }else {
        postData['arg_dept_id'] = 'FFFFFF'
      }
      const data = yield call(accountService.teamAddCheck, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            memberList: data.jsonTree //将查询到的数据存进状态机
          }
        });
      }
    },

    * checkTeamMember({}, {call, put}) { //已加入小组人员查询
      const data = yield call(accountService.teamMemberSearch);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            teamMember: data.DataRows //将查询到的数据存进状态机
          }
        });
      }
    },

    //增加小组
    * teamNew({inputTeamName, inputTeamLeader, leaderId, leaderDepartment}, {call, put}) {
      if(!inputTeamName){
        message.info('团队名称不能为空');
        return;
      }
      if(!inputTeamLeader){
        message.info('团队负责人姓名不能为空');
        return;
      }
      if(!leaderId){
        message.info('输入项不能为空');
        return;
      }
      if(!leaderDepartment){
        message.info('团队负责人所属部门不能为空');
        return;
      }
      const userID = localStorage.staffid; //获取当前用户ID
      const DeptID = Cookie.get('dept_id'); //获取当前用户所属部门ID
      const userDepartment = localStorage.deptname; //所属部门
      const ou = localStorage.ou; //获取当前用户ou
      let postData = {};
      postData['arg_ou'] = ou; //ou
      postData['arg_department'] = userDepartment; //所属部门
      postData['arg_team_name'] = inputTeamName; //团队名称
      postData['arg_team_manager_name'] = inputTeamLeader; //团队负责人姓名
      postData['arg_team_manager_user_id'] = leaderId; //团队负责人ID
      postData['arg_team_manager_department'] = leaderDepartment; //团队负责人所属部门
      postData['arg_user_id'] = userID; //操作人员staff_id
      postData['arg_create_deptid'] = DeptID; //操作人员所属部门ID
      const data = yield call(accountService.teamAdd, postData);
      if (data.RetCode === '1') {
        //再查一次数据
        yield put({
          type: 'init',
        });
        //再查一次数据
        yield put({
          type: 'checkTeamMember',
        });
      }
    },

    //编辑小组
    * teamEdit({editTeamName, editTeamLeader, editLeaderId, editLeaderDepartment, oldTeamName, oldTeamLeader, oldLeaderId}, {call, put}) {
      //console.log(editTeamName, editTeamLeader, editLeaderId,oldTeamName,oldTeamLeader,oldLeaderId);
      const userID = localStorage.staffid; //获取当前用户ID
      const DeptID = Cookie.get('dept_id'); //获取当前用户所属部门ID
      const userDepartment = localStorage.deptname; //所属部门
      const ou = localStorage.ou; //获取当前用户ou
      if(!editTeamName){
        message.info('团队名称不能为空');
        return;
      }
      if(!editTeamLeader){
        message.info('团队负责人姓名不能为空');
        return;
      }
      if(!editLeaderId){
        message.info('输入项不能为空');
        return;
      }
      if(!editLeaderDepartment){
        message.info('团队负责人所属部门不能为空');
        return;
      }
      if(!oldTeamName){
        message.info('原始团队不能为空');
        return;
      }
      if(!oldTeamLeader){
        message.info('原始团队负责人姓名不能为空');
        return;
      }
      if(!oldLeaderId){
        message.info('输入项不能为空');
        return;
      }
      let postData = {};
      postData['arg_ou'] = ou; //ou
      postData['arg_department'] = userDepartment; //所属部门
      postData['arg_team_name'] = oldTeamName; //旧团队名称
      postData['arg_team_manager_name'] = oldTeamLeader; //旧团队负责人姓名
      postData['arg_team_manager_user_id'] = oldLeaderId; //旧团队负责人ID
      postData['arg_new_team_name'] = editTeamName; //新团队名称
      postData['arg_new_team_manager_name'] = editTeamLeader; //新团队负责人姓名
      postData['arg_new_team_manager_user_id'] = editLeaderId; //新团队负责人ID
      postData['arg_new_team_manager_department'] = editLeaderDepartment; //新团队负责人所属部门
      postData['arg_user_id'] = userID; //操作人员staff_id
      postData['arg_create_deptid'] = DeptID; //操作人员所属部门ID
      const data = yield call(accountService.teamEdit, postData);
      if (data.RetCode === '1') {
        //再查一次数据
        yield put({
          type: 'init',
        });
        //再查一次数据
        yield put({
          type: 'checkTeamMember',
        });
      }
    },

    //删除科目
    * teamDelete({teamName}, {call, put}) {
      const userID = localStorage.staffid; //获取当前用户ID
      const userDepartment = localStorage.deptname; //所属部门
      const ou = localStorage.ou; //获取当前用户ou
      let postData = {};
      postData['arg_ou'] = ou;
      postData['arg_department'] = userDepartment;
      postData['arg_team_name'] = teamName;
      postData['arg_user_id'] = userID;
      yield call(accountService.teamDelete, postData);
      //再查一次数据
      yield put({
        type: 'init',
      });
      //再查一次数据
      yield put({
        type: 'checkTeamMember',
      });
    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/financeApp/funding_plan/fundingPlanTeamManagement') {
          dispatch({type: 'init', query});
          dispatch({type: 'memberCheck', query});
          dispatch({type: 'checkTeamMember', query});
        }
      });
    },
  },
};
