/**
 *  作者: 卢美娟
 *  创建日期: 2018-07-05
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：模块我的留言详情处理层
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../services/regulationM/regulationM.js';

export default {
  namespace: 'myMessage',
  state: {
  },

  reducers: {
    saveMyMessage(state, { myMessageList: DataRows,RowCount:RowCount }) {
      return { ...state, myMessageList:DataRows,RowCount:RowCount};
    },
  },

  effects: {
    *myMessagequery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.myMessagequery, {...data});
      var tempDataRows = DataRows;
      for(let i = 0; i < RowCount; i++){
        tempDataRows[i].flag = '0';
      }
      if(RetCode == '1'){
        yield put({
          type: 'saveMyMessage',
          myMessageList: tempDataRows,
          RowCount:RowCount,
        });
      }
    },

    *ReMessagequery({data}, { call, put }) {
      yield put({
        type: 'saveMyMessage',
        myMessageList: data,
        RowCount:data.length,
      });
    },

    *leaveMsgDel({arg_floor_id}, { call, put }) {
      const {RetCode} = yield call(usersService.leaveMsgDel, {arg_floor_id});
      if(RetCode == '1'){
        message.success("删除留言成功！")
        //刷新
        yield put({
          type: 'myMessagequery'
        })
      }
      else{
        message.error("删除留言失败！");
      }
    },

    *leaveMsgAdd({arg_content}, { call, put }) {
      const {RetCode} = yield call(usersService.leaveMsgAdd, {arg_content});
      if(RetCode == '1'){
        message.success("发表成功")
        //刷新
        yield put({
          type:'myMessagequery',
        })
      }else{
        message.error("发表失败")
      }
    },
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/regulationM/myMessage') {
            var data = {
            }
            dispatch({ type: 'myMessagequery',data });
          }
        });
      },
    },
};
