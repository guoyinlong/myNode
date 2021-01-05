/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页修改公告页面model
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import { routerRedux } from 'dva/router';
import {message} from 'antd'
export default {
  namespace : 'noticeModify',
  state : {
    noticeCntList:[],
    noticeFileList:[],
    noticeDeptList:[],
    noticeDeptFlag:true,
    noticeFileFlag:true,
    noticeCntFlag:true
  },

  reducers : {
    noticeCntList(state,{DataRows}){
      return{
        ...state,
        noticeCntList:[...DataRows],
        noticeCntFlag:false
      };
    },
    noticeFileList(state,{DataRows}){
      return{
        ...state,
        noticeFileList:[...DataRows],
        noticeFileFlag:false
      };
    },
    noticeDeptList(state,{DataRows}){
      return{
        ...state,
        noticeDeptList:[...DataRows],
        noticeDeptFlag:false
      };
    }
  },

  effects : {
    *noticeCntQuery({formData}, {call, put}) {
      const {RetCode,RetVal,DataRows} = yield call(commonAppService.noticeCntQuery, formData);
      if(RetCode=='1'){
        yield put({
          type: 'noticeCntList',
          DataRows,
        });
        // message.success('公告内容查询成功！');
      }else{
        message.error('公告内容查询失败'+RetVal);
      }
    },
    *noticeFileQuery({formData}, {call, put}) {
      const {RetCode,RetVal,DataRows} = yield call(commonAppService.noticeFileQuery, formData);
      if(RetCode=='1'){
        yield put({
          type: 'noticeFileList',
          DataRows,
        });
        // message.success('公告附件查询成功！');
      }else{
        message.error('公告附件查询失败'+RetVal);
      }
    },
    *noticeDeptQuery({formData}, {call, put}) {
      const {RetCode,RetVal,DataRows} = yield call(commonAppService.noticeDeptQuery, formData);
      if(RetCode=='1'){
        yield put({
          type: 'noticeDeptList',
          DataRows,
        });
        // message.success('公告可见部门查询成功！');
      }else{
        message.error('公告可见部门查询失败'+RetVal);
      }
    },
    *noticeAddM({formData}, {call, put}) {
      const{transjsonarray}=formData;
      const {RetCode,RetVal} = yield call(commonAppService.noticeAdd, {transjsonarray});
      if(RetCode=='1'){
        message.success('公告修改成功！');
        yield put(routerRedux.push('/noticeMoreManager'));
      }else{
        message.error('公告修改失败'+RetVal);
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
