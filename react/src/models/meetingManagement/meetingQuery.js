/**
 * 作者：张枫
 * 创建日期：2019-07-09
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：会议确认
 */
import Cookie from 'js-cookie';
import * as Services from '../../services/meetingManagement/meetingManageSer';
import {getUuid} from './../../components/commonApp/commonAppConst.js';
import { message } from 'antd';
export default {
  namespace : 'meetingQuery',
  state :{
    willMeetingList : [
      {
        key: '010',
        topic_name: '中国联通软件研究院总经理办公室2019年第5次会议',
        time: '1',
        note_room_name: '1',
      }
    ] ,//待上会会议列表
    fileList : [], // 下载文件列表
    doneMeetingList : [],//已上会会议列表
    noteID :"",//保存会议id
    addTopicList :[], // 议题池中议题列表，可添加议题
    selectedTopic : "" ,//补充议题 被勾选的议题列表
    meetingList : [],//会议类型列表查询
    tempKey : "",
    pageSize : 10,
    page: 1,
    RowCounts :"",
    doneParam : {
      type_id : "", //会议类型
      note_state : "0",//会议状态
      note_name : "",//会议名称
    },
    addTopicParam :[{
      meetingType : "",
      topicNameInput : "",
    }],//补充议题modal 框查询数据条件
    meetingStateList :
    // [{name :"全部",key:""},{name :"待归档",key:"0"},{name:"归档中",key:"1"},{name:"已归档",key:"2"}],
      [{name :"全部",key:"0"},{name :"待归档",key:"1"},{name:"归档中",key:"2"},{name:"已归档",key:"3"}],
    currentKey:"1",//当前选中的key
    userType:"0",//会议查询权限 "0"普通员工、"1"相关人员 "2"办公室管理员
  },
  reducers : {
    initData(state) {
      return{
        ...state,
      }
    },
    save(state, action) {
      return {...state,...action.payload};
    },
  },
  effects : {
    *init({},{ select,put,call }){
      yield put ({
        type : "save",
        payload : {
          willMeetingList : [] ,//待上会会议列表
          fileList : [], // 下载文件列表
          doneMeetingList : [],//已上会会议列表
          noteID :"",//保存会议id
          addTopicList :[], // 议题池中议题列表，可添加议题
          selectedTopic : "" ,//补充议题 被勾选的议题列表
          meetingList : [],//会议类型列表查询
          tempKey : "",
          pageSize : 10,
          page: 1,
          RowCounts :"",
          doneParam : {
            type_id : "", //会议类型
            note_state : "0",//会议状态
            note_name : "",//会议名称
          },
          addTopicParam :[{
            meetingType : "",
            topicNameInput : "",
          }],//补充议题modal 框查询数据条件
          meetingStateList :
            [{name :"全部",key:"0"},{name :"待归档",key:"1"},{name:"归档中",key:"2"},{name:"已归档",key:"3"}],
          //  [{name :"全部",key:""},{name :"待归档",key:"0"},{name:"归档中",key:"1"},{name:"已归档",key:"2"}],
          currentKey:"1",//当前选中的key
          userType:"0",//会议查询权限 "0"普通员工、"1"相关人员 "2"办公室管理员
        }
      })
      yield put ({ type : "queryMeetings"});
    },
    // 未上会会议列表查询
    *queryMeetings({},{call,put}){
      let postData = {
        arg_user_id :""
      }
      let data = yield call (Services.queryMeeting,postData);
      if(data.RetCode === '1'){
        // 拼接时间 年月日
        data.DataRows.length && data.DataRows.map((item,index)=>{
          item.key = index;
          item.time = item.note_year+"-"+item.note_month+"-"+item.note_day+"  "+item.note_time;
        })
        yield put ({
          type : 'save',
          payload : {
            willMeetingList : JSON.parse(JSON.stringify(data.DataRows)),
            tempKey : getUuid(20,62),
            page:1,
            //currentKey:"1",
          }
        })
      }
    },
    //未上会查询议题列表
    *queryTopicList({ record },{ select,put,call}){
      const { willMeetingList } = yield select( state => state.meetingQuery );
      let postData = {
        arg_note_id : record.note_id,
        arg_user_id:Cookie.get("userid")
      };
      let data = yield call (Services.queryTopicList,postData);
      if( data.RetCode === "1"){
        data.DataRows.length &&  data.DataRows.map((item,index)=>{
          item.key = index;
        })
        willMeetingList.length && willMeetingList.map(( item,index)=>{
          if( item.note_id == record.note_id){
            item["topticlist"] = JSON.parse(JSON.stringify(data.DataRows));
          }
        })
      }
      yield put ({
        type : "save",
        payload : {
          willMeetingList : JSON.parse(JSON.stringify(willMeetingList)),
          noteID :record.note_id,
          userType:data.UserType
        }
      })
    },
    //未上会会议议题附件查询 并拼接数据
    *expandWillTopic({record},{ select,put,call }){
      const { willMeetingList,noteID} = yield select(state=>state.meetingQuery);
      let postData = {
        arg_upload_topic_name : record.topic_name,
      };
      let data = yield call(Services.queryUpload,postData);
      if( data.RetCode === "1"){
        data.DataRows.length && data.DataRows.map((item,index)=>{
          item.key = index;
        });
        willMeetingList.length && willMeetingList.map((item,index)=>{
          if(item.note_id === noteID){
            item.topticlist.length && item.topticlist.map((innerItem,innerIndex)=>{
              if(innerItem.topic_id === record.topic_id){
                innerItem["fileList"]=JSON.parse(JSON.stringify(data.DataRows));
              }
            })
          }
        })
        yield put({
          type : "save",
          payload : {
            willMeetingList : JSON.parse(JSON.stringify(willMeetingList)),
          }
        });
      }
    },
    //会议文件下载
    *downloadFile({ record },{ select,put,call }){
      const { noteID } = yield select( state=>state.meetingQuery);
      //notice通知单  、agenda 会议议程  、sin 签到表  、signature 审签单、record 会议记录
      if( record.type === "notice"){
        let temp = "/microservice/allmanagementofmeetings/ExportMeetingNoteWord/ExportMeetingNoteWord";//???????/
        let url = temp+"?"+"noteid"+"="+noteID
        window.open(url);
      }else if( record.type === "agenda"){
        let temp = "/microservice/allmanagementofmeetings/agendaOfTheMeetingDownload/agendaOfTheMeetingDownload";
        let url = temp+"?"+"arg_note_id"+"="+noteID
        window.open(url);
      }else if(record.type === "sin"){
        let temp = "/microservice/allmanagementofmeetings/conferenceCheckinFormDownload/conferenceCheckinFormDownload";
        let url = temp+"?"+"arg_note_id"+"="+noteID
        window.open(url);
      }else if(record.type ==="signature"){
        let temp = "/microservice/allmanagementofmeetings/signatureSheetDownload/signatureSheetDownload";
        let url = temp+"?"+"arg_topic_name"+"="+record.name
        window.open(url);
      }else if (record.type ==="record"){
        let temp = "/microservice/allmanagementofmeetings/minutesOfTheMeetingDownload/minutesOfTheMeetingDownload";
        let url = temp+"?"+"arg_note_id"+"="+noteID
        window.open(url);
      }
    },
    //已上会会议列表查询
    *queryDoneMeetings ({},{ select,put,call }){
      const { doneParam,page,pageSize } = yield select (state=>state.meetingQuery);
      let postData = {
        arg_page_size:pageSize,
        arg_page_current:page,
        arg_note_state: doneParam.note_state,
        arg_type_id : doneParam.type_id,
        arg_note_name :doneParam.note_name,
        arg_user_id :""
      };
      let data = yield call (Services.queryConfirmedMeeing,postData);
      if (data.RetCode === "1"){
        yield put({
          type:"save",
          payload : {
            doneMeetingList : data.DataRows,
            noteID : "",//切换 tab  会议id清空
            tempKey : getUuid(20,62),
            RowCounts : data.RowCount,
            //currentKey:"2",
          }
        })
      }
    },
    //切换已上会会议面板  查询议题列表
    *changeCollapse({ key },{ select,put,call}){
      const { doneMeetingList } =  yield select( state => state.meetingQuery)
      let postData = {
        arg_note_id : key,
        arg_page_size : "10",
        arg_page_current : "1",
        arg_user_id:Cookie.get("userid")
      };
      let data = yield call(Services.queryTopicList ,postData);
      if( data.RetCode === "1" ){
        data.DataRows.length && data.DataRows.map((item,index)=>{
          item.key = index;
        })
        doneMeetingList.length && doneMeetingList.map((item,index)=>{
          item.key = index;
          if(item.note_id === key){
            item["topicList"] = JSON.parse(JSON.stringify(data.DataRows));
          }
        })
        yield put ({
          type:"save",
          payload :{
            doneMeetingList : JSON.parse(JSON.stringify(doneMeetingList)),
            noteID : key, //保存会议id
            userType:data.UserType
          }
        })
      }
    },
    //查询已上会议题附件列表
    *queryDoneFileList({ record },{ select,put,call }){
      const {doneMeetingList,noteID} = yield select ( state=>state.meetingQuery);
      let postData = {
        arg_upload_topic_name : record.topic_name  //会议议题名称
      };
      let data = yield call(Services.queryUpload,postData);
      if ( data.RetCode==="1"){
        data.DataRows.length && data.DataRows.map((item,index)=>{
          item.key = index;
        });
        doneMeetingList.length && doneMeetingList.map((item,index)=>{
          if (item.note_id === noteID){
            item.topicList.length && item.topicList.map(( innerItem,innerIndex)=>{
              if(innerItem.topic_id === record.topic_id){
                innerItem.fileList = JSON.parse(JSON.stringify(data.DataRows));
              }
            })
          }
        })
        yield put ({
          type : "save",
          payload :{
            doneMeetingList : JSON.parse(JSON.stringify(doneMeetingList)),
          }
        })
      }
    },
    // 已上会会议议题退回
    *doneSendBack({record},{select,put,call}){
      let postData = {
        arg_topic_id : record.topic_id,
        arg_user_id : Cookie.get("userid"),
        arg_user_name : Cookie.get("username"),
      };
      let data = yield call(Services.returnTopic,postData);
      if( data.RetCode === "1"){
        message.success("议题退回成功！")
        yield put ({
          type :"queryDoneMeetings"
        }) // 退回成功后走一遍查询服务  一是少了议题要刷新，二是重新刷新 会议文件内容需要同步更新
      }else {
        message.error("议题退回失败！")
      }
    },
    //已上会会议议题取消
    *cancelTopic({record},{select,put,call}){
      let postData = {
        arg_topic_id : record.topic_id,
        arg_user_id : Cookie.get("userid"),
        arg_user_name : Cookie.get("username"),
      };
      let data = yield call(Services.cancelTopic,postData);
      if(data.RetCode ==="1"){
        message.success("议题取消成功！")
        yield put ({
          type :"queryDoneMeetings"
        }) // 退回成功后走一遍查询服务   一是少了议题要刷新，二是重新刷新 会议文件内容需要同步更新
      }else{
        message.error("议题取消失败！");
      }
    },
    //已上会会议议题开启归档流程
    *beginTopicFile({record},{select,put,call}){
      let postData={
        arg_topic_id : record.topic_id,
        arg_user_id : Cookie.get("userid"),
        arg_user_name : Cookie.get("username"),
      };
      let data = yield call(Services.BeginTopicFile,postData);
      if(data.RetCode ==="1"){
        message.success("操作成功！");
        yield put ({
          type :"queryDoneMeetings"
        }) // 退回成功后走一遍查询服务    会议状态有可能需要重新走服务刷新  待归档、归档中、
      }else {
        message.success("操作失败！");
      }
    },
    // 查询会议类型列表
    *queryMeetingTypeList({},{ select,put,call}){
      let postData = {
        arg_type_ou_id : Cookie.get("OUID")
      }
      let data = yield call (Services.queryTypeSearch,postData);
      if(data.RetCode === "1"){
        data.DataRows.push({"type_name":"全部","type_id":""})
        yield put({
          type:"save",
          payload:{
            //meetingList:data.DataRows
            meetingList:JSON.parse(JSON.stringify(data.DataRows.reverse())),
          }});
      }
    },
    //已上会会议tab 切换会议类型保存
    *changeDoneMeetingType({key},{select,put,call}){
      let { doneParam} = yield select ( state=>state.meetingQuery);
      doneParam.type_id = key
      yield put({type:"save",payload:{doneParam:JSON.parse(JSON.stringify(doneParam)),page:1}});
    },
    //已上会会议切换会议状态保存
    *changeMeetingState({key},{select,put,call}){
      let { doneParam} = yield select ( state=>state.meetingQuery);
      doneParam.note_state = key
      yield put({type:"save",payload:{doneParam:JSON.parse(JSON.stringify(doneParam)),page:1}});
    },
    //已上会会议 查询input 框保存
    *doneInput({ value },{select,put,call}){
      let { doneParam} = yield select ( state=>state.meetingQuery);
      doneParam.note_name = value;
      yield put({type:"save",payload:{doneParam:JSON.parse(JSON.stringify(doneParam)),page:1}});
    },
    //清空已上会会议查询条件，并查询
    *clearQueryMeetings({},{put,select}){
      let { doneParam} = yield select ( state=>state.meetingQuery);
      doneParam.note_name = "",
        doneParam.note_state = "0",
        doneParam.type_id = "",
        yield put({
          type : "save",
          payload :{
            doneParam : JSON.parse(JSON.stringify(doneParam)),
          }
        })
      yield put ({type:"queryDoneMeetings"})
    },
    //变更补充议题查询条件数据
    *changeAddTopicParam({value,addtype},{select,put,call}){
      let { addTopicParam } = yield select(state=>state.meetingQuery);
      if(addtype === "addTopicMeetingType"){
        addTopicParam[0].meetingType = value;
        yield put ({
          type:"save",
          paylaod:{
            addTopicParam:[...addTopicParam]
          }
        });
      }else if(addtype === "addTopicNameInput"){
        addTopicParam[0].topicNameInput = value.target.value;
        yield put ({
          type:"save",
          paylaod:{
            addTopicParam:[...addTopicParam]
          }
        });
      }
    },
    //清空补充议题 查询议题列表查询条件
    *clearQueryAddTopicList({},{ select,put,call}){
      const {addTopicParam} = yield select( state=>state.meetingQuery);
      addTopicParam.meetingType ="",
        addTopicParam.topicNameInput = "",
        yield put({
          type : "save",
          payload : {
            addTopicParam : JSON.parse(JSON.stringify(addTopicParam)),
          }
        })
    },
    // 修改页面
    *changePage({page},{ select,put,call}){
      yield put({
        type : "save",
        payload : {page : page,}
      })
      yield put ({type:"queryDoneMeetings"})
    },
    // 修改页面
    *changeTabOne({key},{ put}){
      yield put ({type:"clearQueryMeetings"})
      yield put ({type:"queryMeetings"})
      yield put ({type:"save",payload:{currentKey:key}})
    },
    *changeTabTwo({key},{put}){
      yield put ({type:"clearQueryMeetings"})
      yield put ({type:"queryDoneMeetings"})
      yield put ({type:"queryMeetingTypeList"})
      yield put ({type:"save",payload:{currentKey:key}})
    },
  },
  subscriptions : {
    setup({dispatch,history}){
      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/meetManage/meetingQuery') {
          dispatch({type:'init',query});
        }
      });
    },
  }
}
