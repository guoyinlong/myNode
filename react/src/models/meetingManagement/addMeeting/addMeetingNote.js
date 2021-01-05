/**
 * 作者： 杨青
 * 创建日期： 2019-07-10
 * 邮箱: yangq41@chinaunicom.cn
 * 功能： 会议管理-会议生成-生成会议通知
 */
import * as Services from '../../../services/meetingManagement/addMeetingService';
import {message} from 'antd';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'addMeetingNote',
  state: {
    queryParam:{},
    topicList:[],
    meetingRoom:[],
    meetingParam:{},
    meeting_order:'',
    meeting_title:'',
    editAble:true,
    meeting_id:'',
  },

  reducers: {
    initData(state) {
      return {
        ...state,
        queryParam:{},
        topicList:[],
        meetingRoom:[],
        meetingParam:{},
        meeting_order:'',
        meeting_title:'',
        editAble:true,
        meeting_id:'',
      }
    },
    save(state, action) {
      return {...state, ...action.payload};
    }
  },

  effects: {
    *init({query},{call,select,put}) {
      let queryParam = {
        arg_topic_type:query.arg_topic_type,
        arg_page_current:query.arg_page_current,
      };
      let year=new Date().getFullYear().toString();
      let month = new Date().getMonth() + 1;
      let date = new Date().getDate();
      let weekArray = new Array("日","一","二","三","四","五","六");
      let week = weekArray[new Date(year+'-'+month+'-'+date).getDay()];
      let meetingParam = {
            room_name : '',
            year: new Date().getFullYear().toString(),
            month : new Date().getMonth() + 1,
            date : new Date().getDate(),
            time : '08:00',
            week : week,
            type_name:query.type_name,
          };
            yield put({
              type : 'save',
              payload:{
                queryParam,
                meetingParam,
              }
            });
            yield put({
              type: 'queryMeetingOrder'
            });
            yield put({
              type: 'queryPassedMeetingTopic'
            });
            yield put({
              type: 'queryMeetingRoomList'
            });
          },
        *initAddTopic({query},{call,select,put}){
        // console.log(query,11111)//arg_note_id
          yield put({
              type: 'queryMeetingRoomList'
            });
            let postMeetingInfoData = {
              arg_note_name:query.arg_note_name,
              arg_page_size:'10',
              arg_page_current:'1',
              arg_type_id:'',
              arg_note_state:'',
            };
            let meetingInfo = yield call(Services.queryMeetingInfo, postMeetingInfoData);
            if (meetingInfo.RetCode === '1'){
              let meetingParam = {
                room_id : meetingInfo.DataRows[0].note_room_id,
                room_name: meetingInfo.DataRows[0].note_room_name,
                year: meetingInfo.DataRows[0].note_year,
                month : meetingInfo.DataRows[0].note_month,
                date : meetingInfo.DataRows[0].note_day,
                time : meetingInfo.DataRows[0].note_time,
                week : meetingInfo.DataRows[0].note_week,
              };
              let queryParam = {
                arg_topic_type:meetingInfo.DataRows[0].type_id,
              };
              let postMeetingTopicData = {
                arg_note_id:query.arg_note_id,
              };
              let meetingTopicList = yield call(Services.queryMeetingTopicList, postMeetingTopicData);
              if (meetingTopicList.RetCode === '1'){
                let postAddTopicData = {
                  arg_topic_ids:query.arg_topic_ids,
                  arg_user_id:Cookie.get('userid'),
                  arg_topic_type:queryParam.arg_topic_type,
                };
                let addTopicList = yield call(Services.queryPassedMeetingTopic, postAddTopicData);
                if (addTopicList.RetCode === '1'){
            let topicList = meetingTopicList.DataRows.concat(addTopicList.DataRows);
            if (topicList.length){
              topicList.map((i,index)=>{
                i.key=index+1;
                i.number=index+1;
              })
            }
            yield put({
              type : 'save',
              payload:{
                topicList,
              }
            });
          }
          yield put({
            type : 'save',
            payload:{
              meetingParam,
              meeting_title:query.arg_note_name,
              editAble:false,
              meeting_order:meetingInfo.DataRows[0].note_order,
              queryParam,
              meeting_id:query.arg_note_id,
            }
          });
        }
      }
    },
    *queryMeetingOrder({},{call,select,put}){
      let {queryParam,meetingParam} = yield select(state =>state.addMeetingNote);
      let postData = {
        arg_type_id:queryParam.arg_topic_type,
        arg_note_year:meetingParam.year,
      };
      let data = yield call(Services.queryMeetingOrder, postData);
      if (data.RetCode === '1'){
        yield put({
          type : 'save',
          payload:{
            meeting_order:data.DataRows[0].meeting_order,
            meeting_title:'中国联通软件研究院'+meetingParam.type_name+ meetingParam.year+'年第'+data.DataRows[0].meeting_order+'次会议',
          }
        });
      }else{
        message.error(data.RetVal);
      }
    },
    *queryPassedMeetingTopic({},{call,select,put}){
      let {queryParam} = yield select(state =>state.addMeetingNote);
      let postData = {
        arg_topic_type:queryParam.arg_topic_type,
        arg_user_id:Cookie.get('userid'),
      };
      let data = yield call(Services.queryPassedMeetingTopic, postData);
      if (data.RetCode === '1'){
        if (data.DataRows.length){
          data.DataRows.map((i,index)=>{
            i.key=index+1;
            i.number=index+1;
            i.create_date= i.create_date.substring(0,19);
          })
        }
        yield put({
          type : 'save',
          payload:{
            topicList:data.DataRows,
          }
        });
      }else{
        message.error(data.RetVal);
      }
    },
    *setTopicIndex({number,key},{select,call,put}){
      let {topicList} = yield select(state =>state.addMeetingNote);
      for(let i=0;i<topicList.length;i++){
        if (topicList[i].key===key){
          topicList[i].number = number;
        }
      }
      yield put({
        type : 'save',
        payload:{
          topicList:JSON.parse(JSON.stringify(topicList)),
        }
      });
    },

    *cancelTopic({id},{select,call,put}){
      let {topicList} = yield select(state =>state.addMeetingNote);
      topicList = topicList.filter(item => item.id !== id);
      yield put({
        type : 'save',
        payload:{
          topicList:JSON.parse(JSON.stringify(topicList)),
        }
      });
    },
    *queryMeetingRoomList({},{select,call,put}){
      let data = yield call(Services.queryMeetingRoomList);
      if (data.RetCode === '1'){
        if (data.DataRows.length){
          data.DataRows.map((i,index)=>i.key=index+1)
        }
        yield put({
          type : 'save',
          payload:{
            meetingRoom:data.DataRows,
          }
        });
      }else{
        message.error(data.RetVal);
      }
    },
    //会议室
    *changeParam({value,condType},{select,put,call}){
      let {meetingParam, queryParam} = yield select(state => state.addMeetingNote);
      meetingParam[condType] = value;
      yield put({
        type: 'save',
        payload: {
          meetingParam: JSON.parse(JSON.stringify(meetingParam))
        }
      });

      //时间变化  中国联通软件研究院xxx  xx年第xxx次会议
      let postData = {
        arg_type_id:queryParam.arg_topic_type,
        arg_note_year:meetingParam.year,
      };
      let data = yield call(Services.queryMeetingOrder, postData);
      if (data.RetCode === '1'){
        yield put({
          type : 'save',
          payload:{
            meeting_order:data.DataRows[0].meeting_order,
            meeting_title:'中国联通软件研究院'+meetingParam.type_name+ meetingParam.year+'年第'+data.DataRows[0].meeting_order+'次会议',
          }
        });
      }else{
        message.error(data.RetVal);
      }
      yield put({
        type: 'queryMeetingOrder'
      });
    },
    //会议通知
    *confirmAddMeeting({},{select,put,call}){
      let {topicList,queryParam,meetingParam,meeting_order,meeting_title} = yield select(state =>state.addMeetingNote);
      topicList.sort((a,b)=>{return a.number>b.number?1:-1});
      let orderList = [];
      for(let i=0;i<topicList.length;i++){
        orderList.push(topicList[i].topic_id);
      }
      let postData = {
        arg_type_id:queryParam.arg_topic_type,// 会议类型ID
        arg_note_name:meeting_title,//会议通知名称
        arg_note_year:meetingParam.year,//会议举行年
        arg_note_month:meetingParam.month.toString().length===1?'0'+meetingParam.month.toString():meetingParam.month,//会议举行月
        arg_note_day:meetingParam.date,//会议举行日
        arg_note_week:meetingParam.week,//会议举行星期
        arg_note_time:meetingParam.time,//会议举行时间
        arg_note_order:meeting_order,//年度会议次序
        arg_note_room_id:meetingParam.room_name,//会议室ID
        arg_create_user_id:Cookie.get('staff_id'),//创建人ID
        arg_create_user_name:Cookie.get('username'),//创建人姓名
        arg_topic_id:orderList.join(','),//议题ID(多个按次序用逗号隔开)
      };
      let data = yield call(Services.confirmAddMeeting, postData);
      if(data.RetCode ==='1'){
        message.success('会议生成成功！');
        window.location.reload();
        yield put({
          type: 'doneJump',
          flag:true,
        });
      }else{
        message.error(data.RetVal);
      }
    },
    *addTopic({},{select,put,call}){
      let {topicList, meeting_id} = yield select(state =>state.addMeetingNote);
      topicList.sort((a,b)=>{return a.number>b.number?1:-1});
      let orderList = [];
      for(let i=0;i<topicList.length;i++){
        orderList.push(topicList[i].topic_id);
      }
      let postData = {
        arg_note_id:meeting_id,
        arg_topic_id:orderList.join(','),
        arg_user_id:Cookie.get('staff_id'),
        arg_user_name:Cookie.get('username'),
      };
      let data = yield call(Services.addTopic, postData);
      if(data.RetCode ==='1'){
        message.success('补充议题成功！');
        yield put({
          type: 'doneJump',
          flag:false,
        });
      }else{
        message.error(data.RetVal);
      }
    },
    *doneJump({flag},{select,put,call}){
      let {queryParam} = yield select(state =>state.addMeetingNote);
      if (flag){
        yield put(routerRedux.push({
          pathname: '/adminApp/meetManage/addMeeting',
          query:queryParam,
        }))
      }else{
        yield put(routerRedux.push({
          pathname: '/adminApp/meetManage/meetingConfirm',
        }))
      }
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        dispatch({type: 'initData'});
        if (pathname === '/adminApp/meetManage/addMeeting/addMeetingNote') {
          dispatch({type: 'init', query});
        }
        if (pathname === '/adminApp/meetManage/meetingConfirm/addTopicToMeeting') {
          dispatch({type: 'initAddTopic', query});
        }
      });
    },
  },
};
