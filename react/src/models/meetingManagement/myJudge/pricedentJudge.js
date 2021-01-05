import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import * as meetManageService from '../../../services/meetingManagement/meetManage.js';
import Cookie from 'js-cookie';
import { message } from 'antd';
import {routerRedux} from "dva/router";
/**
 * 作者：贾茹
 * 日期：2020-3-5
 * 邮箱：m18311475903@163.com
 * 功能：院长审核审核页面
 */
export default {
  namespace: 'pricedentJudge',
  state: {
    listData:[{key:1,name:'名称1',age:'申请单位1'},{key:2,name:'名称2',age:'申请单位2'}],
    pageSize:10,
    pageCurrent:'1' ,        //当前页码
    pageDataCount:'',       //共有多少条数据
    selectedRowKeys:[]
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
        type:'meetingName'
      });
      yield put({
        type:'listSearch'
      });
      /* console.log(JSON.parse(query.value));*/
    },


    //会议名称查询
    *  meetingName({},{call, select, put}){
        const { passData,} = yield select(state=>state.pricedentJudge);
        console.log(passData.list_related_id);
        //获取当前年份list_related_id
        const date = new Date();
        const year = date.getFullYear();

        const recData={
            arg_type_id :passData.list_related_id,// | VARCHAR(32) |是 | 会议类型ID |
            arg_note_year:year.toString(), //| VARCHAR(4) | 是 | 会议举行年 |
        };
        const response = yield call(commonAppService.meetingName,recData);
        if(response.RetCode==='1') {
        const res = response.DataRows;
        for (let i = 0; i < res.length; i++) {
          res[i].key = i;
          yield put({
            type: "save",
            payload: {
              meetingName: "第"+res[i].meeting_order+"次"+res[i].typrname+"拟上会会议议题清单"
            }
          });

        }

      }
    },

    //议题清单查询
    * listSearch({},{call, select, put}){
      const { passData,pageSize,pageCurrent, } = yield select(state=>state.pricedentJudge);
      const recData={
          arg_topic_type:passData.list_related_id,// | VARCHAR(32) |是 | 会议类型ID |
          arg_state:'1',//1为拟上会清单界面0通过界面|
          arg_page_size:pageSize,// | INT(11) | 否 | 每页展示数量 |（可以不传）
	        arg_page_current:pageCurrent.toString(),// | INT(11) | 否 | 当前页码 |（可以不传）
      };
      const response = yield call(commonAppService.listSearch,recData);
      if(response.RetCode==='1') {
        const res = response.DataRows;
        let a =[];
        for (let i = 0; i < res.length; i++) {
          res[i].key = res[i].topic_id;
          a.push(res[i].topic_id);
        }
        //console.log(a);
        yield put({
          type: "save",
          payload: {
            listData: res,
            selectedRowKeys:a
          }
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
        type:'listSearch'
      })
    },

    //保存选中的议题


    //点击同意通过审核
    * handleAgreen({record}, { call, put, select }){

     const { listData,passData, } =yield select (state => state.pricedentJudge);
      console.log(record);
     // console.log(listData);
      let ids = [];
      let cancalId = [];
      for(let m = 0;m<listData.length;m++){
        ids.push(listData[m].topic_id);
      }
       /* for(let i = 0;i<record.length;i++){
          cancalId = ids.filter(v=>v===record[i])
        }*/
      cancalId = ids.filter(function(item){
        return record.indexOf(item) === -1
      });
      //console.log(cancalId)
      //console.log(record,cancalId);
  
      const recData={
          arg_topic_id:record.toString(), // | VARCHAR(32) | 是 | 通过议题ID |
          arg_topic2_id:cancalId.toString(), // | VARCHAR(32) | 是 | 取消议题ID |
          arg_topic_type:passData.list_related_id,//| VARCHAR(32)|是| 会议类型
          arg_user_id:Cookie.get('userid'),//| VARCHAR(10)|是| 用户ID|
          arg_user_name:Cookie.get('username')//| VARCHAR(10)|是| 用户名称|

      };
      const response = yield call(commonAppService.pricedentAgreen,recData);
      if(response.RetCode==='1'){
        message.info('审核通过')
        yield put(routerRedux.push({
          pathname: '/adminApp/meetManage/myJudge'
        }))

      }

    },

    //发送通知
   /* * sendMessage({},{call, select,put}){

      const { waitMeetingDetails } =yield select (state => state.pricedentJudge);
      const recData = {
        arg_topic_id:waitMeetingDetails.topic_id
      };
      const response = yield call(meetManageService.sendMessage, recData);
      if (response.RetCode === '1') {
        message.info('已发送审核通知');

      }else{
        message.info('发送审核通知失败');
      }
    },*/


  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/meetManage/myJudge/pricedentJudge') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
