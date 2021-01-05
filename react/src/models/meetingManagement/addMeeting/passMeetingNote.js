/**
 * 作者： 韩爱爱
 * 创建日期： 2020-3-24
 * 邮箱: yangq41@chinaunicom.cn
 * 功能： 会议管理-院长已通过拟上会清单
 */
import * as Services from '../../../services/meetingManagement/addMeetingService';
import {message} from 'antd';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import request from "../../../utils/request";
export default {
  namespace: 'passMeetingNote',
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
          queryParam:queryParam,
          meetingParam:meetingParam,
        }
      });
      //议题列表
      let  listData = {
        arg_topic_type:query.arg_topic_type,//会议类型ID
        arg_state:'0',//0通过界面
      };
      let data = yield call(Services.searchMeetingList, listData);
      data.DataRows.map((item,index)=>{
        item.number=index+1;
        item.key=index+1;
        item.create_date= item.create_date.substring(0,19);
      });
      if(data.RetCode === '1'){
        yield put({
          type : 'save',
          payload:{
            topicList:data.DataRows,
          }
        });
      }else {
        message.success('暂无数据！');
      }
    },
    //中国联通软件研究院xxx  xx年第xxx次会议
    *queryMeetingOrder({},{call,select,put}){
      let {queryParam,meetingParam} = yield select(state =>state.passMeetingNote);
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
    //会议室
    *changeParam({value,condType},{select,put,call}){
      let {meetingParam, queryParam, topicList} = yield select(state => state.passMeetingNote);
      meetingParam[condType] = value;
      yield put({
        type: 'save',
        payload: {
          meetingParam: JSON.parse(JSON.stringify(meetingParam))
        }
      });
      //时间变化  中国联通软件研究院xxx  xx年第xxx次会议变化
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
    //确认生成-确定
    *cancelTopic({id},{select,call,put}){
      let {topicList} = yield select(state =>state.passMeetingNote);
      topicList = topicList.filter(item => item.id !== id);
      yield put({
        type : 'save',
        payload:{
          topicList:JSON.parse(JSON.stringify(topicList)),
        }
      });
    },

    *confirmAddMeeting({},{select,put,call}){
      let {topicList,queryParam,meetingParam,meeting_order,meeting_title} = yield select(state =>state.passMeetingNote);
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
    *setTopicIndex({number,key},{select,call,put}){
      let {topicList} = yield select(state =>state.passMeetingNote);
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
  },
  subscriptions: {
    setup({dispatch, history }) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/meetManage/addMeeting/passMeetingNote') {
          dispatch({type: 'initData'});
          dispatch({type: 'init', query});
          dispatch({type: 'queryMeeting', query});
          dispatch({type: 'queryMeetingOrder', query});
          dispatch({type: 'componentDidMount', query});
        }
        if (pathname === '/adminApp/meetManage/meetingConfirm/passTopicToMeeting') {
          dispatch({type: 'initAddTopic', query});
        }
      });
    },
  },
};
