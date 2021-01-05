/**
 * 文件说明: 认证考试查询的界面
 * 作者：wangfj80
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2020-05-27
 **/
import Cookie from "js-cookie";
import * as trainService from "../../../services/train/trainService";
import { message } from "antd";
import { routerRedux } from "dva/router";

export default {
  namespace: 'certification_list_model',
  state: {
    tableDataList: []
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },
  effects: {
    *certificationListInit({query}, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          tableDataList: []
        }
      });

      let param = {
        arg_curr_year: query.arg_year
      };
      //查询sql列表
      const queryListInfo = yield call(trainService.certificationList, param);
      if (queryListInfo.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            tableDataList: queryListInfo.DataRows,
          }
        });
      } else {
        message.error('认证考试查询失败');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/train/personalClassQueryIndex/certificationList') {
          /**培训配置统计查询 */
          dispatch({ type: 'certificationListInit', query });
        }
      });
    }
  },
}
