
/**
 * 作者：郭银龙
 * 日期：2020-5-8
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：统计通报
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from "../../../services/securityCheck/securityChechServices2";

export default {
  namespace: 'tongjitomgbao',
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
   
    *tjbaogao({query}, {call, put}){
      console.log(query)
      let argNotificationId=query.argNotificationId
      let recData={
        arg_user_id:Cookie.get('userid'),
        argNotificationId:argNotificationId
      };
      const response = yield call(myserver.fenyuanshangbao, recData);
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
    
    }
    ,

  


  
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/securityCheck/Notification/statisticalBulletin') { //此处监听的是连接的地址
          dispatch({
            type: 'tjbaogao',
            query
          });
        }
      });
    },
  },

};
