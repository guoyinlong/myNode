/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页公告信息页面model（管理员用户）
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import {message} from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
export default {
  namespace : 'noticeMoreManager',
  state : {
    noticeManagerList:[],
    noticeManagerFlag:true
  },

  reducers : {
    noticeManagerList(state,{DataRows,RowCount}){
      for(var i=0;i<DataRows.length;i++){
        DataRows[i].updatetime=moment(DataRows[i].updatetime).format("YYYY-MM-DD");
      }
      return{
        ...state,
        noticeManagerList:[...DataRows],
        noticeManagerFlag:false,
        RowCount
      };
    }
  },

  effects : {
    *noticeListByManager({formData}, {call, put}) {
      const {RetCode,RetVal,DataRows,RowCount} = yield call(commonAppService.noticeListByManager, formData);
      if(RetCode=='1'){
        yield put({
          type: 'noticeManagerList',
          DataRows,
          RowCount
        });
      }else{
        message.error('公告列表查询失败'+RetVal);
      }
    },
    // 全部可见
    *noticeInfoQuery ({formData}, {call, put}) {
      const {RetCode,RetVal,DataRows,RowCount} = yield call(commonAppService.noticeInfoQuery,formData);
      if(RetCode=='1'){
        yield put({
          type: 'noticeManagerList',
          DataRows,
          RowCount
        });
      }else{
        message.error('公告列表查询失败'+RetVal);
      }
    },
    // 阅读量
    *readrecordInsert({formData}, {call, put}) {
      const {arg_notice_id,arg_userid,item}=formData
      const {RetCode}= yield call(commonAppService.readrecordInsert,{arg_notice_id,arg_userid});
      if(RetCode=='1'){
        yield put(routerRedux.push({
          pathname:'/noticeDetail',
          query:{id:item.ID,n_title:item.n_title,role:'manager'}
        }));
      }
    },
  },
  subscriptions : {
    setup({dispatch, history}) {

      // return history.listen(({pathname, query}) => {
      //
      //   if (pathname === '/commonApp') {
      //
      //     dispatch({type: 'backlogQuery', query});
      //   }
      // });

          },
        },
      };
