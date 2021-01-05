/**
 * 作者：张枫
 * 创建日期：2019-07-09
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：会议确认
 */
import Cookie from 'js-cookie';
import * as Services from '../../services/meetingManagement/meetingManageSer';
import * as AddServices from '../../services/meetingManagement/addMeetingService';
import { message } from 'antd';
import {getUuid} from './../../components/commonApp/commonAppConst.js';
export default {
  namespace : 'meetingConfirm',
  state :{
    willMeetingList : [] ,//待上会会议列表
    fileList : [], // 下载文件列表
    doneMeetingList : [],//已上会会议列表
    noteID :"",//保存会议id
    addTopicList :[], // 议题池中议题列表，可添加议题
    selectedTopic : "" ,//补充议题 被勾选的议题列表
    meetingList : [],//会议类型列表查询
    tempKey : "1",
    doneParam : {
      type_id : "", //会议类型
      note_state : "0",//会议状态
      note_name : "",//会议名称
    },
    addTopicName : "",
    addMeetingType:"",
    // meetingStateList :[{name :"全部",key:""},{name :"待归档",key:"0"},{name:"归档中",key:"1"},{name:"已归档",key:"2"}],
    meetingStateList :[{name :"全部",key:"0"},{name :"待归档",key:"1"},{name:"归档中",key:"2"},{name:"已归档",key:"3"}],
    pageSize : 10,
    addTopicPage:"1",
    page: "1",
    RowCounts :"",
    addTopicRowCounts :"",
    returnRes:"",
    currentKey:"1",
    materialsSelection:[],//下载议题文件列表
    openAll:"1",//开启归档状态
    countdownName :"",//倒计时时间
    countdownIssue:{},
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
          doneParam : {
            type_id : "", //会议类型
            note_state : "0",//会议状态
            note_name : "",//会议名称
          },
          addTopicName : "",
          addMeetingType:"",
          meetingStateList :[{name :"全部",key:"0"},{name :"待归档",key:"1"},{name:"归档中",key:"2"},{name:"已归档",key:"3"}],
          //meetingStateList :[{name :"全部",key:""},{name :"待归档",key:"0"},{name:"归档中",key:"1"},{name:"已归档",key:"2"}],
          pageSize : 10,
          addTopicPage:"1",
          page: "1",
          RowCounts :"",
          returnRes:"",
          currentKey:"1",  //默认选中的tab
          materialsSelection:[],//下载议题文件列表
          openAll:"1",//开启归档状态
          countdownName :"",//倒计时时间
          countdownIssue:{},
        }
      });
      yield put ({ type : "queryMeetings"});
    },
    // 未上会会议列表查询
    *queryMeetings({},{call,put}){
      let postData = {
        arg_user_id :Cookie.get("userid")
      };
      let data = yield call (Services.queryMeeting,postData);
      if(data.RetCode === '1'){
        // 拼接时间 年月日
        data.DataRows.length && data.DataRows.map((item,index)=>{
          item.key = index;
          item.time = item.note_year+"-"+item.note_month+"-"+item.note_day+"  "+item.note_time;
        });
        yield put ({
          type : 'save',
          payload : {
            willMeetingList : JSON.parse(JSON.stringify(data.DataRows)),
            tempKey : getUuid(20,62),
            page:1,
            addTopicName:"",
            currentKey:"1",
          }
        })
      }

    },
    //未上会查询议题列表
    *queryTopicList({ record },{ select,put,call}){
      const { willMeetingList } = yield select( state => state.meetingConfirm );
      let postData = {
        arg_note_id : record.note_id,
      };
      let data = yield call (Services.queryTopicList,postData);
      if( data.RetCode === "1"){
        data.DataRows.length &&  data.DataRows.map((item,index)=>{
          item.key = index;
        });
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
        }
      });
    },
    //未上会会议议题附件查询 并拼接数据
    *expandWillTopic({record},{ select,put,call }){
      const { willMeetingList,noteID,fileList} = yield select(state=>state.meetingConfirm);
      let postData = {
        // arg_upload_topic_name : record.topic_name, //会议议题名称
        arg_topic_id :record.topic_id , //会议题ID
        arg_submit_id:record.submit_id,// 批次id
      };
      let data = yield call(Services.queryUpload,postData);
      // console.log(data,'并拼接数据');
      if( data.RetCode === "1"){
        data.DataRows.length && data.DataRows.map((item,index)=>{
          item.key = index;
        });
        willMeetingList.length && willMeetingList.map((item,index)=>{
          if(item.note_id === noteID){
            item.topticlist.length && item.topticlist.map((innerItem,innerIndex)=>{
              if(innerItem.topic_id === record.topic_id){
                innerItem["fileList"]=JSON.parse(JSON.stringify(data.DataRows));
                // fileList.push(JSON.parse(JSON.stringify(data.DataRows)))
              }
            })
          }
        });
        yield put({
          type : "save",
          payload : {
            // fileList:fileList,
            willMeetingList : JSON.parse(JSON.stringify(willMeetingList)),
          }
        });
      }
    },
    // 查询会议文件列表
    *queryFileList({ record },{ select,put,call}){
      let postData = {
        //arg_type_id : record.note_id,
        // arg_type_name : record.note_name,
        arg_type_name : record.type_name,
        arg_note_year : record.note_year,
        arg_note_order : record.note_order,
      };
      // 调用文件
      let data = yield call(Services.queryFileList,postData);
      let postDa = {arg_note_id : record.note_id,};
      //调用审签单文件
      let dataFile = yield call(Services.queryImportantFileList,postDa);
      if ( data.RetCode === "1"){
        let temp = data.DataRows[0]["file"];
        temp = JSON.parse("[" + temp + "]");
        //删除数组中统称会议审签单
        let flag = "";
        temp.length && temp.map((item,index)=>{
          if(item.type=="signature"){
            flag = index;
          }
        });
        temp.splice(flag,1,);
        // 向数组中添加审签单
        if(dataFile.RetCode ==="1"){
          dataFile.DataRows.map((item,index)=>{
            if(item.topic_if_important=="1"){
              temp.push(
                {
                  //"name":'"三重一大"事项会议审签单'+item.topic_name,
                  "name":item.topic_name,
                  "type":"signature",
                }
              );
            }
          })
        }
        temp.length && temp.map((item,index)=>{
          item.key = index;
        });
        //构造数组
        yield put({
          type : "save",
          payload:{
            //fileList : JSON.parse("[" + temp + "]"),
            fileList : JSON.parse(JSON.stringify(temp)),
            noteID : record.note_id,
          }
        })
      }
    },
    //会议文件下载
    *downloadFile({ record },{ select,put,call }){
      const { noteID } = yield select( state=>state.meetingConfirm);
      console.log(noteID,'noteID');
      //notice通知单  、agenda 会议议程  、sin 签到表  、signature 审签单、record 会议记录  、minutes 会议纪要
      if( record.type === "notice"){
        let temp = "/microservice/allmanagementofmeetings/ExportMeetingNoteWord/ExportMeetingNoteWord";
        let url = temp+"?"+"noteid"+"="+noteID;
        window.open(url);
      }else if( record.type === "agenda"){
        let temp = "/microservice/allmanagementofmeetings/agendaOfTheMeetingDownload/agendaOfTheMeetingDownload";
        let url = temp+"?"+"arg_note_id"+"="+noteID;
        window.open(url);
      }else if(record.type === "sin"){
        let temp = "/microservice/allmanagementofmeetings/conferenceCheckinFormDownload/conferenceCheckinFormDownload";
        let url = temp+"?"+"arg_note_id"+"="+noteID;
        window.open(url);
      }else if(record.type ==="signature"){
        let temp = "/microservice/allmanagementofmeetings/signatureSheetDownload/signatureSheetDownload";
        let url = temp+"?"+"arg_topic_name"+"="+record.name;
        window.open(url);
      }else if (record.type ==="record"){
        let temp = "/microservice/allmanagementofmeetings/minutesOfTheMeetingDownload/minutesOfTheMeetingDownload";
        let url = temp+"?"+"arg_note_id"+"="+noteID;
        window.open(url);
      }else if(record.type ==="minutes"){
        let temp = "/microservice/allmanagementofmeetings/newmeetings/ExportMinutesWord";
        let url = temp+"?"+"arg_noteid"+"="+noteID;
        window.open(url);
      }
    },
    // 全部文件下载
    *downloadAllFile({allFileList},{select,put,call}){
      const { noteID } = yield select( state=>state.meetingConfirm);
      allFileList.length !==0 && allFileList.map((item,index)=>{
        if( item.type === "notice"){
          console.log("1");
          let temp = "/microservice/allmanagementofmeetings/ExportMeetingNoteWord/ExportMeetingNoteWord";
          let url = temp+"?"+"noteid"+"="+noteID;
          window.open(url);
          //window.location.href=url;
        }else if( item.type === "agenda"){
          console.log("2");
          let temp = "/microservice/allmanagementofmeetings/agendaOfTheMeetingDownload/agendaOfTheMeetingDownload";
          let url = temp+"?"+"arg_note_id"+"="+noteID;
          window.open(url);
          //window.location.href=url;
        }else if(item.type === "sin"){
          console.log("3");
          let temp = "/microservice/allmanagementofmeetings/conferenceCheckinFormDownload/conferenceCheckinFormDownload";
          let url = temp+"?"+"arg_note_id"+"="+noteID;
          window.open(url);
          //window.location.href=url;
        }else if(item.type ==="signature"){
          console.log("4");
          let temp = "/microservice/allmanagementofmeetings/signatureSheetDownload/signatureSheetDownload";
          let url = temp+"?"+"arg_topic_name"+"="+item.name;
          //window.location.href=url;
          window.open(url);
        }else if (item.type ==="record"){
          console.log("5");
          let temp = "/microservice/allmanagementofmeetings/minutesOfTheMeetingDownload/minutesOfTheMeetingDownload";
          let url = temp+"?"+"arg_note_id"+"="+noteID;
          window.open(url);
          //window.location.href=url;
        }else if(item.type ==="minutes"){
          console.log("6");
          let temp = "/microservice/allmanagementofmeetings/newmeetings/ExportMinutesWord";
          let url = temp+"?"+"arg_noteid"+"="+noteID;
          window.open(url);
        }
      })
    },
    // 未上会会议 取消会议
    *confirmCancelMeeting ({ record },{ select,put,call }){
      let postData = {
        arg_note_id : record.note_id,
        arg_user_id : Cookie.get( "userid"),
        arg_user_name : Cookie.get("username"),
      };
      let data = yield call (Services.cancelMeeting,postData);
      if( data.RetCode === "1"){
        message.success("会议取消成功！");
        yield put ({ type : "queryMeetings"}) //重新查询会议列表
      }

    },
    // 未上会会议  确认发送钉钉消息
    *confirmInform({ record },{ select ,put ,call }){
      // console.log(record,'未上会会议,确认发送钉钉消息');
      let postData = {
        arg_note_id : record.note_id,
        // arg_user_id : Cookie.get( "userid"),
        // arg_user_name : Cookie.get("username"),
      };
      console.log(postData,'通知');
      let data = yield call (Services.confrimInform,postData);
      console.log(data,'通知data');
      if( data.RetCode === "1"){
        message.success("会议通知发送成功！");
      }else {
        message.error("会议通知发送失败！");
      }
    },
    //确认未上会会议已开
    *confirmMeeting({ record },{select,put,call}){
      let postData = {
        arg_note_id : record.note_id,
        arg_user_id : Cookie.get( "userid"),
        arg_user_name : Cookie.get("username"),
      };
      let data = yield call (Services.confirmMeeting,postData);
      if( data.RetCode === "1"){
        message.success("会后确认成功！");
        yield put ({ type : "queryMeetings"}) //重新查询会议列表
      }else {
        message.error("会后确认失败！");
      }
    },
    //已上会会议列表查询
    *queryDoneMeetings ({},{ select,put,call }){
      const { doneParam,page,pageSize } = yield select (state=>state.meetingConfirm);
      let postData = {
        arg_page_size:pageSize,//每页容量
        arg_page_current:page,// 当前页
        arg_note_state: doneParam.note_state,//会议状态
        arg_type_id : doneParam.type_id,//会议类型
        arg_note_name :doneParam.note_name,//会议名称
        arg_user_id : Cookie.get("userid"),// 用户id
      };
      let data = yield call (Services.queryConfirmedMeeing,postData);
      if (data.RetCode === "1"){
        yield put({
          type:"save",
          payload : {
            doneMeetingList : data.DataRows,
            noteID : "",//切换 tab  会议id清空
            tempKey : getUuid(20,62),
            RowCounts:data.RowCount,
            currentKey:"2",
          }
        })
      }
    },
    //切换已上会会议面板  查询议题列表
    *changeCollapse({ key },{ select,put,call}){
      const { doneMeetingList } =  yield select( state => state.meetingConfirm);
      let postData = {
        arg_note_id : key,
        arg_page_size : 10,
        arg_page_current : 1,
      };
      let data = yield call(Services.queryTopicList ,postData);
      if( data.RetCode === "1" ){
        data.DataRows.length && data.DataRows.map((item,index)=>{
          item.key = index;
        });
        doneMeetingList.length && doneMeetingList.map((item,index)=>{
          item.key = index;
          if(item.note_id === key){
            item["topicList"] = JSON.parse(JSON.stringify(data.DataRows));
          }
        });
        yield put ({
          type:"save",
          payload :{
            doneMeetingList : JSON.parse(JSON.stringify(doneMeetingList)),
            noteID : key, //保存会议id
          }
        })
      }
    },
    //查询已上会议题附件列表
    *queryDoneFileList({ record },{ select,put,call }){
      console.log(record,'议题附件列表');
      const {doneMeetingList,noteID} = yield select ( state=>state.meetingConfirm);
      let postData = {
        arg_topic_id :record.topic_id , //会议题ID
        arg_submit_id:record.submit_id,// 批次id
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
        });
        yield put ({
          type : "save",
          payload :{
            doneMeetingList : JSON.parse(JSON.stringify(doneMeetingList)),
          }
        })
      }
    },
    //已上会会已下载议题材料-查询
    *issueMaterials({ record },{ select,put,call}){
      let {materialsSelection} =yield select(state=>state.meetingConfirm);
      let oSelection =[];
      let postData = {
        arg_note_id :record.note_id,
        arg_page_size : 10,
        arg_page_current : 1,
      };
      let data = yield call(Services.queryTopicList ,postData);
      for(let i=0;i<data.DataRows.length;i++){
        let upDatas = {
          arg_topic_id :data.DataRows[i].topic_id , //会议议题名称
          arg_submit_id:data.DataRows[i].submit_id,// 批次id
        };
        let dataUpload = yield call(Services.queryUpload,upDatas);
        for(let j=0;j<dataUpload.DataRows.length;j++){
          oSelection.push(dataUpload.DataRows[j]);
          //去重
          oSelection.filter((item,index,self)=>{
            item.key=index;
            return self.indexOf(item)===index;
          });
          yield put({
            type:"save",
            payload:{
              materialsSelection:oSelection
            }
          });
          // console.log(materialsSelection,11);
        }

      }
    },
    //已上会会已下载议题材料-批量下载
    *downloadMaterials({topicFileList},{select,put,call}){
      for(let i=0;i<topicFileList.length;i++){
        let url =topicFileList[i].upload_url;
        window.open(url);
      }
    },
    // 已上会会议议题退回
    *doneSendBack({record},{select,put,call}){
      let { returnRes } = yield select(state=>state.meetingConfirm);
      let postData = {
        arg_topic_id : record.topic_id,
        arg_user_id : Cookie.get("userid"),
        arg_user_name : Cookie.get("username"),
        arg_return_reason: returnRes,
      };
      let data = yield call(Services.returnTopic,postData);
      if( data.RetCode === "1"){
        message.success("议题退回成功！");
        yield put ({
          type :"queryDoneMeetings"
        });// 退回成功后走一遍查询服务  一是少了议题要刷新，二是重新刷新 会议文件内容需要同步更新
        yield put({
          type:"save",
          payload:{
            returnRes:""
          }
        })
      }else {
        message.error("议题退回失败！")
      }
    },
    //已上会会议议题取消
    *cancelTopic({record},{select,put,call}){
      let postData = {
        arg_topic_id : record.topic_id,//议题ID
        arg_user_id : Cookie.get("userid"),//用户ID
        arg_user_name : Cookie.get("username"),
      };
      let data = yield call(Services.cancelTopic,postData);
      if(data.RetCode ==="1"){
        message.success("议题取消成功！");
        yield put ({
          type :"queryDoneMeetings"
        }) // 退回成功后走一遍查询服务   一是少了议题要刷新，二是重新刷新 会议文件内容需要同步更新
      }else{
        message.error("议题取消失败！");
      }
    },
    // 补充议题，点击补充议题 保存点击的会议note_id
    *prepareQueryAddTopicList({ record },{select,put,call}){
      // let { noteID,addMeetingType } = yield select(state=>state.meetingConfirm)
      // noteID = record.note_id;
      //  addMeetingType = record.type_id;
      let postData = {
        arg_type_ou_id : Cookie.get("OUID"),
        arg_user_id : Cookie.get("userid"),
      };
      let data = yield call (Services.queryTypeSearch,postData);
      if(data.RetCode === "1"){
        yield put({
          type : "save",
          payload : {
            //noteID : noteID,
            //addMeetingType:addMeetingType,
            noteID : record.note_id,
            addMeetingType:record.type_id,
            tempKey:getUuid(20,62)
          }
        });
        if(data.DataRows[0].ifhasmeet ==="0"){
          console.log(data,112);
          yield put ({type:"queryAddTopicList"})
        }else if(data.DataRows[0].ifhasmeet==="1"){
          console.log(data,1212);
          yield put ({type:"addTopicListList"})
        }
      }
    },
    // 补充议题，查询可以补充的议题列表服务（可以生成会议通知的议题列表查询）
    *queryAddTopicList({},{select,put,call}){
      const {addTopicName,addMeetingType,pageSize,addTopicPage} = yield select(state=>state.meetingConfirm);
      console.log(addMeetingType,'addMeetingType');
      let postData = {
        arg_user_id:Cookie.get("userid"),
        //arg_topic_name :addTopicParam.meetingType, //按议题名称查询
        arg_topic_name :addTopicName,
        // arg_topic_type :addTopicParam.topicNameInput ,//按会议类型id 查询
        arg_topic_type : addMeetingType,
        arg_page_size : pageSize,
        arg_page_current :addTopicPage ,
      };
      let data = yield call(Services.queryAddTopicList,postData);
      if(data.RetCode==="1"){
        yield put({
          type : "save",
          payload : {
            addTopicList : data.DataRows,
            addTopicRowCounts :data.RowCount,
          }
        })
      }
    },
    //院长发送清单-补充会议
    *addTopicListList({},{select,put,call}){
      const {addTopicName,addMeetingType,pageSize,addTopicPage} = yield select(state=>state.meetingConfirm);
      let postData = {
        arg_topic_type : addMeetingType,
        arg_state:0,
      };
      let data = yield call(AddServices.searchMeetingList,postData);
      if(data.RetCode==="1"){
        yield put({
          type : "save",
          payload : {
            addTopicList : data.DataRows,
            addTopicRowCounts :data.RowCount,
          }
        })
      }
      },
    //补充议题弹框中勾选table
    *changeSelectTable({selectedRowKeys,selectedRows},{select,put}){
      // let { selectedTopic } = yield select( state => state.meetingConfirm);
      let tempList = [];
      selectedRows.length && selectedRows.map((item,index)=>{
        item.key=index;
        tempList.push(item.topic_id)
      });
      // selectedTopic = tempList.join(',')
      yield put ({
        type : "save",
        payload : {
          // selectedTopic : selectedTopic,
          selectedTopic : tempList.join(','),
        }
      })
    },
    //确认补充议题
    /**
     *confirmAddTopic({ },{select,put,call}){
       const { noteID, selectedTopic} = yield select ( state=>state.meetingConfirm);
       let postData = {
         arg_note_id : noteID,
         arg_topic_id : selectedTopic,
         arg_user_id :Cookie.get("userid"),
         arg_user_name :Cookie.get("username"),
       }
       let data = yield call( Services.confirmAddTopic,postData);
     },
     **/
    // 查询会议类型列表
      *queryMeetingTypeList({},{ select,put,call}){
      let postData = {
        arg_type_ou_id : Cookie.get("OUID"),
        arg_user_id : Cookie.get("userid"),
      };
      let data = yield call (Services.queryTypeSearch,postData);
      if(data.RetCode === "1"){
        data.DataRows.push({"type_name":"全部","type_id":""});
        yield put({
          type:"save",
          payload:{
            //meetingList:data.DataRows,
            meetingList:JSON.parse(JSON.stringify(data.DataRows.reverse())),
            tempKey : getUuid(20,62)
          }});
        if(data.DataRows.length ==='1'){
          message.info("暂无数据，请在会议配置页面配置相关权限！");
        }
      }
    },
    //已上会会议tab 切换会议类型保存
    *changeDoneMeetingType({key},{select,put,call}){
      let { doneParam} = yield select ( state=>state.meetingConfirm);
      doneParam.type_id = key;
      yield put({type:"save",payload:{doneParam:JSON.parse(JSON.stringify(doneParam)),page:1}});
    },
    //已上会会议切换会议状态保存
    *changeMeetingState({key},{select,put,call}){
      let { doneParam} = yield select ( state=>state.meetingConfirm);
      doneParam.note_state = key;
      yield put({type:"save",payload:{doneParam:JSON.parse(JSON.stringify(doneParam)),page:1}});
    },
    //已上会会议 查询input 框保存
    *doneInput({ value },{select,put,call}){
      let { doneParam} = yield select ( state=>state.meetingConfirm);
      doneParam.note_name = value;
      yield put({type:"save",payload:{doneParam:JSON.parse(JSON.stringify(doneParam)),page:1}});
    },
    //清空已上会会议查询条件，并查询
    *clearQueryMeetings({},{put,select}){
      let { doneParam} = yield select ( state=>state.meetingConfirm);
      doneParam.note_name = "";
        doneParam.note_state = "0";
        doneParam.type_id = "";
        yield put({
          type : "save",
          payload :{
            doneParam : JSON.parse(JSON.stringify(doneParam)),
          }
        });
      yield put ({type:"queryDoneMeetings"});
    },
    //变更补充议题查询条件数据
    *changeAddTopicParam({value},{select,put,call}){
      // let { addTopicName } = yield select(state=>state.meetingConfirm);
      yield put ({
        type:"save",
        payload:{
          addTopicName:value,
          addTopicPage:"1"
        }
      });
    },
    //清空补充议题 查询议题列表查询条件
    *clearQueryAddTopicList({},{ select,put,call}){
      // const {addTopicName,addMeetingType} = yield select( state=>state.meetingConfirm);
      yield put({
        type : "save",
        payload : {
          addTopicName : "",
        }
      });
      yield put({type:"queryAddTopicList"})
    },
    //清空补充议题
    *clearAddTopicName({},{select,put,call}){
      yield put({
        type : "save",
        payload : {
          addTopicName : "",
          addTopicPage:"1",
        }
      })
    },
    // 修改页面
    *changePage({page},{ select,put,call}){
      yield put({
        type : "save",
        payload : {page : page,}
      });
      yield put ({type:"queryDoneMeetings"})
    },
    // 修改补充议题的页面
    *changeAddTopicPage({page},{ select,put,call}){
      yield put({
        type : "save",
        payload : { addTopicPage : page,}
      });
      yield put ({type:"queryAddTopicList"})
    },
    *saveReturnRes({value},{select,put,call}){
      yield put ({
        type:"save",
        payload: {returnRes:value}
      })
    },
    //已上会会议议题-单个开启归档流程
    *beginTopicFile({record},{select,put,call}){
      //先发起邮件，在开启归档流程
      let sendData = {
        arg_topic_id : record.topic_id,
      };
      let dataFile = yield call(Services.SendEmailFile,sendData);
      //在开启归档流程
      console.log(dataFile,record.topic_file_state,'开启归档流程');
      if(dataFile.RetCode === '1'){
        let postDatas={
          arg_topic_id : record.topic_id,    //议题id
          arg_user_id : Cookie.get("userid"),//用户ID
          arg_user_name : Cookie.get("username"),//用户名称
        };
        let datas = yield call(Services.BeginTopicFile,postDatas);
        if(datas.RetCode ==="1"){
          message.success("操作成功！");
          yield put({
            type:'save',
            payload:{
               openAll:record.topic_file_state,
            }
          });
          yield put ({
            type :"queryDoneMeetings"
          }) ;// 退回成功后走一遍查询服务    会议状态有可能需要重新走服务刷新  待归档、归档中、
        }else {
          message.success("操作失败！");
        }
      }else {
        message.success("发送邮件失败！");
      }
    },
    //一键归档按钮
    *archiveClick({record},{call,select,put}){
      console.log(record);
      // const {doneMeetingList} = yield select( state=>state.meetingConfirm);
      let postData = {
        arg_note_id : record.note_id,//会议ID
        arg_user_id : Cookie.get("userid"),//用户ID
        arg_user_name :Cookie.get("username"),//用户名称
      };
      let data = yield  call(Services.TopicFile,postData);
      console.log(data,'一键归档按钮1');
      if(data.RetCode === '1'){
        message.success(data.RetVal);
        console.log(1);
        yield put ({
          type :"queryDoneMeetings"
        }) ;// 退回成功后走一遍查询服务    会议状态有可能需要重新走服务刷新  待归档、归档中、
      }else {
        message.success("发送失败！");

      }
    },
    //倒计时按钮-打开
    *configuration({record},{select, call, put}){
      yield put({
        type:'save',
        payload:{
          countdownName:record.topic_reporting_time,
          countdownIssue:record
        }
      });
    },
    //倒计时时间Input框输入
    *countdownChange({value},{select, call, put}){
      const {countdownIssue} = yield select( state=>state.meetingConfirm);
      countdownIssue.topic_reporting_time=value;
      yield put({
        type:'save',
        payload:{
          countdownName:value,
        }
      })
    },
    //倒计时确定
    *countdownOk({},{select, call, put}){
      const {countdownName, countdownIssue} = yield select( state=>state.meetingConfirm);
      let postData = {
        arg_topic_id : countdownIssue.topic_id,//议题id
        arg_topic_reporting_time :countdownIssue.topic_reporting_time,//汇报时间
      };
      let data = yield  call(Services.CountDownDeploy,postData);
      if(data.RetCode === '1'){
        message.success("倒计时配置成功！");
        yield put({
          type:'save',
          payload:{
            countdownName:countdownName,
          }
        });
      }else {
        message.success("倒计时配置失败！");
      }
    },
  },
  subscriptions : {
    setup({dispatch,history}){
      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/meetManage/meetingConfirm') {
          dispatch({type:'init',query});
        }
      });
    },
  }
}
