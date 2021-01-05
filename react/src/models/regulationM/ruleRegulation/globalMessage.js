/**
 *  作者: 卢美娟
 *  创建日期: 2018-07-03
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：模块整体留言详情处理层
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../../services/regulationM/regulationM.js';

export default {
  namespace: 'globalMessage',
  state: {

  },

  reducers: {
    saveGlobalMessage(state, { globalMessageList: DataRows,RowCount:RowCount }) {
      return { ...state, globalMessageList:DataRows,RowCount:RowCount};
    },
  },

  effects: {
    *globalMessagequery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.globalMessagequery, {...data});
      var tempDataRows = DataRows;
      if(RowCount > 0){
        for(let i = 0; i < RowCount; i++){
          tempDataRows[i].flag = '0';
        }
      }

      if(RetCode == '1'){
        yield put({
          type: 'saveGlobalMessage',
          globalMessageList: tempDataRows,
          RowCount:RowCount,
        });
      }
    },

    *ReglobalMessagequery({data}, { call, put }) {
      yield put({
        type: 'saveGlobalMessage',
        globalMessageList: data,
        RowCount:data.length,
      });
    },

    *leaveMsgAdd({arg_content}, { call, put }) {
      const {floor_id,RetCode} = yield call(usersService.leaveMsgAdd, {arg_content});
      if(RetCode == '1'){
        message.success("发表成功，返回的楼层是：",floor_id)
        //刷新
        yield put({
          type:'globalMessagequery',
        })
      }else{
        message.error("发表失败")
      }
    },

    *leaveMsgReply({data}, { call, put }) {
      const {RetCode} = yield call(usersService.leaveMsgReply, {...data});
      if(RetCode == '1'){
        message.success("回复成功")
        //刷新
        yield put({
          type:'globalMessagequery',
        })
      }else{
        message.error("回复失败")
      }
    },
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/regulationM/globalMessage') {
            var data = {
            }
            dispatch({ type: 'globalMessagequery',data });
          }
        });
      },
    },
};
