/**
 *  作者: 卢美娟
 *  创建日期: 2018-06-13
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：规章制度-我的审批数据处理层
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../services/regulationM/regulationM.js';

export default {
  namespace: 'myBack',
  state: {

  },

  reducers: {
    savePublicReject(state, { myPublicRejectList: publishRows,RowCount, }) {
      return { ...state, myPublicRejectList:publishRows,RowCount,};
    },
    saveDeleteReject(state, { myDeleteRejectList: deleteRows,RowCount, }) {
      return { ...state, myDeleteRejectList:deleteRows,RowCount,};
    },
  },

  effects: {
    *todoReviewRejctQuery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.todoReviewRejctQuery2, {...data});
      var publishRows = [];
      var deleteRows = [];
      if(RetCode == '1'){
        for(let i = 0; i < RowCount; i++){
          if(DataRows[i].type == 'regulationPublish'){
            publishRows.push(DataRows[i]);
          }else if(DataRows[i].type == 'regulationDelete'){
            deleteRows.push(DataRows[i]);
          }
        }
        yield put({
          type: 'savePublicReject',
          myPublicRejectList: publishRows,
          RowCount:RowCount,
        });
        yield put({
          type: 'saveDeleteReject',
          myDeleteRejectList: deleteRows,
          RowCount:RowCount,
        });
      }
    },

    *publishRegulationAbandon({data2}, { call, put }) {
      const {RetCode,RetVal} = yield call(usersService.publishRegulationAbandon, {...data2});
      if(RetCode == '1'){
        message.success("作废成功！");
      }else{
        message.error(RetVal);
      }
      //刷新
      var data = {
        arg_state: '0',
      }
      yield put({
        type:'todoReviewRejctQuery',
        data,
      })
    },

    *delRegulationAbandon({data2}, { call, put }) {
      const {RetCode,RetVal} = yield call(usersService.delRegulationAbandon, {...data2});
      if(RetCode == '1'){
        message.success("作废成功！");
      }else{
        message.error(RetVal);
      }
      //刷新
      var data = {
        arg_state: '0',
      }
      yield put({
        type:'todoReviewRejctQuery',
        data,
      })
    },

    *delRegulationResendReview({data2}, { call, put }) {
      const {RetCode,RetVal} = yield call(usersService.delRegulationResendReview, {...data2});
      if(RetCode == '1'){
        message.success("操作成功！");
      }else{
        message.error(RetVal);
      }
      //刷新
      var data = {
        arg_state: '0',
      }
      yield put({
        type:'todoReviewRejctQuery',
        data,
      })
    },
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/regulationM/myBack') {
            var data = {
              arg_state: '0',
            }
            dispatch({ type: 'todoReviewRejctQuery',data });
          }
        });
      },
    },
};
