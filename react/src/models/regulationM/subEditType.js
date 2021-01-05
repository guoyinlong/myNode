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
  namespace: 'subEditType',
  state: {

  },

  reducers: {
    saveSubRole(state, { subRoleList: DataRows,RowCount:RowCount }) {
      return { ...state, subRoleList:DataRows,RowCount:RowCount};
    },
  },

  effects: {
    *regulationChildManagerQuery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.regulationChildManagerQuery, {...data});
      if(RetCode == '1'){
        yield put({
          type: 'saveSubRole',
          subRoleList: DataRows,
          RowCount:RowCount,
        });
      }else{
        message.error("查询错误")
      }
    },

    *assignCategoryClear({data}, { call, put }) {
      const {RetCode} = yield call(usersService.assignCategory, {...data});
      if(RetCode == '1'){
        message.success("取消成功！")
      }else{
        message.error("取消失败！")
      }
      //刷新
      yield put({
        type:'regulationChildManagerQuery'
      })
    },

    *assignCategoryChoose({data}, { call, put }) {
      const {RetCode} = yield call(usersService.assignCategory, {...data});
      if(RetCode == '1'){
        message.success("分配成功！")
      }else{
        message.error("分配失败！")
      }
      //刷新
      yield put({
        type:'regulationChildManagerQuery'
      })
    },
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/regulationM/subEditType') {
            var data = {}
            dispatch({type:'regulationChildManagerQuery',data})

          }
        });
      },
    },
};
