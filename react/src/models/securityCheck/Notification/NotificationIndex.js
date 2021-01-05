/**
 * 作者：郭银龙
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：通知通报
 */


 

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from '../../../services/securityCheck/securityChechServices2';

export default {
  namespace: 'tongzhitongbaolist',
  state: {
    rogerthatList:[ 
    ],//我的待办列表数据
    sendList:[
    ],//我的已办列表数据
    // finishedList:[],//我的办结列表数据
    // argPageCurrent:"1",
    argPageSize:"10",
    allCount:"",//收到总条数
    pageCurrent:1,//收到当前页
    sendallCount:"",//发送的总条数
    sendpageCount:"",
    sendpageCurrent:"",//发送当前页
    sendrowCount:"",
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
        type:'save',
        payload:{
          deptModal:false, //申请单位弹出框显示
        } 
      })
        yield put({
          type:'rogerthatListSearch'
        })
        yield put({
          type:'sendListSearch'
        })
        // yield put({
        //   type:'finishedListSearch'
        // })
    },

    //收到
   * rogerthatListSearch({page}, {call, put}){
    //  console.log(page)
        let recData={
          arg_user_id:Cookie.get('userid'),
          argPageCurrent:page==undefined?1:page,
          argPageSize:10,
        };
        const response = yield call(myserver.NotificationIndex, recData);
      // console.log(response.dataRows,123);
        if(response.retCode === '1'){
          if(response.dataRows){
           
            const res = response.dataRows;
            res.map((item, index) => {
           
              item.key=index;
              item.type = '1';
            });
            
            yield put({
              type:'save',
              payload:{
                rogerthatList:res
              }
            })
        
          const {allCount,pageCount,pageCurrent,rowCount} = response;
          yield put({
            type:'save',
            payload:{
              allCount:allCount,
              pageCount:pageCount,
              pageCurrent:pageCurrent,
              rowCount:rowCount,
            }
          })
            }

        }else {
          message.error(response.retVal);
      }

   },
 

    //发送
    * sendListSearch({page}, {call, put}){
      let recData={
        arg_user_id:Cookie.get('userid'),
          argPageCurrent:page==undefined?1:page,
          argPageSize:10,
      };
      const response = yield call(myserver.NotificationIndex2, recData);
    
      if(response.retCode === '1'){
        if(response.dataRows){
          const res = response.dataRows;
          res.map((item, index) => {
           
            item.key=index;
            item.type = '1';
          });
         /* console.log(res);*/
          yield put({
            type:'save',
            payload:{
                sendList:res
            }
          })

          const {allCount,pageCount,pageCurrent,rowCount} = response;
          yield put({
            type:'save',
            payload:{
              sendallCount:allCount,
              sendpageCount:pageCount,
              sendpageCurrent:pageCurrent,
              sendrowCount:rowCount,
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
        if (pathname === '/adminApp/securityCheck/Notification') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
