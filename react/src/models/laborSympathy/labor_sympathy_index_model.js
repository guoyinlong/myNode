/**
 * 文件说明：工会慰问首页
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2020-06-10
 */
import Cookie from 'js-cookie';
import * as sympathyeService from "../../services/laborSympathy/laborSympathyeService";
import { routerRedux } from "dva/router";
import { message } from "antd";
export default {
  namespace: 'sympathy_index_model',
  state: {
    sympathyTypeList: [],
    laobrDataList: [],
    tableDataList: [],
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },
  effects: {
    // 查询默认的待办/已办
    *sympathySearchDefault({ arg_type }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          tableDataList: [],
        }
      });

      //获取Cookie的值，用的时候获取即可，写在最外面容易导致获取的不是最新的。
      let auth_userid = Cookie.get('userid');
      let arg_pass = Cookie.get('loginpass');

      let postData = {};
      postData["arg_page_size"] = 10;  //初始化页面显示条数为10
      postData["arg_page_current"] = 1;   //初始化当前页码为1
      postData["arg_user_id"] = auth_userid;
      postData["arg_type"] = arg_type;
      postData["arg_pass"] = arg_pass;

      let data = yield call(sympathyeService.sympathyApprovalInfoSearch, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: data.DataRows,
          }
        })
      }
    },

    // 默认查询
    *initQuery({ }, { call, put }) {
      //查询慰问类型
      yield put({
        type: 'save',
        payload: {
          sympathyTypeList: [],
        }
      });

      let postData = {};
      postData["arg_ou_id"] = Cookie.get("OUID");
      postData["arg_sympathy_type"] = 'all';

      let data = yield call(sympathyeService.sympathyTypeInfoSearch, postData);
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            sympathyTypeList: data.DataRows,
          }
        })
      };
      //获取Cookie的值，用的时候获取即可，写在最外面容易导致获取的不是最新的。
      let auth_userid = Cookie.get('userid');
      let postData2 = {};
      postData2["arg_user_id"] = auth_userid;

      let laobrData = yield call(sympathyeService.laborPersonQuery, postData2);
      if (laobrData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            laobrDataList: laobrData.DataRows,
          }
        })
      };

      yield put({
        type: 'sympathySearchDefault',
        arg_type: 1,
      });
    },
    //删除待办信息
    *deleteApproval({ query }, { call, put }) {
      let param = {
        arg_sympathy_apply_id: query.sympathy_apply_id,
        arg_status: query.type_delete,
      };
      let data = yield call(sympathyeService.sympathyeRebackDelete, param);
      if (data.RetCode === '1') {
        message.success('删除成功!');
        yield put(
          routerRedux.push('/humanApp/laborSympathy/index')
        )
      } else {
        message.error('删除失败!');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/laborSympathy/index') {
          dispatch({ type: 'initQuery', query });
        }
      });
    }
  }
};
