import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import * as meetManageService from '../../../services/meetingManagement/meetManage.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
/**
 * 作者：贾茹
 * 日期：2019-7-3
 * 邮箱：m18311475903@163.com
 * 功能：申请人补充资料
 */
export default {
  namespace: 'addFile',
  state: {
    list: [],
    waitMeetingDetails:[],    //详情页面显示的数据
    topicName:'',             //议题名称
    judgeTableSource:[],      //审批环节table数据
    passData:[],              //上个页面穿过来的数据
    materialDetailDisplay: 'none',  //上会材料泄密说明显示
    tableMaterialDetailDisplay:'',
    visible:false,
    returnReason:'',
    tableUploadFile:[],
    meetingName:'',               //会议名称
    noUpdate:false,         //无更改按钮置灰
    meetingRadioValue:'',  //上会材料是否涉密
    secretReason:'',      //泄密说明
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
      if(JSON.parse(query.value).topic_if_secret==="1"){
        yield put({
          type:'save',
          payload:{
            materialDetailDisplay:'block',
            tableMaterialDetailDisplay:'none'
          }
        });

      }else{
        yield put({
          type:'save',
          payload:{
            materialDetailDisplay:'none',
            tableMaterialDetailDisplay:'block'
          }
        });
      }
      yield put({
        type:'save',
        payload:{
          passData:JSON.parse(query.value),
          topicName:JSON.parse(query.value).topic_name,
          meetingRadioValue:JSON.parse(query.value).topic_if_secret,
          secretReason:JSON.parse(query.value).topic_secret_reason
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
      const { passData } = yield select(state=>state.addFile);
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
                meetingRadioValue:res[i].topic_if_secret,
                materialDetailDisplay: 'block',
                tableMaterialDetailDisplay :'none',
              }
            })
          }else{
            yield put({
              type:'save',
              payload:{
                meetingRadioValue:res[i].topic_if_secret,
                materialDetailDisplay: 'none',
                tableMaterialDetailDisplay:'block',
              }
            })
          }
          yield put({
            type:'save',
            payload:{
              topicId:res[i].topic_id,
              waitMeetingDetails:res[i]
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

    //点击无更改服务
     * noReset({},{call, select,put}){
       const { passData } = yield select (state=>state.addFile);
      /* console.log(passData);*/
       const recData = {
         arg_list_related_id:passData.topic_id,
         arg_submit_id:passData.submit_id,
         arg_create_user_id:Cookie.get('userid'),
         arg_create_user_name:Cookie.get('username'),
       }
       const response = yield call(commonAppService.noReset,recData);
       if(response.RetCode==='1'){
         message.info('提交成功');
         yield put(routerRedux.push({
           pathname: 'taskList'
         }));
       }
     },

    //查询会议名称
    * getMeetingName({},{call, select, put}){
        const { waitMeetingDetails }=yield select (state=>state.addFile);
        /*console.log(waitMeetingDetails,waitMeetingDetails);*/
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
        const { topicName }=yield select (state=>state.addFile);
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
          yield put({
            type:'save',
            payload:{
              noUpdate:'true'
            }
          });
        }
        yield put({
          type:'searchUploadFile'
        })

    },

    //附件查询
    * searchUploadFile({},{call, select, put}){

      const { topicName }=yield select (state=>state.addFile);
      const recData={
        arg_upload_topic_name:topicName//会议议题名称
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

      const { passData } = yield select(state=>state.addFile);
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


    //modal点击取消时
    * handleModalCancel({}, { call, put}){
      yield put({
        type:'save',
        payload:{
          visible:false
        }
      })
    },

    //退审核回服务
    * returnService({}, { call, put, select }){
      const { returnReason,waitMeetingDetails } = yield select (state=>state.addFile);
      /* console.log(returnReason);*/
      const recData={
        arg_return_reason:returnReason,//| VARCHAR(500)|是| 退回原因|
        arg_list_related_id:waitMeetingDetails.topic_id,//| VARCHAR(100)|是| 关联议题id|
        arg_submit_id:waitMeetingDetails.submit_id,//| VARCHAR(32)|是| 提交批次id|
        arg_create_user_id:Cookie.get('userid'),//| VARCHAR(10)|是| 创建人id|
        arg_create_user_name:Cookie.get('username'),//| VARCHAR(10)|是| 创建人姓名|
      }
      const response = yield call(commonAppService.judgeReturn,recData);
      if(response.RetCode==='1'){
        message.info('申请将退回至申请人');


      }
    },

    //上会材料泄密原因说明
    * handleMeetingChange({value},{ put }){
      /* console.log(value);*/
        yield put({
          type:'save',
          payload:{
            secretReason:value,
          }
        })
    },

    //是否泄密
    * isSecret({value}, { call, put}){
        if(value==='1'){
          yield put({
            type:'save',
            payload:{
              noUpdate:'true',
              materialDetailDisplay:'block',
              tableMaterialDetailDisplay:'none'
            }
          });

        }else{
          yield put({
            type:'save',
            payload:{
              noUpdate:'true',
              materialDetailDisplay:'none',
              tableMaterialDetailDisplay:'block',
              secretReason:''
            }
          });
        }
        yield put({
          type:'save',
          payload:{
            meetingRadioValue:value
          }
        });
    },

    //附件删除
    * deleteUpload({record},{call, select, put}){
      /*console.log(record);*/
      const recData={
        arg_upload_id:record.upload_id,//上传材料id
      };
      const response = yield call(meetManageService.deleteUpload,recData);
      if(response.RetVal==='1'){
        message.info('删除成功');
      }
      yield put({
        type:'searchUploadFile'
      })

    },

    //点击提交
    * submissionTopic({},{call, select, put}){
        const { waitMeetingDetails,meetingRadioValue,secretReason }=yield select (state=>state.addFile);
        /*console.log(meetingRadioValue);*/
        const recData={
          arg_topic_id:waitMeetingDetails.topic_id,
          arg_submit_id:waitMeetingDetails.submit_id,
          arg_user_id:Cookie.get('userid'),
          arg_user_name:Cookie.get('username'),
          arg_topic_if_secret:meetingRadioValue,
          arg_topic_secret_reason:secretReason

        };
      const response = yield call(commonAppService.fileSubmit,recData);
      if(response.RetCode==='1') {
        message.info('提交成功');
        yield put({
          type:'sendMessage'
        })
        yield put(routerRedux.push({
          pathname: 'taskList'
        }));
      }
    },

    //发送通知
    * sendMessage({},{call, select,}){
      const {topicId} =  yield select (state=>state.addFile);
      const recData = {
        arg_topic_id:topicId
      };
      const response = yield call(meetManageService.sendMessage, recData);
      if (response.RetCode === '1') {
        message.info('已发送审核通知');
      }else{
        message.info('发送审核通知失败');
      }
    },

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
        if (pathname === '/addFile') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
