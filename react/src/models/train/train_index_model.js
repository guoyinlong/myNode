/**
 * 文件说明：培训管理-首页
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-08
 **/
import Cookie from "js-cookie";
import * as trainService from "../../services/train/trainService";
import { message } from "antd";

export default {
  namespace: 'train_index_model',
  state: {
    user_id: '',
    //创建，用户角色：总院人力接口（可以创建全院计划和总院人力自己的计划）、分院人力接口（可以创建分院计划和分院人力部门自己计划）、部门接口人
    userRoleData: [],
    userRole: '',
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  effects: {
    *initTrain({ query }, { put, call }) {
      //user_role判定roleFlag：
      //总院人力接口人：1
      //分院人力接口人：2
      //部门接口人：3
      //确定人员角色
      let userRoleParams = {
        arg_user_id: Cookie.get('userid')
      };
      let userRoleData = yield call(trainService.trainUserRoleQuery, userRoleParams);
      if (userRoleData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            userRoleData: userRoleData.DataRows,
          }
        })
      } else {
        message.error("查询异常");
      }
    },

    *initTrainIndex({ query }, { put, call }) {
      //user_role判定roleFlag：
      //总院人力接口人：1
      //分院人力接口人、部门：2
      //普通员工：3
      //确定人员角色
      let userRoleParams = {
        arg_user_id: Cookie.get('userid'),
      };
      let roleFlag = '';
      let centerFlag = '';

      let userRoleData = yield call(trainService.trainUserRoleQuery, userRoleParams);
      if (userRoleData.RetCode === '1') {
        //人力接口人：返回的dept_id有2条，有可能是总院人力接口人，也可能是分院人力接口人，依据dept_id判断
        if (userRoleData.DataRows && userRoleData.DataRows.length > 0) {
          //总院人力接口人：总院ouid写死为总院ouid，判断是否是总院人力部门、其余分院及部门公用一个
          for (let i = 0; i < userRoleData.DataRows.length; i++) {
            if (userRoleData.DataRows[i].dept_id === 'e65c02c2179e11e6880d008cfa0427c4') {
              centerFlag = '1';
              break;
            }
          }
          if (centerFlag === '1') {
            roleFlag = '1';
          } else {
            roleFlag = '2';
          }
        } else if (userRoleData.DataRows && userRoleData.DataRows.length <= 0) {
          roleFlag = '3';
        };

        yield put({
          type: 'save',
          payload: {
            userRole: roleFlag,
          }
        })
      } else {
        message.error("查询异常");
      }
    },

    /**新增培训的待办和已办的查询 */
    *trainSearchDefault({ arg_type }, { call, put }) {
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
      postData["arg_page_size"] = 10;  //初始化页面显示条数为10
      postData["arg_page_current"] = 1;   //初始化当前页码为1
      postData["arg_user_id"] = auth_userid;
      postData["arg_user_pass"] = Cookie.get('loginpass');
      postData["arg_type"] = arg_type;

      let data = yield call(trainService.trainApprovalQuery, postData);
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
      postInfo["arg_page_size"] = 10;
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
    }

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/train/train_index') {
          dispatch({ type: 'initTrainIndex', query });
        }
        if (pathname === '/humanApp/train/trainPlanAndImport') {
          dispatch({ type: 'initTrain', query });
        }
        if (pathname === '/humanApp/train/trainManage') {
          dispatch({ type: 'initTrain', query });
        }
        if (pathname === '/humanApp/train/trainStatistic') {
          dispatch({ type: 'initTrain', query });
        }
      });
    }
  },
};
