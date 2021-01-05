
/**
 * 作者：郭银龙
 * 日期：2020-5-8
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：分院统计报告上报页面
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from "../../../services/securityCheck/securityChechServices2";

export default {
  namespace: 'fenyuanshanghbaojianchaqingkuang',
  state: {
    taskList:[],
    examineImgId: [], // 上传图片参数
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
   
    *lingdaoshenpi({query}, {call, put}){ 
      let argNotificationId=query.argNotificationId
      let recData={
        arg_user_id:Cookie.get('userid'),
        argNotificationId:argNotificationId
  
      };
      const response = yield call(myserver.fenyuanshangbao, recData);
          // console.log(response,1230000);
          if(response.retCode === '1'){
            if(response.dataRows){
              const res = response.dataRows;
              yield put({
                type:'save',
                payload:{
                  taskList:res
                }
              })
            }
            const { examineImg} = response.dataRows[0];
            if(examineImg!=null&&examineImg.length>0){
               
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
        if (pathname === '/adminApp/securityCheck/Notification/branchStatisticsReport') { //此处监听的是连接的地址
          dispatch({
            type: 'lingdaoshenpi',
            query
          });
        }
      });
    },
  },

};
