/**
 * 文件说明：员工职级薪档信息自定义统计查询功能model
 * 作者：jintingZhai
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2020-02-04
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
  namespace: 'person_rank_promotion_query_model',
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
    //晋升路径查询
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
    *initPersonRankPromotionQuery({ query }, { call, put }) {
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
      let flag = '';
      //let judge_flag = '';
      queryData["arg_user_id"] = Cookie.get('userid');
      const roleData = yield call(rankService.rankCheckRole, queryData);

      if (roleData.RetCode === '1') {
        flag = roleData.DataRows[0].role_level;
      } else {
        message.error(roleData.RetVal);
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
      init_post_param["arg_flag"] = flag;
      yield put({
        type: 'personRankPromotionQuery',
        query: init_post_param
      });

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


    },

    /* 员工职级薪档信息自定义统计查询功能的初始化方法 ,点击查询*/
    *personRankPromotionQuery({ query }, { call, put }) {

      let tableDataList_temp = [];
      let postData_temp = {};
      let total_temp = '';
      let currentPage_temp = '';

      yield put({
        type: 'save',
        payload: {
          tableDataList: [],
          postData: '',
          total: 0,
          currentPage: 1,
          permission: query.arg_flag,
          tableDataListTotal: [],
        }
      });

      /**个人只能查看自己的职级薪档信息 默认查询登录人的所在院的培训计划 */
      /**查两遍 一遍展示，一遍导出 */
      let postData = {};

      postData["arg_ou_id"] = query.arg_ou_id;
      postData["arg_user_id"] = query.arg_user_id;
      postData["arg_dept_id"] = query.arg_dept_id;
      postData["arg_promotion_path"] = query.arg_promotion_path;
      postData["arg_year"] = query.arg_year;
      postData["arg_page_current"] = query.arg_page_current;   //初始化当前页码为1
      postData["arg_page_size"] = query.arg_page_size;  //初始化页面显示条数为10
      postData["arg_flag"] = query.arg_flag;

      const basicInfoData = yield call(rankService.rankPromotionQuery, postData);
      if (basicInfoData.RetCode === '1') {
        /**要展示的需要赋值 */
        tableDataList_temp = basicInfoData.DataRows;
        postData_temp = postData;
        total_temp = basicInfoData.RowCount;
        currentPage_temp = postData.arg_page_current;
      } else {
        message.error(basicInfoData.RetVal);
      }

      let queryParam = {};
      queryParam["arg_ou_id"] = query.arg_ou_id;
      queryParam["arg_user_id"] = query.arg_user_id;
      queryParam["arg_dept_id"] = query.arg_dept_id;
      queryParam["arg_promotion_path"] = query.arg_promotion_path;
      queryParam["arg_year"] = query.arg_year;
      queryParam["arg_page_current"] = 1;
      queryParam["arg_page_size"] = 10000;
      queryParam["arg_flag"] = query.arg_flag;

      const exportData = yield call(rankService.rankPromotionQuery, queryParam);
      if (exportData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: tableDataList_temp,
            postData: postData_temp,
            total: total_temp,
            currentPage: currentPage_temp,
            tableDataListTotal: exportData.DataRows,
            typeFlag: '1',
          }
        });
      } else {
        message.error(exportData.RetVal);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/rankpromote/personRankPromotionQuery') {
          dispatch({ type: 'initPersonRankPromotionQuery', query });
        }
      });
    }
  },
};
