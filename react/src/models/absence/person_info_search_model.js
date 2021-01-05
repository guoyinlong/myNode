/**
 * 文件说明：请假信息查询
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2020-05-13
 */
import Cookie from 'js-cookie';
import * as absenceService from "../../services/absence/absenceService";
import * as hrService from "../../services/hr/hrService";
import { message } from "antd";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../utils/config';
const auth_tenantid = Cookie.get('tenantid');
const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

export default {
  namespace: 'person_info_search_model',
  state: {
    //角色
    userRoleData: [],
    tableDataList: [],
    ouList: [],
    deptList: [],
    permission: '',
    department_mananger: false
  },
  reducers: {
    saveDept(state, { deptList: DataRows }) {
      return { ...state, deptList: DataRows };
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveOU(state, { ouList: DataRows }) {
      return { ...state, ouList: DataRows };
    }
  },
  effects: {
    // 初始化查询
    *searchInfoInit({ query }, { call, put }) {
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const { DataRows: getOuData } = yield call(hrService.getOuList, postData_getOU);
      yield put({
        type: 'saveOU',
        ouList: getOuData,
      });

      //从服务获取所属OU下的部门列表
      let postData_getDept = {};
      postData_getDept["argtenantid"] = auth_tenantid;
      const { DataRows: getDeptData } = yield call(hrService.getDeptInfo, postData_getDept);
      let deptDataList = [];
      for (let i = 0; i < getDeptData.length; i++) {
        if (getDeptData[i].dept_name.split('-')[0] === auth_ou_flag && getDeptData[i].dept_name.split('-')[1]) {
          if (!getDeptData[i].dept_name.split('-')[2]) { //纪委去重
            //存储去除前缀后的部门数据
            let pureDeptData = {
              dept_id: getDeptData[i].dept_id,
              dept_name: getDeptData[i].dept_name.split('-')[1],
            };
            deptDataList.push(pureDeptData);
          }
        }
      }
      yield put({
        type: 'saveDept',
        deptList: deptDataList
      });

      /* 查询用户角色信息 Begin */
      let auth_ouid = Cookie.get('OUID');
      let auth_deptid = Cookie.get('dept_id');
      let auth_userid = Cookie.get('userid');
      let roleQueryparams = {
        arg_ou_id: auth_ouid,
        arg_dept_id: auth_deptid,
        arg_user_id: auth_userid
      };
      let department_mananger = false;
      let userRoleData = yield call(absenceService.absenceRoleInfoQuery, roleQueryparams);
      if (userRoleData.RetCode === '1') {
        if (userRoleData.DataRows[0].absence_role == 'department_mananger') {
          department_mananger = true;
        }
      }

      let queryData = {};
      let flag = '0';
      queryData["arg_user_id"] = Cookie.get('userid');
      const roleData = yield call(absenceService.absenceCheckRole, queryData);
      if (roleData.RetCode === '1') {
        flag = roleData.DataRows[0].role_level;
      } else {
        message.error(roleData.RetVal);
      }
      yield put({
        type: 'save',
        payload: {
          tableDataList: [],
          permission: flag,
          department_mananger: department_mananger,
        }
      });
      /* 查询用户角色信息 End */
    },
    *personalAbsenceInfoQuery({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          tableDataList: [],
        }
      });

      let queryInfoParams = {
        arg_ou_id: Cookie.get("OUID"),
        arg_userid_or_username: query.arg_userid_or_username,
        arg_dept_id: query.arg_dept_id,
        arg_start_time: query.arg_start_time,
        arg_end_time: query.arg_end_time,
        arg_absence_type: query.arg_absence_type,
        arg_apply_status: query.arg_apply_status,
        arg_absence_type_detail: query.arg_absence_type_detail,
      }
      let absencePersonalInfo = yield call(absenceService.absencePersonalInfoQuery, queryInfoParams);
      if (absencePersonalInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: absencePersonalInfo.DataRows,
          }
        });
      }
    },
    *getDept({ arg_param }, { call, put }) {
      //从服务获取所属OU下的部门列表
      let postData_getDept = {};
      postData_getDept["argtenantid"] = auth_tenantid;
      const { DataRows: getDeptData } = yield call(hrService.getDeptInfo, postData_getDept);
      let deptDataList = [];
      for (let i = 0; i < getDeptData.length; i++) {
        if (arg_param === OU_HQ_NAME_CN) { //联通软件研究院本部
          arg_param = OU_NAME_CN; //联通软件研究院
        }
        if (getDeptData[i].dept_name.split('-')[0] === arg_param && getDeptData[i].dept_name.split('-')[1]) {
          if (!getDeptData[i].dept_name.split('-')[2]) { //纪委去重
            //存储去除前缀后的部门数据
            let pureDeptData = {
              //序号
              dept_id: getDeptData[i].dept_id,
              //参训人员
              dept_name: getDeptData[i].dept_name.split('-')[1],
            };
            deptDataList.push(pureDeptData);
          }
        }
      }
      yield put({
        type: 'saveDept',
        deptList: deptDataList
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/absence/personalSearch') {
          dispatch({ type: 'searchInfoInit', query });
        }
      });
    }
  }
};
