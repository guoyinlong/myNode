import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import * as meetManageService from '../../../services/meetingManagement/meetManage.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
import {routerRedux} from "dva/router";
/**
* 作者：贾茹
* 日期：2019-6-24
* 邮箱：m18311475903@163.com
* 功能：待办议题详情
*/
export default {
  namespace: 'waitMeetingDetails',
  state: {
    list: [],
    waitMeetingDetails:[],    //详情页面显示的数据
    topicName:'',
    judgeTableSource:[],      //审批环节table数据
    passData:[],
    materialDetailDisplay : 'none',
    tableMaterialDetailDisplay:'block',
    visible:false,
    returnReason:'',
    tableUploadFile:[],
    study:'',
    topicContent:'',
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
        const { passData } = yield select(state=>state.waitMeetingDetails);
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
            if(res[i].topic_content===''){
              yield put({
                type:'save',
                payload:{
                  topicContent : 'none',
                }
              })
            }else{
              yield put({
                type:'save',
                payload:{
                  topicContent : 'block',
                }
              })
            }
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
            if(res[i].topic_if_study==='1'&& res[i].note_type_name === '总经理办公会'){
              yield put({
                type:'save',
                payload:{
                  noStarDisplay:'none',
                  StarDisplay:'inline-block',
                  stydy:'block',
                  reletiveDiscussDisplay:'inline-block',
                  discussDisplay: 'none',

                }
              })
            }else if(res[i].topic_if_study==='0'&& res[i].note_type_name === '总经理办公会'){
              yield put({
                type:'save',
                payload:{
                  noStarDisplay:'none',
                  StarDisplay:'inline-block',
                  study:'none',
                  reletiveDiscussDisplay:'none',
                  discussDisplay: 'none',

                }
              })
            }else if(res[i].topic_if_study==='1'&& res[i].note_type_name !== '总经理办公会'){
              yield put({
                type:'save',
                payload:{
                  noStarDisplay:'inline-block',
                  StarDisplay:'none',
                  study:'block',
                  reletiveDiscussDisplay:'none',
                  discussDisplay: 'inline-block',

                }
              })
            }else{
              yield put({
                type:'save',
                payload:{
                  noStarDisplay:'inline-block',
                  StarDisplay:'none',
                  study:'none',
                  reletiveDiscussDisplay:'none',
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
                waitMeetingDetails:res[i]
              }
            })
          }
         /* console.log(res);*/
        }
        yield put({
          type:'searchUploadFile'
        });


    },

    //附件查询
    * searchUploadFile({},{call, select, put}){

      const { topicName }=yield select (state=>state.waitMeetingDetails);
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

        const { passData } = yield select(state=>state.waitMeetingDetails);
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

    //点击同意通过审核
    * handleAgreen({}, { call, put, select }){

        const { waitMeetingDetails } =yield select (state => state.waitMeetingDetails);
        const recData={
            arg_list_related_id:waitMeetingDetails.topic_id,//| VARCHAR(100)|是| 关联议题id|
            arg_submit_id:waitMeetingDetails.submit_id,//| VARCHAR(32)|是| 提交批次id|
            arg_create_user_id:Cookie.get('userid'),//| VARCHAR(10)|是| 创建人id|
            arg_create_user_name:Cookie.get('username')//| VARCHAR(10)|是| 创建人姓名|
        };
        const response = yield call(commonAppService.judgePass,recData);
        if(response.RetCode==='1'){
          message.info('审核通过')
          yield put({
            type:'sendMessage'
          });

        }

    },

    //发送通知
    * sendMessage({},{call, select,put}){

      const { waitMeetingDetails } =yield select (state => state.waitMeetingDetails);
      const recData = {
        arg_topic_id:waitMeetingDetails.topic_id
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
    },

    //点击退回填写退回原因
    * handleReturn({}, { call, put, select }){
        yield put({
          type:'save',
          payload:{
            visible:true
          }
        })
    },

    //textrea文本域中的值变化时
    * returnReason({value}, { call, put, select }){
        yield put({
          type:'save',
          payload:{
            returnReason:value
          }
        })
    },

    //modal点击取消时
    * handleModalCancel({}, { call, put, select }){
        yield put({
          type:'save',
          payload:{
            visible:false
          }
        })
    },

    //modal点击确定时
    * handleModalOk({}, { call, put, select }){
        yield put({
          type:'save',
          payload:{
            visible:false,
          }
        })
      yield put({
        type:'returnService'
      })
    },

    //退审核回服务
    * returnService({}, { call, put, select }){
        const { returnReason,waitMeetingDetails } = yield select (state=>state.waitMeetingDetails);
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
        if (pathname === '/waitMeetingDetails') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
