/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：消息首页配置
 */


import Cookie from 'js-cookie'; 
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from '../../../services/securityCheck/securityChechServices2';

export default {
  namespace: 'myNews',
  state: {
    taskList:[
    ],//我的待办列表数据
    completeList:[
    ],//我的已办列表数据
    // finishedList:[],//我的办结列表数据
    arg_state:"",
    arg_page_size:"",
    arg_page_current:"",
    arg_page_size2:"",
    arg_page_current2:"",
    allCount:"",
    allCount2:""

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
        yield put({
          type:'completeListSearch'
        })
      
    },

    //代办数据查询
   * taskListSearch({page}, {call, put}){
        let recData={
          arg_user_id:Cookie.get('userid'),
          arg_state:0,
          arg_page_size:10,
          arg_page_current:page==undefined?1:page,
        };
        const response = yield call(myserver.myNews, recData); 
      // console.log(response,123);
        if(response.retCode === '1'){
         
          if(response.dataRows){
            const res = response.dataRows;
            res.map((item,index)=>{
             
              item.key=index;
              // console.log(arr,"iiiii")
            })
            // console.log(res,"0000000");
            yield put({
              type:'save',
              payload:{
                taskList:res
              }
            })
          }


        }else{
          message.error(response.retVal);
        }
        const {allCount,pageCount,pageCurrent,rowCount} =response
        yield put({
          type:'save',
          payload:{
            allCount:allCount,//总数
            pageCount:pageCount,
            arg_page_current:pageCurrent,//第几页
            arg_page_size:rowCount,//页面条数
          }
        })

   },  

    //已办数据查询
    * completeListSearch({ page}, {call, put}){
      let recData={
        arg_user_id:Cookie.get('userid'),
        arg_state:1,
        arg_page_size:10,
        arg_page_current:page==undefined?1:page,
      };
      const response = yield call(myserver.myNews, recData);
      if(response.retCode === '1'){
        if(response.dataRows){
          const res = response.dataRows;
          res.map((item,index)=>{
            item.key=index;
          })
          yield put({
            type:'save',
            payload:{
              completeList:res
            }
          })
        }
        const {allCount,pageCount,pageCurrent,rowCount} =response
        yield put({
          type:'save',
          payload:{
            allCount2:allCount,//总数
            pageCount2:pageCount,
            arg_page_current2:pageCurrent,//第几页
            arg_page_size2:rowCount,//页面条数
          }
        })

      }else {
        message.error(response.retVal);
    }

    },
    

  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/securityCheck/myNews') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
