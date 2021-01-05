/**
 * 文件说明：离职管理-首页
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-06-14
 */
import Cookie from "js-cookie";
import * as staffLeaveService from "../../../services/labor/staffLeave/staffLeaveService";
import {message} from "antd";

export default {
  namespace : 'index',
  state : {
    info:{},
    template:'',
    leaveHandleRecord:{},
    leaveStepRecord:[],
  },

  reducers : {
    save(state,action) {
      return { ...state,...action.payload};
    },
  },

  effects : {
      *initLeaveManager({}, {call, put}) {
        let user_id = Cookie.get('userid');
        let query={
          arg_user_id: user_id,
        }
        const leaveHandleInfo = yield call(staffLeaveService.queryLeaveHandleInfo,query);
        if( leaveHandleInfo.RetCode === '1') {
          let leaveHandleRecord = leaveHandleInfo.DataRows[0];
          yield put({
            type: 'save',
            payload: {
              leaveHandleRecord: leaveHandleRecord,
            }
          });
        }
      },
    *queryLeaveStep({resolve}, {call, put}){
      let user_id = Cookie.get('userid');
      let query={
        arg_user_id: user_id,
      };
      const leaveStepQuery = yield call(staffLeaveService.queryLeaveStepInfo,query);
      if( leaveStepQuery.DataRows[0]) {
        let leaveStepRecord = leaveStepQuery.DataRows[0];
          yield put({
            type: 'save',
            payload: {
              leaveStepRecord : leaveStepRecord,
            }
          });
        resolve("success");
      }else{
        resolve("false");
        return ;
      }
    }
  },
  subscriptions : {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/labor/index') {
          dispatch({ type: 'initLeaveManager',query });
        }
      });
    }
  },
};
