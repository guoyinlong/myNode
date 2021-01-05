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
  namespace: 'limited',
  state: {
    limitList:[],
  },

  reducers: {
    saveLimitList(state, { limitList: DataRows }) {

      return { ...state, limitList:DataRows};
    },
  },

  effects: {
    *viewLimit({}, { call, put }) {
       const {RetCode,DataRows} = yield call(usersService.viewLimit);
       if(RetCode == '1'){
         yield put({
           type: 'saveLimitList',
           limitList: DataRows,
         });
       }else{
         message.error("服务出错")
       }
    },
    *removeLimit({arg_limit_id}, { call, put }) {
       const {RetCode} = yield call(usersService.removeLimit,{arg_limit_id});
       if(RetCode == '1'){
         message.success("解除限制成功！")
         //刷新
         yield put({
           type: 'viewLimit',
         });
       }
       else{
         message.error("解除限制失败！")
       }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/meetSystem/limited') {
           dispatch({ type: 'viewLimit' });
        }
      });


    },
  },
};
