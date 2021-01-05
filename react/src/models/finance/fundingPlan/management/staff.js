/**
 * 作者：刘东旭
 * 日期：2018-03-05
 * 邮箱：liudx1006@chinaunicom.cn
 * 文件说明：资金计划-人员管理
 */
import * as accountService from '../../../../services/finance/fundingPlanManagement';
import Cookie from 'js-cookie'

export default {
  namespace: 'staffManagement',
  state: {
    list: [],//默认展示数据
    teamInfo: '',
    teamMember: [], //已加入小组的人员
    departProjectData: [],//部门-团队数据
    departData: [],//部门数据
    projectData: [],//团队数据
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
  },

  effects: {
    * memberTeamSearch({}, {call, put}) { //查询所属部门
      const userID = localStorage.staffid; //获取当前用户ID
      let postData = {};
      postData['arg_staffid'] = userID;
      const data = yield call(accountService.memberTeamSearch, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            teamInfo: data.DataRows[0] //{"ou":"联通软件研究院本部","id":"389179ec2d7e11e895d2008cfa0519e0","department":"公共平台与架构研发事业部","team_name":"名称过长"}
          }
        });
        yield put({
          type: 'init'
        });
      }
    },

    * init({}, {call, put, select}) { //默认table展示数据
      const ou = localStorage.ou; //获取当前用户ou
      let department = yield select(state => state.staffManagement.teamInfo.department);
      let teamName = yield select(state => state.staffManagement.teamInfo.team_name);
      let postData = {};
      postData['arg_ou'] = ou;
      postData['arg_department'] = department;
      postData['arg_team_name'] = teamName;
      const data = yield call(accountService.memberSearch, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            list: data.DataRows //将查询到的数据存进状态机
          }
        });
      }
    },

    * getTeamMember({}, {call, put}) { //已加入小组的人员查询
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

    * getDepartProject({}, {call, put}) { //按照部门-团队查询
      const ou = localStorage.ou; //获取当前用户ou
      let postData = {};
      postData['arg_ou'] = ou;
      const data = yield call(accountService.memberAddDepartProj, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            departProjectData: data.jsonTree //将查询到的数据存进状态机
          }
        });
      }
    },

    * getDepart({}, {call, put}) { //按照部门查询
      const ou = localStorage.ou; //获取当前用户ou
      let postData = {};
      postData['arg_ou'] = ou;
      if(ou === '联通软件研究院本部'){
        postData['arg_dept_id'] = Cookie.get('dept_id'); //获取当前用户部门id
      }else {
        postData['arg_dept_id'] = 'FFFFFF'
      }
      const data = yield call(accountService.memberAddDepart, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            departData: data.jsonTree //将查询到的数据存进状态机
          }
        });
      }
    },

    * getProject({}, {call, put}) { //按照团队查询
      const ou = localStorage.ou; //获取当前用户ou
      let postData = {};
      postData['arg_ou'] = ou;
      const data = yield call(accountService.memberAddProj, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            projectData: data.jsonTree //将查询到的数据存进状态机
          }
        });
      }
    },

    //新增
    * staffNew({memberData}, {call, put, select}) {
      const userID = localStorage.staffid; //获取当前用户所属部门ID
      const DeptID = Cookie.get('dept_id'); //获取当前用户ID
      let teamOu = yield select(state => state.staffManagement.teamInfo.ou); //小组ou
      let teamDepartment = yield select(state => state.staffManagement.teamInfo.department); //小组所在部门
      let teamName = yield select(state => state.staffManagement.teamInfo.team_name); //小组名称
      const memberDataBuild = memberData.map(item => ({
        arg_ou: teamOu,
        arg_department: teamDepartment,
        arg_team_name: teamName,
        arg_member_name: item.arg_member_name, //成员姓名
        arg_member_staffid: item.arg_member_staffid, //成员ID
        arg_member_department: item.arg_member_department, //成员所在部门
        arg_user_id: userID, //操作人员ID
        arg_create_deptid: DeptID,//操作人员所属部门ID
      }));

      for (let i = 0; i < memberDataBuild.length; i++) {
        yield call(accountService.memberAdd, memberDataBuild[i]);
      }
      yield put({
        type: 'memberTeamSearch',
      });
      yield put({
        type: 'getTeamMember',
      });
    },

    //删除人员
    * staffDelete({memberId}, {call, put, select}) {
      const userID = localStorage.staffid; //获取当前用户ID
      let teamOu = yield select(state => state.staffManagement.teamInfo.ou); //小组ou
      let teamDepartment = yield select(state => state.staffManagement.teamInfo.department); //小组所在部门
      let teamName = yield select(state => state.staffManagement.teamInfo.team_name); //小组名称
      let postData = {};
      postData['arg_ou'] = teamOu;
      postData['arg_department'] = teamDepartment;
      postData['arg_team_name'] = teamName;
      postData['arg_member_staffid'] = memberId; //成员id
      postData['arg_user_id'] = userID; //操作人员id
      yield call(accountService.memberDelete, postData);
      //再查一次数据
      yield put({
        type: 'init',
      });
      yield put({
        type: 'getTeamMember',
      });

    },

  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/financeApp/funding_plan/fundingPlanPeopleManagement') {
          dispatch({type: 'memberTeamSearch', query});
          dispatch({type: 'getDepartProject', query});
          dispatch({type: 'getDepart', query});
          dispatch({type: 'getProject', query});
          dispatch({type: 'getTeamMember', query});
        }
      });
    },
  },
};
