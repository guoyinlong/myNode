/**
 * 文件说明：员工职级薪档信息对接全面激励报告model
 * 作者：jintingZhai
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2020-02-20
 **/
import Cookie from "js-cookie";
import * as rankService from "../../../services/rankpromote/rankService";
import * as promoteService from "../../../services/rankpromote/promoteService";
import * as trainService from "../../../services/train/trainService";
import * as hrService from "../../../services/hr/hrService";
import { message } from "antd";
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../../utils/config';
const auth_tenantid = Cookie.get('tenantid');
const auth_ou = Cookie.get('OU');
let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

export default {
  namespace: 'comprehensive_data_query_model',
  state: {
    user_id: '',
    userRoleData: [],
    tableDataList: [],
    ouList: [],
    deptList: [],
    currentPage: null,
    total: null,
    item: {},
    postData: {},
    tableDataListTotal: [],
    nextPersonList: [],
    deptInfoList: [],
    pathDataList: [],
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveOU(state, { ouList: DataRows }) {
      return { ...state, ouList: DataRows };
    },
    saveDept(state, { deptList: DataRows }) {
      return { ...state, deptList: DataRows };
    },
  },

  effects: {
    /* 员工职级薪档信息自定义统计查询功能的初始化方法 ,默认进入页面查询*/
    *initcomprehensiveDataQuery({ query }, { call, put }) {
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const { DataRows: getOuData } = yield call(hrService.getOuList, postData_getOU);
      yield put({
        type: 'saveOU',
        ouList: getOuData
      });

      //该OUid下部门列表
      yield put({
        type: 'save',
        payload: {
          deptList: [],
        }
      });
      let queryParam = {
        arg_ou_id: Cookie.get('OUID'),
      };
      const DeptData = yield call(trainService.courtDeptQuery, queryParam);
      if (DeptData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            deptList: DeptData.DataRows,
          }
        });
      } else {
        message.error('部门查询中···');
      }

      //查询登录人员的角色
      let queryData = {};
      //let flag = '';
      queryData["arg_user_id"] = Cookie.get('userid');
      const roleData = yield call(rankService.rankCheckRole, queryData);

      if (roleData.RetCode !== '1') {
        //   flag = roleData.DataRows[0].role_level;
        // } else {
        message.error(roleData.RetVal);
      }

      //查询晋升路径
      let postQueryParam = {}
      postQueryParam["arg_ou_id"] = Cookie.get('OUID');
      const pathData = yield call(promoteService.getPathList, postQueryParam);
      if (pathData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            pathDataList: pathData.DataRows,
          }
        });
      } else {
        message.error('路径查询中···');
      }
      // 默认查询，调用查询服务
      let init_post_param = {};

      init_post_param["arg_ou_id"] = Cookie.get('OUID');
      init_post_param["arg_user_id"] = Cookie.get('userid');
      init_post_param["arg_dept_id"] = Cookie.get('dept_id');
      init_post_param["arg_promotion_path"] = '1';
      init_post_param["arg_year"] = new Date().getFullYear();
      init_post_param["arg_page_current"] = 1;   //初始化当前页码为1
      init_post_param["arg_page_size"] = 10;  //初始化页面显示条数为10
      yield put({
        type: 'comprehensiveDataQuery',
        query: init_post_param
      });
    },

    /* 员工职级薪档信息自定义统计查询功能的初始化方法 ,点击查询*/
    *comprehensiveDataQuery({ query }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          tableDataList: [],
          postData: '',
          total: 0,
          currentPage: 1,
        }
      });

      let postData = {};

      postData["arg_ou_id"] = query.arg_ou_id;
      postData["arg_user_id"] = query.arg_user_id;
      postData["arg_dept_id"] = query.arg_dept_id;
      postData["arg_promotion_path"] = query.arg_promotion_path;
      postData["arg_year"] = query.arg_year;
      postData["arg_page_current"] = query.arg_page_current;   //初始化当前页码为1
      postData["arg_page_size"] = query.arg_page_size;  //初始化页面显示条数为10

      const basicInfoData = yield call(rankService.rankcomprehensiveDataQuery, postData);
      if (basicInfoData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: basicInfoData.DataRows,
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/rankpromote/comprehensiveDataQuery') {
          dispatch({ type: 'initcomprehensiveDataQuery', query });
        }
      });
    }
  },
};
