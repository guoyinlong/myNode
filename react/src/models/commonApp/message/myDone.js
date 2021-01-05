import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import * as meetManageService from '../../../services/meetingManagement/meetManage.js';
import Cookie from 'js-cookie';
/**
 * 作者：贾茹
 * 日期：2019-7-1
 * 邮箱：m18311475903@163.com
 * 功能：办结议题详情
 */
export default {
  namespace: 'myDone',
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
    myComplete:{},
    waitDecide:"",  //待决议事项是否显示
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
      /* console.log(JSON.parse(query.value));*/
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
      const { passData } = yield select(state=>state.myDone);
      /*console.log(detailLine);*/
      const recData={
        arg_topic_id:passData.topic_id, //-- 会议议题id
        arg_state: '3',//-- 0待办，1已办，2办结
        arg_batch_id:passData.batch_id, // -- 同一人处理的批次id
        arg_user_id:Cookie.get('userid'),
      };
      const response = yield call(commonAppService.waitDetailsService,recData);
      if(response.RetCode==='1') {
        const res = response.DataRows;
        for (let i = 0; i < res.length; i++) {
          res[i].key = i;
          /*console.log(res[i]);*/
         /* if(res[i].topic_if_secret==='1'){

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
          }*/
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

          //待决议事项是否显示
          if(res[i].topic_content === ""){
            yield put({
              type:'save',
              payload:{
                waitDecide:'none'
              }
            })
          }else{
            yield put({
              type:'save',
              payload:{
                waitDecide:'block'
              }
            })
          }

          yield put({
            type:'save',
            payload:{
              myComplete:res[i]
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

      const { topicName }=yield select (state=>state.myDone);
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

      const { passData } = yield select(state=>state.myDone);
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
        if (pathname === '/myDone') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
