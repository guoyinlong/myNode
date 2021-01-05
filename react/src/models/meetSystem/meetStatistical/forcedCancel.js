/**
  * 作者： 卢美娟
  * 创建日期： 2018-05-24
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 会议统计页面的逻辑处理层
  */
import * as usersService from '../../../services/meetSystem/meetSystem.js'
import moment from 'moment';  //时间
import Cookie from 'js-cookie';
import {message} from 'antd'
const dateFormat = 'YYYY-MM-DD';
export default {
  namespace: 'forcedcancel',
  state: {
    forcedList:[],
  },

  reducers: {
    saveForcedList(state, { forcedList: DataRows }) {

      return { ...state, forcedList:DataRows};
    },
  },

  effects: {
    *viewForced({}, { call, put }) {
       const {RetCode,DataRows} = yield call(usersService.viewForced);
       if(RetCode == '1'){
         yield put({
           type: 'saveForcedList',
           forcedList: DataRows,
         });
       }else{
         message.error("服务出错")
       }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/meetSystem/forced') {
           dispatch({ type: 'viewForced' });
        }
      });


    },
  },
};
