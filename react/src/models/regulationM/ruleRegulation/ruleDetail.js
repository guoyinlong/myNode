/**
 *  作者: 卢美娟
 *  创建日期: 2018-07-03
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：规章制度详情处理层
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../../services/regulationM/regulationM.js';

export default {
  namespace: 'ruleDetail',
  state: {

  },

  reducers: {
    saveRegulationDetail(state, { detailLists: DataRows,RowCount, }) {
      return { ...state, detailLists:DataRows,RowCount,};
    },
  },

  effects: {
    *getDetail({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.regulationQuery, {...data});
      if(RetCode == '1'){
        yield put({
          type: 'saveRegulationDetail',
          detailLists: DataRows,
          RowCount,
        });
      }
    },

    *regulationDownload({arg_regulation_id}, { call, put }) {
      const {RetCode} = yield call(usersService.regulationDownload, {arg_regulation_id});
      if(RetCode == '1'){
        // message.success("增加了一次下载记录");
      }
    },
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {

        });
      },
    },
};
