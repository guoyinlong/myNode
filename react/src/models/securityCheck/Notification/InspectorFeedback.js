/**
 * 作者：郭银龙
 * 日期：2020-5-8
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：督查反馈
 */
/**
 * 作者：郭银龙
 * 日期：2020-4-29
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：员工督查反馈
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from "../../../services/securityCheck/securityChechServices2";

export default {
  namespace: 'sealComApply',
  state: {
    taskList:[],
    examineImg:[]
    
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({}, {put}) {
      yield put({
        type:'duchafankui'
      })
    
  },
  *duchafankui({}, {call, put}){
    let recData={
      arg_user_id:Cookie.get('userid')
    };
    const response = yield call(myserver.employeeInspectionFeedback, recData);
        console.log(response,1230000);
        if(response.retCode === '1'){
          if(response.dataRows){
            const res = response.dataRows;
            console.log(res);
            yield put({
              type:'save',
              payload:{
                taskList:res
              }
            })
          }
          const { examineImg} = response.dataRows[0];
          if(examineImg.length>0){
             
            yield put({
            type:'save',
            payload:{
              examineImgId: JSON.parse(examineImg), //图片
            }
          })
          }
        }else {
          message.error("查询失败'");
      }
  },





  

 

 
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/securityCheck/Notification/InspectorFeedback') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
