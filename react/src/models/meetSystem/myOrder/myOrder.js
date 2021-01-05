/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-27
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 我的预定页面的逻辑处理层
  */

import * as usersService from '../../../services/meetSystem/meetSystem.js';
import {getToday} from '../../../utils/func.js'
import {message} from 'antd'
import Cookie from 'js-cookie';


export default {
  namespace: 'myorder',
  state: {
    list: [],
    query:{},
    userState:2
  },

  reducers: {
    save(state, { list: DataRows}) {
      return { ...state, list:DataRows};
    },
    saveState(state, { userState: userState }) {

      return { ...state, userState:userState};
    },
  },

  effects: {

    /**
     * 作者：卢美娟
     * 创建日期：2017-08-20
     * 功能：我的预定页面，查询我的预定结果
     *  @param arg_stuffid  查询的员工ID
     */
    *myorderSearch({arg_stuffid}, { call, put }) {
      var stuffid = Cookie.get('staff_id');
      // console.log(stuffid);
      const  {DataRows}  = yield call(usersService.myorderSearch,
        {transjsonarray:JSON.stringify({
          "property": {"meet_id":"meetid","type_id":"typeid","stuff_name":"stuffname","stuff_tel":"stufftel","num_people":"numpeople","type":"type"
        ,"s_time":"starttime","e_time":"endtime","order_day":"orderday","week_day":"weekday","room_name":"roomname","cancel_reason":"cancelreason",
        "conference_title":"conferencetitle","order_state":"orderstate","time_quantum":"time_quantum"},
          "condition":{"stuff_id":stuffid},
          "sequence":[{"e_time":true}]
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
     * 功能：我的预定页面，取消预定的功能
     *  @param arg_meetid  要取消的meetid
     *  @param arg_time_quantum  要取消的时间段
     *  @param arg_roomname  要取消的会议室名称
     *  @param arg_orderday  预定日期
     */
    *cancelOrder({arg_meetid,arg_time_quantum,arg_roomname,arg_orderday}, {call, put}) {
      var postData=[{
        "update": {
          "order_state":"2",
        },
        "condition":{"meet_id":arg_meetid}
      }]
      const {RetCode} = yield call(usersService.cancelOrder, {transjsonarray: JSON.stringify(postData)});
      if(RetCode =='1'){
        var quantum = JSON.parse(arg_time_quantum);

        let mts={};
        let ts={};
        quantum.map((i)=>{
          // console.log(i);
          mts['m'+i]='';
          ts[i]='0'
        });

        var postData2=[
          {"update": {...ts,...mts},
          "condition":
          {"room_name":arg_roomname,"day":arg_orderday}}
        ]

        const {RetCode} = yield call(usersService.timeoccupyUpdate, {transjsonarray: JSON.stringify(postData2)});
        if (RetCode == '1') {
          message.success("取消成功");
          //刷新页面
          var stuffid = Cookie.get('staff_id');
          const  {DataRows}  = yield call(usersService.myorderSearch,
            {transjsonarray:JSON.stringify({
              "property": {"meet_id":"meetid","type_id":"typeid","stuff_name":"stuffname","stuff_tel":"stufftel","num_people":"numpeople","type":"type"
            ,"s_time":"starttime","e_time":"endtime","order_day":"orderday","week_day":"weekday","room_name":"roomname","cancel_reason":"cancelreason",
            "conference_title":"conferencetitle","order_state":"orderstate","time_quantum":"time_quantum"},
              "condition":{"stuff_id":stuffid},
              "sequence":[{"e_time":true}]
          })}
           );
           yield put({
             type: 'save',
             list: DataRows,
            //  query:{'0864957'}
           });
        }
      }else{
        message.error("取消失败");
      }
    },

    *cancelOrderNew({arg_meeting_id}, {call, put}) {

      const {RetCode} = yield call(usersService.cancelOrderNew, {arg_meeting_id});
      if(RetCode =='1'){

          message.success("取消成功");
          //刷新页面
          // var arg_booker_id = Cookie.get('staff_id');
          var arg_booker_id = Cookie.get('staff_id');  //暂时写死
          const {DataRows} = yield call(usersService.myorderSearchNew, {arg_booker_id});
          yield put({
            type: 'save',
            list: DataRows,
            //  query:{'0864957'}
          });

      }else{
        message.error("取消失败");
      }
    },

    /**
     * 作者：卢美娟
     * 创建日期：2018-02-02
     */


     *myorderSearchNew({arg_booker_id}, { call, put }) {
       arg_booker_id = Cookie.get('staff_id');
       // var arg_booker_id = '0881798';  //暂时写死
       const {DataRows} = yield call(usersService.myorderSearchNew, {arg_booker_id});
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

        if (pathname === '/adminApp/meetSystem/myOrder') {

       dispatch({ type: 'myorderSearchNew',query });
        }
      });
    },
  },
};
