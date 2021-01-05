/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 会议列表页面的逻辑处理层
  */
import * as usersService from '../../../services/meetSystem/meetSystem.js'
// import {getToday} from '../../../utils/func.js'
import {getToday} from '../../../components/meetSystem/meetConst.js'
import moment from 'moment';  //时间
import Cookie from 'js-cookie';
import {message} from 'antd'
const dateFormat = 'YYYY-MM-DD';
export default {
  namespace: 'meetList',
  state: {
    list: [],
    query:{},
    userState:2,
    isErrorPage:'0',
  },

  reducers: {
    save(state, { list: DataRows, query: {arg_select_time,arg_meet_type}}) {
      //debugger
      return {
         ...state,
         list:DataRows,
         query:{arg_select_time,arg_meet_type}
       };
    },
    saveState(state, { userState: userState }) {

      return { ...state, userState:userState};
    },
    saveTypeName(state, { typeNameList: typeNameList }) {

      return { ...state, typeNameList,};
    },
    saveErrorPage(state, { isErrorPage:isErrorPage }) {
      // alert(roomName)
      return { ...state, isErrorPage:isErrorPage};
    },
  },

  effects: {
    // *meetListori({}, { call, put }) {
    //   var myDate = new Date();  //国际标准时间
    //   var y = myDate.getFullYear();
    //   var m = myDate.getMonth() + 1;
    //   m = m < 10 ? '0' + m : m;
    //   var d = myDate.getDate();
    //   d = d < 10 ? ('0' + d) : d;
    //   var day = y + '-' + m + '-' + d;
    //
    //   //debugger
    //   var postData={
    //     arg_select_time:day,
    //     arg_meet_type:null
    //   }
    //   const {DataRows} = yield call(usersService.searchMeetList, postData);
    //
    //    yield put({
    //      type: 'save',
    //      list: DataRows,
    //      query:{
    //        arg_select_time,
    //        arg_meet_type
    //      }
    //    });
    // },


    /**
     * 作者：卢美娟
     * 创建日期：2017-08-20
     * 功能：点击会议列表页面时，初始化查询
     *  @param arg_meet_type  查询的会议室类型
     *  @param arg_select_time 查询会议室的时间
     */
    *meetListori({query: {arg_meet_type = null ,arg_select_time = getToday()}}, { call, put }) {

      const {DataRows} = yield call(usersService.searchMeetList, {arg_meet_type, arg_select_time});

       yield put({
         type: 'save',
         list: DataRows,
         query:{
           arg_select_time,
           arg_meet_type
         }
       });
    },
    /**
     * 作者：卢美娟
     * 创建日期：2018-02-03
     * 功能：点击会议列表页面时，初始化查询
     *  @param arg_ou_id  ou
     *  @param arg_meeting_date 查询会议室的时间
     *  @param arg_room_type_id 查询会议室的类型
     */
    *meetListNew({query: {arg_ou_id = null,arg_meeting_date = getToday(),arg_room_type_id = null,arg_ou }}, { call, put }) {
      // console.log(Cookie.get())
      arg_ou = Cookie.get('OU');
      //获取ou_id
      const tempDataRows = yield call(usersService.meetroomTypeSearch, {arg_ou});
      if(tempDataRows.DataRows == null || tempDataRows.DataRows == ''){
        // message.warning("会议室类型没有被配置，请联系配置管理员配置");
        yield put({
          type: 'saveErrorPage',
          isErrorPage: '1',
        });
        return;
      }
      arg_ou_id = tempDataRows.DataRows[0].ou_id;
      if(tempDataRows.RetCode == '1'){
        arg_room_type_id = '';
        const {DataRows} = yield call(usersService.searchMeetListNew, {arg_ou_id, arg_meeting_date,arg_room_type_id});

         yield put({
           type: 'save',
           list: DataRows,
           query:{
             arg_ou_id,
             arg_select_time:arg_meeting_date, //注意这个地方的写法，把新的变量赋给老的变量返回，这样route页面中的变量不用变了
             arg_meet_type:arg_room_type_id
           }
         });
      }
    },

    *typenameSearch({query: {arg_ou }}, { call, put }) {

       //查询不同ou的会议类型并保存,先获取全部room信息，从中去除type_name，并保存
       arg_ou = Cookie.get('OU');
       const {DataRows} = yield call(usersService.meetRoomType, {arg_ou});
       var typeNameList = {};
       if(DataRows!='' && DataRows!=undefined){
         for(let i = 0; i < DataRows.length; i++){
           // typeNameList[i] = DataRows[i].type_name;
           typeNameList[DataRows[i].type_id] =  DataRows[i].type_name
         }
       }
       // console.log(JSON.stringify(typeNameList));
       yield put({
         type: 'saveTypeName',
         typeNameList: typeNameList,

       });
    },

    /**
     * 作者：卢美娟
     * 创建日期：2017-08-20
     * 功能：会议列表页面，点击查询按钮，查询出的结果
     *  @param arg_meet_type  查询的会议室类型
     *  @param arg_select_time 查询会议室的时间
     */
    *meetListSearch({arg_select_time=moment(getToday()).format('YYYY-MM-DD'),arg_meet_type=0}, { call, put }) {
      //debugger
      var postData={
        arg_select_time:arg_select_time,
        arg_meet_type:arg_meet_type
      }
      const {DataRows} = yield call(usersService.searchMeetList, postData);
      // console.log(DataRows);

       yield put({
         type: 'save',
         list: DataRows,
        //  query:{'0864957'}
        query:{
          arg_ou_id,
          arg_select_time,
          arg_meet_type
        }
       });
    },
    /**
     * 作者：卢美娟
     * 创建日期：2018-02-05
     */
    *meetListSearchNew({arg_ou_id,arg_room_type_id,arg_meeting_date=moment(getToday()).format('YYYY-MM-DD')}, { call, put }) {
      //debugger

      const {DataRows} = yield call(usersService.searchMeetListNew, {arg_ou_id,arg_room_type_id,arg_meeting_date});

       yield put({
         type: 'save',
         list: DataRows,
         query:{
           arg_ou_id,
           arg_select_time:arg_meeting_date, //注意这个地方的写法，把新的变量赋给老的变量返回，这样route页面中的变量不用变了
           arg_meet_type:arg_room_type_id
         }
       });


    },
  },
  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {
        //debugger
        if (pathname === '/adminApp/meetSystem/meetList') {
           dispatch({ type: 'meetListNew',query });
           dispatch({ type: 'typenameSearch',query });
        }
      });


    },
  },
};
