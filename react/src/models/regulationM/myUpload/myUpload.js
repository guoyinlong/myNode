/**
 *  作者: 卢美娟
 *  创建日期: 2018-06-13
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：规章制度-我的上传数据处理层
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../../services/regulationM/regulationM.js';

export default {
  namespace: 'myUpload',
  state: {

  },

  reducers: {
    saveMyRegulation(state, { myReguList: DataRows,RowCount:RowCount }) {
      return { ...state, myReguList:DataRows,RowCount:RowCount};
    },
  },

  effects: {
    *myregulationquery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.myregulationquery, {...data});
      if(RetCode == '1'){
        yield put({
          type: 'saveMyRegulation',
          myReguList: DataRows,
          RowCount:RowCount,
        });
      }
    },

    *enableRegulation({data}, { call, put }) {
      const {RetCode} = yield call(usersService.enableRegulation, {...data});
      if(RetCode == '1'){
        message.success("操作成功！")
      }
      //刷新
      yield put({
        type:'myregulationquery',
      })
    },

    *regulationDel({arg_id}, { call, put }) {
      const {RetCode} = yield call(usersService.regulationDel, {arg_id});
      if(RetCode == '1'){
        message.success("删除草稿成功！");
      }else{
        message.error("删除草稿失败！");
      }
      //刷新
      yield put({
        type:'myregulationquery',
      })
    },

    *deleteRegulationSendReview({data}, { call, put }) {
      const {RetCode} = yield call(usersService.deleteRegulationSendReview, {...data});
      if(RetCode == '1'){
        message.success("此删除请求已经提交给部门经理审核！")
      }
      else {
        message.error("请求删除失败！")
      }
      //刷新
      yield put({
        type:'myregulationquery',
      })
    },
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/regulationM/myUpload') {
            var data = {
            }
            dispatch({ type: 'myregulationquery',data });
          }
        });
      },
    },
};
