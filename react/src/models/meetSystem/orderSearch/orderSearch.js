/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 预定查询页面的逻辑处理层
  */
import * as usersService from '../../../services/meetSystem/meetSystem.js';
import {getToday} from '../../../utils/func.js'
import nowTime from '../../../components/common/getnowtime.js'
import {message} from 'antd'
import Cookie from 'js-cookie';

export default {
  namespace: 'orderSearch',
  state: {
    list: [],
    query:{},
    userState:2,
    roomTypeRes:[],
    roomNameRes:[],
    isErrorPage:'0',
    isErrorPage2:'0',
  },

  reducers: {
    save(state, { list: DataRows}) {
      return { ...state, list:DataRows};
    },
    saveState(state, { userState: userState }) {
      return { ...state, userState:userState};
    },
    saveRoomType(state, { DataRows }) {
      return { ...state, roomTypeRes: DataRows};
    },
    saveRoomName(state, { DataRows,roomName }) {
      // alert(roomName)
      return { ...state, roomNameRes: DataRows, initialRoomName: roomName};
    },
    saveErrorPage(state, { isErrorPage:isErrorPage }) {
      // alert(roomName)
      return { ...state, isErrorPage:isErrorPage};
    },
    saveErrorPage2(state, { isErrorPage2:isErrorPage2 }) {
      // alert(roomName)
      return { ...state, isErrorPage2:isErrorPage2};
    },

    saveDeptId(state, { deptIdList: deptIdArr }) {
      // alert(roomName)
      return { ...state, deptIdList: deptIdArr};
    },
  },

  effects: {
        /**
         * 作者：卢美娟
         * 创建日期：2017-08-20
         * 功能：预定查询页面，根据会议室名称，查询出的结果
         *  @param arg_roomname  会议室的名称
         */
    *myorderSearch({arg_roomname}, { call, put }) {
      const  {DataRows}  = yield call(usersService.myorderSearch,
        {transjsonarray:JSON.stringify({
          "property": {"meet_id":"meetid","stuff_id":"stuffid","stuff_name":"stuffname","stuff_tel":"stufftel","num_people":"numpeople","type":"type"
        ,"s_time":"starttime","e_time":"endtime","order_day":"orderday","week_day":"weekday","room_name":"roomname",
        "conference_title":"conferencetitle","order_state":"orderstate","time_quantum":"time_quantum","cancel_reason":"cancel_reason"},
          "condition":{"room_name":'T007',"order_state":0},
          "sequence":[{"s_time":true}]
      })}
       );
       yield put({
         type: 'save',
         list: DataRows,
        //  query:{'0864957'}
       });
    },
    *orderSearchNew({arg_room_id=''}, { call, put }) {
      // if(arg_room_id == ''){
      //   //获取初始room_id，也就是DataROws的第一条数据
      //   // const  RES  = yield call(usersService.meetRoomC,{arg_ou});
      //   // arg_room_id = RES.DataRows[0].room_id;
      //   // if(RES.RetCode == '1'){
      //   //   const  {DataRows}  = yield call(usersService.orderSearchNew,{arg_room_id});
      //   //    yield put({
      //   //      type: 'save',
      //   //      list: DataRows,
      //   //    });
      //   // }
      //   //初始就让它为空
      // }

      const  {DataRows}  = yield call(usersService.orderSearchNew,{arg_room_id});
       yield put({
         type: 'save',
         list: DataRows,
       });

    },

    *searchRoomType({arg_ou}, { call, put }) {
      arg_ou = Cookie.get('OU');
      const  {DataRows}  = yield call(usersService.meetroomTypeSearch,{arg_ou});
      if(DataRows == null || DataRows == ''){
        yield put({
          type: 'saveErrorPage',
          isErrorPage: '1',
        });
        return;
      }
       yield put({
         type: 'saveRoomType',
         DataRows: DataRows,
       });
    },

    *searchRoomName({arg_ou}, { call, put }) {
      arg_ou = Cookie.get('OU');
      const  {DataRows}  = yield call(usersService.meetRoomC,{arg_ou});
      if(DataRows == null || DataRows == ''){
        // message.warning("会议室类型没有被配置，请联系配置管理员配置");
        // global.orderSearchError = 1;
        // // window.location.href = "http://www.baidu.com"
        // return;
        yield put({
          type: 'saveErrorPage2',
          isErrorPage2: '1',
        });
        return;
      }
       yield put({
         type: 'saveRoomName',
         DataRows: DataRows,
         roomName: DataRows[0].room_name,
       });
    },

    *searchDeptId({}, { call, put }) {
      const  {RetCode,DataRows}  = yield call(usersService.searchDeptId);
      var deptIdArr = [];
      if(RetCode == '1'){
        if(DataRows){
          for(let i = 0; i < DataRows.length; i++){
            deptIdArr.push(DataRows[i].deptid)
          }
        }
        yield put({
          type: 'saveDeptId',
          deptIdList: deptIdArr,
        });
      }
    },


    /**
     * 作者：卢美娟
     * 创建日期：2017-08-20
     * 功能：预定查询页面，根据会议室名称，查询出的结果
     *  @param arg_roomname  会议室的名称
     */
    *myorderSearch11({arg_roomname}, { call, put }) {
      const  {DataRows}  = yield call(usersService.myorderSearch,
        {transjsonarray:JSON.stringify({
          "property": {"meet_id":"meetid","stuff_id":"stuffid","stuff_name":"stuffname","stuff_tel":"stufftel","num_people":"numpeople","type":"type"
        ,"s_time":"starttime","e_time":"endtime","order_day":"orderday","week_day":"weekday","room_name":"roomname",
        "conference_title":"conferencetitle","order_state":"orderstate","cancel_reason":"cancel_reason","time_quantum":"time_quantum"},
          "condition":{"room_name":arg_roomname,"order_state":0},
          "sequence":[{"s_time":true}]
      })}
       );
       yield put({
         type: 'save',
         list: DataRows,
        //  query:{'0864957'}
       });

    },

    /**
     * 作者：卢美娟
     * 创建日期：2017-08-20
     * 功能：将取消原因插入数据库
     *  @param arg_meetid  预定的meetid
     *  @param arg_cancelreason  取消原因
     */
    *orderUpdate({arg_meetid,arg_cancelreason}, { call, put }) {
       //将取消原因插入数据库
        var postData=[{
          "update": {
            "cancel_reason":arg_cancelreason,
          },
          "condition":{"meet_id":arg_meetid}
        }]
        const {RetCode} = yield call(usersService.orderUpdate, {transjsonarray: JSON.stringify(postData)});
        if(RetCode =='1'){
          // message.success("取消成功");
        }else{
          message.error("取消失败");
        }
    },

    /**
     * 作者：卢美娟
     * 创建日期：2017-08-20
     * 功能：取消预定
     *  @param arg_meetid  要取消的meetid
     *  @param arg_time_quantum  要取消的时间段
     *  @param arg_roomname  要取消的会议室名称
     *  @param arg_orderday  预定日期
     */
    *cancelOrder({arg_meetid,arg_time_quantum,arg_roomname,arg_orderday}, { call, put }) {  //将order_state的值从0->3
      var postData=[{
        "update": {
          "order_state":"3",
        },
        "condition":{"meet_id":arg_meetid}
      }]
      const {RetCode} = yield call(usersService.cancelOrder, {transjsonarray: JSON.stringify(postData)});
      if(RetCode =='1'){
        var quantum = JSON.parse(arg_time_quantum);

        let mts={};
        let ts={};
        quantum.map((i)=>{
          mts['m'+i]='';
          ts[i]='0'
        });

        var postData3=[
          {"update": {...ts,...mts},
          "condition":
          {"room_name":arg_roomname,"day":arg_orderday}}
        ]
        const {RetCode} = yield call(usersService.timeoccupyUpdate, {transjsonarray: JSON.stringify(postData3)});
        if (RetCode == '1') {
          message.success("强制取消成功");
          //刷新页面
          const  {DataRows}  = yield call(usersService.myorderSearch,
            {transjsonarray:JSON.stringify({
              "property": {"meet_id":"meetid","stuff_id":"stuffid","stuff_name":"stuffname","stuff_tel":"stufftel","num_people":"numpeople","type":"type"
            ,"s_time":"starttime","e_time":"endtime","order_day":"orderday","week_day":"weekday","room_name":"roomname",
            "conference_title":"conferencetitle","order_state":"orderstate","cancel_reason":"cancel_reason"},
              "condition":{"room_name":arg_roomname,"order_state":0},
              "sequence":[{"s_time":true}]
          })}
           );
           yield put({
             type: 'save',
             list: DataRows,
            //  query:{'0864957'}
           });

        }


      }
      else{
        message.error("取消失败");
      }

    },
    /**
     * 作者：卢美娟
     * 创建日期：2017-08-20
     * 功能：限制某个员工预定会议室
     *  @param arg_stuffid  要限制的员工的stuffid
     *  @param arg_stuffname  要限制的员工的姓名
     */
    *insertLimit({arg_stuffid,arg_stuffname}, { call, put }) {  //限制预定
        var myDate = new Date();  //国际标准时间
        var y = myDate.getFullYear();
        var m = myDate.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = myDate.getDate();
        d = d < 10 ? ('0' + d) : d;
        var startday = y + '-' + m + '-' + d;

        var d2 = myDate.getDate() + 10;
        //d2 = d2 < 10 ? ('0' + d2) : d2;
        y = parseInt(y);
        m = parseInt(m);

        d2 = parseInt(d2);

        if (m == 2) {
            if (d2 > 28) {
                d2 = d2 - 28;
                m = m + 1;
                if (m > 12) {
                    m = m - 12;
                    y = y + 1;
                }
            }
        }
        else if (m == 4 || m == 6 || m == 9 || m == 11) {
            if (d2 > 30) {
                d2 = d2 - 30;
                m = m + 1;
                if (m > 12) {
                    m = m - 12;
                    y = y + 1;
                }
            }
        }
        else if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) {
            if (d2 > 31) {
                d2 = d2 - 31;
                m = m + 1;
                if (m > 12) {
                    m = m - 12;
                    y = y + 1;
                }
            }
        }
        m = m < 10 ? '0' + m : m;
        d2 = d2 < 10 ? ('0' + d2) : d2;
        var endday = y + '-' + m + '-' + d2;
      var postData = [
        {
          "stuff_id": arg_stuffid,
          "stuff_name": arg_stuffname,
          "limit_stime":startday,
          "limit_etime":endday,
          "limit_state":0
        }
      ]

      const  {RetCode}  = yield call(usersService.insertLimit,
        {transjsonarray:JSON.stringify(postData)}
       );
       if(RetCode == '1'){
         message.success("限制成功");
       }
       else{
         message.error('限制失败');
       }
    },

    *dolimitBooker({paramdata}, { call, put }) {  //限制预定
      const  {RetCode}  = yield call(usersService.dolimitBooker,{...paramdata});
       if(RetCode == '1'){
         message.success("限制成功");
       }
       else{
         message.error('限制失败');
       }
    },


    /**
     * 作者：卢美娟
     * 创建日期：2018-02-05
     * 功能：将取消原因插入数据库
     *  @param arg_meetid  预定的meetid
     *  @param arg_cancelreason  取消原因
     */
    *forceCancel({arg_meeting_id,arg_cancel_reason,arg_room_id}, { call, put }) {
       //将取消原因插入数据库
        const {RetCode} = yield call(usersService.forceCancel, {arg_meeting_id,arg_cancel_reason});
        if(RetCode =='1'){
          message.success("强制取消成功");
        }else{
          message.error("强制取消失败");
        }

        //刷新页面
        // arg_room_id = '7c16a11c058d11e88955008cfa0519e0' //暂时写死
        const  {DataRows}  = yield call(usersService.orderSearchNew,{arg_room_id});
         yield put({
           type: 'save',
           list: DataRows,
          //  query:{'0864957'}
         });

    },

  },
  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/meetSystem/orderSearch') {
        dispatch({ type: 'orderSearchNew',query });
        dispatch({ type: 'searchRoomType',query });
        dispatch({ type: 'searchRoomName',query }); //如果默认是“请选择会议名称”，而不是第一个roomname就不需要了
        dispatch({ type: 'searchDeptId',query})
        }
      });


    },
  },
};
