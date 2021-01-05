/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：会议预定数据
 */

import * as usersService from '../../services/meetSystem/meetSystem.js';

import {timeCalc, s_e_time,getToday,calcMts} from '../../components/meetSystem/meetConst.js'
import moment from 'moment'
import {message} from 'antd'
import Cookie from 'js-cookie';
//const staff_id=Cookie.get('staff_id')
//const fullName=Cookie.get('username')

export default {
  namespace : 'meet',
  state : {
    list: [],
    query: {},
    userState: 2,
    modalVisible:false,
    searchRoomRes:[],
    searchTimeRes:[],
    meetroomTypeRes:[],
    isErrorPage1:'0',
    isErrorPage2:'0',
    isErrorPage3:'0',
    isErrorPage5:'0',
    datepickerWaring: '',
    errorDescription: '',

  },

  reducers : {
    save(state, {list: DataRows,query: {  arg_ou,arg_time_type,arg_typeid,arg_typeFlag,arg_weekday}}){

      return {
        ...state,
        list: DataRows,
        query: {
          arg_ou,
          arg_time_type,
          arg_typeid,
          arg_typeFlag,
          arg_weekday
        },
        modalVisible:false
      };
    },
    saveDanger(state,action) {
      return {...state,...action.payload}
    },
    saveState(state, {userState: userState}) {
      return {
        ...state,
        userState: userState
      };
    },
    saveNotice(state, {notice}) {
      return {
        ...state,
        notice
      };
    },
    searchSave(state, {DataRows}) {

      return {
        ...state,
        searchRoomRes: DataRows
      };
    },
    equipmentSave(state, {equipment,basicEquimpent}) {

      return {
        ...state,
        equipment,
        basicEquimpent
      };
    },
    timeSave(state, {DataRows}) {
      return {
        ...state,
        searchTimeRes: DataRows
      };
    },
    timeSave2(state, {DataRows}) {
      return {
        ...state,
        titleTimeRes: DataRows
      };
    },
    sxwSave(state, {DataRows}) {
      return {
        ...state,
        sxwTimeRes: DataRows
      };
    },
    meetroomTypeSave(state, {DataRows}) {
      return {
        ...state,
        meetroomTypeRes: DataRows
      };
    },
    meetTypeSave(state,{DataRows}) {
      return {
        ...state,
        meetTypeRes: DataRows
      };
    },
    periodTimeSave(state,{period_time}) {
      // alert(period_time)
      return {
        ...state,
        period_time: period_time
      };
    },
    saveErrorPage1(state, { isErrorPage1:isErrorPage1 }) {
      // alert(roomName)
      return { ...state, isErrorPage1:isErrorPage1};
    },
    saveErrorPage2(state, { isErrorPage2:isErrorPage2 }) {
      // alert(roomName)
      return { ...state, isErrorPage2:isErrorPage2};
    },
    saveErrorPage3(state, { isErrorPage3:isErrorPage3 }) {
      // alert(roomName)
      return { ...state, isErrorPage3:isErrorPage3};
    },
    saveErrorPage5(state, { isErrorPage5:isErrorPage5 }) {
      // alert(roomName)
      return { ...state, isErrorPage5:isErrorPage5};
    },

  },

  effects : {
    *fetch({query: {arg_ou="",arg_time_type=0,arg_typeid = '',arg_typeFlag,arg_weekday = getToday()}}, {call, put}) {
      // const {DataRows} = yield call(usersService.fetch, {arg_typeid, arg_weekday}); //之前的
      // arg_time_type=1;
      arg_ou = Cookie.get('OU')
      yield put({
        type: 'save',
        // list: testdata.DataRows,  //假数据
        list: [],
        query: {
          arg_ou,
          arg_time_type,
          arg_typeid,
          arg_typeFlag, //新增
          arg_weekday
        }
      });

      const {DataRows} = yield call(usersService.fetch, {arg_ou, arg_time_type, arg_typeid, arg_weekday});


      if(arg_typeFlag==='1'){
        const {DataRows}=yield call(usersService.noticeSearch)
        yield put({
          type: 'saveNotice',
          notice:DataRows[0].notice_content
        });
      }
      yield put({
        type: 'save',
        // list: testdata.DataRows,  //假数据
        list: DataRows,
        query: {
          arg_ou,
          arg_time_type,
          arg_typeid,
          arg_typeFlag, //新增
          arg_weekday
        }
      });
    },
    *fetch2({query: {arg_ou="",arg_time_type=0,arg_typeid = '',arg_typeFlag='',arg_weekday = getToday()}}, {call, put}) {
      // const {DataRows} = yield call(usersService.fetch, {arg_typeid, arg_weekday}); //之前的
      // arg_time_type=1;
      arg_ou = Cookie.get('OU')
      const RESULT = yield call(usersService.meetroomTypeSearch, {arg_ou})
      if(RESULT.DataRows == null || RESULT.DataRows == ''){
        // message.warning("基础配置未完成，请联系配置管理员");
        yield put({
          type: 'saveErrorPage1',
          isErrorPage1: '1',
        });
        return;
      }
       arg_typeid = RESULT.DataRows[0].type_id;
       arg_typeFlag = RESULT.DataRows[0].type_flag;
      if(RESULT.RetCode == '1'){
        const {DataRows} = yield call(usersService.fetch, {arg_ou, arg_time_type, arg_typeid, arg_weekday});

        if(arg_typeFlag==='1'){
          const {DataRows}=yield call(usersService.noticeSearch)
          yield put({
            type: 'saveNotice',
            notice:DataRows[0].notice_content
          });
        }
        yield put({
          type: 'save',
          // list: testdata.DataRows,  //假数据
          list: DataRows,
          query: {
            arg_ou,
            arg_time_type,
            arg_typeid,
            arg_typeFlag, //新增
            arg_weekday
          }
        });
      }
    },

    *timeSearch({arg_ou}, {call, put}) {
      const {DataRows,RetCode} = yield call(usersService.timeSearch, {arg_ou});

      if(RetCode == '0'){
        message.warn('还未配置会议时间！');
      }
      yield put({
        type: 'timeSave',
        DataRows: DataRows,
      });
    },
    *timeSearch2({arg_ou,arg_time_type}, {call, put}) {
      const {title_name,RetCode} = yield call(usersService.timeSearch2, {arg_ou,arg_time_type});
      if(RetCode == '0'){
        message.warn('还未配置会议时间！');
      }
      if(title_name == null || title_name == ''){

        return;
      }
      yield put({
        type: 'timeSave2',
        DataRows: JSON.parse(title_name),
      });
    },
    *timeSearchOri({query:{arg_ou=Cookie.get('OU'),arg_time_type=0}}, {call, put}) { //一开始就调用这个方法，这样在页面一加载就可以获取到titleTimeRes，在didMount中用到
      const {title_name,RetCode} = yield call(usersService.timeSearch2, {arg_ou,arg_time_type});
      if(RetCode == '0'){
        message.warn('还未配置会议时间！');
      }
      yield put({
        type: 'timeSave2',
        DataRows: JSON.parse(title_name),
      });
    },
    *sxwSearch({arg_ou}, {call, put}) {
      const {DataRows,RetCode} = yield call(usersService.sxwSearch, {arg_ou});

      if(RetCode == '0'){
        message.warn('还未上午、下午、晚上！');
      }
      if(DataRows == null || DataRows == ''){
        yield put({
          type: 'saveErrorPage3',
          isErrorPage3: '1',
        });
        return;
      }
      yield put({
        type: 'sxwSave',
        DataRows: DataRows,
      });
    },

    *meetTypeSearch({arg_ou=Cookie.get('OU')}, {call, put}) {
      const {DataRows} = yield call(usersService.meetLevelSearch, {arg_ou});
      if(DataRows == null || DataRows == ''){
        yield put({
          type: 'saveErrorPage5',
          isErrorPage5: '1',
        });
        return;
      }
      yield put({
        type: 'meetTypeSave',
        DataRows: DataRows,
      });
    },

    *periodTimeSearch({arg_ou=Cookie.get('OU')}, {call, put}) {
      const {DataRows} = yield call(usersService.meetRoomCompany, {arg_ou});
      if(DataRows == null || DataRows == ''){
        // message.warning("基础配置未完成，请联系配置管理员配置");
        yield put({
          type: 'saveErrorPage2',
          isErrorPage2: '1',
        });
        return;
      }
      const periodTime = DataRows[0].period_time;
      yield put({
        type: 'periodTimeSave',
        period_time: periodTime,
      });
    },
    *meetroomTypeSearch({arg_ou}, {call, put}) {
      const {DataRows,RetCode} = yield call(usersService.meetroomTypeSearch, {arg_ou});
      if(RetCode == '0'){
        message.warn('会议室类型未配置好！');
      }
      yield put({
        type: 'meetroomTypeSave',
        DataRows: DataRows,
      });
    },

    *meetroomTypeSearchori({arg_ou}, {call, put}) {
      const {DataRows,RetCode} = yield call(usersService.meetroomTypeSearch, {arg_ou});
      if(RetCode == '0'){
        message.warn('会议室类型未配置好！');
      }
      // yield put({
      //   type: 'meetroomTypeSave',
      //   DataRows: DataRows,
      // });

      yield put({
        type:'fetch',
        query:{
              arg_ou: Cookie.get('OU'),
              arg_time_type:0,
              arg_typeid:DataRows[0].type_id, //上午，下午切换的时候，默认第一个显示的是配置的第一个会议室类型，如小型会议室
              // arg_typeid:'31d37b5c04c511e88955008cfa0519e0',
              arg_weekday: '2017-02-08',
            }
      })
    },

    *limitSearch({arg_staff_id}, {call, put}) {

      const {userState} = yield call(usersService.limitSearchNew, {arg_staff_id});
      if(userState=='0'){
        message.warn('被限制用户无法申请会议室！');
      }
      yield put({
        type: 'saveState',
        // userState: totalsum == '0'? 1: 0
        userState: parseInt(userState)
      });
    },
    *searchordered({arg_meeting_id,arg_ou,callback}, {call, put}) {
      const {DataRows,RetCode} = yield call(usersService.searchordered,{arg_meeting_id, arg_ou});

      if(RetCode == '1'){
        if(DataRows.length){
          callback(DataRows[0],DataRows[0].staff_id===Cookie.get('staff_id')?'update':'readonly')
          yield put({
            type: 'searchSave',
            DataRows
          });
        }
        else{
          message.error('查询失败！')
        }
      }
    },
    *searchequipment({arg_room_id}, {call, put}) {
      const {DataRows,RetCode} = yield call(usersService.searchEquipment,{arg_room_id});
      if(RetCode == '1'){
        if(DataRows.length){
          yield put({
            type: 'equipmentSave',
            equipment: DataRows[0].room_equipment,
            basicEquimpent: DataRows[0].room_basic_equipment,
          });
        }
        else{
          message.error('查询失败！')
        }
      }
    },

    *telSearch({arg_stuffid}, {call, put}) {
      const {DataRows} = yield call(usersService.telSearch, {
        transjsonarray: JSON.stringify({
          "property": {
            "tel": "stufftel"
          },
          "condition": {
            "stuff_id": arg_stuffid
          }
        })
      });
      localStorage['stufftel'] = DataRows[0].stufftel
    },
    *insertroommeeting({formData,callback,flag}, {call, put,select}) {
      const {room_name, stuff_tel, conference_title, num_people,
        type, type_id, order_day, time_quantum,s_time,e_time,ts,start_time,total_book_time} = formData;
      const mts=calcMts(time_quantum,'',conference_title);
      let arg_ts={},arg_mts={}
      for(let k in ts){
        arg_ts['arg_'+k]=ts[k]
      }
      for(let k in mts){
        arg_mts['arg_'+k]=mts[k]
      }
      let postData =
        {
          arg_room_name:room_name,
          arg_stuff_id: Cookie.get('staff_id'),
          arg_stuff_name: Cookie.get('username'),
          arg_stuff_tel:stuff_tel,
          arg_conference_title:conference_title,
          arg_s_time:s_time,
          arg_e_time:e_time,
          arg_num_people:num_people,
          arg_type_id:type_id,
          arg_week_day: moment(order_day).format('dddd'),
          arg_type:type,
          arg_order_state: "0",
          arg_time_quantum:JSON.stringify(time_quantum),
          arg_order_day:order_day,
          arg_day:order_day,
          ...arg_ts,
          ...arg_mts,
          arg_start_time:start_time,
          arg_total_book_time:total_book_time
        }
      //const {Meetid} = yield call(usersService.insertroommeeting,postData);
      const {RetCode} = yield call(usersService.bookmeetingnew_proc,postData);
      if(RetCode==='1'){
        callback()
        message.success('预定成功！')
        var query=yield select(state => state.meet.query);
        yield put({type: 'fetch', query});
      }

    },
    *insertroommeetingNew({formData,callback,flag}, {call, put,select}) {
      let startHours = formData.ts1._d.getHours();
      let endHours = formData.ts2._d.getHours();
      const startMinutes = formData.ts1._d.getMinutes();
      const endMinutes = formData.ts2._d.getMinutes();
      if(endHours == 0  && endMinutes == 0 ) {
        if(startHours !=0){
          endHours = 24;
        } else if( startHours == 0 && startMinutes > 0){
          endHours = 24;
        };
      };
      const startTime = startHours*60 + startMinutes;
      const endTime = endHours*60 + endMinutes;
      if(endTime <= startTime) {
        message.error("开始时间必须小于结束时间")
        return;
      }
      const { stuff_tel, conference_title, num_people,
        type, order_day, time_quantum,roomid,titleTimeRes,
        selectEquipment,videoAccess,cinlan_password,create_or_join,cinlan_id,cinlan_type,cinlan_vip,start_time,total_book_time} = formData;
        var videoAccessString = '';
        if(videoAccess!= undefined){
          for(let i = 0; i < videoAccess.length; i++){
            videoAccessString = videoAccessString + videoAccess[i] + ',';
          }
          videoAccessString = videoAccessString.slice(0,videoAccessString.length-1)
        }

      //将"["t1","t2"]"转换成"09:00,09:30"
      var time_quantum_string = "";
      var t1 = titleTimeRes["t1"].split("-")[1];
      var t2 = titleTimeRes["t1"].split("-")[0];
      var int1 = parseInt(t1.split(':')[0]) * 60 * 60 +   parseInt(t1.split(':')[1]) * 60;
      var int2 = parseInt(t2.split(':')[0]) * 60 * 60 +   parseInt(t2.split(':')[1]) * 60;
      var intervalTime = int1 - int2; //获取以秒计算的时间差 固定值1800
      var timequantum2 = JSON.stringify(time_quantum);
      var timequantum3 = timequantum2.substring(1,timequantum2.length-1);
      var timequantumarr = timequantum3.split(',');//数组[""t1"",""t2""]选中的对应表
      for(let i = 0; i < timequantumarr.length; i++){
        let temp = timequantumarr[i].substring(timequantumarr[i].indexOf('t')+1,timequantumarr[i].indexOf('"',1));
        let minuteInt = int2 + (parseInt(temp)-1) * intervalTime; //开始时间的分钟数
        //将秒转成“分：秒”的形式
        // var minuteS = Math.floor(minuteInt/60) + ":" + (minuteInt % 60 /100).toFixed(2).slice(-2);
        var theTime = minuteInt;
        var theTime1 = 0; //分
        var theTime2 = 0; //小时
        if(theTime > 60 || theTime == 0) {
            theTime1 = parseInt(theTime/60);
            // theTime = parseInt(theTime%60);
            if(theTime1 >= 60 || theTime1 <= 30) {
            theTime2 = parseInt(theTime1/60);
            theTime2 = theTime2 < 10 ? '0' + theTime2 : theTime2;
            theTime1 = parseInt(theTime1%60);
            theTime1 = theTime1 < 10 ? '0' + theTime1 : theTime1;
            }
        }
        var result = theTime2 + ":" + theTime1;//结束时间
        time_quantum_string  = time_quantum_string + result + "," // 07:30,08:00,08:30,09:00,09:30,10:00
      }
      time_quantum_string = time_quantum_string.substr(0, time_quantum_string.length - 1);
      let postData =
        {
          // arg_room_name:room_name,
          // arg_time_quantum2:JSON.stringify(time_quantum),
          arg_time_quantum:time_quantum_string,
          arg_room_id:roomid,
          arg_staff_id: Cookie.get('staff_id'),
          arg_staff_name: Cookie.get('username'),
          arg_meeting_title:conference_title,
          arg_number:num_people,
          arg_booker_tel:stuff_tel,
          arg_level_id: type, //注意这个地方type_id并不是level_id
          arg_book_day:order_day,
          arg_ou_id: Cookie.get('OUID'),
          arg_device:selectEquipment,
          arg_participants:videoAccessString,
          arg_normal_password:cinlan_password,
          arg_create_or_join:create_or_join,
          arg_cinlan_id:cinlan_id,
          arg_meeting_type:cinlan_type,
          arg_cinlan_vip:cinlan_vip,
          arg_start_time:start_time,
          arg_total_book_time:total_book_time
        }
        // alert(JSON.stringify(postData))

      //const {Meetid} = yield call(usersService.insertroommeeting,postData);
      const {RetCode} = yield call(usersService.bookmeetingNEW,postData);
      if(RetCode==='1'){
        callback()
        message.success('预定成功！')
        var query=yield select(state => state.meet.query);
        yield put({type: 'fetch', query});
      }else{
        message.error("预定失败");
      }
    },

    *insertOrder({formData,callback}, {call, put,select}) {
      const {
        room_name,
        stuff_tel,
        conference_title,
        num_people,
        type,
        type_id,
        day,
        //slider
      } = formData
      //var seTime = s_e_time(day, slider)
      var postData = [
        {
          room_name,
          "stuff_id": Cookie.get('staff_id'),
          "stuff_name": Cookie.get('username'),
          stuff_tel,
          conference_title,
          "s_time": '',
          "e_time": '',
          num_people,
          type_id,
          "week_day": moment(day).format('dddd'),
          type,
          "order_state": "0"
        }
      ]

      const {RetCode} = yield call(usersService.insertOrder, {transjsonarray: JSON.stringify(postData)});
      if (RetCode == '1') {
        message.success('预定成功')
        callback()
        var query=yield select(state => state.meet.query);
        yield put({type: 'fetch', query});
      }
    },

    *orderUpdate({formData,callback}, {call, put, select}) {
      let startHours = formData.ts1._d.getHours();
      let endHours = formData.ts2._d.getHours();
      const startMinutes = formData.ts1._d.getMinutes();
      const endMinutes = formData.ts2._d.getMinutes();
      if(endHours == 0  && endMinutes == 0) {
        if(startHours != 0) {
          endHours = 24;
        } else if(startHours == 0 && startMinutes > 0){
          endHours = 24;
        }

      }
      const startTime = startHours*60 + startMinutes;
      const endTime = endHours*60 + endMinutes;
      if(endTime <= startTime) {
        message.error("开始时间必须小于结束时间")
        return;
      }
      const {order_day,stuff_tel,conference_title,num_people,time_quantum2,meet_id,titleTimeRes,roomid,type,
        selectEquipment,videoAccess,cinlan_password,create_or_join,cinlan_id,cinlan_type,start_time,total_book_time} = formData
      // alert(JSON.stringify(formData))
      var videoAccessString = '';
      if(videoAccess!= undefined){
        for(let i = 0; i < videoAccess.length; i++){
          videoAccessString = videoAccessString + videoAccess[i] + ',';
        }
        videoAccessString = videoAccessString.slice(0,videoAccessString.length-1)
      }

      //将"["t1","t2"]"转换成"09:00,09:30"
      var time_quantum_string = "";
      var t1 = titleTimeRes["t1"].split("-")[1];
      var t2 = titleTimeRes["t1"].split("-")[0];
      var int1 = parseInt(t1.split(':')[0]) * 60 * 60 +   parseInt(t1.split(':')[1]) * 60;
      var int2 = parseInt(t2.split(':')[0]) * 60 * 60 +   parseInt(t2.split(':')[1]) * 60; //距离零点的秒数
      var intervalTime = int1 - int2; //获取以秒计算的时间差
      var timequantum2 = time_quantum2;
      var timequantum3 = timequantum2.substring(1,timequantum2.length-1);
      var timequantumarr = timequantum3.split(',');
      for(let i = 0; i < timequantumarr.length; i++){
        let temp = timequantumarr[i].substring(timequantumarr[i].indexOf('t')+1,timequantumarr[i].indexOf('"',1));
        let minuteInt = int2 + (parseInt(temp)-1) * intervalTime;
        //将秒转成“分：秒”的形式
        // var minuteS = Math.floor(minuteInt/60) + ":" + (minuteInt % 60 /100).toFixed(2).slice(-2);
        var theTime = minuteInt;
        var theTime1 = 0; //分
        var theTime2 = 0; //小时
        if(theTime > 60 || theTime == 0) {
          theTime1 = parseInt(theTime/60); //距离零点的分钟数
          // theTime = parseInt(theTime%60);
          if(theTime1 >= 60 || theTime1 <= 30) {
          theTime2 = parseInt(theTime1/60);
          theTime2 = theTime2 < 10 ? '0' + theTime2 : theTime2;
          theTime1 = parseInt(theTime1%60);
          theTime1 = theTime1 < 10 ? '0' + theTime1 : theTime1;
          }
        }
        var result = theTime2 + ":" + theTime1;
        time_quantum_string  = time_quantum_string + result + ","

      }
      time_quantum_string = time_quantum_string.substr(0, time_quantum_string.length - 1);
      let postData={
        arg_time_quantum: time_quantum_string,
        // arg_room_id: '286d92a80a4811e888f0008cfa0519e0',
        arg_room_id: roomid,
        arg_meeting_title: conference_title,
        arg_number: num_people,
        arg_booker_tel: stuff_tel,
        arg_level_id:type,
        // arg_level_id:'1b2839d6074f11e88955008cfa0519e0',  //三类会议
        arg_meeting_id: meet_id,
        arg_book_day: order_day,
        arg_ou_id: Cookie.get('OUID'),
        arg_device:selectEquipment,
        arg_participants:videoAccessString,
        arg_normal_password:cinlan_password,
        arg_create_or_join:create_or_join,
        arg_cinlan_id:cinlan_id,
        arg_meeting_type:cinlan_type,
        arg_start_time: start_time,
        arg_total_book_time: total_book_time
      }
      // alert(JSON.stringify(postData))

      const {RetCode} = yield call(usersService.rebookMeeting, postData);
      if (RetCode === '1') {
        message.success('修改成功！');
        callback();
        var query=yield select(state => state.meet.query);
        yield put({type: 'fetch', query});
      }
    },
    *showVIP({},{call,put}) {
      const res = yield call(usersService.showVIP)
      yield put({
        type:"saveDanger",
        payload:{
          vipList:JSON.parse(JSON.stringify(res))
        }
      })
    },
    *orderCancel({formData,callback}, {call, put, select}) {

      let  arg_meeting_id = formData.meet_id;

      const {RetCode} = yield call(usersService.cancelOrderNew, {arg_meeting_id});
      if (RetCode === '1') {
        message.success('取消成功！');
        callback();
        let query=yield select(state => state.meet.query);
        yield put({type: 'fetch', query});
      }

    },
    *timeoccupySearch({formData,callback}, {call, put}) {

      const {room_name, day} = formData
      const {RowCount} = yield call(usersService.timeoccupySearch, {
        transjsonarray: JSON.stringify({
          "condition": {
            "room_name": room_name,
            "day": day
          }
        })
      });
      if (RowCount == '0') {
        yield put({type: 'timeoccupyInsert', formData,callback});
      } else {
        // var postDate=[
        //   {"update": {...ts},
        //   "condition":
        //   {"room_name":room_name,"day":day}}
        // ]

        yield put({type: 'timeoccupyUpdate', formData,callback});
      }
    },
    *timeoccupyUpdate({formData,callback,flag='1'}, {call, put,select}) {
      let {ts,room_name,order_day,mts,meet_id}=formData
      for(let key in mts){
        if(mts[key]){
          mts[key]=meet_id+mts[key]
        }

      }

      var postData=[
        {"update": {...ts,...mts},
        "condition":
        {"room_name":room_name,"day":order_day}}
      ]

      const {RetCode} = yield call(usersService.timeoccupyUpdate, {transjsonarray: JSON.stringify(postData)});
      if (RetCode == '1') {

        // if(flag=='1'){
        //   yield put({type: 'insertOrder', formData,callback});
        // }else{
        //   message.success('操作成功！')
        //   callback()
        //   var query=yield select(state => state.meet.query);
        //   yield put({type: 'fetch', query});
        // }

        message.success('操作成功！');
        callback();
        var query=yield select(state => state.meet.query);
        yield put({type: 'fetch', query});
      }
    },
    *timeoccupyInsert({formData,callback}, {call, put,select}) {
      const {room_name, order_day, ts,mts} = formData
      var postData = [
        {
          room_name,
          "stuff_name": Cookie.get('username'),
          "stuff_id": Cookie.get('staff_id'),
          "day": order_day,
          "t1": "0",
          "t2": "0",
          "t3": "0",
          "t4": "0",
          "t5": "0",
          "t6": "0",
          "t7": "0",
          "t8": "0",
          "t9": "0",
          "t10": "0",
          "t11": "0",
          "t12": "0",
          "mt1":'',
          "mt2":'',
          "mt3":'',
          "mt4":'',
          "mt5":'',
          "mt6":'',
          "mt7":'',
          "mt8":'',
          "mt9":'',
          "mt10":'',
          "mt11":'',
          "mt12":'',
          ...ts,
          ...mts
        }
      ];

      const {RetCode} = yield call(usersService.timeoccupyInsert, {transjsonarray: JSON.stringify(postData)});
      if (RetCode == '1') {
        //yield put({type: 'insertOrder', formData,callback});
        message.success('预定成功');
        callback();
        var query=yield select(state => state.meet.query);
        yield put({type: 'fetch', query});
      }
    },
    //查询重要出席者

    *noticeInsert({notice_content,callback}, {call, put}) {

      const {RetCode} = yield call(usersService.noticeInsert, {
        "transjsonarray":JSON.stringify([{notice_content, type_id: 2}])
      });
      if(RetCode==='1'){
        message.success('修改成功！')
        yield put({
          type:'saveNotice',
          notice:notice_content
        })
        callback()
      }else{
        message.error('修改失败！')
      }
    }
  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname}) => {

        if (pathname === '/adminApp/meetSystem/order') {
          dispatch({type: 'fetch2',query:{}});
          dispatch({type: 'meetTypeSearch',query:{}});
          dispatch({type: 'periodTimeSearch',query:{}});
          dispatch({type: "showVIP"})
        }
      });
      },
    },
  };
