/**
 * 作者：郭银龙
 * 日期：2020-4-29
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：督查建议反馈
 */
 
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from "../../../services/securityCheck/securityChechServices2";

export default {
  namespace: 'duchajianyifankui',
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
  //   * init({}, {put}) {
  //     yield put({
  //       type:'duchafankui'
  //     })
    
  // },
  *duchafankui({query}, {call, put}){
    // console.log(query)
     let argNotificationId=query.argNotificationId
      let recData={
        arg_user_id:Cookie.get('userid'),
        argNotificationId:argNotificationId

      };
    const response = yield call(myserver.Jianchafankui, recData);
        // console.log(response,1230000);
        if(response.retCode === '1'){
          if(response.dataRows){
            const res = response.dataRows;
            // console.log(res);
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
          message.error(response.retVal);
      }
  },
 
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/securityCheck/Notification/lnspectionRecommendations') { //此处监听的是连接的地址
          dispatch({
            type: 'duchafankui',
            query
          });
        }
      });
    },
  },
};
