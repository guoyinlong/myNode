/**
 * 文件说明：请假管理首页
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-06-20(补充) 
 */
import Cookie from 'js-cookie';
import * as hrService from "../../services/hr/hrService";
import * as overtimeService from '../../services/overtime/overtimeService.js'
import * as absenceService from "../../services/absence/absenceService";
import { routerRedux } from "dva/router";
import { message } from "antd";
export default {
  namespace: 'absence_index_model',
  state: {
    tableDataList: [],
    infoSearch: [],
    userRoleList: [],
    deptList: [],
    postData: [],
    total: '',
    currentPage: '',
    if_human: true
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
    // 查询默认的待办/已办
    *absenceSearchDefault({ arg_type }, { call, put }) {
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
      let arg_pass = Cookie.get('loginpass');

      let postData = {};
      postData["arg_page_size"] = 10;  //初始化页面显示条数为10
      postData["arg_page_current"] = 1;   //初始化当前页码为1
      postData["arg_user_id"] = auth_userid;
      postData["arg_type"] = arg_type;
      postData["arg_pass"] = arg_pass;

      let data = yield call(absenceService.absenceApprovalQuery, postData);
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

    *absenceApprovalQuery({ }, { call, put }) {
      /*查询用户角色 Begin*/
      let auth_userid = Cookie.get('userid');
      let auth_ouid = Cookie.get('OUID');
      let auth_deptid = Cookie.get('dept_id');
      let roleQueryparams = {
        arg_ou_id: auth_ouid,
        arg_dept_id: auth_deptid,
        arg_user_id: auth_userid
      };
      let userRoleData = yield call(absenceService.absenceRoleInfoQuery, roleQueryparams);
      if (userRoleData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            userRoleData: userRoleData.DataRows[0],
          }
        })
      }
      /*查询用户角色 End*/
      yield put({
        type: 'absenceSearchDefault',
        arg_type: 1,
      });
    },
    //删除待办信息
    *deleteApproval({ query }, { call, put }) {
      let param = {
        arg_absence_apply_id: query.absence_apply_id,
        arg_status: query.type_delete,
      };
      let data = yield call(absenceService.absenceBreakOffApplyBasicInfoSaveDel, param);
      if (data.RetCode === '1') {
        message.success('删除成功!');
        yield put(
          routerRedux.push('/humanApp/absence/absenceIndex')
        )
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/absence/absenceIndex') {
          dispatch({ type: 'absenceApprovalQuery', query });
        }
      });
    }
  }
};
