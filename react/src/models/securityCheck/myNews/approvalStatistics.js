
/**
 * 作者：郭银龙
 * 日期：2020-5-8
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：统计审批
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from "../../../services/securityCheck/securityChechServices2";

export default {
  namespace: 'tongjishenpibaogao',
  state: {
    taskList:[],
    examineImgId:[],
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
   
    *tongbaoyijian({query}, {call, put}){
      let taskid = query.arg_state
      let recData={
        arg_user_id:Cookie.get('userid'),
        argInfoId:taskid
      };
      const response = yield call(myserver.Notification, recData);
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
    
    },
    *tbSubmit({argOpinion, argInfoId}, {call, put}){
      let recData={
        arg_user_id:Cookie.get('userid'),
        argOpinion:argOpinion,
        argInfoId:argInfoId
      };
      const response = yield call(myserver.duitongjibaogaoshenpi, recData);
            response.retCode==1?message.info('提交成功'):message.error(response.retVal);

            if(response.retCode==1){
              yield put(routerRedux.push({
                pathname:'/adminApp/securityCheck/myNews',
                }));
            }
    },
  


  
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/securityCheck/myNews/approvalStatistics') { //此处监听的是连接的地址
          dispatch({
            type: 'tongbaoyijian',
            query
          });
        }
      });
    },
  },

};
