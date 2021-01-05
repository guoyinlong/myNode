/**
 * 作者：贾茹
 * 日期：2019-9-9
 * 邮箱：m18311475903@163.com
 * 文件说明：我的审核列表页面
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as sealApplyService from '../../../services/sealManage/sealApply.js';

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
        const response = yield call(sealApplyService.taskList, recData);
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
      const response = yield call(sealApplyService.completeList, recData);
      /* console.log(response);*/
      if(response.RetCode === '1'){
        if(response.DataRows){
          const res = response.DataRows;
          res.map((item, index) => {
            item.sortDate = item.update_date.slice(0,19);
            item.key=index;
            item.type = '1';
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
      const response = yield call(sealApplyService.finishedList, recData);
      /* console.log(response);*/
      if(response.RetCode === '1'){
        if(response.DataRows){
          const res = response.DataRows;
          res.map((item, index) => {
            item.sortDate = item.update_date.slice(0,19);
            item.key=index;
            item.type = '1';
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
        if (pathname === '/adminApp/sealManage/myJudge'||pathname === '/adminApp/sealManage/myComplete') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
