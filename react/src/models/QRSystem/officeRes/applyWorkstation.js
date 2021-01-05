/**
  * 作者： 王均超
  * 创建日期：2019-07-02
  * 邮箱:  wangjc@itnova.com.cn
  * 功能： 申请工位数据处理层
  */
 import { message } from 'antd'
 import Cookie from 'js-cookie';
 import * as usersService from '../../../services/workStation/workStation.js';
 
 export default {
   namespace: 'applyWorkstation',
   state: {
 
   },
 
   reducers: {
     saveApplyWorkstation(state, { applyList: DataRows, RowCount: RowCount }) {
       return { ...state, applyList: DataRows, RowCount: RowCount };
     },
   },
 
   effects: {
 
     *applyFormCommit({ data }, { call, put }) {
       const { DataRows, RowCount, RetCode } = yield call(usersService.applyFormCommit, { ...data });
       
       if (RetCode == '1') {
         yield put({
           type: 'saveApplyWorkstation',
           applyList: DataRows,
           RowCount: RowCount,
         });
       }
     },
   },

 
 
   subscriptions: {
     setup({ dispatch, history }) {
 
       return history.listen(({ pathname, query }) => {
         if (pathname === '/adminApp/compRes/applyWorkstation') {
           var data = {
           }
           dispatch({ type: 'applyFormCommit', data });
         }
       });
     },
   },
 };
 