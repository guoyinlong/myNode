/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页消息列表页面model
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import {message} from 'antd';
import Cookie from 'js-cookie';
export default {
  namespace : 'messageMore',
  state : {
    messageList: [],
    messageFlag: true,
  },

  reducers : {
    myMessage(state, { DataRows, unread_count, messagePageCount, RowCount, taskList }) {
      return {
        ...state,
        messageList:[...DataRows],
        unread_count,
        messageFlag: false,
        messagePageCount,
        RowCount,
        taskList
      };
    }
  },

  effects : {
    *messageQuery({ formData:formData }, { call, put }) {
      let postData={
        'arg_mess_staff_id_to':Cookie.get('userid'),
        'arg_page_size':formData.arg_page_size||'',
        'arg_page_current':formData.arg_page_current||'',
        'arg_mess_staff_name_from':formData.arg_mess_staff_name_from||''
      }
      const { DataRows, unread_count, PageCount, RowCount } = yield call(commonAppService.messageQuery, postData);
      window.localStorage.setItem('noticeList', unread_count);
      yield put({
        type: 'myMessage',
        DataRows,
        unread_count,
        'messagePageCount':PageCount,
        RowCount
      });
    },

    // 消息单条设为已读
    *messageReadFlag ({formData:formData}, {call, put}) {
      const{arg_staff_id,arg_mess_id,arg_page_size,arg_page_current,arg_mess_staff_name_from}=formData;
      let postData={
        arg_staff_id,
        arg_mess_id
      }
      const {RetCode} = yield call(commonAppService.messageReadFlag,postData);
      if(RetCode=='1'){
        // message.success('消息为已读状态！');
        yield put({
          type: 'messageQuery',
          formData:{
            arg_page_size,
            arg_page_current,
            arg_mess_staff_name_from
          }
        });
      }else{message.warn('改为已读状态失败！');}
    },
    // 消息批量设为已读
    *messageReadBat ({formData:formData}, {call, put}) {
      const{arg_staff_id,arg_mess_ids,arg_page_size,arg_page_current,arg_mess_staff_name_from}=formData;
      let postData={
        arg_staff_id,
        arg_mess_ids
      }
      const {RetCode} = yield call(commonAppService.messageReadBat,postData);
      if(RetCode=='1'){
        // message.success('消息全部设为已读成功！');
        yield put({
          type: 'messageQuery',
          formData:{
            arg_page_size,
            arg_page_current,
            arg_mess_staff_name_from
          }
        });
      }else{message.warn('消息全部设为已读失败！');}
    },
    // 消息设为未读
    *messageNotRead ({formData:formData}, {call, put}) {
      const{arg_staff_id,arg_mess_id,arg_page_size,arg_page_current,arg_mess_staff_name_from}=formData;
      let postData={
        arg_staff_id,
        arg_mess_id
      }
      const {RetCode} = yield call(commonAppService.messageNotRead,postData);
      if(RetCode=='1'){
        // message.success('消息设为未读成功！');
        yield put({
          type: 'messageQuery',
          formData:{
            arg_page_size,
            arg_page_current,
            arg_mess_staff_name_from
          }
        });
      }else{message.warn('消息设为未读失败！');}
    },
    // 消息批量设为未读
    *messageNotReadBat ({formData:formData}, {call, put}) {
      const{arg_staff_id,arg_mess_ids,arg_page_size,arg_page_current,arg_mess_staff_name_from}=formData;
      let postData={
        arg_staff_id,
        arg_mess_ids
      }
      const {RetCode} = yield call(commonAppService.messageNotReadBat,postData);
      if(RetCode=='1'){
        // message.success('消息全部设为未读成功！');
        yield put({
          type: 'messageQuery',
          formData:{
            arg_page_size,
            arg_page_current,
            arg_mess_staff_name_from
          }
        });
      }else{message.warn('消息全部设为未读失败！');}
    },
    // 删除消息
    *messageDelete ({formData}, {call, put}) {
      const {mess_status,mess_id,arg_page_size,arg_page_current,arg_mess_staff_name_from}=formData
      const {RetCode} = yield call(commonAppService.messageDelete,{
          transjsonarray: JSON.stringify([{
            "update":{"mess_status":mess_status},
            "condition":{"mess_id":mess_id}
          }])
        }
      )
      if(RetCode=='1'){
        yield put({
          type: 'messageQuery',
          formData:{
            arg_page_size,
            arg_page_current,
            arg_mess_staff_name_from
          }
        });
      }else{
        message.warn('删除失败！');
      }
    }
},
  subscriptions : {

  },
}
