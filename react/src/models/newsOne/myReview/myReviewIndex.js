/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：消息首页配置
 */


import Cookie from 'js-cookie'; 
import { message } from "antd";
import * as myserver from '../../../services/newsOne/newsOneServers';
export default {
  namespace: 'myReview',
  state: {
    taskList:[],//我的待办列表数据
    completeList:[],//我的已办列表数据
    finishedList:[],//我的办结列表数据
    allCount:"",//总数
    pageCurrent:"",//第几页
    pageSize:"",//页面条数
    allCount2:"",//总数
    pageCurrent2:"",//第几页
    pageSize2:"",//页面条数
    allCount3:"",//总数
    pageCurrent3:"",//第几页
    pageSize3:"",//页面条数
    // taskId:"",

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
          type:'taskListSearch'
        })
        
    },

    //待办数据查询
   * taskListSearch({page}, {call, put}){
        let recData={
          user_id:Cookie.get('userid'),
          page_size:"10",
          page_current:page==undefined?"1":page,
          flag:"0"
        };
        const response = yield call(myserver.showTodoApprovalList, recData); 
        if(response.retCode === '1'){
          if(response.dataRows){
            const res = response.dataRows;
            yield put({
              type:'save',
              payload:{
                taskList:res.pageItems,
                allCount:res.totalCount,//总数
                pageCurrent:res.pageNo,//第几页
                pageSize:res.pageSize,//页面条数
              }
            })
          }
        }else{
          message.error(response.retVal);
        }
   },  
    //已办数据查询
    * completeListSearch({ page}, {call, put}){
      let recData={
        user_id:Cookie.get('userid'),
        page_size:"10",
        page_current:page==undefined?"1":page,
        flag:"1"
      };
      const response = yield call(myserver.showTodoApprovalList, recData);
      if(response.retCode === '1'){
        if(response.dataRows){
          const res = response.dataRows;
          yield put({
            type:'save',
            payload:{
              completeList:res.pageItems,
              allCount2:res.totalCount,//总数
              pageCurrent2:res.pageNo,//第几页
              pageSize2:res.pageSize,//页面条数
            }
          })
        }
      }else {
        message.error(response.retVal);
    }
    },
    //办结数据查询
    * finishedListSearch({ page}, {call, put}){
      let recData={
        user_id:Cookie.get('userid'),
        page_size:"10",
        page_current:page==undefined?"1":page,
        flag:"2"
      };
      const response = yield call(myserver.showTodoApprovalList, recData);
      if(response.retCode === '1'){
        if(response.dataRows){
          const res = response.dataRows;
          yield put({
            type:'save',
            payload:{
              finishedList:res.pageItems,
              allCount3:res.totalCount,//总数
              pageCurrent3:res.pageNo,//第几页
              pageSize3:res.pageSize,//页面条数
            }
          })
        }
      }else {
        message.error(response.retVal);
    }
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/myReview') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};