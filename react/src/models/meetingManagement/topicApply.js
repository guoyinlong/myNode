/**
 * 作者：贾茹
 * 日期：2019-5-24
 * 邮箱：m18311475903@163.com
 * 文件说明：议题申请
 */

import * as meetManageService from '../../services/meetingManagement/meetManage.js';
import Cookie from 'js-cookie';
import * as Services from "../../services/meetingManagement/meetingManageSer";
import { message } from 'antd';

export default {
  namespace: 'topicApply',
  state: {
    list: [],
    loading: false,
    meetingTypes: [],        //会议类型下拉选项
    meetingTypeId: '全部',     //会议类型id
    meetingStates: [],       //会议状态下拉选项
    meetingStateId:'全部',     //会议状态id
    topicName:'',            //议题名称input框
    pageCurrent:'1' ,        //当前页码
    pageDataCount:'',       //共有多少条数据
    tableDataSource: [],    //议题列表表格数据
    tableSetData:[],
    tableLineDetail:[],     //议题列表点击详情之后这一行的数据
    materialDetailDisplay:'', //详情中上会材料是否显示
    tableMaterialDetailDisplay:'',//上会材料是否显示
    detailLine:{},            //一行的议题详情
    judgeTableSource:[],      //审批环节table数据
    writeMinute:'',         //预计汇报时间
    discussDisplay:'',      //前置原因是否显示'
    resonDisplay:'',       //三重一大的原因
    flagType : "",
    topicDetailName:"" ,  //详情保存议题名称
    pageSize:10,
    topicID:'',
    submitID:'',
    proclamationDesc:'',//公告内容
    reasonImportant:''
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({}, {call, put}) {
          yield put({
            type:'meetingTypeSearch',
          });
          yield put({
            type:'searchState',
          });



    },

    //未审核议题撤回
    * regretTopic({value},{select, call, put}){
      console.log(value)
      const recData = {
        arg_topic_id: value.topic_id,// 议题id |
      arg_user_id: Cookie.get('userid'),//|VARCHAR(10)|是|用户id
      arg_user_name: Cookie.get('username'),//|VARCHAR(10)|是|用户名称
      arg_topic_check_state:value.topic_check_state//|VARCHAR(1)|是|申请信息状态码
      };
      const response = yield call(meetManageService.regretTopic,recData);
      if(response.RetCode==='1'){
        message.info('该议题已撤回');
        yield put({
          type:'topicListSearch',
        });
      }
    },

    //会议类型下拉框选项查询
    * meetingTypeSearch({},{select, call, put}){
        const recData = {
          arg_type_ou_id: Cookie.get('OUID'),
        };
        /*console.log(recData);*/
        const response = yield call(meetManageService.meetingTypeSearch,recData);
        /*console.log(response);*/
        if(response.RetCode === '1'){
          const res = response.DataRows;
          /*console.log(res);*/
          let all ={type_name:'全部',type_id:'7'};
          res.unshift(all);
        /*  console.log(res);*/
          for (let i = 0, j = res.length; i < j; i++) {
            /* console.log(OUs[i]);*/
            res[i].key = res[i].type_id;
          }
          yield put({
            type: 'save',
            payload: {
              // 把数据通过save函数存入state
              meetingTypes: res,
            },

          });
          yield put({
            type:'topicListSearch',
          })


        };
    },

    //状态下拉框选项查询
    * searchState({},{select, call, put}){
       const response = yield call(meetManageService.stateSearch);
       if(response.RetCode === '1'){

         const res = response.DataRows;
        /* console.log(res);*/
         let all ={topic_type_name:'全部',topic_type_id:'7'};
         res.unshift(all);
         /*console.log(res);*/
         for (let i = 0, j = res.length; i < j; i++) {
           res[i].key = res[i].topic_type_id;
         }
         yield put({
           type:'save',
           payload:{
             meetingStates:res
           },
         });

       }
      yield put({
        type:'topicListSearch',
      });
    },

    //状态下拉框选中
    * handleMeetingStateChange({value},{select, call, put}){
    /*   console.log(value);*/
         yield put({
           type:'save',
           payload:{
             meetingStateId:value,
           }
         })


    },

    //点击会议类型选中显示
    * handleMeetingTypeChange({value},{select, call, put}){

        yield put({
          type:'save',
          payload:{
            meetingTypeId:value,
          }
        })


    },

    //获取议题名称
    * handleTopicNameChange({value},{select, call, put}){
        yield put({
          type:'save',
          payload:{
            topicName:value,
          }
        })
    },

    * pretopicListSearch({},{put}){
      yield put({
        type:'save',
        payload:{
          pageCurrent:'1' ,        //当前页码
        }
      })
      yield put({
        type:'topicListSearch'
      })
    },

    //根据会议类型  状态显示所有的议题
    * topicListSearch({},{select, call, put}){
        const { meetingTypeId,meetingStateId,topicName,tableSetData,pageCurrent,pageSize }=yield select(state=>state.topicApply);
        /*console.log(meetingTypeId,meetingStateId)*/
        let meeting = "";
        if(meetingTypeId ==='7'||meetingTypeId ==='全部'){
          meeting = ""
        }else{
          meeting = meetingTypeId
        }
       /* console.log(meeting);*/
      let state = "";
      if(meetingStateId==='7'||meetingStateId==='全部'){
        state = ""
      }else{
        state = meetingStateId
      }
     /* console.log(state);*/
        const recData = {
          arg_user_id: Cookie.get('userid'),
          arg_topic_type:meeting,
          arg_topic_type_id:state,
          arg_topic_name:topicName,
          arg_page_size:pageSize,
          arg_page_current:pageCurrent.toString(),
        };
        const response = yield call(meetManageService.topicList,recData);
        if (response.RetCode === '1') {
          const res = response.DataRows;
         /* console.log(res);*/
          for (let i = 0, j = res.length; i < j; i++) {
            /* console.log(OUs[i]);*/
            res[i].key = res[i].topic_id;
            /*console.log(res[i].button);*/
          /*  console.log(res[i].button.split(','));*/
            tableSetData.push(res[i].button.split(','));
          }
          /*console.log(tableSetData);*/
          yield put({
            type: 'save',
            payload: {
              // 把数据通过save函数存入state
              tableDataSource: res,
              pageDataCount: response.RowCount,

            },

          });
        }

    },

    // 选择页面
    * handlePageChange({ page }, { call, put }) {
        yield put({
          type: "save",
          payload: {
            pageCurrent: page
          }
        });
        yield put({
          type:'topicListSearch'
        })
    },

    //点击详情按钮获取议题详情
    * getTopicDetails({recordValue,flag}, { call, put }){
        /*console.log(recordValue);*/
        yield put({
          type:'save',
          payload:{
            detailLine:recordValue,
            flagType : flag,
          },
        });
        const recData={
          arg_topic_id:recordValue.topic_id,
          arg_state:recordValue.list_state ? recordValue.list_state : '4',//|VARCHAR(2)|0待办，1已办，2办结|
          arg_batch_id:recordValue.batch_id ? recordValue.batch_id : '',//|VARCHAR(32)|同一人处理的批次id|
          arg_user_id:Cookie.get('userid'),// |VARCHAR(32)|  用户id|
        };
        const response = yield call(meetManageService.topicDetails,recData);
        if(response.RetCode ==='1'){
          /*console.log(response);*/
          const res=response.DataRows;
        /*  console.log(res);*/
          for (let i = 0, j = res.length; i < j; i++) {
           /*  console.log(res[i]);*/
            res[i].key = i;
            yield put ({
              type:'save',
              payload:{
                topicDetailName:res[i].topic_name,
                topicID:res[i].topic_id,
                submitID:res[i].submit_id,
                writeMinute:res[i].topic_reporting_time,
                reasonImportant:res[i].topic_if_important
              }
            });
            if(res[i].topic_content===''){
              yield put({
                type:'save',
                payload:{
                  topicContent:'none'
                }
              })
            }else{
              yield put({
                type:'save',
                payload:{
                  topicContent:'block'
                }
              })
            }
            if(res[i].topic_if_important==='1'){
                yield put({
                  type:'save',
                  payload:{
                    resonDisplay:'block'
                  }
                })
            }else{
              yield put({
                type:'save',
                payload:{
                  resonDisplay:'none'
                }
              })
            }
            if(res[i].topic_if_study==='1'){
              yield put({
                type:'save',
                payload:{
                  discussDisplay:'block'
                }
              })
            }else{
              yield put({
                type:'save',
                payload:{
                  discussDisplay:'none'
                }
              })
            }
            if(res[i].topic_if_secret==='0'){
              yield put ({
                type:'save',
                payload:{
                  materialDetailDisplay:'none',
                  tableMaterialDetailDisplay:'block',
                }
              })
            }else{
              yield put ({
                type:'save',
                payload:{
                  materialDetailDisplay:'block',
                  tableMaterialDetailDisplay:'none'
                }
              })
            }

          };
          yield put ({
            type:'save',
            payload:{
              tableLineDetail:res
            }
          })


        }
        yield put({
          type:'judgeMoment',
        });
        yield put({
          type:'searchUploadFile'
        })

    },

    //附件查询
    * searchUploadFile({},{call, select, put}){
        const { topicID,submitID }=yield select (state=>state.topicApply);
        const recData={
          arg_topic_id:topicID,// VARCHAR(32), -- 议题id
          arg_submit_id:submitID,// VARCHAR(32) -- 批次id
        };
        const response = yield call(meetManageService.searchFileUpload,recData);
        if(response.RetCode ==='1'){
          const res = response.DataRows;
          /*  console.log(res);*/
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



    //点击清空查询条件
    * deleteClear({}, { call, put, select }){
        yield put({
          type: 'save',
          payload: {
            // 把数据通过save函数存入state
          /*  meetingType: '',*/
            meetingTypeId:'全部',
            meetingStateId: '全部',
            topicName:'',

          },

        });
    },

    //议题修改
   * releaseTopicContent({value}, { call, put, select }){
      /* console.log(value);*/
       const recData = {
         arg_topic_id:value.topic_id,// 议题id |
          arg_topic_dept_id:value.topic_dept_id,// 议题汇报部门id |
          arg_topic_user_id:value.topic_user_id,//议题汇报人员id |
          arg_topic_user_name:value.topic_user_name,// 议题汇报人员名称 |
         arg_topic_name:value.topic_name,// 议题名称 |
         arg_topic_type:value.type_name,//议题类型 |
         arg_topic_reporting_time:value.topic_reporting_time,//议题时长 |
          arg_topic_check_state:value.topic_next_check_state,// 议题状态id |
          arg_topic_check_state_desc:value.topic_next_check_state_desc,//议题状态描述 |
          arg_topic_if_important:value.topic_if_important,//议题是否是三重一大 |
          arg_topic_important_reason:value.topic_important_reason,//三重一大的原因|
          arg_topic_if_study:value.topic_if_study, //是否是前置议题 或者 是否需要,前置研究
          arg_topic_study_id:value.topic_study_id, //是前置议题的原因 或者 前置议题的关联议题id
         arg_topic_other_dept_id:value.topic_other_dept_id ,//-- 参会部门
         arg_topic_if_opinions:value.topic_if_opinions,//-- 是否征求相关部门意见
         arg_topic_content:value.topic_content, //-- 待决议事项
         arg_create_user_id:value.create_user_id, //-- 创建人id
        arg_create_user_name:value.create_user_name, //-- 创建人名称
         arg_create_date:value.create_date,// -- 创建时间
      };
     /*console.log(recData);*/
     const response = yield call(meetManageService.resetTopic,recData);
     if(response.RetCode==='1'){
       const res = response.DataRows||[];
       console.log(res);
     }
   },

    //点击删除议题服务
   * deleteTopic({value}, { call, put, select }){
        const recData = {
          arg_topic_id: value.topic_id,// 议题id |
        };
        const response = yield call(meetManageService. deleteTopic,recData);
        if(response.RetCode==='1'){
          yield put({
            type:'topicListSearch',
          });
        }
    },

    //点击终止议题服务
   * stopTopic({value}, { call, put}){
     /*  console.log(value);*/
       const recData = {
         arg_topic_id: value.topic_id,// 议题id |
         arg_topic_check_state:value.topic_check_state,//议题状态id
         arg_topic_check_state_desc:value.topic_check_state_desc,//议题状态描述
         arg_update_user_id:value.create_user_id, //修改人id
         arg_update_user_name: value.create_user_name//修改人名称
       };
       const response = yield call(meetManageService.endTopic,recData);
       if(response.RetCode==='1'){
         yield put({
           type:'topicListSearch',
         });
       }

   },

    //列表处点击提交按钮
    * listSubmit({value}, { call, put}){
      /*console.log(value);*/
      const recData = {
        arg_topic_id: value.topic_id,// 议题id |
      };
      const response = yield call(meetManageService.listSubmit,recData);
      if(response.RetCode==='1'){
        yield put({
          type:'topicListSearch',
        });
      }

    },

    //审批环节调取服务
   * judgeMoment({}, { call, put, select }){

      const { detailLine } = yield select(state=>state.topicApply);
      /*console.log(detailLine);*/
       const recData={
         arg_topic_id:detailLine.topic_id
       };
       const response = yield call(meetManageService.judgeMoment,recData);
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
         /*console.log(res);*/
       };

     },

    //点击下载议题申请单
   * downPage({value}, {}){
       /*console.log(detailLine);*/
       window.open("/microservice/allmanagementofmeetings/ExportTopicWord/ExportTopicWord?topicid="+value.topic_id);
     },

    //详情页面点击下载申请单
    * downPaper({}, { select }){
          const {tableLineDetail} = yield select (state =>state.topicApply)
          /*console.log(tableLineDetail);*/
          let id = "";
          for(let i =0;i<tableLineDetail.length; i++){
            id = tableLineDetail[i].topic_id;
          }
          window.open("/microservice/allmanagementofmeetings/ExportTopicWord/ExportTopicWord?topicid="+id);
      },
    //公告内容
    *proclamation({},{call, select, put}){
      let postDatas = {
        arg_proclamation_ouid : Cookie.get('OUID'),
      };
      let datas = yield call(Services.bulletinoChange, postDatas);
      if ( datas.RetCode === '1'){
        if(datas.DataRows){
          yield put({
            type : "save",
            payload : {
              proclamationDesc :JSON.parse(JSON.stringify(datas.DataRows.slice(-1)[0].meetings_proclamation_desc))
            }
          });
        }

      }
    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/meetManage/topicApply') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
          dispatch({type: 'proclamation',query});//公告内容
        }else if(pathname === '/adminApp/meetManage/topicApply/topicDetails'){
          dispatch({
            type: 'getTopicDetails',
            recordValue:JSON.parse(query.recordValue),
            flag:query.flag
          });
        }
      });
      dispatch({type: 'proclamation',query});//公告内容
    },
  },
};
