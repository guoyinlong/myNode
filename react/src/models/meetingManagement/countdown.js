import Cookie from 'js-cookie';
import * as Services from '../../services/meetingManagement/meetingManageSer';
import { message } from 'antd';
export default {
  namespace:'countdown',
  state: {
    meetingMinute:'',//会议时间-分钟
    meetingSecond:'',//会议时间-秒
    lastIssue:'', //当前议题
    nextIssue:'', //下个议题
    marginDistance:'5%',//距离
    countdownText:"",
  },
  reducers: {
    initData(state) {
      return{
        ...state,
      }
    },
    save(state, action) {
      return {...state,...action.payload};
    },
  },
  effects: {
    *countdownInit({},{call,select,put}) {
      yield put ({
        type: "save",
        payload: {
          meetingMinute:'',//会议时间-分钟
          meetingSecond:'',//会议时间-秒
          lastIssue:'', //当前议题
          nextIssue:'', //下个议题
          marginDistance:'5%',//距离
          countdownText:"",
        }
      })
    },
    //倒计时查询服务
    *inidTime({},{call,put}){
     let postData = {
       arg_ou_id :Cookie.get("OUID")
     };
     let data = yield call (Services.CountDownSearch,postData);
      console.log(data.DataRows,1);
      console.log( data.DataRows[0].returnMin.length);
      if(data.RetCode === '1'){
         for(let i=0;i<data.DataRows.length;i++){
           yield put ({
             type: "save",
             payload: {
               lastIssue:data.DataRows[i].topicName,//当前议题
               nextIssue:data.DataRows[i].nextTopicName,//下一个议题
               meetingMinute:data.DataRows[i].returnMin,//会议时间-分钟
               meetingSecond:data.DataRows[i].returnSec,//会议时间-秒
               countdownText:data.DataRows[i].state, //0倒计时，1倒计时反向递增
             }
           })
         }
       }else {
        message.error(data.RetVal);
      }
    },
    // 进入全屏页面
    *screenPage({}, {put}){
      let element = document.getElementById("content");
      let requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
      if (requestMethod) {
        requestMethod.call(element);
        yield put ({
          type: "save",
          payload: {
            marginDistance:'13%'
          }
        })
      } else if (typeof window.ActiveXObject !== "undefined") {
        let wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    //结束本次会议
    *endMeeting({}, {call}){
      let postData = {
        arg_ou_id :Cookie.get("OUID")
      };
      let data = yield call(Services.CountDownEnd,postData);
      if(data.RetCode === '1'){
        message.success("结束本次会议！");
      }
    },
  },
  subscriptions: {
    setup({dispatch,history}){
      let  oTime;
      return history.listen(({ pathname, query }) => {
        dispatch({type: 'initData'});
        if(pathname === '/adminApp/meetManage/countdown'){
          dispatch({type:'countdownInit',query});
          dispatch({type:'downStart',query});
          dispatch({type:'inidTime',query});
        }
        if(pathname === '/adminApp/meetManage/countdown'){
          oTime = setInterval(() => {
            dispatch({type:'inidTime',query});
        },1000)
        }else {
            // dispatch({type:'countdownInit',query});
            clearInterval(oTime);
        }
      });
    },
  },
}