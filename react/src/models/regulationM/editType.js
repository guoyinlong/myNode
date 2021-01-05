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
  namespace: 'editType',
  state: {

  },

  reducers: {
    saveCategory(state, { categoryList: DataRows,RowCount,canOperate, }) {
      return { ...state, categoryList:DataRows,RowCount,canOperate,};
    },
  },

  effects: {
    *categoryAdminQuery({},{ call, put }) {
      const {children,RowCount,RetCode,canOperate} = yield call(usersService.categoryAdminQuery,{});
      if(RetCode == '1'){
        yield put({
          type: 'saveCategory',
          categoryList: children,
          RowCount,
          canOperate,
        });
      }
    },

    *categoryAdd({data}, { call, put }) {
      const {RetCode} = yield call(usersService.categoryAdd, {...data});
      if(RetCode == '1'){
        message.success("操作成功！")
      }else{
        message.error("操作失败！");
      }
      //刷新
      yield put({
        type:'categoryAdminQuery',
      })
    },

    *categoryEdit({data2}, { call, put }) {
      const {RetCode} = yield call(usersService.categoryEdit, {...data2});
      if(RetCode == '1'){
        message.success("操作成功！")
      }else{
        message.error("操作失败！");
      }
      //刷新
      yield put({
        type:'categoryAdminQuery',
      })
    },

    *categoryDel({arg_id}, { call, put }) {
      const {RetCode} = yield call(usersService.categoryDel, {arg_id});
      if(RetCode == '1'){
        message.success("删除成功！")
      }else{
        message.error("删除失败！");
      }
      //刷新
      yield put({
        type:'categoryAdminQuery',
      })
    },
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/regulationM/editType') {
            dispatch({ type: 'categoryAdminQuery' });
          }
        });
      },
    },
};
