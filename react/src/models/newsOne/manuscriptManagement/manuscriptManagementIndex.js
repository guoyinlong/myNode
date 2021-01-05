/**
 * 作者：郭银龙
 * 日期：2020-9-28
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：稿件管理
 */ 

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from '../../../services/newsOne/newsOneServers';
export default {
  namespace: 'manuscriptManagement',
  state: {
    reportList: [ ], //统计数据列表
    allCount:"" ,//--总条数 
    pageCount:"" ,//--当前第几页
    // RowCount:"",//每页显示条数
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
  },
  effects: {
    //获取列表数据
    * reportNews({page,inputvalue1,time,inputvalue2,inputvalue3,inputvalue4}, { call, put }) {
      let recData = {
        userid: Cookie.get('userid'),
        newsName:inputvalue1?inputvalue1:"",
        createTimeParam:time?time:"",
        state:inputvalue2?inputvalue2:"",
        deptName:inputvalue3?inputvalue3:"",
        createByName:inputvalue4?inputvalue4:"",
        pageCurrent:page==undefined?"1":page,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
        RowCount:"10",//表示每页数量，必须是正整数,默认为所有
      };
      let recData2={
        flag:0,
      }
      const response = yield call(myserver.manuscriptManagement, recData);
      
      const response2 = yield call(myserver.pubAnnouncement, recData2);
      if (response.retCode === '1') {
        if (response.dataRows) {
          const res = response.dataRows;
          const res2 = response2.dataRows;
          res.map((item, index) => {
            item.key = index;
            item.type = '1';
          });
          yield put({
            type: 'save',
            payload: {
              reportList: res,
              Notice: res2,
              
            }
          })
        }
        const {allCount,pageCurrent,RowCount} = response;
          yield put({
            type: 'save',
            payload:{
              allCount:allCount,  // 数据总数
              pageCurrent:pageCurrent, //-当前第几页
              // RowCount:RowCount, //-每页显示条数
            }
          })
        

      }else{
        message.error(response.retVal);
      }

    },
  
    *delete({id}, {call, put}){
      let recData = {
        userid: Cookie.get('userid'),
        newsId:id,
      };
      const response = yield call(myserver.delNews,recData);
      if(response.retCode === '1'){
        yield put({
          type: 'reportNews',
        });
          message.success("删除成功");
      }else {
        message.error(response.retVal);
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
        if (pathname === '/adminApp/newsOne/manuscriptManagement') { //此处监听的是连接的地址
          dispatch({
            type: 'reportNews',
            query
          });
        }
      });
    },
  },
};
