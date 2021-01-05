/**
 *  作者: 卢美娟
 *  创建日期: 2018-06-13
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：规章制度-留言反馈数据处理层
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../services/regulationM/regulationM.js';
import moment from 'moment';

export default {
  namespace: 'downloadReport',
  state: {

  },

  reducers: {
    saveTop(state, { topList: DataRows, }) {
      return { ...state, topList:DataRows,};
    },
  },

  effects: {
    *regulationtopdownquery({data}, { call, put }) {
      const {DataRows,RetCode} = yield call(usersService.regulationtopdownquery, {...data});
      if(RetCode == '1'){
        yield put({
          type: 'saveTop',
          topList: DataRows,
        });
      }
    },
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/regulationM/downloadReport') {
            var data = {
              arg_download_time_start: moment().format('YYYY-MM-DD'),
              arg_download_time_end:moment().format('YYYY-MM-DD'),
              arg_page_size:10,
            }
            dispatch({ type: 'regulationtopdownquery',data });
          }
        });
      },
    },
};
