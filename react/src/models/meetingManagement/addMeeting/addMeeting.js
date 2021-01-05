/**
 * 作者： 杨青
 * 创建日期： 2019-07-10
 * 邮箱: yangq41@chinaunicom.cn
 * 功能： 会议管理-会议生成
 */
import * as Services from '../../../services/meetingManagement/addMeetingService';
import {message} from 'antd';
import Cookie from 'js-cookie';
export default {
  namespace: 'addMeeting',
  state: {
    meetingTypeList:[],
    paramData:{
      topic_id	:'',
      topic_name:'',
      topic_dept_id:''	,
      topic_if_important:'',
      topic_file_state	:'',
      arg_topic_type :'全部',
    },
    topicList:[],//议题列表
    addAble:false,  //生成会议禁止
    sendAble:false,//发送上会议题清单会议禁止
    passedAble:false,//已通过上会议题清单会议禁止
    visible:false,
    topic_id:'',
    createDate:[]
  },

  reducers: {
    initData(state) {
      return {
        ...state,
        meetingTypeList:[],
        paramData:{
          topic_id:'',
          topic_name:'',
          topic_dept_id:''	,
          topic_if_important:'',
          topic_file_state	:'',
          arg_topic_type :'全部',
        },
        topicList:[],//议题列表
        addAble:false,  //生成会议禁止
        sendAble:false,//发送上会议题清单会议禁止
        passedAble:false,//已通过上会议题清单会议禁止
        visible:false,
        topic_id:'',
        createDate:[]
      }
    },
    save(state, action) {
      return {...state, ...action.payload};
    }
  },

  effects: {
    *init({},{call,select,put}){
      const paramData = {
        arg_topic_type:'',
        arg_topic_name:'',
        arg_page_current:1,
        rowCount:'',
      };
      yield put({
        type : 'save',
        payload:{
          paramData,
        }
      });
      yield put({
        type: 'queryMeetingType'
      });
    },
    //查询会议类型
    *queryMeetingType({record},{call,select,put}){
      let {paramData} = yield select(state =>state.addMeeting);
      let postData ={
        arg_type_ou_id:Cookie.get('OUID'),
        arg_user_id:Cookie.get('userid'),
      };
      let data = yield call(Services.queryMeetingType, postData);
      // console.log(data);
      if (data.DataRows.length === 0){
        message.info('暂无数据，请在会议配置页面配置相关权限！');
        return
      }
      paramData.arg_topic_type = data.DataRows.length!==0?data.DataRows[0].type_id:'';
      if (data.RetCode === '1'){
        yield put({
          type : 'save',
          payload:{
            meetingTypeList:data.DataRows,
            paramData
          }
        });
      }else{
        message.error(data.RetVal);
      }
    },
    //查询按钮 -根据会议类型 查出议题列表
    *queryPassedMeetingTopic({},{call,select,put}) {
      let {paramData} = yield select(state => state.addMeeting);
      let postDatas ={
        arg_type_ou_id:Cookie.get('OUID'),
        arg_user_id:Cookie.get('userid'),
      };
      let dataPost = yield call(Services.queryMeetingType, postDatas);
      //议题列表
      let postData = {
        arg_topic_name: paramData.arg_topic_name,
        // arg_topic_type: paramData.arg_topic_type === '1' ? '' : paramData.arg_topic_type,
        // arg_page_current: paramData.arg_topic_name ? '1' : paramData.arg_page_current,
        arg_topic_type:paramData.arg_topic_type,
        arg_user_id: Cookie.get('userid'),
        arg_page_size: 10,
      };
      let data = yield call(Services.queryPassedMeetingTopic, postData);
      data.DataRows.map((item,index)=>{
        item.key=index;
        item.create_date= item.create_date.substring(0,19);
      });
      if(data.RetCode === '1'){
        let propRows = [];
        for(let i=0;i<dataPost.DataRows.length;i++){
          if(dataPost.DataRows[i].type_id === paramData.arg_topic_type){
            propRows.push(dataPost.DataRows[i]);
            console.log(data,propRows,11);
            if(propRows[0].ifhasmeet === "0"){
              if(data.HasMeet ==='0'&& data.RowCount !=='0'){
                // console.log(11);
                yield put({
                  type: 'save',
                  payload: {
                    addAble: true,
                    sendAble: false,
                    passedAble: false,
                    paramData,
                    topicList: data.DataRows,
                  }
                })
              }else {
                // console.log(21);
                yield put({
                  type: 'save',
                  payload: {
                    addAble: false,
                    sendAble: false,
                    passedAble: false,
                    paramData,
                    topicList: data.DataRows,
                  }
                })
              }
            }else if(propRows[0].ifhasmeet === "1") {
              // ifdraft,是否已有拟上会清单（1：存在 0 不存在）
              // draft，--是否有已通过的拟上会清单（1：有，0：没有
              if (propRows[0].draft == '1') {
                if (data.HasMeet == '0') {
                  yield put({
                    type: 'save',
                    payload: {
                      passedAble: true,//已通过的拟上会清单
                      paramData,
                      topicList: data.DataRows,
                    }
                  })
                }
              }
              if (propRows[0].ifdraft == '0') {
                if(data.DataRows.length == '0'){
                  yield put({
                    type: 'save',
                    payload: {
                      sendAble: false,//拟上会清单按钮
                      paramData,
                      topicList: data.DataRows,
                    }
                  })
                }else {
                  yield put({
                    type: 'save',
                    payload: {
                      sendAble: true,//拟上会清单按钮
                      paramData,
                      topicList: data.DataRows,
                    }
                  })
                }
              }
            }
          }
        }
      }else{
        message.error(data.RetVal);
      }
    },
    //分页
    *handlePageChange({page},{select,put}) {
      let {paramData} = yield select(state => state.addMeeting);
      paramData.arg_page_current = page;
      yield put({
        type: 'save',
        payload: {
          paramData: JSON.parse(JSON.stringify(paramData))
        }
      });
      console.log(paramData,'paramData');
      yield put({
        type: 'queryPassedMeetingTopic'
      });
    },
    //会议类型
    *setSelectShow({value},{select,put,call}){
      let {paramData} = yield select(state => state.addMeeting);
      paramData.arg_topic_type =value;
      yield put({
        type: 'save',
        payload: {
          paramData: paramData
        }
      });
    },
    //议题名称
    *setInputShow({value},{select,put,call}){
      let {paramData} = yield select(state => state.addMeeting);
      paramData.arg_topic_name =value;
      yield put({
        type: 'save',
        payload: {
          paramData: JSON.parse(JSON.stringify(paramData))
        }
      });
    },
    //清空
    *onClear({},{select,put,call}){
      yield put({
        type: 'init'
      });
    },
    //撤回按钮-确定撤回
    *changeVisible({topic_id,flag},{select,put,call}){
      if (flag === 'open'){
        yield put({
          type : 'save',
          payload:{
            visible:true,
            topic_id
          }
        });
      }else{
        yield put({
          type : 'save',
          payload:{
            visible:false,
            topic_id
          }
        });
      }
    },
    //撤回原因 -说明确定
    *returnTopicByOffice({reason},{select,put,call}){
      let {topic_id} = yield select(state => state.addMeeting);
      let postData = {
        arg_topic_id:topic_id,
        arg_user_id:Cookie.get('staff_id'),
        arg_user_name:Cookie.get('username'),
        arg_reject_reason:reason,
      };
      let data = yield call(Services.returnTopicByOffice, postData);
      if (data.RetCode === '1'){
        message.success('撤回成功！');
        yield put({
          type: 'changeVisible',
          topic_id:'',
          flag:'close',
        });
        yield put({
          type: 'queryPassedMeetingTopic'
        });
      }else{
        message.error(data.RetVal);
      }
    },
    *returnToListSearch({query},{select,call,put}){
      const paramData = {
        arg_topic_type:query.arg_topic_type,
        arg_topic_name:'',
        arg_page_current:1,
        rowCount:'',
      };
      yield put({
        type : 'save',
        payload:{
          paramData,
        }
      });
      yield put({
        type: 'queryPassedMeetingTopic'   //查询按钮
      });
    },
    //生成会议-发送会议-向院长、党委书记确认上会议题清单
    *sendMeeting({},{select, call, put}){
      let {paramData,topicList} = yield select(state => state.addMeeting);
      let orderList = [];
      topicList.sort((a,b)=>{return a.number>b.number?1:-1});
      for(let i=0;i<topicList.length;i++){
        orderList.push(topicList[i].topic_id);
      }
      let postData ={
        arg_topic_id :orderList.join(','),//议题ID
        arg_topic_type:paramData.arg_topic_type,//会议类型
        arg_user_id : Cookie.get('userid'),//用户ID
        arg_user_name : Cookie.get('username')//用户名称
      };
      let data = yield call(Services.sendTopics, postData);
      if(data.RetCode === '1'){
        window.location.reload();
        message.success('发送上会议题清单成功！');
      }else {
        message.success("发送上会议题清单失败！");
      }
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/meetManage/addMeeting') {
          // window.location.reload();
          dispatch({type: 'initData'});
          if (JSON.stringify(query) === '{}') {
            dispatch({type: 'init'});
          } else {
            dispatch({type: 'queryMeetingType'});//查询会议类型
            dispatch({type: 'returnToListSearch', query});
          }
        }
      });
    },
  },
};
