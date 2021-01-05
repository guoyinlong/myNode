/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页公告详情页面model
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import {message} from 'antd';
export default {
  namespace : 'noticeDetail',
  state : {
    noticeCntList:[],
    noticeFileList:[],
    noticeDeptList:[],
    noticeDeptFlag:true,
    noticeFileFlag:true,
    noticeCntFlag:true,
    noticeThumbNum:0,
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
    },
    noticeThumbQueryRedu(state,{allnumber,isfabulous}){
      return{
        ...state,
        noticeThumbNum:allnumber,
        isfabulous
      };
    },
    noticeGiveThumbsupRedu(state,{isfabulous}){
      return{
        ...state,
        isfabulous
      };
    },
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
    *noticeGiveThumbsup({formData}, {call, put}) {
      const {RetCode,RetVal} = yield call(commonAppService.noticeGiveThumbsup, formData);
      if(RetCode=='1'){
        yield put({
          type:'noticeThumbQuery',
          formData:{
            arg_notice_id:formData.arg_notice_id,
            arg_userid:formData.arg_userid
          }
        })
        // message.success('点赞成功！');
      }else{
        message.error(RetVal);
      }
    },

    *noticeThumbQuery({formData}, {call, put}) {
      const {RetCode,RetVal,DataRows ,isfabulous} = yield call(commonAppService.noticeThumbQuery, formData);
      if(RetCode=='1'){
        yield put({
          type: 'noticeThumbQueryRedu',
          allnumber:DataRows[0].allnumber,
          isfabulous
        });
      }else{
        message.error('点赞数查询失败！'+RetVal);
      }
    }

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
