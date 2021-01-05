import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import * as meetManageService from '../../../services/meetingManagement/meetManage.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
/**
 * 作者：贾茹
 * 日期：2020-3-24
 * 邮箱：m18311475903@163.com
 * 功能：归档审批
 */
export default {
  namespace: 'dataJudge',
  state: {
    list: [],
    waitMeetingDetails:[],    //详情页面显示的数据
    topicName:'',             //议题名称
    judgeTableSource:[],      //审批环节table数据
    passData:[],              //上个页面穿过来的数据
    materialDetailDisplay : '',
    tableMaterialDetailDisplay:'',
    visible:false,
    returnReason:'',       //退回原因
    tableUploadFile:[],
    meetingName:'',               //会议名称
    topicId:"",
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({query}, {call, put}) {
      yield put({
        type:'save',
        payload:{
          passData:JSON.parse(query.value),
          topicName:JSON.parse(query.value).topic_name
        }
      });

      yield put({
        type:'waitDetails'
      });

      yield put({
        type:'judgeMoment'
      })
      /* console.log(JSON.parse(query.value));*/
    },

    //议题详情查询
    * waitDetails({},{call, select, put}){
      const { passData } = yield select(state=>state.dataJudge);
      /*console.log(detailLine);*/
      const recData={
        arg_topic_id:passData.topic_id, //-- 会议议题id
        arg_state: passData.list_state,//-- 0待办，1已办，2办结
        arg_batch_id:passData.batch_id, // -- 同一人处理的批次id
        arg_user_id:Cookie.get('userid'),
      };
      const response = yield call(commonAppService.waitDetailsService,recData);
      if(response.RetCode==='1') {
        const res = response.DataRows;
        for (let i = 0; i < res.length; i++) {
          res[i].key = i;

          /*console.log(res[i]);*/
          if(res[i].topic_if_important==='1'){
            yield put({
              type:'save',
              payload:{
                resonDisplay : 'block',
              }
            })
          }else{
            yield put({
              type:'save',
              payload:{
                resonDisplay : 'none',
              }
            })
          }
          if(res[i].topic_if_study==='1'){
            yield put({
              type:'save',
              payload:{
                discussDisplay: 'block',
              }
            })
          }else{
            yield put({
              type:'save',
              payload:{
                discussDisplay: 'none',
              }
            })
          }
          if(res[i].topic_if_secret==='1'){

            yield put({
              type:'save',
              payload:{
                materialDetailDisplay: 'block',
                tableMaterialDetailDisplay :'none',
              }
            })
          }else{
            yield put({
              type:'save',
              payload:{
                materialDetailDisplay: 'none',
                tableMaterialDetailDisplay:'block',
              }
            })
          }
          yield put({
            type:'save',
            payload:{
              waitMeetingDetails:res[i],
              topicId:res[i].topic_id
            }
          })
        }
        /* console.log(res);*/
      }
      yield put({
        type:'searchUploadFile'
      });
      yield put({
        type:'getMeetingName'
      });

    },

    //查询会议名称
    * getMeetingName({},{call, select, put}){
      const { waitMeetingDetails }=yield select (state=>state.dataJudge);
      const recData={
        arg_topic_id:waitMeetingDetails.topic_id
      };
      const response = yield call(commonAppService.getMeetingName,recData);
      if(response.RetCode==='1') {
        const res = response.DataRows;
        for (let i = 0; i < res.length; i++) {
          res[i].key = i;
          yield put({
            type:'save',
            payload:{
              meetingName:res[i].note_name
            }
          })
        }

      }
    },

    //附件上傳的服務
    * uploadFile({value},{call, select, put}){
      /*console.log(value);*/
      const { topicName }=yield select (state=>state.dataJudge);
      const recData={
        arg_upload_name:value.filename.RealFileName,   //上传材料名称 ,
        arg_upload_topic_name:topicName, //会议议题名称,
        arg_upload_url:value.filename.RelativePath,//上传相对路径,
        arg_upload_real_url:value.filename.AbsolutePath,//上传绝对路径,
        arg_create_user_id:Cookie.get('userid'),//创建人id,
        arg_create_user_name:Cookie.get('username'),//创建人姓名
      };
      const response = yield call(meetManageService.fileUpload,recData);
      if(response.RetCode ==='1'){
        message.info('上传成功');
      }
      yield put({
        type:'searchUploadFile'
      })

    },

    //附件查询
    * searchUploadFile({},{call, select, put}){

      const { waitMeetingDetails }=yield select (state=>state.dataJudge);
      const recData={
        arg_topic_id:waitMeetingDetails.topic_id,// VARCHAR(32), -- 议题id
        arg_submit_id:waitMeetingDetails.submit_id,// VARCHAR(32) -- 批次id
      };
      const response = yield call(meetManageService.searchFileUpload,recData);
      if(response.RetCode ==='1'){
        const res = response.DataRows;
        /*   console.log(res);*/
        for(let i =0;i<res.length;i++){
          res[i].key=i;
        }
        yield put({
          type:'save',
          payload:{
            tableUploadFile:res
          }
        })

      }

    },

    //审批环节调取服务
    * judgeMoment({}, { call, put, select }){

      const { passData } = yield select(state=>state.dataJudge);
      /* console.log(passData);*/
      const recData={
        arg_topic_id:passData.topic_id
      };
      const response = yield call(commonAppService.judgeMoment,recData);
      if(response.RetCode==='1'){
        const res = response.DataRows;
        for(let i = 0;i<res.length;i++){
          res[i].key=i;
        }
        yield put({
          type:'save',
          payload:{
            judgeTableSource:res
          },
        });
        /* console.log(res);*/
      };

    },

    //退审核回服务
    * returnService({}, { call, put, select }){
      const { returnReason,waitMeetingDetails } = yield select (state=>state.dataJudge);
      /*console.log(returnReason);*/
      const recData={
        arg_return_reason:returnReason,//| VARCHAR(500)|是| 退回原因|
        arg_list_related_id:waitMeetingDetails.topic_id,//| VARCHAR(100)|是| 关联议题id|
        arg_submit_id:waitMeetingDetails.submit_id,//| VARCHAR(32)|是| 提交批次id|
        arg_create_user_id:Cookie.get('userid'),//| VARCHAR(10)|是| 创建人id|
        arg_create_user_name:Cookie.get('username'),//| VARCHAR(10)|是| 创建人姓名|
      }
      const response = yield call(commonAppService.fileRefuse,recData);
      if(response.RetCode==='1'){
        message.info('申请将退回至申请人');
        yield put(routerRedux.push({
          pathname: '/adminApp/meetManage/myJudge'
        }));

      }
    },

    //点击同意通过审核
    * handleAgreen({}, { call, put, select }){

      const { waitMeetingDetails } =yield select (state => state.dataJudge);
      const recData={
        arg_list_related_id:waitMeetingDetails.topic_id,//| VARCHAR(100)|是| 关联议题id|
        arg_submit_id:waitMeetingDetails.submit_id,//| VARCHAR(32)|是| 提交批次id|
        arg_create_user_id:Cookie.get('userid'),//| VARCHAR(10)|是| 创建人id|
        arg_create_user_name:Cookie.get('username')//| VARCHAR(10)|是| 创建人姓名|
      };
      const response = yield call(commonAppService.filePass,recData);
      if(response.RetCode==='1'){
        message.info('审核通过');
        yield put(routerRedux.push({
          pathname: '/adminApp/meetManage/myJudge'
        }))

      }

    },

    /*   //发送通知
       * sendMessage({},{call, select,}){
         debugger;
         const {topicId} =  yield select (state=>state.dataJudge);
         const recData = {
           arg_topic_id:topicId
         };
         const response = yield call(meetManageService.sendMessage, recData);
         if (response.RetCode === '1') {
           message.info('已发送审核通知');
           yield put(routerRedux.push({
             pathname: '/taskList'
           }))
         }else{
           message.info('发送审核通知失败');
         }
       },*/

    //textrea文本域中的值变化时
    * returnReason({value}, { put }){
      /* console.log(value);*/
      yield put({
        type:'save',
        payload:{
          returnReason:value
        }
      })
    },

    //点击退回填写退回原因
    * handleReturn({}, { put }){
      yield put({
        type:'save',
        payload:{
          visible:true
        }
      })
    },

    //点击modal中的取消
    * handleModalCancel({},{ put }){
      yield put({
        type:'save',
        payload:{
          visible:false
        }
      })
    },

    //点击modal中的确定
    * handleModalOk({},{ put }){
      yield put({
        type:'save',
        payload:{
          visible:false
        }
      });
      yield put({
        type:'returnService'
      })
    }

  },

  subscriptions: {
    setup({
            dispatch,
            history
          }) {
      return history.listen(({
                               pathname,
                               query
                             }) => {
        if (pathname === '/adminApp/meetManage/myJudge/dataJudge') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
