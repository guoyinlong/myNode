/**
 * 作者：张楠华
 * 日期：2018-1-23
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：会议室配置
 */
import * as usersService from '../../../services/meetSystem/meetSystem.js';
import * as meetingConfigService from '../../../services/meetSystem/meetingConfig';
import {message} from 'antd'
import { routerRedux } from 'dva/router';
import Cookie from "js-cookie"

export default {
  namespace: 'meetC',
  state: {
    list: [],
    companyList: [],
    RetNum:'1'
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *meetCSearch({}, { call, put }) {
      let postData_meet = {};
      postData_meet["arg_ou"] = localStorage.getItem('ou');
      const useAble = yield call(meetingConfigService.roomIfUseAble, postData_meet);
      const room = yield call(usersService.meetRoomC, postData_meet);
      const company = yield call(usersService.meetRoomCompany, postData_meet);
      yield put({
        type: 'save',
        payload:{
          list: room.DataRows,
          companyList: company.DataRows,
          RetNum:useAble.RetNum,
        }
      });
    },
    *addMeetRoomConfig({values,fileList},{call,put}){
      let postData = {};
      postData['arg_room_name'] = values.arg_room_name;
      postData['arg_room_capacity'] = values.arg_room_capacity;
      postData['arg_type_id'] = values.arg_type_id;//有问题
      postData['arg_room_tag'] = values.arg_room_tag;
      postData['arg_room_equipment'] = values.arg_room_equipment;
      postData['arg_room_basic_equipment'] = values.arg_room_basic_equipment;
      postData['arg_room_description'] = values.arg_room_description;
      postData['arg_create_id'] = localStorage.userid;
      postData['arg_create_name'] = localStorage.fullName;
      postData['arg_ou'] = localStorage.ou;
      const data = yield call(usersService.addMeetRoomConfig,postData);
      if(data.RetCode === '1'){
        let postData1 = {};
        postData1['arg_room_name'] = values.arg_room_name;
        postData1['arg_url'] = fileList[0].response.file.RelativePath;
        postData1['arg_real_url'] = fileList[0].response.file.AbsolutePath;
        postData1['arg_file_name'] = fileList[0].response.file.RealFileName;
        postData1['arg_create_id'] = localStorage.userid;
        postData1['arg_create_name'] = Cookie.get('username');
        const data1 = yield call(meetingConfigService.uploadOUInfo,postData1);
        if(data1.RetCode === '1'){
          message.info('添加成功');
          yield put(
            routerRedux.push({
              pathname:'/adminApp/meetSystem/meeting_setting'
            })
          )
        }
      }
    },
    *deleteMeeting({id},{call,put}){
      let postData = {};
      postData['arg_room_id'] = id;
      const data = yield call(usersService.deleteData,postData);
      if(data.RetCode === '1'){
        message.info('删除成功');
        yield put({
          type:'meetCSearch',
        });
      }
    },
    *editMeetRoomConfig({values,fileList,id},{call,put}){
      let postData = {};
      postData['arg_room_id'] = id;
      postData['arg_room_name'] = values.arg_room_name;
      postData['arg_room_capacity'] = values.arg_room_capacity;
      postData['arg_type_id'] = values.arg_type_id;//有问题
      postData['arg_room_tag'] = values.arg_room_tag;
      postData['arg_room_equipment'] = values.arg_room_equipment;
      postData['arg_room_basic_equipment'] = values.arg_room_basic_equipment;
      postData['arg_room_description'] = values.arg_room_description;
      postData['arg_update_id'] = localStorage.userid;
      postData['arg_update_name'] = localStorage.fullName;
      const data = yield call(usersService.editMeetRoomConfig,postData);
      if(data.RetCode === '1'){
        if(!fileList[0].hasOwnProperty('response')){
          message.info('修改成功');
          yield put(
            routerRedux.push({
              pathname:'/adminApp/meetSystem/meeting_setting'
            })
          );
          return;
        }
        let postData1 = {};
        postData1['arg_room_name'] = values.arg_room_name;
        postData1['arg_url'] = fileList[0].response.file.RelativePath;
        postData1['arg_real_url'] = fileList[0].response.file.AbsolutePath;
        postData1['arg_file_name'] = fileList[0].response.file.RealFileName;
        postData1['arg_create_id'] = localStorage.userid;
        postData1['arg_create_name'] = Cookie.get('username');
        const data1 = yield call(meetingConfigService.uploadOUInfo,postData1);
        if(data1.RetCode === '1'){
          message.info('修改成功');
          yield put(
            routerRedux.push({
              pathname:'/adminApp/meetSystem/meeting_setting'
            })
          )
        }
      }
    },
    *delMeetRoomPhoto({photoId},{call}){
      let postData = {};
      postData['arg_photo_id'] = photoId;
      const data = yield call(meetingConfigService.delMeetRoomPhoto,postData);
      if(data.RetCode === '1'){
        message.info('删除成功');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname}) => {
        if (pathname === '/adminApp/meetSystem/meeting_setting') {
          dispatch({ type: 'meetCSearch'});
        }
      });
    },
  },
};
