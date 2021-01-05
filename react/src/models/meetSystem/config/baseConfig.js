/**
 * 作者：张楠华
 * 日期：2018-1-23
 * 邮件：zhangnh6@chinaunicom.cn
 * 文件说明：会议室基础配置
 */
import * as meetingConfigService from '../../../services/meetSystem/meetingConfig';
import Cookie from 'js-cookie';
import { message } from 'antd';
const dateFormat = 'HH:mm:ss';
export default {
  namespace: 'baseConfig',
  state: {
    meetingTypeInfo:[],
    TimeTypeInfo:[],
    InterfacePersonTypeInfo:[],
    meetingCategoryInfo:[],
    OUList:[],
    RetNum : '1'
  },

  reducers: {
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({}, {  call,put }) {
      let postData_meet={};
      postData_meet["arg_ou"] = localStorage.getItem('ou');
      const useAble = yield call(meetingConfigService.roomIfUseAble, postData_meet);
      yield put({
        type: 'save',
        payload:{
          RetNum:useAble.RetNum,
        }
      });
      yield put({
        type:'queryMeetingType',
      });
      yield put({
        type:'queryTimeType',
      });
      yield put({
        type:'queryInterfacePersonType',
      });
      yield put({
        type:'queryMeetingCategory',
      });
      // yield put({
      //   type:'queryOUType',
      // });
    },
    //查询会议室类型
    *queryTimeType({}, { call, put }){
      let postData = {};
      postData['arg_ou'] = localStorage.ou;
      const data = yield call(meetingConfigService.queryTimeType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
           TimeTypeInfo:data.DataRows,
          }
        });
      }
    },
    //查询会议室类别
    *queryMeetingCategory({}, { call, put }){
      let postData = {};
      postData['arg_ou'] = localStorage.ou;
      const data = yield call(meetingConfigService.queryMeetingCategory,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            meetingCategoryInfo:data.DataRows,
          }
        });
      }
    },
    //查询时间配置
    *queryMeetingType({}, { call, put }){
      let postData = {};
      postData['arg_ou'] = localStorage.ou;
      const data = yield call(meetingConfigService.queryMeetingType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            meetingTypeInfo:data.DataRows,
          }
        });
      }
    },
    //查询接口人
    *queryInterfacePersonType({}, { call, put }){
      let postData = {};
      postData['arg_ou'] = localStorage.ou;
      const data = yield call(meetingConfigService.queryInterfacePersonType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            InterfacePersonTypeInfo:data.DataRows,
          }
        });
      }
    },
    //查询OU类型
    *queryOUType({}, { call, put }){
      const OUData = yield call(meetingConfigService.searchOU);
      if(OUData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            OUList:OUData.DataRows,
          }
        });
      }
      const data = yield call(meetingConfigService.queryOUType);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            OUTypeInfo:data.DataRows,
          }
        });
      }
    },
    //删除会议室类型
    *delMeetingType({i},{ call,put }){
      let postData = {};
      postData['arg_type_id'] = i.type_id;
      const data = yield call(meetingConfigService.delMeetingType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryMeetingType',
        });
      }
    },
    //删除会议室类别
    *delMeetingCategory({i},{ call,put }){
      let postData = {};
      postData['arg_level_id'] = i.level_id;
      const data = yield call(meetingConfigService.delMeetingCategory,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryMeetingCategory',
        });
      }
    },
    //删除会议室时间配置
    *delConfigure({record},{ call,put }){
      let postData = {};
      postData['arg_timeset_id'] = record.timeset_id;
      const data = yield call(meetingConfigService.delConfigure,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryTimeType',
        });
      }
    },
    //删除接口人信息
    *delInterfacePersonType({i},{ call,put }){
      let postData = {};
      postData['arg_linker_id'] = i.linker_id;
      const data = yield call(meetingConfigService.delInterfacePersonType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryInterfacePersonType',
        });
      }
    },
    //删除接口人信息
    *delOUType({i},{ call,put }){
      let postData = {};
      postData['arg_ou_id'] = i.ou_id;
      const data = yield call(meetingConfigService.delOUType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryOUType',
        });
      }
    },
    //添加会议室类型
    *addMeetingType({meetingType,meetingFlag},{ call,put }){
      let postData = {};
      postData['arg_ou'] = localStorage.ou;
      postData['arg_type_name'] = meetingType;
      postData['arg_create_id'] = localStorage.userid;
      postData['arg_create_name'] = Cookie.get('username');
      postData['arg_type_flag '] = meetingFlag;
      const data = yield call(meetingConfigService.addMeetingType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryMeetingType',
        });
      }
    },
    //添加会议室类别
    *addMeetingCategory({meetingCategory,meetingCategoryDescribe},{ call,put }){
      let postData = {};
      postData['arg_ou'] = localStorage.ou;
      postData['arg_level_name'] = meetingCategory;
      postData['arg_create_id'] = localStorage.userid;
      postData['arg_create_name'] = Cookie.get('username');
      postData['arg_level_describe'] = meetingCategoryDescribe;
      const data = yield call(meetingConfigService.addMeetingCategory,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryMeetingCategory',
        });
      }
    },
    //添加时间配置
    *addTimeType({timeUnit, beginTime, endTime,reserveDay,time_per},{ call,put }){
      let postData = {};
      postData['arg_start_time'] = beginTime.format(dateFormat);
      postData['arg_end_time'] = endTime.format(dateFormat);
      postData['arg_min_time'] = timeUnit;
      postData['arg_ou'] = localStorage.ou;
      //postData['arg_period_time'] = reserveDay;
      postData['arg_create_id'] = localStorage.userid;
      postData['arg_create_name'] = Cookie.get('username');
      postData['arg_time_type'] = time_per;
      const data = yield call(meetingConfigService.addTimeType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryTimeType',
        });
      }
    },
    //添加接口人
    *addInterfacePersonType({interfacePersonType,interfacePersonEmailType,interfacePersonTelType },{ call,put }){
      let postData = {};
      postData['arg_linker_name'] = interfacePersonType;
      postData['arg_linker_tel'] = interfacePersonTelType;
      postData['arg_linker_mail'] = interfacePersonEmailType;
      postData['arg_ou'] = localStorage.ou;
      postData['arg_create_id'] = localStorage.userid;
      postData['arg_create_name'] = Cookie.get('username');
      const data = yield call(meetingConfigService.addInterfacePersonType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryInterfacePersonType',
        });
      }
    },
    //添加ou配置信息
    *addOUConfig({ou, address, tel, introduce,fileList,reserveDay,ouId },{call,put}){
      let postData = {};
      postData['arg_ou_id'] = ou;
      postData['arg_ou'] = ouId;
      postData['arg_ou_address'] = address;
      postData['arg_ou_tel'] = tel;
      postData['arg_period_time'] = reserveDay;
      postData['arg_ou_description'] = introduce;
      postData['arg_create_id'] = localStorage.userid;
      postData['arg_create_name'] = Cookie.get('username');
      const data = yield call(meetingConfigService.addOUType,postData);
      if(data.RetCode === '1'){
        let postData1 = {};
        postData1['arg_room_id'] = '';
        postData1['arg_url'] = fileList[0].response.file.RelativePath;
        postData1['arg_real_url'] = fileList[0].response.file.AbsolutePath;
        postData1['arg_ou'] = ouId;
        postData1['arg_file_name'] = fileList[0].response.file.RealFileName;
        postData1['arg_create_id'] = localStorage.userid;
        postData1['arg_create_name'] = Cookie.get('username');
        const data1 = yield call(meetingConfigService.uploadOUInfo,postData1);
        if(data1.RetCode === '1'){
          yield put({
            type:'queryOUType',
          });
        }
      }
    },
    *editInterfacePersonType({ Modal4Mail, Modal4Tel, Modal4Name,Modal4linkerId },{call,put}){
      let postData = {};
      postData['arg_linker_name'] = Modal4Name;
      postData['arg_linker_tel'] = Modal4Tel;
      postData['arg_linker_mail'] = Modal4Mail;
      postData['arg_linker_id'] = Modal4linkerId;
      postData['arg_ou'] = localStorage.ou;
      postData['arg_update_id'] = localStorage.userid;
      postData['arg_update_name'] = Cookie.get('username');
      const data = yield call(meetingConfigService.editInterfacePersonType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryInterfacePersonType',
        });
      }
    },
    *editConfigure({ Modal3TimePer, Modal3TimeUnit, Modal3BeginTime, Modal3EndTime, Modal3TimeSetId },{call,put}){
      let postData = {};
      postData['arg_timeset_id'] = Modal3TimeSetId;
      postData['arg_start_time'] = Modal3BeginTime.format(dateFormat);
      postData['arg_end_time'] = Modal3EndTime.format(dateFormat);
      postData['arg_min_time'] = Modal3TimeUnit;
      postData['arg_time_type'] = Modal3TimePer;
      postData['arg_ou'] = localStorage.ou;
      postData['arg_update_id'] = localStorage.userid;
      postData['arg_update_name'] = Cookie.get('username');
      const data = yield call(meetingConfigService.editTimeType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryTimeType',
        });
      }
    },
    //编辑会议室类别
    *editMeetingCategory({Modal2MeetingCategory,Modal2MeetingCategoryDescribe,Modal2LevelId},{ call,put }){
      let postData = {};
      postData['arg_ou'] = localStorage.ou;
      postData['arg_level_id'] = Modal2LevelId;
      postData['arg_level_name'] = Modal2MeetingCategory;
      postData['arg_update_id'] = localStorage.userid;
      postData['arg_update_name'] = Cookie.get('username');
      postData['arg_level_describe'] = Modal2MeetingCategoryDescribe;
      const data = yield call(meetingConfigService.editMeetingCategory,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryMeetingCategory',
        });
      }
    },
    //编辑会议室类型
    *editMeetingType({Modal1MeetingType,Modal1TypeId,meetingFlag},{ call,put }){
      let postData = {};
      postData['arg_type_id'] = Modal1TypeId;
      postData['arg_ou'] = localStorage.ou;
      postData['arg_type_name'] = Modal1MeetingType;
      postData['arg_update_id'] = localStorage.userid;
      postData['arg_update_name'] = Cookie.get('username');
      postData['arg_type_flag'] = meetingFlag;
      const data = yield call(meetingConfigService.editMeetingType,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'queryMeetingType',
        });
      }
    },
    *delMeetRoomPhoto({photoId},{call}){
      let postData = {};
      postData['arg_photo_id'] = photoId;
      const data = yield call(meetingConfigService.delMeetRoomPhoto,postData);
      if(data.RetCode !== '1'){
        message.info('删除失败');
      }
    },
    //添加ou配置信息
    *editOUType({ModalouId,Modalou, Modaladdress, Modaltel, Modalintroduce,ModalFileList,ModalreserveDay },{call,put}){
      let postData = {};
      postData['arg_ou_id'] = ModalouId;
      postData['arg_ou_name'] = Modalou;
      postData['arg_ou_address'] = Modaladdress;
      postData['arg_ou_tel'] = Modaltel;
      postData['arg_period_time'] = ModalreserveDay;
      postData['arg_ou_description'] = Modalintroduce;
      postData['arg_update_id'] = localStorage.userid;
      postData['arg_update_name'] = Cookie.get('username');
      const data = yield call(meetingConfigService.editOUType,postData);
      if(data.RetCode === '1'){
        if(!ModalFileList[0].hasOwnProperty('response')){
          yield put({
            type:'queryOUType',
          });
          return;
        }
        let postData1 = {};
        postData1['arg_room_id'] = '';
        postData1['arg_url'] = ModalFileList[0].response.file.RelativePath;
        postData1['arg_real_url'] = ModalFileList[0].response.file.AbsolutePath;
        postData1['arg_ou'] = Modalou;
        postData1['arg_file_name'] = ModalFileList[0].response.file.RealFileName;
        postData1['arg_create_id'] = localStorage.userid;
        postData1['arg_create_name'] = Cookie.get('username');
        const data1 = yield call(meetingConfigService.uploadOUInfo,postData1);
        if(data1.RetCode === '1'){
          yield put({
            type:'queryOUType',
          });
        }
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/meetSystem/basic_setting') {
          dispatch({ type: 'init',query });
        }
        if (pathname === '/adminApp/meetSystem/ou_setting') {
          dispatch({ type: 'queryOUType',query });
        }
      });
    },
  },
};
