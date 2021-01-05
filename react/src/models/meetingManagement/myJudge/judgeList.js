/**
 * 作者：贾茹
 * 日期：2020-2-29
 * 邮箱：m18311475903@163.com
 * 文件说明：我的审核列表页面
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as commonAppService from '../../../services/commonApp/commonAppService.js';

export default {
  namespace: 'judgeList',
  state: {
    taskList:[],//我的待办列表数据
    completeList:[],//我的已办列表数据
    finishedList:[],//我的办结列表数据
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
      yield put({
        type:'finishedListSearch'
      })
    },

    //代办数据查询
    * taskListSearch({}, {call, put}){
      let recData={
        arg_user_id:Cookie.get('userid')
      };
      const response = yield call(commonAppService.myMeetingWait, recData);
      /* console.log(response);*/
      if(response.RetCode === '1'){
        if(response.DataRows){
          const res = response.DataRows;
          res.map((item, index) => {
            item.sortDate = item.update_date.slice(0,19);
            item.key=index;
            item.type = '1';
          });
          console.log(res);
          yield put({
            type:'save',
            payload:{
              taskList:res
            }
          })
        }


      }

    },

    //已办数据查询
    * completeListSearch({}, {call, put}){
      let recData={
        arg_user_id:Cookie.get('userid')
      };
      const response = yield call(commonAppService.myMeetingDone, recData);
      /* console.log(response);*/
      if(response.RetCode === '1'){
        if(response.DataRows){
          const res = response.DataRows;
          res.map((item, index) => {
            item.sortDate = item.update_date.slice(0,19);
            item.key=index;
            item.type = '2';
          });
          /* console.log(res);*/
          yield put({
            type:'save',
            payload:{
              completeList:res
            }
          })
        }


      }

    },

    //办结数据查询
    * finishedListSearch({}, {call, put}){
      let recData={
        arg_user_id:Cookie.get('userid')
      };
      const response = yield call(commonAppService.myMeetingFinish, recData);
      /* console.log(response);*/
      if(response.RetCode === '1'){
        if(response.DataRows){
          const res = response.DataRows;
          res.map((item, index) => {
            item.sortDate = item.update_date.slice(0,19);
            item.key=index;
            item.type = '3';
          });
          /* console.log(res);*/
          yield put({
            type:'save',
            payload:{
              finishedList:res
            }
          })
        }


      }

    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/meetManage/myJudge') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
