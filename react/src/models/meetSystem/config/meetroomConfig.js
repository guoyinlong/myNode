/**
 * 作者：张楠华
 * 日期：2018-1-23
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：会议室配置
 */
import * as usersService from '../../../services/meetSystem/meetSystem.js';

export default {
  namespace: 'meetroomConfig',
  state: {
    list: [],
    query: {},
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *meetRoomSearch({query}, { call, put }) {
      let postData_meet = {};
      postData_meet["arg_ou"] = localStorage.getItem('ou');
      const room = yield call(usersService.meetRoomType, postData_meet);
      yield put({
        type: 'save',
        payload:{
          list: room.DataRows,
          query: query
        }
      });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/meetSystem/meeting_setting/meetroomConfig') {
          dispatch(
            { type: 'meetRoomSearch', query},
          );
        }
      });
    },
  },

};
